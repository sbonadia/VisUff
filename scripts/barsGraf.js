define(["d3.v5", "baseGraf"], function (d3, baseGraf) {
    class BarsGraf extends baseGraf {
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
            this.data_attA = this.data.columns[0];
            this.data_attB = null;
            this.draw();
            this.update();
            var painel = d3.select('div#' + this.id)
                .append('div')
                .attr("class", "controls");
            this.addControl("data_attA", painel, "update");
            //this.addPainelInfo();
            this.addLegend(this.svg);
        }
        addPainelCtrl() {
            var painel = d3.select('div#' + this.id)
                .append('div')
                .attr("class", "controls");
            this.addControl("data_attA", painel);
        }
        
        addBars() {
            var t = d3.transition()
                .duration(1000);
            var _loc = this;
            var plot = this.chartGroup;
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

            plot.selectAll("g.attr")
                .data(att_arr)
                .exit().style("opacity", 0).remove();

            plot.selectAll("g.attr")
                .data(att_arr)
                .attr("transform", d => `translate(${this.scaleX(d.name)},0)`)
                .selectAll("rect")
                .data(function (d) {
                    return _loc.categories.map(function (key) {
                        return ({ key, value: d[key] || 0 })
                    })
                })
                .attr("x", (d, i) => (this.scaleX2(d.key)))
                .attr("y", (d, i) => (this.scaleY(d.value)))
                .attr("height", (d, i) => this.h - this.scaleY(d.value))
                .attr("width", (this.scaleX2.bandwidth()))
                .attr("fill", (d, i) => _loc.colors[_loc.categories.indexOf(d.key)])
                .transition(t)
                .style("opacity", 1);

            plot.selectAll("g.attr")
                .data(att_arr)
                .enter()
                .append("g")
                .attr("class", "attr")
                .attr("transform", d => `translate(${this.scaleX(d.name)},0)`)
                .selectAll("rect")
                .data(function (d) {
                    return _loc.categories.map(function (key) {
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
                .attr("fill", (d, i) => _loc.colors[_loc.categories.indexOf(d.key)])
                .transition(t)
                .style("opacity", 1);

            //this.addEvents(plot);


        }
        updateAxis() {
            var _loc = this;
            var attA = this.data_attA;
            var _arrA = this.data.map(function (a) {
                return a[attA];
            });
            var _obj = {};
            _arrA.forEach(function (d, i) {
                if (!Array.isArray(_obj[d])) _obj[d] = [];
                _obj[d].push(_loc.data[i]);
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
        update() {
            this.updateAxis();
            this.addBars()
        }
       
        
    }
    return BarsGraf;
});