import React from 'react';
import { Student, Transaction, ClassInfo, User } from '../types';
import { formatRupiah, formatDate, formatClassName } from '../utils/formatters';
import { WEEKS } from '../data/mockData';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle, 
  Calendar, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';

interface DashboardProps {
  classInfo: ClassInfo;
  students: Student[];
  transactions: Transaction[];
  currentUser: User;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: (type: 'pemasukan' | 'pengeluaran') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  classInfo,
  students,
  transactions,
  currentUser,
  setActiveTab,
  onOpenAddModal,
}) => {
  // Calculate totals
  const totalPemasukan = transactions
    .filter((t) => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalPemasukan - totalPengeluaran;

  // Current active week check (e.g. '2026-10-w4')
  const currentWeekKey = '2026-10-w4';
  const currentWeekLabel = WEEKS.find((w) => w.key === currentWeekKey)?.label || 'Minggu 4 (Okt)';

  const paidCountThisWeek = students.filter(
    (s) => s.payments[currentWeekKey] === true
  ).length;
  const unpaidCountThisWeek = students.length - paidCountThisWeek;

  const canManage = currentUser.role === 'ketua' || currentUser.role === 'bendahara';
  const classNameStr = formatClassName(classInfo);

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Role Notice Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-indigo-100">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tahun Ajaran {classInfo.academicYear}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Halo, {currentUser.name}! 👋
            </h1>
            <p className="text-indigo-100 text-sm max-w-xl">
              Selamat datang di portal manajemen <span className="font-semibold text-white">KasKelas {classNameStr}</span> ({classInfo.schoolName}). Transparan, akuntabel, dan mudah dipantau bersama.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {canManage && (
              <>
                <button
                  onClick={() => onOpenAddModal('pemasukan')}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Pemasukan</span>
                </button>
                <button
                  onClick={() => onOpenAddModal('pengeluaran')}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>- Pengeluaran</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Saldo */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Saldo Kas</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(saldo)}</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse" />
              Dana Kas Aman & Likuid
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Pemasukan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pemasukan</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{formatRupiah(totalPemasukan)}</h3>
            <p className="text-xs text-slate-500 pt-1">Akumulasi iuran & sumbangan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pengeluaran</p>
            <h3 className="text-2xl font-extrabold text-rose-600">{formatRupiah(totalPengeluaran)}</h3>
            <p className="text-xs text-slate-500 pt-1">Keperluan ATK & kebersihan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Status Iuran Minggu Ini */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => setActiveTab('students')}>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Iuran {currentWeekLabel}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-900">{paidCountThisWeek}</span>
              <span className="text-sm font-medium text-slate-500">/ {students.length} Siswa</span>
            </div>
            <p className="text-xs text-amber-600 font-medium pt-1">
              {unpaidCountThisWeek} siswa belum lunas minggu ini
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Transactions & Class Committee Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Transaksi Terbaru</h2>
              <p className="text-xs text-slate-500">Aktivitas pemasukan dan pengeluaran kas terakhir</p>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">Belum ada transaksi tercatat.</div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.type === 'pemasukan' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {tx.type === 'pemasukan' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{tx.description}</h4>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[11px] font-medium text-slate-500">{formatDate(tx.date)}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[11px] font-medium px-2 py-0.2 bg-slate-100 text-slate-600 rounded-md">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      tx.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.type === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Oleh: {tx.recordedBy}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Class Info & Quick Actions (Span 1) */}
        <div className="space-y-6">
          {/* Class Committee Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Pengurus Kelas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    K
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Ketua Kelas</p>
                    <p className="text-sm font-bold text-slate-800">{classInfo.ketuaName}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Ketua</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Bendahara Kelas</p>
                    <p className="text-sm font-bold text-slate-800">{classInfo.bendaharaName}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Bendahara</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500 py-1">
                <span>Iuran Wajib / Minggu:</span>
                <span className="font-bold text-slate-800">{formatRupiah(classInfo.monthlyFee)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 py-1">
                <span>Total Siswa:</span>
                <span className="font-bold text-slate-800">{students.length} Siswa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
