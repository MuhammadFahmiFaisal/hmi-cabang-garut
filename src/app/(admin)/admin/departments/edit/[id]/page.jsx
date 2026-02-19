"use client";

import React, { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditDepartmentPage({ params }) {
  const router = useRouter();
  // Unwrap params using React.use() as per Next.js 15+ patterns if applicable, or direct access
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Gagal mengambil data bidang!");
        router.push("/admin/departments");
      } else {
        setName(data.name);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from("departments")
      .update({ name })
      .eq("id", id);

    if (error) {
      alert("Gagal mengupdate bidang: " + error.message);
      setSubmitting(false);
    } else {
      alert("Bidang berhasil diupdate!");
      router.push("/admin/departments");
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Bidang</h1>
        <Link href="/admin/departments" className="text-sm text-gray-500 hover:text-green-600">
          ← Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Bidang</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#00773A] hover:bg-[#005e2e]"
            }`}
        >
          {submitting ? "Menyimpan Perubahan..." : "UPDATE BIDANG"}
        </button>
      </form>
    </div>
  );
}
