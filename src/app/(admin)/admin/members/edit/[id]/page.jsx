"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import imageCompression from "browser-image-compression";

export default function EditMemberPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "KSB",
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

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Gagal mengambil data pengurus!");
        router.push("/admin/members");
      } else {
        setFormData({
          name: data.name,
          position: data.position,
          department: data.department,
          instagram: data.instagram || "",
          linkedin: data.linkedin || "",
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
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        initialQuality: 0.8,
      };

      const compressedFile = await imageCompression(file, options);
      const fileName = `members-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, compressedFile);

      if (error) {
        alert("Gagal upload gambar: " + error.message);
        setSubmitting(false);
      } else {
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

    const { error } = await supabase.from("members").update({
      name: formData.name,
      position: formData.position,
      department: formData.department,
      instagram: formData.instagram.replace('@', ''),
      linkedin: formData.linkedin,
      image_url: formData.image_url,
    }).eq('id', id);

    if (error) {
      alert("Gagal mengupdate pengurus: " + error.message);
      setSubmitting(false);
    } else {
      alert("Pengurus berhasil diupdate!");
      router.push("/admin/members");
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Pengurus</h1>
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
          {submitting && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}

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
            disabled={submitting}
            className={`w-full py-3 rounded-lg font-bold text-white transition ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00773A] hover:bg-[#005e2e]'}`}
          >
            {submitting ? "Menyimpan Perubahan..." : "UPDATE PENGURUS"}
          </button>
        </div>

      </form>
    </div>
  );
}
