from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
required=['README.md','rpa/ConciliaFatura/project.json','dados/pedidos/pedidos_compra.xlsx','dados/fornecedores/fornecedores.xlsx','dados/resultados/controle_conciliacao.xlsx']
missing=[p for p in required if not (ROOT/p).exists()]
if missing: raise SystemExit('Arquivos ausentes: '+', '.join(missing))
for path in (ROOT/'rpa/ConciliaFatura').rglob('*.xaml'):
    ET.parse(path)
print('Estrutura e XAML estático válidos.')
