"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users2, Plus, Trash2, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function SplitPage() {
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState("");
  const [people, setPeople] = useState([{ name: "You", share: 0 }, { name: "", share: 0 }]);

  const addPerson = () => {
    setPeople([...people, { name: "", share: 0 }]);
  };

  const removePerson = (index) => {
    if (people.length <= 2) return;
    const newPeople = [...people];
    newPeople.splice(index, 1);
    setPeople(newPeople);
  };

  const updateName = (index, name) => {
    const newPeople = [...people];
    newPeople[index].name = name;
    setPeople(newPeople);
  };

  const calculateSplit = () => {
    if (!total || isNaN(parseFloat(total))) {
      toast.error("Please enter a valid total amount");
      return;
    }
    const share = parseFloat(total) / people.length;
    const newPeople = people.map(p => ({ ...p, share }));
    setPeople(newPeople);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-12 page-fade-in">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-black uppercase tracking-[0.2em] text-white glow-text">Split Expense</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Split bills and expenses equally among participants.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="glass-card shadow-primary/5">
          <CardHeader className="standard-header">
            <span className="text-primary uppercase tracking-widest">Add Expense</span>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <Input 
                  placeholder="E.G. DINNER, TRIP, GROCERIES" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="bg-white/5 border-white/10 text-white font-bold h-11 rounded-xl focus:ring-primary/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Amount (₹)</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={total} 
                    onChange={(e) => setTotal(e.target.value)} 
                    className="bg-white/5 border-white/10 text-white font-bold h-11 rounded-xl pl-8 focus:ring-primary/50"
                  />
                  <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-primary opacity-50" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Participants</h3>
                <Button variant="ghost" size="sm" onClick={addPerson} className="text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">
                  <Plus size={14} className="mr-2" /> Add Person
                </Button>
              </div>
              
              <div className="space-y-3">
                {people.map((person, index) => (
                  <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
                    <Input 
                      placeholder={`PERSON ${index + 1} NAME`} 
                      value={person.name} 
                      onChange={(e) => updateName(index, e.target.value)} 
                      className="bg-white/[0.03] border-white/10 text-white font-bold h-11 rounded-xl focus:ring-primary/50"
                      disabled={index === 0}
                    />
                    <div className="w-40 bg-primary/10 border border-primary/20 rounded-xl flex items-center px-4 text-xs text-white font-black glow-text shadow-inner">
                      ₹{Number(person.share).toFixed(2)}
                    </div>
                    {index > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removePerson(index)} className="text-red-500 hover:bg-red-500/10 h-11 w-11 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={calculateSplit} className="w-full h-14 bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-[0.5em] rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 text-lg">
              CALCULATE SPLIT
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
