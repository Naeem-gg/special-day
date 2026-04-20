"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";

interface CloudinaryUploadProps {
  onUpload: (url: string, publicId: string) => void;
  onRemove: (publicId: string) => void;
  images: { url: string; publicId: string }[];
}

export default function CloudinaryUpload({ onUpload, onRemove, images }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        onUpload(data.secure_url, data.public_id);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed. please check your Cloudinary configuration.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.publicId} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
            <Image src={img.url} alt="Gallery" fill className="object-cover" />
            <button
              onClick={() => onRemove(img.publicId)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          ) : (
            <>
              <ImagePlus className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500">Upload Image</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
