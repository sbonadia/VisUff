define(["d3.v5", "baseGraf"], function (d3, baseGraf) {
    class LinesGraf extends baseGraf {
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
            this.colors = opts.colors;
            this.atualLine = 0;
            this.classAttr = opts.classAttr || "SystemCodeNumber";
        }

        init(data) {
            //this.calculateOccupancyTx (data);
            //this.parseDateFormat (data);
            this.data_attA = this.data.columns[0];
            this.data_attB = null;
                
            this.draw("div.container");
            this.update();
            this.addLegend(this.svg);
            this.addEvents(this.svg);
            this.zoom(this.svg);
        }
        
        calculateOccupancyTx (data) {
            data.forEach((e)=> e.occTx = e.Occupancy/e.Capacity )
        }
        
        parseDateFormat (data) {
            var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");;
            data.forEach((e) => {
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
            var lineFunction = d3.line()
                    .x( (d) => this.scaleX(d.dateConverted) )
                    .y( (d) => this.scaleY(d.occTx) )
                    .curve(d3.curveMonotoneX)
            this.line_fn = lineFunction;
            var d = keys[this.atualLine];
            chart.select("path").remove();
            //keys.forEach(( d, i ) =>{
                chart.append("path")
                .datum(lineData[d]) // 10. Binds data to the line 
                .attr("class", "lines") // Assign a class for styling 
                .attr("fill", "none")
                .attr("stroke", this.colors[this.categories.indexOf(d)])
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", this.line_fn ); // 11. Calls the line generator 
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
        zoom(svg) {
            const extent = [[this.margin.left, this.margin.top], [this.w - this.margin.right, this.h - this.margin.top]];
            
            svg.call(d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", zoomed.bind(this)));
            
            function zoomed() {
              //              
              // TO DO
            }
          }
        addEvents(trg) {
            var _loc = this;
            trg.selectAll('.legend text')
                .on("click", (d, i) => {
                    console.log(d, i);
                    this.atualLine = i;
                    this.update();
                })
                .on("mouseover", function (d) {
                    
                })
                .on("mouseout", function (d) {
                    
                })
        }
       
        
    }
    return LinesGraf;
});