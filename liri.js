//requirements for node packages

require("dotenv").config();
const fs = require('fs');
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const axios = require('axios').default;

let spotify = new Spotify(keys.spotify);

const cmdArg = process.argv[2];
const searchTxtArg = process.argv[3];
//function that creates Liri commands in the terminal

function runLiriCmd (cmdArg, searchTxtArg) {
    switch(cmdArg){
        case 'concert-this':
            concertThis(searchTxtArg);
            break;
        case 'spotify-this-song':
            spotifyThisSong(searchTxtArg);
            break;
        case 'movie-this':
            movieThis(searchTxtArg);
            break;
        default: 
            console.log('Please enter a valid command:');
            console.log("concert-this '<artist/band name here>'");
            console.log("spotify-this-song '<song name here>'");
            console.log("movie-this '<movie name here>'");
            console.log("do-what-it-says");
            break;
    }
}

//function that shows response
function concertThis (searchTxtArg) {
    console.log("working on concert-this cmd ...");
    axios.get("https://rest.bandsintown.com/artists/" + searchTxtArg + "/events?app_id="+ process.env.BANDSINTOWN_APP_ID)
    .then(function (response) {
        // handle success
        console.log(response.data);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
}
//default for when a title is not entered 
function spotifyThisSong (searchTxtArg) {
    console.log("working on spotify-this-song cmd ...");
    let querySong = "The Sign";
    if (searchTxtArg) {
        querySong = searchTxtArg;
    }

    spotify.search({ type: 'track', query: querySong }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      console.log(data); 
    });
}

function movieThis(searchTxtArg) {
    let queryMovie = "Mr. Nobody";
    if (searchTxtArg) {
        queryMovie = searchTxtArg;
    } 
    console.log("working on movie-this cmd ...");
    axios.get("http://www.omdbapi.com/?apikey="+ process.env.OMDB_API_KEY +"&type=movie&t="+queryMovie)
    .then(function (response) {
        // handle success
        console.log(response.data);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
}

function doWhatItSays(searchTxtArg) {
    console.log("working on do-what-it-says cmd ...");
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        } err;
        cmdArray = data.split(',')
        const cmd = cmdArray[0];
        const cmdTxt = cmdArray[1];
        runLiriCmd(cmd, cmdTxt);
    });
}

if (cmdArg === 'do-what-it-says') {
    doWhatItSays(searchTxtArg);
} else {
    runLiriCmd(cmdArg, searchTxtArg);
}