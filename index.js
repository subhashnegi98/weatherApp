const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace('{%temp%}', Math.round(orgVal.main.temp-273.15));
    temperature = temperature.replace('{%tempmin%}', Math.round(orgVal.main.temp_min-273.15));
    temperature = temperature.replace('{%tempmax%}', Math.round(orgVal.main.temp_max-273.15));
    temperature = temperature.replace('{%location%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    temperature = temperature.replace('{%tempStatus%}', orgVal.weather[0].main);
    return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid=bf7aedbfeb4371011a0547970488c4f6')
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
                    .on('end', (err) => {
                        if (err) return console.log('connection closed due to errors', err);
                         res.end();
                    });
            }
})

server.listen(8000, () => {
    console.log('server is starting');
})