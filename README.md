# ConciliaFatura RPA

## Automação de Conciliação de Faturas e Pedidos

**DATA • AUTOMATION • AI** · Jeová Anderson

Automação RPA com UiPath para receber faturas, extrair dados de PDFs digitais, validar fornecedor e pedido, conciliar valores, detectar duplicidade, persistir resultados em Excel e produzir evidências e relatório.

## Problema, processo e resultado

Áreas financeiras recebem faturas por e-mail e fazem conferências repetitivas entre PDF, pedido e controle Excel. O fluxo reduz esta operação a uma fila rastreável: entrada → extração → validação → conciliação → controle → notificação/relatório.

Stack: **UiPath • Outlook • Excel • PDF • DataTables • Regex**.

## Demonstração local

1. Abra `rpa/ConciliaFatura/Config/Config.xlsx` e mantenha `MAIL_MODE=LOCAL_DEMO`.
2. Copie PDFs sintéticos de `dados/faturas/exemplos` para `rpa/ConciliaFatura/Data/Entrada`.
3. Abra `rpa/ConciliaFatura/project.json` no UiPath Studio e execute `Main.xaml`.
4. Consulte `dados/resultados/controle_conciliacao.xlsx` e `Data/Relatorios`.

## Outlook Mode

**CONFIGURATION REQUIRED.** Configure um perfil Outlook Desktop no Studio, altere `MAIL_MODE` para `OUTLOOK`, informe pastas e filtro `FATURA PARA CONCILIACAO`. Nenhuma credencial ou e-mail real está versionado.

## Regras e exceções

As regras BR001–BR010 estão em [docs/regras-de-negocio.md](docs/regras-de-negocio.md). Divergência, duplicidade, fornecedor não ativo, CNPJ e pedido inválidos são Business Exceptions e não recebem retry. Falhas de PDF/Excel/Outlook/pasta são System Exceptions com até três tentativas e evidência.

## Cenários disponíveis

São 20 casos sintéticos: 10 aprovados, 2 duplicados, 2 pedidos inexistentes, 2 valores divergentes, 1 fornecedor bloqueado, 1 CNPJ divergente, 1 dado incompleto e 1 PDF corrompido. A relação completa está em `dados/faturas/cenarios.csv`.

## Maturidade

| Componente | Status |
|---|---|
| UiPath Workflow | STATIC VALIDATION ONLY |
| Execução UiPath | REQUER UiPath Studio |
| Local Demo Mail | DEMO READY (arquivos sintéticos) |
| Outlook | CONFIGURATION REQUIRED |
| Excel Reconciliation | TESTED (arquivos e dados) |
| PDF Extraction | TESTED (PDFs digitais gerados) |
| Exception Handling | TESTED por regras equivalentes em Python |
| Email Sending | CONFIGURATION REQUIRED |

## Qualidade e CI

O GitHub Actions gera dados demo, valida XML/XAML e estrutura, e executa testes Python. Ele **não executa UiPath**. Veja [docs/testes.md](docs/testes.md).

## Estrutura

`rpa/ConciliaFatura` contém o orquestrador, Framework, componentes e Config. `dados` contém somente dados fictícios. `docs` descreve processo, arquitetura, regras e exceções.

## Roadmap

Adicionar seletores Outlook testados, atividades PDF/Excel configuradas no Studio, capturas de execução, fila Orchestrator opcional e dashboard HTML de resumo.
