import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import { Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import ChatInput from './ChatInput';

const Typewriter = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <span>{displayedText}</span>;
};

export default function ChatWindow({ sessionId, messages, onSendText, fontStyle, languageCode, setLanguageCode, theme, welcomeMessage, allMessages = [], activeMessageId, onSelectActiveMessageId, onEditPrompt }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef(null);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editPromptText, setEditPromptText] = useState('');

  const getDeepestLeaf = (allMsgs, msgId) => {
    if (!msgId) return null;
    let current = allMsgs.find(m => m.id === msgId);
    while (current) {
      const children = allMsgs.filter(m => m.parentId === current.id);
      if (children.length === 0) break;
      current = children[children.length - 1];
    }
    return current ? current.id : msgId;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendAudio = async (audioBlob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    try {
      const res = await axios.post('/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.transcription) {
        onSendText(res.data.transcription, res.data.languageCode);
      }
    } catch (err) {
      console.error('Transcription failed:', err);
      alert('Transcription failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadFile = async (file) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);
    formData.append('subject', 'General');
    
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        alert('File uploaded successfully to knowledge base!');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('File upload failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFontClass = () => {
    if (fontStyle === 'baskerville') return 'chat-font-baskerville';
    if (fontStyle === 'times') return 'chat-font-times';
    if (fontStyle === 'comicsans') return 'chat-font-comicsans';
    return '';
  };

  return (
    <div className="flex-1 flex flex-col h-screen relative overflow-hidden bg-transparent">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/10 blur-[120px] rounded-full pointer-events-none" />
      {messages.length === 0 ? (
        <div className={`flex-1 flex flex-col items-center justify-center relative z-10 text-center px-4 ${getFontClass()}`}>
          <div className="relative w-44 h-44 flex items-center justify-center mb-8">
            {/* 3D Glassmorphic Glow Backdrop */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-2xl animate-pulse" />
            
            {/* Shifting Gradient Fluid Blob */}
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`w-32 h-32 flex items-center justify-center relative transition-all duration-500 overflow-hidden ${
                isProcessing ? 'fluid-orb-think' : 'fluid-orb'
              }`}
            >
              {/* Overlay Glass Highlight */}
              <div className="absolute top-1 left-2 w-16 h-8 bg-white/10 rounded-full filter blur-[1px] rotate-[-15deg] pointer-events-none" />
              
              {/* Logo in the center */}
              <img 
                src="/logo.png" 
                alt="Da Vinci Logo" 
                className={`w-16 h-16 object-contain opacity-95 transition-transform duration-500 ${
                  isProcessing ? 'scale-110 animate-pulse' : 'hover:scale-105'
                }`} 
              />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold mb-3 tracking-tight text-zinc-900 dark:text-zinc-100 min-h-[40px]">
            <Typewriter text={welcomeMessage || "Greetings. I am Da Vinci."} speed={60} />
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-sm max-w-md mt-2 transition-colors duration-300"
            style={{ color: 'var(--text-secondary)' }}
          >
            A keeper of wisdom. How may I enlighten you today?
          </motion.p>
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-12 py-8 relative z-10">
          <div className="max-w-3xl mx-auto w-full">
            {messages.map((msg, idx) => {
              const siblings = allMessages.filter(m => m.parentId === msg.parentId);
              const currentIdx = siblings.findIndex(s => s.id === msg.id);
              const hasBranches = siblings.length > 1;

              return (
                <div key={msg.id || idx} className="group flex flex-col gap-1 w-full mb-6 relative">
                  {editingMessageId === msg.id ? (
                    <div className="w-full flex flex-col gap-3 p-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-900/30" style={{ borderColor: 'var(--border-color)' }}>
                      <textarea
                        value={editPromptText}
                        onChange={(e) => setEditPromptText(e.target.value)}
                        className="w-full min-h-[80px] p-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="px-3.5 py-1.5 rounded-lg border font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition"
                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (editPromptText.trim() && editPromptText.trim() !== msg.text) {
                              onEditPrompt(msg.id, editPromptText.trim());
                            }
                            setEditingMessageId(null);
                          }}
                          className="px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition"
                          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--bg-app)' }}
                        >
                          Save & Submit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4 w-full">
                      <div className="flex-1 min-w-0">
                        <MessageBubble message={msg} fontStyle={fontStyle} />
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-2 shrink-0">
                        {msg.role === 'user' && (
                          <button
                            onClick={() => {
                              setEditingMessageId(msg.id);
                              setEditPromptText(msg.text);
                            }}
                            className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition"
                            title="Edit Prompt"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {hasBranches && editingMessageId !== msg.id && (
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 pl-4 select-none">
                      <button 
                        onClick={() => {
                          const prevIdx = (currentIdx - 1 + siblings.length) % siblings.length;
                          const leafId = getDeepestLeaf(allMessages, siblings[prevIdx].id);
                          onSelectActiveMessageId(leafId);
                        }}
                        className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition cursor-pointer"
                        title="Previous response branch"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-semibold">{currentIdx + 1} / {siblings.length}</span>
                      <button 
                        onClick={() => {
                          const nextIdx = (currentIdx + 1) % siblings.length;
                          const leafId = getDeepestLeaf(allMessages, siblings[nextIdx].id);
                          onSelectActiveMessageId(leafId);
                        }}
                        className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition cursor-pointer"
                        title="Next response branch"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div 
        className="p-4 relative z-10 pb-8"
        style={{
          backgroundImage: 'linear-gradient(to top, var(--bg-app) 0%, var(--bg-app) 70%, transparent 100%)'
        }}
      >
        <ChatInput 
          onSendText={(text, lang) => onSendText(text, lang)} 
          onUploadFile={handleUploadFile}
          isProcessing={isProcessing}
          languageCode={languageCode}
          setLanguageCode={setLanguageCode}
          fontStyle={fontStyle}
          theme={theme}
        />
      </div>
    </div>
  );
}
