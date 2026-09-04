import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, BarChart3, Bot, Check, ChevronRight, CircleAlert, Clock3, Code2, Database, FileSpreadsheet, FileText, FolderInput, Github, Info, Mail, Play, RotateCcw, Search, ShieldCheck, Sparkles, Table2, Workflow, Zap } from "lucide-react";
import "./styles.css";

const pdfs = [
  { file: "FAT-2026-00195.pdf", invoice: "FAT-2026-00195", supplier: "Vertex Consulting", order: "PO-2026-0424", value: 4000, expected: 4000, result: "APROVADA", tone: "ok", message: "Fatura conciliada e registrada com sucesso.", checks: [["PDF válido",true],["Fornecedor ativo",true],["Pedido localizado",true],["Valor conciliado",true],["Sem duplicidade",true]] },
  { file: "FAT-2026-00207.pdf", invoice: "FAT-2026-00207", supplier: "Lumina Sistemas", order: "PO-2026-0431", value: 9500, expected: 9000, result: "DIVERGÊNCIA", tone: "warn", message: "Diferença de R$ 500,00 enviada para análise.", checks: [["PDF válido",true],["Fornecedor ativo",true],["Pedido localizado",true],["Valor conciliado",false],["Sem duplicidade",true]] },
  { file: "FAT-2026-00204.pdf", invoice: "FAT-2026-00204", supplier: "NovaCore Tecnologia Ltda", order: "PO-2026-9999", value: 5000, expected: null, result: "EXCEÇÃO", tone: "bad", message: "Pedido não localizado na base de apoio.", checks: [["PDF válido",true],["Fornecedor ativo",true],["Pedido localizado",false],["Valor conciliado",null],["Sem duplicidade",true]] },
];
const steps = [
  { label: "Receber", text: "Abrindo o PDF na pasta de entrada", code: 'arquivo = open("Data/Entrada/{pdf}")', icon: FolderInput },
  { label: "Extrair", text: "Lendo fatura, CNPJ, pedido e valor", code: "dados = extract(numero, cnpj, pedido, valor)", icon: FileText },
  { label: "Consultar", text: "Cruzando pedidos e fornecedores", code: "pedido = pedidos.select(dados.pedido_id)", icon: Search },
  { label: "Validar", text: "Aplicando regras de negócio", code: "status = validate(duplicidade, valor, fornecedor)", icon: ShieldCheck },
  { label: "Registrar", text: "Atualizando controle e movendo arquivo", code: "write(controle.xlsx); move(processados)", icon: Table2 },
];
const architecture = [
  { name: "Caixa de entrada", sub: "E-mail + PDF", icon: Mail, file: "ObterProximaFatura.xaml", description: "Localiza mensagens pelo assunto esperado e salva somente anexos PDF na pasta de entrada.", input: "Mensagem recebida", output: "Data/Entrada/fatura.pdf", code: 'mail.Filter("FATURA PARA CONCILIACAO")\nattachment.Save("Data/Entrada")' },
  { name: "UiPath Robot", sub: "Orquestração", icon: Bot, file: "Main.xaml", description: "Coordena a execução completa, chama cada workflow e mantém o tratamento centralizado de erros.", input: "Fila de documentos", output: "Fluxo executado", code: "Invoke Inicializar.xaml\nInvoke ObterProximaFatura.xaml\nInvoke ProcessarFatura.xaml\nInvoke Finalizar.xaml" },
  { name: "Bases de apoio", sub: "Regras + consultas", icon: Database, file: "ConsultarPedido.xaml", description: "Cruza pedido, fornecedor e histórico para aplicar as regras reais de conciliação.", input: "pedido_id + CNPJ + valor", output: "Pedido validado", code: `pedido = dtPedidos.Select(\n  "pedido_id = '" + pedidoId + "'"\n)\nvalidarFornecedor(cnpj)` },
  { name: "Controle", sub: "Excel auditável", icon: FileSpreadsheet, file: "atualizar_controle.py", description: "Registra status, diferença, horário e evidências em uma base auditável de resultados.", input: "Resultado da validação", output: "controle_conciliacao.xlsx", code: "worksheet.append([\n  numero, pedido, status, diferenca\n])\nworkbook.save(path)" },
  { name: "Relatório", sub: "CSV + HTML", icon: BarChart3, file: "Finalizar.xaml", description: "Consolida recebidas, aprovadas, divergências, taxa STP e tempo médio para acompanhamento.", input: "Controle atualizado", output: "Relatório executivo", code: "calcularIndicadores()\ngerarCSV()\ngerarHTML()" },
];
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function CountUp({ value, decimals = 0, suffix = "" }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = performance.now(); let raf;
    const tick = (now) => { const p = Math.min((now - start) / 900, 1); setShown(value * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shown.toFixed(decimals)}{suffix}</>;
}

function App() {
  const [selected, setSelected] = useState(0), [running, setRunning] = useState(false), [step, setStep] = useState(-1), [elapsed, setElapsed] = useState(0), [flowNode, setFlowNode] = useState(1), [showIntro, setShowIntro] = useState(true);
  const pdf = pdfs[selected], finished = step === steps.length, current = running ? steps[Math.max(step, 0)] : null;
  const progress = finished ? 100 : Math.max(0, ((step + 1) / steps.length) * 100), diff = pdf.expected == null ? null : pdf.value - pdf.expected;
  useEffect(() => {
    if (!running) return;
    const began = performance.now(), clock = setInterval(() => setElapsed((performance.now() - began) / 1000), 40);
    const timers = steps.map((_, i) => setTimeout(() => setStep(i), i * 1450));
    const end = setTimeout(() => { setRunning(false); setStep(steps.length); setElapsed(2.04); clearInterval(clock); }, steps.length * 1450);
    return () => { clearInterval(clock); clearTimeout(end); timers.forEach(clearTimeout); };
  }, [running, selected]);
  const run = () => { setStep(0); setElapsed(0); setRunning(true); };
  const choose = (i) => { setSelected(i); setRunning(false); setStep(-1); setElapsed(0); };
  return <main className={`shell ${showIntro?"introOpen":""}`}><div className="ambient a1" /><div className="ambient a2" /><section className="workspace">
    <header className="topbar glass"><div className="brand"><span className="brandMark"><Bot size={18} /></span><div><b>Conciliação de Faturas</b><small>Automação UiPath · ambiente demonstrativo</small></div></div><div className="status"><i /> Robô disponível</div><button className="runButton" onClick={run} disabled={running}>{running ? <RotateCcw size={16} /> : <Play size={16} fill="currentColor" />}{running ? "Processando" : finished ? "Executar novamente" : "Simular operação"}</button></header>
    <div className="layout">
      <aside className="inbox glass"><div className="panelHead"><span>Entrada</span><small>3 documentos</small></div><p className="hint">Selecione uma fatura para acompanhar o robô.</p><div className="files">{pdfs.map((item,i)=><button key={item.file} className={`file ${selected===i?"active":""}`} onClick={()=>choose(i)}><span className="fileIcon"><FileText size={17}/></span><span><b>{item.invoice}</b><small>{item.supplier}</small></span><ChevronRight size={15}/></button>)}</div><div className="fileFacts"><span>Valor da fatura</span><strong>{money.format(pdf.value)}</strong><div><span>Pedido</span><b>{pdf.order}</b></div></div></aside>
      <section className="stage glass"><div className="stageHead"><div><small>EXECUÇÃO EM TEMPO REAL</small><h1>{running?current?.text:finished?"Processamento concluído":"Pronto para iniciar"}</h1></div><div className="liveTime"><Clock3 size={15}/><span>{elapsed.toFixed(2)}s</span></div></div>
        <div className="rail" style={{"--progress":`${progress}%`}}><div className="railBase"><i/></div>{steps.map((item,i)=>{const Icon=item.icon,state=finished||i<step?"done":i===step?"current":"waiting";return <div className={`railStep ${state}`} key={item.label}><div className="node">{state==="done"?<Check size={17}/>:<Icon size={17}/>}</div><b>{item.label}</b></div>})}</div>
        <div className={`documentScene ${running?"working":""}`}><div className="orbit one"/><div className="orbit two"/><div className="docCard"><div className="docTop"><FileText size={18}/><span>PDF</span></div><b>{pdf.invoice}</b><span>{pdf.supplier}</span><div className="docRows"><i/><i/><i/></div><strong>{money.format(pdf.value)}</strong>{running&&<div className="scanLine"/>}</div><div className="botCore"><Bot size={25}/><span/></div></div>
        <div className="metrics"><div><span>Processo manual</span><strong><CountUp value={15}/> min</strong></div><div><span>Execução do robô</span><strong className="accent"><CountUp value={finished?2.04:elapsed} decimals={2}/> s</strong></div><div><span>Tempo economizado</span><strong><CountUp value={99.8} decimals={1} suffix="%"/></strong></div></div>
      </section>
      <aside className="inspector glass"><div className="panelHead"><span><Code2 size={15}/> Lógica da execução</span><small>pseudo-código</small></div><div className="codeWindow"><div className="codeChrome"><i/><i/><i/><span>ProcessarFatura.xaml</span></div>{steps.map((item,i)=><div className={`codeRow ${i===step?"active":""} ${finished||i<step?"done":""}`} key={item.label}><span>{String(i+1).padStart(2,"0")}</span><code>{item.code}</code></div>)}</div><div className={`result ${finished?pdf.tone:"idle"}`}><div className="resultLabel">{finished?(pdf.tone==="ok"?<Check size={15}/>:<CircleAlert size={15}/>):<Sparkles size={15}/>} OUTPUT</div><h2>{finished?pdf.result:running?"EM EXECUÇÃO":"AGUARDANDO"}</h2><p>{finished?pdf.message:running?current?.text:"O resultado da conciliação aparecerá aqui."}</p>{finished&&<><div className="resultMeta"><span>Diferença</span><b>{diff==null?"Pedido não localizado":money.format(diff)}</b></div><div className="checklist">{pdf.checks.map(([label,passed])=><div className={passed===true?"pass":passed===false?"fail":"skip"} key={label}>{passed===true?<Check size={12}/>:passed===false?<CircleAlert size={12}/>:<span>—</span>}<b>{label}</b></div>)}</div></>}</div></aside>
    </div>
    <section className="presentation glass">
      <div className="presentationHead"><div><span>MAPA TÉCNICO INTERATIVO</span><h2>Como as partes da automação se conectam</h2></div><p>Clique em um nó para explorar sua responsabilidade, dados e lógica interna.</p></div>
      <div className="mindMap"><div className="mapCanvas"><div className="mapLines"/><div className="mapCore"><span><Bot size={24}/></span><b>UiPath</b><small>Conciliação</small></div>{architecture.map((item,i)=>{const Icon=item.icon;return <button style={{"--i":i}} className={`mapNode node${i} ${flowNode===i?"active":""}`} onClick={()=>setFlowNode(i)} key={item.name}><span><Icon size={18}/></span><div><b>{item.name}</b><small>{item.sub}</small></div></button>})}</div>
        <article className="nodeDetail"><div className="detailTitle"><span><Code2 size={16}/></span><div><small>COMPONENTE SELECIONADO</small><h3>{architecture[flowNode].name}</h3></div><b>{architecture[flowNode].file}</b></div><p>{architecture[flowNode].description}</p><div className="io"><div><span>ENTRADA</span><b>{architecture[flowNode].input}</b></div><ArrowRight size={15}/><div><span>SAÍDA</span><b>{architecture[flowNode].output}</b></div></div><div className="detailCode"><div><i/><i/><i/><span>PSEUDOCÓDIGO</span></div><pre>{architecture[flowNode].code}</pre></div></article>
      </div>
      <div className="techStack"><span>TECNOLOGIAS E COMPONENTES</span><div><b>UiPath Studio</b><b>XAML Workflows</b><b>BusinessRuleException</b><b>DataTable.Select</b><b>Python + openpyxl</b><b>Excel / CSV / HTML</b></div></div>
    </section>
    <footer><span><Zap size={13}/> Demonstração baseada nos fluxos reais do projeto</span><span>UiPath · Excel · PDF · Regras de negócio</span></footer>
  </section>{showIntro&&<div className="introLayer" role="dialog" aria-modal="true" aria-labelledby="intro-title"><div className="introModal"><div className="introBadge"><Info size={14}/> Antes de explorar</div><div className="introIcon"><Bot size={29}/><i/></div><h1 id="intro-title">Esta experiência é uma simulação visual</h1><p>O painel demonstra, de forma interativa, como o robô processa e concilia faturas. Ele não executa o UiPath diretamente no navegador.</p><div className="realProject"><div><Github size={17}/><span><b>A automação real está no repositório</b><small>Código-fonte, workflows, regras, dados de teste e documentação.</small></span></div><div className="repoFiles"><code>Main.xaml</code><code>ProcessarFatura.xaml</code><code>atualizar_controle.py</code></div></div><button className="enterDemo" onClick={()=>setShowIntro(false)}><Play size={15} fill="currentColor"/> Entendi, explorar simulação</button><small className="introFoot">Projeto: Automação de Conciliação de Faturas e Pedidos</small></div></div>}</main>;
}
createRoot(document.getElementById("root")).render(<App/>);
