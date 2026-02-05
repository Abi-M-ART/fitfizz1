import React, { useState, useRef } from 'react';
// Added Bot to imports to fix "Cannot find name 'Bot'" error
import { Upload, Wand2, Loader2, Download, Image as ImageIcon, Trash2, ArrowRightLeft, Bot } from 'lucide-react';
import { editImageWithGemini } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mimeType, setMimeType] = useState('image/png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return;

    setIsProcessing(true);
    try {
      const base64Data = originalImage.split(',')[1];
      const result = await editImageWithGemini(base64Data, mimeType, prompt);
      setEditedImage(result);
    } catch (error) {
      alert("Error editing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `fitfizz-edit-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 animate-fadeIn pb-24 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30">
            <Wand2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">FitSnap Editor</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">Powered by Nano Banana Intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Input Area */}
          <div className="space-y-6">
            <div 
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden aspect-square ${
                originalImage ? 'border-emerald-500/50' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              
              {originalImage ? (
                <img src={originalImage} alt="Original" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-slate-900 p-4 rounded-full inline-block">
                    <Upload className="w-8 h-8 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-white font-black uppercase text-sm">Upload Base Image</p>
                    <p className="text-slate-500 text-[10px] font-bold mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                </div>
              )}
              
              {originalImage && !isProcessing && (
                <div className="absolute top-4 right-4 flex gap-2">
                   <button 
                    onClick={(e) => { e.stopPropagation(); setOriginalImage(null); setEditedImage(null); }}
                    className="bg-black/60 backdrop-blur-md p-2 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              )}
            </div>

            <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Editing Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Add a retro filter', 'Make the background bright green', 'Remove the objects behind me'..."
                className="w-full bg-slate-950 border-none rounded-2xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500 min-h-[100px] resize-none placeholder:text-slate-700 font-medium"
              />
              <button 
                onClick={handleEdit}
                disabled={isProcessing || !originalImage || !prompt.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-tighter"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Apply Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className="space-y-6">
            <div className={`relative border-2 border-slate-900 bg-slate-900/50 rounded-3xl p-2 aspect-square flex items-center justify-center overflow-hidden ${editedImage ? 'animate-fadeIn' : ''}`}>
              {editedImage ? (
                <img src={editedImage} alt="Edited" className="w-full h-full object-cover rounded-2xl shadow-2xl" />
              ) : (
                <div className="text-center p-8 space-y-4">
                  {isProcessing ? (
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <Bot className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-emerald-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Synthesizing Pixels</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-950 p-6 rounded-full inline-block opacity-20">
                        <ImageIcon className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-slate-600 font-black uppercase text-xs tracking-widest">Awaiting Generation</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {editedImage && (
              <div className="flex gap-4">
                <button 
                  onClick={downloadResult}
                  className="flex-1 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all uppercase tracking-tighter"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button 
                  onClick={() => {
                    const temp = originalImage;
                    setOriginalImage(editedImage);
                    setEditedImage(temp);
                  }}
                  className="bg-slate-800 text-white p-4 rounded-2xl hover:bg-slate-700 transition-all"
                  title="Swap images"
                >
                  <ArrowRightLeft className="w-6 h-6" />
                </button>
              </div>
            )}

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-[10px] text-emerald-400 font-bold uppercase tracking-widest leading-relaxed">
              Tip: The Nano Banana series excels at understanding context. Try descriptive prompts like "Add a warm morning glow to the lighting" for best results.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;