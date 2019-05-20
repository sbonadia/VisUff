define(["d3.v5", "baseGraf"], function (d3, baseGraf) {
    class ScatterGraf extends baseGraf {
        constructor(opts) {
            super(opts);
            this.id = opts.id || "id-" + Math.floor(Math.random() * 99999),
            this.w = opts.width;
            this.h = opts.height;
            this.data = opts.data || undefined;
            this.url = opts.url || undefined;
            this.margin = opts.margin;
            this.scaleX;
            this.scaleX2;
            this.scaleY;
            this.categories = opts.categories || [];
            this.attributes = opts.attributes || [];
            this.colors = opts.colors;
            this.data_attA = 0;
            this.data_attB = 0;

        }

        init(data) {
            this.data = data;
            this.data_attA = this.data.columns[0];
            this.data_attB = this.data.columns[0];
            this.draw("body");
            this.update();
            this.addPainelCtrl();
            this.addPainelInfo();
            this.addLegend(this.svg);
        }
        addPainelCtrl() {
            var painel = d3.select('div#' + this.id)
                .append('div')
                .attr("class", "controls");
            this.addControl("data_attA", painel);
            this.addControl("data_attB", painel);
        }
        addCircles(chart) {
            var t = d3.transition()
                .duration(1000);
            chart.selectAll("circle")
                .data(this.data)
                .transition(t)
                .attr("cx", (d) => this.scaleX(d[this.data_attA]))
                .attr("cy", (d) => this.scaleY(d[this.data_attB]))
                .attr("r", (i) => 5)
                .attr("fill", (d) => this.colors[this.categories.indexOf(d.classe)])
                .attr("fill-opacity", ".5")
                .attr('stroke-width', 1)
                .attr("stroke", (d) => this.colors[this.categories.indexOf(d.classe)])
            //.attr("class",(d) => "l" + d[this.classAttr])

            chart.selectAll("circle")
                .data(this.data)
                .enter()
                .append("circle")
                .style("opacity", 0)
                .attr("cx", (d) => this.scaleX(d[this.data_attA]))
                .attr("cy", (d) => this.scaleY(d[this.data_attB]))
                .attr("r", (i) => 5)
                .attr("fill", (d) => this.colors[this.categories.indexOf(d.classe)])
                .attr("fill-opacity", ".5")
                .attr('stroke-width', 1)
                .attr("stroke", (d) => this.colors[this.categories.indexOf(d.classe)])
                //.attr("class",(d) => "l" + d[this.classAttr])
                .transition(t)
                .style("opacity", 1);
            this.addEvents(chart);
        }
        update() {
            this.updateAxis(this.svg);
            this.addCircles(this.chartGroup)
        }
        addEvents(trg) {
            var _loc = this;
            trg.selectAll('circle')
                .on("click", function (d) {
                    /*
                    var graf = new VisUff({
                        width: 550,
                        height: 250,
                        margin: { left:40, right:180, top:40, bottom:40 },
                        colors: [ "green" ,"red" ,"blue","yellow" ],
                    });
                    graf.data = _loc.data.map((d)=>{
                        //console.log(d)
                    })
                    graf.drawHistoGram(graf.data);
                    */
                })
                .on("mouseover", function (d) {
                    d3.select(this)
                        .attr('stroke-width', 3)
                        .attr("stroke", (d) => _loc.colors[_loc.categories.indexOf(d["classe"])]);
                    var painel = d3.select('div#' + _loc.id + " .painel");
                    _loc.data.columns.forEach((el, i) => {
                        painel.select('.att' + i).text(d[el]);
                    });
                    painel.style("opacity", 1);
                })
                .on("mouseout", function (d) {
                    d3.select(this)
                        .attr('stroke-width', 1)
                        .attr("stroke", (d) => _loc.colors[_loc.categories.indexOf(d["classe"])]);
                    var painel = d3.select('div#' + _loc.id + " .painel");
                    _loc.data.columns.forEach((el, i) => {
                        painel.select('.att' + i).text("");
                    });
                    painel.style("opacity", 0);
                })
        }
        
    }
    return ScatterGraf;
});