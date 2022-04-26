let height;
let width;
let id = 1
let hitShip = new Audio('assets/audio/reverb-fart-meme-earrape.mp3')
let hitWater = new Audio('assets/audio/fart-with-extra-reverb.mp3')
let invalid = new Audio('assets/audio/OnlyMP3.net - Roblox Death Sound - Sound Effect (HD)-3w-2gUSus34-192k-1638925379977.mp3')
let bgAudio = new Audio('assets/audio/trance-009-sound-system-dreamscape.mp3')
bgAudio.loop = true

playBG()
init()

async function getBoardSize() {
    const requestURL = 'http://localhost:8080/api/v1/board'
    const request = new Request(requestURL)

    const response = await fetch(request)
    const boardDimensions = await response.json()
    height = boardDimensions["height"]
    width = boardDimensions["width"]
}

function init() {
    getBoardSize().then(r => {
        let body = document.getElementsByTagName("body")[0]
        let table = document.createElement("table")
        let tableBody = document.createElement("tbody")
        for (let j = 0; j < width; j++) {
            let row = document.createElement("tr")
            for (let i = 0; i < height; i++) {
                let cell = document.createElement("td")
                cell.classList.add('cell')
                cell.setAttribute("id", id.toString())
                id++
                cell.setAttribute("onclick", "shoot(this)")
                row.append(cell)
            }
            tableBody.appendChild(row);
        }
        table.appendChild(tableBody)
        body.appendChild(table)
        createShips().then(r => {
        })
    })
}

async function playBG() {
    await bgAudio.play()
}

async function createShips() {
    const requestURL = 'http://localhost:8080/api/v1/fleet'
    const request = new Request(requestURL)

    const response = await fetch(request)
    const shipsPosition = await response.json()
    shipsPosition["ships"].forEach(e => {
        e["mastsIDs"].forEach(m => {
            document.getElementById(m.toString()).classList.remove("cell")
            document.getElementById(m.toString()).classList.add("ship")
        })
    });
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
            await damagingCell(x, 'shot_cell')
            hitWater.load()
            hitWater.play()
            break;
        case 'HITSHIP':
            await damagingCell(x, 'damaged_ship')
            hitShip.load()
            hitShip.play()
            break;
        case 'ILLEGAL':
            invalid.load()
            invalid.play()
            window.alert("Illegal move")
            break;
        case 'FLEETSUNK':
            damagingCell(x, 'damaged_ship')
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

function damagingCell(x, className) {
    document.getElementById(x.id).classList.remove(x.className);
    document.getElementById(x.id).classList.add(className);
    document.getElementById(x.id).removeAttribute("onclick")
}