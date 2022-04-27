let body = document.getElementsByTagName("body")[0]

// COLORS DEFINITION
let shootShipColor = '#bf616a'
let shootWaterColor = '#81a1c1'
let borderColor = '#2e3440'

// BOARDS PROPERTIES [FOR NOW HARDCODED]
let enemyAnimation = 'fadeout'
let playerAnimation = 'fadein'
let enemyLeft = '30vw'
let playerLeft = '-50vw'

// VARIABLES [FOR NOW HARDCODED]
let height = 10
let width = 10
let id = 1

// INITIALIZE TWO BOARDS
init('player')
init('enemy')

let button = document.createElement('button')
button.innerText = 'Swap'
button.setAttribute('onclick', 'swapBoards()')
body.appendChild(button)

function swapBoards() {
    document.getElementById('enemy').style.left = playerLeft
    document.getElementById('player').style.left = enemyLeft

    let temp1 = playerLeft
    playerLeft = enemyLeft
    enemyLeft = temp1

    boardAnimation()
}

function boardAnimation() {
    document.getElementById('player').classList.add(playerAnimation)
    document.getElementById('player').classList.remove(enemyAnimation)
    document.getElementById('enemy').classList.add(enemyAnimation)
    document.getElementById('enemy').classList.remove(playerAnimation)

    let temp = playerAnimation
    playerAnimation = enemyAnimation
    enemyAnimation = temp
}

function init(type) {
    let container = document.createElement("div")
    container.classList.add('container')
    container.classList.add(type)
    container.setAttribute('id', type)

    for (let i = 0; i < width * height; i++) {
        let cell = document.createElement("div")
        cell.classList.add('cell')
        cell.setAttribute('id', id.toString() + type)
        if (type === 'enemy') {
            cell.setAttribute('onclick', 'shoot(this)')
            cell.style.cursor = 'crosshair'
        }
        id++
        container.appendChild(cell)
    }
    body.appendChild(container)
    createShips(type).then(r => {
    })
}

async function createShips(type) {
    if (type === 'player') {
        document.getElementById("5" + type).classList.add("ship")
        document.getElementById("20" + type).classList.add("ship")
        document.getElementById("11" + type).classList.add("ship")
    }
}

const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
});

async function shoot(x) {
    await shootCell(x, shootWaterColor)
    swapBoards()
}

async function shootCell(x, color) {
    document.getElementById(x.id).removeAttribute("onclick")
    document.getElementById(x.id).style.backgroundColor = color
    document.getElementById(x.id).style.borderColor = borderColor
    document.getElementById(x.id).style.cursor = 'default'
    await delay(100)
}
