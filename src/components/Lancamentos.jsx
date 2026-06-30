import React, { useState } from 'react';
import { Search, Calendar, Filter, Plus, Trash2, Edit2 } from 'lucide-react';

export default function Lancamentos({ 
  lancamentos, 
  dizimistas, 
  onOpenModal, 
  onDeleteLancamento, 
  onEditLancamento 
}) {
  const [selectedDizimistaId, setSelectedDizimistaId] = useState('Todos');
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [searchTreasurer, setSearchTreasurer] = useState('');

  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ', '13º'];
  const anosDisponiveis = Array.from(
    new Set(lancamentos.map(l => l.ano).concat([new Date().getFullYear()]))
  ).sort((a, b) => b - a);

  // Get tither's cargo and name
  const getDizimistaName = (id) => {
    const d = dizimistas.find(x => x.id === id);
    if (!d) return 'Dizimista Removido';
    return d.cargo ? `${d.cargo} ${d.nome}` : d.nome;
  };

  const formatDateFriendly = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    }
    return dateStr;
  };

  const handleEdit = (tx) => {
    onEditLancamento(tx);
  };

  const handleDelete = (tx) => {
    const name = getDizimistaName(tx.dizimistaId);
    if (confirm(`Excluir a entrega no valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.valor)} para "${name}"?`)) {
      onDeleteLancamento(tx.id);
    }
  };

  // Filter list
  const filteredLancamentos = lancamentos.filter(l => {
    const matchDizimista = selectedDizimistaId === 'Todos' || l.dizimistaId === selectedDizimistaId;
    const matchMonth = selectedMonth === 'Todos' || l.mes === selectedMonth;
    const matchYear = selectedYear === 'Todos' || l.ano.toString() === selectedYear;
    const matchTreasurer = !searchTreasurer.trim() || 
                           l.tesoureiro.toLowerCase().includes(searchTreasurer.toLowerCase());
    return matchDizimista && matchMonth && matchYear && matchTreasurer;
  }).sort((a, b) => new Date(b.dataLançamento) - new Date(a.dataLançamento));

  // Compute total of filtered contributions
  const filteredTotal = filteredLancamentos.reduce((sum, l) => sum + l.valor, 0);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Registros</h2>
        <button className="btn-icon-only" onClick={() => onOpenModal()} style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
          <Plus size={20} />
        </button>
      </div>

      {/* Filters Accordion / Grid */}
      <div className="card" style={{ padding: '14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-title)' }}>
          <Filter size={16} /> FILTRAR REGISTROS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* Dizimista Selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Dizimista</label>
            <select 
              className="form-control" 
              style={{ padding: '8px', fontSize: '13px' }}
              value={selectedDizimistaId}
              onChange={(e) => setSelectedDizimistaId(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {dizimistas.map(d => (
                <option key={d.id} value={d.id}>
                  {d.cargo ? `${d.cargo} ` : ''}{d.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Ano Selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Ano</label>
            <select 
              className="form-control" 
              style={{ padding: '8px', fontSize: '13px' }}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {anosDisponiveis.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Mes Selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Mês</label>
            <select 
              className="form-control" 
              style={{ padding: '8px', fontSize: '13px' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {meses.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Tesoureiro Search */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Tesoureiro</label>
            <input 
              type="text" 
              className="form-control" 
              style={{ padding: '8px', fontSize: '13px' }}
              placeholder="Nome..."
              value={searchTreasurer}
              onChange={(e) => setSearchTreasurer(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filtered Total Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
        <span>Total Filtrado ({filteredLancamentos.length}):</span>
        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(filteredTotal)}</span>
      </div>

      {/* Contribution History List */}
      {filteredLancamentos.length === 0 ? (
        <div className="empty-state">
          <Calendar size={40} />
          <div className="empty-state-title">Nenhum registro encontrado</div>
          <p style={{ fontSize: '13px' }}>Ajuste os filtros para encontrar o que procura.</p>
        </div>
      ) : (
        <div className="history-list" style={{ gap: '8px' }}>
          {filteredLancamentos.map((tx, idx) => (
            <div 
              className="history-item" 
              key={idx}
              style={{ padding: '10px 12px' }}
            >
              <div className="history-item-left" style={{ flex: 1, marginRight: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="history-item-month" style={{ fontSize: '14px' }}>
                    {getDizimistaName(tx.dizimistaId)}
                  </span>
                </div>
                <div className="history-item-sub" style={{ fontSize: '12px', marginTop: '2px' }}>
                  Competência: <strong>{tx.mes}/{tx.ano}</strong> • Data: {formatDateFriendly(tx.dataEntrega || tx.dataLançamento)} • Tesoureiro: {tx.tesoureiro}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="history-item-right" style={{ fontSize: '14px' }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.valor)}
                </span>
                
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={() => handleEdit(tx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(tx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '4px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
