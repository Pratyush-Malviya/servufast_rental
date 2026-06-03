import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, CornerDownLeft, Headphones, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";
import { useConfig } from "../hooks/useConfig";

export default function ChatWidget() {
  const { config } = useConfig();
  const { general } = config;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "intro",
          sender: "bot",
          text: `Hello! I'm David, your Client Support Coordinator here at ${general?.brandName || "ServUfast"}. If you have any questions about our standard rent-to-drive premium fleet, weekly rates, qualifications, or pickup locations, feel free to ask!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [general, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // Direct call to our backend express proxy route using real server intelligence
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "I am experiencing network queries right now. Please seek assistance by placing a direct call.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const botErr: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "My apologies, I could not build connection parameters. Please submit our registration form or call the hotline.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botErr]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-brand-gold hover:bg-brand-gold-light text-brand-bg flex items-center justify-center shadow-xl shadow-brand-gold/15 transition-all duration-300 relative cursor-pointer group"
          aria-label="Client Support Chat"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cream opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cream"></span>
            </span>
          )}
        </button>
      </div>

      {/* Expandable Chat dialogue window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-36 sm:bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[450px] sm:h-[500px] bg-brand-card/95 backdrop-blur-xl border border-brand-cream/10 rounded-[20px] shadow-2xl shadow-black/80 flex flex-col overflow-hidden z-40"
          >
            {/* Header */}
            <div className="p-4 bg-brand-muted/70 border-b border-brand-cream/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                  <Headphones size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-brand-cream">
                    Live Chat Support
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="live-indicator shrink-0"></span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-medium">
                      David · Coordinator
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-brand-cream-subtle hover:text-brand-cream transition-colors rounded-full"
                aria-label="Close concierge"
              >
                <X size={16} />
              </button>
            </div>

            {/* Message Track */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${!isBot && "flex-row-reverse"}`}>
                    {/* Avatar Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      isBot 
                        ? "bg-brand-muted text-brand-gold border-brand-gold/20" 
                        : "bg-brand-gold/15 text-brand-cream border-brand-cream/10"
                    }`}>
                      {isBot ? <Headphones size={13} /> : <User size={13} />}
                    </div>

                    {/* Speech Text Bubble */}
                    <div className={`max-w-[75%] space-y-1 p-3.5 rounded-[14px] text-xs leading-relaxed font-light ${
                      isBot 
                        ? "bg-brand-muted/50 text-brand-cream-dim border border-brand-cream/5" 
                        : "bg-brand-gold text-brand-bg font-semibold"
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className={`block font-mono text-[9px] text-right ${isBot ? "text-brand-cream-subtle" : "text-brand-bg/80"}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing simulation */}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-muted text-brand-gold border border-brand-gold/20 flex items-center justify-center shrink-0">
                    <Headphones size={13} />
                  </div>
                  <div className="bg-brand-muted/50 border border-brand-cream/5 p-3.5 rounded-[14px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Interactive Input formulation form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-brand-muted/40 border-t border-brand-cream/5 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask your query here..."
                className="flex-1 bg-brand-muted border border-brand-cream/5 focus:border-brand-gold rounded-full px-4 py-2.5 text-xs text-brand-cream focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-brand-gold disabled:opacity-40 text-brand-bg rounded-full hover:bg-brand-gold-light hover:scale-105 active:scale-95 transition-all text-xs flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Send message"
              >
                <Send size={12} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
