# Regras de negócio

| ID | Regra | Resultado |
|---|---|---|
| BR001–003 | Número, CNPJ e pedido são obrigatórios | `DADOS_INCOMPLETOS` |
| BR004 | Pedido deve existir e ser único | `PEDIDO_NAO_ENCONTRADO` |
| BR005 | Fornecedor deve estar `ATIVO` | `FORNECEDOR_BLOQUEADO` |
| BR006 | CNPJ deve coincidir com o pedido | `CNPJ_DIVERGENTE` |
| BR007 | Número não pode existir no controle | `FATURA_DUPLICADA` |
| BR008 | Valor deve ser positivo | `DADOS_INCOMPLETOS` |
| BR009–010 | Valor não excede saldo além de `VALUE_TOLERANCE` | `APROVADA` ou `DIVERGENCIA_VALOR` |

Business exceptions não recebem retry. Falhas de leitura, Excel bloqueado, pasta inacessível e Outlook recebem até `MAX_RETRY` tentativas.
