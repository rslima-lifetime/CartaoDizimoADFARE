import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ClipboardList, CreditCard, Sun, Moon, FileText } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Dizimistas from './components/Dizimistas';
import Lancamentos from './components/Lancamentos';
import CartaoDizimo from './components/CartaoDizimo';
import ModalLancamento from './components/ModalLancamento';
import Relatorio from './components/Relatorio';
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch 
} from 'firebase/firestore';

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
  { id: 'l1', dizimistaId: '1', ano: 2026, mes: 'JAN', valor: 100.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-04' },
  // Ev. Carlos Santos (2025)
  { id: 'l21', dizimistaId: '1', ano: 2025, mes: 'SET', valor: 100.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2025-09-07' },
  
  // Presb. Carlos Noan
  { id: 'l2', dizimistaId: '2', ano: 2026, mes: 'JAN', valor: 270.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-09' },
  { id: 'l3', dizimistaId: '2', ano: 2026, mes: 'FEV', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-06' },
  { id: 'l4', dizimistaId: '2', ano: 2026, mes: 'FEV', valor: 140.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-19' },
  { id: 'l5', dizimistaId: '2', ano: 2026, mes: 'MAR', valor: 130.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-06' },
  { id: 'l6', dizimistaId: '2', ano: 2026, mes: 'MAR', valor: 120.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-29' },
  { id: 'l7', dizimistaId: '2', ano: 2026, mes: 'ABR', valor: 125.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-07' },
  { id: 'l8', dizimistaId: '2', ano: 2026, mes: 'ABR', valor: 125.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-15' },
  { id: 'l9', dizimistaId: '2', ano: 2026, mes: 'MAI', valor: 200.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-01' },
  { id: 'l10', dizimistaId: '2', ano: 2026, mes: 'MAI', valor: 176.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-05' },
  { id: 'l11', dizimistaId: '2', ano: 2026, mes: 'MAI', valor: 200.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-18' },
  { id: 'l12', dizimistaId: '2', ano: 2026, mes: 'JUN', valor: 160.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-05' },
  { id: 'l13', dizimistaId: '2', ano: 2026, mes: 'JUN', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-17' },

  // Dc. Ednaldo Almeida
  { id: 'l14', dizimistaId: '3', ano: 2026, mes: 'JAN', valor: 148.41, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-08' },
  { id: 'l15', dizimistaId: '3', ano: 2026, mes: 'FEV', valor: 142.10, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-06' },
  { id: 'l16', dizimistaId: '3', ano: 2026, mes: 'ABR', valor: 116.78, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-07' },
  { id: 'l17', dizimistaId: '3', ano: 2026, mes: 'MAI', valor: 330.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-10' },
  { id: 'l18', dizimistaId: '3', ano: 2026, mes: 'JUN', valor: 268.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-08' },

  // Dc. Roberto Lima
  { id: 'l19', dizimistaId: '4', ano: 2026, mes: 'JAN', valor: 60.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-09' },

  // Dc. Roberto da Silva
  { id: 'l20', dizimistaId: '5', ano: 2026, mes: 'JAN', valor: 200.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-04' },

  // Ir. Carlos Leandro
  { id: 'l22', dizimistaId: '6', ano: 2026, mes: 'MAR', valor: 130.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-06' },
  { id: 'l23', dizimistaId: '6', ano: 2026, mes: 'ABR', valor: 140.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-07' },

  // Presb. Leandro Santos
  { id: 'l24', dizimistaId: '7', ano: 2026, mes: 'FEV', valor: 425.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-01' },
  { id: 'l25', dizimistaId: '7', ano: 2026, mes: 'FEV', valor: 425.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-11' },
  { id: 'l26', dizimistaId: '7', ano: 2026, mes: 'MAR', valor: 100.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-01' },
  { id: 'l27', dizimistaId: '7', ano: 2026, mes: 'MAI', valor: 400.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-29' },

  // Dc. Ruan dos Santos
  { id: 'l28', dizimistaId: '8', ano: 2026, mes: 'JAN', valor: 145.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-05' },
  { id: 'l29', dizimistaId: '8', ano: 2026, mes: 'FEV', valor: 145.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-05' },

  // Sthefani Figueiredo
  { id: 'l30', dizimistaId: '9', ano: 2026, mes: 'JAN', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-05' },
  { id: 'l31', dizimistaId: '9', ano: 2026, mes: 'FEV', valor: 250.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-11' },
  { id: 'l32', dizimistaId: '9', ano: 2026, mes: 'MAR', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-10' },
  { id: 'l33', dizimistaId: '9', ano: 2026, mes: 'ABR', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-04' },
  { id: 'l34', dizimistaId: '9', ano: 2026, mes: 'MAI', valor: 160.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-08' },
  { id: 'l35', dizimistaId: '9', ano: 2026, mes: 'JUN', valor: 160.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-06' },

  // Obr. Ana Paula Araújo
  { id: 'l36', dizimistaId: '10', ano: 2026, mes: 'JAN', valor: 300.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-06' },
  { id: 'l37', dizimistaId: '10', ano: 2026, mes: 'FEV', valor: 242.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-04' },
  { id: 'l38', dizimistaId: '10', ano: 2026, mes: 'MAR', valor: 250.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-09' },
  { id: 'l39', dizimistaId: '10', ano: 2026, mes: 'ABR', valor: 250.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-08' },
  { id: 'l40', dizimistaId: '10', ano: 2026, mes: 'MAI', valor: 200.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-06' },
  { id: 'l41', dizimistaId: '10', ano: 2026, mes: 'JUN', valor: 250.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-03' },

  // Dcsa. Flávia Lima
  { id: 'l42', dizimistaId: '11', ano: 2026, mes: 'JAN', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-07' },
  { id: 'l43', dizimistaId: '11', ano: 2026, mes: 'FEV', valor: 140.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-07' },

  // Dcsa. Taiane Santos
  { id: 'l44', dizimistaId: '12', ano: 2026, mes: 'JAN', valor: 120.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-08' },
  { id: 'l45', dizimistaId: '12', ano: 2026, mes: 'FEV', valor: 140.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-07' },
  { id: 'l46', dizimistaId: '12', ano: 2026, mes: 'MAR', valor: 130.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-06' },
  { id: 'l47', dizimistaId: '12', ano: 2026, mes: 'ABR', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-07' },
  { id: 'l48', dizimistaId: '12', ano: 2026, mes: 'MAI', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-07' },
  { id: 'l49', dizimistaId: '12', ano: 2026, mes: 'JUN', valor: 120.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-06' },

  // Obr. Laís Azeredo
  { id: 'l50', dizimistaId: '13', ano: 2026, mes: 'JAN', valor: 105.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-15' },
  { id: 'l51', dizimistaId: '13', ano: 2026, mes: 'JAN', valor: 105.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-30' },
  { id: 'l52', dizimistaId: '13', ano: 2026, mes: 'FEV', valor: 170.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-10' },
  { id: 'l53', dizimistaId: '13', ano: 2026, mes: 'MAR', valor: 170.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-06' },
  { id: 'l54', dizimistaId: '13', ano: 2026, mes: 'ABR', valor: 160.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-07' },
  { id: 'l55', dizimistaId: '13', ano: 2026, mes: 'ABR', valor: 160.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-17' },
  { id: 'l56', dizimistaId: '13', ano: 2026, mes: 'MAI', valor: 170.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-08' },
  { id: 'l57', dizimistaId: '13', ano: 2026, mes: 'JUN', valor: 170.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-08' },

  // Dcsa. Tatiane Simas
  { id: 'l58', dizimistaId: '14', ano: 2026, mes: 'JAN', valor: 65.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-20' },
  { id: 'l59', dizimistaId: '14', ano: 2026, mes: 'FEV', valor: 65.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-13' },
  { id: 'l60', dizimistaId: '14', ano: 2026, mes: 'MAR', valor: 65.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-19' },
  { id: 'l61', dizimistaId: '14', ano: 2026, mes: 'ABR', valor: 65.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-18' },
  { id: 'l62', dizimistaId: '14', ano: 2026, mes: 'MAI', valor: 65.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-20' },
  { id: 'l63', dizimistaId: '14', ano: 2026, mes: 'JUN', valor: 65.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-18' },

  // Dcsa. Luzinete Correa
  { id: 'l64', dizimistaId: '15', ano: 2026, mes: 'JAN', valor: 85.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-01-31' },
  { id: 'l65', dizimistaId: '15', ano: 2026, mes: 'FEV', valor: 115.15, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-28' },
  { id: 'l66', dizimistaId: '15', ano: 2026, mes: 'MAR', valor: 40.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-04' },
  { id: 'l67', dizimistaId: '15', ano: 2026, mes: 'ABR', valor: 112.33, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-02' },
  { id: 'l68', dizimistaId: '15', ano: 2026, mes: 'MAI', valor: 103.83, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-01' },
  { id: 'l69', dizimistaId: '15', ano: 2026, mes: 'MAI', valor: 103.83, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-18' },
  { id: 'l70', dizimistaId: '15', ano: 2026, mes: 'MAI', valor: 103.83, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-30' },

  // Dcsa. Alexia da Silva
  { id: 'l71', dizimistaId: '16', ano: 2026, mes: 'JAN', valor: 248.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-02' },
  { id: 'l72', dizimistaId: '16', ano: 2026, mes: 'ABR', valor: 100.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-30' },

  // Isabelly Felix
  { id: 'l73', dizimistaId: '17', ano: 2026, mes: 'FEV', valor: 171.84, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-03' },
  { id: 'l74', dizimistaId: '17', ano: 2026, mes: 'MAR', valor: 185.93, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-01' },
  { id: 'l75', dizimistaId: '17', ano: 2026, mes: 'ABR', valor: 199.99, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-06' },
  { id: 'l76', dizimistaId: '17', ano: 2026, mes: 'MAI', valor: 208.14, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-01' },
  { id: 'l77', dizimistaId: '17', ano: 2026, mes: 'MAI', valor: 208.14, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-30' },

  // Joice dos Santos
  { id: 'l78', dizimistaId: '18', ano: 2026, mes: 'FEV', valor: 100.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-02-08' },
  { id: 'l79', dizimistaId: '18', ano: 2026, mes: 'MAR', valor: 120.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-03-31' },
  { id: 'l80', dizimistaId: '18', ano: 2026, mes: 'ABR', valor: 120.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-01' },
  { id: 'l81', dizimistaId: '18', ano: 2026, mes: 'MAI', valor: 120.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-03' },

  // Rosane Oliveira
  { id: 'l82', dizimistaId: '19', ano: 2026, mes: 'ABR', valor: 130.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-04-05' },
  { id: 'l83', dizimistaId: '19', ano: 2026, mes: 'MAI', valor: 130.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-05-08' },
  { id: 'l84', dizimistaId: '19', ano: 2026, mes: 'JUN', valor: 130.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-01' },

  // Miriam Menezes
  { id: 'l85', dizimistaId: '20', ano: 2026, mes: 'JUN', valor: 434.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-06' },

  // Syndel Queiroz
  { id: 'l86', dizimistaId: '21', ano: 2026, mes: 'JUN', valor: 150.00, tesoureiro: 'Dcsa. Suzana', dataEntrega: '2026-06-29' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dizimistas, setDizimistas] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [tesoureiros, setTesoureiros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme state
  const [theme, setTheme] = useState('light');

  // Selected Dizimista for card generation
  const [selectedCardDizimistaId, setSelectedCardDizimistaId] = useState('');

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        // 1. Fetch dizimistas
        const dizimistasSnapshot = await getDocs(collection(db, "dizimistas"));
        let dbDizimistas = dizimistasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 2. Fetch lancamentos
        const lancamentosSnapshot = await getDocs(collection(db, "lancamentos"));
        let dbLancamentos = lancamentosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 3. Fetch tesoureiros
        const tesoureirosSnapshot = await getDocs(collection(db, "tesoureiros"));
        let dbTesoureiros = tesoureirosSnapshot.docs.map(doc => doc.data().nome);

        // 4. Seeding Check: If the collections are completely empty, execute automatic seeding
        if (dbDizimistas.length === 0 && dbLancamentos.length === 0) {
          console.log("Banco de dados Firestore vazio. Iniciando carga inicial (seeding)...");
          
          const batch = writeBatch(db);
          
          INITIAL_DIZIMISTAS.forEach(d => {
            const dRef = doc(db, "dizimistas", d.id);
            batch.set(dRef, {
              nome: d.nome,
              cargo: d.cargo,
              status: d.status,
              telefone: d.telefone || ''
            });
          });
          
          INITIAL_LANCAMENTOS.forEach(l => {
            const lRef = doc(db, "lancamentos", l.id);
            batch.set(lRef, {
              dizimistaId: l.dizimistaId,
              ano: l.ano,
              mes: l.mes,
              valor: l.valor,
              tesoureiro: l.tesoureiro,
              dataEntrega: l.dataEntrega
            });
          });
          
          const defaultTes = ['Dcsa. Suzana'];
          defaultTes.forEach(t => {
            const tRef = doc(db, "tesoureiros", t);
            batch.set(tRef, { nome: t });
          });
          
          await batch.commit();
          console.log("Carga inicial concluída no Firebase Firestore!");
          
          dbDizimistas = INITIAL_DIZIMISTAS;
          dbLancamentos = INITIAL_LANCAMENTOS;
          dbTesoureiros = defaultTes;
        }

        // Set React state
        setDizimistas(dbDizimistas);
        setLancamentos(dbLancamentos);
        setTesoureiros(dbTesoureiros.length > 0 ? dbTesoureiros : ['Dcsa. Suzana']);
      } catch (error) {
        console.error("Erro ao carregar dados do Firebase:", error);
        
        // Fallback to localStorage/Mock in case of connection failure
        const savedDizimistas = localStorage.getItem('adfare_dizimistas');
        const savedLancamentos = localStorage.getItem('adfare_lancamentos');
        const savedTesoureiros = localStorage.getItem('adfare_tesoureiros');
        
        setDizimistas(savedDizimistas ? JSON.parse(savedDizimistas) : INITIAL_DIZIMISTAS);
        setLancamentos(savedLancamentos ? JSON.parse(savedLancamentos) : INITIAL_LANCAMENTOS);
        setTesoureiros(savedTesoureiros ? JSON.parse(savedTesoureiros) : ['Dcsa. Suzana']);
      } finally {
        setIsLoading(false);
      }
    };

    loadFirebaseData();

    // Load theme (keeps theme local to device, which is standard)
    const savedTheme = localStorage.getItem('adfare_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleAddTesoureiro = async (nome) => {
    const clean = nome.trim();
    if (!clean || tesoureiros.includes(clean)) return;
    setTesoureiros(prev => [...prev, clean]);
    
    try {
      await setDoc(doc(db, "tesoureiros", clean), { nome: clean });
    } catch (err) {
      console.error("Erro ao adicionar tesoureiro no Firebase:", err);
    }
  };

  const handleRemoveTesoureiro = async (nome) => {
    setTesoureiros(prev => prev.filter(t => t !== nome));
    
    try {
      await deleteDoc(doc(db, "tesoureiros", nome));
    } catch (err) {
      console.error("Erro ao remover tesoureiro do Firebase:", err);
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('adfare_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Dizimistas CRUD
  const handleAddDizimista = async (data) => {
    const newId = Date.now().toString();
    const newDizimista = {
      ...data,
      id: newId
    };
    setDizimistas(prev => [...prev, newDizimista]);
    
    try {
      await setDoc(doc(db, "dizimistas", newId), {
        nome: data.nome,
        cargo: data.cargo,
        status: data.status,
        telefone: data.telefone || ''
      });
    } catch (err) {
      console.error("Erro ao salvar dizimista no Firebase:", err);
    }
  };

  const handleUpdateDizimista = async (id, data) => {
    setDizimistas(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
    
    try {
      await updateDoc(doc(db, "dizimistas", id), {
        nome: data.nome,
        cargo: data.cargo,
        status: data.status,
        telefone: data.telefone || ''
      });
    } catch (err) {
      console.error("Erro ao atualizar dizimista no Firebase:", err);
    }
  };

  const handleDeleteDizimista = async (id) => {
    // Delete tither
    setDizimistas(prev => prev.filter(d => d.id !== id));
    // Delete all corresponding contributions
    const relatedLancamentos = lancamentos.filter(l => l.dizimistaId === id);
    setLancamentos(prev => prev.filter(l => l.dizimistaId !== id));

    if (selectedCardDizimistaId === id) {
      setSelectedCardDizimistaId('');
    }
    
    try {
      await deleteDoc(doc(db, "dizimistas", id));
      
      const batch = writeBatch(db);
      relatedLancamentos.forEach(l => {
        batch.delete(doc(db, "lancamentos", l.id));
      });
      await batch.commit();
    } catch (err) {
      console.error("Erro ao deletar dizimista no Firebase:", err);
    }
  };

  // Lancamentos CRUD
  const handleSaveLancamento = async (data) => {
    if (data.id) {
      // Update existing item
      setLancamentos(prev => prev.map(l => l.id === data.id ? { ...l, ...data } : l));
      
      try {
        await updateDoc(doc(db, "lancamentos", data.id), {
          dizimistaId: data.dizimistaId,
          ano: data.ano,
          mes: data.mes,
          valor: data.valor,
          tesoureiro: data.tesoureiro,
          dataEntrega: data.dataEntrega
        });
      } catch (err) {
        console.error("Erro ao atualizar lançamento no Firebase:", err);
      }
    } else {
      // Add new item
      const newId = Date.now().toString();
      const newEntry = {
        ...data,
        id: newId
      };
      setLancamentos(prev => [...prev, newEntry]);
      
      try {
        await setDoc(doc(db, "lancamentos", newId), {
          dizimistaId: data.dizimistaId,
          ano: data.ano,
          mes: data.mes,
          valor: data.valor,
          tesoureiro: data.tesoureiro,
          dataEntrega: data.dataEntrega
        });
      } catch (err) {
        console.error("Erro ao salvar lançamento no Firebase:", err);
      }
    }
  };

  const handleDeleteLancamentoById = async (id) => {
    setLancamentos(prev => prev.filter(l => l.id !== id));
    
    try {
      await deleteDoc(doc(db, "lancamentos", id));
    } catch (err) {
      console.error("Erro ao deletar lançamento no Firebase:", err);
    }
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

  const importData = async (importedState) => {
    if (window.confirm("Isso irá substituir os dados atuais no Firebase pelos dados do arquivo. Deseja prosseguir?")) {
      setIsLoading(true);
      try {
        const batch = writeBatch(db);
        
        // 1. Delete all current dizimistas and lancamentos from database
        const oldDizimistas = await getDocs(collection(db, "dizimistas"));
        oldDizimistas.forEach(docSnap => batch.delete(docSnap.ref));
        
        const oldLancamentos = await getDocs(collection(db, "lancamentos"));
        oldLancamentos.forEach(docSnap => batch.delete(docSnap.ref));
        
        // 2. Upload new imported state
        importedState.dizimistas.forEach(d => {
          const dRef = doc(db, "dizimistas", d.id);
          batch.set(dRef, d);
        });
        
        importedState.lancamentos.forEach(l => {
          const lRef = doc(db, "lancamentos", l.id);
          batch.set(lRef, l);
        });
        
        await batch.commit();
        
        // 3. Update local state
        setDizimistas(importedState.dizimistas);
        setLancamentos(importedState.lancamentos);
        alert("Backup restaurado com sucesso no Firebase!");
      } catch (err) {
        console.error("Erro ao importar backup:", err);
        alert("Erro ao importar backup no Firebase.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Dynamic Content */}
      <main className="app-content">
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
            <p style={{ fontSize: '15px', fontWeight: '500' }}>Carregando dados da igreja...</p>
          </div>
        ) : (
          <>
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
                theme={theme}
                toggleTheme={toggleTheme}
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
          </>
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
