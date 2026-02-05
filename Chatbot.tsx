
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mic, Play, Square, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { getSmartChatResponse, getFastChatResponse, getComplexChatResponse, transcribeAudio, generateSpeech } from '../services/geminiService';

// Fix: Implement manual decode function for base64 strings as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Fix: Implement manual audio decoding for raw PCM data
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    const r = await getSmartChatResponse(textToSend);
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: r.text,
      sources: r.sources
    }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-80px)] flex flex-col bg-slate-950 text-white relative">
      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <div className="flex flex-col h-full overflow-hidden p-6 relative z-10">
        <div className="text-center pt-8 pb-12 flex flex-col items-center gap-3">
          <div className="bg-[#00ffd5]/20 p-5 rounded-[2rem] border-2 border-[#00ffd5]/40 shadow-[0_0_30px_rgba(0,255,213,0.3)] animate-pulse">
            <Bot className="w-12 h-12 text-[#00ffd5]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase italic">robo coach</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-[#00ffd5] uppercase tracking-[0.4em]">Neural Link: Stable</span>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-8 scroll-smooth pb-8 px-2"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/50 text-center space-y-6">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-[#00ffd5]/10 animate-spin-slow" />
                <Bot className="w-8 h-8 text-[#00ffd5]/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-widest text-[#00ffd5]">System Handshake Success</p>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-30">V.2.0.26 Diagnostics Clear</p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-[240px]">
                <button onClick={() => setInput("Identify healthy weight loss targets")} className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#00ffd5] hover:text-black transition-all">Weight Strategy</button>
                <button onClick={() => setInput("Analyze metabolism bottlenecks")} className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#00ffd5] hover:text-black transition-all">Bio-Optimization</button>
              </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className="flex flex-col gap-1 max-w-[88%]">
                <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   {msg.role === 'user' ? <User className="w-3 h-3 text-white/30" /> : <Bot className="w-3 h-3 text-[#00ffd5]" />}
                   <span className="text-[8px] font-black uppercase tracking-widest opacity-30">{msg.role === 'user' ? 'Biological Origin' : 'Unit ID: FZ-9000'}</span>
                </div>
                <div className={`p-6 rounded-3xl text-sm leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-[#2cc3ff] text-black font-bold' : 'bg-slate-900 text-white border border-[#00ffd5]/20'}`}>
                  {msg.text}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#00ffd5]/60 mb-3">Grounding Nodes Connected:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((chunk: any, idx: number) => {
                          const url = chunk.web?.uri || chunk.maps?.uri;
                          const title = chunk.web?.title || chunk.maps?.title || "Node";
                          if (!url) return null;
                          return (
                            <a 
                              key={idx} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[8px] bg-white/5 px-3 py-1.5 rounded-xl text-[#00ffd5] hover:bg-[#00ffd5] hover:text-black font-black transition-all truncate max-w-[140px] uppercase border border-[#00ffd5]/10"
                            >
                              {title}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl bg-slate-900 border border-[#00ffd5]/10 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#00ffd5]" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00ffd5] animate-pulse">Calculating...</span>
              </div>
            </div>
          )}
        </div>

        <div className="py-6 border-t border-white/5 px-2">
          <div className="bg-slate-900/50 rounded-2xl flex items-center px-6 py-4 border border-white/10 shadow-2xl group focus-within:border-[#00ffd5]/50 transition-all">
             <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="INPUT COMMAND..."
                className="flex-1 bg-transparent text-white outline-none text-xs py-1 placeholder:text-white/10 font-black uppercase tracking-widest"
              />
              <button onClick={() => handleSend()} className="ml-3 bg-[#00ffd5] p-3 rounded-2xl text-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,213,0.4)]">
                <Send className="w-4 h-4" />
              </button>
          </div>
          <div className="mt-4 flex justify-center items-center gap-6 opacity-20">
             <div className="h-[2px] w-8 bg-[#00ffd5]"></div>
             <span className="text-[7px] font-black tracking-[0.5em] text-[#00ffd5]">ROBOTIC HEALTH COMPANION</span>
             <div className="h-[2px] w-8 bg-[#00ffd5]"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default Chatbot;
