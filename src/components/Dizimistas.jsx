import React, { useState } from 'react';
import { Search, UserPlus, Phone, Calendar, ArrowRight, Eye, Trash2, Edit2, X } from 'lucide-react';

export default function Dizimistas({ 
  dizimistas, 
  lancamentos, 
  onAddDizimista, 
  onUpdateDizimista, 
  onDeleteDizimista, 
  onViewCard 
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Ativo'); // Default view active
  const [selectedDizimistaId, setSelectedDizimistaId] = useState(null);
  
  // Form State (for Add / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [status, setStatus] = useState('Ativo');

  const cargos = ['Membro', 'Cooperador', 'Diácono', 'Dcsa. (Diaconisa)', 'Presbítero', 'Evangelista', 'Pastor', 'Missionária'];

  // Handle open Form
  const openForm = (dizimista = null) => {
    if (dizimista) {
      setEditingId(dizimista.id);
      setNome(dizimista.nome);
      setCargo(dizimista.cargo || '');
      setTelefone(dizimista.telefone || '');
      setStatus(dizimista.status);
    } else {
      setEditingId(null);
      setNome('');
      setCargo('Membro');
      setTelefone('');
      setStatus('Ativo');
    }
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert('O nome do dizimista é obrigatório.');
      return;
    }

    const data = {
      nome: nome.trim(),
      cargo,
      telefone: telefone.replace(/\D/g, ''), // Save only digits
      status
    };

    if (editingId) {
      onUpdateDizimista(editingId, data);
    } else {
      onAddDizimista(data);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id, nome) => {
    if (confirm(`Tem certeza de que deseja excluir o(a) dizimista "${nome}"? Isso também removerá todo o histórico de lançamentos dele(a).`)) {
      onDeleteDizimista(id);
      setSelectedDizimistaId(null);
    }
  };

  // Filter list
  const filteredDizimistas = dizimistas.filter(d => {
    const matchesSearch = d.nome.toLowerCase().includes(search.toLowerCase()) || 
                          (d.telefone && d.telefone.includes(search));
    const matchesStatus = statusFilter === 'Todos' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedDizimista = dizimistas.find(d => d.id === selectedDizimistaId);
  const selectedHistory = selectedDizimistaId 
    ? lancamentos
        .filter(l => l.dizimistaId === selectedDizimistaId)
        .sort((a, b) => b.ano - a.ano || new Date(b.dataLançamento) - new Date(a.dataLançamento))
    : [];

  return (
    <div>
      {/* Search & Header */}
      {!selectedDizimistaId && (
        <>
          <div className="page-header">
            <h2 className="page-title">Dizimistas</h2>
            <button className="btn-icon-only" onClick={() => openForm()} style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <UserPlus size={20} />
            </button>
          </div>

          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar por nome ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Quick status filter tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['Ativo', 'Inativo', 'Todos'].map(f => (
              <button 
                key={f}
                className="btn" 
                style={{ 
                  flex: 1, 
                  padding: '8px 12px', 
                  fontSize: '13px',
                  backgroundColor: statusFilter === f ? 'var(--primary)' : 'var(--bg-card)',
                  color: statusFilter === f ? 'white' : 'var(--text-main)',
                  border: `1px solid ${statusFilter === f ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)'
                }}
                onClick={() => setStatusFilter(f)}
              >
                {f}s
              </button>
            ))}
          </div>

          {/* List of Tithers */}
          {filteredDizimistas.length === 0 ? (
            <div className="empty-state">
              <Search size={40} />
              <div className="empty-state-title">Nenhum dizimista encontrado</div>
              <p style={{ fontSize: '13px' }}>Tente alterar a busca ou cadastre um novo dizimista.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredDizimistas.map(d => (
                <div 
                  key={d.id} 
                  className="card" 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', margin: 0, padding: '14px' }}
                  onClick={() => setSelectedDizimistaId(d.id)}
                >
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-title)' }}>
                      {d.cargo ? `${d.cargo} ` : ''}{d.nome}
                    </h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <span className={`badge ${d.status === 'Ativo' ? 'badge-success' : 'badge-danger'}`}>
                        {d.status}
                      </span>
                      {d.telefone && (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          📞 {d.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={18} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Dizimista Detail Sheet */}
      {selectedDizimistaId && selectedDizimista && (
        <div>
          {/* Header row with back button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => setSelectedDizimistaId(null)}>
              ← Voltar
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-icon-only" onClick={() => openForm(selectedDizimista)}>
                <Edit2 size={16} />
              </button>
              <button className="btn-icon-only" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(selectedDizimista.id, selectedDizimista.nome)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Profile Card */}
          <div className="card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)', textTransform: 'uppercase' }}>
                {selectedDizimista.cargo || 'Membro'}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-title)', marginTop: '2px' }}>
                {selectedDizimista.nome}
              </h2>
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'var(--border)' }}></div>

            {selectedDizimista.telefone && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Telefone</span>
                <a 
                  href={`tel:${selectedDizimista.telefone}`}
                  style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Phone size={14} /> {selectedDizimista.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                </a>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status do Cadastro</span>
              <span className={`badge ${selectedDizimista.status === 'Ativo' ? 'badge-success' : 'badge-danger'}`}>
                {selectedDizimista.status}
              </span>
            </div>
          </div>

          {/* Action to see card */}
          <button 
            className="btn btn-primary" 
            style={{ marginBottom: '24px' }}
            onClick={() => onViewCard(selectedDizimista.id)}
          >
            <Eye size={18} /> Ver Cartão de Dízimo
          </button>

          {/* Contribution History of this Tither */}
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-title)', marginBottom: '12px', textAlign: 'left' }}>
            Histórico de Contribuições
          </h3>

          {selectedHistory.length === 0 ? (
            <div className="card" style={{ padding: '30px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
              Nenhuma contribuição registrada para este dizimista.
            </div>
          ) : (
            <div className="history-list">
              {selectedHistory.map((tx, idx) => (
                <div className="history-item" key={idx}>
                  <div className="history-item-left">
                    <div className="history-item-month">{tx.mes} / {tx.ano}</div>
                    <div className="history-item-sub">Tesoureiro: {tx.tesoureiro}</div>
                  </div>
                  <div className="history-item-right">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.valor)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sheet Modal for Add/Edit Dizimista */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingId ? 'Editar Dizimista' : 'Novo Dizimista'}
              </h3>
              <button className="modal-close" onClick={() => setIsFormOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              {/* Nome */}
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Carlos Santos"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {/* Cargo/Título */}
              <div className="form-group">
                <label className="form-label">Cargo / Título</label>
                <select 
                  className="form-control" 
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                >
                  {cargos.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Telefone */}
              <div className="form-group">
                <label className="form-label">Telefone (DDD + Celular)</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="Ex: 11987654321"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-control" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
