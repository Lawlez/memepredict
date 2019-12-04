//handlers
import React from 'react'
import {client} from '../index'
import * as config from '../config.json'
////// login ///////
export const onSubmit = (
    playerNumber,
    tempName,
    allPlayers,
    setPlayerN,
) => {
    let playerN = playerNumber
    console.log(playerN)
    if ((playerN === null) & (allPlayers < 1)) {
        playerN = Number(1)
    } else if ((playerN === null) & (allPlayers < 2)) {
        playerN = Number(2)
    }
    if ((playerN !== undefined) & (playerN !== null)) {
        sendMessage(tempName, playerN, 'userevent')
        setPlayerN(playerN)
        return
    }
    console.log('player not set')
}
export const postToTwitter = () => {

    let OAuth = require('oauth')

    let twitter_application_consumer_key = '26qUEcPUyQvP7gGqiWKMPfqz1'  // API Key
    let twitter_application_secret = 'JWdIkOxGAiVIHNJsnslkKotF0jPrUd2JIF3PaSwdWOcpg4ZKZU'  // API Secret
    let twitter_user_access_token = '778182221085700100-lYXdGCk4iEEFs3QMqXU4BNn2uXLAWrF'  // Access Token
    let twitter_user_secret = '8SiJxNgw1XyFiHvjHNMRkmYHjBQ99ItY35LoKvNoAfJsc'  // Access Token Secret

    let oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        twitter_application_consumer_key,
        twitter_application_secret,
        '1.0A',
        null,
        'HMAC-SHA1'
    )

    let status = 'test '  // This is the tweet (ie status)

    let postBody = {
        'status': status
    }

    // console.log('Ready to Tweet article:\n\t', postBody.status);
    oauth.post('https://api.twitter.com/1.1/statuses/update.json',
        twitter_user_access_token,  // oauth_token (user access token)
        twitter_user_secret,  // oauth_secret (user secret)
        postBody,  // post body
        '',  // post content type ?
        function(err, data, res) {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
            }
        })
}
export const getDankMemes = async (setMemes) => {
    let posts = []
    let redditData
    let memes = []
    let classes = 'meme shake-slow shake-constant'
    const format = (data) => {
        for (let i = 2; i < data.length; i++) {
            //start at 2 to ignore pinned posts
            posts.push(data[i].data.url)
        }
        posts.forEach((imageurl) => {
            memes.push(
                <img key={imageurl} src={imageurl} className={classes}/>
            )
        })
        console.log(memes)
        return memes
    }
    let fetchMemes = await fetch('http://www.reddit.com/r/dankmemes/.json')
        .then((r) => r.json())
        .then((data) => {redditData = format(data.data.children)
            setMemes(redditData)
        })
        .catch((e) => console.log('Booo', e))
    console.log('fetch', fetchMemes)
    return redditData
}

export const sendMessage = (
    userName,
    playerNumber,
    type,
    msg,
    input,
    position,
) => {
    console.log(`i sent player ${playerNumber}`)
    let json = {
        username: userName,
        player: playerNumber,
        type: type,
        msg: msg,
        input: input,
        inputPos: position,
    }
    console.log(json)
    client.send(JSON.stringify(json))
}


