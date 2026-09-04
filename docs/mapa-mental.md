# Mapa mental da automação

Este mapa apresenta como os componentes da **Automação de Conciliação de Faturas e Pedidos** se relacionam.

```mermaid
mindmap
  root((Conciliação de<br/>Faturas e Pedidos))
    Entrada
      E-mail com assunto esperado
      Anexo em PDF
      Pasta Data/Entrada
    UiPath
      Main.xaml
      Inicializar.xaml
      ObterProximaFatura.xaml
      ProcessarFatura.xaml
      Finalizar.xaml
    Extração
      Número da fatura
      Pedido de compra
      CNPJ e fornecedor
      Valor total
    Bases de apoio
      pedidos_compra.xlsx
      fornecedores.xlsx
      controle_conciliacao.xlsx
    Regras
      Documento válido
      Pedido localizado
      Fornecedor ativo
      Valor conciliado
      Fatura não duplicada
    Saídas
      Status da conciliação
      Controle Excel e CSV
      PDF processado
      Relatório HTML
      Evidências e logs
    Apresentação
      Dashboard React
      Simulação interativa
      Checklist de validações
      Pseudocódigo
```

## Responsabilidade dos componentes

| Componente | Responsabilidade | Entrada | Saída |
|---|---|---|---|
| `Main.xaml` | Orquestrar a execução completa | Configuração e documentos | Fluxo executado |
| `ObterProximaFatura.xaml` | Localizar e salvar o PDF | E-mail ou pasta local | Arquivo de entrada |
| `ProcessarFatura.xaml` | Extrair, consultar e validar | PDF da fatura | Resultado da conciliação |
| `ConsultarPedido.xaml` | Encontrar o pedido correspondente | Identificador do pedido | Registro do pedido |
| `Finalizar.xaml` | Consolidar os indicadores | Controle atualizado | Relatórios CSV e HTML |
| `atualizar_controle.py` | Persistir o resultado no Excel | Dados processados | Planilha atualizada |

## Decisão da conciliação

```mermaid
flowchart TD
    A[PDF válido?] -->|Não| X[Exceção técnica]
    A -->|Sim| B[Fatura já registrada?]
    B -->|Sim| C[FATURA_DUPLICADA]
    B -->|Não| D[Pedido localizado?]
    D -->|Não| E[PEDIDO_NAO_ENCONTRADO]
    D -->|Sim| F[Fornecedor válido?]
    F -->|Não| G[FORNECEDOR_INVALIDO]
    F -->|Sim| H[Valores coincidem?]
    H -->|Não| I[DIVERGENCIA_VALOR]
    H -->|Sim| J[APROVADA]
```

O mapa interativo equivalente está disponível no dashboard do projeto. Ao selecionar um nó, a interface mostra sua responsabilidade, arquivo associado, entrada, saída e pseudocódigo.
