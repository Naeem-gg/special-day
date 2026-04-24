"use client";

import { useState } from "react";
import { AdminOverview, InvitationManager, CouponManager, TierManager, AdminSettings, GiftInviteManager } from "@/components/admin/AdminDashboard";
import { TestimonialManager } from "@/components/admin/TestimonialManager";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Ticket, Users, CreditCard, Settings, Gift, MessageSquare, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";

interface AdminClientPageProps {
  initialStats: any;
  initialInvitations: any[];
  initialCoupons: any[];
  initialTiers: any[];
  initialTestimonials: any[];
}

export function AdminClientPage({ 
  initialStats, 
  initialInvitations, 
  initialCoupons, 
  initialTiers,
  initialTestimonials 
}: AdminClientPageProps) {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>("stats");

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/adminn/login");
  };

  const sections = [
    { id: "stats", label: "Business Stats", icon: LayoutDashboard, component: <AdminOverview initialStats={initialStats} /> },
    { id: "invitations", label: "Manage Invitations", icon: Users, component: <InvitationManager initialInvitations={initialInvitations} /> },
    { id: "coupons", label: "Discount Coupons", icon: Ticket, component: <CouponManager initialCoupons={initialCoupons} /> },
    { id: "tiers", label: "Pricing & Plans", icon: CreditCard, component: <TierManager initialTiers={initialTiers} /> },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare, component: <TestimonialManager initialTestimonials={initialTestimonials} /> },
    { id: "gift", label: "Gift an Invite", icon: Gift, component: <GiftInviteManager /> },
    { id: "settings", label: "Account Settings", icon: Settings, component: <AdminSettings /> },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
    // Smooth scroll to the expanded section after a tiny delay
    if (expandedSection !== id) {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD]">
      {/* Premium Top Bar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-rose-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-rose-50 rounded-lg">
            <DNvitesLogo className="h-5 w-auto" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-300 hidden sm:block">Admin Portal</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button variant="ghost" size="sm" className="text-[11px] font-bold text-gray-500 hover:text-[#F43F8F] uppercase tracking-wider">
              Site View
            </Button>
          </Link>
          <div className="h-4 w-px bg-gray-100 mx-2" />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="text-[11px] font-bold text-red-400 hover:text-red-500 hover:bg-red-50 uppercase tracking-wider"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-3 pb-24">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div 
              key={section.id} 
              id={section.id}
              className={`group bg-white border border-gray-100 rounded-[2rem] transition-all duration-500 overflow-hidden ${
                isExpanded ? "ring-2 ring-rose-50 shadow-2xl shadow-rose-100/40" : "hover:border-rose-100 hover:shadow-lg hover:shadow-rose-50/50"
              }`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl transition-all duration-500 ${
                    isExpanded ? "bg-[#F43F8F] text-white rotate-6" : "bg-gray-50 text-gray-400 group-hover:bg-rose-50 group-hover:text-[#F43F8F]"
                  }`}>
                    <section.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold transition-colors ${isExpanded ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"}`}>
                      {section.label}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                      {isExpanded ? "Collapse Section" : "Click to manage"}
                    </p>
                  </div>
                </div>
                <div className={`transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}>
                  <ChevronDown className={`w-5 h-5 ${isExpanded ? "text-[#F43F8F]" : "text-gray-300"}`} />
                </div>
              </button>

              <div 
                className={`transition-all duration-700 ease-in-out ${
                  isExpanded ? "max-h-[3000px] opacity-100 border-t border-gray-50" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                <div className="p-6 md:p-10 bg-linear-to-b from-white to-gray-50/30">
                  {section.component}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none bg-linear-to-t from-white via-white/80 to-transparent">
        <div className="max-w-5xl mx-auto flex justify-center">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">DNvites Premium Control</p>
        </div>
      </div>
    </div>
  );
}
