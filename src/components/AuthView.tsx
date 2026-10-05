import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { User, UserRole } from '../types';

interface StoredAccount {
  user: User;
  salt: string;
  passwordHash: string;
}

interface AuthViewProps {
  onAuthenticated: (user: User) => void;
}

const accountsStorageKey = 'kaskelas_accounts';

const readAccounts = (): StoredAccount[] => {
  try {
    const saved = localStorage.getItem(accountsStorageKey);
    const accounts: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(accounts) ? accounts as StoredAccount[] : [];
  } catch {
    return [];
  }
};

const hashPassword = async (password: string, salt: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const digest = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(salt),
      iterations: 210000,
      hash: 'SHA-256',
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const createSalt = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

export const AuthView: React.FC<AuthViewProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('siswa');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();
    const accounts = readAccounts();

    try {
      if (mode === 'login') {
        const account = accounts.find((entry) => entry.user.email === normalizedEmail);
        if (!account || await hashPassword(password, account.salt) !== account.passwordHash) {
          setError('Email atau kata sandi tidak sesuai.');
          return;
        }
        onAuthenticated(account.user);
        return;
      }

      if (password.length < 8) {
        setError('Kata sandi harus terdiri dari minimal 8 karakter.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      if (accounts.some((entry) => entry.user.email === normalizedEmail)) {
        setError('Email tersebut sudah terdaftar.');
        return;
      }

      const user: User = {
        id: `u-${crypto.randomUUID()}`,
        name: name.trim(),
        email: normalizedEmail,
        role,
      };
      const salt = createSalt();
      accounts.push({ user, salt, passwordHash: await hashPassword(password, salt) });
      localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
      onAuthenticated(user);
    } catch {
      setError('Akun tidak dapat diproses. Periksa dukungan browser lalu coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
      <section className="flex min-h-56 flex-col justify-between bg-linear-to-br from-indigo-700 via-indigo-700 to-violet-800 px-6 py-7 text-white sm:px-10 sm:py-9 lg:min-h-screen lg:px-16 lg:py-14">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Wallet className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold">KasKelas</span>
        </div>
        <div className="mt-8 max-w-lg lg:mb-12">
          <p className="mb-3 text-sm font-semibold text-indigo-100">Pengelolaan kas kelas</p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Kas kelas tertata, semua lebih tenang.</h1>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Selamat datang' : 'Buat akun'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {mode === 'login' ? 'Masuk untuk melanjutkan ke KasKelas.' : 'Daftar untuk mulai menggunakan KasKelas.'}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Jenis autentikasi">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => switchMode('login')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${mode === 'login' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Masuk
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              onClick={() => switchMode('signup')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${mode === 'signup' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Buat akun
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-slate-700">Nama lengkap</label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Nama Anda"
                />
              </div>
            )}
            {mode === 'signup' && (
              <div>
                <label htmlFor="signup-role" className="mb-1.5 block text-sm font-medium text-slate-700">Peran</label>
                <select
                  id="signup-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="siswa">Siswa</option>
                  <option value="bendahara">Bendahara</option>
                  <option value="ketua">Ketua Kelas</option>
                </select>
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-slate-700">Kata sandi</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={mode === 'signup' ? 8 : undefined}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={mode === 'signup' ? 'Minimal 8 karakter' : 'Masukkan kata sandi'}
              />
            </div>
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-slate-700">Konfirmasi kata sandi</label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Ulangi kata sandi"
                />
              </div>
            )}

            {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat akun'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};