"use client";

import { useState } from "react";
import { UploadCloud, Plus } from "lucide-react";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Lighting",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert("Please select an image first");
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageBase64: imagePreview,
        }),
      }).catch(err => {
        throw new Error(`Browser Network Error: ${err.message}. Try picking a smaller image or checking your terminal.`);
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Cloud Server Error: ${errorText}`);
      }

      alert("Product successfully added to Cloud DB!");
      setFormData({ name: "", price: "", category: "Lighting" });
      setImageFile(null);
      setImagePreview(null);
    } catch (error: any) {
      console.error("DEBUG - Upload Failed:", error);
      alert(error.message || "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-[80vh] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl dark:shadow-none border border-neutral-200 dark:border-neutral-800 p-8">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <UploadCloud className="w-6 h-6 text-neutral-900 dark:text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Upload a new product to MongoDB & Cloudinary</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Product Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white" 
                  placeholder="e.g. Minimalist Chair"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Price (USD)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white" 
                  placeholder="e.g. 199.99"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Category</label>
              <select 
                className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Lighting">Lighting</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
                <option value="Audio">Audio</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Product Image</label>
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-6 text-center hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition cursor-pointer relative">
                <input 
                  type="file" 
                  required
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
                {!imagePreview ? (
                  <div className="flex flex-col items-center pointer-events-none">
                    <Plus className="w-8 h-8 text-neutral-400 mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Click or drag image to upload</p>
                  </div>
                ) : (
                  <div className="relative aspect-video w-full max-w-sm mx-auto rounded-lg overflow-hidden outline outline-1 outline-neutral-200 dark:outline-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUploading}
              className="w-full py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg font-bold hover:shadow-lg transform transition hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:-translate-y-0"
            >
              {isUploading ? "Uploading to Cloud..." : "Publish Product"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
