"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOverview, InvitationManager, CouponManager, TierManager, AdminSettings } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Ticket, Users, CreditCard, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DNvitesLogo } from "@/components/branding/DNvitesLogo";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar/Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <DNvitesLogo className="h-6 w-auto" />
          <span>Admin Panel</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">Site View</Button>
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
            <TabsList className="bg-white border shadow-sm h-11 p-1">
              <TabsTrigger value="overview" className="flex gap-2">
                <LayoutDashboard className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="invitations" className="flex gap-2">
                <Users className="w-4 h-4" /> Invitations
              </TabsTrigger>
              <TabsTrigger value="coupons" className="flex gap-2">
                <Ticket className="w-4 h-4" /> Discount Codes
              </TabsTrigger>
              <TabsTrigger value="tiers" className="flex gap-2">
                <CreditCard className="w-4 h-4" /> Invitation Plans
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex gap-2">
                <Settings className="w-4 h-4" /> Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <InvitationManager />
          </TabsContent>

          <TabsContent value="coupons" className="space-y-4">
            <CouponManager />
          </TabsContent>

          <TabsContent value="tiers" className="space-y-4">
            <TierManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
