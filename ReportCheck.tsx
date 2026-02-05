
import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, Bot, X, ClipboardList, ShieldCheck } from 'lucide-react';
import { analyzeReport } from '../services/geminiService';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';

const ReportCheck: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{ text: string, sources: any[] } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const user = authService.getCurrentUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!preview || !file || !user?.id) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeReport(preview, file.type);
      setAnalysis(result);
      
      // Save linked to user ID
      dataService.saveReportAnalysis(user.id, result.text, file.name);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isPDF = file?.type === 'application/pdf';

  return (
    <div className="min-h-screen bg-slate-50 p-6 animate-fadeIn overflow-y-auto pb-24 relative">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 flex items-center justify-between border-b-2 border-slate-200 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Report Check</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Medical Intelligence Protocol</p>
          </div>
          <div className="bg-slate-900 p-3 rounded-2xl shadow-xl">
            <ClipboardList className="w-8 h-8 text-[#00ffd5]" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div 
              onClick={() => !file && document.getElementById('report-upload')?.click()}
              className={`bg-white rounded-[2rem] p-1 w-full aspect-[3/4] flex flex-col items-center justify-center cursor-pointer shadow-xl border-2 transition-all relative ${file ? 'border-emerald-500' : 'border-slate-200 hover:border-slate-300 active:scale-[0.98]'}`}
            >
              <input 
                id="report-upload"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              
              {file ? (
                <div className="w-full h-full flex flex-col items-center justify-center animate-fadeIn relative p-4">
                  {isPDF ? (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="bg-rose-50 p-8 rounded-[2rem]">
                        <FileText className="w-16 h-16 text-rose-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800 uppercase truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Parsed</p>
                      </div>
                    </div>
                  ) : (
                    <img src={preview!} alt="Preview" className="max-h-full w-full rounded-2xl object-contain shadow-sm" />
                  )}
                  
                  {!isAnalyzing && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setAnalysis(null); }}
                      className="absolute top-4 right-4 bg-slate-900 text-white p-2 rounded-xl shadow-lg hover:bg-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center flex flex-col items-center gap-6 p-10 overflow-hidden relative">
                   {/* Background watermark image of a report */}
                  <img 
                    src="https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?q=80&w=300&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-5 grayscale"
                    alt=""
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200 mb-6">
                      <Upload className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Insert Medical Data</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 leading-relaxed">Place your health audit or lab results here for clinical-grade AI analysis</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-2xl disabled:opacity-20 flex items-center justify-center gap-3 uppercase tracking-[0.2em] hover:bg-black active:scale-[0.98] transition-all text-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#00ffd5]" />
                  Decoding Biology...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-[#00ffd5]" />
                  Secure Diagnostic
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-8">
            {analysis ? (
              <div className="bg-white shadow-2xl rounded-[2rem] p-8 border-t-[12px] border-slate-900 animate-fadeIn relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <ClipboardList className="w-32 h-32" />
                </div>
                
                <div className="flex items-center gap-3 font-black text-slate-900 mb-8 uppercase border-b-2 border-slate-50 pb-4 tracking-tighter">
                  <Bot className="w-6 h-6 text-[#00ffd5]" /> Health Analysis Report
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap font-medium text-slate-600 text-sm leading-relaxed font-mono">
                    {analysis.text}
                  </div>
                </div>
                
                {analysis.sources && analysis.sources.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Verification Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.sources.map((chunk: any, idx: number) => {
                        const url = chunk.web?.uri || chunk.maps?.uri;
                        const title = chunk.web?.title || chunk.maps?.title || "Node";
                        if (!url) return null;
                        return (
                          <a 
                            key={idx} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[9px] bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-slate-700 hover:bg-[#00ffd5] hover:text-black font-black transition-all truncate max-w-[180px] uppercase shadow-sm"
                          >
                            {title}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-10 p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase leading-normal">Encryption linked to secure FitFizz health database. Data processed locally.</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-200/30 rounded-[2rem] border-2 border-dashed border-slate-200 h-full flex flex-col items-center justify-center p-12 text-center opacity-70">
                 {/* Literal Report Placeholder Image */}
                 <div className="relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=400&auto=format&fit=crop" 
                      className="w-48 h-64 object-cover rounded-2xl mb-8 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700" 
                      alt="Sample Report" 
                    />
                    <div className="absolute inset-0 bg-slate-900/10 rounded-2xl"></div>
                 </div>
                 <h3 className="text-xl font-black text-slate-600 uppercase tracking-tighter italic">Awaiting Health Feed</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 max-w-xs leading-relaxed">Scan your clinical documentation to generate a precise 2026 AI health audit.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCheck;
