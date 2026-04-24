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
  Clock,
  Edit,
  Copy,
  Check
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export function AdminOverview({ initialStats }: { initialStats: any }) {
  const [stats, setStats] = useState<any>(initialStats);

  if (!stats) return <div>Loading stats...</div>;

  const statCards = [
    { title: "Invitations", value: stats.totalInvitations, icon: Users, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { title: "RSVPs", value: stats.totalRSVPs, icon: CheckCircle, color: "bg-green-50 text-green-600", border: "border-green-100" },
    { title: "Coupons", value: stats.activeCoupons, icon: Ticket, color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
    { title: "Revenue", value: `₹${stats.estimatedRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-rose-50 text-[#F43F8F]", border: "border-rose-100" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, i) => (
        <Card key={i} className={`overflow-hidden border-none shadow-sm bg-white hover:shadow-md transition-all duration-300`}>
          <div className={`h-1 w-full ${stat.color.split(' ')[1].replace('text-', 'bg-')}`} />
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
              <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- InvitationManager ---
export function InvitationManager({ initialInvitations = [] }: { initialInvitations: any[] }) {
  const [invitations, setInvitations] = useState<any[]>(initialInvitations);

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Manage Invitations</h2>
        <div className="text-sm text-muted-foreground">{invitations.length} Total</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {invitations.map((inv) => (
          <Card key={inv.id} className="overflow-hidden hover:shadow-md transition-shadow group">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 line-clamp-1">
                    {inv.brideName} & {inv.groomName}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {format(new Date(inv.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {inv.tier}
                </span>
                <Link href={`/invite/${inv.slug}`} target="_blank">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    View Invite →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- CouponManager ---
export function CouponManager({ initialCoupons = [] }: { initialCoupons: any[] }) {
  const [coupons, setCoupons] = useState<any[]>(initialCoupons);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    usageLimit: "",
    expiresAt: "",
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = "/api/admin/coupons";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newCoupon,
        id: editingId,
        discountValue: parseInt(newCoupon.discountValue),
        usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null,
        expiresAt: newCoupon.expiresAt ? new Date(newCoupon.expiresAt).toISOString() : null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (isEditing) {
        setCoupons(coupons.map(c => c.id === editingId ? data : c));
      } else {
        setCoupons([data, ...coupons]);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewCoupon({ code: "", discountType: "percentage", discountValue: "", usageLimit: "", expiresAt: "", active: true });
  };

  const handleEditClick = (coupon: any) => {
    setNewCoupon({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : "",
      active: coupon.active,
    });
    setEditingId(coupon.id);
    setIsAdding(true);
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
        <Button onClick={() => isAdding ? resetForm() : setIsAdding(true)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Coupon</>}
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader><CardTitle>{editingId ? "Update Coupon" : "Create New Coupon"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1">
                <Label>Code</Label>
                <Input
                  placeholder="SAVE20"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  value={newCoupon.discountType}
                  onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
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
                  onChange={e => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Expires At</Label>
                <Input
                  type="date"
                  value={newCoupon.expiresAt}
                  onChange={e => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                />
              </div>
              {editingId && (
                <div className="space-y-1">
                  <Label>Status</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    value={newCoupon.active.toString()}
                    onChange={e => setNewCoupon({ ...newCoupon, active: e.target.value === "true" })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}
              <Button type="submit" className={editingId ? "col-span-full md:col-span-1" : ""}>
                {editingId ? "Update" : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-1 w-full ${coupon.active ? "bg-green-500" : "bg-red-400"}`} />
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold tracking-wider text-gray-900">{coupon.code}</div>
                  <div className="text-xs text-[#F43F8F] font-bold">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditClick(coupon)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(coupon.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-tight text-gray-500">
                <div className="bg-gray-50 p-2 rounded">
                  Used: <span className="text-gray-900">{coupon.usedCount}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  Limit: <span className="text-gray-900">{coupon.usageLimit || "∞"}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-muted-foreground border-t border-gray-50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {coupon.expiresAt ? format(new Date(coupon.expiresAt), "MMM d") : "No Expiry"}
                </span>
                <span className={`flex items-center gap-1 ${coupon.active ? "text-green-600" : "text-red-500"}`}>
                  {coupon.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {coupon.active ? "Active" : "Inactive"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- TierManager ---
export function TierManager({ initialTiers = [] }: { initialTiers: any[] }) {
  const [tiers, setTiers] = useState<any[]>(initialTiers);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [localPrices, setLocalPrices] = useState<Record<number, string>>(
    initialTiers.reduce((acc, t) => ({ ...acc, [t.id]: t.price.toString() }), {})
  );

  const handleUpdatePrice = async (id: number) => {
    setUpdatingId(id);
    const price = parseInt(localPrices[id]);
    
    try {
      const res = await fetch("/api/admin/tiers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price }),
      });
      if (res.ok) {
        setTiers(prev => prev.map(t => t.id === id ? { ...t, price } : t));
        alert("Price updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update price.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Plan Pricing</h2>
        <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">
          ⚠️ Be careful, changes are live immediately
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
            <div className="h-1.5 w-full bg-linear-to-r from-rose-400 to-[#c73272]" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-500">
                  {tier.slug}
                </div>
              </div>
              <CardDescription>Base price for this tier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase">Current Price (₹)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={localPrices[tier.id]}
                    onChange={(e) => setLocalPrices({ ...localPrices, [tier.id]: e.target.value })}
                    className="font-mono text-lg font-bold text-gray-900 focus:border-[#F43F8F] focus:ring-[#F43F8F]/20"
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleUpdatePrice(tier.id)} 
                disabled={updatingId === tier.id || localPrices[tier.id] === tier.price.toString()}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-all h-11"
              >
                {updatingId === tier.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Update Price"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
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

// --- GiftInviteManager ---
export function GiftInviteManager() {
  const [recipient, setRecipient] = useState("");
  const [tier, setTier] = useState("premium");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedCode("");

    const code = `GIFT-${tier.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountType: "percentage",
        discountValue: 100,
        usageLimit: 1,
        active: true,
      }),
    });

    if (res.ok) {
      setGeneratedCode(code);
    }
    setIsLoading(false);
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Gift an Invitation</CardTitle>
        <CardDescription>
          Generate a special 100% discount code restricted to a specific tier. Give this code to the recipient so they can create their invitation for free.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2">
            <Label>Recipient Email (Optional, for your records)</Label>
            <Input
              placeholder="friend@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tier to Gift</Label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            >
              <option value="basic">Basic Plan</option>
              <option value="standard">Standard Plan</option>
              <option value="premium">Premium Plan</option>
            </select>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-[#F43F8F] hover:bg-[#d82a75]">
            {isLoading ? "Generating..." : "Generate Gift Code"}
          </Button>
        </form>

        {generatedCode && (
          <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl text-center space-y-2">
            <p className="text-green-800 font-medium">Gift Code Generated Successfully!</p>
            <div className="flex items-center justify-center gap-3">
              <div className="text-2xl font-bold tracking-widest text-green-900 bg-white py-2 px-6 rounded-lg border border-green-200 shadow-sm">
                {generatedCode}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="bg-white border-green-200 hover:bg-green-50 text-green-700"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-sm text-green-700">
              Share this code with the user. They can select the <strong>{tier.toUpperCase()}</strong> tier and enter this code at checkout to get it for free.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
