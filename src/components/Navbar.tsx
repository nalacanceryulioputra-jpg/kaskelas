import React, { useState } from 'react';
import { User, UserRole, ClassInfo } from '../types';
import { Wallet, Users, ArrowLeftRight, FileText, Settings, ChevronDown, Edit3, LogOut } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  classInfo: ClassInfo;
  onOpenClassSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
  activeTab,
  setActiveTab,
  classInfo,
  onOpenClassSettings,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser.name);

  const roleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ketua':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'bendahara':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'siswa':
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const roleLabel = (role: UserRole) => {
    switch (role) {
      case 'ketua':
        return 'Ketua Kelas';
      case 'bendahara':
        return 'Bendahara Kelas';
      case 'siswa':
        return 'Siswa';
    }
  };

  const romanGrade = classInfo.grade === '10' ? 'X' : classInfo.grade === '11' ? 'XI' : 'XII';
  const fullClassName = `${romanGrade} ${classInfo.major} ${classInfo.section}`;
  const canManage = currentUser.role === 'ketua' || currentUser.role === 'bendahara';

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onUpdateUser({
      ...currentUser,
      name: newName.trim(),
    });
    setIsEditingName(false);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                KasKelas
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700">
                  {fullClassName}
                </span>
                {canManage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenClassSettings();
                    }}
                    className="text-[10px] text-slate-400 hover:text-indigo-600 underline"
                    title="Ubah Kelas & Jurusan"
                  >
                    Ubah
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'students'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Data Siswa & Iuran</span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'transactions'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Transaksi</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'reports'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Laporan</span>
            </button>
          </nav>

          {/* Right side: Profile Switcher */}
          <div className="flex items-center space-x-3">
            {canManage && (
              <button
                onClick={onOpenClassSettings}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                title="Pengaturan Kelas & Jurusan"
              >
                <Settings className="w-3.5 h-3.5 text-indigo-600" />
                <span>Kelas</span>
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                <div className="text-left hidden lg:block pr-1">
                  <div className="text-xs font-semibold text-slate-800">{currentUser.name}</div>
                  <div className={`text-[10px] font-medium px-1.5 py-0.2 rounded-full inline-block border ${roleBadgeColor(currentUser.role)}`}>
                    {roleLabel(currentUser.role)}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-3 border-b border-slate-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-500">Masuk sebagai:</p>
                        <p className="font-semibold text-slate-800 text-sm">{currentUser.name}</p>
                      </div>
                      <button
                        onClick={() => {
                          setNewName(currentUser.name);
                          setIsEditingName(true);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1 bg-indigo-50 px-2 py-1 rounded-lg"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Ubah Nama</span>
                      </button>
                    </div>
                    <span className={`mt-2 text-xs font-medium px-2 py-0.5 rounded-full inline-block border ${roleBadgeColor(currentUser.role)}`}>
                      {roleLabel(currentUser.role)}
                    </span>
                  </div>

                  {/* Edit Name Form Inline in Dropdown if active */}
                  {isEditingName ? (
                    <form onSubmit={handleSaveName} className="p-3 bg-slate-50 border-b border-slate-100 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-600">Nama Baru Anda:</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsEditingName(false)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs"
                        >
                          Simpan
                        </button>
                      </div>
                    </form>
                  ) : null}

                  <div className="px-3 pt-3 mt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar Navigation */}
      <div className="md:hidden flex justify-around items-center bg-white border-t border-slate-200 py-2.5 px-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === 'students' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Siswa</span>
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === 'transactions' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span>Transaksi</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center space-y-1 text-xs font-medium ${
            activeTab === 'reports' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Laporan</span>
        </button>
      </div>
    </header>
  );
};
