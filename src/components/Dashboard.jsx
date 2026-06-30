import React, { useRef, useState } from 'react';
import { DollarSign, Users, Calendar, Plus, Download, Upload, ShieldAlert, UserCog, Trash2, Moon, Sun } from 'lucide-react';
import LogoADFARE from './LogoADFARE';

export default function Dashboard({ 
  dizimistas, 
  lancamentos, 
  onOpenModal, 
  exportData, 
  importData,
  tesoureiros = [],
  onAddTesoureiro,
  onRemoveTesoureiro,
  theme,
  toggleTheme
}) {
  const fileInputRef = useRef(null);
  const [novoTesoureiro, setNovoTesoureiro] = useState('');

  // Compute metrics
  const activeDizimistasCount = dizimistas.filter(d => d.status === 'Ativo').length;
  
  const currentMonthNum = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const mesesAbrev = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ', '13º'];
  const currentMonthAbrev = mesesAbrev[currentMonthNum];

  // Total collected this month
  const totalMonth = lancamentos
    .filter(l => l.ano === currentYear && l.mes === currentMonthAbrev)
    .reduce((sum, l) => sum + l.valor, 0);

  // Total collected this year
  const totalYear = lancamentos
    .filter(l => l.ano === currentYear)
    .reduce((sum, l) => sum + l.valor, 0);

  // Recent 5 contributions
  const recentTransactions = [...lancamentos]
    .sort((a, b) => {
      const dateA = a.dataEntrega || a.dataLançamento || '';
      const dateB = b.dataEntrega || b.dataLançamento || '';
      return dateB.localeCompare(dateA);
    })
    .slice(0, 5);

  const getDizimistaName = (id) => {
    const d = dizimistas.find(x => x.id === id);
    if (!d) return 'Dizimista Removido';
    return d.cargo ? `${d.cargo} ${d.nome}` : d.nome;
  };

  const handleImportChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.dizimistas && parsed.lancamentos) {
          importData(parsed);
          alert('Dados importados com sucesso!');
        } else {
          alert('Arquivo inválido. Certifique-se de que é um backup do app ADFARE.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo de backup. Formato JSON inválido.');
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = null;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px' }}>
            <LogoADFARE />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-title)', lineHeight: '1.2' }}>
              AD Família Restaurada
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Painel Administrativo de Dízimos
            </span>
          </div>
        </div>
        <button 
          onClick={toggleTheme} 
          style={{ 
            background: 'none', 
            cursor: 'pointer', 
            color: 'var(--text-main)',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Metrics Widgets */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Este Mês ({currentMonthAbrev})</span>
            <DollarSign size={18} color="var(--success)" />
          </div>
          <div className="stat-value">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMonth)}
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Ano ({currentYear})</span>
            <DollarSign size={18} color="var(--primary)" />
          </div>
          <div className="stat-value">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalYear)}
          </div>
        </div>

        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Dizimistas Ativos Cadastrados</span>
            <Users size={18} color="var(--secondary)" />
          </div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {activeDizimistasCount}
            <span style={{ fontSize: '13px', fontWeight: 'normal', color: 'var(--text-muted)' }}>
              de {dizimistas.length} no total
            </span>
          </div>
        </div>
      </div>

      {/* Quick Launch Button */}
      <button 
        className="btn btn-primary" 
        onClick={() => onOpenModal()}
        style={{ marginBottom: '24px', height: '52px' }}
      >
        <Plus size={20} /> Lancar Novo Dízimo
      </button>

      {/* Recent Activity List */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '16px', textAlign: 'left' }}>
          Lançamentos Recentes
        </h3>
        
        {recentTransactions.length === 0 ? (
          <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>
            Nenhum lançamento registrado ainda.
          </div>
        ) : (
          <div className="history-list">
            {recentTransactions.map((tx, idx) => (
              <div className="history-item" key={idx}>
                <div className="history-item-left">
                  <div className="history-item-month">{getDizimistaName(tx.dizimistaId)}</div>
                  <div className="history-item-sub">
                    {tx.mes}/{tx.ano} • Por: {tx.tesoureiro}
                  </div>
                </div>
                <div className="history-item-right">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.valor)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tesoureiros */}
      <div className="card" style={{ textAlign: 'left' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCog size={18} color="var(--primary)" /> Tesoureiros
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Os nomes cadastrados aqui aparecem como opção ao registrar um dízimo.
        </p>

        {/* Lista */}
        {tesoureiros.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>Nenhum tesoureiro cadastrado.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {tesoureiros.map((t) => (
              <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-title)' }}>{t}</span>
                <button
                  type="button"
                  onClick={() => onRemoveTesoureiro(t)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '4px', display: 'flex', alignItems: 'center' }}
                  title="Remover tesoureiro"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Adicionar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ex: Dcsa. Suzana Lima"
            value={novoTesoureiro}
            onChange={(e) => setNovoTesoureiro(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddTesoureiro(novoTesoureiro);
                setNovoTesoureiro('');
              }
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap', padding: '0 16px', height: '44px', fontSize: '13px' }}
            onClick={() => {
              onAddTesoureiro(novoTesoureiro);
              setNovoTesoureiro('');
            }}
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </div>

      {/* System Settings & Backup */}
      <div className="card" style={{ textAlign: 'left' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '12px' }}>
          Backup de Dados
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Como os dados são salvos localmente neste aparelho, exporte backups regularmente para evitar perdas ou transferir os dados para outro celular.
        </p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ flex: 1, fontSize: '13px', padding: '10px' }} onClick={exportData}>
            <Download size={16} /> Exportar Backup
          </button>
          
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1, fontSize: '13px', padding: '10px' }} 
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={16} /> Importar Backup
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".json"
            onChange={handleImportChange}
          />
        </div>
      </div>
    </div>
  );
}
