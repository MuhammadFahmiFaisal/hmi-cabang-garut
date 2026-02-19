"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("departments").insert([{ name }]);

    if (error) {
      alert("Gagal menyimpan bidang: " + error.message);
      setLoading(false);
    } else {
      alert("Bidang berhasil ditambahkan!");
      router.push("/admin/departments");
      router.refresh();
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Bidang</h1>
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
            placeholder="Contoh: BIDANG HUMHAM"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#00773A] hover:bg-[#005e2e]"
            }`}
        >
          {loading ? "Menyimpan..." : "SIMPAN BIDANG"}
        </button>
      </form>
    </div>
  );
}
