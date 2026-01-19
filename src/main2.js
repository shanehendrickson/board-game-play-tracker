function renderNav(){
    const nav = document.getElementById("nav")
        nav.innerHTML = `
        <button type="button" id="nav-games">Games</button>
        <button type="button" id="nav-players">Players</button>
        <button type="button" id="nav-plays">Plays</button>
    `
    // document.getElementById("nav-games").addEventListener("click",renderGameListView)
    // document.getElementById("nav-players").addEventListener("click",renderPlayerListView)
    // document.getElementById("nav-plays").addEventListener("click",renderPlayListView)
}

// Initialize Data Structure
function initData(){
    const raw = localStorage.getItem("boardGameData")
    let data
    
    try {
        data = raw ? JSON.parse(raw) : null
    } catch {
        data = null
    }

    const dataShape = {
        games: [],
        expansions: [],
        players: [],
        sessions: [], //plays
    }

    if (!data || typeof data !== "object"){
        localStorage.setItem("boardGameData", JSON.stringify(dataShape))
        return dataShape
    }

    let changed = false
    for (const key in dataShape) {
        if (!Array.isArray(data[key])) {
            data[key] = []
            changed = true
        }
    }
    if (changed) localStorage.setItem("boardGameData", JSON.stringify(data))
    return data
}

function saveData(model, item){
    const data = JSON.parse(localStorage.getItem("boardGameData"))
    const index = data[model].findIndex(i=>i.id===item.id)

    if (index !== -1) data[model][index] = item
    else data[model].push(item)

    localStorage.setItem("boardGameData", JSON.stringify(data))
}



//* Run the App
function runGameTracker(){
    initData()
    renderNav()
}

runGameTracker()