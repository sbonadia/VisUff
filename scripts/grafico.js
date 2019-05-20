var d3
class Graf {
    constructor(opts){
        this.w = opts.width;
        this.h = opts.height;
        this.data = opts.data;
        this.margin = opts.margin;
        this.scaleX;
        this.scaleY;
        //this.attributes = opts.attr;
        this.draw({x:0, y:3});
    }
    draw(a){
        var g = this.addCanvas(a);
        return g;
        //this.addCircles(g)
    }
    update(a) {
        var g = d3.select("g.circles")
        this.addScales( a );
        this.updCircles( g, a )
    }
    addScales( canvas ){
        // var scaleX = canvas.scaleLinear([this.min,this.max].range([0, this.w]));
        // var scaleY = canvas.scaleLinear([this.min,this.max].range([ this.h, 0]));
    }
    addCircles( g, a ) {
        g.selectAll("circle")
        .data( this.data )
        .enter()
        .append("circle")
        .attr("cx", (d) => this.scaleX(d[a.x]))
        .attr("cy", (d) => this.scaleY(d[a.y]))
        .attr("r", (i) => 3)
        .attr("class",(d) => d[4])
    }
    updCircles( g, a ) {
        g.selectAll("circle")
        .data( this.data )
        .transition(300)
        .delay((d,i) => i*2)
        .attr("cx", (d) => this.scaleX(d[a.x]))
        .attr("cy", (d) => this.scaleY(d[a.y]))
        .attr("r", (i) => 3)
        .attr("class",(d) => d[4])
    }
    // getMax(data, n){
    //     return  Math.max.apply(Math, this.data.map(function(v) {
    //         return v[n];
    //     }));
    // }
    // getMin(data, n){
    //     return  Math.min.apply(Math, this.data.map(function(v) {
    //         return v[n];
    //     }));        
    // }
    addScales( att ) {
        
        var at1 = d3.extent(this.data.map(function(a){
            return a[att.x];
        }));
        var at2 = d3.extent(this.data.map(function(a){
            return a[att.y];
        }));
        var minX = Math.min(...at1);
        var maxX = Math.max(...at1);
        var minY = Math.min(...at2);
        var maxY = Math.max(...at2);
        
        this.scaleX = d3.scaleLinear().domain([minX, maxX]).range([ 0, this.w ]);
        this.scaleY = d3.scaleLinear().domain([minY,maxY]).range([ this.h, 0  ]);

        var xAxis = d3.axisBottom().scale(this.scaleX);
        var yAxis = d3.axisLeft().scale(this.scaleY);
        d3.select("svg").select("g._x").call(xAxis)
        .attr("transform","translate(" + this.margin.left + " " + (this.margin.top + this.h) +")")

        d3.select("svg").select("g._y").call(yAxis)
        .attr("transform","translate(" + this.margin.top+ " " + this.margin.left +")")
    }
    appendGroup( svg ) {
        var g = svg.append("g")
        .attr("class","circles")
        .attr("transform","translate(" + this.margin.top+ " " + this.margin.left +")")
        .attr("width",  this.w - this.margin.left - this.margin.right )
        .attr("height", this.h - this.margin.top - this.margin.bottom );
        return g;
    }
    addCanvas( a ){
        var svg = d3.select("body").append("svg")
        .attr("width",  this.w + this.margin.left + this.margin.right )
        .attr("height", this.h + this.margin.top + this.margin.bottom );
        this.addScales( a );
        
        var xAxis = d3.axisBottom().scale(this.scaleX);
        var yAxis = d3.axisLeft().scale(this.scaleY);
        svg.append("g").attr("class","_x").call(xAxis)
        .attr("transform","translate(" + this.margin.left + " " + (this.margin.top + this.h) +")")
        svg.append("g").attr("class","_y").call(yAxis)
        .attr("transform","translate(" + this.margin.top+ " " + this.margin.left +")")
        
        var g = this.appendGroup ( svg );
        this.addCircles(g , a)
        return g;
    }
}
requirejs(["d3.v5"], function(util) {
    d3 = util;
    
    async function loadDataFile(url, cb) {
        const response = await fetch(url);
        const content = { content: await response.text(), type:"csv" };
        //const json = { content: await response.json(), type:"json" };
        cb( content );
    }
    function Main(){
        var getDataURL = "data/iris.data"; //"data/iris.json";
        loadDataFile( getDataURL, function(c) {
            var data;
            if(c.type == "csv") {
                data = c.content.trim().split("\n");
                data = data.map((a) => {
                    return a.split(",");
                });
            } else if("json") {
                data = c.map((a)=> {
                    return [ a.sepalLength, a.sepalWidth, a.petalLength, a.petalWidth, a.species ]
                })
            }
            
            //console.log(data);
            graf = new Graf({
                width: 250,
                height: 250,
                margin: { left:40, right:40, top:40, bottom:40 },
                //attr: [ 0,1,2,3 ],
                data: data
            });
        });
    
    }
    Main();
});