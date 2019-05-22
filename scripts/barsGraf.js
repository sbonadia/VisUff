define(["d3.v5", "baseGraf"], function (d3, baseGraf) {
    class BarsGraf extends baseGraf {
        constructor(opts) {
            super(opts);
            this.id = opts.id || "id-" + Math.floor(Math.random() * 99999),
            this.w = opts.width;
            this.h = opts.height;
            this.data = opts.data || undefined;
            this.url = opts.url || "data/car.data";
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
            this.data_attA = this.data.columns[0];
            this.data_attB = null;
            this.draw("div.container");
            this.addTable();
            this.updateData();
            var painel = d3.select('div#' + this.id)
                .append('div')
                .attr("class", "controls");
            this.addControl("data_attA", painel, "update");
            //this.addPainelInfo();
            this.addBrush(this.chartGroup);
            this.addZoom(this.chartGroup);
            this.addLegend(this.svg);
        }
        addPainelCtrl() {
            var painel = d3.select('div#' + this.id)
                .append('div')
                .attr("class", "controls");
            this.addControl("data_attA", painel);
        }
        
        addBars(att_arr) {
            var plot = this.chartGroup;
            this.exit(att_arr)
            this.update(att_arr)
            this.enter(att_arr)
            //this.addEvents(plot);


        }

        addZoom(chart){
            var zoom = d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [this.w, this.h]])
                .extent([[0, 0], [this.w, this.h]])
                .on("zoom", zoomed.bind(this));

            this.svg.call(zoom.bind(this));
            
            function zoomed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
                // var t = d3.event.transform;
                // var new_xScale = t.rescaleX(this.scaleX);
                // var new_yScale = t.rescaleY(this.scaleY);
                
                var xAxis = d3.axisBottom(this.scaleX);
                this.scaleX.range([0, this.w].map(d => d3.event.transform.applyX(d)));
                this.scaleX2.range([0, this.scaleX.bandwidth()].map(d => d3.event.transform.applyX(d)));

                this.svg.selectAll(".classe")
                    .attr("transform", d => {
                        //console.log(this.scaleX(d.name));
                        return `translate(${this.scaleX(d.name)},0)`
                    })
                this.svg.selectAll(".classe rect").attr("x", (d) => {
                    return this.scaleX2(d.key);
                }).attr("width", this.scaleX2.bandwidth());
                this.svg.select("._x").attr("transform", "translate ("+this.margin.left+", " + (this.h + this.margin.top)  + ")").call(xAxis);
                }
                 return zoom;
            }
           
        updateAxis() {
            var attA = this.data_attA;
            var _arrA = this.data.map(function (a) {
                return a[attA];
            });
            var _obj = {};
            _arrA.forEach( (d, i) =>  {
                if (!Array.isArray(_obj[d])) _obj[d] = [];
                _obj[d].push(this.data[i]);
            })
            var max = 0;
            for (var prop in _obj) {
                max = Math.max(_obj[prop].length, max)
            }
            this.scaleX = d3.scaleBand().domain(Object.keys(_obj)).range([0, this.w]).padding(0.2);
            this.scaleX2 = d3.scaleBand().domain(this.categories).rangeRound([0, this.scaleX.bandwidth()]).padding(0.05)
            this.scaleY = d3.scaleLinear().domain([0, max]).range([this.h, 0]);

            var xAxis = d3.axisBottom(this.scaleX).tickSizeOuter(0);
            var yAxis = d3.axisLeft().scale(this.scaleY);
            var xAxisGroup = this.svg.select("g._x");
            var yAxisGroup = this.svg.select("g._y");
            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);
        }
        updateData(){
            var att_arr = this.data.map((a, i) => ({ class: a[this.classAttr], attr: a[this.data_attA] }));
            var counts_arr = [];
            att_arr.forEach(function (a, i) {
                if (typeof (counts_arr[a.attr]) != "object") counts_arr[a.attr] = {}
                counts_arr[a.attr].name = a.attr;
                counts_arr[a.attr].total = counts_arr[a.attr].total + 1 || 0;
                counts_arr[a.attr][a.class] = counts_arr[a.attr][a.class] + 1 || 0;
            })
            att_arr = [];
            for (var props in counts_arr) {
                att_arr.push(counts_arr[props])
            }
            //return att_arr;
            this.updateAxis();
            this.addBars(att_arr)
        }
        exit(data){
            var t = d3.transition()
                .duration(1000);
            this.chartGroup.selectAll("g.classe")
                .data(data)
                .exit().style("opacity", 0).remove();
        }
        update(data) {
            var t = d3.transition()
                .duration(1000);
            this.chartGroup.selectAll("g.classe")
                .data(data)
                .attr("transform", d => `translate(${this.scaleX(d.name)},0)`)
                .selectAll("rect")
                .data((d) => {
                    return this.categories.map( (key) => {
                        return ({ key, value: d[key] || 0 })
                    })
                })
                .attr("x", (d, i) => (this.scaleX2(d.key)))
                .attr("y", (d, i) => (this.scaleY(d.value)))
                .attr("height", (d, i) => this.h - this.scaleY(d.value))
                .attr("width", (this.scaleX2.bandwidth()))
                .attr("fill", (d, i) => this.colors[this.categories.indexOf(d.key)])
                .transition(t)
                .style("opacity", 1);
            
        }
        enter(data){
            var t = d3.transition()
                .duration(1000);
            this.chartGroup.selectAll("g.classe")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "classe")
                .attr("transform", d => `translate(${this.scaleX(d.name)},0)`)
                .selectAll("rect")
                .data((d) => {
                    return this.categories.map(function (key) {
                        return ({ key, value: d[key] || 0 })
                    })
                })
                .enter()
                .append('rect')
                .style("opacity", 0)
                .attr("x", (d, i) => (this.scaleX2(d.key)))
                .attr("y", (d, i) => (this.scaleY(d.value)))
                .attr("height", (d, i) => this.h - this.scaleY(d.value))
                .attr("width", (this.scaleX2.bandwidth()))
                .attr("fill", (d, i) => this.colors[this.categories.indexOf(d.key)])
                .transition(t)
                .style("opacity", 1);
        }
        addBrush(chart){
            
            var yScale = this.scaleY;
            var xScale = this.scaleX;
            var xScale2 = this.scaleX2;

            function brushed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
                    var selected = d3.event.selection || xScale.range();
                    var newData = [];
                    xScale.domain().forEach(function(d) {
                        var pos = xScale(d) + xScale.bandwidth() / 2;
                        if (pos > selected[0] && pos < selected[1]) {
                            newData.push(d);
                        }
                    });
                    var rect = this.svg.selectAll(".classe")
                    .attr("class","classe no-brushed")
                    .attr("fill-opacity", 1)
                    .attr('stroke-width', 1)
                    
                    if (newData == []) return
                    rect.filter((d,i) => {  
                        return isBrushed(newData, d, i);
                    }).attr("class","classe brushed")
                    .attr("fill-opacity", .5)
                    .attr('stroke-width', 2)
                    
                //console.log(newData)
            };    
            this.brush = d3.brushX()
                .extent( [ [0,0], [this.w,this.h] ] )
                .on("brush end", brushed.bind(this))
                .on("end", this.populateTable.bind(this))
                
            chart.append("g")
                .attr("class", "brush")
                .call(this.brush)
                //.call(brush.move, this.scaleX.range());
            function isBrushed(coordBrush, gr, key){
                var exist = false;
                coordBrush.forEach((d,i)=>{
                    if(gr.name == d )
                        exist = true;
                })
                return exist;
            }
            function highlight(){
                
            }
            //return brush;
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
                .text(this.categories[0])
            thead.append("th")
                .attr("scope","col")
                .text(this.categories[1])
            thead.append("th")
                .attr("scope","col")
                .text(this.categories[3])
            thead.append("th")
                .attr("scope","col")
                .text(this.categories[2])
            thead.append("th")
                .attr("scope","col")
                .text("TOTAL")
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
            var d_row_filter = [    (n+1) +". "+ d_row.name, 
                                    d_row.unacc, 
                                    d_row.acc, 
                                    d_row.good,
                                    d_row.vgood,
                                    d_row.total
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
       
        
    }
    return BarsGraf;
});