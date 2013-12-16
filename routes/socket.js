/*
 * Serve content over a socket
 */
var moment = require('moment'),	
 cronJob = require('cron').CronJob,
 _ = require('underscore'),
 twitter = require('ntwitter');

module.exports = function (socket) {

	socket.emit('data',watchList);

  //var watchSymbols = ['drake','kendrick', 'based god', 'schoolboy', 'kayne', 'childish gambino', 'chance the rapper', 'migos', 'a$ap','tyler the creator'];
  var watchSymbols = ['packers','cowboys'];

	var watchList = {
		totalPackers: 0,
		totalCowboys: 0,
		symbols: {},
		recentPackerTweets: [],
		recentCowboyTweets:[],
		lastUpdated: ""
	};

	_.each(watchSymbols, function(value){
		watchList.symbols[value] = 0;
	});

	var twit = new twitter({
	    consumer_key: '',           
	    consumer_secret: '',        
	    access_token_key: '',     
	    access_token_secret: ''  
	});

twit.stream('statuses/filter', {track:watchSymbols},function(stream){
	stream.on('data',function(tweet){
		watchList.lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a');
		var claimed = false;

		if(tweet.text === undefined){
			return;
		}

		var text = tweet.text.toLowerCase();

		_.each(watchSymbols, function(value){
		
			if(text.indexOf(value.toLowerCase()) !== -1){
				watchList.symbols[value]++;
				if(tweet.lang === 'en' && value === 'packers'){
					if(watchList.recentPackerTweets.length > 50)
						watchList.recentPackerTweets = [];
					if(watchList.recentPackerTweets.indexOf(tweet.text) === -1)
						watchList.recentPackerTweets.push(tweet.user.screen_name + ": " + tweet.text);
					watchList.totalPackers++;
				}
				else if(tweet.lang === 'en' && value === 'cowboys'){
					if(watchList.recentCowboyTweets.length > 50)
						watchList.recentCowboyTweets = [];
					if(watchList.recentCowboyTweets.indexOf(tweet.text) === -1)
						watchList.recentCowboyTweets.push(tweet.user.screen_name + ": " + tweet.text);
					watchList.totalCowboys++;
				}
				claimed = true;
			}
		
		});

		if(claimed){
			watchList.total++;

			socket.emit('data',watchList);
		}
	});
});

//Reset everything on a new day!
//We don't want to keep data around from the previous day so reset everything.
new cronJob('0 0 0 * * *', function(){
    //Reset the total
    watchList.total = 0;

    //Clear out everything in the map
    _.each(watchSymbols, function(value) { watchList.symbols[value] = 0; });

    //Send the update to the clients
    socket.emit('data', watchList);
}, null, true);
};
