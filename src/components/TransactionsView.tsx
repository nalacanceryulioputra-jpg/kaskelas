import React, { useState } from 'react';
import { Transaction, TransactionType, TransactionCategory, User } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { 
  ArrowLeftRight, 
  PlusCircle, 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Edit3, 
  Trash2, 
  Calendar,
  Tag
} from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  currentUser: User;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  initialOpenModal?: 'pemasukan' | 'pengeluaran' | null;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  currentUser,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  initialOpenModal = null,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState<boolean>(initialOpenModal !== null);
  const [modalType, setModalType] = useState<TransactionType>(initialOpenModal || 'pemasukan');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<TransactionCategory>('Iuran Kas');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');

  const canManage = currentUser.role === 'ketua' || currentUser.role === 'bendahara';

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleOpenAdd = (type: TransactionType) => {
    setModalType(type);
    setEditingTransaction(null);
    setDate(new Date().toISOString().split('T')[0]);
    setCategory(type === 'pemasukan' ? 'Iuran Kas' : 'ATK & Alat Kelas');
    setAmount('');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setModalType(tx.type);
    setEditingTransaction(tx);
    setDate(tx.date);
    setCategory(tx.category);
    setAmount(tx.amount.toString());
    setDescription(tx.description);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!date || !category || isNaN(numAmount) || numAmount <= 0 || !description) return;

    if (editingTransaction) {
      onEditTransaction({
        ...editingTransaction,
        date,
        type: modalType,
        category,
        amount: numAmount,
        description,
      });
    } else {
      onAddTransaction({
        date,
        type: modalType,
        category,
        amount: numAmount,
        description,
        recordedBy: currentUser.name,
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <ArrowLeftRight className="w-6 h-6 text-indigo-600" />
            <span>Pencatatan & Riwayat Transaksi Kas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Catat dan kelola pemasukan iuran atau pengeluaran operasional kelas.
          </p>
        </div>

        {canManage && (
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleOpenAdd('pemasukan')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Pemasukan</span>
            </button>
            <button
              onClick={() => handleOpenAdd('pengeluaran')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>- Pengeluaran</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('pemasukan')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'pemasukan' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setFilterType('pengeluaran')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'pengeluaran' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pengeluaran
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari keterangan atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Tidak ada transaksi yang sesuai dengan filter.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === 'pemasukan' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {tx.type === 'pemasukan' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        tx.type === 'pemasukan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tx.type}
                      </span>
                      <span className="text-xs font-medium text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">{tx.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{tx.description}</h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(tx.date)}</span>
                      </span>
                      <span>•</span>
                      <span>Pencatat: <strong className="text-slate-700">{tx.recordedBy}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className={`text-lg font-extrabold ${
                    tx.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {tx.type === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </div>

                  {canManage && (
                    <div className="flex items-center space-x-1 sm:ml-4">
                      <button
                        onClick={() => handleOpenEdit(tx)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        title="Edit Transaksi"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Hapus transaksi ini?')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {editingTransaction ? 'Edit Transaksi' : `Tambah ${modalType === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher if creating new */}
              {!editingTransaction && (
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setModalType('pemasukan');
                      setCategory('Iuran Kas');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      modalType === 'pemasukan' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalType('pengeluaran');
                      setCategory('ATK & Alat Kelas');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      modalType === 'pengeluaran' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Pengeluaran
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    {modalType === 'pemasukan' ? (
                      <>
                        <option value="Iuran Kas">Iuran Kas</option>
                        <option value="Sumbangan">Sumbangan</option>
                        <option value="Denda">Denda</option>
                        <option value="Lainnya (Masuk)">Lainnya (Masuk)</option>
                      </>
                    ) : (
                      <>
                        <option value="ATK & Alat Kelas">ATK & Alat Kelas</option>
                        <option value="Kebersihan">Kebersihan</option>
                        <option value="Konsumsi / Acara">Konsumsi / Acara</option>
                        <option value="Fotokopi / Cetak">Fotokopi / Cetak</option>
                        <option value="Lainnya (Keluar)">Lainnya (Keluar)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nominal (Rupiah)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rp</span>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="500"
                    placeholder="Contoh: 25000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Keterangan / Deskripsi</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Pembayaran iuran kas bulan Oktober untuk 5 siswa"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm ${
                    modalType === 'pemasukan' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {editingTransaction ? 'Simpan Perubahan' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
