define(["d3.v5", "baseGraf"], function (d3, baseGraf) {
    class LinesGraf2 extends baseGraf {
        constructor(opts) {
            super(opts);
            this.id = opts.id || "id-" + Math.floor(Math.random() * 99999),
            this.w = opts.width;
            this.h = opts.height;
            this.data = opts.data || undefined;
            this.url = opts.url || "data/parking.csv";  
            this.margin = opts.margin;
            this.scaleX;
            this.scaleY;
            this.categories = opts.categories || [];
            this.attributes = opts.attributes || [];
            this.classAttr = opts.classAttr || "SystemCodeNumber";
            this.colors = opts.colors;
            this.atualLine = 17;
        }
       
        init() {
            this.svg = this.addCanvas("div.container");
            this.upDateLinesGraf(this.svg)
            
        }
        
        upDateLinesGraf(svg) {
            var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");;
            this.data.forEach((e) => {
                e.dateConverted = parseDate(e.LastUpdated);
                e.occTx = e.Occupancy/e.Capacity;
            })

            var margin = {top: 30, right: 30, bottom: 30, left: 30},
            margin2 = {top: this.h, right:30, bottom: 30, left:30},
            width = this.w,
            height = this.h - margin.bottom - margin.top,
            height2 = this.h/4;

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
                .attr("y", 0)
                //.attr("transform", "translate(" + this.margin.left + " " + this.margin.top + ")"); 
                

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
                context.select(".brush").attr("height",100)
            }
              
                    
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