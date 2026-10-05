import React, { useState } from 'react';
import { ClassInfo, GradeType, MajorType } from '../types';
import { Settings, X, GraduationCap } from 'lucide-react';

interface ClassSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo;
  onUpdateClassInfo: (newInfo: ClassInfo) => void;
}

export const ClassSettingsModal: React.FC<ClassSettingsModalProps> = ({
  isOpen,
  onClose,
  classInfo,
  onUpdateClassInfo,
}) => {
  const [grade, setGrade] = useState<GradeType>(classInfo.grade);
  const [major, setMajor] = useState<MajorType>(classInfo.major);
  const [section, setSection] = useState(classInfo.section);
  const [academicYear, setAcademicYear] = useState(classInfo.academicYear);
  const [schoolName, setSchoolName] = useState(classInfo.schoolName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClassInfo({
      ...classInfo,
      grade,
      major,
      section,
      academicYear,
      schoolName,
    });
    onClose();
  };

  const gradeLabel = (g: GradeType) => {
    switch (g) {
      case '10': return 'X (Kelas 10)';
      case '11': return 'XI (Kelas 11)';
      case '12': return 'XII (Kelas 12)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Pengaturan Kelas & Jurusan</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tingkat Kelas</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="10">X (Kelas 10)</option>
                <option value="11">XI (Kelas 11)</option>
                <option value="12">XII (Kelas 12)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Jurusan</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value as MajorType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
                <option value="Akuntansi">Akuntansi</option>
                <option value="TKJ">TKJ (Teknik Komputer & Jaringan)</option>
                <option value="TKR">TKR (Teknik Kendaraan Ringan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor / Rombel Kelas (Contoh: 1, 2)</label>
            <input
              type="text"
              required
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tahun Ajaran</label>
            <input
              type="text"
              required
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Sekolah</label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
