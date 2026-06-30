import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ClipboardList, CreditCard, Sun, Moon, FileText } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Dizimistas from './components/Dizimistas';
import Lancamentos from './components/Lancamentos';
import CartaoDizimo from './components/CartaoDizimo';
import ModalLancamento from './components/ModalLancamento';
import Relatorio from './components/Relatorio';

// Mock/Initial data to match user's attachment
const INITIAL_DIZIMISTAS = [
  { id: '1', nome: 'Carlos Santos', cargo: 'Ev.', telefone: '11987654321', status: 'Ativo' },
  { id: '2', nome: 'Carlos Noan', cargo: 'Presb.', telefone: '', status: 'Ativo' },
  { id: '3', nome: 'Ednaldo Almeida', cargo: 'Dc.', telefone: '', status: 'Ativo' },
  { id: '4', nome: 'Roberto Lima', cargo: 'Dc.', telefone: '', status: 'Ativo' },
  { id: '5', nome: 'Roberto da Silva', cargo: 'Dc.', telefone: '', status: 'Ativo' },
  { id: '6', nome: 'Carlos Leandro', cargo: 'Membro', telefone: '', status: 'Ativo' },
  { id: '7', nome: 'Leandro Santos', cargo: 'Presb.', telefone: '', status: 'Ativo' },
  { id: '8', nome: 'Ruan dos Santos', cargo: 'Dc.', telefone: '', status: 'Ativo' },
  { id: '9', nome: 'Sthefani Figueiredo', cargo: 'Membro', telefone: '', status: 'Ativo' },
  { id: '10', nome: 'Ana Paula Araújo', cargo: 'Obr.', telefone: '', status: 'Ativo' },
  { id: '11', nome: 'Flávia Lima', cargo: 'Dcsa.', telefone: '', status: 'Ativo' },
  { id: '12', nome: 'Taiane Santos', cargo: 'Dcsa.', telefone: '', status: 'Ativo' },
  { id: '13', nome: 'Laís Azeredo', cargo: 'Obr.', telefone: '', status: 'Ativo' },
  { id: '14', nome: 'Tatiane Simas', cargo: 'Dcsa.', telefone: '', status: 'Ativo' },
  { id: '15', nome: 'Luzinete Correa', cargo: 'Dcsa.', telefone: '', status: 'Ativo' },
  { id: '16', nome: 'Alexia da Silva', cargo: 'Dcsa.', telefone: '', status: 'Ativo' },
  { id: '17', nome: 'Isabelly Felix', cargo: 'Membro', telefone: '', status: 'Ativo' },
  { id: '18', nome: 'Joice dos Santos', cargo: 'Membro', telefone: '', status: 'Ativo' },
  { id: '19', nome: 'Rosane Oliveira', cargo: 'Membro', telefone: '', status: 'Ativo' },
  { id: '20', nome: 'Miriam Menezes', cargo: 'Membro', telefone: '', status: 'Ativo' },
  { id: '21', nome: 'Syndel Queiroz', cargo: 'Membro', telefone: '', status: 'Ativo' }
];

const INITIAL_LANCAMENTOS = [
  // Ev. Carlos Santos (2026)
  { id: 'l1', dizimistaId: '1', ano: 2026, mes: 'JAN', valor: 100.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-04' },
  // Ev. Carlos Santos (2025)
  { id: 'l21', dizimistaId: '1', ano: 2025, mes: 'SET', valor: 100.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2025-09-07' },
  
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
  { id: 'l20', dizimistaId: '5', ano: 2026, mes: 'JAN', valor: 200.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-04' },

  // Ir. Carlos Leandro
  { id: 'l22', dizimistaId: '6', ano: 2026, mes: 'MAR', valor: 130.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-06' },
  { id: 'l23', dizimistaId: '6', ano: 2026, mes: 'ABR', valor: 140.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-07' },

  // Presb. Leandro Santos
  { id: 'l24', dizimistaId: '7', ano: 2026, mes: 'FEV', valor: 425.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-01' },
  { id: 'l25', dizimistaId: '7', ano: 2026, mes: 'FEV', valor: 425.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-11' },
  { id: 'l26', dizimistaId: '7', ano: 2026, mes: 'MAR', valor: 100.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-01' },
  { id: 'l27', dizimistaId: '7', ano: 2026, mes: 'MAI', valor: 400.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-29' },

  // Dc. Ruan dos Santos
  { id: 'l28', dizimistaId: '8', ano: 2026, mes: 'JAN', valor: 145.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-05' },
  { id: 'l29', dizimistaId: '8', ano: 2026, mes: 'FEV', valor: 145.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-05' },

  // Sthefani Figueiredo
  { id: 'l30', dizimistaId: '9', ano: 2026, mes: 'JAN', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-05' },
  { id: 'l31', dizimistaId: '9', ano: 2026, mes: 'FEV', valor: 250.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-11' },
  { id: 'l32', dizimistaId: '9', ano: 2026, mes: 'MAR', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-10' },
  { id: 'l33', dizimistaId: '9', ano: 2026, mes: 'ABR', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-04' },
  { id: 'l34', dizimistaId: '9', ano: 2026, mes: 'MAI', valor: 160.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-08' },
  { id: 'l35', dizimistaId: '9', ano: 2026, mes: 'JUN', valor: 160.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-06' },

  // Obr. Ana Paula Araújo
  { id: 'l36', dizimistaId: '10', ano: 2026, mes: 'JAN', valor: 300.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-06' },
  { id: 'l37', dizimistaId: '10', ano: 2026, mes: 'FEV', valor: 242.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-04' },
  { id: 'l38', dizimistaId: '10', ano: 2026, mes: 'MAR', valor: 250.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-09' },
  { id: 'l39', dizimistaId: '10', ano: 2026, mes: 'ABR', valor: 250.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-08' },
  { id: 'l40', dizimistaId: '10', ano: 2026, mes: 'MAI', valor: 200.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-06' },
  { id: 'l41', dizimistaId: '10', ano: 2026, mes: 'JUN', valor: 250.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-03' },

  // Dcsa. Flávia Lima
  { id: 'l42', dizimistaId: '11', ano: 2026, mes: 'JAN', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-07' },
  { id: 'l43', dizimistaId: '11', ano: 2026, mes: 'FEV', valor: 140.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-07' },

  // Dcsa. Taiane Santos
  { id: 'l44', dizimistaId: '12', ano: 2026, mes: 'JAN', valor: 120.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-08' },
  { id: 'l45', dizimistaId: '12', ano: 2026, mes: 'FEV', valor: 140.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-07' },
  { id: 'l46', dizimistaId: '12', ano: 2026, mes: 'MAR', valor: 130.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-06' },
  { id: 'l47', dizimistaId: '12', ano: 2026, mes: 'ABR', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-07' },
  { id: 'l48', dizimistaId: '12', ano: 2026, mes: 'MAI', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-07' },
  { id: 'l49', dizimistaId: '12', ano: 2026, mes: 'JUN', valor: 120.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-06' },

  // Obr. Laís Azeredo
  { id: 'l50', dizimistaId: '13', ano: 2026, mes: 'JAN', valor: 105.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-15' },
  { id: 'l51', dizimistaId: '13', ano: 2026, mes: 'JAN', valor: 105.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-30' },
  { id: 'l52', dizimistaId: '13', ano: 2026, mes: 'FEV', valor: 170.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-10' },
  { id: 'l53', dizimistaId: '13', ano: 2026, mes: 'MAR', valor: 170.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-06' },
  { id: 'l54', dizimistaId: '13', ano: 2026, mes: 'ABR', valor: 160.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-07' },
  { id: 'l55', dizimistaId: '13', ano: 2026, mes: 'ABR', valor: 160.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-17' },
  { id: 'l56', dizimistaId: '13', ano: 2026, mes: 'MAI', valor: 170.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-08' },
  { id: 'l57', dizimistaId: '13', ano: 2026, mes: 'JUN', valor: 170.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-08' },

  // Dcsa. Tatiane Simas
  { id: 'l58', dizimistaId: '14', ano: 2026, mes: 'JAN', valor: 65.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-20' },
  { id: 'l59', dizimistaId: '14', ano: 2026, mes: 'FEV', valor: 65.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-13' },
  { id: 'l60', dizimistaId: '14', ano: 2026, mes: 'MAR', valor: 65.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-19' },
  { id: 'l61', dizimistaId: '14', ano: 2026, mes: 'ABR', valor: 65.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-18' },
  { id: 'l62', dizimistaId: '14', ano: 2026, mes: 'MAI', valor: 65.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-20' },
  { id: 'l63', dizimistaId: '14', ano: 2026, mes: 'JUN', valor: 65.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-18' },

  // Dcsa. Luzinete Correa
  { id: 'l64', dizimistaId: '15', ano: 2026, mes: 'JAN', valor: 85.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-01-31' },
  { id: 'l65', dizimistaId: '15', ano: 2026, mes: 'FEV', valor: 115.15, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-28' },
  { id: 'l66', dizimistaId: '15', ano: 2026, mes: 'MAR', valor: 40.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-04' },
  { id: 'l67', dizimistaId: '15', ano: 2026, mes: 'ABR', valor: 112.33, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-02' },
  { id: 'l68', dizimistaId: '15', ano: 2026, mes: 'MAI', valor: 103.83, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-01' },
  { id: 'l69', dizimistaId: '15', ano: 2026, mes: 'MAI', valor: 103.83, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-18' },
  { id: 'l70', dizimistaId: '15', ano: 2026, mes: 'MAI', valor: 103.83, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-30' },

  // Dcsa. Alexia da Silva
  { id: 'l71', dizimistaId: '16', ano: 2026, mes: 'JAN', valor: 248.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-02' },
  { id: 'l72', dizimistaId: '16', ano: 2026, mes: 'ABR', valor: 100.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-30' },

  // Isabelly Felix
  { id: 'l73', dizimistaId: '17', ano: 2026, mes: 'FEV', valor: 171.84, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-03' },
  { id: 'l74', dizimistaId: '17', ano: 2026, mes: 'MAR', valor: 185.93, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-01' },
  { id: 'l75', dizimistaId: '17', ano: 2026, mes: 'ABR', valor: 199.99, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-06' },
  { id: 'l76', dizimistaId: '17', ano: 2026, mes: 'MAI', valor: 208.14, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-01' },
  { id: 'l77', dizimistaId: '17', ano: 2026, mes: 'MAI', valor: 208.14, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-30' },

  // Joice dos Santos
  { id: 'l78', dizimistaId: '18', ano: 2026, mes: 'FEV', valor: 100.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-02-08' },
  { id: 'l79', dizimistaId: '18', ano: 2026, mes: 'MAR', valor: 120.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-03-31' },
  { id: 'l80', dizimistaId: '18', ano: 2026, mes: 'ABR', valor: 120.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-01' },
  { id: 'l81', dizimistaId: '18', ano: 2026, mes: 'MAI', valor: 120.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-03' },

  // Rosane Oliveira
  { id: 'l82', dizimistaId: '19', ano: 2026, mes: 'ABR', valor: 130.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-04-05' },
  { id: 'l83', dizimistaId: '19', ano: 2026, mes: 'MAI', valor: 130.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-05-08' },
  { id: 'l84', dizimistaId: '19', ano: 2026, mes: 'JUN', valor: 130.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-01' },

  // Miriam Menezes
  { id: 'l85', dizimistaId: '20', ano: 2026, mes: 'JUN', valor: 434.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-06' },

  // Syndel Queiroz
  { id: 'l86', dizimistaId: '21', ano: 2026, mes: 'JUN', valor: 150.00, tesoureiro: 'Dcsa. Suzana Lima', dataEntrega: '2026-06-29' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dizimistas, setDizimistas] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [tesoureiros, setTesoureiros] = useState([]);
  
  // Theme state
  const [theme, setTheme] = useState('light');

  // Selected Dizimista for card generation
  const [selectedCardDizimistaId, setSelectedCardDizimistaId] = useState('');

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const isV8Loaded = localStorage.getItem('adfare_loaded_v8');
    
    if (!isV8Loaded) {
      // Force initial load of the official church records from user's screenshots (with multi-payment support - v8 database)
      setDizimistas(INITIAL_DIZIMISTAS);
      setLancamentos(INITIAL_LANCAMENTOS);
      localStorage.setItem('adfare_dizimistas', JSON.stringify(INITIAL_DIZIMISTAS));
      localStorage.setItem('adfare_lancamentos', JSON.stringify(INITIAL_LANCAMENTOS));
      localStorage.setItem('adfare_loaded_v8', 'true');
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

    // Load tesoureiros list
    const savedTesoureiros = localStorage.getItem('adfare_tesoureiros');
    if (savedTesoureiros) {
      setTesoureiros(JSON.parse(savedTesoureiros));
    } else {
      const defaultTesoureiros = ['Dcsa. Suzana Lima'];
      setTesoureiros(defaultTesoureiros);
      localStorage.setItem('adfare_tesoureiros', JSON.stringify(defaultTesoureiros));
    }
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

  const saveTesoureiros = (newList) => {
    setTesoureiros(newList);
    localStorage.setItem('adfare_tesoureiros', JSON.stringify(newList));
  };

  const handleAddTesoureiro = (nome) => {
    const clean = nome.trim();
    if (!clean || tesoureiros.includes(clean)) return;
    saveTesoureiros([...tesoureiros, clean]);
  };

  const handleRemoveTesoureiro = (nome) => {
    saveTesoureiros(tesoureiros.filter(t => t !== nome));
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
    // Pre-fill and open modal with specific transaction ID
    setModalInitialData({
      dizimistaId: tx.dizimistaId,
      ano: tx.ano,
      mes: tx.mes,
      editLaunchId: tx.id
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
            tesoureiros={tesoureiros}
            onAddTesoureiro={handleAddTesoureiro}
            onRemoveTesoureiro={handleRemoveTesoureiro}
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

        {activeTab === 'relatorio' && (
          <Relatorio
            dizimistas={dizimistas}
            lancamentos={lancamentos}
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
        tesoureiros={tesoureiros}
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
        <button 
          className={`tab-item ${activeTab === 'relatorio' ? 'active' : ''}`}
          onClick={() => setActiveTab('relatorio')}
        >
          <FileText />
          Relatório
        </button>
      </nav>
    </>
  );
}
