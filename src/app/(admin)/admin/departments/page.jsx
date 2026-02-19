"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Trash2, Edit, Plus } from "lucide-react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching departments:", error);
    } else {
      setDepartments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus bidang ini?")) return;

    const { error } = await supabase.from("departments").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus: " + error.message);
    } else {
      fetchDepartments();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Bidang</h1>
        <Link
          href="/admin/departments/create"
          className="bg-[#00773A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#005e2e] transition"
        >
          <Plus size={18} /> Tambah Bidang
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : departments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada data bidang.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Nama Bidang</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <Link
                        href={`/admin/departments/edit/${dept.id}`}
                        className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
