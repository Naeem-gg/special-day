"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, X, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

interface CloudinaryUploadProps {
  onUpload: (url: string, publicId: string) => void;
  onRemove: (publicId: string) => void;
  images: { url: string; publicId: string }[];
  maxUploads: number;
}

export default function CloudinaryUpload({ onUpload, onRemove, images, maxUploads }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null);

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const showMessage = (type: "success" | "error" | "warning", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (images.length >= maxUploads) {
      showMessage("warning", `You can only upload up to ${maxUploads} photos on your current plan.`);
      e.target.value = "";
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "File is too large. Please upload an image smaller than 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result as string));
    reader.readAsDataURL(file);
    e.target.value = ""; // reset input
  };

  const handleUpload = async () => {
    console.log("CloudinaryUpload: Save button clicked");
    if (!imageSrc) {
      console.error("CloudinaryUpload: No image source found");
      return;
    }
    
    if (!croppedAreaPixels) {
      console.warn("CloudinaryUpload: Missing croppedAreaPixels");
      showMessage("error", "Please wait for the image to load or try moving it slightly.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      showMessage("error", "Cloudinary environment variables are missing! Check your .env.local file.");
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImage) throw new Error("Failed to crop image");

      const formData = new FormData();
      formData.append("file", croppedImage);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.secure_url) {
        onUpload(data.secure_url, data.public_id);
        showMessage("success", "Image uploaded successfully!");
        setImageSrc(null); // close cropper
      } else {
        showMessage("error", data.error?.message || "Upload failed. Check your Cloudinary preset settings.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      showMessage("error", "Network error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Notifications Banner */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : message.type === "warning"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {message.type === "success" ? <CheckCircle2 className="shrink-0 w-4 h-4" /> : <AlertCircle className="shrink-0 w-4 h-4" />}
            <span className="leading-tight">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-1 px-1">
        <p className="text-sm font-medium text-gray-500">
          Uploaded: <span className="text-gray-900 font-semibold">{images.length}</span> <span className="text-gray-400">/ {maxUploads}</span>
        </p>
      </div>

      {/* Mobile optimized grid (3 columns on mobile, 4 on desktop) */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
        {images.map((img) => (
          <div key={img.publicId} className="relative aspect-3/4 rounded-xl overflow-hidden border border-gray-200 shadow-xs group">
            <Image 
              src={img.url} 
              alt="Gallery" 
              fill 
              sizes="(max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105" 
            />
            <button
              onClick={() => onRemove(img.publicId)}
              className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full transition-all backdrop-blur-md z-10"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {images.length < maxUploads && (
          <label className={`flex flex-col items-center justify-center aspect-3/4 border-2 border-dashed rounded-xl cursor-pointer transition-colors border-rose-200 hover:bg-rose-50 bg-rose-50/30 active:bg-rose-100`}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-1.5 text-[#F43F8F]">
              <ImagePlus className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-[11px] md:text-xs font-semibold text-gray-600">Add Photo</span>
            <span className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">Max 2MB</span>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileSelect}
            />
          </label>
        )}
      </div>

      {/* Mobile-First Fullscreen Cropper Modal */}
      <AnimatePresence>
        {imageSrc && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-100 flex flex-col bg-black md:p-6 md:bg-black/90 md:items-center md:justify-center"
          >
            <div className="flex flex-col w-full h-full md:max-w-md md:h-auto md:max-h-[90vh] bg-black md:bg-white md:rounded-4xl overflow-hidden shadow-2xl">

              {/* Header */}
              <div className="flex-none p-4 pt-safe flex justify-between items-center bg-black/50 md:bg-gray-50/50 border-b border-white/10 md:border-gray-100 z-10">
                <h3 className="font-serif font-semibold text-lg text-white md:text-gray-800">Adjust Photo</h3>
                <button onClick={() => setImageSrc(null)} className="p-2 bg-white/10 md:hover:bg-gray-200 rounded-full transition-colors text-white md:text-gray-500 active:scale-95">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cropper Area */}
              <div className="relative flex-1 w-full bg-black min-h-[400px] md:min-h-[500px]">
                {imageSrc && (
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={3 / 4}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    showGrid={true}
                    objectFit="contain"
                  />
                )}
              </div>

              {/* Bottom Controls */}
              <div className="flex-none p-6 pb-safe bg-black md:bg-gray-50 flex flex-col gap-5 border-t border-white/10 md:border-gray-100 z-50 relative">
                <div className="flex items-center gap-4 px-2">
                  <span className="text-[10px] font-bold text-white/50 md:text-gray-400 uppercase tracking-wider">Zoom</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/20 md:bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F43F8F]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setImageSrc(null)}
                    className="flex-1 rounded-xl h-12 md:h-12 bg-transparent text-white border-white/20 md:bg-white md:text-gray-700 md:border-gray-200"
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleUpload}
                    className="flex-1 rounded-xl bg-linear-to-r from-[#F43F8F] to-[#c73272] hover:shadow-lg transition-all h-12 text-white shadow-[#F43F8F]/20 active:scale-95"
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                    {isUploading ? "Uploading..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
