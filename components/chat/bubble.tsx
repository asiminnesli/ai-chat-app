"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { formatChatTime } from '@/lib/formatChatTime';

export function ChatBubble({ message, isUser }: { message: any, isUser?: boolean }) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleCopyCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className={`flex flex-row ${isUser ? "justify-start" : "justify-end"}`}>
            <div className={`inline-flex shadow-[0_4px_4px_rgba(0,0,0,0.12)] flex-col gap-1 bg-[#09A13C] text-white px-4 py-2 rounded-[15px] text-sm max-w-[60%] ${isUser ? " rounded-bl-none" : " rounded-br-none"}`}>
                <div className="whitespace-pre-wrap break-words markdown-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                const codeString = String(children).replace(/\n$/, '');

                                return !inline && match ? (
                                    <div className="relative group my-2">
                                        <button
                                            onClick={() => handleCopyCode(codeString)}
                                            className="absolute right-2 top-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                                            aria-label="Copy code"
                                        >
                                            {copiedCode === codeString ? (
                                                <Check size={16} className="text-green-400" />
                                            ) : (
                                                <Copy size={16} className="text-gray-300" />
                                            )}
                                        </button>
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {codeString}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className={`${className} bg-black/20 px-1 py-0.5 rounded text-xs`} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            a: ({ children, href }) => (
                                <a href={href} className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
                <span className="text-[10px] opacity-80 self-end">
                    {message.created_at && formatChatTime(message.created_at)}
                </span>
            </div>
        </div>
    );
}