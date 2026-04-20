"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Globe } from "lucide-react";
import CloudinaryUpload from "@/components/dashboard/CloudinaryUpload";
import Link from "next/link";

export default function Dashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brideName: "",
    groomName: "",
    date: "",
    venue: "",
    slug: "",
    musicUrl: "",
    events: [{ name: "", time: "", location: "", description: "" }],
    gallery: [] as { url: string; publicId: string }[]
  });

  const handleAddEvent = () => {
    setFormData({
      ...formData,
      events: [...formData.events, { name: "", time: "", location: "", description: "" }]
    });
  };

  const handleRemoveEvent = (index: number) => {
    const newEvents = formData.events.filter((_, i) => i !== index);
    setFormData({ ...formData, events: newEvents });
  };

  const updateEvent = (index: number, field: string, value: string) => {
    const newEvents = [...formData.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setFormData({ ...formData, events: newEvents });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Invitation created successfully!");
        window.location.href = `/invite/${formData.slug}`;
      } else {
        alert(data.error || "Failed to create invitation");
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Wedding Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName">Bride Name</Label>
                  <Input 
                    id="brideName" 
                    value={formData.brideName}
                    onChange={(e) => setFormData({...formData, brideName: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomName">Groom Name</Label>
                  <Input 
                    id="groomName" 
                    value={formData.groomName}
                    onChange={(e) => setFormData({...formData, groomName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Wedding Date & Time</Label>
                  <Input 
                    id="date" 
                    type="datetime-local" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Invitation URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">/invite/</span>
                    <Input 
                      id="slug" 
                      placeholder="john-and-jane"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-")})}
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue Name & Address</Label>
                <Input 
                  id="venue" 
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  required 
                />
              </div>

               <div className="space-y-2">
                <Label htmlFor="musicUrl">Background Music URL (Optional)</Label>
                <Input 
                  id="musicUrl" 
                  placeholder="https://..."
                  value={formData.musicUrl}
                  onChange={(e) => setFormData({...formData, musicUrl: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Wedding Events</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={handleAddEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.events.map((event, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl relative border border-gray-100">
                  <button 
                    type="button"
                    onClick={() => handleRemoveEvent(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 text-xs uppercase tracking-wider text-gray-500">Event Name</div>
                      <div className="space-y-1 text-xs uppercase tracking-wider text-gray-500">Time</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="e.g. Nikah" 
                        value={event.name}
                        onChange={(e) => updateEvent(index, "name", e.target.value)}
                        required 
                      />
                      <Input 
                        placeholder="e.g. 7:00 PM" 
                        value={event.time}
                        onChange={(e) => updateEvent(index, "time", e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-gray-400">Location</Label>
                      <Input 
                        placeholder="Building A, Floor 2" 
                        value={event.location}
                        onChange={(e) => updateEvent(index, "location", e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photo Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <CloudinaryUpload 
                images={formData.gallery}
                onUpload={(url, publicId) => setFormData({
                  ...formData,
                  gallery: [...formData.gallery, { url, publicId }]
                })}
                onRemove={(publicId) => setFormData({
                  ...formData,
                  gallery: formData.gallery.filter(img => img.publicId !== publicId)
                })}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
               type="submit" 
               size="lg" 
               disabled={isSubmitting}
               className="bg-gray-900 text-white hover:bg-gray-800 transition-all font-semibold tracking-wide"
            >
              {isSubmitting ? "Creating..." : "Generate Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
