import React, { useState, useMemo, useRef } from 'react';
import { FileText, MessageCircle, Download, Trophy, TrendingUp, Users, DollarSign, Calendar, Award, Star } from 'lucide-react';
import LogoADFARE from './LogoADFARE';

const MESES = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
const MESES_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const formatCargoAbbrev = (cargo) => {
  if (!cargo) return '';
  const c = cargo.trim().toLowerCase();
  if (c === 'membro' || c === 'nenhum' || c === '') return '';
  if (c.startsWith('ev') || c === 'evangelista') return 'Ev.';
  if (c.startsWith('pr') || c === 'pastor') return 'Pr.';
  if (c.startsWith('pb') || c.startsWith('presb') || c === 'presbítero') return 'Pb.';
  if (c.startsWith('dcsa') || c.startsWith('diaconis') || c === 'diaconisa') return 'Dcsa.';
  if (c.startsWith('dc') || c.startsWith('diac') || c === 'diácono') return 'Dc.';
  if (c.startsWith('miss') || c === 'missionário(a)') return 'Miss.';
  if (c.startsWith('ob') || c === 'obreiro(a)') return 'Ob.';
  return cargo;
};

const formatNameWithCargo = (cargo, nome) => {
  const abbrev = formatCargoAbbrev(cargo);
  return abbrev ? `${abbrev} ${nome}` : nome;
};

const getMedalha = (pct) => {
  if (pct === 0) return { emoji: '⬜', label: 'Sem registro', color: '#94a3b8', bg: 'var(--bg-main)', tier: 0 };
  if (pct < 40) return { emoji: '❤️', label: 'Esforçado', color: '#f97316', bg: '#fff7ed', tier: 1 };
  if (pct < 70) return { emoji: '🥉', label: 'Bronze', color: '#a16207', bg: '#fefce8', tier: 2 };
  if (pct < 100) return { emoji: '🥈', label: 'Prata', color: '#64748b', bg: '#f8fafc', tier: 3 };
  return { emoji: '🥇', label: 'Ouro', color: '#d97706', bg: '#fffbeb', tier: 4 };
};

export default function Relatorio({ dizimistas, lancamentos }) {
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();

  const [tipoPeriodo, setTipoPeriodo] = useState('mes');
  const [selectedAno, setSelectedAno] = useState(currentYear);
  const [selectedMesIdx, setSelectedMesIdx] = useState(currentMonthIdx);
  const [mensagem, setMensagem] = useState(
    'A Tesouraria, em nome do Ministério Família Restaurada, agradece a fidelidade de cada irmão(ã) que honrou a Deus com o dízimo. Rogamos a Deus que supra todas as suas necessidades, em Glória, por Cristo Jesus! 🙌'
  );
  const [gerado, setGerado] = useState(false);
  const reportRef = useRef(null);

  const anosDisponiveis = useMemo(() => {
    const anos = [...new Set(lancamentos.map(l => l.ano))].sort((a, b) => b - a);
    if (!anos.includes(currentYear)) anos.unshift(currentYear);
    return anos;
  }, [lancamentos, currentYear]);

  const dados = useMemo(() => {
    if (!gerado) return null;

    let lancsFiltrados;
    let mesesNoPeriodo;
    let labelPeriodo;

    if (tipoPeriodo === 'mes') {
      const mesSel = MESES[selectedMesIdx];
      lancsFiltrados = lancamentos.filter(l => l.ano === selectedAno && l.mes === mesSel);
      mesesNoPeriodo = [mesSel];
      labelPeriodo = `${MESES_FULL[selectedMesIdx]} ${selectedAno}`;
    } else {
      lancsFiltrados = lancamentos.filter(l => l.ano === selectedAno);
      mesesNoPeriodo = [...new Set(lancsFiltrados.map(l => l.mes))].sort(
        (a, b) => MESES.indexOf(a) - MESES.indexOf(b)
      );
      labelPeriodo = `Ano ${selectedAno}`;
    }

    const totalGeral = lancsFiltrados.reduce((sum, l) => sum + l.valor, 0);
    const dizimistasNoPeriodo = new Set(lancsFiltrados.map(l => l.dizimistaId));
    const mediaPerDizimista = dizimistasNoPeriodo.size > 0 ? totalGeral / dizimistasNoPeriodo.size : 0;

    let evolucaoMensal = [];
    if (tipoPeriodo === 'ano') {
      evolucaoMensal = MESES.map((mes, idx) => {
        const doMes = lancamentos.filter(l => l.ano === selectedAno && l.mes === mes);
        const totalMes = doMes.reduce((s, l) => s + l.valor, 0);
        const qtd = new Set(doMes.map(l => l.dizimistaId)).size;
        return { mes, mesIdx: idx, total: totalMes, qtd };
      });
      const maxMes = Math.max(...evolucaoMensal.map(m => m.total));
      evolucaoMensal = evolucaoMensal.map(m => ({ ...m, pctBar: maxMes > 0 ? (m.total / maxMes) * 100 : 0 }));
    }

    const totalMesesPeriodo = tipoPeriodo === 'mes' ? 1 : (mesesNoPeriodo.length || 1);

    const ranking = dizimistas
      .filter(d => d.status === 'Ativo')
      .map(d => {
        const lancD = lancsFiltrados.filter(l => l.dizimistaId === d.id);
        const mesesEntregues = new Set(lancD.map(l => l.mes)).size;
        const totalD = lancD.reduce((s, l) => s + l.valor, 0);
        const pct = Math.round((mesesEntregues / totalMesesPeriodo) * 100);
        const medalha = getMedalha(pct);
        return { ...d, mesesEntregues, totalMeses: totalMesesPeriodo, totalD, pct, medalha };
      })
      .sort((a, b) => b.pct - a.pct || b.totalD - a.totalD);

    const semRegistro = ranking.filter(d => d.pct === 0);
    const top3 = ranking.filter(d => d.pct > 0).slice(0, 3);

    let maiorContrib = null;
    if (lancsFiltrados.length > 0) {
      const maior = lancsFiltrados.reduce((max, l) => l.valor > max.valor ? l : max, lancsFiltrados[0]);
      const diz = dizimistas.find(d => d.id === maior.dizimistaId);
      maiorContrib = { valor: maior.valor, nome: diz ? formatNameWithCargo(diz.cargo, diz.nome) : '—', mes: maior.mes };
    }

    const novos = [];
    dizimistas.forEach(d => {
      const todos = lancamentos.filter(l => l.dizimistaId === d.id);
      if (todos.length > 0) {
        const primeiro = todos.sort((a, b) => a.ano !== b.ano ? a.ano - b.ano : MESES.indexOf(a.mes) - MESES.indexOf(b.mes))[0];
        if (tipoPeriodo === 'mes') {
          if (primeiro.ano === selectedAno && primeiro.mes === MESES[selectedMesIdx]) novos.push(d);
        } else {
          if (primeiro.ano === selectedAno) novos.push(d);
        }
      }
    });

    return {
      labelPeriodo, totalGeral, dizimistasNoPeriodo, mediaPerDizimista,
      evolucaoMensal, ranking, semRegistro, top3, maiorContrib, novos,
      tipoPeriodo, totalMesesPeriodo, lancsFiltrados,
    };
  }, [gerado, tipoPeriodo, selectedAno, selectedMesIdx, dizimistas, lancamentos]);

  const handleWhatsapp = () => {
    if (!dados) return;
    const { labelPeriodo, totalGeral, dizimistasNoPeriodo, ranking, top3, semRegistro } = dados;
    const ativosTotal = dizimistas.filter(d => d.status === 'Ativo').length;
    const pctGeral = ativosTotal > 0 ? Math.round((dizimistasNoPeriodo.size / ativosTotal) * 100) : 0;
    const icons = ['🥇', '🥈', '🥉'];
    const top3Lines = top3.map((d, i) => `${icons[i]} ${formatNameWithCargo(d.cargo, d.nome)} (${d.mesesEntregues}/${d.totalMeses} meses)`).join('\n');

    const texto = [
      `*📊 RELATÓRIO DE DÍZIMOS — ${labelPeriodo.toUpperCase()}*`,
      `*A.D. MINISTÉRIO FAMÍLIA RESTAURADA*`,
      ``,
      `💰 *Total arrecadado:* ${formatCurrency(totalGeral)}`,
      `👥 *Dizimistas participantes:* ${dizimistasNoPeriodo.size}`,
      `⭐ *Participação geral:* ${pctGeral}%`,
      ``,
      `🏆 *Top 3 mais fiéis:*`,
      top3Lines || '(nenhum registro no período)',
      ``,
      `✅ *Com registro no período:* ${dizimistasNoPeriodo.size}`,
      `😴 *Sem registro no período:* ${semRegistro.length}`,
      ``,
      `_${mensagem}_`,
    ].join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const handlePDF = async () => {
    if (!reportRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `relatorio_dizimos_${dados?.labelPeriodo?.replace(/\s/g, '_') || 'adfare'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(reportRef.current).save();
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      alert('Erro ao gerar PDF. Verifique o console.');
    }
  };

  return (
    <div className="relatorio-page">
      {/* Painel de Filtros */}
      <div className="relatorio-filtros card">
        <div className="filtros-header">
          <FileText size={20} />
          <h2>Gerar Relatório</h2>
        </div>
        <div className="filtros-body">
          <div className="filtro-group">
            <label>Período</label>
            <div className="periodo-toggle">
              <button
                className={tipoPeriodo === 'mes' ? 'active' : ''}
                onClick={() => { setTipoPeriodo('mes'); setGerado(false); }}
              >📅 Mês Específico</button>
              <button
                className={tipoPeriodo === 'ano' ? 'active' : ''}
                onClick={() => { setTipoPeriodo('ano'); setGerado(false); }}
              >📆 Ano Completo</button>
            </div>
          </div>
          <div className="filtro-selects">
            {tipoPeriodo === 'mes' && (
              <div className="filtro-group">
                <label>Mês</label>
                <select value={selectedMesIdx} onChange={e => { setSelectedMesIdx(Number(e.target.value)); setGerado(false); }}>
                  {MESES_FULL.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              </div>
            )}
            <div className="filtro-group">
              <label>Ano</label>
              <select value={selectedAno} onChange={e => { setSelectedAno(Number(e.target.value)); setGerado(false); }}>
                {anosDisponiveis.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-gerar" onClick={() => setGerado(true)}>
            <FileText size={16} /> Gerar Relatório
          </button>
        </div>
      </div>

      {/* Corpo do Relatório */}
      {gerado && dados && (
        <>
          <div className="relatorio-acoes">
            <button className="btn-whatsapp-rel" onClick={handleWhatsapp}>
              <MessageCircle size={18} /> Enviar ao Pastor (WhatsApp)
            </button>
            <button className="btn-pdf-rel" onClick={handlePDF}>
              <Download size={18} /> Baixar PDF
            </button>
          </div>

          <div ref={reportRef} className="relatorio-body">
            {/* Cabeçalho */}
            <div className="relatorio-header-card">
              <div className="rel-header-logo">
                <LogoADFARE size={44} />
              </div>
              <div className="rel-header-info">
                <h1>Relatório de Dízimos</h1>
                <p>A.D. Ministério Família Restaurada</p>
                <span className="periodo-badge">{dados.labelPeriodo}</span>
              </div>
              <div className="rel-header-meta">
                <small>Emitido em {new Date().toLocaleDateString('pt-BR')}</small>
              </div>
            </div>

            {/* Cards de Resumo */}
            <div className="rel-stats-grid">
              <div className="rel-stat-card accent">
                <DollarSign size={22} />
                <div>
                  <span className="rel-stat-value">{formatCurrency(dados.totalGeral)}</span>
                  <span className="rel-stat-label">Total Arrecadado</span>
                </div>
              </div>
              <div className="rel-stat-card">
                <Users size={22} />
                <div>
                  <span className="rel-stat-value">{dados.dizimistasNoPeriodo.size}</span>
                  <span className="rel-stat-label">Participaram</span>
                </div>
              </div>
              <div className="rel-stat-card">
                <TrendingUp size={22} />
                <div>
                  <span className="rel-stat-value">{formatCurrency(dados.mediaPerDizimista)}</span>
                  <span className="rel-stat-label">Média por Pessoa</span>
                </div>
              </div>
              <div className="rel-stat-card gold">
                <Award size={22} />
                <div>
                  <span className="rel-stat-value">{dados.ranking.filter(d => d.pct === 100).length} 🥇</span>
                  <span className="rel-stat-label">Fidelidade Total</span>
                </div>
              </div>
            </div>

            {/* Evolução Mensal */}
            {dados.tipoPeriodo === 'ano' && (
              <div className="rel-section">
                <h3 className="rel-section-title"><Calendar size={16} /> Evolução Mensal</h3>
                <div className="evolucao-table">
                  <div className="evolucao-head">
                    <span>Mês</span><span>Total</span><span>Pessoas</span><span>Distribuição</span>
                  </div>
                  {dados.evolucaoMensal.map(m => {
                    const isBest = m.total > 0 && m.total === Math.max(...dados.evolucaoMensal.map(x => x.total));
                    return (
                      <div key={m.mes} className={`evolucao-row${isBest ? ' best' : ''}`}>
                        <span className="ev-mes">{MESES_FULL[m.mesIdx]}{isBest ? ' ⭐' : ''}</span>
                        <span className="ev-val">{m.total > 0 ? formatCurrency(m.total) : '—'}</span>
                        <span className="ev-qtd">{m.qtd > 0 ? `${m.qtd}` : '—'}</span>
                        <span className="ev-bar-wrap">
                          {m.total > 0 && <span className="ev-bar" style={{ width: `${m.pctBar}%` }} />}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Destaques */}
            <div className="rel-section">
              <h3 className="rel-section-title"><Star size={16} /> Destaques do Período</h3>
              <div className="destaques-grid">
                {dados.maiorContrib && (
                  <div className="destaque-card">
                    <span className="dest-icon">💰</span>
                    <div>
                      <span className="dest-titulo">Maior contribuição</span>
                      <span className="dest-valor">{formatCurrency(dados.maiorContrib.valor)}</span>
                      <span className="dest-nome">{dados.maiorContrib.nome}</span>
                    </div>
                  </div>
                )}
                {dados.top3[0] && (
                  <div className="destaque-card">
                    <span className="dest-icon">🏆</span>
                    <div>
                      <span className="dest-titulo">Mais fiel do período</span>
                      <span className="dest-valor">{formatCurrency(dados.top3[0].totalD)}</span>
                      <span className="dest-nome">{formatNameWithCargo(dados.top3[0].cargo, dados.top3[0].nome)}</span>
                    </div>
                  </div>
                )}
                {dados.novos.length > 0 && (
                  <div className="destaque-card">
                    <span className="dest-icon">🌟</span>
                    <div>
                      <span className="dest-titulo">Novo(s) dizimista(s)</span>
                      <span className="dest-valor">{dados.novos.length} pessoa{dados.novos.length > 1 ? 's' : ''}</span>
                      <span className="dest-nome">{dados.novos.map(d => d.nome.split(' ')[0]).join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ranking de Fidelidade */}
            <div className="rel-section">
              <h3 className="rel-section-title"><Trophy size={16} /> Ranking de Fidelidade</h3>
              <div className="ranking-legenda">
                {[
                  { e: '🥇', l: 'Ouro (100%)' },
                  { e: '🥈', l: 'Prata (70–99%)' },
                  { e: '🥉', l: 'Bronze (40–69%)' },
                  { e: '❤️', l: 'Esforçado (1–39%)' },
                  { e: '⬜', l: 'Sem registro' },
                ].map(item => (
                  <span key={item.l} className="leg-item">{item.e} <small>{item.l}</small></span>
                ))}
              </div>
              <div className="ranking-list">
                {dados.ranking.map((d, idx) => (
                  <div key={d.id} className="ranking-item" style={{ '--medal-bg': d.medalha.bg }}>
                    <span className="rank-pos">#{idx + 1}</span>
                    <span className="rank-emoji" title={d.medalha.label}>{d.medalha.emoji}</span>
                    <div className="rank-info">
                      <span className="rank-nome">{formatNameWithCargo(d.cargo, d.nome)}</span>
                      <div className="rank-bar-wrap">
                        <div
                          className="rank-bar-fill"
                          style={{
                            width: `${d.pct}%`,
                            background: d.pct === 100 ? 'linear-gradient(90deg, #f59e0b, #d97706)' :
                              d.pct >= 70 ? 'linear-gradient(90deg, #94a3b8, #64748b)' :
                              d.pct >= 40 ? 'linear-gradient(90deg, #fbbf24, #a16207)' :
                              d.pct > 0 ? 'linear-gradient(90deg, #fb923c, #f97316)' : '#e2e8f0'
                          }}
                        />
                      </div>
                      <span className="rank-sub">
                        {d.mesesEntregues}/{d.totalMeses} meses · {formatCurrency(d.totalD)}
                      </span>
                    </div>
                    <span className="rank-pct" style={{ color: d.medalha.color }}>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sem Registro */}
            {dados.semRegistro.length > 0 && (
              <div className="rel-section">
                <h3 className="rel-section-title">😴 Sem Registro no Período</h3>
                <div className="inativos-list">
                  {dados.semRegistro.map(d => {
                    const ultimo = lancamentos
                      .filter(l => l.dizimistaId === d.id)
                      .sort((a, b) => b.ano - a.ano || MESES.indexOf(b.mes) - MESES.indexOf(a.mes))[0];
                    return (
                      <div key={d.id} className="inativo-item">
                        <span className="inativo-nome">{formatNameWithCargo(d.cargo, d.nome)}</span>
                        <span className="inativo-ultimo">
                          {ultimo ? `Último: ${ultimo.mes}/${ultimo.ano}` : 'Sem registros'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Encerramento */}
            <div className="rel-encerramento">
              <p className="enc-texto">"{mensagem}"</p>
              <p className="enc-assinatura">— Tesouraria · A.D. Ministério Família Restaurada</p>
            </div>
          </div>

          {/* Editor de mensagem (fora do PDF) */}
          <div className="mensagem-editor card">
            <label>✏️ Mensagem de encerramento (editável)</label>
            <textarea
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              rows={3}
              placeholder="Digite a mensagem que aparecerá no rodapé do relatório e no WhatsApp..."
            />
          </div>
        </>
      )}

      {!gerado && (
        <div className="relatorio-empty">
          <FileText size={52} />
          <p>Selecione o período e clique em <strong>Gerar Relatório</strong></p>
        </div>
      )}
    </div>
  );
}
