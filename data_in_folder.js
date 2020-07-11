let request =require("request");
let fs=require("fs");
let cheerio = require("cheerio");
let path= require("path");
const { kMaxLength } = require("buffer");

request("https://www.worldometers.info/",dataReciver);

function dataReciver(err,res,html){
    if(err ==null && res.statusCode ==200){
        parsefile(html);
    }else if(res.statusCode ==404){
        console.log("Error 404 :page not foung");
    }else{
        console.log(err);
        console.log(res);
    }
}
function parsefile(html){
    let $ =cheerio.load(html);
    let a = $(".linkunderline a").attr("href");
    let fullLink="https://www.worldometers.info"+a;
  // console.log(fullLink);
  request(fullLink,coronaPagehandler);
}
function coronaPagehandler(err,res,html){
    if(err ==null && res.statusCode ==200){
        parsecountries(html);
        //console.log(html)
    }else if(res.statusCode ==404){
        console.log("Page not found");
    }else{
        console.log(err);
        console.log(res);
    }
}

function parsecountries(html){
    let $ =cheerio.load(html);
    let listcountries = $("#main_table_countries_today tbody");
     let rows =$(listcountries).find("tr");

  
  for(let i = 8; i < rows.length-9; i++){
   
        let colsinEVeryRow = $(rows[i]).find("td");
        let cname = $(colsinEVeryRow[1]).text();
        let tcase = $(colsinEVeryRow[2]).text();
        let ncase = $(colsinEVeryRow[3]).text();
        let tdeath = $(colsinEVeryRow[4]).text();
        let ndeath = $(colsinEVeryRow[5]).text();
        let trec = $(colsinEVeryRow[6]).text();
        let acase = $(colsinEVeryRow[8]).text();
        let scase = $(colsinEVeryRow[9]).text();
        let casemil = $(colsinEVeryRow[10]).text();
        let deathmil = $(colsinEVeryRow[11]).text();
        let ttest = $(colsinEVeryRow[12]).text();
        let testmil = $(colsinEVeryRow[13]).text();
        let population = $(colsinEVeryRow[14]).text();

        handlecountry(cname,tcase,ncase,tdeath,ndeath,trec,acase,scase,casemil,deathmil,ttest,testmil,population);
    }
}


function handlecountry(cname,tcase,ncase,tdeath,ndeath,trec,acase,scase,casemil,deathmil,ttest,testmil,population) {
            let filePath = path.join("data",cname + ".json");
            fs.openSync(filePath, 'w');
        let entries = [];
        let newObj = {};
         newObj.Country = cname;
         newObj.Total_cases = tcase;
         newObj.New_cases = ncase;
         newObj.Total_death = tdeath;
         newObj.New_death = ndeath;
         newObj.Total_recovered = trec;
         newObj.Active_cases = acase;
         newObj.Serious_case = scase;
         newObj.Case_mil = casemil;
         newObj.Death_mil = deathmil;
         newObj.Total_test = ttest;
         newObj.Test_mil = testmil;
         newObj.Population = population;

         entries.push(newObj);
         let stringObj = JSON.stringify(entries);
        fs.writeFileSync(filePath, stringObj);
    }
 