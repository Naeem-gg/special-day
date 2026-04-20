"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Send, 
  Layout, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { FloatingHearts } from "@/components/floating-hearts";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <FloatingHearts />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-serif text-xl tracking-tight text-foreground">EternalInvitation</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm font-medium">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Premium Digital Stationery</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-serif text-foreground leading-[1.1]">
                Invite Your Loved Ones with <span className="text-primary italic">Elegance</span>
              </h1>
              <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-lg">
                Create a stunning, interactive digital wedding invitation in minutes. Mobile-first, globally accessible, and truly unforgettable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-base gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    Start Creating <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/invite/demo">
                  <Button size="lg" variant="outline" className="border-border hover:bg-muted rounded-full px-8 h-14 text-base">
                    View Live Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                       <Image src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" width={40} height={40} />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Join <span className="font-bold text-foreground">500+</span> couples this year
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-border/20">
                <Image 
                  src="/images/hero-bg.png" 
                  alt="Wedding Preview" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Card UI Mock */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-xl"
                >
                   <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold">Our Special Day</p>
                        <p className="text-xl font-serif text-white">Oliver & Isabella</p>
                     </div>
                     <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                     </div>
                   </div>
                </motion.div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Exquisite Features</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-foreground">Everything you need for the perfect invite</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layout className="w-6 h-6 text-primary" />}
              title="Modern Templates"
              description="Apple-inspired minimalist designs that focus on what matters: your love story."
            />
            <FeatureCard 
              icon={<Send className="w-6 h-6 text-primary" />}
              title="Instant Delivery"
              description="Share via WhatsApp, Instagram, or Email with a single click. No printing required."
            />
            <FeatureCard 
              icon={<ImageIcon className="w-6 h-6 text-primary" />}
              title="Moment Gallery"
              description="A beautiful carousel of your pre-wedding photos for guests to admire."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-serif text-center mb-16">Three Simple Steps</h2>
          <div className="grid md:grid-cols-1 gap-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-serif shrink-0 shadow-lg shadow-primary/20">1</div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold">Enter Your Details</h4>
                <p className="text-muted-foreground font-light">Input your wedding date, venue, and events into our intuitive dashboard.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-serif shrink-0 shadow-lg shadow-primary/20">2</div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold">Upload Your Memories</h4>
                <p className="text-muted-foreground font-light">Add your favorite photos to create a personalized gallery that wows your guests.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-serif shrink-0 shadow-lg shadow-primary/20">3</div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold">Launch & Share</h4>
                <p className="text-muted-foreground font-light">Generate your unique link and start inviting your loved ones instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
            <Heart className="w-3 h-3 text-primary fill-primary" />
          </div>
          <span className="font-serif text-lg tracking-tight">EternalInvitation</span>
        </div>
        <p className="text-sm text-muted-foreground">© 2026 EternalInvitation. All rights reserved.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 bg-white border border-border/10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-serif text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground font-light leading-relaxed">{description}</p>
    </motion.div>
  );
}
