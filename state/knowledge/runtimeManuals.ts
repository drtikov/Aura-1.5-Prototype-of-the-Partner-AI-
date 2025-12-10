
export const RUNTIME_MANUALS = `
# RUNTIME ENVIRONMENT CONSTRAINTS

## PYTHON (Pyodide)
- **Environment:** Browser-based WebAssembly (Pyodide).
- **Network:** STRICTLY DISABLED. 'socket', 'requests', 'urllib', 'http' are blocked. Do not attempt to fetch URLs or connect to APIs.
- **System:** STRICTLY DISABLED. 'subprocess', 'os.system', 'os.popen' are blocked. No shell access.
- **GUI:** STRICTLY DISABLED. 'tkinter', 'turtle', 'pygame', 'pyglet' are blocked. Do not generate GUI code.
- **Output:** Use 'print()' for output. Matplotlib plots must be saved to a buffer or base64 string, not shown via 'plt.show()'.
- **Filesystem:** Virtual in-memory only. No persistence across reloads.

## JAVASCRIPT (Browser)
- **Environment:** Standard Browser Runtime.
- **Node.js:** Node APIs ('fs', 'child_process', 'net') are NOT available.
- **Network:** Use standard 'fetch' API.
- **DOM:** Full access to the DOM is available.

## SCHEME (BiwaScheme)
- **IO:** Non-blocking. No file I/O.
`;
