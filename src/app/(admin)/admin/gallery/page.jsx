"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Trash2, Plus, Upload, Loader2, X, Pencil } from "lucide-react";
import imageCompression from "browser-image-compression";

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    category: "kegiatan", // default
    image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Categories
  const categories = [
    { id: "kegiatan", label: "Dokumentasi Kegiatan" },
    { id: "logo", label: "Logo HMI" },
    { id: "dokumen", label: "Dokumen" },
  ];

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching gallery:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      date: "",
      description: "",
      category: "kegiatan",
      image_url: "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      date: item.event_date || "",
      description: item.description || "",
      category: item.category || "kegiatan",
      image_url: item.image_url || "",
    });
    setImageFile(null); // Reset file input, allowing user to keep existing image or upload new one
    setIsModalOpen(true);
  };

  const uploadImage = async (file) => {
    let fileToUpload = file;

    // Kompres jika file adalah gambar
    if (file.type.startsWith("image/")) {
      try {
        const options = {
          maxSizeMB: 0.2, // Reduksi ke 200KB untuk menghemat bandwidth
          maxWidthOrHeight: 1280, // Resolusi cukup untuk web
          useWebWorker: true,
          initialQuality: 0.8,
        };
        console.log("Gallery: Original size", file.size / 1024 / 1024, "MB");
        fileToUpload = await imageCompression(file, options);
        console.log("Gallery: Compressed size", fileToUpload.size / 1024 / 1024, "MB");
      } catch (error) {
        console.error("Compression error:", error);
        // Lanjutkan upload file asli jika kompresi gagal
      }
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, fileToUpload);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from("gallery")
          .update({
            title: formData.title,
            event_date: formData.date,
            description: formData.description,
            category: formData.category,
            image_url: imageUrl,
          })
          .eq("id", editingId);

        if (error) throw error;
        alert("Konten berhasil diperbarui!");
      } else {
        // INSERT
        const { error } = await supabase.from("gallery").insert([
          {
            title: formData.title,
            event_date: formData.date,
            description: formData.description,
            category: formData.category,
            image_url: imageUrl,
          },
        ]);

        if (error) throw error;
        alert("Konten berhasil ditambahkan!");
      }

      // Reset form and reload
      setIsModalOpen(false);
      fetchGallery();

    } catch (error) {
      alert("Gagal menyimpan konten: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .match({ id });

      if (dbError) throw dbError;

      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("Item deleted successfully");
    } catch (error) {
      alert("Error deleting item: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Galeri</h1>
          <p className="text-gray-500 text-sm">Kelola dokumentasi, logo, dan dokumen.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#0fa156] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
        >
          <Plus size={20} /> Tambah Konten
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-green-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition group"
            >
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className="bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded">
                    {categories.find(c => c.id === item.category)?.label || item.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="text-xs text-[#FFA600] font-bold mb-1 uppercase">
                  {item.event_date || "No Date"}
                </div>
                <h3 className="font-bold text-gray-800 line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                  {item.description}
                </p>

                <div className="flex justify-end pt-3 border-t border-gray-100 gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.image_url)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Belum ada konten galeri.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Konten" : "Tambah Konten Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
                  placeholder="Contoh: RAKER Pengurus"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition text-gray-900 placeholder-gray-400"
                    placeholder="18 April 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition bg-white text-gray-900"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Keterangan singkat..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2 pointer-events-none">
                    <Upload className="mx-auto text-gray-400" size={24} />
                    <p className="text-sm text-gray-500">
                      {imageFile ? imageFile.name : (editingId && formData.image_url ? "Klik untuk ganti gambar (Opsional)" : "Klik untuk upload gambar")}
                    </p>
                  </div>
                </div>
                {/* Preview current image if editing */}
                {editingId && formData.image_url && !imageFile && (
                  <div className="mt-2 text-xs text-gray-500">
                    Gambar saat ini: <a href={formData.image_url} target="_blank" className="text-green-600 underline">Lihat</a>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
                  disabled={uploading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 rounded-lg bg-[#0fa156] hover:bg-green-700 text-white font-medium transition shadow-lg disabled:opacity-70 flex items-center gap-2"
                >
                  {uploading && <Loader2 className="animate-spin" size={18} />}
                  {uploading ? "Menyimpan..." : "Simpan Konten"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
