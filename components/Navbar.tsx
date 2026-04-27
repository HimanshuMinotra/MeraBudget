"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { 
  Home, 
  LayoutDashboard, 
  PenBox, 
  CalendarCheck, 
  Target, 
  Users2, 
  FileBarChart, 
  Search,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import SearchModal from "./search-modal";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

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

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/bills", label: "Bills", icon: CalendarCheck },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/split", label: "Split", icon: Users2 },
    { href: "/reports", label: "Reports", icon: FileBarChart },
  ];

  return (
    <header className={`sticky top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${
      isScrolled 
        ? "bg-black/60 backdrop-blur-xl border-b border-white/10 py-2" 
        : "bg-black/40 backdrop-blur-xl border-b border-white/5 py-4"
    }`}>
      <nav className="container mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 h-full py-1">
          <div className="relative h-8 md:h-10 w-32 md:w-40">
            <Image
              src={"/logo-merabudget-v3.png"}
              alt="MeraBudget Logo"
              fill
              priority
              className="object-contain transition-all duration-500 hover:scale-105 brightness-150 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center justify-center gap-6">
          <Show when="signed-in">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <link.icon size={16} />
                <span>{link.label}</span>
              </Link>
            ))}
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
            <Link href={"/transaction/create"} className="hidden sm:block">
              <Button variant="default" size="sm" className="btn-galaxy">
                <PenBox size={16} className="mr-1.5" />
                <span>Transaction</span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 md:w-9 md:h-9 border-2 border-white/20 hover:border-purple-500/50 transition-all",
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

          {/* Mobile Menu Toggle */}
          <Show when="signed-in">
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <Menu size={24} />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#0a0818]/95 border-l border-white/10 backdrop-blur-2xl">
                <DrawerHeader className="border-b border-white/10 pb-6">
                  <DrawerTitle className="text-left text-xl font-bold text-gradient">Menu</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-2 p-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className="flex items-center gap-4 p-4 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-500/20 transition-colors">
                        <link.icon size={20} />
                      </div>
                      <span className="text-lg font-medium">{link.label}</span>
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/10 sm:hidden">
                    <Link href={"/transaction/create"}>
                      <Button variant="default" size="lg" className="w-full btn-galaxy py-6 text-lg">
                        <PenBox size={20} className="mr-2" />
                        Add Transaction
                      </Button>
                    </Link>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </Show>
        </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
