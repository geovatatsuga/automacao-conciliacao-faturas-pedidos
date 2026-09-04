import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';
const root = fileURLToPath(new URL('..', import.meta.url));
const read = async p => (await fs.readFile(`${root}/${p}`,'utf8')).trim().split(/\r?\n/).map(l=>l.split(','));
async function make(csv, out, sheetName, numeric=[]) {
  const rows=await read(csv); const wb=Workbook.create(); const s=wb.worksheets.add(sheetName);
  s.getRangeByIndexes(0,0,rows.length,rows[0].length).values=rows.map((r,i)=>r.map((v,j)=>i&&numeric.includes(j)?Number(v):v));
  const h=s.getRangeByIndexes(0,0,1,rows[0].length); h.format={fill:'#1F4E78',font:{name:'Arial',bold:true,color:'#FFFFFF'}};
  s.getRangeByIndexes(0,0,rows.length,rows[0].length).format.font={name:'Arial',size:10};
  s.getRangeByIndexes(0,0,rows.length,rows[0].length).format.autofitColumns(); s.freezePanes.freezeRows(1);
  for (const j of numeric) s.getRangeByIndexes(1,j,rows.length-1,1).format.numberFormat='#,##0.00';
  const x=await SpreadsheetFile.exportXlsx(wb); await x.save(`${root}/${out}`);
}
await make('dados/pedidos/pedidos_compra.csv','dados/pedidos/pedidos_compra.xlsx','Pedidos',[3,8]);
await make('dados/fornecedores/fornecedores.csv','dados/fornecedores/fornecedores.xlsx','Fornecedores',[]);
await make('dados/resultados/controle_conciliacao.csv','dados/resultados/controle_conciliacao.xlsx','Controle',[5,6,7,11]);
const config=Workbook.create(), s=config.worksheets.add('Settings');
const vals=[['Setting','Value'],['MAIL_MODE','LOCAL_DEMO'],['INPUT_FOLDER','Data/Entrada'],['PROCESSED_FOLDER','Data/Processados'],['EXCEPTION_FOLDER','Data/Divergencias'],['EVIDENCE_FOLDER','Data/Evidencias'],['PURCHASE_ORDERS_FILE','../../dados/pedidos/pedidos_compra.xlsx'],['VENDORS_FILE','../../dados/fornecedores/fornecedores.xlsx'],['RECONCILIATION_FILE','../../dados/resultados/controle_conciliacao.xlsx'],['VALUE_TOLERANCE',1],['MAX_RETRY',3]];
s.getRange('A1:B11').values=vals; s.getRange('A1:B1').format={fill:'#1F4E78',font:{name:'Arial',bold:true,color:'#FFFFFF'}}; s.getRange('A1:B11').format.autofitColumns();
const x=await SpreadsheetFile.exportXlsx(config); await x.save(`${root}/rpa/ConciliaFatura/Config/Config.xlsx`);
