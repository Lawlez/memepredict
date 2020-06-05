var Twitter = require('twitter');
var config = require('./config.js');
var T = new Twitter(config);
var fetch = require('node-fetch');
var fs = require('fs');
var request = require('request');
// Set up your search parameters
var params = {
  q: '#memes',
  count: 75,
  result_type: 'recent',
  //lang: 'de'
}
const getDankMemes = () => {
    let posts = []
    let redditData

    var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);
      console.log(filename)
      filename = 'memes/'+filename 
          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
      };

    const format = data => {
        for (var i = 2; i < 10; i++) {
            //start at 2 to ignore pinned posts
            posts.push({ URL: data[i].data.url, title: data[i].data.title })
        }
        console.log(posts[1].title)
        posts.forEach((imageurl) => {
            console.log(imageurl)
download(imageurl.URL, `${imageurl.title}.png`, function(){
    console.log('done');
  });
        })
        posts.forEach((imageurl) => {
            // Load your image
var data = fs.readFileSync(`memes/${imageurl.title}.png`);
// Make post request on media endpoint. Pass file data as media parameter
T.post('media/upload', {media: data}, function(error, media, response) {
  if (!error) {
    // If successful, a media object will be returned.
    console.log(media);
    // Lets tweet it
    var status = {
      status: imageurl.title + ' #memepredict #memes #funny #nodejs #memebot #dankmemes',
      media_ids: media.media_id_string // Pass the media id string
    }

    T.post('statuses/update', status, function(error, tweet, response) {
      if (!error) {
        console.log(tweet);
      }else{
          console.log(error)
      }
    });
  }else{
    console.log(error)
}

});
        })
        
        return posts
    }
    return fetch('https://www.reddit.com/r/dankmemes/.json')
        .then(r => r.json())
        .then(data => {
            redditData = format(data.data.children)
        })
        .catch(e => console.log('Booo', e))
    return redditData
}
//console.log(getDankMemes())

let i = 0
const fn = () => {
  getDankMemes()
  setInterval(()=>{getDankMemes(); i++}, 30 * 6000)
if (i >= 3){
  clearInterval(fn)
}
}

fn()


console.log('...data')


//let Timer = setInterval(()=>{getDankMemes()}, 15000)
/*
  var nextDate = new Date();
if (nextDate.getMinutes() === 0) { // You can check for seconds here too
    getDankMemes()
} else {
    nextDate.setHours(nextDate.getHours() + 1);
    nextDate.setMinutes(0);
    nextDate.setSeconds(0);

    var difference = nextDate - new Date();
    setTimeout(getDankMemes, difference);
}
*/
// Initiate your search using the above paramaters

T.get('search/tweets', params, function(err, data, response) {
  // If there is no error, proceed
  if(!err){
    // Loop through the returned tweets
    for(let i = 0; i < data.statuses.length; i++){
      // Get the tweet Id from the returned data
      let id = { id: data.statuses[i].id_str }
      // Try to Favorite the selected Tweet
      T.post('favorites/create', id, function(err, response){
        // If the favorite fails, log the error message
        if(err){
          console.log(err[0].message);
        }
        // If the favorite is successful, log the url of the tweet
        else{
          let username = response.user.screen_name;
          let tweetId = response.id_str;
          console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
        }
      });
    }
  } else {
    console.log(err);
  }
  
})