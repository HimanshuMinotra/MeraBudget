"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Home, LayoutDashboard, PenBox, CalendarCheck, Target, Users2, FileBarChart, Search } from "lucide-react";
import { Button } from "./ui/button";
import SearchModal from "./search-modal";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className={`sticky top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-black/60 backdrop-blur-xl border-b border-white/10 py-2" 
        : "bg-black/40 backdrop-blur-xl border-b border-white/5 py-4"
    }`}>
      <nav className="container mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 h-full py-1">
          <div className="relative h-10 md:h-12 w-48">
            <Image
              src={"/logo-merabudget.png"}
              alt="MeraBudget Logo"
              fill
              className="object-contain transition-all duration-500 hover:scale-105 brightness-150 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            />
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center justify-center gap-6">
          <Show when="signed-in">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link href="/bills" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <CalendarCheck size={16} />
              <span>Bills</span>
            </Link>
            <Link href="/goals" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <Target size={16} />
              <span>Goals</span>
            </Link>
            <Link href="/split" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <Users2 size={16} />
              <span>Split</span>
            </Link>
            <Link href="/reports" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <FileBarChart size={16} />
              <span>Reports</span>
            </Link>
          </Show>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Show when="signed-in">
            <Button 
               variant="ghost" 
               size="icon" 
               onClick={() => setIsSearchOpen(true)}
               className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
               title="Search (Ctrl+K)"
            >
              <Search size={20} />
            </Button>
          </Show>
          
          <Show when="signed-in">
            <Link href={"/transaction/create"}>
              <Button variant="default" size="sm" className="btn-galaxy">
                <PenBox size={16} className="mr-1.5" />
                <span className="hidden md:inline">Transaction</span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-white/20 hover:border-purple-500/50 transition-all",
                },
              }}
            />
          </Show>

          <Show when="signed-out">
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" size="default" className="border-white/20 text-white hover:bg-white/10 rounded-2xl text-sm font-semibold backdrop-blur-md">
                Login
              </Button>
            </SignInButton>
          </Show>
        </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
