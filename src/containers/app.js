import React, {useEffect} from 'react'
import store from '../store/store'
import {createSnackbar, closeSnackbar} from '../store/notify/notifyActions'
import {
    Container,
    Paper,
    Grid,
    CircularProgress,
    makeStyles,
    Button,
} from '@material-ui/core'
import * as config from '../config.json'
require('babel-polyfill') //to make async work with webpack
import { } from '../components'
import {client} from '..'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
    sendMessage,
} from './handlers'
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
    let dataFromServer
    let reqTypes = config.reqTypes
    const newSnackBar = (text, actionText, type) => {
        props.createSnackbar({
            message: text,
            options: {
                key: ` ${new Date().getTime() + Math.random()}` ,
                variant: type,
            },
        })
    }
    /*
    useEffect(() => {
        let index = props.userActivity.length - 1
        if (index != -1) {
            newSnackBar(props.userActivity[index], 'nice', 'info')
        }
    }, [props.userActivity])
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
                                    <Button onClick={()=>{getDankMemes()}}></Button>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} className="playField2">
                                <Paper className={classes.paper}>
            
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