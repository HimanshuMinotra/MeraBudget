"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

const MonthlySummary = ({ transactions = [] }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthTransactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const expenses = monthTransactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const balance = income - expenses;

  const stats = [
    { label: "Monthly Income", value: income, icon: <TrendingUp className="text-green-400" />, color: "text-green-400", change: <ArrowUpRight size={12}/> },
    { label: "Monthly Expenses", value: expenses, icon: <TrendingDown className="text-rose-400" />, color: "text-rose-400", change: <ArrowDownRight size={12}/> },
  ];

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-primary">
          Monthly Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[calc(100%-60px)]">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 opacity-70">
                {stat.icon}
                <span className="text-[10px] font-bold uppercase tracking-tight">{stat.label}</span>
              </div>
              <div className={`text-lg font-black ${stat.color} flex items-center gap-1`}>
                ₹{stat.value.toLocaleString()}
                <span className="opacity-50">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">In-Network Balance</p>
            <p className="text-2xl font-black text-white">₹{balance.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
            <Wallet className="text-primary h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlySummary;
