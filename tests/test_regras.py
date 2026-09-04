import csv
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def decidir(fatura, pedido=None, fornecedor='ATIVO', tolerancia=1.0, duplicada=False):
    if not all([fatura['numero_fatura'],fatura['cnpj_fornecedor'],fatura['numero_pedido']]) or fatura['valor_fatura']<=0: return 'DADOS_INCOMPLETOS'
    if duplicada: return 'FATURA_DUPLICADA'
    if pedido is None: return 'PEDIDO_NAO_ENCONTRADO'
    if fornecedor!='ATIVO': return 'FORNECEDOR_BLOQUEADO'
    if fatura['cnpj_fornecedor'] != pedido['cnpj_fornecedor']: return 'CNPJ_DIVERGENTE'
    if fatura['valor_fatura']-pedido['saldo_disponivel'] > tolerancia: return 'DIVERGENCIA_VALOR'
    return 'APROVADA'
def test_all_demo_scenarios_are_present():
    rows=list(csv.DictReader((ROOT/'dados/faturas/cenarios.csv').open(encoding='utf-8')))
    assert len(rows)==20
    expected={'APROVADA','FATURA_DUPLICADA','PEDIDO_NAO_ENCONTRADO','DIVERGENCIA_VALOR','FORNECEDOR_BLOQUEADO','CNPJ_DIVERGENTE','DADOS_INCOMPLETOS','ERRO_TECNICO'}
    assert expected <= {r['cenario'] for r in rows}
def test_tolerance_is_accepted():
    f={'numero_fatura':'F','cnpj_fornecedor':'1','numero_pedido':'P','valor_fatura':101}
    p={'cnpj_fornecedor':'1','saldo_disponivel':100}
    assert decidir(f,p)=='APROVADA'
def test_excess_is_divergence():
    f={'numero_fatura':'F','cnpj_fornecedor':'1','numero_pedido':'P','valor_fatura':101.01}
    p={'cnpj_fornecedor':'1','saldo_disponivel':100}
    assert decidir(f,p)=='DIVERGENCIA_VALOR'
