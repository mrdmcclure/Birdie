
import React, { useState, useRef, useEffect } from 'react';
import { BirdIcon } from './components/BirdIcon';
import { getGeminiChat, generateSillyBirdImage } from './services/geminiService';
import { ChatMessage, GeminiResponse } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      text: "Hi there! I'm Birdie, the world's biggest bird fan! 🐦 I love turning real and mythical birds into silly masterpieces. To get started, tell me: what's your favorite bird species?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText: string, e?: React.FormEvent) => {
    e?.preventDefault();
    const textToProcess = messageText.trim();
    if (!textToProcess || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToProcess
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = getGeminiChat();
      }

      const response = await chatRef.current.sendMessage({ message: textToProcess });
      const data: GeminiResponse = JSON.parse(response.text);

      // 1. Display the Story/Reply first
      const botMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'bot',
        text: data.reply
      }]);

      // 2. Trigger Image generation if requested
      if (data.shouldGenerate && data.birdName && data.sillyDescription) {
        const imageMsgId = (Date.now() + 2).toString();
        setMessages(prev => [...prev, {
          id: imageMsgId,
          role: 'bot',
          text: `Hold your feathers! Now I'm sketching your silly ${data.birdName}...`,
          isGeneratingImage: true
        }]);

        const imageUrl = await generateSillyBirdImage(data.birdName, data.sillyDescription);
        
        setMessages(prev => prev.map(msg => 
          msg.id === imageMsgId 
            ? { ...msg, imageUrl, isGeneratingImage: false, text: `Check it out! Here is your silly ${data.birdName}! 🎨` } 
            : msg
        ));
      }

      // 3. Ask the follow-up question AFTER image generation (or if no image needed)
      if (data.followUpQuestion) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 3).toString(),
          role: 'bot',
          text: data.followUpQuestion!
        }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'bot',
        text: "Oops, my beak got stuck! My apologies. Could you try saying that again? (Let's stick to birds!)"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl">
      {/* Header */}
      <header className="bg-emerald-600 p-4 text-white flex items-center gap-3 shadow-md z-10">
        <div className="bg-white p-2 rounded-full text-emerald-600">
          <BirdIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-fredoka font-bold leading-none">Birdie</h1>
          <p className="text-emerald-100 text-xs font-medium">Beaks and giggles for the entire family</p>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-emerald-50/30 scroll-smooth"
      >
        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          // Show actions if it's a follow-up question message
          const isQuestion = msg.text.toLowerCase().includes("same story") || 
                             msg.text.toLowerCase().includes("different story") ||
                             msg.text.toLowerCase().includes("snap another one");
          const showActions = isLastMessage && msg.role === 'bot' && isQuestion && !isLoading;

          return (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-emerald-100 rounded-tl-none'
                }`}
              >
                <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                
                {msg.isGeneratingImage && (
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <div className="w-full h-48 bg-emerald-50 rounded-lg animate-pulse flex items-center justify-center">
                      <BirdIcon className="w-12 h-12 text-emerald-200 animate-bounce" />
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold animate-pulse italic">Mixing pixels and polishing feathers...</span>
                  </div>
                )}

                {msg.imageUrl && (
                  <div className="mt-4 overflow-hidden rounded-xl border-4 border-emerald-100 shadow-lg group">
                    <img 
                      src={msg.imageUrl} 
                      alt="Silly Bird" 
                      className="w-full h-auto object-cover transform transition-transform group-hover:scale-105"
                    />
                    <div className="bg-emerald-50 p-2 text-center">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = msg.imageUrl!;
                          link.download = `silly-bird-${Date.now()}.png`;
                          link.click();
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                      >
                        Download Masterpiece
                      </button>
                    </div>
                  </div>
                )}

                {showActions && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleSend("Another image from this story please!")}
                      className="text-xs bg-emerald-100 text-emerald-700 px-3 py-2 rounded-full font-bold hover:bg-emerald-200 transition-colors border border-emerald-200"
                    >
                      ✨ Another image
                    </button>
                    <button 
                      onClick={() => handleSend("Let's do a different story with a new bird!")}
                      className="text-xs bg-emerald-600 text-white px-3 py-2 rounded-full font-bold hover:bg-emerald-700 transition-colors"
                    >
                      🐦 New story
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-emerald-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-emerald-800 border-t border-emerald-900 sticky bottom-0 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <form onSubmit={(e) => handleSend(input, e)} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name a bird or answer my question..."
            className="flex-1 px-4 py-3 rounded-full border-2 border-emerald-700 bg-emerald-900 focus:border-emerald-400 focus:outline-none transition-colors text-white placeholder-emerald-400"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            Send
          </button>
        </form>
        <p className="text-[10px] text-emerald-300 mt-2 text-center uppercase tracking-widest font-bold">
          Purely Avian Fun
        </p>
      </div>
    </div>
  );
};

export default App;