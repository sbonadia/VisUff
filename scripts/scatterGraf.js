define(["d3.v5", "baseGraf"], function (d3, baseGraf) {
    class ScatterGraf extends baseGraf {
        constructor(opts) {
            super(opts);
            this.id = opts.id || "id-" + Math.floor(Math.random() * 99999),
            this.w = opts.width;
            this.h = opts.height;
            this.data = opts.data || undefined;
            this.url = opts.url || "data/iris.data";
            this.margin = opts.margin;
            this.scaleX;
            this.scaleX2;
            this.scaleY;
            this.categories = opts.categories || [];
            this.attributes = opts.attributes || [];
            this.colors = opts.colors;
            this.data_attA = 0;
            this.data_attB = 0;
            this.brush = undefined;

        }

        init(data) {
            this.data = data;
            this.data_attA = this.data.columns[0];
            this.data_attB = this.data.columns[0];
            this.draw("div.container");
            
            this.addTable();
            this.updateAxis(this.svg)
            this.addBrush(this.chartGroup);
            var zoom = this.addZoom(this.chartGroup);
            this.svg.call(zoom);

            this.addCircles(this.chartGroup);
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
            //var yAxisGroup = svg.select("g._y");

            this.update(chart);
            this.enter(chart);
            this.exit(chart);
            this.addEvents(chart);
        }
        addTable(){
            var thead = d3.select("#"+this.id)
                .append("table")
                .attr("id","table")
                .attr("class","table  table-striped  table-sm")
                .append("thead")
                .attr("class","thead-dark")
                .append("tr")
            thead.append("th")
                .attr("scope","col")
                .text("#classe")
            thead.append("th")
                .attr("scope","col")
                .text(this.attributes[0])
            thead.append("th")
                .attr("scope","col")
                .text(this.attributes[1])
            thead.append("th")
                .attr("scope","col")
                .text(this.attributes[2])
            thead.append("th")
                .attr("scope","col")
                .text(this.attributes[3])
        }
        removeTableRows() {
            //hideTableColNames();
            d3.selectAll(".row_data").remove();
        }
        populateTable() {
            if (!d3.event.selection) return;
            //d3.select(this).call(this.brush.move, null);

            var d_brushed =  d3.selectAll(".brushed").data();

            if (d_brushed.length > 0) {
                this.removeTableRows();
                d_brushed.forEach((d, i) => this.drawTableRows(i, d))
            } else {
                this.removeTableRows();
            }
        }
        drawTableRows(n, d_row){
            var d_row_filter = [    n +". "+ d_row.classe, 
                                    d_row[this.attributes[0]], 
                                    d_row[this.attributes[1]], 
                                    d_row[this.attributes[2]],
                                    d_row[this.attributes[3]]
                                ];

            var table = d3.select("table")
                        .append("tr")
                        .attr("class", "row_data")
                //table.append('td')
                  //      .text(n);
                table.selectAll("td")
                        .data(d_row_filter)
                        .enter()
                        .append("td")
                        .attr("align", (d, i) => i == 0 ? "left" : "center")
                        .text(d => d);
        }
        addBrush(chart){
            function brushed() {
                //console.log("das")
                //if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
                var select = d3.event.selection;
                var circle = this.svg.selectAll("circle")
                .attr("class","no-brushed")
                .attr("fill", (d) => this.colors[this.categories.indexOf(d.classe)])
                .attr("fill-opacity", .5)
                .attr('stroke-width', 1)
                .attr("stroke", (d) => this.colors[this.categories.indexOf(d.classe)]);
                if (select == null) return
                circle.filter((d,i) => {
                        var cx = this.scaleX(d[this.data_attA]),
                        cy = this.scaleY(d[this.data_attB]);
                        return isBrushed(select, cx, cy, this);
                }).attr("class","brushed")
                .attr("fill", "#FF0033")
                .attr("fill-opacity", .5)
                .attr('stroke-width', 2)
                .attr("stroke", "#FF0033");
            };    
            this.brush = d3.brush()
                .extent( [ [0,0], [this.w,this.h] ] )
                .on("brush", brushed.bind(this))
                .on("end", this.populateTable.bind(this))
                
            chart.append("g")
                .attr("class", "brush")
                .call(this.brush)
                .call(this.brush.move, this.scaleX.range());
            function isBrushed(coordBrush,cx, cy){
                var x0 = (coordBrush[0][0]), 
                x1 = (coordBrush[1][0]),
                y0 = (coordBrush[0][1]),
                y1 = (coordBrush[1][1])
                return (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1);
            }
            function highlight(){
                
            }
            //return brush;
        }
        addZoom(chart){
            var zoom = d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [this.w, this.h]])
                .extent([[0, 0], [this.w, this.h]])
                .on("zoom", zoomed.bind(this));

            function zoomed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
                var t = d3.event.transform;
                var new_xScale = t.rescaleX(this.scaleX);
                var new_yScale = t.rescaleY(this.scaleY);
                
                var xAxis = d3.axisBottom(this.scaleX);
                var yAxis = d3.axisLeft(this.scaleY);  
                //console.log(new_xScale, new_yScale)
                var xAxisGroup = this.svg.select("g._x");
                var yAxisGroup = this.svg.select("g._y");
                
                xAxisGroup.call(xAxis.scale(new_xScale));
                yAxisGroup.call(yAxis.scale(new_yScale));
                
                this.svg.select(".brush").call(this.brush.move, this.scaleX.range().map(t.invertX, t));
                d3.selectAll("circle")
                    .data(this.data)
                    .attr('cx', (d) => {return new_xScale(d[this.data_attA])})
                    .attr('cy', (d) => {return new_yScale(d[this.data_attB])});
            }
            return zoom;
        }
        updateData(){
            this.updateAxis(this.svg);
            this.addCircles(this.chartGroup);
            
        }
        enter(chart){
            var t = d3.transition()
                .duration(1000);
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
            return chart;
        }
        update(chart) {
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
                .attr("stroke", (d) => this.colors[this.categories.indexOf(d.classe)]);
            return chart;
        }
        exit(chart){
            var t = d3.transition()
                .duration(1000);
            chart.selectAll("circle")
                .data(this.data)
                .exit()
                .remove();
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
                    // d3.select(this)
                    //     .attr('stroke-width', 3)
                    //     .attr("stroke", (d) => _loc.colors[_loc.categories.indexOf(d["classe"])]);
                    // var painel = d3.select('div#' + _loc.id + " .painel");
                    // _loc.data.columns.forEach((el, i) => {
                    //     painel.select('.att' + i).text(d[el]);
                    // });
                    // painel.style("opacity", 1);
                })
                .on("mouseout", function (d) {
                    // d3.select(this)
                    //     .attr('stroke-width', 1)
                    //     .attr("stroke", (d) => _loc.colors[_loc.categories.indexOf(d["classe"])]);
                    // var painel = d3.select('div#' + _loc.id + " .painel");
                    // _loc.data.columns.forEach((el, i) => {
                    //     painel.select('.att' + i).text("");
                    // });
                    // painel.style("opacity", 0);
                })
        }
        
    }
    return ScatterGraf;
});