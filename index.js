//const d3  = require("d3");
const url   = require("url");
const http  = require('http');
const cities = require('cities');
const app   = http.createServer((req, res)=>{
    var city, query;
    query = url.parse(req.url, true).query;
    if(query.zipCode) city = cities.zip_lookup(query.zipCode).city;
    else city = "city not found"
    res.writeHead( 200, {"Content-Type":"text/html"} );
    res.write(`<h1>The city you are in is ${city}</h1>`);
    res.end();
})
app.listen(8000,()=>{
    console.log("Exemplo de app com listening para porta 8000!!!");
})