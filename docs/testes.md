# Testes

Os testes Python verificam a mesma regra de decisão usada pelo workflow e a integridade das 20 faturas de demonstração. XAML passa por validação XML estática no CI. A execução UiPath e integração Outlook não foram executadas neste ambiente.

| Caso | Resultado esperado |
|---|---|
| TC001 | APROVADA |
| TC002 | FATURA_DUPLICADA |
| TC003 | PEDIDO_NAO_ENCONTRADO |
| TC004 | FORNECEDOR_BLOQUEADO |
| TC005 | DIVERGENCIA_VALOR |
| TC006 | CNPJ_DIVERGENTE |
| TC007 | BUSINESS EXCEPTION |
| TC008–010 | SYSTEM EXCEPTION (`TC010` retry) |
| TC011 | APROVADA dentro da tolerância |
| TC012 | DADOS_INCOMPLETOS |
