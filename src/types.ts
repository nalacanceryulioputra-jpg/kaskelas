export type UserRole = 'ketua' | 'bendahara' | 'siswa';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classId?: string;
  nis?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  gender: 'L' | 'P';
  phone: string;
  payments: {
    [weekKey: string]: boolean; // e.g. '2026-10-w1': true
  };
}

export type TransactionType = 'pemasukan' | 'pengeluaran';
export type TransactionCategory = 
  | 'Iuran Kas' 
  | 'Sumbangan' 
  | 'Denda' 
  | 'Lainnya (Masuk)'
  | 'ATK & Alat Kelas' 
  | 'Kebersihan' 
  | 'Konsumsi / Acara' 
  | 'Fotokopi / Cetak' 
  | 'Lainnya (Keluar)';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  recordedBy: string;
}

export type MajorType = 'RPL' | 'Akuntansi' | 'TKJ' | 'TKR';
export type GradeType = '10' | '11' | '12';

export interface ClassInfo {
  grade: GradeType;
  major: MajorType;
  section: string; // e.g. '1'
  academicYear: string;
  schoolName: string;
  monthlyFee: number; // iuran per minggu
  ketuaName: string;
  bendaharaName: string;
}

export interface ClassFinancialData {
  students: Student[];
  transactions: Transaction[];
  classInfo: ClassInfo;
}
