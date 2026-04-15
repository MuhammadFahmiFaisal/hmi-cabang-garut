"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import imageCompression from "browser-image-compression";

export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0], // Today's date YYYY-MM-DD
    content: "",
    image_url: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const options = {
        maxSizeMB: 0.2, // Reduksi ke 200KB
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        initialQuality: 0.8,
      };

      const compressedFile = await imageCompression(file, options);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;

      // Upload to Supabase Storage bucket named 'images'
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, compressedFile);

      if (error) {
        alert("Gagal upload gambar: " + error.message);
        setLoading(false);
      } else {
        // Get Public URL
        const { data: publicData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        setFormData({ ...formData, image_url: publicData.publicUrl });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengompres gambar: " + err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Auto-generate slug from title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, ""); // Trim hyphens

    // Create excerpt (first 100 chars)
    const excerpt = formData.content.substring(0, 150) + "...";

    const { error } = await supabase.from("news").insert([
      {
        title: formData.title,
        date: formData.date,
        content: formData.content,
        image_url: formData.image_url, // Bisa kosong jika tidak ada gambar
        slug: slug,
        excerpt: excerpt,
      },
    ]);

    if (error) {
      alert("Gagal menyimpan berita: " + error.message);
      setLoading(false);
    } else {
      alert("Berita berhasil dibuat!");
      router.push("/admin/news");
      router.refresh(); // Refresh server data
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tulis Berita Baru</h1>
        <Link href="/admin/news" className="text-sm text-gray-500 hover:text-green-600">
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Berita</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
            placeholder="Contoh: HMI Garut Gelar LK 1 Akbar"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Posting</label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Gambar Utama (Cover)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {loading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}

          {formData.image_url && (
            <div className="mt-4 relative w-full h-48 bg-gray-100 rounded overflow-hidden border border-gray-200">
              <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Isi Berita</label>
          <textarea
            name="content"
            required
            rows="10"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
            placeholder="Tulis isi berita lengkap di sini..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00773A] hover:bg-[#005e2e]'}`}
          >
            {loading ? "Menyimpan..." : "PUBLISH BERITA"}
          </button>
        </div>

      </form>
    </div>
  );
}
