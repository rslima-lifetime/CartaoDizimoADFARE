import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, DollarSign, UserCheck, Plus, Edit } from 'lucide-react';

export default function ModalLancamento({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  dizimistas, 
  initialData = null,
  lancamentos = [],
  tesoureiros = []
}) {
  const [dizimistaId, setDizimistaId] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState('JAN');

  // Input fields for adding a new payment
  const [dataEntrega, setDataEntrega] = useState('');
  const [valorText, setValorText] = useState('');
  const [tesoureiro, setTesoureiro] = useState('');
  const [tesoureiroCustom, setTesoureiroCustom] = useState(false);

  // Edit mode tracking state
  const [editingId, setEditingId] = useState(null);

  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ', '13º'];

  // Helper: local YYYY-MM-DD
  const getLocalDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert number to R$ string format
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Handle currency input formatting
  const handleCurrencyInput = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (!value) {
      setValorText('');
      return;
    }
    const floatValue = parseFloat(value) / 100;
    setValorText(
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(floatValue)
    );
  };

  // Set default values when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      // 1. Preload tither and competence
      if (initialData) {
        setDizimistaId(initialData.dizimistaId || '');
        setAno(initialData.ano || new Date().getFullYear());
        setMes(initialData.mes || 'JAN');

        // Check if we are editing a specific transaction passed from outside
        if (initialData.editLaunchId) {
          const tx = lancamentos.find(l => l.id === initialData.editLaunchId);
          if (tx) {
            setEditingId(tx.id);
            setDataEntrega(tx.dataEntrega || getLocalDateString());
            setValorText(formatCurrency(tx.valor));
            setTesoureiro(tx.tesoureiro);
            return;
          }
        }
      } else {
        setDizimistaId('');
        setAno(new Date().getFullYear());
        setMes(meses[new Date().getMonth()]);
      }

      // 2. Clear inputs for new entry
      setEditingId(null);
      setDataEntrega(getLocalDateString());
      setValorText('');

      // Auto-fill treasurer with first in list or last used
      const lastTx = [...lancamentos].sort((a, b) => b.id - a.id)[0];
      const defaultTes = lastTx?.tesoureiro || (tesoureiros.length > 0 ? tesoureiros[0] : '');
      if (tesoureiros.includes(defaultTes)) {
        setTesoureiro(defaultTes);
        setTesoureiroCustom(false);
      } else if (defaultTes) {
        setTesoureiro(defaultTes);
        setTesoureiroCustom(true);
      } else {
        setTesoureiro('');
        setTesoureiroCustom(false);
      }
    }
  }, [isOpen, initialData, lancamentos]);

  // Find tither's contributions for this specific month/year
  const monthPayments = lancamentos.filter(
    l => l.dizimistaId === dizimistaId && l.ano === parseInt(ano) && l.mes === mes
  );

  // Sum of contributions for this month
  const totalMonth = monthPayments.reduce((sum, p) => sum + p.valor, 0);

  const formatCargoAbbrev = (cargo) => {
    if (!cargo) return '';
    const c = cargo.trim().toLowerCase();
    if (c === 'membro' || c === 'nenhum' || c === '') return '';
    if (c.startsWith('ev') || c === 'evangelista') return 'Ev.';
    if (c.startsWith('pb') || c.startsWith('presb') || c === 'presbítero') return 'Pb.';
    if (c.startsWith('pr') || c === 'pastor') return 'Pr.';
    if (c.startsWith('dcsa') || c.startsWith('diaconis')) return 'Dcsa.';
    if (c.startsWith('dc') || c.startsWith('diac') || c === 'diácono') return 'Dc.';
    if (c.startsWith('miss') || c === 'missionário' || c === 'missionária') return 'Miss.';
    if (c.startsWith('ob') || c === 'obreiro' || c === 'obreira') return 'Ob.';
    return cargo;
  };

  const getDizimistaName = () => {
    const d = dizimistas.find(x => x.id === dizimistaId);
    if (!d) return '';
    const abbrev = formatCargoAbbrev(d.cargo);
    return abbrev ? `${abbrev} ${d.nome}` : d.nome;
  };

  // Date formatting for list
  const formatDateFriendly = (dateStr) => {
    if (!dateStr) return '';
    // If it is standard YYYY-MM-DD
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    }
    // Return original string if it is in old layout format like "04/01"
    return dateStr;
  };

  const handleStartEdit = (p) => {
    setEditingId(p.id);
    setDataEntrega(p.dataEntrega || getLocalDateString());
    setValorText(formatCurrency(p.valor));
    setTesoureiro(p.tesoureiro);
  };

  // Add/Edit delivery submit handler
  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!dizimistaId) {
      alert('Por favor, selecione um dizimista.');
      return;
    }
    if (!dataEntrega || !valorText || !tesoureiro.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Convert formatted currency to float
    const numericValue = parseFloat(
      valorText
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    );

    if (isNaN(numericValue) || numericValue <= 0) {
      alert('Valor inválido.');
      return;
    }

    const payload = {
      id: editingId || undefined,
      dizimistaId,
      ano: parseInt(ano),
      mes,
      valor: numericValue,
      tesoureiro: tesoureiro.trim(),
      dataEntrega
    };

    onSave(payload);

    // Reset payment values so another payment can be launched
    setEditingId(null);
    setValorText('');
    setDataEntrega(getLocalDateString());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Competência: {mes} / {ano}
            </span>
            <h3 className="modal-title" style={{ marginTop: '2px', fontSize: '18px' }}>
              {dizimistaId ? getDizimistaName() : 'Novo Lançamento'}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 1. Tither Selector (if not pre-selected) */}
        {!initialData?.dizimistaId && (
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Dizimista</label>
            <select 
              className="form-control" 
              value={dizimistaId} 
              onChange={(e) => setDizimistaId(e.target.value)}
              required
            >
              <option value="">Selecione um dizimista...</option>
              {dizimistas.map(d => {
                const abbrev = formatCargoAbbrev(d.cargo);
                return (
                  <option key={d.id} value={d.id}>
                    {abbrev ? `${abbrev} ` : ''}{d.nome}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* 2. List of existing payments for this month */}
        {dizimistaId && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-title)', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'left' }}>
              Entregas no Mês
            </h4>
            
            {monthPayments.length === 0 ? (
              <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
                Nenhum dízimo registrado nesta competência.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {monthPayments.map((p) => (
                  <div 
                    key={p.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '10px 12px', 
                      backgroundColor: 'var(--bg-app)', 
                      border: '1px solid var(--border)', 
                      borderRadius: 'var(--radius-sm)' 
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-title)' }}>
                        {formatCurrency(p.valor)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Data: {formatDateFriendly(p.dataEntrega || p.dataLançamento)} • Tesoureiro: {p.tesoureiro}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        type="button" 
                        onClick={() => handleStartEdit(p)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => onDelete(p.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '4px' }}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Total Box */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 'bold' }}>
                  <span>Total Acumulado:</span>
                  <span>{formatCurrency(totalMonth)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        {dizimistaId && <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '20px 0' }}></div>}

        {/* 3. Add/Edit contribution Form */}
        {dizimistaId && (
          <form onSubmit={handleAddPayment} style={{ textAlign: 'left' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-title)', textTransform: 'uppercase', marginBottom: '12px' }}>
              {editingId ? 'Editar Lançamento' : 'Registrar Nova Entrega'}
            </h4>

            {/* Date Input */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px' }}>Data da Entrega</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  className="form-control"
                  style={{ paddingLeft: '12px' }}
                  value={dataEntrega}
                  onChange={(e) => setDataEntrega(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
              {/* Valor Input */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Valor do Dízimo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="R$ 0,00"
                  value={valorText}
                  onChange={handleCurrencyInput}
                  required
                />
              </div>

              {/* Treasurer Dropdown */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Tesoureiro(a)</label>
                {!tesoureiroCustom ? (
                  <select
                    className="form-control"
                    value={tesoureiro}
                    onChange={(e) => {
                      if (e.target.value === '__outro__') {
                        setTesoureiroCustom(true);
                        setTesoureiro('');
                      } else {
                        setTesoureiro(e.target.value);
                      }
                    }}
                    required
                  >
                    <option value="">Selecione...</option>
                    {tesoureiros.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="__outro__">➕ Outro (digitar)</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nome do tesoureiro..."
                      value={tesoureiro}
                      onChange={(e) => setTesoureiro(e.target.value)}
                      required
                      autoFocus
                    />
                    {tesoureiros.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { setTesoureiroCustom(false); setTesoureiro(tesoureiros[0]); }}
                        style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}
                        title="Voltar à lista"
                      >
                        ← Lista
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingId ? 'Salvar Alterações' : 'Adicionar Lançamento'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ width: 'auto', padding: '0 12px' }}
                  onClick={() => {
                    setEditingId(null);
                    setValorText('');
                    setDataEntrega(getLocalDateString());
                  }}
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        )}

        {/* Close Button */}
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
          style={{ marginTop: '16px' }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
