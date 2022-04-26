let body = document.getElementsByTagName("body")[0]

// COLORS DEFINITION
let shootShipColor = '#bf616a'
let shootWaterColor = '#81a1c1'
let borderColor = '#2e3440'

// BOARDS POSITION [FOR NOW HARDCODED]
let enemyLeft = '-50vw'
let playerLeft = '30vw'

// VARIABLES [FOR NOW HARDCODED]
let height = 10
let width = 10
let id = 1

// INITIALIZE TWO BOARDS
init('player')
init('enemy')

let button = document.createElement('button')
button.innerText = 'Swap Boards'
button.setAttribute('onclick', 'swapBoards()')
body.appendChild(button)

function swapBoards() {
    document.getElementById('enemy').style.left = playerLeft
    document.getElementById('player').style.left = enemyLeft
    let temp = playerLeft
    playerLeft = enemyLeft
    enemyLeft = temp
}

/*Will be implemented after backend supports it*/
// async function getBoardSize() {
// }


function init(type) {
    // getBoardSize().then(r => {
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
    // })
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
    const requestURL = 'http://localhost:8080/api/v1/shot?id=' + x.id
    const request = new Request(requestURL)
    const response = await fetch(request, {
        method: "POST"
    }).then(res => res.json())

    switch (response) {
        case 'HITWATER':
            await shootCell(x, shootWaterColor)
            hitWater.load()
            hitWater.play()
            break;
        case 'HITSHIP':
            await shootCell(x, shootShipColor)
            hitShip.load()
            hitShip.play()
            break;
        case 'ILLEGAL':
            invalid.load()
            invalid.play()
            window.alert("Illegal move")
            break;
        case 'FLEETSUNK':
            shootCell(x, shootShipColor)
            hitShip.load()
            hitShip.play()
            await delay(200)
            if (window.confirm("game over! restart?")) {
                window.location.reload()
                break
            }
            window.location.replace("gameover.html")
    }
}

function shootCell(x, color) {
    document.getElementById(x.id).removeAttribute("onclick")
    document.getElementById(x.id).style.backgroundColor = color
    document.getElementById(x.id).style.borderColor = borderColor
    document.getElementById(x.id).style.cursor = 'default'
}