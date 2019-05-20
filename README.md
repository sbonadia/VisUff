# VisUFF
Projeto para geração de gráficos. Desenvolvido com biblioteca D3, versão 5. 
## Tipos de gráficos
Os tipos de gráficos previstos no projetos são:
- ScatterPlot
- Gráfico de barras
- Gráfico de Linhas

## Estrutura
```
[main.js]
	|
[baseGraf.js]
	|--- [scatterGraf.js]
	|--- [barsGraf.js]
	|--- [LinesGraf.js]
```
## Inicialização
Exemplo de inicialização com dados carregados de arquivo externo:
```
    var graf = new linesGraf({
	    width: 850,
	    height: 400,
	    margin: { left:40, right:180, top:40, bottom:40 },
	    classAttr: "SystemCodeNumber",
	    url: "data/parking.csv"
    });

	graf.loadData();
```
## Parâmtros de configuração
	width: largura do gráfico
	height: altura do gráfico;
	data: dados que serão usados no gráfico.
	url: caminho do arquivo de dados.
	margin: margens do gráfico;
	this.classAttr: atributo classe do dataset. Caso não seja atribuido, será considerado a coluna denominada "classe";
	colors: intervalo de cores;