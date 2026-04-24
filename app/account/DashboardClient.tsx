"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";
import { Calendar, Eye, Settings, Share2, Plus, ArrowRight, BarChart3, Users, TrendingUp, ExternalLink, X, Trash2, Download, CheckCircle2, XCircle, Loader2, Edit3, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const TIER_GRADIENT: Record<string, string> = {
  basic: "from-rose-100 to-amber-100",
  standard: "from-rose-100 via-rose-200 to-amber-100",
  premium: "from-amber-200 via-rose-200 to-purple-200",
};

const TIER_BADGE_STYLE: Record<string, string> = {
  basic: "bg-rose-50 text-rose-600 border-rose-100",
  standard: "bg-blue-50 text-blue-600 border-blue-100",
  premium: "bg-amber-50 text-amber-600 border-amber-100",
};

export function DashboardClient({ email, invitations }: { email: string; invitations: any[] }) {
  const [selectedInvite, setSelectedInvite] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const fetchRsvps = async (inviteId: number) => {
    setIsLoadingRsvps(true);
    try {
      const res = await fetch(`/api/rsvp/${inviteId}`);
      const data = await res.json();
      if (res.ok) {
        setRsvps(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch RSVPs:", err);
    } finally {
      setIsLoadingRsvps(false);
    }
  };

  const handleDeleteRsvp = async (rsvpId: number) => {
    if (!confirm("Are you sure you want to remove this RSVP?")) return;

    try {
      const res = await fetch(`/api/rsvp/${selectedInvite.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvpId }),
      });
      if (res.ok) {
        setRsvps(prev => prev.filter(r => r.id !== rsvpId));
      }
    } catch (err) {
      console.error("Failed to delete RSVP:", err);
    }
  };

  const downloadRsvpsCsv = () => {
    if (!rsvps.length) return;
    const headers = ["Name", "Guests", "Attending", "Date"];
    const rows = rsvps.map(r => [
      r.name,
      r.guests,
      r.attending ? "Yes" : "No",
      format(new Date(r.createdAt), "yyyy-MM-dd HH:mm")
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rsvps-${selectedInvite.slug}.csv`);
    link.click();
  };

  useEffect(() => {
    if (selectedInvite) {
      fetchRsvps(selectedInvite.id);
    } else {
      setRsvps([]);
    }
  }, [selectedInvite]);

  const totalViews = invitations.reduce((sum, inv) => sum + (inv.views || 0), 0);
  const totalInvitations = invitations.length;

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
            <p className="text-slate-500 mt-1">Manage your invitations and track engagement</p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-[#F43F8F] hover:bg-[#d82a75] text-white rounded-full shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Create New Invite
            </Button>
          </Link>
        </div>

        {/* ── Analytics Overview ────────────── */}
        {totalInvitations > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-[#F43F8F]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{totalInvitations}</p>
                    <p className="text-xs text-slate-500 font-medium">Total Invitations</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{totalViews}</p>
                    <p className="text-xs text-slate-500 font-medium">Total Views</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {totalInvitations > 0 ? Math.round(totalViews / totalInvitations) : 0}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Avg. Views per Invite</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

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
                <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-slate-200 group">
                  <div className={`h-36 bg-linear-to-r ${TIER_GRADIENT[invite.tier] || TIER_GRADIENT.basic} relative`}>
                    {/* View count badge */}
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm border border-white/50">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-bold text-slate-700">{invite.views || 0}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50">
                      <p className="font-serif text-lg text-slate-900 truncate">
                        {invite.brideName} & {invite.groomName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${TIER_BADGE_STYLE[invite.tier] || TIER_BADGE_STYLE.basic}`}>
                          {invite.tier} Plan
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {invite.template}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-600 gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {format(new Date(invite.date), "MMMM do, yyyy")}
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-4 py-3 border-y border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="font-semibold text-slate-700">{invite.views || 0}</span> views
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="font-semibold text-slate-700">—</span> RSVPs
                      </div>
                      {/* 48h Edit Indicator */}
                      {(() => {
                        const hoursLeft = 48 - (new Date().getTime() - new Date(invite.createdAt).getTime()) / (1000 * 60 * 60);
                        if (hoursLeft > 0) {
                          return (
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 ml-auto">
                              <Clock className="w-3 h-3" />
                              {Math.ceil(hoursLeft)}h left to edit
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/invite/${invite.slug}`} target="_blank" className="w-full">
                        <Button variant="outline" className="w-full justify-between group/btn border-slate-200">
                          View Invitation
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover/btn:text-slate-600" />
                        </Button>
                      </Link>

                      {/* Edit Button (within 48h) */}
                      {(() => {
                        const isEditable = (new Date().getTime() - new Date(invite.createdAt).getTime()) / (1000 * 60 * 60) < 48;
                        if (isEditable) {
                          return (
                            <Link href={`/dashboard?edit=${invite.slug}`} className="w-full">
                              <Button className="w-full justify-between bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm">
                                Edit Details
                                <Edit3 className="w-4 h-4 text-[#F43F8F]" />
                              </Button>
                            </Link>
                          );
                        }
                        return null;
                      })()}

                      {invite.tier !== "basic" && (
                        <Button
                          variant="secondary"
                          className="w-full justify-between group/btn bg-slate-100 hover:bg-slate-200"
                          onClick={() => setSelectedInvite(invite)}
                        >
                          Manage RSVPs
                          <Settings className="w-4 h-4 text-slate-500 group-hover/btn:text-slate-700" />
                        </Button>
                      )}

                      <Button variant="ghost" className="w-full justify-between text-slate-400 hover:text-slate-600"
                        onClick={() => navigator.share?.({ title: `${invite.brideName} & ${invite.groomName}`, url: `${window.location.origin}/invite/${invite.slug}` }).catch(() => { })}>
                        Share Invitation
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* ── RSVP Manager Modal ──────────── */}
      <Dialog open={!!selectedInvite} onOpenChange={(open) => !open && setSelectedInvite(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-3xl shadow-2xl">
          <div className={`h-32 bg-linear-to-r ${selectedInvite ? TIER_GRADIENT[selectedInvite.tier] : "from-rose-50 to-amber-50"} flex items-end p-6`}>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50 w-full flex justify-between items-center translate-y-8">
              <div>
                <h3 className="text-xl font-serif text-slate-900">
                  {selectedInvite?.brideName} & {selectedInvite?.groomName}
                </h3>
                <p className="text-xs text-slate-500">RSVP Management Dashboard</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#F43F8F]">{rsvps.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total RSVPs</p>
              </div>
            </div>
          </div>

          <div className="pt-12 px-6 pb-6 space-y-6">
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-slate-600">
                    {rsvps.filter(r => r.attending).length} Attending
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="text-xs font-medium text-slate-600">
                    {rsvps.filter(r => !r.attending).length} Declined
                  </span>
                </div>
              </div>
              {rsvps.length > 0 && (
                <Button variant="outline" size="sm" onClick={downloadRsvpsCsv} className="h-8 text-[10px] font-bold uppercase tracking-wider">
                  <Download className="w-3 h-3 mr-1.5" /> Export CSV
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {isLoadingRsvps ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-rose-200 animate-spin" />
                  <p className="text-sm text-slate-400">Loading guest list...</p>
                </div>
              ) : rsvps.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 font-medium">No RSVPs received yet</p>
                  <p className="text-xs text-slate-400 mt-1">They will appear here once guests respond.</p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {rsvps.map((rsvp) => (
                    <div key={rsvp.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-rose-100 transition-colors shadow-xs group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${rsvp.attending ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"}`}>
                          {rsvp.attending ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{rsvp.name}</p>
                          <p className="text-xs text-slate-500">
                            {rsvp.guests} {rsvp.guests === 1 ? "Guest" : "Guests"} • {format(new Date(rsvp.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRsvp(rsvp.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

