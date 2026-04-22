"use client";

import Link from "next/link";
import { DNvitesLogo } from "./branding/DNvitesLogo";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Footer() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);
  return (
    <footer className="py-14 border-t border-rose-100 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2 space-y-4">
            <DNvitesLogo />
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Making your special day even more beautiful with modern, digital invitations that your guests will love.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-[#F43F8F] transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#F43F8F] transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-[#F43F8F] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#F43F8F] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-[#F43F8F] transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="hover:text-[#F43F8F] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-rose-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="text-xs text-muted-foreground font-light">
            Made with <span className="text-[#F43F8F]">❤️</span> for every couple's special day
          </p>
          <p className="text-xs text-muted-foreground">© 2026 DNvites — Dearest Invites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
