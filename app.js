var elasticsearch = require('elasticsearch');
var request = require('request');
var parseString = require('xml2js').parseString;

var client = new elasticsearch.Client({
  host: 'https://search-times-dovucerazici2axcenrztttyxy.us-west-2.es.amazonaws.com/',
  log: 'info'
});

client.ping({
  requestTimeout: 5000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

function getData() {
  request('http://www.universalstudioshollywood.com/waittimes/?type=all&site=USH', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        var items = result.rss.channel[0].item;
        console.log(items);
        for(var i = 0; i < items.length; i++) {
          client.index({
            index: 'ride-times',
            type: 'times',
            id: i,
            body: {
              title: items[i].title[0],
              waittime: parseInt(items[0].description[0]),
            }
          }, function (error, response) {
            console.log("put item successfully.")
          })
        }
      });
    }
  })
}

setInterval(function() {
  getData();
}, 600000);
