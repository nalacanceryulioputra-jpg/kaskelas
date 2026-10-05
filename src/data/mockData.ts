import { Student, Transaction, User, ClassInfo } from '../types';

export const INITIAL_CLASS_INFO: ClassInfo = {
  grade: '12',
  major: 'RPL',
  section: '1',
  academicYear: '2026 / 2027',
  schoolName: 'SMA Negeri 1 Nusantara',
  monthlyFee: 5000, // per minggu
  ketuaName: 'Budi Santoso',
  bendaharaName: 'Siti Aminah',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Budi Santoso',
    email: 'ketua@kaskelas.id',
    role: 'ketua',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'u-2',
    name: 'Siti Aminah',
    email: 'bendahara@kaskelas.id',
    role: 'bendahara',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
  {
    id: 'u-3',
    name: 'Andi Pratama',
    email: 'andi@siswa.id',
    role: 'siswa',
    nis: '10001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'u-4',
    name: 'Rina Melati',
    email: 'rina@siswa.id',
    role: 'siswa',
    nis: '10002',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
];

export const WEEKS = [
  { key: '2026-10-w1', label: 'Minggu 1 (Okt)' },
  { key: '2026-10-w2', label: 'Minggu 2 (Okt)' },
  { key: '2026-10-w3', label: 'Minggu 3 (Okt)' },
  { key: '2026-10-w4', label: 'Minggu 4 (Okt)' },
  { key: '2026-11-w1', label: 'Minggu 1 (Nov)' },
  { key: '2026-11-w2', label: 'Minggu 2 (Nov)' },
  { key: '2026-11-w3', label: 'Minggu 3 (Nov)' },
  { key: '2026-11-w4', label: 'Minggu 4 (Nov)' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    nis: '10001',
    name: 'Andi Pratama',
    gender: 'L',
    phone: '081234567890',
    payments: { '2026-10-w1': true, '2026-10-w2': true, '2026-10-w3': true, '2026-10-w4': false },
  },
  {
    id: 's-2',
    nis: '10002',
    name: 'Rina Melati',
    gender: 'P',
    phone: '081298765432',
    payments: { '2026-10-w1': true, '2026-10-w2': true, '2026-10-w3': true, '2026-10-w4': true },
  },
  {
    id: 's-3',
    nis: '10003',
    name: 'Dimas Anggara',
    gender: 'L',
    phone: '085612345678',
    payments: { '2026-10-w1': true, '2026-10-w2': false, '2026-10-w3': false, '2026-10-w4': false },
  },
  {
    id: 's-4',
    nis: '10004',
    name: 'Dewi Lestari',
    gender: 'P',
    phone: '087812345678',
    payments: { '2026-10-w1': true, '2026-10-w2': true, '2026-10-w3': false, '2026-10-w4': false },
  },
  {
    id: 's-5',
    nis: '10005',
    name: 'Fajar Nugraha',
    gender: 'L',
    phone: '081311223344',
    payments: { '2026-10-w1': true, '2026-10-w2': true, '2026-10-w3': true, '2026-10-w4': true },
  },
  {
    id: 's-6',
    nis: '10006',
    name: 'Siti Rahma',
    gender: 'P',
    phone: '085299887766',
    payments: { '2026-10-w1': true, '2026-10-w2': true, '2026-10-w3': true, '2026-10-w4': false },
  },
  {
    id: 's-7',
    nis: '10007',
    name: 'Reza Artamevia',
    gender: 'P',
    phone: '081988776655',
    payments: { '2026-10-w1': false, '2026-10-w2': false, '2026-10-w3': false, '2026-10-w4': false },
  },
  {
    id: 's-8',
    nis: '10008',
    name: 'Yoga Pratama',
    gender: 'L',
    phone: '085733445566',
    payments: { '2026-10-w1': true, '2026-10-w2': true, '2026-10-w3': true, '2026-10-w4': true },
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    date: '2026-10-02',
    type: 'pemasukan',
    category: 'Iuran Kas',
    amount: 40000,
    description: 'Pembayaran Iuran Kas Minggu 1 Oktober (8 Siswa @5k)',
    recordedBy: 'Siti Aminah',
  },
  {
    id: 't-2',
    date: '2026-10-05',
    type: 'pengeluaran',
    category: 'ATK & Alat Kelas',
    amount: 25000,
    description: 'Beli 2 Spidol Whiteboard',
    recordedBy: 'Siti Aminah',
  },
  {
    id: 't-3',
    date: '2026-10-09',
    type: 'pemasukan',
    category: 'Iuran Kas',
    amount: 40000,
    description: 'Pembayaran Iuran Kas Minggu 2 Oktober (8 Siswa @5k)',
    recordedBy: 'Siti Aminah',
  },
  {
    id: 't-4',
    date: '2026-10-12',
    type: 'pengeluaran',
    category: 'Kebersihan',
    amount: 15000,
    description: 'Beli Sabun Pembersih Lantai & Lap Meja',
    recordedBy: 'Budi Santoso',
  },
  {
    id: 't-5',
    date: '2026-10-16',
    type: 'pemasukan',
    category: 'Iuran Kas',
    amount: 35000,
    description: 'Pembayaran Iuran Kas Minggu 3 Oktober (7 Siswa @5k)',
    recordedBy: 'Siti Aminah',
  },
];
