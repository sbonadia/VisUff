'use strict'
require.config({
    baseURL:"scripts",
    // paths: {
    //     d3: 'd3.v5',
    //     VisUff: 'scripts/VisUff'

    // }
});
var VisUFF;
var grafTimeSeries;
requirejs(["d3.v5", "scatterGraf","barsGraf","linesGraf","linesGraf.1"], function(d3, scatterGraf, barsGraf, linesGraf, linesGraf_zoom ) {
    
    //VisUFF = VisUff;
    function Main(){
        var fileName = "";
        var objGraf = {};

        var inputDiv = document.createElement("div");
        var inputElement = document.createElement("input");
        inputElement.setAttribute("type","file");
        inputElement.setAttribute("name","name");

        var selectDiv = document.createElement("div");
        var selectElement = document.createElement("select");
        selectElement.setAttribute("id","selectGraf");

        var infoDiv = document.createElement("div");
        infoDiv.setAttribute("id","info");
        
        var option = document.createElement("option");
        option.text = "-- selecione --";
        option.value = undefined;
        selectElement.appendChild(option)
        var opts = [
                {name:"ScatterPlot",class:"scatterGraf"},
                {name:"Bars",class:"barsGraf"},
                {name:"Linhas",class:"linesGraf"},
                {name:"Linhas com Zoom",class:"linesGraf_zoom"}
            ];
        opts.forEach((el, i) => {
            var option = document.createElement("option");
            option.text = el.name;
            option.value = el.class;
            selectElement.appendChild(option);
        })
        var btn = document.createElement("button");
        btn.textContent = "iniciar";
       
        function handleFiles(event) {
            var fileList = this.files;
            var infos = document.getElementById("info");
            var txt = "";
            for(var props in fileList[0]){
                if(props=="name" || props =="size" )
                txt += `<b>${ props }</b> : ${ fileList[0][props] }<br/>`
            }
            fileName = fileList[0].name;
            infos.innerHTML = txt;
        }
        function handleGraf(event) {
            //console.log(eval(this.options[this.selectedIndex].value));
            objGraf = eval(this.options[this.selectedIndex].value);
        }
        function loadGraf(event) {
            //console.log(event, this);
            //grafClass = this.value;
            if(document.getElementsByClassName("grafico")[0])
                document.getElementsByClassName("grafico")[0].remove();
            grafTimeSeries = new objGraf({
                width: 850,
                height: 400,
                margin: { left:40, right:180, top:40, bottom:40 },
                //url: "data/iris.data",
                url: "data/"+fileName,
                //url: "data/processed.cleveland.data",
            });
            grafTimeSeries.loadData("drawLinesGraf");
        }
        inputElement.addEventListener("change", handleFiles, false);
        selectElement.addEventListener("change", handleGraf, false);
        btn.addEventListener("click", loadGraf, false);

        
        inputDiv.appendChild(inputElement);
        selectDiv.appendChild(selectElement);
        document.body.appendChild(selectDiv);
        document.body.appendChild(inputDiv);
        document.body.appendChild(infoDiv);
        document.body.appendChild(btn);
        //<input id="file-input" type="file" name="name"  />
        /** / 
        grafTimeSeries = new linesGraf({
            width: 850,
            height: 400,
            margin: { left:40, right:180, top:40, bottom:40 },
            classAttr: "SystemCodeNumber",
            //url: "data/iris.data",
            url: "data/parking.csv",
            //url: "data/processed.cleveland.data",
        });
        grafTimeSeries.loadData("drawLinesGraf");
        /**/
             
       
       /** /
        var grafScatter = new scatterGraf({
            width: 300,
            height: 200,
            margin: { left:40, right:180, top:40, bottom:40 },
            colors: [ "#089123" ,"#910808" ,"#083a91" ],
            url: "data/iris.data",
            //url: "data/car.data",
            //url: "data/processed.cleveland.data",
        }); 
        grafScatter.loadData("drawScatterPlot");
        /**/
        /** / 
        var grafBar = new barsGraf({
            width: 550,
            height: 250,
            margin: { left:40, right:180, top:40, bottom:40 },
            url: "data/car.data",
            //url: "data/processed.cleveland.data",
        });
        grafBar.loadData("drawBarsGraf");
        /* */
    }
    Main();
    window.d3 = d3;
    // window.scatterGraf  = scatterGraf ;
    // window.barsGraf     = barsGraf ;
    // window.linesGraf    = linesGraf;
    // //window.grafTimeSeries = grafTimeSeries;
});