//Timer
import React from 'react'
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    DialogContentText,
    Button
} from '@material-ui/core'
import { sendMessage } from '../containers/handlers'
export const GetReady = props => {
    const imReady = () => {
        sendMessage(null, props.playerNumber, 'readyup', 'Player is ready')
        props.setIsReady(true)
    }
    return (
        <div >
            <Dialog open={open} className="getReady" aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">
          Welcome Stranger!
                </DialogTitle>
                <DialogContent>
                    
                        <DialogContent>
                            <DialogContentText>
                Welcome!
                            </DialogContentText>
                        </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        onClick={() => {
                            props.showRules(true)
                        }}
                        text="Read the rules"
                    />
                    <Button
                        color="primary"
                        onClick={imReady}
                        disabled={props.isReady}
                        text="Ready Up!"
                    />
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default GetReady
