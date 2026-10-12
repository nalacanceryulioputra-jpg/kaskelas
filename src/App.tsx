import React, { useState, useEffect } from 'react';
import { User, Student, Transaction, ClassInfo, ClassFinancialData } from './types';
import { INITIAL_STUDENTS, INITIAL_TRANSACTIONS, INITIAL_CLASS_INFO } from './data/mockData';
import { CLASS_OPTIONS, createClassInfo, isClassId } from './data/classes';
import { AuthView } from './components/AuthView';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { TransactionsView } from './components/TransactionsView';
import { ReportsView } from './components/ReportsView';
import { ClassSettingsModal } from './components/ClassSettingsModal';

const classDataStorageKey = 'kaskelas_class_data_v1';
const legacyClassOption = CLASS_OPTIONS.find((classOption) => classOption.id === 'rpl-11-1');

if (!legacyClassOption) {
  throw new Error('Legacy class migration target is missing.');
}

const isClassFinancialData = (value: unknown): value is ClassFinancialData => {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<ClassFinancialData>;
  return Array.isArray(data.students) && Array.isArray(data.transactions) &&
    Boolean(data.classInfo && typeof data.classInfo === 'object');
};

const createInitialClassData = (): Record<string, ClassFinancialData> => {
  const data = Object.fromEntries(
    CLASS_OPTIONS.map((classOption) => [
      classOption.id,
      {
        students: [],
        transactions: [],
        classInfo: createClassInfo(classOption, INITIAL_CLASS_INFO),
      },
    ]),
  ) as Record<string, ClassFinancialData>;
  const legacyClassId = 'rpl-11-1';
  data[legacyClassId] = {
    students: INITIAL_STUDENTS,
    transactions: INITIAL_TRANSACTIONS,
    classInfo: createClassInfo(legacyClassOption, INITIAL_CLASS_INFO),
  };
  return data;
};

const loadClassData = (): Record<string, ClassFinancialData> => {
  const initialData = createInitialClassData();
  const saved = localStorage.getItem(classDataStorageKey);
  if (saved) {
    const parsed: unknown = JSON.parse(saved);
    if (parsed && typeof parsed === 'object') {
      for (const classOption of CLASS_OPTIONS) {
        const savedClassData = (parsed as Record<string, unknown>)[classOption.id];
        if (isClassFinancialData(savedClassData)) {
          initialData[classOption.id] = savedClassData;
        }
      }
    }
    return initialData;
  }

  const legacyStudents = localStorage.getItem('kaskelas_students');
  const legacyTransactions = localStorage.getItem('kaskelas_transactions');
  const legacyClassInfo = localStorage.getItem('kaskelas_classinfo');
  if (legacyStudents || legacyTransactions || legacyClassInfo) {
    const legacyClassId = 'rpl-11-1';
    initialData[legacyClassId] = {
      students: legacyStudents ? JSON.parse(legacyStudents) as Student[] : INITIAL_STUDENTS,
      transactions: legacyTransactions ? JSON.parse(legacyTransactions) as Transaction[] : INITIAL_TRANSACTIONS,
      classInfo: legacyClassInfo
        ? {
            ...createClassInfo(legacyClassOption, INITIAL_CLASS_INFO),
            ...JSON.parse(legacyClassInfo) as ClassInfo,
            grade: legacyClassOption.grade,
            major: legacyClassOption.major,
            section: legacyClassOption.section,
          }
        : initialData[legacyClassId].classInfo,
    };
  }
  return initialData;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('kaskelas_auth_session');
      const user = saved ? JSON.parse(saved) as User : null;
      return user && isClassId(user.classId) ? user : null;
    } catch {
      localStorage.removeItem('kaskelas_auth_session');
      return null;
    }
  });

  const [classData, setClassData] = useState<Record<string, ClassFinancialData>>(loadClassData);

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
    localStorage.setItem(classDataStorageKey, JSON.stringify(classData));
  }, [classData]);

  const updateCurrentClassData = (update: (data: ClassFinancialData) => ClassFinancialData) => {
    const classId = currentUser?.classId;
    if (!classId || !classData[classId]) return;
    setClassData((previous) => ({
      ...previous,
      [classId]: update(previous[classId]),
    }));
  };

  // Student Handlers
  const handleUpdateStudentPayment = (studentId: string, weekKey: string, status: boolean) => {
    updateCurrentClassData((data) => ({
      ...data,
      students: data.students.map((s) => {
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
      }),
    }));
  };

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'payments'>) => {
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      ...studentData,
      payments: {},
    };
    updateCurrentClassData((data) => ({ ...data, students: [...data.students, newStudent] }));
  };

  const handleEditStudent = (updatedStudent: Student) => {
    updateCurrentClassData((data) => ({
      ...data,
      students: data.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    }));
  };

  const handleDeleteStudent = (id: string) => {
    updateCurrentClassData((data) => ({
      ...data,
      students: data.students.filter((s) => s.id !== id),
    }));
  };

  // Transaction Handlers
  const handleAddTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      id: `t-${Date.now()}`,
      ...txData,
    };
    updateCurrentClassData((data) => ({ ...data, transactions: [newTx, ...data.transactions] }));
  };

  const handleEditTransaction = (updatedTx: Transaction) => {
    updateCurrentClassData((data) => ({
      ...data,
      transactions: data.transactions.map((t) => (t.id === updatedTx.id ? updatedTx : t)),
    }));
  };

  const handleDeleteTransaction = (id: string) => {
    updateCurrentClassData((data) => ({
      ...data,
      transactions: data.transactions.filter((t) => t.id !== id),
    }));
  };

  const handleUpdateClassInfo = (classInfo: ClassInfo) => {
    updateCurrentClassData((data) => ({ ...data, classInfo }));
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
  if (!isClassId(currentUser.classId) || !classData[currentUser.classId]) {
    return <AuthView onAuthenticated={setCurrentUser} />;
  }

  const { students, transactions, classInfo } = classData[currentUser.classId];

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
        onUpdateClassInfo={handleUpdateClassInfo}
      />
    </div>
  );
}
