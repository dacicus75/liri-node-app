require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//var spotify = new Spotify(keys.spotify);

var input = process.argv;
var action = input[2];
var inputs = input[3];




switch (action) {
	case "concert-this":
	concertThis(inputs);
	break;

	case "spotify-this-song":
	spotifyThis(inputs);
	break;

	case "movie-this":
	movieThis(inputs);
	break;

	case "do-what-it-says":
	doWhatItSays();
	break;
};
// function writeToLogFile(data) {
//     fs.appendFile("log.txt", '\r\n\r\n', function(err) {
//         if (err) {
//             return console.log(err);
//         }
//     });

//     fs.appendFile("log.txt", (data), function(err) {
//         if (err) {
//             return console.log(err);
//         }
//         console.log(space + "log.txt was updated!");
//     });
// }


function spotifyThis(inputs) {

	var spotify = new Spotify(keys.spotify);
		if (!inputs){
        	inputs = 'The Sign';
    	}
		spotify.search({ type: 'track', query: inputs }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        } 	

			var songInfo = data.tracks.items;
				for (var i = 0; i < songInfo.lenght; i++) {
	        console.log("Artist(s): " + songInfo[i].artists[0].name);
	        console.log("Song Name: " + songInfo[i].name);
	        console.log("Preview Link: " + songInfo[i].preview_url);
	        console.log("Album: " + songInfo[i].album.name);
				}
		});
};
function concertThis(inputs) {
    var queryUrl ="https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body) {
		if (!inputs){
            inputs = 'I Want it That Way';
        }
        else if (!error && response.statusCode === 200) {
            console.log("Venue: " +JSON.parse(body).Venue);
            console.log("Location: " +JSON.parse(body).Location);
            console.log("Date: " +JSON.parse(body).Date);
        }
    });    

}

function movieThis(inputs) {

	var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=b459dd21";

	request(queryUrl, function(error, response, body) {
		if (!inputs){
        	inputs = 'Mr Nobody';
    	}
		else if (!error && response.statusCode === 200) {

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

function doWhatItSays() {
	fs.readFile('random.txt', "utf8", function(error, data){

		if (error) {
    		return console.log(error);
  		}

		
		var dataArr = data.split(",");

		
		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
            spotifyThis(songcheck);
        } else if (dataArr[0] === "concert-this") {
                var concertName = dataArr[1].slice(1, -1);
                concertThis(concertName);    
		
		} else if(dataArr[0] === "movie-this") {
			var movieName = dataArr[1].slice(1, -1);
			movieThis(movieName);
		} 
		
      });
    }; 