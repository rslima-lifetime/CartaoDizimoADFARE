import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ClipboardList, CreditCard, Sun, Moon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Dizimistas from './components/Dizimistas';
import Lancamentos from './components/Lancamentos';
import CartaoDizimo from './components/CartaoDizimo';
import ModalLancamento from './components/ModalLancamento';

// Mock/Initial data to match user's attachment
const INITIAL_DIZIMISTAS = [
  { id: '1', nome: 'Carlos Santos', cargo: 'Ev.', telefone: '11987654321', status: 'Ativo' },
  { id: '2', nome: 'Carlos Noan', cargo: 'Presb.', telefone: '', status: 'Ativo' },
  { id: '3', nome: 'Ednaldo Almeida', cargo: 'Dc.', telefone: '', status: 'Ativo' },
  { id: '4', nome: 'Roberto Lima', cargo: 'Dc.', telefone: '', status: 'Ativo' },
  { id: '5', nome: 'Roberto da Silva', cargo: 'Dc.', telefone: '', status: 'Ativo' }
];

const INITIAL_LANCAMENTOS = [
  // Ev. Carlos Santos
  { dizimistaId: '1', ano: 2026, mes: 'JAN', valor: 100.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '2026-01-04T10:00:00.000Z' },
  
  // Presb. Carlos Noan
  { dizimistaId: '2', ano: 2026, mes: 'JAN', valor: 270.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '09/01' },
  { dizimistaId: '2', ano: 2026, mes: 'FEV', valor: 290.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '06/02 - 19/02' },
  { dizimistaId: '2', ano: 2026, mes: 'MAR', valor: 250.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '06/03 - 29/03' },
  { dizimistaId: '2', ano: 2026, mes: 'ABR', valor: 250.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '07/04 - 15/04' },
  { dizimistaId: '2', ano: 2026, mes: 'MAI', valor: 576.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '01/05 - 05/05 - 18/05' },
  { dizimistaId: '2', ano: 2026, mes: 'JUN', valor: 310.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '05/06 - 17/06' },

  // Dc. Ednaldo Almeida
  { dizimistaId: '3', ano: 2026, mes: 'JAN', valor: 148.41, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '08/01' },
  { dizimistaId: '3', ano: 2026, mes: 'FEV', valor: 142.10, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '06/02' },
  { dizimistaId: '3', ano: 2026, mes: 'ABR', valor: 116.78, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '07/04' },
  { dizimistaId: '3', ano: 2026, mes: 'MAI', valor: 330.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '10/05' },
  { dizimistaId: '3', ano: 2026, mes: 'JUN', valor: 268.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '08/06' },

  // Dc. Roberto Lima
  { dizimistaId: '4', ano: 2026, mes: 'JAN', valor: 60.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '09/01' },

  // Dc. Roberto da Silva
  { dizimistaId: '5', ano: 2026, mes: 'JAN', valor: 200.00, tesoureiro: 'Dcsa. Suzana Lima', dataLançamento: '04/01' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dizimistas, setDizimistas] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  
  // Theme state
  const [theme, setTheme] = useState('light');

  // Selected Dizimista for card generation
  const [selectedCardDizimistaId, setSelectedCardDizimistaId] = useState('');

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const isV3Loaded = localStorage.getItem('adfare_loaded_v3');
    
    if (!isV3Loaded) {
      // Force initial load of the official church records from user's screenshots
      setDizimistas(INITIAL_DIZIMISTAS);
      setLancamentos(INITIAL_LANCAMENTOS);
      localStorage.setItem('adfare_dizimistas', JSON.stringify(INITIAL_DIZIMISTAS));
      localStorage.setItem('adfare_lancamentos', JSON.stringify(INITIAL_LANCAMENTOS));
      localStorage.setItem('adfare_loaded_v3', 'true');
    } else {
      const savedDizimistas = localStorage.getItem('adfare_dizimistas');
      const savedLancamentos = localStorage.getItem('adfare_lancamentos');
      
      if (savedDizimistas) {
        setDizimistas(JSON.parse(savedDizimistas));
      } else {
        setDizimistas(INITIAL_DIZIMISTAS);
        localStorage.setItem('adfare_dizimistas', JSON.stringify(INITIAL_DIZIMISTAS));
      }

      if (savedLancamentos) {
        setLancamentos(JSON.parse(savedLancamentos));
      } else {
        setLancamentos(INITIAL_LANCAMENTOS);
        localStorage.setItem('adfare_lancamentos', JSON.stringify(INITIAL_LANCAMENTOS));
      }
    }

    const savedTheme = localStorage.getItem('adfare_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Sync state to local storage helper
  const saveDizimistas = (newData) => {
    setDizimistas(newData);
    localStorage.setItem('adfare_dizimistas', JSON.stringify(newData));
  };

  const saveLancamentos = (newData) => {
    setLancamentos(newData);
    localStorage.setItem('adfare_lancamentos', JSON.stringify(newData));
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('adfare_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Dizimistas CRUD
  const handleAddDizimista = (data) => {
    const newDizimista = {
      ...data,
      id: Date.now().toString()
    };
    saveDizimistas([...dizimistas, newDizimista]);
  };

  const handleUpdateDizimista = (id, data) => {
    const updated = dizimistas.map(d => d.id === id ? { ...d, ...data } : d);
    saveDizimistas(updated);
  };

  const handleDeleteDizimista = (id) => {
    // Delete tither
    const updatedDizimistas = dizimistas.filter(d => d.id !== id);
    saveDizimistas(updatedDizimistas);
    // Delete all corresponding contributions
    const updatedLancamentos = lancamentos.filter(l => l.dizimistaId !== id);
    saveLancamentos(updatedLancamentos);

    if (selectedCardDizimistaId === id) {
      setSelectedCardDizimistaId('');
    }
  };

  // Lancamentos CRUD
  const handleSaveLancamento = (data) => {
    // Check if entry already exists (same dizimista, same year, same month)
    const existsIndex = lancamentos.findIndex(
      l => l.dizimistaId === data.dizimistaId && l.ano === data.ano && l.mes === data.mes
    );

    let updated;
    if (existsIndex >= 0) {
      updated = [...lancamentos];
      updated[existsIndex] = { ...updated[existsIndex], ...data };
    } else {
      updated = [...lancamentos, data];
    }
    saveLancamentos(updated);
  };

  const handleDeleteLancamento = (dizimistaId, ano, mes) => {
    const updated = lancamentos.filter(
      l => !(l.dizimistaId === dizimistaId && l.ano === ano && l.mes === mes)
    );
    saveLancamentos(updated);
  };

  const handleEditLancamento = (tx) => {
    // Pre-fill and open modal
    setModalInitialData({
      dizimistaId: tx.dizimistaId,
      ano: tx.ano,
      mes: tx.mes
    });
    setIsModalOpen(true);
  };

  // Navigation handlers
  const handleViewCard = (dizimistaId) => {
    setSelectedCardDizimistaId(dizimistaId);
    setActiveTab('cartao');
  };

  const handleCellClick = (cellData) => {
    // Open modal with prefilled details
    setModalInitialData(cellData);
    setIsModalOpen(true);
  };

  const handleOpenNewLancamento = () => {
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  // Backup handlers
  const exportData = () => {
    const dataStr = JSON.stringify({ dizimistas, lancamentos }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backup_adfare_dizimos_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (importedState) => {
    saveDizimistas(importedState.dizimistas);
    saveLancamentos(importedState.lancamentos);
  };

  return (
    <>
      {/* Top Header */}
      <header 
        style={{ 
          height: '60px', 
          backgroundColor: 'var(--bg-card)', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--primary)', letterSpacing: '0.5px' }}>
            ADFARE DÍZIMOS
          </h1>
        </div>
        <button 
          onClick={toggleTheme} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--text-main)',
            padding: '8px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* Dynamic Content */}
      <main className="app-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            dizimistas={dizimistas}
            lancamentos={lancamentos}
            onOpenModal={handleOpenNewLancamento}
            exportData={exportData}
            importData={importData}
          />
        )}
        
        {activeTab === 'dizimistas' && (
          <Dizimistas 
            dizimistas={dizimistas}
            lancamentos={lancamentos}
            onAddDizimista={handleAddDizimista}
            onUpdateDizimista={handleUpdateDizimista}
            onDeleteDizimista={handleDeleteDizimista}
            onViewCard={handleViewCard}
          />
        )}

        {activeTab === 'lancamentos' && (
          <Lancamentos 
            lancamentos={lancamentos}
            dizimistas={dizimistas}
            onOpenModal={handleOpenNewLancamento}
            onDeleteLancamento={handleDeleteLancamento}
            onEditLancamento={handleEditLancamento}
          />
        )}

        {activeTab === 'cartao' && (
          <CartaoDizimo 
            dizimistas={dizimistas}
            lancamentos={lancamentos}
            selectedDizimistaId={selectedCardDizimistaId}
            setSelectedDizimistaId={setSelectedCardDizimistaId}
            onCellClick={handleCellClick}
          />
        )}
      </main>

      {/* Global Launch/Edit Modal */}
      <ModalLancamento 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLancamento}
        dizimistas={dizimistas}
        lancamentos={lancamentos}
        initialData={modalInitialData}
      />

      {/* Bottom Navigation Tabbar */}
      <nav className="bottom-tabbar">
        <button 
          className={`tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard />
          Painel
        </button>
        <button 
          className={`tab-item ${activeTab === 'dizimistas' ? 'active' : ''}`}
          onClick={() => setActiveTab('dizimistas')}
        >
          <Users />
          Dizimistas
        </button>
        <button 
          className={`tab-item ${activeTab === 'lancamentos' ? 'active' : ''}`}
          onClick={() => setActiveTab('lancamentos')}
        >
          <ClipboardList />
          Lançamentos
        </button>
        <button 
          className={`tab-item ${activeTab === 'cartao' ? 'active' : ''}`}
          onClick={() => setActiveTab('cartao')}
        >
          <CreditCard />
          Cartões
        </button>
      </nav>
    </>
  );
}
