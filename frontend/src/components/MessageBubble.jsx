
import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { Bot, User, Volume2, Pause } from 'lucide-react';

export default function MessageBubble({ message, fontStyle }) {
  const isUser = message.role === 'user';
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fontClass = fontStyle === 'baskerville' 
    ? 'chat-font-baskerville' 
    : fontStyle === 'times' 
      ? 'chat-font-times' 
      : 'chat-font-comicsans';

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      // Pause all other audio elements on the page first
      document.querySelectorAll('audio').forEach(el => {
        el.pause();
        el.currentTime = 0;
      });
      audioRef.current.play().catch(e => console.log('Audio playback blocked:', e));
      setIsPlaying(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-md p-0.5 transition-all duration-300"
          style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}
        >
          <img src="/logo.png" alt="Da Vinci" className="w-full h-full object-contain opacity-95" />
        </div>
      )}
      
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className="font-semibold text-xs mb-1 px-1 transition-colors duration-300"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isUser ? 'You' : 'Da Vinci'}
        </div>
        
        <div 
          className={`text-sm ${fontClass} ${
            isUser 
              ? 'px-5 py-3.5 rounded-2xl rounded-tr-none shadow-md inline-block border transition-all duration-300' 
              : 'mt-1.5'
          }`}
          style={isUser ? {
            backgroundColor: 'var(--bg-user-bubble)',
            borderColor: 'var(--border-user-bubble)',
            color: 'var(--text-user-bubble)'
          } : {
            color: 'var(--text-primary)'
          }}
        >
          <div className="prose prose-invert max-w-none markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ background: 'transparent', margin: 0, padding: '1rem' }}
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        </div>

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.citations.map((cite, idx) => (
              <span 
                key={idx} 
                className="text-xs px-2 py-1 border rounded-md transition-all duration-300"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                📄 {cite.fileName}
              </span>
            ))}
          </div>
        )}

        {!isUser && message.audioUrl && (
          <div 
            className="mt-3 flex items-center gap-3 py-1.5 px-3 rounded-xl border shadow-sm transition-all duration-300"
            style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}
          >
            <button 
              onClick={handleTogglePlay}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isPlaying ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20 dark:bg-zinc-200/10 dark:text-zinc-300'
              }`}
              title={isPlaying ? "Stop Reciting" : "Recite Response"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3.5 px-1">
                <span className="w-0.75 h-3 rounded-full animate-wave-bar" style={{ backgroundColor: 'var(--text-primary)', animationDelay: '0.1s' }}></span>
                <span className="w-0.75 h-4 rounded-full animate-wave-bar" style={{ backgroundColor: 'var(--text-primary)', animationDelay: '0.3s' }}></span>
                <span className="w-0.75 h-2 rounded-full animate-wave-bar" style={{ backgroundColor: 'var(--text-primary)', animationDelay: '0.5s' }}></span>
                <span className="w-0.75 h-4 rounded-full animate-wave-bar" style={{ backgroundColor: 'var(--text-primary)', animationDelay: '0.2s' }}></span>
                <span className="w-0.75 h-3 rounded-full animate-wave-bar" style={{ backgroundColor: 'var(--text-primary)', animationDelay: '0.4s' }}></span>
              </div>
            )}
            
            <span className="text-xs font-medium select-none" style={{ color: 'var(--text-secondary)' }}>
              {isPlaying ? 'Speaking...' : 'Listen'}
            </span>
            
            <audio 
              ref={audioRef} 
              src={message.audioUrl} 
              className="hidden" 
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
