import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { getGoals } from "@/actions/goals";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Target } from "lucide-react";
import React, { Suspense } from "react";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budget-progress";
import DashboardOverview from "./_components/transaction-overview";
import UpcomingBills from "@/components/upcoming-bills";
import ReceiptScanner from "@/components/receipt-scanner";
import Achievements from "./_components/achievements";
import FutureSimulator from "@/components/future-simulator";
import Geofencing from "@/components/Geofencing";
import LifestyleTracker from "./_components/lifestyle-tracker";
import TaxStrategist from "./_components/tax-strategist";
import { TiltCard } from "@/components/ui/tilt-card";
import FinancialHeatmap from "@/components/financial-heatmap";
import MoodTracker from "./_components/mood-tracker";
import SalaryPlanner from "@/components/SalaryPlanner";
import MonthlySummary from "./_components/monthly-summary";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import GoalsCard from "./_components/goals-card";

async function DashboardPage({ searchParams }) {
  const { date } = (await searchParams) || {};
  const accounts = await getUserAccounts();
  const goalsResult = await getGoals();
  const goals = goalsResult.success ? goalsResult.data : [];
  
  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData(date);
  const allTransactions = await getDashboardData(); 

  return (
    <div className="dashboard-container mt-8 pb-20 space-y-8 page-fade-in px-4 overflow-y-visible">
      <div className="flex flex-col gap-8">
        
        {/* ── PRIORITY ROW: Create Account & Goals (New Top Position) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          <CreateAccountDrawer>
            <Card className="glass-card cursor-pointer group h-full text-center border-primary/20 hover:border-primary/50 transition-all">
              <CardContent className="flex flex-col items-center justify-center p-6 min-h-[160px] h-full">
                <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_20px_rgba(124,58,237,0.1)]">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xs font-black text-white uppercase tracking-widest">Create Account</p>
                <p className="text-[10px] text-slate-500 mt-1 italic">Manage your wallets</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>

          <GoalsCard goals={goals} />

          {/* Display first two accounts in the top row if they exist */}
          {accounts.slice(0, 2).map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>

        {/* ── ROW 2: Monthly Summary & Mood Tracker ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          <div className="lg:col-span-3">
             <MonthlySummary transactions={allTransactions || []} />
          </div>
          <div className="lg:col-span-2">
             <MoodTracker />
          </div>
        </div>

        {/* ── ROW 3: Spending Heatmap & Salary Smart Planner ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          <div className="lg:col-span-2">
             <FinancialHeatmap transactions={allTransactions || []} compact={true} />
             {date && (
               <div className="flex justify-end mt-2">
                 <Link href="/dashboard">
                   <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                     <X className="mr-2 h-4 w-4" /> Clear Filter: {date}
                   </Button>
                 </Link>
               </div>
             )}
          </div>
          <div className="lg:col-span-3">
             <SalaryPlanner />
          </div>
        </div>

        <Achievements />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <TiltCard><UpcomingBills /></TiltCard>
          <TiltCard><ReceiptScanner /></TiltCard>
          <TiltCard><Geofencing /></TiltCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <TiltCard><FutureSimulator /></TiltCard>
          </div>
          <div className="lg:col-span-1">
             <TaxStrategist />
          </div>
        </div>

        {defaultAccount && (
          <BudgetProgress
            initialBudget={budgetData?.budget}
            currentExpenses={budgetData?.currentExpenses || 0}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1">
            <LifestyleTracker />
          </div>
          <div className="lg:col-span-2">
            <Suspense fallback={"Loading Overview..."}>
              <DashboardOverview accounts={accounts} transactions={transactions || []} />
            </Suspense>
          </div>
        </div>

        {/* Remaining Accounts Grid */}
        {accounts.length > 2 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accounts.slice(2).map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;