
// components/TerminalPanel.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { webContainerManager } from '../core/webcontainer';
import { useAuraDispatch, useLocalization } from '../context/AuraContext';

export const TerminalPanel = () => {
    const { t } = useLocalization();
    const { state, addToast } = useAuraDispatch();
    const [history, setHistory] = useState<string[]>(['> Initializing WebContainer...']);
    const [command, setCommand] = useState('');
    const [isBooted, setIsBooted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const runCommand = async (cmdString: string) => {
        setHistory(prev => [...prev, `$ ${cmdString}`]);
        setIsProcessing(true);

        try {
            const instance = await webContainerManager.getInstance();
            const [cmdName, ...args] = cmdString.split(' ');
            
            const process = await instance.spawn(cmdName, args);
            
            process.output.pipeTo(new WritableStream({
                write(data) {
                    setHistory(prev => [...prev, data]);
                }
            }));

            const exitCode = await process.exit;
            setHistory(prev => [...prev, `> Process exited with code ${exitCode}`]);

        } catch (e) {
            setHistory(prev => [...prev, `> Execution failed: ${(e as Error).message}`]);
        } finally {
            setIsProcessing(false);
        }
    };

    // Boot WebContainer on mount
    useEffect(() => {
        const boot = async () => {
            try {
                await webContainerManager.getInstance();
                setHistory(prev => [...prev, '> WebContainer booted.', '> Syncing VFS...']);
                await webContainerManager.syncFileSystem(state);
                setHistory(prev => [...prev, '> VFS Synced. Environment Ready.']);
                setIsBooted(true);
                
                // Auto-run diagnostics
                await runCommand('node -v');
                await runCommand('ls -la');
                
            } catch (e) {
                setHistory(prev => [...prev, `> Error: ${(e as Error).message}`, '> Ensure COOP/COEP headers are set.']);
                addToast('Failed to boot WebContainer. Cross-Origin Isolation required.', 'error');
            }
        };
        boot();
    }, []);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isProcessing && command.trim()) {
            const cmd = command.trim();
            setCommand('');
            await runCommand(cmd);
        }
    };

    return (
        <div className="side-panel terminal-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px', backgroundColor: '#1e1e1e', border: '1px solid var(--border-color)', borderRadius: '4px', padding: 0, overflow: 'hidden' }}>
            <div className="terminal-header" style={{ padding: '0.5rem', backgroundColor: '#252526', borderBottom: '1px solid #333', color: '#ccc', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>TERMINAL - Node.js (WebContainer)</span>
                <span style={{ color: isBooted ? 'var(--success-color)' : 'var(--warning-color)' }}>
                    ● {isBooted ? 'Online' : 'Booting'}
                </span>
            </div>
            
            <div className="terminal-output" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#fff', whiteSpace: 'pre-wrap' }}>
                {history.map((line, i) => (
                    <div key={i} style={{ lineHeight: '1.4' }}>{line}</div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="terminal-input-line" style={{ display: 'flex', padding: '0.5rem', backgroundColor: '#252526', borderTop: '1px solid #333' }}>
                <span style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}>$</span>
                <input 
                    type="text" 
                    value={command} 
                    onChange={(e) => setCommand(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    disabled={!isBooted || isProcessing}
                    placeholder={!isBooted ? "Waiting for container..." : "Enter command..."}
                    style={{ flexGrow: 1, background: 'transparent', border: 'none', color: '#fff', fontFamily: 'monospace', outline: 'none' }}
                    autoFocus
                />
            </div>
        </div>
    );
};
