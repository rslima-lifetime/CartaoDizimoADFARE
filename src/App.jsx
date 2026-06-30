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
  { id: 'l1', dizimistaId: '1', ano: 2026, mes: 'JAN', valor: 100.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-04' },
  
  // Presb. Carlos Noan
  { id: 'l2', dizimistaId: '2', ano: 2026, mes: 'JAN', valor: 270.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-09' },
  { id: 'l3', dizimistaId: '2', ano: 2026, mes: 'FEV', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-06' },
  { id: 'l4', dizimistaId: '2', ano: 2026, mes: 'FEV', valor: 140.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-19' },
  { id: 'l5', dizimistaId: '2', ano: 2026, mes: 'MAR', valor: 130.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-06' },
  { id: 'l6', dizimistaId: '2', ano: 2026, mes: 'MAR', valor: 120.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-29' },
  { id: 'l7', dizimistaId: '2', ano: 2026, mes: 'ABR', valor: 125.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-07' },
  { id: 'l8', dizimistaId: '2', ano: 2026, mes: 'ABR', valor: 125.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-15' },
  { id: 'l9', dizimistaId: '2', ano: 2026, mes: 'MAI', valor: 200.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-01' },
  { id: 'l10', dizimistaId: '2', ano: 2026, mes: 'MAI', valor: 176.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-05' },
  { id: 'l11', dizimistaId: '2', ano: 2026, mes: 'MAI', valor: 200.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-18' },
  { id: 'l12', dizimistaId: '2', ano: 2026, mes: 'JUN', valor: 160.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-05' },
  { id: 'l13', dizimistaId: '2', ano: 2026, mes: 'JUN', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-17' },

  // Dc. Ednaldo Almeida
  { id: 'l14', dizimistaId: '3', ano: 2026, mes: 'JAN', valor: 148.41, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-08' },
  { id: 'l15', dizimistaId: '3', ano: 2026, mes: 'FEV', valor: 142.10, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-06' },
  { id: 'l16', dizimistaId: '3', ano: 2026, mes: 'ABR', valor: 116.78, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-07' },
  { id: 'l17', dizimistaId: '3', ano: 2026, mes: 'MAI', valor: 330.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-10' },
  { id: 'l18', dizimistaId: '3', ano: 2026, mes: 'JUN', valor: 268.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-08' },

  // Dc. Roberto Lima
  { id: 'l19', dizimistaId: '4', ano: 2026, mes: 'JAN', valor: 60.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-09' },

  // Dc. Roberto da Silva
  { id: 'l20', dizimistaId: '5', ano: 2026, mes: 'JAN', valor: 200.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-04' }
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
    const isV4Loaded = localStorage.getItem('adfare_loaded_v4');
    
    if (!isV4Loaded) {
      // Force initial load of the official church records from user's screenshots (with multi-payment support)
      setDizimistas(INITIAL_DIZIMISTAS);
      setLancamentos(INITIAL_LANCAMENTOS);
      localStorage.setItem('adfare_dizimistas', JSON.stringify(INITIAL_DIZIMISTAS));
      localStorage.setItem('adfare_lancamentos', JSON.stringify(INITIAL_LANCAMENTOS));
      localStorage.setItem('adfare_loaded_v4', 'true');
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
    if (data.id) {
      // Update existing item
      const updated = lancamentos.map(l => l.id === data.id ? { ...l, ...data } : l);
      saveLancamentos(updated);
    } else {
      // Add new item
      const newEntry = {
        ...data,
        id: Date.now().toString()
      };
      saveLancamentos([...lancamentos, newEntry]);
    }
  };

  const handleDeleteLancamentoById = (id) => {
    const updated = lancamentos.filter(l => l.id !== id);
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
            onDeleteLancamento={handleDeleteLancamentoById}
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
        onDelete={handleDeleteLancamentoById}
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
