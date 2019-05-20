define(["d3.v5"], function (d3) {
    class VisUff {
        constructor(opts) {
            const _loc = this;
            this.id = opts.id || "id-" + Math.floor(Math.random() * 99999),
                this.w = opts.width;
            this.h = opts.height;
            this.data = opts.data || undefined;
            this.url = opts.url || undefined;
            this.margin = opts.margin;
            this.scaleX;
            this.scaleX2;
            this.scaleY;
            this.svg;
            this.categories = opts.categories || [];
            this.attributes = opts.attributes || [];
            this.classes = opts.classes || [];
            this.colors = opts.colors;
            this.group_graf;

            this.attA = 0;
            this.attB = 0;
        }

        loadData(callback) {
            var _loc = this;
            d3.csv(this.url).then(
                function (data) {
                    _loc.data = data;
                    _loc.attributes = data.columns.filter((d) => d != "classe"); // array com os exemplos separados pelos atributos que não são classe
                    _loc.classes = data.map((d) => d.classe); // Array com os exemplos separados pelo atributo classe
                    _loc.categories = _loc.classes.filter((d, i, _arr) => _arr.indexOf(d) === i); // array de classes extraídas do dataset
                    _loc[callback](data); // chamada da função passada pela na criação da instância
                })

        }
        draw(trg = "body") {
            this.svg = this.addCanvas(trg);
            this.addAxis();
            this.group_graf = this.addChartGroup();

        }
        drawScatterPlot() {
            this.attA = this.data.columns[0];
            this.attB = this.data.columns[0];
            this.draw();
            this.updateScatterPlot();
            this.addPainelCtrl();
            this.addPainelInfo();
            this.addLegend();
        }
        drawBarsPlot() {
            this.attA = this.data.columns[0];
            this.attB = null;
            this.draw();
            this.updateBarsPlot();
            var painel = d3.select('div#' + this.id)
                .append('div')
                .attr("class", "controls");
            this.addControls("attA", painel, "updateBarsPlot");
            this.addPainelInfo();
            this.addLegend();
        }
        drawHistoGram(){
            this.attA = this.data;
            this.attB = null;
            this.draw('div#' + this.id);
            this.updateHistogram();
            var painel = d3.select('div#' + this.id)
                .append('div')
                .attr("class", "controls");
            // this.addControls("attA", painel, "updateBarsPlot");
            // this.addPainelInfo();
            // this.addLegend();
            console.log(this.attA)
        }
        addCanvas(tag) {
            /**
             * @param {string} tag - Elemento do DOM que receberá o Canvas
             */
            var svg = d3.select(tag)
                .append("div")
                .attr("id", this.id)
                .attr("class", "grafico")
                .append("svg")
                .attr("width", this.w + this.margin.left + this.margin.right)
                .attr("height", this.h + this.margin.top + this.margin.bottom);
            return svg;
        }
        addChartGroup() {
            var g = this.svg.append("g")
                .attr("class", "graf")
                .attr("transform", "translate(" + this.margin.left + " " + this.margin.top + ")")
                .attr("width", this.w - this.margin.left - this.margin.right)
                .attr("height", this.h - this.margin.top - this.margin.bottom);
            return g;
        }
        addAxis() {
            this.svg.append("g")
                .attr("class", "_x")
                .attr("transform", "translate(" + this.margin.left + " " + (this.margin.top + this.h) + ")")
            this.svg.append("g")
                .attr("class", "_y")
                .attr("transform", "translate(" + this.margin.top + " " + this.margin.left + ")")
        }
        updateBarsAxis() {
            var _loc = this;
            var attA = this.attA;
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
        updateAxis() {
            var attA = this.attA;
            var attB = this.attB;
            var _arrA = this.data.map(function (a) {
                return a[attA] * 1;
            });
            var _arrB = this.data.map(function (a) {
                return a[attB] * 1;
            });
            var boundary = {
                min: [d3.min(_arrA), d3.min(_arrB)],
                max: [d3.max(_arrA), d3.max(_arrB)]
            }
            //console.log( this.boundary );
            this.scaleX = d3.scaleLinear().domain([boundary.min[0], boundary.max[0]]).range([0, this.w]);
            this.scaleY = d3.scaleLinear().domain([boundary.min[1], boundary.max[1]]).range([this.h, 0]);

            var xAxis = d3.axisBottom().scale(this.scaleX);
            var yAxis = d3.axisLeft().scale(this.scaleY);
            var xAxisGroup = this.svg.select("g._x");
            var yAxisGroup = this.svg.select("g._y");
            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);
        }
        updateScatterPlot() {
            this.updateAxis();
            this.addCircles()
        }
        updateBarsPlot() {
            this.updateBarsAxis();
            this.addBars()
        }
        updateHistogram() {
            this.updateBarsAxis();
            this.addBars()
        }
        addPainelCtrl() {
            var painel = d3.select('div#' + this.id)
                .append('div')
                .attr("class", "controls");
            this.addControls("attA", painel, "updateScatterPlot");
            this.addControls("attB", painel, "updateScatterPlot");
        }
        addControls(crtl, target, type) {
            var _loc = this;
            var select = target.append('p')
            select.append("label").text(crtl == "attA" ? "Eixo X: " : "Eixo Y: ");
            select.append('select')
                .attr('class', crtl)
                .on('change', () => {
                    var selectValue = d3.select('div#' + this.id + ' select.' + crtl).property('value');
                    _loc[crtl] = selectValue;
                    _loc[type]();
                }).selectAll('option')
                .data(this.attributes).enter()
                .append('option')
                .text((d) => d);
            return select;
        }
        addPainelInfo() {
            var t = d3.transition()
                .duration(1000);
            var painel = d3.select('div#' + this.id)
                .append('div')
                .style("opacity", 0)
                .attr('class', 'painel');
            painel.append('h3')
                .text('Informações:');

            this.attributes.forEach((el, i) => {
                painel.append('p')
                    .text(el + ": ")
                    .append('span')
                    .attr('class', 'att' + i)
            });
        }
        addCircles() {
            var t = d3.transition()
                .duration(1000);
            var _loc = this;
            var plot = this.group_graf;
            plot.selectAll("circle")
                .data(this.data)
                .transition(t)
                .attr("cx", (d) => this.scaleX(d[this.attA]))
                .attr("cy", (d) => this.scaleY(d[this.attB]))
                .attr("r", (i) => 5)
                .attr("fill", (d) => this.colors[this.categories.indexOf(d.classe)])
                .attr("fill-opacity", ".5")
                .attr('stroke-width', 1)
                .attr("stroke", (d) => this.colors[this.categories.indexOf(d.classe)])
            //.attr("class",(d) => "l" + d[this.classAttr])

            plot.selectAll("circle")
                .data(this.data)
                .enter()
                .append("circle")
                .style("opacity", 0)
                .attr("cx", (d) => this.scaleX(d[this.attA]))
                .attr("cy", (d) => this.scaleY(d[this.attB]))
                .attr("r", (i) => 5)
                .attr("fill", (d) => this.colors[this.categories.indexOf(d.classe)])
                .attr("fill-opacity", ".5")
                .attr('stroke-width', 1)
                .attr("stroke", (d) => this.colors[this.categories.indexOf(d.classe)])
                //.attr("class",(d) => "l" + d[this.classAttr])
                .transition(t)
                .style("opacity", 1);
            this.addEvents(plot);
        }
        groupByAttr(_array) {
            var _loc = this;
            var _obj = {};
            _array.forEach(function (d, i) {
                if (!Array.isArray(_obj[d])) _obj[d] = [];
                _obj[d].push(_loc.data[i]);
            })
            console.log(_obj);
            return _obj;
        }
        countByAttr(arr, attr) {
            var counts_obj = {};
            arr.forEach(function (a, i) {
                counts_obj[a[attr]] = counts_obj[a[attr]] + 1 || 0;
                //return Ac;
            })
            return counts_obj;
        }
        Obj2Arr(obj) {
            return Object.keys(obj).map(function (d) {
                return obj[d];
            })
        }
        addBars() {
            var t = d3.transition()
                .duration(1000);
            var _loc = this;
            var plot = this.group_graf;
            var att_arr = this.data.map((a, i) => ({ class: a["classe"], attr: a[this.attA] }));
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
        addLegend() {
            var legend = this.svg
                .append('g')
                .attr("class", "legend")
            for (var i = 0; i < this.categories.length; i++) {
                legend.append('rect')
                    .attr("x", this.w + this.margin.right - 95)
                    .attr("y", this.h + i * 20 - 20)
                    .attr("height", 10)
                    .attr("width", 10)
                    .attr("style", "fill:" + this.colors[i]);

                legend.append('text').text(this.categories[i])
                    .attr("x", this.w + this.margin.right - 80)
                    .attr("y", this.h + i * 20 - 10)
                    ;
            }
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
        UserException(message) {
            this.message = message;
            this.name = "UserException";
        }
    }
    return VisUff;
});