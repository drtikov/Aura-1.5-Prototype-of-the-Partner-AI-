
// core/hal.ts

import { GoogleGenAI } from "@google/genai";
import { AuraState, TscError, DirectoryNode, VFSNode } from '../types.ts';
import { MathJS } from './hal_mathjs.ts';
import { NumericJS } from './hal_numericjs.ts';
import { loadSdk } from './sdkLoader.ts';
import { HostBridge } from './hostBridge.ts';
import { Lean } from './hal_lean.ts';
import { Primitives } from './hal_primitives.ts';
import { Surrogate } from './hal_surrogate.ts';

declare const ts: any;
declare const THREE: any;
declare const polygonClipping: any;
declare const p5: any;

declare global {
  interface Window {
    loadPyodide: () => Promise<any>;
    fengari: any;
    BiwaScheme: any;
    loadTrealla: () => Promise<any>;
    Clingo: any;
  }
}

let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
    if (ai) return ai;
    if (process.env.API_KEY) {
        try {
            ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            return ai;
        } catch (error) {
            console.error("HAL: Failed to initialize GoogleGenAI:", error);
            throw new Error("Failed to initialize Gemini API. Check API Key.");
        }
    }
    console.error("HAL: API_KEY environment variable not set.");
    throw new Error("API_KEY environment variable not set.");
};

const DB_NAME = 'AuraMemristorDB';
const DB_VERSION = 3;
const AURA_STATE_STORE = 'AuraStateStore';
const STATE_KEY = 'AuraState';
const VFS_STORE = 'VFSStore'; 
const BLOB_STORE = 'BlobStore';
let db: IDBDatabase | null = null;

const getDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => {
            console.error("HAL.Memristor: IndexedDB error:", request.error);
            reject("IndexedDB error");
        };
        request.onsuccess = () => { db = request.result; resolve(db); };
        request.onupgradeneeded = (event) => {
            const dbInstance = request.result;
            if (!dbInstance.objectStoreNames.contains(AURA_STATE_STORE)) {
                dbInstance.createObjectStore(AURA_STATE_STORE);
            }
            if (!dbInstance.objectStoreNames.contains(VFS_STORE)) {
                dbInstance.createObjectStore(VFS_STORE);
            }
            if (!dbInstance.objectStoreNames.contains(BLOB_STORE)) {
                dbInstance.createObjectStore(BLOB_STORE);
            }
        };
    });
};

let pyodideInstance: any = null;
let treallaInstance: any = null;


export const HAL = {
    Primitives,
    MathJS,
    NumericJS,
    Lean,
    Surrogate,
    Host: HostBridge,
    Memristor: {
        loadState: async (): Promise<AuraState | null> => {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([AURA_STATE_STORE], 'readonly');
                const store = transaction.objectStore(AURA_STATE_STORE);
                const request = store.get(STATE_KEY);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        },
        saveState: async (state: AuraState): Promise<void> => {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([AURA_STATE_STORE], 'readwrite');
                const store = transaction.objectStore(AURA_STATE_STORE);
                const request = store.put(state, STATE_KEY);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },
        saveBlob: async (hash: string, content: string): Promise<void> => {
             const db = await getDB();
             return new Promise((resolve, reject) => {
                const transaction = db.transaction([BLOB_STORE], 'readwrite');
                const store = transaction.objectStore(BLOB_STORE);
                const request = store.put(content, hash);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
             });
        },
        getBlob: async (hash: string): Promise<string | null> => {
             const db = await getDB();
             return new Promise((resolve, reject) => {
                const transaction = db.transaction([BLOB_STORE], 'readonly');
                const store = transaction.objectStore(BLOB_STORE);
                const request = store.get(hash);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
             });
        },
        loadVFS: async (): Promise<Record<string, string> | null> => {
             const db = await getDB();
             return new Promise((resolve, reject) => {
                 if (!db.objectStoreNames.contains(VFS_STORE)) {
                     resolve(null);
                     return;
                 }
                 const transaction = db.transaction([VFS_STORE], 'readonly');
                 const store = transaction.objectStore(VFS_STORE);
                 const request = store.getAllKeys();
                 request.onsuccess = async () => {
                     const keys = request.result as string[];
                     if (keys.length === 0) {
                         resolve(null);
                         return;
                     }
                     const vfs: Record<string, string> = {};
                     const getAllReq = store.getAll();
                     getAllReq.onsuccess = () => {
                         const values = getAllReq.result;
                         keys.forEach((key, i) => {
                             vfs[key] = values[i];
                         });
                         resolve(vfs);
                     };
                     getAllReq.onerror = () => reject(getAllReq.error);
                 };
                 request.onerror = () => reject(request.error);
             });
        },
        clearDB: async (): Promise<void> => {
            const db = await getDB();
             const stores = [AURA_STATE_STORE, VFS_STORE, BLOB_STORE].filter(s => db.objectStoreNames.contains(s));
             if (stores.length === 0) return;
             
             return new Promise((resolve, reject) => {
                 const transaction = db.transaction(stores, 'readwrite');
                 transaction.oncomplete = () => resolve();
                 transaction.onerror = () => reject(transaction.error);
                 stores.forEach(storeName => {
                     transaction.objectStore(storeName).clear();
                 });
             });
        }
    },
    VFS: {
        computeHash: async (content: string): Promise<string> => {
             const msgUint8 = new TextEncoder().encode(content);
             const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
             const hashArray = Array.from(new Uint8Array(hashBuffer));
             return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        },
        resolve: (root: DirectoryNode, path: string): VFSNode | null => {
            const parts = path.split('/').filter(Boolean);
            let current: VFSNode = root;
            for (const part of parts) {
                if (current.type !== 'directory') return null;
                if (!current.children[part]) return null;
                current = current.children[part];
            }
            return current;
        },
        hydrate: async (flatVFS: Record<string, string>): Promise<{ tree: DirectoryNode, blobs: Record<string, string> }> => {
            const root: DirectoryNode = { type: 'directory', children: {} };
            const blobs: Record<string, string> = {};
            for (const [path, content] of Object.entries(flatVFS)) {
                const hash = await HAL.VFS.computeHash(content);
                blobs[hash] = content;
                const parts = path.split('/').filter(Boolean);
                let current = root;
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    if (i === parts.length - 1) {
                        current.children[part] = { type: 'file', hash: hash, size: content.length };
                    } else {
                        if (!current.children[part]) {
                            current.children[part] = { type: 'directory', children: {} };
                        }
                        if (current.children[part].type === 'file') {
                             current.children[part] = { type: 'directory', children: {} };
                        }
                        current = current.children[part] as DirectoryNode;
                    }
                }
            }
            return { tree: root, blobs };
        },
        flatten: async (root: DirectoryNode): Promise<Record<string, string>> => {
            const flat: Record<string, string> = {};
            const recurse = async (node: VFSNode, path: string) => {
                if (node.type === 'file') {
                    const content = await HAL.Memristor.getBlob(node.hash);
                    if (content !== null) flat[path] = content;
                } else {
                    for (const [name, child] of Object.entries(node.children)) {
                        await recurse(child, path === '/' ? `/${name}` : `${path}/${name}`);
                    }
                }
            };
            await recurse(root, '/');
            return flat;
        }
    },
    Runtimes: {
        runPython: async (code: string, args: string[] = []): Promise<string> => {
            if (!pyodideInstance) {
                await loadSdk('pyodide');
                pyodideInstance = await window.loadPyodide();
            }
            
            // Auto-load packages based on imports in the code
            try {
                await pyodideInstance.loadPackagesFromImports(code);
            } catch (e) {
                console.warn("Auto-loading packages failed, trying manual fallback for common libs...", e);
                // Fallback manual loading for common libs if auto-detection misses
                if (code.includes('sympy')) await pyodideInstance.loadPackage('sympy');
                if (code.includes('numpy')) await pyodideInstance.loadPackage('numpy');
                if (code.includes('pandas')) await pyodideInstance.loadPackage('pandas');
                if (code.includes('scipy')) await pyodideInstance.loadPackage('scipy');
            }

            let capturedOutput = '';
            pyodideInstance.setStdout({ batched: (str: string) => capturedOutput += str + '\n' });
            pyodideInstance.setStderr({ batched: (str: string) => capturedOutput += str + '\n' });

            // Updated Sandbox Preamble: Uses MockModule to prevent ImportErrors
            const sandboxPreamble = `
import sys
import os
import types

# 1. Create a Mock Module class that eats all attributes gracefully
class MockModule(types.ModuleType):
    def __getattr__(self, name):
        return MockModule(name)
    def __call__(self, *args, **kwargs):
        return MockModule("mock_result")
    def __repr__(self):
        return "<MockModule>"

# 2. List of modules to block/mock for security or environment reasons
blocked_modules = [
    'subprocess', 
    'socket', 
    'http', 
    'http.client', 
    'urllib.request', 
    'requests', 
    'ftplib', 
    'poplib', 
    'imaplib', 
    'smtplib', 
    'tkinter', 
    'turtle', 
    'pygame', 
    'pyglet'
]

# 3. Inject mocks into sys.modules
# This allows imports to succeed without crashing, but functionality is disabled.
for mod_name in blocked_modules:
    sys.modules[mod_name] = MockModule(mod_name)

# 4. Sanitize the 'os' module specifically
def security_violation(*args, **kwargs):
    raise RuntimeError("Security Sandbox: This OS function is disabled.")

if hasattr(os, 'system'): os.system = security_violation
if hasattr(os, 'popen'): os.popen = security_violation
if hasattr(os, 'spawn'): os.spawn = security_violation
if hasattr(os, 'fork'): os.fork = security_violation
if hasattr(os, 'exec'): os.exec = security_violation
`;

            try {
                if (args.length > 0) pyodideInstance.globals.set('input_str', args[0]);
                else pyodideInstance.globals.set('input_str', '');
                
                await pyodideInstance.runPythonAsync(sandboxPreamble + '\n' + code);
                return capturedOutput;
            } catch (e) { return `Error: ${(e as Error).message}`; }
        },
        runRuby: async (code: string, args: string[] = []): Promise<string> => {
             await loadSdk('ruby-wasm');
             const win = window as any;
             if (typeof win.RubyVM === 'undefined') return 'Error: Ruby SDK not loaded.';
             let capturedOutput = '';
             try {
                 const vm = await win.RubyVM.init();
                 vm.printSync = (_level: any, message: any) => {
                    capturedOutput += message + '\n';
                 };
                 await vm.evalAsync(code);
                 return capturedOutput;
             } catch (e) { return `Error: ${(e as Error).message}`; }
        },
        runLua: async (code: string, args: string[] = []): Promise<string> => {
            await loadSdk('fengari');
            if (typeof window.fengari === 'undefined') return 'Error: Fengari SDK not loaded.';
            let capturedOutput = '';
            try {
                const { lua, lauxlib, lualib, interop } = window.fengari;
                const L = lauxlib.luaL_newstate();
                lualib.luaL_openlibs(L);
                interop.push(L, (str: any) => capturedOutput += interop.to_jsstring(str) + '\n');
                lua.lua_setglobal(L, 'print');
                lua.lua_createtable(L, args.length, 0);
                args.forEach((arg, i) => {
                    interop.push(L, arg);
                    lua.lua_rawseti(L, -2, i + 1);
                });
                lua.lua_setglobal(L, 'arg');
                lauxlib.luaL_loadstring(L, code);
                const status = lua.lua_pcall(L, 0, 0, 0);
                if (status !== 0) throw new Error(lua.lua_tojsstring(L, -1));
                return capturedOutput;
            } catch (e) { return `Error: ${(e as Error).message}`; }
        },
        runScheme: async (code: string, args: string[] = []): Promise<string> => {
            await loadSdk('biwascheme');
            if (typeof window.BiwaScheme === 'undefined') return 'Error: BiwaScheme SDK not loaded.';
            let capturedOutput = '';
            try {
                const biwa = new window.BiwaScheme.Interpreter((e: Error) => { capturedOutput += `Error: ${e.message}\n`; });
                const result = await biwa.evaluate(code);
                if (result !== undefined && result !== window.BiwaScheme.undef) capturedOutput += window.BiwaScheme.to_write(result);
                return capturedOutput;
            } catch (e) { return `Error: ${(e as Error).message}`; }
        },
        runProlog: async (code: string): Promise<string> => {
            await loadSdk('trealla');
            if (!treallaInstance) {
                if(window.loadTrealla) {
                    treallaInstance = await window.loadTrealla();
                } else {
                    return "Error: Trealla loader not found.";
                }
            }
            try {
                const session = treallaInstance.getSession();
                await session.consult("/user.pl", code);
                const q = await session.query("true.");
                for await (const answer of q) {
                     if(answer.result !== 'success') return "Error: Prolog Knowledge Base loaded but sanity check failed.";
                }
                return "Knowledge Base loaded successfully. Ready for queries.";
            } catch(e) {
                return `Error: ${(e as Error).message}`;
            }
        },
        runClingo: async (code: string): Promise<string> => {
            await loadSdk('clingo');
            const clingoInstance = typeof (window as any).clingo !== 'undefined' ? (window as any).clingo : (window as any).Clingo;
            if (!clingoInstance) return "Error: Clingo SDK not loaded.";
            try {
                let result = '';
                if (typeof clingoInstance.run === 'function') {
                     result = await clingoInstance.run(code);
                } else if (typeof clingoInstance.solve === 'function') {
                     result = await clingoInstance.solve(code);
                } else {
                    return "Error: Clingo run/solve function not found.";
                }
                return typeof result === 'string' ? result : JSON.stringify(result, null, 2);
            } catch (e) {
                 return `Error: ${(e as Error).message}`;
            }
        }
    },
    Tools: {
        typescript_check_types: async (vfsRoot: DirectoryNode, filePaths: string[]): Promise<TscError[]> => {
             await loadSdk('typescript');
             if (typeof ts === 'undefined') return [];

             // 1. Flatten VFS to map
             const flatFiles = await HAL.VFS.flatten(vfsRoot);
             
             // 2. Create Compiler Host
             const compilerOptions = {
                 noEmit: true,
                 target: ts.ScriptTarget.ESNext,
                 module: ts.ModuleKind.ESNext,
                 lib: ["esnext", "dom"], // Minimal libs
                 strict: true,
                 jsx: ts.JsxEmit.React,
                 allowJs: true,
                 checkJs: true
             };

             const host = ts.createCompilerHost(compilerOptions);
             
             // Override readFile and fileExists to read from VFS memory
             const originalReadFile = host.readFile;
             host.readFile = (fileName: string) => {
                 const path = fileName.startsWith('/') ? fileName : '/' + fileName;
                 // Check in our flat VFS map
                 if (flatFiles[path]) return flatFiles[path];
                 // Try exact match without leading slash
                 if (flatFiles[fileName]) return flatFiles[fileName];
                 
                 // Fallback (e.g. for libs if not mocked, though this will likely fail in browser without networking/CDN handling for lib files)
                 // We just return empty for libs to avoid crash, or let TS handle it if it can.
                 // Ideally we'd load lib.d.ts from CDN, but for this "functional" mock we assume simple checks.
                 return ""; 
             };
             
             host.fileExists = (fileName: string) => {
                 const path = fileName.startsWith('/') ? fileName : '/' + fileName;
                 return !!(flatFiles[path] || flatFiles[fileName]);
             };

             // 3. Create Program
             // Filter filePaths to only those in VFS to prevent immediate crash
             const validPaths = filePaths.filter(p => flatFiles[p.startsWith('/') ? p : '/' + p]);
             
             if (validPaths.length === 0) {
                 return [{ file: 'general', line: 0, message: 'No valid files found to check.' }];
             }

             const program = ts.createProgram(validPaths, compilerOptions, host);
             const diagnostics = ts.getPreEmitDiagnostics(program);

             // 4. Format Errors
             return diagnostics.map((d: any) => {
                 const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
                 if (d.file) {
                     const { line } = d.file.getLineAndCharacterOfPosition(d.start!);
                     return {
                         file: d.file.fileName,
                         line: line + 1,
                         message: message
                     };
                 } else {
                     return {
                         file: 'global',
                         line: 0,
                         message: message
                     };
                 }
             });
        }
    },
    Geometry: {
        runBooleanOp: async (polyA: any, polyB: any, op: string) => {
            await loadSdk('polygonClipping');
            // @ts-ignore
            const pc = window.polygonClipping;
            switch (op) {
                case 'union': return pc.union(polyA, polyB);
                case 'intersection': return pc.intersection(polyA, polyB);
                case 'difference': return pc.difference(polyA, polyB);
                case 'xor': return pc.xor(polyA, polyB);
                default: throw new Error(`Unknown op: ${op}`);
            }
        },
        runMeshAnalysis: async (meshType: string, params: any) => {
             await loadSdk('three');
             return { volume: 100, surfaceArea: 50, type: meshType };
        }
    },
    Logic: {
        solve: async (query: string, kb: string[]): Promise<string> => {
             await loadSdk('trealla');
             if (!treallaInstance) {
                if(window.loadTrealla) {
                    treallaInstance = await window.loadTrealla();
                } else {
                    throw new Error("Trealla loader not found.");
                }
             }
             
             const session = treallaInstance.getSession();
             const kbContent = kb.join('\n');
             await session.consult("/user.pl", kbContent);
             
             const q = await session.query(query);
             let results = '';
             for await (const answer of q) {
                 if (answer.result === 'success') {
                     if (answer.substitutions && Object.keys(answer.substitutions).length > 0) {
                        // @ts-ignore
                        const bindings = Object.entries(answer.substitutions).map(([k, v]) => `${k} = ${v}`).join(', ');
                        results += `${bindings}\n`;
                     } else {
                         results += "true.\n";
                     }
                 } else {
                     results += "false.\n";
                 }
             }
             return results.trim() || "false.";
        },
        assert: (fact: string, currentKB: string[]): string[] => {
            if (!fact.endsWith('.')) fact += '.';
            return [...currentKB, fact];
        }
    },
    Clipboard: {
        writeText: async (text: string) => {
            try { await navigator.clipboard.writeText(text); } catch (err) { console.error('Failed to copy: ', err); throw err; }
        }
    },
    UI: {
        confirm: (message: string) => window.confirm(message)
    },
    System: {
        reload: () => window.location.reload()
    },
    FileSystem: {
        createObjectURL: (obj: Blob | MediaSource) => URL.createObjectURL(obj),
        revokeObjectURL: (url: string) => URL.revokeObjectURL(url)
    }
};
