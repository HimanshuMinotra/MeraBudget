"use client";

import { useEffect, useState } from "react";
import { getGoals, createGoal, updateGoalProgress, deleteGoal } from "@/actions/goals";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Trash2, Edit3, Plus } from "lucide-react";
import { toast } from "sonner";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [contribution, setContribution] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const result = await getGoals();
    if (result.success) setGoals(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!name || !targetAmount) return;
    setLoading(true);
    const result = await createGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      monthlyContribution: parseFloat(contribution) || 0,
      currentAmount: 0,
    });
    if (result.success) {
      toast.success("Goal created!");
      setName("");
      setTargetAmount("");
      setContribution("");
      fetchData();
    }
    setLoading(false);
  };

  const handleUpdate = async (id, newAmount) => {
    const result = await updateGoalProgress(id, parseFloat(newAmount));
    if (result.success) {
      toast.success("Progress updated!");
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteGoal(id);
    if (result.success) {
      toast.success("Goal deleted");
      fetchData();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 space-y-12 page-fade-in">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-black uppercase tracking-tight text-white">Financial Goals</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Set and track your savings goals.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="glass-card shadow-primary/5 lg:col-span-1 h-fit">
          <CardHeader className="standard-header">
            <span className="text-primary uppercase tracking-widest">Add Goals</span>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Goal Name</label>
              <Input placeholder="E.G. HOUSE, VACATION, EMERGENCY FUND" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/5 border-white/10 text-white font-bold h-11 rounded-xl focus:ring-primary/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Amount (₹)</label>
              <Input type="number" placeholder="0.00" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="bg-white/5 border-white/10 text-white font-bold h-11 rounded-xl focus:ring-primary/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Monthly Contribution (₹)</label>
              <Input type="number" placeholder="0.00" value={contribution} onChange={(e) => setContribution(e.target.value)} className="bg-white/5 border-white/10 text-white font-bold h-11 rounded-xl focus:ring-primary/50" />
            </div>
            <Button onClick={handleCreate} disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-[0.3em] rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 mt-4">
              {loading ? "SAVING..." : "CREATE GOAL"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100;
            return (
              <Card key={goal.id} className="glass-card group">
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                      <Target size={24} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 transition-all rounded-full h-10 w-10">
                      <Trash2 size={20} />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-lg text-white uppercase tracking-widest">{goal.name}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Target: <span className="text-white">₹{Number(goal.targetAmount).toLocaleString()}</span></p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{progress.toFixed(1)}% Complete</span>
                      <span className="text-xs font-semibold text-white">₹{Number(goal.currentAmount).toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)] transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 items-end">
                    <div className="flex-1 space-y-1.5">
                       <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Add Funds</label>
                      <Input 
                        type="number" 
                        placeholder="AMOUNT" 
                        className="h-10 text-[10px] font-black bg-white/5 border-white/10 rounded-xl focus:ring-primary/50" 
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleUpdate(goal.id, Number(goal.currentAmount) + parseFloat(e.target.value));
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                    <Button size="sm" variant="outline" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">Add</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
