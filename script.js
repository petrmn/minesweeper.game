import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose} from "./app.js"




var seconds = 0
var minutes = 0
var appSeconds = document.getElementById('seconds')
var appMinutes = document.getElementById('minutes')
const btnReload = document.getElementById('reloadBtn')
var timerInterval



function timerStart() {
    clearInterval(timerInterval)
    timerInterval = setInterval(startTimer, 1000)
}

btnReload.onclick = function () {
    btnReload.classList.add('clicked')
    setTimeout(() => {
        btnReload.classList.remove('clicked')
    }, 200);
    seconds = "00"
  	minutes = "00"
    appSeconds.innerHTML = seconds
  	appMinutes.innerHTML = minutes
    location.reload()

}


function startTimer () {
    seconds++; 
    
    if(seconds <= 9){
      appSeconds.innerHTML = "0" + seconds
    } else {
      appSeconds.innerHTML = seconds;
      
    } 
    
    if (seconds > 59) {
      minutes++
      appMinutes.innerHTML = '0' + minutes
      appSeconds.innerHTML = "0" + seconds
      seconds = 0;
      appSeconds.innerHTML = "0" + 0;
    }
    
    if (minutes > 9){
      appMinutes.innerHTML = minutes;
    } else {
        appMinutes.innerHTML = '0' + minutes
    }
  
}










const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10


const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".sub-text")

console.log(board)

function boardGenerator() {
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
            tile.element.addEventListener("click", () => {
                timerStart()
                revealTile(board, tile)
                checkGameEnd()
            })
            tile.element.addEventListener("contextmenu", e => {
                e.preventDefault()
                markTile(tile)
                listMindesLeft()
            })
        })
    })
    boardElement.style.setProperty("--size", BOARD_SIZE)
    minesLeftText.textContent = NUMBER_OF_MINES

}

boardGenerator()



function listMindesLeft () {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd () {
    const win = checkWin(board)
    const lose = checkLose(board)


    if (win || lose) {
        boardElement.addEventListener('click', stopProp, { capture: true })
        boardElement.addEventListener('contextmenu', stopProp, { capture: true })
    }

    if (win) {
        messageText.textContent = "You Win!"
        minesLeftText.textContent = ''
        clearInterval(timerInterval)
    }

    if (lose) {
        messageText.textContent = "You Lose!"
        minesLeftText.textContent = ''
        clearInterval(timerInterval)
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)})})
    
    }


}

function stopProp (e) {
    e.stopImmediatePropagation()
}

