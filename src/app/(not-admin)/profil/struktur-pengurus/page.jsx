import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Struktur Pengurus",
  description: "Struktur Pengurus HMI Cabang Garut Periode 2025-2026",
};

const MemberCard = ({ name, position, img, instagram, linkedin }) => {
  const username = instagram || "hmicabanggarut"; // Default username
  const igUrl = `https://www.instagram.com/${username}`;

  return (
    <div className="w-56 bg-[#FFA600] rounded-[2rem] p-3 flex flex-col items-center shadow-lg transition-transform transform hover:-translate-y-2 border-2 border-white/40 group">
      {/* Image Container */}
      <div className="w-full aspect-[4/5] bg-white rounded-2xl overflow-hidden relative shadow-inner">
        {img ? (
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <span className="text-4xl">?</span>
          </div>
        )}
      </div>

      {/* Name Pill */}
      <div className="bg-white px-4 py-1.5 rounded-full mt-[-16px] z-10 shadow-sm border border-gray-100 max-w-[95%]">
        <h3 className="text-[#004E26] text-[10px] md:text-[11px] font-black uppercase text-center truncate leading-tight">
          {name}
        </h3>
      </div>

      {/* Position Pill */}
      <div className="mt-3 border border-white bg-[#FFA600] px-4 py-1 rounded-full shadow-sm">
        <p className="text-white text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
          {position}
        </p>
      </div>

      {/* Instagram Section */}
      <div className="mt-2 flex items-center gap-2">
        <Link
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer"
        >
          <Instagram size={14} className="text-white" />
        </Link>
        {linkedin && (
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer"
          >
            <Linkedin size={14} className="text-white" />
          </Link>
        )}
      </div>
    </div>
  );
};

const SectionTitle = ({ title }) => (
  <div className="flex items-center justify-center w-full my-8">
    <div className="bg-transparent border-2 border-white px-8 py-2 rounded-full shadow-lg backdrop-blur-sm">
      <h2 className="text-white font-black text-sm md:text-base uppercase tracking-wider text-center">
        {title}
      </h2>
    </div>
  </div>
);

import { supabase } from "@/lib/supabaseClient";

// Mapping for clean display names if needed (Optional: can be removed if db name is used directly)
const DEPARTMENT_TITLES = {
  "BIDANG PA": "BIDANG PEMBINAAN ANGGOTA (PA)",
  "BIDANG PAO": "BIDANG PEMBINAAN APARATUR ORGANISASI (PAO)",
  "BIDANG KPP": "BIDANG KEWIRAUSAHAAN & PENGEMBANGAN PROFESI (KPP)",
  "BIDANG PTKP": "BIDANG PERGURUAN TINGGI KEMAHASISWAAN & KEPEMUDAAN (PTKP)",
  "BIDANG PPD": "BIDANG PARTISIPASI PEMBANGUNAN DAERAH (PPD)",
  "BIDANG PU": "BIDANG PEMBERDAYAAN UMAT (PU)",
  "BIDANG HUMHAM": "BIDANG HUKUM & HAM (HUMHAM)",
  // Default fallback for others will be the DB name
};

export default async function StrukturPengurusPage() {
  // 1. Fetch all members
  const { data: allMembers } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: true }); // Keep member order consistent

  // 2. Fetch all departments
  const { data: allDepartments } = await supabase
    .from("departments")
    .select("*")
    .order("id", { ascending: true }); // Order by creation/ID 

  const safeMembers = allMembers || [];
  const safeDepartments = allDepartments || [];

  // Helper to filter by department
  const getMembersByDept = (deptName) =>
    safeMembers
      .filter((m) => m.department === deptName)
      .map((m) => ({
        name: m.name,
        position: m.position,
        img: m.image_url,
        instagram: m.instagram,
        linkedin: m.linkedin,
      }));

  // Define Core Departments that go INSIDE the Green Box
  const CORE_DEPARTMENTS = ["KSB", "BIDANG PA", "BIDANG PAO", "BIDANG KOMDIG"];

  // Split departments into Inner and Outer groups
  const innerDepartments = safeDepartments
    .filter((d) => CORE_DEPARTMENTS.includes(d.name))
    .sort(
      (a, b) =>
        CORE_DEPARTMENTS.indexOf(a.name) - CORE_DEPARTMENTS.indexOf(b.name)
    );

  // Outer departments are those NOT in the core list.
  // Note: We want to preserve the order from DB for new departments.
  const outerDepartments = safeDepartments.filter(
    (d) => !CORE_DEPARTMENTS.includes(d.name)
  );

  return (
    <div className="w-full bg-[#0fa156] text-white font-sans pb-20">
      {/* PAGE HEADER */}
      <section className="bg-transparent pt-32 pb-8 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="inline-block border border-white rounded-lg px-4 py-1 mb-4 backdrop-blur-sm bg-white/10">
          <span className="text-white font-bold uppercase tracking-widest text-sm">
            STRUKTUR PENGURUS
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase leading-none drop-shadow-md text-left">
          HIMPUNAN MAHASISWA ISLAM <br />
          CABANG GARUT
          <span className="inline-block bg-orange-500 text-white px-4 ml-0 md:ml-4 rounded-lg transform -skew-x-6 mt-2 md:mt-0 text-3xl md:text-5xl border-2 border-white">
            PERIODE 2025-2026
          </span>
        </h1>
      </section>

      {/* CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-12">
        {/* === GROUP 1: DARK GREEN ZONE (Core Departments) === */}
        {innerDepartments.length > 0 && (
          <div className="bg-[#00773A] p-8 md:p-12 rounded-[3rem] border-4 border-white/20 shadow-2xl space-y-16">
            {innerDepartments.map((dept) => {
              const members = getMembersByDept(dept.name);
              // Special layout for PA and PAO (split rows) if needed, strictly mimicking original design
              // Original design had PA and PAO split into rows of 3. We can keep that logic if desired,
              // or simplify. To be safe and dynamic, we will use flex-wrap which naturally handles rows.
              // However, the original code explicitly split into 3. 
              // Let's stick to standard flex-wrap for robustness unless the user complains.

              const title = DEPARTMENT_TITLES[dept.name] || dept.name;

              return (
                <div key={dept.id}>
                  <SectionTitle title={title} />
                  <div className="flex flex-wrap justify-center gap-10">
                    {members.map((member, i) => (
                      <MemberCard key={i} {...member} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* === END GROUP 1 === */}

        {/* === GROUP 2: OUTSIDE (All other departments) === */}
        <div className="space-y-16 py-8">
          {outerDepartments.map((dept) => {
            const members = getMembersByDept(dept.name);
            const title = DEPARTMENT_TITLES[dept.name] || dept.name;

            // Only render section if it has members? Or render empty?
            // Usually if no members, simpler to hide or show empty.
            // Let's show it so they know it exists but is empty.

            return (
              <div key={dept.id}>
                <SectionTitle title={title} />
                <div className="flex flex-wrap justify-center gap-10">
                  {members.length > 0 ? (
                    members.map((member, i) => (
                      <MemberCard key={i} {...member} />
                    ))
                  ) : (
                    <p className="text-white/50 italic text-sm">Belum ada pengurus di bidang ini.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* === END GROUP 2 === */}
      </div>

      {/* FOOTER MESSAGE */}
      <div className="text-center mt-20 opacity-80">
        <h2 className="text-4xl font-black italic mb-2">#HMIVISIONER</h2>
        <p className="tracking-[0.3em] font-light">
          KONSISTEN DALAM KEBENARAN
        </p>
      </div>
    </div>
  );
}
