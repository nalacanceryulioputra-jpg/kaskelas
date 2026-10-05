import { ClassInfo } from '../types';

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  } catch {
    return dateStr;
  }
};

export const formatClassName = (info: ClassInfo): string => {
  const romanGrade = info.grade === '10' ? 'X' : info.grade === '11' ? 'XI' : 'XII';
  return `${romanGrade} ${info.major} ${info.section}`;
};
