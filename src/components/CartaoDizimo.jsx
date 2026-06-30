import React, { useRef, useState, useEffect } from 'react';
import { Download, Copy, Share2, Send, Calendar, User, Grid, Table, Check } from 'lucide-react';
import LogoADFARE from './LogoADFARE';
import html2canvas from 'html2canvas';

export default function CartaoDizimo({ 
  dizimistas, 
  lancamentos, 
  selectedDizimistaId, 
  setSelectedDizimistaId, 
  onCellClick 
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const meses = [
    { key: 'JAN', name: 'Janeiro' },
    { key: 'FEV', name: 'Fevereiro' },
    { key: 'MAR', name: 'Março' },
    { key: 'ABR', name: 'Abril' },
    { key: 'MAI', name: 'Maio' },
    { key: 'JUN', name: 'Junho' },
    { key: 'JUL', name: 'Julho' },
    { key: 'AGO', name: 'Agosto' },
    { key: 'SET', name: 'Setembro' },
    { key: 'OUT', name: 'Outubro' },
    { key: 'NOV', name: 'Novembro' },
    { key: 'DEZ', name: 'Dezembro' },
    { key: '13º', name: '13º Salário' }
  ];

  const anosDisponiveis = Array.from(
    new Set(lancamentos.map(l => l.ano).concat([new Date().getFullYear()]))
  ).sort((a, b) => b - a);

  // Get active dizimista object
  const dizimista = dizimistas.find(d => d.id === selectedDizimistaId);

  // Filter contributions for this specific tither and year
  const titherYearLancamentos = lancamentos.filter(
    l => l.dizimistaId === selectedDizimistaId && l.ano === parseInt(selectedYear)
  );

  // Map months to aggregated contributions (Sum of all payments for the month)
  const getContributionForMonth = (mesKey) => {
    const monthPayments = titherYearLancamentos.filter(l => l.mes === mesKey);
    if (monthPayments.length === 0) return null;
    
    // Sum values
    const totalValue = monthPayments.reduce((sum, p) => sum + p.valor, 0);
    // Use last treasurer in the month list
    const lastTreasurer = monthPayments[monthPayments.length - 1].tesoureiro;
    
    return {
      valor: totalValue,
      tesoureiro: lastTreasurer
    };
  };

  // Helper to format date as DD/MM
  const formatDateAbbrev = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return isoString; // Retorna a string original se for um formato customizado como "06/02 - 19/02"
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

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

  const formatNameWithCargo = (cargo, nome) => {
    const abbrev = formatCargoAbbrev(cargo);
    return abbrev ? `${abbrev} ${nome}` : nome;
  };

  const getDizimistaFullName = () => {
    if (!dizimista) return '';
    return formatNameWithCargo(dizimista.cargo, dizimista.nome);
  };

  // Image Export handler using html2canvas
  const generateCanvas = async () => {
    if (!cardRef.current) return null;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High resolution scaling for crisp fonts and borders
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      setIsExporting(false);
      return canvas;
    } catch (err) {
      console.error('Erro ao renderizar cartão', err);
      setIsExporting(false);
      return null;
    }
  };

  // Action: Download
  const handleDownload = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const cleanName = dizimista.nome.toLowerCase().replace(/\s+/g, '_');
    link.download = `cartao_dizimo_${cleanName}_${selectedYear}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Action: Copy to clipboard
  const handleCopyToClipboard = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          showToast('Cartão copiado! Cole diretamente no WhatsApp.');
        } else {
          showToast('Cópia automática não suportada. Baixe a imagem e envie.');
        }
      } catch (err) {
        showToast('Falha ao copiar. Baixe a imagem.');
      }
    }, 'image/png');
  };

  // Action: Native Share
  const handleShare = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      const cleanName = dizimista.nome.toLowerCase().replace(/\s+/g, '_');
      const file = new File([blob], `cartao_dizimo_${cleanName}_${selectedYear}.png`, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Cartão de Dízimo ${selectedYear}`,
            text: `A Tesouraria, em nome do Ministério Família Restaurada, agradece a sua fidelidade e roga a Deus que supra todas as suas necessidades, em Glória, por Cristo Jesus! 🙌`
          });
        } catch (err) {
          console.log('Compartilhamento cancelado', err);
        }
      } else {
        // Fallback to text send if files cannot be shared natively
        handleSendTextOnly();
      }
    }, 'image/png');
  };

  // Action: Send Text Only (Fallback method)
  const handleSendTextOnly = () => {
    if (!dizimista) return;

    let text = `*A.D MINISTÉRIO FAMÍLIA RESTAURADA*\n`;
    text += `*CARTÃO DE DÍZIMO DIGITAL - ${selectedYear}*\n\n`;
    text += `*Nome:* ${getDizimistaFullName()}\n`;
    text += `*Ano:* ${selectedYear}\n\n`;
    text += `*LANÇAMENTOS:*\n`;

    meses.forEach(m => {
      const tx = getContributionForMonth(m.key);
      if (tx) {
        const val = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.valor);
        text += `• *${m.name}:* ${val} - Por: ${tx.tesoureiro}\n`;
      } else {
        text += `• *${m.name}:* [Em aberto]\n`;
      }
    });

    text += `\n_A Tesouraria, em nome do Ministério Família Restaurada, agradece a sua fidelidade e roga a Deus que supra todas as suas necessidades, em Glória, por Cristo Jesus! 🙌_`;

    const rawPhone = dizimista.telefone || '';
    const phone = rawPhone.startsWith('55') ? rawPhone : (rawPhone ? '55' + rawPhone : '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Simple custom toast utility
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div>
      {toastMessage && <div className="toast">{toastMessage}</div>}

      {/* Selectors panel */}
      <div className="card" style={{ padding: '14px', marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
          
          {/* Tither selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '11px' }}><User size={10} /> Dizimista</label>
            <input 
              type="text"
              placeholder="🔍 Buscar nome..."
              className="form-control"
              style={{ padding: '6px 10px', fontSize: '12px', marginBottom: '6px', height: 'auto' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="form-control" 
              style={{ padding: '8px', fontSize: '13px' }}
              value={selectedDizimistaId || ''} 
              onChange={(e) => setSelectedDizimistaId(e.target.value)}
            >
              <option value="">Selecione...</option>
              {dizimistas
                .filter(d => d.id === selectedDizimistaId || formatNameWithCargo(d.cargo, d.nome).toLowerCase().includes(searchQuery.toLowerCase()))
                .map(d => (
                  <option key={d.id} value={d.id}>
                    {formatNameWithCargo(d.cargo, d.nome)}
                  </option>
                ))}
            </select>
          </div>

          {/* Year selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '11px' }}><Calendar size={10} /> Ano</label>
            <select 
              className="form-control" 
              style={{ padding: '8px', fontSize: '13px' }}
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {anosDisponiveis.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>



      {/* Empty State */}
      {!selectedDizimistaId && (
        <div className="empty-state card">
          <User size={40} />
          <div className="empty-state-title">Nenhum Dizimista Selecionado</div>
          <p style={{ fontSize: '13px' }}>Selecione um dizimista acima para gerar o cartão de controle.</p>
        </div>
      )}

      {/* Tithing Card Element */}
      {selectedDizimistaId && dizimista && (
        <>
          <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
            {/* The printable card wrapper */}
            <div 
              ref={cardRef} 
              className="tithing-card-container"
              style={{ 
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)', 
                maxWidth: '420px', 
                margin: '0 auto',
                position: 'relative'
              }}
            >
              {/* Card Header */}
              <div className="tithing-card-header premium-header compact">
                {/* Horizontal top row: Logo + Title */}
                <div className="premium-top-row">
                  <div className="premium-logo-wrapper">
                    <LogoADFARE style={{ height: '50px', width: 'auto' }} />
                  </div>
                  <div className="premium-church-info">
                    <div className="premium-church-subtitle">Assembleia de Deus</div>
                    <div className="premium-church-title">Ministério Família Restaurada</div>
                  </div>
                </div>
                {/* Symmetrical metadata row - inline, very slim */}
                <div className="premium-meta-row slim">
                  <div className="premium-meta-item">
                    <span className="premium-meta-label">DIZIMISTA:</span>
                    <span className="premium-meta-value">{getDizimistaFullName()}</span>
                  </div>
                  <div className="premium-meta-item text-right">
                    <span className="premium-meta-label">EXERCÍCIO:</span>
                    <span className="premium-meta-value">{selectedYear}</span>
                  </div>
                </div>
              </div>

              {/* Layout 2: Modern Mosaic Grid */}
              <div className="mosaic-grid">
                {meses.map((m) => {
                  const tx = getContributionForMonth(m.key);
                  const isPaid = !!tx;
                  const is13 = m.key === '13º';
                  
                  return (
                    <div 
                      key={m.key}
                      className={`mosaic-tile ${isPaid ? 'paid' : 'unpaid'} ${is13 ? 'tile-13' : ''}`}
                      onClick={() => onCellClick({ dizimistaId: selectedDizimistaId, ano: selectedYear, mes: m.key })}
                    >
                      <div className="tile-month-name">{m.key}</div>
                      
                      {isPaid ? (
                        <>
                          <div className="tile-badge"><Check size={10} strokeWidth={3} /></div>
                          <div className="tile-value">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(tx.valor)}
                          </div>
                          <div className="tile-footer" style={{ marginTop: '2px' }}>
                            Por: {tx.tesoureiro}
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: 'light', margin: '4px 0' }}>-</div>
                          <div className="tile-footer" style={{ fontStyle: 'italic', color: '#94a3b8' }}>
                            Em aberto
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Card Footer Quote */}
              <div className="tithing-card-footer">
                "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria." (2 Coríntios 9:7)
              </div>
            </div>
          </div>

          {/* Export Actions Panel */}
          <div className="card">
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-title)', marginBottom: '12px', textAlign: 'left' }}>
              Compartilhar Cartão Digital
            </h4>
            
            <div className="share-actions-grid">
              <button 
                className="btn btn-secondary" 
                onClick={handleCopyToClipboard} 
                disabled={isExporting}
                style={{ fontSize: '13px', padding: '10px 8px' }}
              >
                <Copy size={16} /> Copiar Imagem
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={handleDownload} 
                disabled={isExporting}
                style={{ fontSize: '13px', padding: '10px 8px' }}
              >
                <Download size={16} /> Baixar Imagem
              </button>

              <button 
                className="btn btn-secondary" 
                onClick={handleShare} 
                disabled={isExporting}
                style={{ fontSize: '13px', padding: '10px 8px', gridColumn: 'span 2' }}
              >
                <Share2 size={16} /> Enviar Imagem no WhatsApp
              </button>

              <button 
                className="btn btn-primary" 
                onClick={handleSendTextOnly}
                style={{ fontSize: '13px', padding: '12px 8px', gridColumn: 'span 2' }}
              >
                <Send size={16} /> Enviar Resumo por Texto no WhatsApp
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
