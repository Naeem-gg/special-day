"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Ticket, 
  TrendingUp, 
  Trash2, 
  Plus, 
  CheckCircle, 
  XCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";

// --- AdminOverview ---
export function AdminOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then(res => res.json()).then(data => setStats(data.stats));
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  const statCards = [
    { title: "Total Invitations", value: stats.totalInvitations, icon: Users, color: "text-blue-600" },
    { title: "Total RSVPs", value: stats.totalRSVPs, icon: CheckCircle, color: "text-green-600" },
    { title: "Active Coupons", value: stats.activeCoupons, icon: Ticket, color: "text-purple-600" },
    { title: "Estimated Revenue", value: `₹${stats.estimatedRevenue}`, icon: TrendingUp, color: "text-orange-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- InvitationManager ---
export function InvitationManager() {
  const [invitations, setInvitations] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/invitations").then(res => res.json()).then(setInvitations);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this invitation?")) return;
    const res = await fetch("/api/admin/invitations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setInvitations(invs => invs.filter(i => i.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Invitations</CardTitle>
        <CardDescription>View and manage all wedding invitations created on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Couple</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Tier</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => (
                <tr key={inv.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {inv.brideName} & {inv.groomName}
                  </td>
                  <td className="px-6 py-4">/{inv.slug}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs">{inv.tier}</span>
                  </td>
                  <td className="px-6 py-4">{format(new Date(inv.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(inv.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- CouponManager ---
export function CouponManager() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    usageLimit: "",
  });

  useEffect(() => {
    fetch("/api/admin/coupons").then(res => res.json()).then(setCoupons);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newCoupon,
        discountValue: parseInt(newCoupon.discountValue),
        usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCoupons([data, ...coupons]);
      setIsAdding(false);
      setNewCoupon({ code: "", discountType: "percentage", discountValue: "", usageLimit: "" });
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch("/api/admin/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setCoupons(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Coupon Management</h2>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Coupon</>}
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader><CardTitle>Create New Coupon</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <Label>Code</Label>
                <Input 
                  placeholder="SAVE20" 
                  value={newCoupon.code} 
                  onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={newCoupon.discountType}
                  onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Value</Label>
                <Input 
                  type="number" 
                  value={newCoupon.discountValue}
                  onChange={e => setNewCoupon({...newCoupon, discountValue: e.target.value})}
                  required 
                />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Used</th>
                  <th className="px-6 py-3">Limit</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{coupon.code}</td>
                    <td className="px-6 py-4">
                      {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4">{coupon.usedCount}</td>
                    <td className="px-6 py-4">{coupon.usageLimit || "∞"}</td>
                    <td className="px-6 py-4">
                      {coupon.active ? (
                        <span className="flex items-center text-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>
                      ) : (
                        <span className="flex items-center text-red-600"><XCircle className="w-3 h-3 mr-1" /> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(coupon.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- TierManager ---
export function TierManager() {
  const [tiers, setTiers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/tiers").then(res => res.json()).then(setTiers);
  }, []);

  const handleUpdatePrice = async (id: number, price: number) => {
    const res = await fetch("/api/admin/tiers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price }),
    });
    if (res.ok) {
      setTiers(prev => prev.map(t => t.id === id ? {...t, price} : t));
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((tier) => (
        <Card key={tier.id}>
          <CardHeader>
            <CardTitle>{tier.name}</CardTitle>
            <CardDescription className="capitalize">Tier: {tier.slug}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Price (₹)</Label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  defaultValue={tier.price}
                  onBlur={(e) => handleUpdatePrice(tier.id, parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- AdminSettings ---
export function AdminSettings() {
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({ otp: "", username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    setMessage("Sending OTP...");
    const res = await fetch("/api/admin/otp", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setOtpSent(true);
      setMessage("OTP sent to your email!");
    } else {
      setMessage(data.error || "Failed to send OTP.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Updating...");
    const res = await fetch("/api/admin/credentials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Credentials updated successfully!");
      setOtpSent(false);
      setFormData({ otp: "", username: "", password: "" });
    } else {
      setMessage(data.error || "Failed to update credentials.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
        <CardDescription>Update your username and password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!otpSent ? (
          <Button onClick={handleSendOtp} className="w-full">Request OTP via Email</Button>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>OTP</Label>
              <Input
                placeholder="6-digit code"
                value={formData.otp}
                onChange={e => setFormData({ ...formData, otp: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>New Username</Label>
              <Input
                placeholder="admin"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">Update Credentials</Button>
          </form>
        )}
        {message && <p className="text-sm text-center text-gray-600 mt-2">{message}</p>}
      </CardContent>
    </Card>
  );
}
