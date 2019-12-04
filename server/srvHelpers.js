// generates unique userid for everyuser.
export const getUniqueID = () => {
    const s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    return s4() + '-' + s4()
}
export const getDankMemes = (difficulty = 'easy') => {
    let subreddit = 'dankmemes'
    console.time('\ngenerating sudoku took')
    return fetch(`https://www.reddit.com/r/${subrettit}/.json`)
        .then((response) => response.json())
        .then((json) => {
            currentBoard = json.board
            console.timeEnd('\ngenerating sudoku took')
            return json.board
        })
        .catch(() => getLocalBoard()) //fall back to local generator in case API goes OFFLINE
}