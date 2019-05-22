define(["d3.v5"], function (d3) {
    class baseGraf {
        constructor(opts) {
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
            this.classes = opts.classes || [];
            this.classAttr = opts.classAttr || "classe";
            this.colors = opts.colors;
            this.data_attA = 0;
            this.data_attB = 0;
            this.svg = undefined;
            this.chartGroup = undefined;
        }

        loadData(callback) {
            d3.csv(this.url).then(
                function (data) {
                    this.data = data;       
                    this.attributes = data.columns.filter((d) => d != this.classAttr); // array com os exemplos separados pelos atributos que não são classe
                    this.classes = data.map((d) => d[this.classAttr]); // Array com os exemplos separados pelo atributo classe
                    this.categories = this.classes.filter((d, i, _arr) => _arr.indexOf(d) === i); // array de classes extraídas do dataset
                    var fn = this.generateColor(this.categories.length);
                    this.colors = this.categories.map((p,i)=>fn(i))
                    this.init(data); // chamada da função passada pela na criação da instância
                }.bind(this))

        }
        draw(trg = "body") {
            this.svg = this.addCanvas(trg);
            this.svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", this.w)
                .attr("height", this.h)
                //.attr("transform", "translate(" + this.margin.left + " " + this.margin.top + ")")
            this.chartGroup = this.addChartGroup(this.svg);
            this.addAxis(this.svg);
            return this.svg;
        }
        addCanvas(tag) {
            var trg = d3.select(tag)
                .append("div")
                .attr("id", this.id)
                .attr("class", "grafico")
                .append("svg")
                .attr("width", this.w + this.margin.left + this.margin.right)
                .attr("height", this.h + this.margin.top + this.margin.bottom);
            return trg;
        }
        addChartGroup(svg) {
            var g = svg.append("g")
                .attr("class", "graf")
                .attr("clip-path", "url(#clip)")
                .attr("transform", "translate(" + this.margin.left + " " + this.margin.top + ")")
                .attr("width", this.w - this.margin.left - this.margin.right)
                .attr("height", this.h - this.margin.top - this.margin.bottom);
            return g;
        }
        addAxis(svg) {
            svg.append("g")
                .attr("class", "_x")
                .attr("transform", "translate(" + this.margin.left + " " + (this.margin.top + this.h) + ")")
                //.append("text")
                // .attr("transform", "translate(" + 0 + " " + 0 + ")")
                // .text("");
            svg.append("g")
                .attr("class", "_y")
                .attr("transform", "translate(" + this.margin.top + " " + this.margin.left + ")")   
                // .append("text")
                // .attr("transform", "rotate(-90) translate(" + 0 + " " + 0 + ")")
                // .text("");
        }
        updateAxis(svg) {
            var data_attA = this.data_attA;
            var data_attB = this.data_attB;

            var dataXrange = d3.extent(this.data, function(d) { return d[data_attA] * 1; })
            var dataYrange = d3.extent(this.data, function(d) { return d[data_attB] * 1; })

            this.scaleX = d3.scaleLinear().domain(dataXrange).range([0, this.w]);
            this.scaleY = d3.scaleLinear().domain(dataYrange).range([this.h, 0]);

            var xAxis = d3.axisBottom(this.scaleX);
            var yAxis = d3.axisLeft(this.scaleY);

            var xAxisGroup = svg.select("g._x");
            var yAxisGroup = svg.select("g._y");
            
            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);
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
        addControl(crtl, target) {
            var select = target.append('p')
            select.append("label").text(crtl == "data_attA" ? "Eixo X: " : "Eixo Y: ");
            select.append('select')
                .attr('class', crtl)
                .on('change', () => {
                    var selectValue = d3.select('div#' + this.id + ' select.' + crtl).property('value');
                    this[crtl] = selectValue;
                    this.updateData();
                }).selectAll('option')
                .data(this.attributes).enter()
                .append('option')
                .text((d) => d);
            return select;
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
        generateColor(n) {
            var color = d3.scaleLinear().domain([1,n])
                .interpolate(d3.interpolateHcl)
                .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
                return color;
        }
        addLegend(svg) {
            var legend = svg
                .append('g')
                .attr("class", "legend")
                .attr("transform", "translate(" + 
                    (this.w + this.margin.right - 100) + "," + 
                    (this.h + this.margin.bottom - (this.categories.length-1) * 12) + ")")
            for (var i = 0; i < this.categories.length; i++) {
                legend.append('rect')
                    .attr("y", i*12)
                    .attr("height", 8)
                    .attr("width", 8)
                    .attr("style", "fill:" + this.colors[i]);

                legend.append('text').text(this.categories[i])
                    .attr("x", 15)
                    .attr("y", i* 12 + 7)
                    .style("font", "10px verdana");
            }
            return legend;
        }
    }
    return baseGraf;
});