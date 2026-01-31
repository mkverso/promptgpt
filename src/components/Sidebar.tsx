import { useState, useRef, useEffect } from 'react';
import type { ChatSession } from '../types/index';
import { useSidebar } from './ChatLayout';

interface SidebarProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (id: string) => void;
    onCreateSession: () => void;
    onClearSession: () => void;
    onDeleteSession: (id: string) => void;
    onRenameSession: (id: string, newTitle: string) => void;
    onImportSession: (file: File) => void;
    onExportSession: (session: ChatSession) => void;
}

const SESSION_MENU_ITEMS = [
    { label: '✏️ Rename', action: 'rename' as const, className: 'border' },
    { label: '⬇️ Download', action: 'export' as const, className: 'border' },
    { label: '🗑️ Delete', action: 'delete' as const, className: 'danger' },
];

export function Sidebar({
    sessions,
    activeSessionId,
    onSelectSession,
    onCreateSession,
    onClearSession,
    onDeleteSession,
    onRenameSession,
    onImportSession,
    onExportSession
}: SidebarProps) {
    const { closeSidebar } = useSidebar();
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === id ? null : id);
    };

    const handleAction = (action: 'rename' | 'delete' | 'export', id: string) => {
        console.log(`Action: ${action} on ${id}`); // Debug
        setMenuOpenId(null);
        const session = sessions.find(s => s.id === id);
        if (!session) return;

        if (action === 'delete') {
            if (confirm('Delete this chat?')) {
                onDeleteSession(id);
            }
        } else if (action === 'rename') {
            const newTitle = prompt('Enter new chat title:', session.title);
            if (newTitle) {
                onRenameSession(id, newTitle);
            }
        } else if (action === 'export') {
            onExportSession(session);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImportSession(file);
        }
        // Reset inputs
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="sidebar-container">
            {/* Logo Area */}
            <div className="sidebar-logo-area">
                <img
                    src="/favicon.png"
                    alt="Logo"
                    className="sidebar-logo-img"
                />
                <h3 className="sidebar-title">LiteGPT</h3>
            </div>

            {/* Buttons: New Chat & Upload */}
            <div className="sidebar-action-container">
                <button
                    onClick={() => {
                        onCreateSession();
                        closeSidebar();
                    }}
                    className="btn-new-chat"
                >
                    <span>+</span> New Chat
                </button>
                <button
                    onClick={handleImportClick}
                    title="Upload Chat (.md)"
                    className="btn-upload"
                >
                    📂
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".md"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>

            {/* Session List */}
            <div className="sidebar-session-list">
                <div className="sidebar-session-list-inner">
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            className="session-item-wrap"
                        >
                            <button
                                onClick={() => {
                                    onSelectSession(session.id);
                                    closeSidebar();
                                }}
                                className="session-btn"
                                style={{
                                    background: session.id === activeSessionId ? 'var(--bg-primary)' : 'transparent',
                                    fontWeight: session.id === activeSessionId ? 'bold' : 'normal',
                                    opacity: session.id === activeSessionId ? 1 : 0.8,
                                }}
                            >
                                {session.title || 'New Chat'}
                            </button>

                            <button
                                onClick={(e) => handleMenuClick(e, session.id)}
                                className="session-menu-trigger"
                                title="Chat options"
                            >
                                ⋮
                            </button>

                            {/* Dropdown Menu */}
                            {menuOpenId === session.id && (
                                <div ref={menuRef} className="dropdown-menu">
                                    {SESSION_MENU_ITEMS.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAction(item.action, session.id);
                                            }}
                                            className={`dropdown-item dropdown-item-${item.className}`}
                                        >
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / Clear */}
            <div className="sidebar-footer">
                {activeSessionId && (
                    <button
                        onClick={() => {
                            onClearSession();
                            closeSidebar();
                        }}
                        className="btn-clear-conv"
                    >
                        🗑️ Clear conversation
                    </button>
                )}

                <div className="credit-line" style={{ paddingTop: activeSessionId ? '0' : '0.5rem' }}>
                    Built by <span className="credit-name">Murali</span>
                </div>
            </div>
        </div>
    );
}
