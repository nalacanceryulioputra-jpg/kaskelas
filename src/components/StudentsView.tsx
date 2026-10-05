import React, { useState } from 'react';
import { Student, User, ClassInfo } from '../types';
import { formatRupiah, formatClassName } from '../utils/formatters';
import { 
  Users, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2,
  Calendar
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  currentUser: User;
  classInfo: ClassInfo;
  onUpdateStudentPayment: (studentId: string, weekKey: string, status: boolean) => void;
  onAddStudent: (student: Omit<Student, 'id' | 'payments'>) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const MONTHS_LIST = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

const YEARS_LIST = ['2026', '2027', '2028'];

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  currentUser,
  classInfo,
  onUpdateStudentPayment,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('10'); // Oktober default

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form state
  const [nis, setNis] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [phone, setPhone] = useState('');

  const canManage = currentUser.role === 'ketua' || currentUser.role === 'bendahara';

  // Generate 4 weeks for selected year & month
  const currentWeeks = [
    { key: `${selectedYear}-${selectedMonth}-w1`, label: 'Minggu 1' },
    { key: `${selectedYear}-${selectedMonth}-w2`, label: 'Minggu 2' },
    { key: `${selectedYear}-${selectedMonth}-w3`, label: 'Minggu 3' },
    { key: `${selectedYear}-${selectedMonth}-w4`, label: 'Minggu 4' },
  ];

  const monthLabel = MONTHS_LIST.find((m) => m.value === selectedMonth)?.label || '';

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm) ||
      s.phone.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setNis('');
    setName('');
    setGender('L');
    setPhone('');
    setEditingStudent(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setNis(student.nis);
    setName(student.name);
    setGender(student.gender);
    setPhone(student.phone);
    setEditingStudent(student);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nis || !name) return;

    if (editingStudent) {
      onEditStudent({
        ...editingStudent,
        nis,
        name,
        gender,
        phone,
      });
    } else {
      onAddStudent({
        nis,
        name,
        gender,
        phone,
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Data Siswa & Status Pembayaran Iuran Mingguan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data siswa dan status pembayaran iuran kas mingguan (4 minggu per bulan) kelas {formatClassName(classInfo)}.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        )}
      </div>

      {/* Month & Year Selectors & Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="flex items-center space-x-2 w-full">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MONTHS_LIST.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {YEARS_LIST.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NIS, atau no HP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Students Table / Weekly Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Periode Aktif: {monthLabel} {selectedYear} (4 Minggu)
          </span>
          <span className="text-xs text-slate-500">
            Menampilkan <span className="font-bold text-slate-800">{filteredStudents.length}</span> siswa
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">No / NIS</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4 text-center">L/P</th>
                <th className="py-3.5 px-4">No HP</th>
                {currentWeeks.map((w) => (
                  <th key={w.key} className="py-3.5 px-4 text-center whitespace-nowrap">
                    {w.label} ({monthLabel.slice(0, 3)})
                  </th>
                ))}
                {canManage && <th className="py-3.5 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada data siswa ditemukan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700">
                      <div className="text-xs text-slate-400">#{idx + 1}</div>
                      <div className="font-mono text-xs">{student.nis}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${
                        student.gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs whitespace-nowrap">
                      {student.phone}
                    </td>

                    {/* Weekly Payments Toggle for selected Month & Year */}
                    {currentWeeks.map((w) => {
                      const isPaid = student.payments[w.key] === true;
                      return (
                        <td key={w.key} className="py-3 px-4 text-center">
                          <button
                            disabled={!canManage}
                            onClick={() => onUpdateStudentPayment(student.id, w.key, !isPaid)}
                            title={canManage ? `Klik untuk ubah status ${w.label} ${monthLabel} ${selectedYear}` : 'Status Pembayaran Iuran Minggu Ini'}
                            className={`p-1.5 rounded-lg transition-all ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            } ${!canManage ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            {isPaid ? (
                              <CheckCircle2 className="w-5 h-5 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 mx-auto" />
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {canManage && (
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Siswa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data siswa ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Lunas</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
              <span>Belum Lunas</span>
            </span>
          </div>
          {canManage && <p>Ketua & Bendahara dapat langsung mengklik ikon centang/silang untuk memperbarui status iuran mingguan.</p>}
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Induk Siswa (NIS)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 10009"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Utama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor HP / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
