import React, { useState, useEffect } from 'react';

// Tabela de conversão de pesos de cobre
const pesoPorMetro = {
  '1/4"': 0.125, '3/8"': 0.190, '1/2"': 0.260,
  '5/8"': 0.335, '3/4"': 0.405, '7/8"': 0.475
};

// ==========================================================
// COMPONENTES AUXILIARES PARA GARANTIR ALINHAMENTO PERFEITO
// ==========================================================
const BoxDestaque = ({ corTexto, corBorda, corBg, icone, titulo, valorPrincipal, subtitulo }) => (
  <div style={{ background: corBg, padding: '16px', borderRadius: '10px', border: `1px solid ${corBorda}` }}>
    <div style={{ fontSize: '11px', color: corTexto, textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
      <i className={icone}></i> {titulo}
    </div>
    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.2' }}>
      {valorPrincipal}
    </div>
    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
      {subtitulo}
    </div>
  </div>
);

const LinhaDetalhe = ({ icone, label, valor, isLast }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: isLast ? 'none' : '1px dashed var(--border)' }}>
    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icone && <i className={icone} style={{ opacity: 0.6, fontSize: '14px' }}></i>} {label}
    </span>
    <strong style={{ fontSize: '13px', color: 'var(--text-primary)', textAlign: 'right', maxWidth: '55%', lineHeight: '1.3' }}>
      {valor}
    </strong>
  </div>
);

export default function CalculadoraInstalacao() {
  const [form, setForm] = useState({
    tipo: 'highwall',
    capacidade: 12000,
    gas: '410a_32',
    quantidade: 1,
    distancia: 3,
    eletrica: 'sim',
    desinstalacao: 'nao'
  });

  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calcular = () => {
    const tipo = form.tipo;
    const capacidade = parseInt(form.capacidade);
    const gas = form.gas;
    const quantidade = Math.max(1, parseInt(form.quantidade) || 1);
    const distancia = parseFloat(form.distancia) || 0;

    // 1. DIMENSIONAMENTO DE TUBULAÇÃO
    let bitolaLiq = '', bitolaGas = '', suporte = '';
    if      (capacidade <=  9000) { bitolaLiq = '1/4"'; bitolaGas = '3/8"'; }
    else if (capacidade <= 12000) { bitolaLiq = '1/4"'; bitolaGas = gas === '410a_32' ? '3/8"' : '1/2"'; }
    else if (capacidade <= 18000) { bitolaLiq = '1/4"'; bitolaGas = '1/2"'; }
    else if (capacidade <= 24000) { bitolaLiq = '1/4"'; bitolaGas = '5/8"'; }
    else if (capacidade <= 30000) { bitolaLiq = '3/8"'; bitolaGas = '5/8"'; }
    else if (capacidade <= 36000) { bitolaLiq = '3/8"'; bitolaGas = '3/4"'; }
    else if (capacidade <= 48000) { bitolaLiq = '3/8"'; bitolaGas = '3/4"'; }
    else if (capacidade <= 60000) { bitolaLiq = '3/8"'; bitolaGas = '7/8"'; }
    else if (capacidade <= 80000) { bitolaLiq = '1/2"'; bitolaGas = '7/8"'; }

    // 2. DIMENSIONAMENTO ELÉTRICO (PP Padrão 5x1.5mm)
    let amperagemDisjuntor = "", caboAlimentacao = "";
    const caboComando = "Cabo PP 5x 1,5mm²"; // PADRÃO DEFINIDO
    
    if (capacidade <= 12000) { 
        amperagemDisjuntor = "10A ou 16A"; 
        caboAlimentacao = "Cabo Flexível 3x 2,5mm²"; 
    } else if (capacidade <= 18000) { 
        amperagemDisjuntor = "16A ou 20A"; 
        caboAlimentacao = "Cabo Flexível 3x 2,5mm²"; 
    } else if (capacidade <= 24000) { 
        amperagemDisjuntor = "20A ou 25A"; 
        caboAlimentacao = "Cabo Flexível 3x 4,0mm²"; 
    } else if (capacidade <= 36000) { 
        amperagemDisjuntor = "32A ou 40A"; 
        caboAlimentacao = "Cabo Flexível 3x 6,0mm²"; 
    } else if (capacidade <= 60000) { 
        amperagemDisjuntor = "50A ou 63A"; 
        caboAlimentacao = "Cabo Flexível 3x 10,0mm²"; 
    } else { 
        amperagemDisjuntor = "63A ou 70A"; 
        caboAlimentacao = "Cabo Flexível 3x 10,0mm² ou 16,0mm²"; 
    }

    // 3. DIMENSIONAMENTO DE SUPORTE
    if      (capacidade <= 12000) suporte = 'L de 400mm';
    else if (capacidade <= 24000) suporte = 'L de 500mm';
    else if (capacidade <= 36000) suporte = 'L de 600mm Reforçado';
    else                          suporte = 'L 600/800mm Reforçado ou Base de Borracha';
    
    // 4. FIXAÇÃO
    const fixInterna = tipo === 'highwall'
      ? `${6*quantidade}× Buchas nº 6 + Parafusos`
      : `${4*quantidade}× Tirantes + Parabolts`;

    // 5. QUANTIDADES TOTAIS
    const totalLiq  = distancia * quantidade;
    const totalGas  = distancia * quantidade;
    const totalIso  = distancia * 2 * quantidade;
    const totalDren = distancia * quantidade;
    const totalFita = Math.ceil(distancia / 3) * quantidade;
    const totalCaboComando = (distancia + 1.5) * quantidade;

    const bgc       = bitolaGas.includes('3/8"') ? '3/8"' : (bitolaGas.includes('1/2"') ? '1/2"' : bitolaGas);
    const pesoLiq   = totalLiq * (pesoPorMetro[bitolaLiq] || 0);
    const pesoGas   = totalGas * (pesoPorMetro[bgc] || 0);
    const pesoTotal = pesoLiq + pesoGas;

    setResultado({
      bitolaLiq, bitolaGas, suporte, amperagemDisjuntor, caboComando, caboAlimentacao,
      fixInterna, totalLiq, totalGas, totalIso, totalDren, totalFita, totalCaboComando,
      pesoLiq, pesoGas, pesoTotal, quantidade
    });
  };

  useEffect(() => { calcular(); }, [form]);

  return (
    <div>
      {/* ── CABEÇALHO DO PAINEL ── */}
      <div className="panel mb-4">
        <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <div className="panel-title" style={{ color: 'var(--primary-light)' }}>
            <i className="bi bi-calculator me-2"></i> 
            Calculadora de Materiais para Instalação
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label-custom">Tipo de Máquina</label>
              <select className="form-select-custom" name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="highwall">High Wall (Split)</option>
                <option value="pisoteto">Piso Teto</option>
                <option value="cassete">Cassete</option>
              </select>
            </div>
            
            <div className="col-md-2">
              <label className="form-label-custom">Capacidade</label>
              <select className="form-select-custom" name="capacidade" value={form.capacidade} onChange={handleChange}>
                <option value="9000">9.000 BTUs</option>
                <option value="12000">12.000 BTUs</option>
                <option value="18000">18.000 BTUs</option>
                <option value="24000">24.000 BTUs</option>
                <option value="30000">30.000 BTUs</option>
                <option value="36000">36.000 BTUs</option>
                <option value="48000">48.000 BTUs</option>
                <option value="60000">60.000 BTUs</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label-custom">Fluido (Gás)</label>
              <select className="form-select-custom" name="gas" value={form.gas} onChange={handleChange}>
                <option value="410a_32">R-410A / R-32</option>
                <option value="22">R-22</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label-custom">Quantidade</label>
              <input className="form-control-custom" type="number" min="1" name="quantidade" value={form.quantidade} onChange={handleChange} />
            </div>

            <div className="col-md-2">
              <label className="form-label-custom">Linha (metros)</label>
              <input className="form-control-custom" type="number" min="1" step="0.5" name="distancia" value={form.distancia} onChange={handleChange} />
            </div>

            <div className="col-md-2">
              <label className="form-label-custom">Ponto Elétrico</label>
              <select className="form-select-custom" name="eletrica" value={form.eletrica} onChange={handleChange}>
                <option value="sim">Já existe</option>
                <option value="nao">Fazer do zero</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {form.eletrica === 'nao' && (
        <div className="alert-banner mb-4" style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ color: '#ef4444', fontSize: '24px' }}><i className="bi bi-lightning-charge-fill"></i></div>
            <div>
              <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '14px' }}>Ponto Elétrico Ausente na Obra</div>
              <div style={{ color: '#b91c1c', fontSize: '13px' }}>Será necessário orçar tubulação elétrica extra, disjuntores e cabos de força até o quadro principal.</div>
            </div>
          </div>
        </div>
      )}

      {resultado && (
        <div className="row g-4 mb-5" style={{ display: 'flex' }}>
          
          {/* COLUNA 1: Cobre */}
          <div className="col-md-4" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="panel-header" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  <i className="bi bi-layers-fill text-warning me-2"></i> Cobre e Isolamento
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                <BoxDestaque 
                  corBg="var(--surface-2)" corBorda="var(--border)" corTexto="var(--text-secondary)"
                  icone="bi bi-vinyl" titulo={`Tubo de Líquido (${resultado.bitolaLiq})`}
                  valorPrincipal={`${resultado.totalLiq} metros`} subtitulo={`Peso: ~${resultado.pesoLiq.toFixed(2)} kg`}
                />
                <BoxDestaque 
                  corBg="var(--surface-2)" corBorda="var(--border)" corTexto="var(--text-secondary)"
                  icone="bi bi-vinyl-fill" titulo={`Tubo de Gás (${resultado.bitolaGas})`}
                  valorPrincipal={`${resultado.totalGas} metros`} subtitulo={`Peso: ~${resultado.pesoGas.toFixed(2)} kg`}
                />
                <BoxDestaque 
                  corBg="rgba(59,130,246,0.08)" corBorda="rgba(59,130,246,0.2)" corTexto="#3b82f6"
                  icone="bi bi-box-seam" titulo="Cobre Total na Balança"
                  valorPrincipal={`${resultado.pesoTotal.toFixed(2)} kg`} subtitulo="Somatória de peso das linhas"
                />

                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <LinhaDetalhe icone="bi bi-dash-lg" label="Tubo Esponjoso" valor={`${resultado.totalIso} m`} />
                  <LinhaDetalhe icone="bi bi-heptagon-half" label="Fita PVC (Acabamento)" valor={`${resultado.totalFita} rolo(s)`} isLast={true} />
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 2: Elétrica */}
          <div className="col-md-4" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="panel-header" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  <i className="bi bi-plugin text-danger me-2"></i> Elétrica e Comando
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                <BoxDestaque 
                  corBg="rgba(245,158,11,0.08)" corBorda="rgba(245,158,11,0.2)" corTexto="#d97706"
                  icone="bi bi-bezier2" titulo="Comando (Evap x Cond)"
                  valorPrincipal={resultado.caboComando} subtitulo={`Separar: ${resultado.totalCaboComando.toFixed(1)} metros`}
                />
                <BoxDestaque 
                  corBg="rgba(239,68,68,0.08)" corBorda="rgba(239,68,68,0.2)" corTexto="#dc2626"
                  icone="bi bi-plug-fill" titulo="Alimentação de Energia"
                  valorPrincipal={resultado.caboAlimentacao} subtitulo="Medir do quadro até a máquina"
                />

                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <LinhaDetalhe icone="bi bi-hdd-rack" label="Disjuntor Bipolar" valor={`${resultado.quantidade}× ${resultado.amperagemDisjuntor}`} />
                  <LinhaDetalhe icone="bi bi-signpost-split" label="Terminais (Ilhós/Garfo)" valor={`Aprox. ${8 * resultado.quantidade} un`} />
                  <LinhaDetalhe icone="bi bi-droplet-half" label="Mangueira de Dreno" valor={`${resultado.totalDren} m ${form.tipo === 'cassete' ? '(PVC)' : ''}`} isLast={true} />
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 3: Fixação */}
          <div className="col-md-4" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="panel-header" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  <i className="bi bi-tools text-success me-2"></i> Fixação e Ferragens
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                <BoxDestaque 
                  corBg="rgba(16,185,129,0.08)" corBorda="rgba(16,185,129,0.2)" corTexto="#059669"
                  icone="bi bi-display" titulo="Suporte Condensadora"
                  valorPrincipal={resultado.suporte} subtitulo={`Quantidade: ${resultado.quantidade} par(es)`}
                />

                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <LinhaDetalhe icone="bi bi-house-door" label="Fixação Evaporadora" valor={resultado.fixInterna} />
                  <LinhaDetalhe icone="bi bi-bricks" label="Fixação Suporte (Parede)" valor={`${6 * resultado.quantidade}× Buchas nº 10 + Parafusos`} />
                  <LinhaDetalhe icone="bi bi-wrench-adjustable" label="Fixação Máquina (Base)" valor={`${4 * resultado.quantidade}× Kit Porca/Parafuso c/ Borracha`} isLast={true} />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}