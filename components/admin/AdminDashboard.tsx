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

export function AdminOverview({ initialStats }: { initialStats: any }) {
  const [stats, setStats] = useState<any>(initialStats);

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
              <div className="space-y-1">
                <Label>Expires At</Label>
                <Input 
                  type="date"
                  value={newCoupon.expiresAt}
                  onChange={e => setNewCoupon({...newCoupon, expiresAt: e.target.value})}
                />
              </div>
              {editingId && (
                <div className="space-y-1">
                  <Label>Status</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    value={newCoupon.active.toString()}
                    onChange={e => setNewCoupon({...newCoupon, active: e.target.value === "true"})}
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
                  <th className="px-6 py-3">Expires</th>
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
                    <td className="px-6 py-4">{coupon.expiresAt ? format(new Date(coupon.expiresAt), "MMM d, yyyy") : "Never"}</td>
                    <td className="px-6 py-4">
                      {coupon.active ? (
                        <span className="flex items-center text-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>
                      ) : (
                        <span className="flex items-center text-red-600"><XCircle className="w-3 h-3 mr-1" /> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <button onClick={() => handleEditClick(coupon)} className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
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
export function TierManager({ initialTiers = [] }: { initialTiers: any[] }) {
  const [tiers, setTiers] = useState<any[]>(initialTiers);

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
