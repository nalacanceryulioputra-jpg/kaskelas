import React, { useState } from 'react';
import { ClassInfo } from '../types';
import { X, GraduationCap } from 'lucide-react';
import { formatClassName } from '../utils/formatters';

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
  const [academicYear, setAcademicYear] = useState(classInfo.academicYear);
  const [schoolName, setSchoolName] = useState(classInfo.schoolName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClassInfo({
      ...classInfo,
      academicYear,
      schoolName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Pengaturan {formatClassName(classInfo)}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kelas aktif</label>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-700">
              {formatClassName(classInfo)}
            </p>
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
