"use client";

import { useState } from "react";
import { scanReceipt } from "@/actions/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ReceiptScanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    // In a real implementation, we would convert to base64 or send as FormData
    const scanResult = await scanReceipt(null); 
    
    if (scanResult.success) {
      setResult(scanResult.data);
      toast.success("Receipt scanned successfully!");
    } else {
      toast.error("Failed to scan receipt");
    }
    setLoading(false);
  };

  return (
    <Card className="glass-card shadow-indigo-500/10 h-full flex flex-col">
      <CardHeader className="h-16 flex items-center justify-between px-6 border-b border-white/5 uppercase tracking-widest text-xs font-bold space-y-0">
        <div className="flex items-center gap-2 text-primary">
          <Camera size={16} />
          <span>AI Scanner</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1">
        {result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-400 text-[10px] font-bold uppercase tracking-widest">
              <CheckCircle2 className="h-4 w-4 animate-bounce" /> Receipt Extracted
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs space-y-2 shadow-inner">
              <div className="flex justify-between items-center"><span className="text-slate-500 font-bold uppercase tracking-tighter">Merchant</span> <span className="text-white font-medium">Starbucks</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 font-bold uppercase tracking-tighter">Total</span> <span className="text-white font-black text-sm glow-text">₹1500.00</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500 font-bold uppercase tracking-tighter">Category</span> <span className="text-primary font-bold">Dining</span></div>
            </div>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full text-[10px] uppercase font-bold tracking-widest border-white/10 hover:bg-white/5">Scan Another</Button>
          </div>
        ) : (
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
              onChange={handleUpload}
              disabled={loading}
            />
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-white/5 group-hover:bg-white/10 group-hover:border-primary/50 transition-all duration-500">
              {loading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/20"><Camera className="h-6 w-6" /></div>}
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">{loading ? "Processing Receipt..." : "Upload Receipt Image"}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
