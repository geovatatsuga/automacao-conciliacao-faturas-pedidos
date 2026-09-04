# Estratégia de exceções

```mermaid
flowchart TD
F[Falha]-->Q{Regra de negócio?}
Q-- Sim -->B[BusinessRuleException: registrar sem retry]
Q-- Não -->S[SystemException: evidência]
S-->T{Tentativas < MAX_RETRY?}
T-- Sim -->R[aguardar e repetir]
T-- Não -->E[ERRO_TECNICO]
```

`TC010` demonstra o retry somente para bloqueio de Excel. Um PDF ilegível é classificado como exceção de sistema quando a leitura falha; campos ausentes após leitura válida são divergência/revisão.
