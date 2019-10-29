import React, {useEffect} from 'react'
import store from '../store/store'
import {createSnackbar, closeSnackbar} from '../store/notify/notifyActions'
import {
    Container,
    Paper,
    Grid,
    makeStyles,
    Button,
} from '@material-ui/core'
import * as config from '../config.json'
require('babel-polyfill') //to make async work with webpack
import { } from '../components'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        margin: theme.spacing(0.5),
        color: '#f6f6f6',
    },
    buttonProgress: {
        color: 'green',
        position: 'absolute',
        marginTop: 15,
        marginLeft: -70,
    },
}))

export const App = (props) => {
    const classes = useStyles()
    const newSnackBar = (text, actionText, type) => {
        props.createSnackbar({
            message: text,
            options: {
                key: ` ${new Date().getTime() + Math.random()}` ,
                variant: type,
            },
        })
    }
    
    () => {
        
    }
      
    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    const testAPI= ()=> {
        console.log('Welcome!  Fetching your information.... ')
        FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name)
            document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!'
        })
    }
      
    // This is called with the results from from FB.getLoginStatus().
    const statusChangeCallback= (response) =>{
        console.log('statusChangeCallback')
        console.log(response)
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            testAPI()
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.'
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
          'into Facebook.'
        }
    }
      
    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    const checkLoginState = () =>{
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response)
        }.bind(this))
    }
      
    const   handleClick = ()=> {
        FB.login(checkLoginState())
    }

    useEffect(() => {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '<YOUR_APP_ID>',
                cookie     : true,  // enable cookies to allow the server to access
                // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.1' // use version 2.1
            })
      
            // Now that we've initialized the JavaScript SDK, we call
            // FB.getLoginStatus().  This function gets the state of the
            // person visiting this page and can return one of three states to
            // the callback you provide.  They can be:
            //
            // 1. Logged into your app ('connected')
            // 2. Logged into Facebook, but not your app ('not_authorized')
            // 3. Not logged into Facebook and can't tell if they are logged into
            //    your app or not.
            //
            // These three cases are handled in the callback function.
            FB.getLoginStatus(function(response) {
                this.statusChangeCallback(response)
            }.bind(this))
        }.bind(this);
      
        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) return
            js = d.createElement(s); js.id = id
            js.src = '//connect.facebook.net/en_US/sdk.js'
            fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'))
    })
    ////// Websocket functions start////////////////////*
    /*
    client.onopen = () => {
        sendMessage(null, null, 'ready') //tell srv we're ready
        console.log('%cWebSocket Client Connected to server\n\n')
        newSnackBar('WebSocket Client Connected to server', 'cool', 'info')
        
    }
    client.onclose = () => {
        console.warn(
            '%cWebSocket server closing or offline...',
            'color:orange;font-size:large',
        )
        newSnackBar('WebSocket server closing or offline...', 'Dang..', 'error')
    }
    client.onmessage = (message) => {
        dataFromServer = JSON.parse(message.data)
        console.log(
            '%cim RECIEVING parsed: Type: %c%s',
            'color:#baf; font-size:large',
            'color:#0f0; font-size:large',
            dataFromServer.type,
        )
        console.table(
            dataFromServer && dataFromServer.board
                ? dataFromServer.board
                : dataFromServer,
        )
        switch (dataFromServer.type) {
        default:
            console.error('we didnt know how to pocess your request..')
            break
        }
    }
    */
    const facebook = () => {
        
    }
    facebook()
    ////// Websocket functions end///////////////////
    const getDankMemes = async (setMemes) => {
        let posts = []
        let redditData
        let memes = []
        let classes = 'meme shake-slow shake-constant'
        const format = (data) => {
            for (var i = 2; i < data.length; i++) {
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
    return (
        <div className="app">
            {!props.isLoggedIn ? (
                <Login />
            ) : (
                <div>
                    <Container>
                        

                    </Container>
                    <Container className="fieldContainer">
                        <Grid container>
                            <Grid
                                item
                                xs={6}
                                className={'gameField1 '}
                            >
                                <Paper className={classes.paper}>
                                    <Button variant="outlined" color="primary" onClick={()=>{getDankMemes()}}>GET_API</Button>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} className="playField2">
                                <Paper className={classes.paper}>
                                    <Button variant="outlined" color="primary" onClick={()=>{handleClick()}}>TEST_API</Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>

                </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn
    }
}

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators(
        {
           
        },
        dispatch,
    ),
})
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)