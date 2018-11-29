var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var request = require('request');
var async = require('async');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



//var champ = <script src="https://gist.github.com/jfisher446/2844002.js"></script>
app.use(express.static(__dirname + '/views'));

//----------------------------------------------
app.get('/', function(req, res){
    var s_toSearch = req.query.mytext;

    res.render('start', {

    });
});



//-----------------------------------------------

app.get('/myform', function(req, res) {
  var data = {};
  var api_key = 'RGAPI-cf6f36e7-8e2a-4ef4-a584-1e0cb2badb4c';
  var s_toSearch = req.query.mytext;
  //var iets = {};
  //var s_toSearch = req.query.mytext;
  var URL = 'https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + s_toSearch + '?api_key=' + api_key;
  //var URLL = 'http://ddragon.leagueoflegends.com/cdn/8.8.1/data/en_US/champion.json';


  //var jsonContent = JSON.parse(URL);

  async.waterfall([
    function(callback) {
      request(URL, function(err, response, body) {
        if(!err && response.statusCode == 200 && body != '"') {
          var json = JSON.parse(body);



          data.slvl = json.summonerLevel;
          data.id = json.id;
          data.name = json.name;
          iets = json.id;


          //console.log(data);

          var URLL = 'https://euw1.api.riotgames.com/lol/champion-mastery/v3/scores/by-summoner/'+iets+'?api_key='+api_key;
          var URLLL = 'https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/'+iets+'?api_key='+api_key;
          request(URLL, function(err, response, body){
            var jsonn = JSON.parse(body);
            iets.id=json;
            data.lvl = jsonn;
            //console.log(json);


          });
          request(URLLL, function(err, response, body){

            var jsonnn = JSON.parse(JSON.stringify(body).replace('[', "").replace(']', "").split(",{")[0].replace('}','}"').replace('}""','}"'));
            console.log(jsonnn);

            if(jsonnn != ''){
            jsonnn = JSON.parse(jsonnn);

            console.log(jsonnn);

            console.log(jsonnn.queueType);
            data.queType = jsonnn.queueType;
            data.tier = jsonnn.tier;
            data.rank = jsonnn.rank;
            data.hotstreak = jsonnn.hotStreak;
            data.wins = jsonnn.wins;
            data.losses = jsonnn.losses;
            data.queuetype = jsonnn.queueType;
            data.title = jsonnn.leagueName;
            //console.log(data.queType);




            callback(null, data);
          }else{
            data.tier = "No Tier";
            data.wins = "No Wins";
            data.losses = "No Losses";
            res.render('index', {

              data: data

            });
          }
          })

          //console.log(iets);


        } else {
          console.log("err");
          res.render('error', {
            data: data
          })
        }
      });
    }
  ],
  function(err, data) {
    if(err) {
      console.log(err);

      return;
    }

    res.render('index', {

      data: data

    });
  });
});

var port = Number(process.env.PORT || 3000);
app.listen(port);
