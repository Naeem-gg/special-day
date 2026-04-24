"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOverview, InvitationManager, CouponManager, TierManager, AdminSettings, GiftInviteManager } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Ticket, Users, CreditCard, Settings, Gift } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";

interface AdminClientPageProps {
  initialStats: any;
  initialInvitations: any[];
  initialCoupons: any[];
  initialTiers: any[];
}

export function AdminClientPage({ initialStats, initialInvitations, initialCoupons, initialTiers }: AdminClientPageProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/adminn/login");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar/Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <DNvitesLogo className="h-6 w-auto" />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="secondary" size="sm">Site View</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">DNvites Admin</h1>
              <p className="text-gray-500">Control your invitations, discount codes, and plans.</p>
            </div>
            <TabsList className="bg-white border shadow-sm h-14 p-1 flex overflow-x-auto w-full justify-start md:h-11 md:justify-center overflow-y-hidden scrollbar-hide">
              <TabsTrigger value="overview" className="flex gap-2 whitespace-nowrap">
                <LayoutDashboard className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="invitations" className="flex gap-2 whitespace-nowrap">
                <Users className="w-4 h-4" /> Invitations
              </TabsTrigger>
              <TabsTrigger value="coupons" className="flex gap-2 whitespace-nowrap">
                <Ticket className="w-4 h-4" /> Discount Codes
              </TabsTrigger>
              <TabsTrigger value="tiers" className="flex gap-2 whitespace-nowrap">
                <CreditCard className="w-4 h-4" /> Invitation Plans
              </TabsTrigger>
              <TabsTrigger value="gift" className="flex gap-2 whitespace-nowrap text-rose-600 bg-rose-50/50">
                <Gift className="w-4 h-4" /> Gift Invite
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex gap-2 whitespace-nowrap">
                <Settings className="w-4 h-4" /> Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <AdminOverview initialStats={initialStats} />
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <InvitationManager initialInvitations={initialInvitations} />
          </TabsContent>

          <TabsContent value="coupons" className="space-y-4">
            <CouponManager initialCoupons={initialCoupons} />
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            <TierManager initialTiers={initialTiers} />
          </TabsContent>

          <TabsContent value="gift" className="space-y-4">
            <GiftInviteManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
