import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ModalLancamento({ 
  isOpen, 
  onClose, 
  onSave, 
  dizimistas, 
  initialData = null, // e.g. { dizimistaId: '', ano: 2026, mes: 'JAN' }
  lancamentos = []
}) {
  const [dizimistaId, setDizimistaId] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState('JAN');
  const [valorText, setValorText] = useState('');
  const [tesoureiro, setTesoureiro] = useState('');

  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ', '13º'];

  // Load defaults when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      // 1. Detect if editing or creating with prefilled data
      if (initialData) {
        setDizimistaId(initialData.dizimistaId || '');
        setAno(initialData.ano || new Date().getFullYear());
        setMes(initialData.mes || 'JAN');
        
        // Find if contribution already exists for this tither/year/month
        const existing = lancamentos.find(
          l => l.dizimistaId === initialData.dizimistaId && 
               l.ano === parseInt(initialData.ano) && 
               l.mes === initialData.mes
        );

        if (existing) {
          setValorText(formatCurrency(existing.valor));
          setTesoureiro(existing.tesoureiro || '');
        } else {
          // If creating, check tither's last contribution amount
          const titherLast = lancamentos
            .filter(l => l.dizimistaId === initialData.dizimistaId)
            .sort((a, b) => new Date(b.dataLançamento) - new Date(a.dataLançamento))[0];
          
          setValorText(titherLast ? formatCurrency(titherLast.valor) : '');
          
          // Auto fill last treasurer used in any transaction
          const lastTx = [...lancamentos].sort((a, b) => new Date(b.dataLançamento) - new Date(a.dataLançamento))[0];
          setTesoureiro(lastTx ? lastTx.tesoureiro : '');
        }
      } else {
        // Simple blank creation
        setDizimistaId('');
        setAno(new Date().getFullYear());
        setMes(meses[new Date().getMonth()]); // default current month
        setValorText('');
        
        // Auto fill last treasurer
        const lastTx = [...lancamentos].sort((a, b) => new Date(b.dataLançamento) - new Date(a.dataLançamento))[0];
        setTesoureiro(lastTx ? lastTx.tesoureiro : '');
      }
    }
  }, [isOpen, initialData, lancamentos]);

  // Handle tither change to auto-suggest last contribution value
  const handleDizimistaChange = (id) => {
    setDizimistaId(id);
    if (id && !initialData?.valor) {
      const titherLast = lancamentos
        .filter(l => l.dizimistaId === id)
        .sort((a, b) => new Date(b.dataLançamento) - new Date(a.dataLançamento))[0];
      if (titherLast) {
        setValorText(formatCurrency(titherLast.valor));
      }
    }
  };

  // Convert number to R$ string format
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '';
    const cleanValue = value.toFixed(2).replace('.', ',');
    return `R$ ${cleanValue}`;
  };

  // Handle currency input formatting
  const handleCurrencyInput = (e) => {
    let value = e.target.value;
    // Remove everything except numbers
    value = value.replace(/\D/g, '');
    if (!value) {
      setValorText('');
      return;
    }
    // Parse to float and divide by 100 for cents
    const floatValue = parseFloat(value) / 100;
    setValorText(
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(floatValue)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dizimistaId || !ano || !mes || !valorText || !tesoureiro.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Convert formatted money (e.g. "R$ 120,50") back to float number
    const numericValue = parseFloat(
      valorText
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    );

    if (isNaN(numericValue) || numericValue <= 0) {
      alert('Por favor, insira um valor válido de dízimo.');
      return;
    }

    const data = {
      dizimistaId,
      ano: parseInt(ano),
      mes,
      valor: numericValue,
      tesoureiro: tesoureiro.trim(),
      dataLançamento: new Date().toISOString()
    };

    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? 'Lançar/Editar Dízimo' : 'Novo Lançamento'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dizimista Selector */}
          <div className="form-group">
            <label className="form-label">Dizimista</label>
            <select 
              className="form-control" 
              value={dizimistaId} 
              onChange={(e) => handleDizimistaChange(e.target.value)}
              disabled={!!initialData?.dizimistaId}
              required
            >
              <option value="">Selecione um dizimista...</option>
              {dizimistas.map(d => (
                <option key={d.id} value={d.id}>
                  {d.cargo ? `${d.cargo} ` : ''}{d.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Ano Selector */}
            <div className="form-group">
              <label className="form-label">Ano</label>
              <select 
                className="form-control" 
                value={ano} 
                onChange={(e) => setAno(e.target.value)}
                disabled={!!initialData?.ano}
                required
              >
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 3 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Mes Selector */}
            <div className="form-group">
              <label className="form-label">Mês</label>
              <select 
                className="form-control" 
                value={mes} 
                onChange={(e) => setMes(e.target.value)}
                disabled={!!initialData?.mes}
                required
              >
                {meses.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Valor Input */}
          <div className="form-group">
            <label className="form-label">Valor do Dízimo</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="R$ 0,00"
              value={valorText}
              onChange={handleCurrencyInput}
              required
            />
          </div>

          {/* Tesoureiro Input */}
          <div className="form-group">
            <label className="form-label">Tesoureiro(a)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ex: Dc. Suzana Lima"
              value={tesoureiro}
              onChange={(e) => setTesoureiro(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Confirmar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
