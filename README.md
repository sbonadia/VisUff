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
Exemplo de inicialização:
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
		width - largura do gráfico
		height - altura do gráfico;
		data = dados que serão usados no gráfico. Os dados podem ser carregados diretamente
		url = caminho do arquivo de dados
		this.margin = opts.margin;
		this.scaleX;
		this.scaleX2;
		this.scaleY;
		this.categories = opts.categories || [];
		this.attributes = opts.attributes || [];
		this.classes = opts.classes || [];
		this.classAttr = opts.classAttr || "classe";
		this.colors = opts.colors;
		this.data_attA = 0;
		this.data_attB = 0;
		this.svg = undefined;
		this.chartGroup = undefined;
