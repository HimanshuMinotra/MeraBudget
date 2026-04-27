import HeroSection from "../components/hero";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "../data/landing";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-secondary/30 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl md:text-6xl font-black text-white mb-3 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                   {stat.value}
                </div>
                <div className="text-muted-foreground text-xs uppercase tracking-[0.3em] font-bold">
                   {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-24 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
              ADVANCED <span className="text-primary glow-text">FINANCIAL ENGINE</span>
            </h2>
            <p className="text-muted-foreground text-xl md:text-2xl font-light">
              Everything you need to master your MeraBudget, powered by intelligent insights and celestial precision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuresData.map((feature, index) => (
              <Card key={index} className="glass-card group hover:-translate-y-3 transition-all duration-500 border-white/5 hover:border-primary/40 bg-secondary/20">
                <CardContent className="space-y-8 pt-10 px-8 pb-12">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                    {feature.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">{feature.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed font-light">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-secondary/20 border-y border-white/5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] -z-10 rounded-full" />
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-24 text-white tracking-tighter">
            SIMPLE <span className="text-primary">WORKFLOW</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center relative group">
                <div className="w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/10 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {step.icon}
                </div>
                <h3 className="text-3xl font-bold mb-6 text-white tracking-tight">{step.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-[280px] mx-auto font-light">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-10 text-white/5 group-hover:text-primary/20 transition-all duration-700 animate-pulse">
                    <ArrowRight size={48} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-24 text-white tracking-tighter">
            TRUSTED BY <span className="text-primary">PROFESSIONALS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonialsData.map((testimonial, index) => (
              <Card key={index} className="glass-card hover:border-primary/30 transition-all duration-500 bg-secondary/10">
                <CardContent className="pt-10 px-8 pb-10 space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="p-1 rounded-full bg-gradient-to-tr from-primary to-violet-500 shadow-lg shadow-primary/20">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full border border-white/20"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xl tracking-tight">{testimonial.name}</div>
                      <div className="text-xs text-primary uppercase tracking-[0.2em] font-black">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex text-primary/80 gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                  <p className="text-muted-foreground italic text-lg leading-relaxed font-light">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="relative overflow-hidden rounded-[3rem] glass-card p-16 md:p-32 text-center space-y-12 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] bg-secondary/40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-violet-600/20 -z-10" />
          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              READY TO <br /> <span className="text-primary glow-text">EVOLVE?</span>
            </h2>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Join the elite users who have mastered their MeraBudget with cosmic intelligence and precision.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link href="/dashboard">
              <Button size="lg" className="px-16 py-10 text-2xl group">
                Get Started <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-16 py-10 text-2xl backdrop-blur-xl">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
