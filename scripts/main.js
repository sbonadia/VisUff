'use strict'
require.config({
    baseURL:"scripts",
    // paths: {
    //     d3: 'd3.v5',
    //     VisUff: 'scripts/VisUff'

    // }
});
var VisUFF;
var graf;
requirejs(["d3.v5", "scatterGraf","barsGraf","linesGraf","linesGraf.1"], function( d3, scatterGraf, barsGraf, linesGraf, linesGraf_zoom ) {
    
    //VisUFF = VisUff;
    function Main(){
        var fileName = "";
        var objGraf = {};
        var container = document.getElementsByClassName("container")[0];
        var painel = document.createElement("div");
        painel.setAttribute("id","painel");
        painel.setAttribute("class","form-group");

        // var inputDiv = document.createElement("div");
        // var inputElement = document.createElement("input");
        // inputElement.setAttribute("type","file");
        // inputElement.setAttribute("name","name");
        // var infoDiv = document.createElement("p");
        // infoDiv.setAttribute("id","info"); 

        var selectDiv = document.createElement("div");
        selectDiv.setAttribute("class","form-group row");
        //var divSelectElement = document.createElement("div");
        //divSelectElement.setAttribute("class","col-sm-8");

        var selectElement = document.createElement("select");
        selectElement.setAttribute("id","selectGraf");
        selectElement.setAttribute("required","");
        //selectElement.setAttribute("class","form-control ");
        var labelElement = document.createElement("label");
        labelElement.innerHTML = "Tipo de gráfico: ";
        labelElement.setAttribute("for","selectGraf");
        labelElement.setAttribute("class","col-sm-2 col-form-label");
        selectDiv.appendChild(labelElement);
        //divSelectElement.appendChild(selectElement);
        selectDiv.appendChild(selectElement);

        var option = document.createElement("option");
        option.text = "-- selecione --";
        option.value = undefined;
        selectElement.appendChild(option);

        var opts = [
                {name:"ScatterPlot",class:"scatterGraf"},
                {name:"Bars",class:"barsGraf"},
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
       
        /*function handleFiles(event) {
            var fileList = this.files;
            var infos = document.getElementById("info");
            var txt = "";
            for(var props in fileList[0]){
                if(props=="name" || props =="size" )
                txt += `<b>${ props }</b> : ${ fileList[0][props] }<br/>`
            }
            fileName = fileList[0].name;
            //infos.innerHTML = txt;
        }*/
        function handleGraf(event) {
            objGraf = eval(this.options[this.selectedIndex].value);
        }
        function loadGraf(event) {
            if(document.getElementsByClassName("grafico")[0])
                document.getElementsByClassName("grafico")[0].remove();

            var w = document.getElementById("width").value*1;
            var h = document.getElementById("height").value*1;

            graf = new objGraf({
                width: w,
                height: h,
                margin: { left:60, right:180, top:60, bottom:60 },
                //url: "data/iris.data",
                //url: "data/"+fileName,
            });
            graf.loadData("drawLinesGraf");
        }
        //inputElement.addEventListener("change", handleFiles, false);
        selectElement.addEventListener("change", handleGraf, false);
        btn.addEventListener("click", loadGraf, false);

        //inputDiv.innerHTML = "Carregar arquivo:<br/> ";
        //inputDiv.appendChild(inputElement);

        //inputDiv.appendChild(inputElement);
        
        
        painel.appendChild(selectDiv);

        var inputDiv;
        inputDiv = document.createElement("div");
        inputDiv.setAttribute("class","form-group row");
        var labelInput = document.createElement("label");
        labelInput.innerHTML = "Largura:";
        labelInput.setAttribute("for","selectGraf");
        labelInput.setAttribute("class","col-sm-2 col-form-label");
        var inputElement = document.createElement("input");
        //inputElement.setAttribute("class","form-control ");
        inputElement.setAttribute("type","number");
        inputElement.setAttribute("id","width");
        inputElement.setAttribute("value",400);
        inputDiv.appendChild(labelInput);
        inputDiv.appendChild(inputElement);
        painel.appendChild(inputDiv)

        var inputDiv;
        inputDiv = document.createElement("div");
        inputDiv.setAttribute("class","form-group row");
        var labelInput = document.createElement("label");
        labelInput.innerHTML = "Altura:";
        labelInput.setAttribute("for","selectGraf");
        labelInput.setAttribute("class","col-sm-2 col-form-label");
        var inputElement = document.createElement("input");
        //inputElement.setAttribute("class","form-control ");
        inputElement.setAttribute("type","number");
        inputElement.setAttribute("id","height");
        inputElement.setAttribute("value",300);
        inputDiv.appendChild(labelInput);
        inputDiv.appendChild(inputElement);
        painel.appendChild(inputDiv)
        
        //document.body.appendChild(infoDiv);

        painel.appendChild(btn);
        container.appendChild(painel);
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
        grafTimeSeries.loadData();
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
        grafScatter.loadData();
        /**/
        /** / 
        var grafBar = new barsGraf({
            width: 550,
            height: 250,
            margin: { left:40, right:180, top:40, bottom:40 },
            url: "data/car.data",
            //url: "data/processed.cleveland.data",
        });
        grafBar.loadData();
        /* */
    }
    Main();
    window.d3 = d3;
    // window.scatterGraf  = scatterGraf ;
    // window.barsGraf     = barsGraf ;
    // window.linesGraf    = linesGraf;
    // //window.grafTimeSeries = grafTimeSeries;
});