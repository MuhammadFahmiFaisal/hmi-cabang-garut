"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function CreateMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "KSB", // Default
    instagram: "",
    linkedin: "",
    image_url: "",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("name")
        .order("name", { ascending: true });

      if (!error && data) {
        setDepartments(data.map(d => d.name));
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const fileName = `members-${Date.now()}-${file.name}`;

    // Upload to Supabase Storage bucket named 'images'
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (error) {
      alert("Gagal upload gambar: " + error.message);
      setLoading(false);
    } else {
      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicData.publicUrl });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("members").insert([
      {
        name: formData.name,
        position: formData.position,
        department: formData.department,
        instagram: formData.instagram.replace('@', ''), // Remove @ if user adds it
        linkedin: formData.linkedin,
        image_url: formData.image_url,
      },
    ]);

    if (error) {
      alert("Gagal menyimpan pengurus: " + error.message);
      setLoading(false);
    } else {
      alert("Pengurus berhasil ditambahkan!");
      router.push("/admin/members");
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Pengurus Baru</h1>
        <Link href="/admin/members" className="text-sm text-gray-500 hover:text-green-600">
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Department Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bidang</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900 bg-white"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Jabatan</label>
            <input
              type="text"
              name="position"
              required
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              placeholder="Contoh: KETUA UMUM / KABID PA"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username Instagram (Tanpa @)</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              placeholder="hmicabanggarut"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">URL LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
              placeholder="https://www.linkedin.com/in/username"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Profil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {loading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}

          {formData.image_url && (
            <div className="mt-4 relative w-24 h-32 bg-gray-100 rounded overflow-hidden border border-gray-200">
              <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00773A] hover:bg-[#005e2e]'}`}
          >
            {loading ? "Menyimpan..." : "SIMPAN PENGURUS"}
          </button>
        </div>

      </form>
    </div>
  );
}
