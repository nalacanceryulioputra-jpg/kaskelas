import React from 'react';
import { Transaction, ClassInfo, Student } from '../types';
import { formatRupiah, formatDate, formatClassName } from '../utils/formatters';
import { FileText, Printer, Download, TrendingUp, TrendingDown, Wallet, ShieldCheck } from 'lucide-react';

interface ReportsViewProps {
  transactions: Transaction[];
  classInfo: ClassInfo;
  students: Student[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  classInfo,
  students,
}) => {
  const totalPemasukan = transactions
    .filter((t) => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoAkhir = totalPemasukan - totalPengeluaran;
  const classNameStr = formatClassName(classInfo);

  // Category breakdown
  const categorySummary: { [key: string]: { income: number; expense: number } } = {};
  transactions.forEach((t) => {
    if (!categorySummary[t.category]) {
      categorySummary[t.category] = { income: 0, expense: 0 };
    }
    if (t.type === 'pemasukan') {
      categorySummary[t.category].income += t.amount;
    } else {
      categorySummary[t.category].expense += t.amount;
    }
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Print Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span>Laporan Keuangan Kas Kelas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Laporan transparan rekapitulasi pemasukan, pengeluaran, dan rekap saldo kas {classNameStr}.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Ekspor Laporan</span>
        </button>
      </div>

      {/* Printable Report Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-8 print:border-0 print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="text-center border-b border-slate-200 pb-6 space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-wide">
            Laporan Keuangan Kas Kelas {classNameStr}
          </h2>
          <p className="text-sm font-semibold text-slate-600">{classInfo.schoolName}</p>
          <p className="text-xs text-slate-500">Tahun Ajaran {classInfo.academicYear} • Per Tanggal {formatDate(new Date().toISOString())}</p>
        </div>

        {/* Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Pemasukan</p>
            <h3 className="text-2xl font-black text-emerald-700">{formatRupiah(totalPemasukan)}</h3>
          </div>
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
            <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Total Pengeluaran</p>
            <h3 className="text-2xl font-black text-rose-700">{formatRupiah(totalPengeluaran)}</h3>
          </div>
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
            <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Saldo Kas Bersih</p>
            <h3 className="text-2xl font-black text-indigo-700">{formatRupiah(saldoAkhir)}</h3>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Rekapitulasi Berdasarkan Kategori</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Kategori Transaksi</th>
                  <th className="py-3 px-4 text-right">Pemasukan</th>
                  <th className="py-3 px-4 text-right">Pengeluaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.keys(categorySummary).length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">Belum ada kategori tercatat.</td>
                  </tr>
                ) : (
                  Object.entries(categorySummary).map(([cat, val]) => (
                    <tr key={cat} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-800">{cat}</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-600">
                        {val.income > 0 ? formatRupiah(val.income) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-rose-600">
                        {val.expense > 0 ? formatRupiah(val.expense) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full Transaction Log Table in Report */}
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-bold text-slate-900">Rincian Seluruh Transaksi</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Jenis</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">{formatDate(tx.date)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                        tx.type === 'pemasukan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{tx.category}</td>
                    <td className="py-3 px-4 text-slate-900">{tx.description}</td>
                    <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                      tx.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.type === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures / Tanda Tangan */}
        <div className="grid grid-cols-2 gap-8 pt-12 text-center text-xs text-slate-600 page-break-inside-avoid">
          <div className="space-y-16">
            <p>Mengetahui,<br />Ketua Kelas</p>
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 inline-block min-w-[160px]">{classInfo.ketuaName}</p>
            </div>
          </div>
          <div className="space-y-16">
            <p>Dibuat oleh,<br />Bendahara Kelas</p>
            <div>
              <p className="font-bold text-slate-900 border-b border-slate-400 pb-1 inline-block min-w-[160px]">{classInfo.bendaharaName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
