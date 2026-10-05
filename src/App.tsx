import React, { useState, useEffect } from 'react';
import { User, Student, Transaction, ClassInfo } from './types';
import { INITIAL_STUDENTS, INITIAL_TRANSACTIONS, INITIAL_CLASS_INFO } from './data/mockData';
import { AuthView } from './components/AuthView';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { TransactionsView } from './components/TransactionsView';
import { ReportsView } from './components/ReportsView';
import { ClassSettingsModal } from './components/ClassSettingsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('kaskelas_auth_session');
      return saved ? JSON.parse(saved) as User : null;
    } catch {
      localStorage.removeItem('kaskelas_auth_session');
      return null;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('kaskelas_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kaskelas_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [classInfo, setClassInfo] = useState<ClassInfo>(() => {
    const saved = localStorage.getItem('kaskelas_classinfo');
    return saved ? JSON.parse(saved) : INITIAL_CLASS_INFO;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [initialOpenModal, setInitialOpenModal] = useState<'pemasukan' | 'pengeluaran' | null>(null);
  const [isClassSettingsOpen, setIsClassSettingsOpen] = useState<boolean>(false);

  // Save to localStorage on change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kaskelas_auth_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kaskelas_auth_session');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kaskelas_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('kaskelas_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kaskelas_classinfo', JSON.stringify(classInfo));
  }, [classInfo]);

  // Student Handlers
  const handleUpdateStudentPayment = (studentId: string, weekKey: string, status: boolean) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            payments: {
              ...s.payments,
              [weekKey]: status,
            },
          };
        }
        return s;
      })
    );
  };

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'payments'>) => {
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      ...studentData,
      payments: {},
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleEditStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Transaction Handlers
  const handleAddTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      id: `t-${Date.now()}`,
      ...txData,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleEditTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenAddModalFromDashboard = (type: 'pemasukan' | 'pengeluaran') => {
    setInitialOpenModal(type);
    setActiveTab('transactions');
  };

  const handleLogout = () => {
    localStorage.removeItem('kaskelas_auth_session');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthView onAuthenticated={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        classInfo={classInfo}
        onOpenClassSettings={() => setIsClassSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            classInfo={classInfo}
            students={students}
            transactions={transactions}
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            onOpenAddModal={handleOpenAddModalFromDashboard}
          />
        )}

        {activeTab === 'students' && (
          <StudentsView
            students={students}
            currentUser={currentUser}
            classInfo={classInfo}
            onUpdateStudentPayment={handleUpdateStudentPayment}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            currentUser={currentUser}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            initialOpenModal={initialOpenModal}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            transactions={transactions}
            classInfo={classInfo}
            students={students}
          />
        )}
      </main>

      {/* Class Settings Modal */}
      <ClassSettingsModal
        isOpen={isClassSettingsOpen}
        onClose={() => setIsClassSettingsOpen(false)}
        classInfo={classInfo}
        onUpdateClassInfo={setClassInfo}
      />
    </div>
  );
}
