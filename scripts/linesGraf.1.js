define(["d3.v5", "baseGraf"], function (d3, baseGraf) {
    class LinesGraf2 extends baseGraf {
        constructor(opts) {
            super(opts);
            this.id = opts.id || "id-" + Math.floor(Math.random() * 99999),
            this.w = opts.width;
            this.h = opts.height;
            this.data = opts.data || undefined;
            this.url = opts.url || undefined;
            this.margin = opts.margin;
            this.scaleX;
            this.scaleY;
            this.categories = opts.categories || [];
            this.attributes = opts.attributes || [];
            this.classAttr = opts.classAttr || "SystemCodeNumber";
            this.colors = opts.colors;
            this.atualLine = 17;
        }
        addCanvas(tag) {
            var trg = d3.select(tag)
                .append("div")
                .attr("id", this.id)
                .attr("class", "grafico")
                .append("g")
                .attr("class", "wrap")
                .append("svg")
                .attr("width", this.w )
                .attr("height", this.h );
            return trg;
        }
        init() {
            this.svg = this.addCanvas("body");
            this.upDateLinesGraf(this.svg)
        }
        
        upDateLinesGraf(svg) {
            var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");;
            this.data.forEach((e) => {
                e.dateConverted = parseDate(e.LastUpdated);
                e.occTx = e.Occupancy/e.Capacity;
            })

            var margin = {top: 20, right: 200, bottom: 0.3*this.h, left: 40},
            margin2 = {top: 0.8*this.h, right: 200, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

            //var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
            

            var x = d3.scaleTime().range([0, width]),
            x2 = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

            var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

            var brush = this.addBrush(width, height, brushed);
            var zoom = this.addZoom(width, height, zoomed);
            var line = this.addLine_fn(x, y);
            var line2 = this.addLine_fn(x2, y2);

            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0); 


            var Line_chart = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("clip-path", "url(#clip)");


            var focus = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var context = svg.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            var lineData = this.groupByCategory(this.atualLine)
            x.domain(d3.extent(lineData, function(d) { return d.dateConverted; }));
            y.domain([0, d3.max(lineData, function (d) { return d.occTx; })]);
            x2.domain(x.domain());
            y2.domain(y.domain())

            focus.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            Line_chart.append("path")
                .datum(lineData)
                .attr("class", "line")
                .attr("d", line);

            context.append("path")
                .datum(lineData)
                .attr("class", "line")
                .attr("d", line2);


            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());

            svg.append("rect")
                .attr("class", "zoom")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(zoom);

            function brushed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
                var s = d3.event.selection || x2.range();
                x.domain(s.map(x2.invert, x2));
                Line_chart.select(".line").attr("d", line);
                focus.select(".axis--x").call(xAxis);
                svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                    .scale(width / (s[1] - s[0]))
                    .translate(-s[0], 0));
            }
              
            function zoomed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
                var t = d3.event.transform;
                x.domain(t.rescaleX(x2).domain());
                Line_chart.select(".line").attr("d", line);
                focus.select(".axis--x").call(xAxis);
                context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
            }
              
            function type(d) {
                d.Date = parseDate(d.Date);
                d.Air_Temp = +d.Air_Temp;
                return d;
            }
            // this.draw();
            // this.update();
            //this.addLegend(svg)
            //.attr("transform", "translate(" + (width + margin.left + 20) + "," + 0 + ")")
            this.addEvents(svg);
        }
        
        calculateOccupancyTx (data) {
            return data.forEach((e)=> e.occTx = e.Occupancy/e.Capacity )
        }
        
        parseDateFormat (data) {
            var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");;
            return data.forEach((e) => {
                e.dateConverted = parseDate(e.LastUpdated);
            })
        }
        addLines(chart) {
            var t = d3.transition()
                .duration(1000);
            var lineData = {};
            this.data.forEach( (item) => {
                if(!lineData[item.SystemCodeNumber]) lineData[item.SystemCodeNumber] = []
                lineData[item.SystemCodeNumber].push(
                    {
                        occTx: item.occTx,
                        dateConverted: item.dateConverted
                    }
                )
            } )
            var keys = Object.keys(lineData);
            //var lineFunction = this.addLine_fn();
            //this.line_fn = lineFunction;
            var d = keys[this.atualLine];
            chart.select("path").remove();
            //keys.forEach(( d, i ) =>{
                chart.append("path")
                .datum(lineData[d]) // 10. Binds data to the line 
                .attr("class", "line") // Assign a class for styling 
                .attr("fill", "none")
                .attr("stroke", this.colors[this.categories.indexOf(d)])
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1)
                .attr("d", lineFunction ); // 11. Calls the line generator 
            //})
        }
        updateAxis() {
            var _loc = this;
            var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");;
            this.data.forEach((e) => {
                e.dateConverted = parseDate(e.LastUpdated);
                e.occTx = e.Occupancy/e.Capacity;
            })
            var dataXrange = d3.extent(this.data, function(d) { return d.dateConverted; })
            var dataYrange = d3.extent(this.data, function(d) { return d.occTx; })
            this.scaleX =  d3.scaleTime().domain(dataXrange).range([0, this.w]);
            this.scaleY = d3.scaleLinear().domain(dataYrange).range([this.h, 0]);

            var xAxis = d3.axisBottom(this.scaleX).tickSizeOuter(0);
            var yAxis = d3.axisLeft().scale(this.scaleY);
            var xAxisGroup = this.svg.select("g._x");
            var yAxisGroup = this.svg.select("g._y");
            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);
        }
        update() {
            this.updateAxis();
            this.addLines(this.chartGroup)
        }
        addEvents(trg) {
            var _loc = this;
            trg.selectAll('.legend text')
                .on("click", (d, i) => {
                    //console.log(d, i);
                    this.atualLine = i;
                    trg.select("g.wrap").remove();
                    this.upDateLinesGraf(this.svg);
                })
                .on("mouseover", function (d) {
                    
                })
                .on("mouseout", function (d) {
                    
                })
        }

        addBrush(width, height, callback){ 
            //const extent = [[this.margin.left, this.margin.top], [this.w - this.margin.right, this.h - this.margin.top]];
            const extent = [[0, 0], [width, height]];
            var brush = d3.brushX()
                .extent(extent)
                .on("brush end", callback);
            return brush;
        }
        addZoom(width, height, callback){
            //const extent = [[this.margin.left, this.margin.top], [this.w - this.margin.right, this.h - this.margin.top]];
            
            
            const extent = [[0, 0], [width, height]];
            var zoom = d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", callback);
            return zoom;
        }
        addLine_fn(dx,dy){
            var line = d3.line()
                .x(  (d) => { return dx(d.dateConverted); })
                .y(  (d) => { return dy(d.occTx); });
            return line;
        }
        groupByCategory( key ){
            var lineData = {};
            this.data.forEach( (item) => {
                var classCol = item[this.classAttr];
                if(!lineData[classCol]) lineData[classCol] = []
                lineData[classCol].push(
                    {
                        occTx: item.occTx,
                        dateConverted: item.dateConverted
                    }
                )
            } )
            var keys = Object.keys(lineData);
            var selection = keys[key];
            return lineData[selection];
        }
    }
    return LinesGraf2;
});