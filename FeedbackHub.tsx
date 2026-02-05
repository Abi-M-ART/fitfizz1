
import React, { useState } from 'react';
import { Send, Bot, Play, Activity, Mail, CheckCircle2, BellRing, Sparkles, Loader2 } from 'lucide-react';
import { FeedbackEntry } from '../types';
import { generateSpeech } from '../services/geminiService';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';

// Manual decode function as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Manual audio decoding for raw PCM data
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

const FeedbackHub: React.FC = () => {
  const user = authService.getCurrentUser();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [wantsUpdates, setWantsUpdates] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [entries, setEntries] = useState<FeedbackEntry[]>([
    {
      id: '1',
      user: 'Alpha User',
      comment: 'The robotic coach is surprisingly insightful about macro-nutrients.',
      response: 'Acknowledged. We are refining our protein synthesis algorithms based on your input. Updates will be sent to your primary terminal.',
      date: '2026-01-10'
    }
  ]);

  const handleSpeech = async (text: string) => {
    const audioBase64 = await generateSpeech(text);
    if (audioBase64) {
      try {
        const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const audioBuffer = await decodeAudioData(
          decode(audioBase64),
          outputAudioContext,
          24000,
          1,
        );
        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContext.destination);
        source.start();
      } catch (err) {
        console.error("Playback error:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim() || !user?.id) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const entry: FeedbackEntry = {
      id: Date.now().toString(),
      user: 'Verified User',
      comment: message,
      response: `Connection confirmed. Health protocols and future system updates will be dispatched to ${email}.`,
      date: new Date().toISOString().split('T')[0]
    };

    // Use dataService to persist feedback
    if (dataService.saveFeedback) {
      dataService.saveFeedback(user.id, { email, message, wantsUpdates });
    }

    setEntries([entry, ...entries]);
    setMessage('');
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 animate-fadeIn overflow-y-auto pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 flex items-center justify-between border-b-2 border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Update Hub</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Feedback & Protocol Distribution</p>
          </div>
          <div className="bg-slate-900 p-3 rounded-2xl shadow-xl">
            <Mail className="w-8 h-8 text-[#00ffd5]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100 space-y-6 sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                 <div className="bg-emerald-100 p-2 rounded-xl">
                   <BellRing className="w-5 h-5 text-emerald-600" />
                 </div>
                 <h3 className="font-black text-slate-900 uppercase tracking-tighter">Sync Updates</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Mail Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@health.link"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-[#00ffd5] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Feedback</label>
                  <textarea 
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your progress or suggest features..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-800 outline-none focus:border-[#00ffd5] transition-all min-h-[120px] resize-none"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-900 uppercase">Newsletter Opt-in</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Protocol updates via email</span>
                   </div>
                   <button 
                     type="button"
                     onClick={() => setWantsUpdates(!wantsUpdates)}
                     className={`w-12 h-6 rounded-full transition-all relative ${wantsUpdates ? 'bg-[#00ffd5]' : 'bg-slate-200'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${wantsUpdates ? 'right-1' : 'left-1 shadow-sm'}`}></div>
                   </button>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-2xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] hover:bg-black active:scale-[0.98] transition-all text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#00ffd5]" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 text-[#00ffd5]" />
                      Send & Link
                    </>
                  )}
                </button>
              </form>

              {showSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <p className="text-[10px] font-black text-emerald-700 uppercase leading-tight">Sync Complete. Updates scheduled for {email}.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] mb-4">
              <Activity className="w-4 h-4" /> Global Transmission Feed
            </div>

            {entries.map(entry => (
              <div key={entry.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl space-y-6 animate-fadeIn relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00ffd5] group-hover:w-3 transition-all"></div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </span>
                    <span className="font-black text-slate-900 uppercase text-xs tracking-tighter">{entry.user}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-black uppercase">{entry.date}</span>
                </div>

                <p className="text-slate-600 font-medium italic text-sm pl-4 border-l-2 border-slate-50 leading-relaxed">"{entry.comment}"</p>
                
                <div className="bg-slate-900 rounded-2xl p-6 flex gap-4 shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-[#00ffd5]/20 flex items-center justify-center shrink-0 border border-[#00ffd5]/30">
                    <Bot className="w-5 h-5 text-[#00ffd5]" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-[#00ffd5] uppercase tracking-widest">Robo Response</p>
                      <button 
                        onClick={() => handleSpeech(entry.response)}
                        className="text-[9px] font-black text-white/40 hover:text-[#00ffd5] uppercase flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" /> Play Protocol
                      </button>
                    </div>
                    <p className="text-xs text-white font-medium leading-relaxed opacity-80">{entry.response}</p>
                    <div className="flex items-center gap-2 pt-2">
                       <Sparkles className="w-3 h-3 text-[#00ffd5]/40" />
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">System Status: Updating Linked Email</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-slate-200/20 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
               <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End of Recent Transmissions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackHub;
