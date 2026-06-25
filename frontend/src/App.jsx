import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Activity, Info, Menu, X, Trash2 } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am your AI Medical Assistant. How can I help you today?",
      sender: "bot",
      isTyping: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      isTyping: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage.text
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        isTyping: false
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to my medical database. Please try again later.",
        sender: 'bot',
        isTyping: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      text: "Hello! I am your AI Medical Assistant. How can I help you today?",
      sender: "bot",
      isTyping: false
    }]);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-tight">MediChat AI</h1>
              <span className="text-emerald-500 text-xs font-semibold uppercase tracking-wider">Health Assistant</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">About</div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-sm text-slate-300 leading-relaxed shadow-inner">
            <p className="flex items-start gap-2">
              <Info size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>This chatbot provides general medical information using advanced AI. Always consult a healthcare professional for serious concerns.</span>
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all font-medium text-sm border border-red-500/20"
          >
            <Trash2 size={16} />
            Clear Conversation
          </button>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top Header for Mobile */}
        <div className="lg:hidden p-4 border-b border-slate-800 bg-slate-900 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-400" size={20} />
            <h1 className="text-white font-bold">MediChat AI</h1>
          </div>
        </div>

        {/* Ambient Background Glow */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth z-10">
          <div className="max-w-4xl mx-auto flex flex-col">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <ChatMessage message={{ sender: 'bot', isTyping: true }} />
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 z-10 relative">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
            <form 
              onSubmit={handleSendMessage}
              className="relative flex items-center bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden focus-within:border-slate-500 transition-colors"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your symptoms or ask a medical question..."
                className="flex-1 bg-transparent text-white px-6 py-4 outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-4 text-emerald-400 hover:text-emerald-300 disabled:text-slate-600 disabled:hover:text-slate-600 transition-colors"
              >
                <div className="flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 rounded-xl p-2 transition-colors">
                  <Send size={20} className={inputValue.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                </div>
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-slate-500 mt-3 font-medium">
            AI can make mistakes. Always verify important medical information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
