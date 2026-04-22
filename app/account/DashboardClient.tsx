"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import { Calendar, Eye, Settings, Share2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function DashboardClient({ email, invitations }: { email: string; invitations: any[] }) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <DNvitesLogo />
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">{email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-slate-900">Your Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your invitations and track RSVPs</p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-[#F43F8F] hover:bg-[#d82a75] text-white rounded-full shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Create New Invite
            </Button>
          </Link>
        </div>

        {invitations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center py-16 border-dashed border-2 bg-slate-50 shadow-none">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-slate-900">No invitations yet</h3>
                  <p className="text-slate-500 max-w-sm">
                    You haven't created any wedding invitations yet. Start building your dream invite today!
                  </p>
                </div>
                <Link href="/dashboard" className="mt-4">
                  <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full">
                    Start Creating <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((invite, i) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-slate-200">
                  <div className="h-32 bg-linear-to-r from-rose-100 to-amber-100 relative">
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50">
                      <p className="font-serif text-lg text-slate-900 truncate">
                        {invite.brideName} & {invite.groomName}
                      </p>
                      <p className="text-xs font-semibold text-[#F43F8F] uppercase tracking-wider mt-0.5">
                        {invite.tier} Plan
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {format(new Date(invite.date), "MMMM do, yyyy")}
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                      <Link href={`/invite/${invite.slug}`} target="_blank" className="w-full">
                        <Button variant="outline" className="w-full justify-between group">
                          View Invitation
                          <Eye className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                        </Button>
                      </Link>
                      
                      <Button variant="secondary" className="w-full justify-between group bg-slate-100 hover:bg-slate-200">
                        Manage RSVPs
                        <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
