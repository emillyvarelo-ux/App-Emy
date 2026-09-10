import React, { useState, useEffect } from "react";
import {
  Student,
  PedagogicalUser,
  ActivityOriginal,
  ActivityAdaptation,
  ProgressLog
} from "./types";
import { localDb } from "./services/db";
import { Navbar } from "./components/Navbar";
import { ActivityAdapter } from "./components/ActivityAdapter";
import { StudentDashboard } from "./components/StudentDashboard";
import { AntiBullyingLibrary } from "./components/AntiBullyingLibrary";
import { StudentManager } from "./components/StudentManager";
import { TeamManager } from "./components/TeamManager";
import { PrintSheetModal } from "./components/PrintSheetModal";
import { BackupModal } from "./components/BackupModal";
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Brain,
  Award,
  BookOpen
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("adapter");
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<PedagogicalUser[]>([]);
  const [currentUser, setCurrentUser] = useState<PedagogicalUser>(localDb.getCurrentUser());
  const [activities, setActivities] = useState<ActivityOriginal[]>([]);
  const [adaptations, setAdaptations] = useState<ActivityAdaptation[]>([]);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);

  // Modals & Navigation triggers
  const [selectedForPrint, setSelectedForPrint] = useState<ActivityAdaptation | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [adapterInitialActivity, setAdapterInitialActivity] = useState<ActivityOriginal | null>(null);
  const [adapterInitialStudent, setAdapterInitialStudent] = useState<Student | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadAllData = async () => {
    try {
      const [sts, uss, acts, adpts, logs] = await Promise.all([
        localDb.getStudents(),
        localDb.getUsers(),
        localDb.getActivities(),
        localDb.getAdaptations(),
        localDb.getProgressLogs()
      ]);

      setStudents(sts);
      setUsers(uss);
      setActivities(acts);
      setAdaptations(adpts);
      setProgressLogs(logs);

      // Verify current user
      const curr = localDb.getCurrentUser();
      const existing = uss.find((u) => u.id === curr.id);
      if (existing) {
        setCurrentUser(existing);
      } else if (uss.length > 0) {
        setCurrentUser(uss[0]);
        localDb.setCurrentUser(uss[0]);
      }
    } catch (e) {
      console.error("Erro ao carregar dados do banco local:", e);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSwitchUser = (user: PedagogicalUser) => {
    setCurrentUser(user);
    localDb.setCurrentUser(user);
  };

  const handleSelectActivityForAdaptation = (act: ActivityOriginal) => {
    setAdapterInitialActivity(act);
    setActiveTab("adapter");
  };

  const handleSelectStudentForAdaptation = (st: Student) => {
    setAdapterInitialStudent(st);
    setActiveTab("adapter");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-purple-50/40 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-md animate-pulse">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-purple-950">
            Inicializando Ambiente NeuroEduca...
          </p>
          <p className="text-xs text-purple-700/80">Carregando dados seguros no navegador (offline-first)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50/20 text-purple-950 flex flex-col antialiased selection:bg-purple-200 selection:text-purple-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "adapter" && (
          <ActivityAdapter
            students={students}
            activities={activities}
            currentUser={currentUser}
            onSaveAdaptation={(saved) => {
              setAdaptations((prev) => [saved, ...prev.filter((a) => a.id !== saved.id)]);
            }}
            onOpenPrintSheet={(adapt) => setSelectedForPrint(adapt)}
            initialActivity={adapterInitialActivity}
            initialStudent={adapterInitialStudent}
          />
        )}

        {activeTab === "dashboard" && (
          <StudentDashboard
            students={students}
            progressLogs={progressLogs}
            currentUser={currentUser}
            adaptations={adaptations}
            onAddLog={(newLog) => setProgressLogs((prev) => [newLog, ...prev])}
            onOpenAdapterForStudent={handleSelectStudentForAdaptation}
          />
        )}

        {activeTab === "library" && (
          <AntiBullyingLibrary
            activities={activities}
            currentUser={currentUser}
            onSelectActivityForAdaptation={handleSelectActivityForAdaptation}
            onActivityCreated={(created) => setActivities((prev) => [created, ...prev])}
          />
        )}

        {activeTab === "students" && (
          <StudentManager
            students={students}
            currentUser={currentUser}
            onStudentUpdated={loadAllData}
            onAdaptForStudent={handleSelectStudentForAdaptation}
          />
        )}

        {activeTab === "team" && (
          <TeamManager
            users={users}
            currentUser={currentUser}
            onSwitchUser={handleSwitchUser}
            onUserCreated={loadAllData}
          />
        )}
      </main>

      {/* Footer - Purple Theme */}
      <footer className="border-t border-purple-100 bg-white py-6 text-xs text-purple-700/80 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-bold text-purple-950 flex items-center justify-center sm:justify-start gap-1.5">
              <HeartHandshake className="w-4 h-4 text-purple-600" />
              <span>NeuroEduca • Pedagogia Inclusiva, Desenho Universal (DUA) & Prevenção ao Bullying</span>
            </p>
            <p className="text-[11px] text-purple-700/80">
              Banco de Dados Local (IndexedDB) • Privacidade Máxima em Conformidade com a LGPD • Totalmente Funcional Offline
            </p>
          </div>
          <div className="flex items-center gap-4 text-purple-800 font-semibold text-[11px]">
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hover:text-purple-950 transition-colors cursor-pointer"
            >
              Exportar Backup Escolar
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("team")}
              className="hover:text-purple-950 transition-colors cursor-pointer"
            >
              Controle de Acesso RBAC
            </button>
          </div>
        </div>
      </footer>

      {/* Print Sheet Modal */}
      {selectedForPrint && (
        <PrintSheetModal
          key={selectedForPrint.id}
          adaptation={selectedForPrint}
          onClose={() => setSelectedForPrint(null)}
        />
      )}

      {/* Backup & Privacy Modal */}
      {isBackupOpen && (
        <BackupModal
          onClose={() => setIsBackupOpen(false)}
          onDataRestored={loadAllData}
        />
      )}
    </div>
  );
}
