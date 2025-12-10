
// core/webcontainer.ts
import { WebContainer, FileSystemTree } from '@webcontainer/api';
import { AuraState, DirectoryNode } from '../types';
import { HAL } from './hal';

class WebContainerManager {
    private instance: WebContainer | null = null;
    private bootPromise: Promise<WebContainer> | null = null;

    public async getInstance(): Promise<WebContainer> {
        if (this.instance) return this.instance;
        if (this.bootPromise) return this.bootPromise;

        this.bootPromise = WebContainer.boot();
        this.instance = await this.bootPromise;
        return this.instance;
    }

    /**
     * Converts Aura's VFS (Git-like Tree + IndexedDB Blobs) into a WebContainer FileSystemTree.
     * @param state The current Aura application state containing the VFS tree.
     */
    public async syncFileSystem(state: AuraState): Promise<void> {
        const instance = await this.getInstance();
        const root = state.selfProgrammingState.virtualFileSystem;

        // Helper to recursively build the WebContainer tree structure
        const buildTree = async (node: DirectoryNode): Promise<FileSystemTree> => {
            const tree: FileSystemTree = {};
            
            for (const [name, child] of Object.entries(node.children)) {
                if (child.type === 'directory') {
                    tree[name] = {
                        directory: await buildTree(child as DirectoryNode)
                    };
                } else if (child.type === 'file') {
                    // Retrieve content from IndexedDB using hash
                    const content = await HAL.Memristor.getBlob(child.hash);
                    if (content !== null) {
                        tree[name] = {
                            file: {
                                contents: content
                            }
                        };
                    }
                }
            }
            return tree;
        };

        const fileSystemTree = await buildTree(root);
        await instance.mount(fileSystemTree);
    }

    public async writeFile(path: string, content: string): Promise<void> {
        const instance = await this.getInstance();
        await instance.fs.writeFile(path, content);
    }

    public async readFile(path: string): Promise<string> {
        const instance = await this.getInstance();
        const uint8array = await instance.fs.readFile(path);
        return new TextDecoder().decode(uint8array);
    }
}

export const webContainerManager = new WebContainerManager();
