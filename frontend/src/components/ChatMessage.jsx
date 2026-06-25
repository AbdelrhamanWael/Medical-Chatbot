import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Loader2 } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const isTyping = message.isTyping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${isUser ? 'bg-indigo-600' : 'bg-emerald-600'} text-white shadow-lg`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        
        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-2xl shadow-sm relative overflow-hidden ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
          }`}>
            {isUser && (
               <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
            )}
            {!isUser && (
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>
            )}
            
            {isTyping ? (
              <div className="flex gap-1.5 items-center h-6">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
            ) : (
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                {message.text}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500 mt-1.5 font-medium px-1">
            {isUser ? 'You' : 'Medical Assistant'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
