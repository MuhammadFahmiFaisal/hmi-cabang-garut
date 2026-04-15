"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import imageCompression from "browser-image-compression";

export default function EditNewsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    content: "",
    image_url: "",
  });

  // Fetch Existing Data
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Gagal mengambil data berita!");
        router.push("/admin/news");
      } else {
        setFormData({
          title: data.title,
          date: data.date,
          content: data.content,
          image_url: data.image_url || "",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubmitting(true);

    try {
      const options = {
        maxSizeMB: 0.2,
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
        setSubmitting(false);
      } else {
        // Get Public URL
        const { data: publicData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        setFormData({ ...formData, image_url: publicData.publicUrl });
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mengompres gambar: " + err.message);
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Update slug based on new title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Create excerpt (first 100 chars)
    const excerpt = formData.content.substring(0, 150) + "...";

    const { error } = await supabase.from("news").update({
      title: formData.title,
      date: formData.date,
      content: formData.content,
      image_url: formData.image_url,
      slug: slug,
      excerpt: excerpt,
    }).eq('id', id);

    if (error) {
      alert("Gagal mengupdate berita: " + error.message);
      setSubmitting(false);
    } else {
      alert("Berita berhasil diupdate!");
      router.push("/admin/news");
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Berita</h1>
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
          {submitting && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}

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
            disabled={submitting}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00773A] hover:bg-[#005e2e]'}`}
          >
            {submitting ? "Menyimpan Perubahan..." : "UPDATE BERITA"}
          </button>
        </div>

      </form>
    </div>
  );
}
