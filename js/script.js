let shootShipColor =  '#bf616a'
let shootWaterColor = '#81a1c1'
let borderColor = '#2e3440'

let height = 10
let width = 10
let id = 1
let hitShip = new Audio('assets/audio/reverb-fart-meme-earrape.mp3')
let hitWater = new Audio('assets/audio/fart-with-extra-reverb.mp3')
let invalid = new Audio('assets/audio/OnlyMP3.net - Roblox Death Sound - Sound Effect (HD)-3w-2gUSus34-192k-1638925379977.mp3')
let bgAudio = new Audio('assets/audio/trance-009-sound-system-dreamscape.mp3')
bgAudio.loop = true

playBG()
init()

async function getBoardSize() {
}

function init() {
    getBoardSize().then(r => {
        let body = document.getElementsByTagName("body")[0]
        let container = document.createElement("div")
        container.classList.add('container')
        for (let i = 0; i < width * height; i++) {
            let cell = document.createElement("div")
            cell.classList.add('cell')
            cell.setAttribute('id', id.toString())
            cell.setAttribute('onclick', 'shoot(this)')
            id++
            container.appendChild(cell)
        }
        body.appendChild(container)
        createShips().then(r => {
        })
    })
}

async function playBG() {
    await bgAudio.play()
}

async function createShips() {
    document.getElementById("1").classList.add("ship")
    document.getElementById("13").classList.add("ship")
    document.getElementById("14").classList.add("ship")
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
    console.log(response);

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