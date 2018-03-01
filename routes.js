var express = require('express')
var validator = require('express-validator')
var fs = require('fs')
var d3 = require('d3')
var path = require('path')

var router = express.Router();
const file = fs.readFileSync(path.join(__dirname, 'data','cities_canada-usa.tsv'), 'utf-8');
let suggest = d3.tsvParse(file)

function toUpper(str) {
  if(str.length < 4) {
    return str.toUpperCase();
  }
  return str
      .toLowerCase()
      .split(' ')
      .map(function(word) {
          return word[0].toUpperCase() + word.substr(1);
      })
      .join(' ');
 }

 function format(arr, query, lat, long) {
   let newarr = [];
   let codes = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14']
   let codenames = ['Alberta','British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrodor', '', 'Nova Scotia','Ontario', 'Prince Edward Island', 'Quebec','Saskatchewan','Yukon','Northwest Terrotories','Nunavut']
   for(let i = 0; i < arr.length;i++) {
     for(let j=0; j< codes.length; j++) {
       if(arr[i].admin1 === codes[j]) {
         arr[i].admin1 = codenames[j]
       }
     }
     let newObj = {};
     newObj.name = `${arr[i].name}, ${arr[i].admin1}, ${arr[i].country}`;
     newObj.latitude= arr[i].lat;
     newObj.longitude = arr[i].long;
     newObj.score = score(arr[i], query, lat, long)
     newarr.push(newObj)
   }
   return newarr;
 }

 function score(object, query, lat, long) {
   let sco = 1;
   if(object.name === query) {
     return parseFloat(1).toFixed(2);
   }
   if ( object.alt_name.split(',').includes(query)) return parseFloat(1).toFixed(2);

   if(lat && long && query) {
     lat = parseFloat(lat);
     long = parseFloat(long);
     let objlat = parseFloat(object.lat);
     let objlong = parseFloat(object.long);
     if((lat > objlat + .2 || lat < objlat - .2) && (long > objlong + .2 || long < objlong - .2)) {
       sco = sco - .5
     }
     if((lat > objlat + .15 || lat < objlat - .15) && (long > objlong + .15 || long < objlong - .15)) {
       sco = sco - .4
     }
     if((lat > objlat + .1 || lat < objlat - .1) && (long > objlong + .1 || long < objlong - .1)) {
       sco = sco - .3
     }
     if((lat > objlat + .05 || lat < objlat - .05) && (long > objlong + .05 || long < objlong - .05)) {
       sco = sco - .15
     }
     if((lat > objlat + .0025 || lat < objlat - .0025) && (long > objlong + .025 || long < objlong - .025)) {
       sco = sco - .1
     }
   }
   sco = parseFloat(sco, 4).toFixed(2)
   if(sco < .2) {
     sco = .2
   }
   return sco;
 }

 function checkArea(object, lat, long) {
   lat = parseFloat(lat);
   long = parseFloat(long);
   let objlat = parseFloat(object.lat);
   let objlong = parseFloat(object.long);
   if(lat > objlat - .3 && lat < objlat + .3 && long > objlong - .3 && long < objlong + .3) {
     return true;
   }
   return false;
 }

router.get('/suggestions', function(req, res) {
    let query = 'asdfadfadsfasdfasdfasdfasdfasdf';
    if(req.query.q) {
      query = toUpper(req.query.q)
      query = query.trim()
    }
    let suggestions = []
    let score = 1;
    let check = false;
    for(let i = 0; i < suggest.length; i++) {
      if(req.query.lat && req.query.long) {
        check = checkArea(suggest[i] ,req.query.lat, req.query.long);
      } else {
        check = false;
      }
      if(suggest[i].ascii.indexOf(query) > -1 || suggest[i].alt_name.indexOf(query) > -1 || check) {
        suggestions.push(suggest[i])
      }
    }
    let suggests = format(suggestions, query, req.query.lat, req.query.long)
    suggests = suggests.sort((a,b) => b.score - a.score);
    let form = {
      suggestions: suggests
    }
    res.render('index',{
      suggestions: JSON.stringify(form, 0, 2)
    })
})

module.exports = router;