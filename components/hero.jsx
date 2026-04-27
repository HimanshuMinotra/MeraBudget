"use client";
import Link from "next/link";
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {

    const imageRef = useRef()

    useEffect(() =>{
        const imageElement = imageRef.current;

        const handleScroll=()=>{
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if(scrollPosition>scrollThreshold){
                imageElement.classList.add("scrolled");
            } else{
                imageElement.classList.remove("scrolled");
            }

        };
        window.addEventListener("scroll",handleScroll, { passive: true })

        return ()=>window.removeEventListener("scroll", handleScroll);
    },[]);

  return (
    <div className="pb-20 px-4 relative">
      <div className="container mx-auto text-center space-y-16">
        <div className="space-y-6 pt-20 flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl lg:text-[140px] font-black pb-8 leading-none tracking-tighter drop-shadow-[0_0_50px_rgba(168,85,247,0.4)] text-center w-full">
            <span className="text-white">Mera</span>
            <span className="text-purple-500 ml-2">Budget</span>
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            Experience the future of finance. The ultimate MeraBudget management platform 
            powered by <span className="text-white font-medium">cosmic intelligence</span> and precision analytics.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-8">
          <Link href="/dashboard">
            <Button size="lg" className="px-14 py-9 text-2xl group">
              Get Started <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="px-14 py-9 text-2xl backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              Explore Features
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-32 group perspective-2000">
          <div ref={imageRef} className="hero-image relative transition-all duration-1000 ease-out">
            <div className="absolute -inset-10 bg-gradient-to-r from-primary/30 to-primary/30 rounded-[3rem] blur-[120px] opacity-40 group-hover:opacity-80 transition duration-1000"></div>
            <div className="relative glass-card border-white/10 p-3 overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)] rounded-[2.5rem]">
               <Image
                src="/bannerr.png"
                width={1400}
                height={800}
                alt="Dashboard Preview"
                className="rounded-[2rem] shadow-2xl relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection