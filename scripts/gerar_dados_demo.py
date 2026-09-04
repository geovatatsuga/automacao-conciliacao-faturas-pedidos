"""Gera dados sintéticos do ConciliaFatura. Não executa o processo RPA."""
from __future__ import annotations
from pathlib import Path
from datetime import date, timedelta
import csv
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
VENDORS = [
    ("12.345.678/0001-90", "NovaCore Tecnologia Ltda", "ATIVO", "contato@novacore.demo", "TI"),
    ("23.456.789/0001-01", "Atlas Cloud Serviços", "ATIVO", "financeiro@atlas.demo", "Cloud"),
    ("34.567.890/0001-12", "Lumina Sistemas", "ATIVO", "contato@lumina.demo", "Software"),
    ("45.678.901/0001-23", "Vertex Consulting", "ATIVO", "contato@vertex.demo", "Consultoria"),
    ("56.789.012/0001-34", "Orion Facilities", "BLOQUEADO", "contato@orion.demo", "Facilities"),
    ("67.890.123/0001-45", "Nexa Solutions Brasil", "INATIVO", "contato@nexa.demo", "Serviços"),
]

def write_csv(path, headers, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w=csv.writer(f); w.writerow(headers); w.writerows(rows)

def invoice(no, cnpj, supplier, po, amount, scenario="APROVADA"):
    return {"numero_fatura":no,"cnpj_fornecedor":cnpj,"nome_fornecedor":supplier,"numero_pedido":po,"valor_fatura":amount,"data_emissao":"2026-09-01","data_vencimento":"2026-09-30","cenario":scenario}

def main():
    invdir=ROOT/'dados/faturas/exemplos'; invdir.mkdir(parents=True,exist_ok=True)
    orders=[]
    for i in range(1,17):
        c,n,*_=VENDORS[(i-1)%4]; amount=1000+i*750
        orders.append((f"PO-2026-{420+i:04d}",c,n,amount,"2026-08-25","ABERTO","TI","Mariana Lima",amount))
    write_csv(ROOT/'dados/pedidos/pedidos_compra.csv',["pedido_id","cnpj_fornecedor","fornecedor","valor_pedido","data_pedido","status","centro_custo","responsavel","saldo_disponivel"],orders)
    write_csv(ROOT/'dados/fornecedores/fornecedores.csv',["cnpj","razao_social","status","email","categoria"],VENDORS)
    cases=[]
    for i in range(10):
        po,c,n,val,*_=orders[i]; cases.append(invoice(f"FAT-2026-{192+i:05d}",c,n,po,val))
    cases += [invoice("FAT-2026-00192",orders[0][1],orders[0][2],orders[0][0],orders[0][3],"FATURA_DUPLICADA"), invoice("FAT-2026-00193",orders[1][1],orders[1][2],orders[1][0],orders[1][3],"FATURA_DUPLICADA")]
    c,n,*_=VENDORS[0]
    cases += [invoice("FAT-2026-00204",c,n,"PO-2026-9999",5000,"PEDIDO_NAO_ENCONTRADO"), invoice("FAT-2026-00205",c,n,"PO-2026-9998",6000,"PEDIDO_NAO_ENCONTRADO")]
    po,c,n,val,*_=orders[10]; cases += [invoice("FAT-2026-00206",c,n,po,val+100,"DIVERGENCIA_VALOR"),invoice("FAT-2026-00207",c,n,po,val+250,"DIVERGENCIA_VALOR")]
    c,n,*_=VENDORS[4]; cases += [invoice("FAT-2026-00208",c,n,orders[12][0],orders[12][3],"FORNECEDOR_BLOQUEADO")]
    cases += [invoice("FAT-2026-00209","99.999.999/0001-99",orders[13][2],orders[13][0],orders[13][3],"CNPJ_DIVERGENTE")]
    cases += [invoice("FAT-2026-00210","",VENDORS[0][1],orders[14][0],orders[14][3],"DADOS_INCOMPLETOS")]
    for row in cases:
        lines=[f"Fatura: {row['numero_fatura']}",f"CNPJ: {row['cnpj_fornecedor']}",f"Fornecedor: {row['nome_fornecedor']}",f"Pedido: {row['numero_pedido']}",f"Valor Total: R$ {row['valor_fatura']:,.2f}","Data Emissão: 01/09/2026","Data Vencimento: 30/09/2026",f"Cenário: {row['cenario']}"]
        (invdir/f"{row['numero_fatura']}.txt").write_text("\n".join(lines),encoding="utf-8")
        pdf=canvas.Canvas(str(invdir/f"{row['numero_fatura']}.pdf")); y=780
        for line in lines: pdf.drawString(72,y,line); y-=28
        pdf.save()
    (invdir/'FAT-2026-00211_corrompido.pdf').write_bytes(b'%PDF-corrupted-demo')
    write_csv(ROOT/'dados/faturas/cenarios.csv',list(cases[0]),[list(x.values()) for x in cases]+[["FAT-2026-00211","","","",0,"","","ERRO_TECNICO"]])
    write_csv(ROOT/'dados/resultados/controle_conciliacao.csv',["timestamp","numero_fatura","numero_pedido","cnpj","fornecedor","valor_fatura","valor_pedido","diferenca","resultado","motivo","robot_name","duracao_segundos"],[("2026-08-31T10:00:00","FAT-2026-00192","PO-2026-0421",VENDORS[0][0],VENDORS[0][1],1750,1750,0,"APROVADA","PROCESSAMENTO_ANTERIOR","ConciliaFatura","4.2")])

if __name__ == '__main__': main()
