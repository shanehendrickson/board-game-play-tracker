//* NAVIGATION
function renderNav(){
    const nav = document.getElementById("nav")
    nav.innerHTML = `
        <button type="button" id="nav-games">Games</button>
        <button type="button" id="nav-players">Players</button>
        <button type="button" id="nav-plays">Plays</button>
    `
    document.getElementById("nav-games").addEventListener("click",renderGameListView)
    document.getElementById("nav-players").addEventListener("click",renderPlayerListView)
    document.getElementById("nav-plays").addEventListener("click",renderSessionListView)
}

function getVal(data, model, id){
    return data[model].find(m=>m.id === id)    
}

function populateTextField(){}


function populateListField(containerId, items, label){
    const container = document.getElementById(containerId)
    container.innerHTML = ""

    //title
    const title = document.createElement("h3")
    title.textContent = label
    container.appendChild(title)

    //input
    const input = document.createElement("input")
    input.placeholder = `Add ${label.slice(0,-1)}`
    container.appendChild(input)

    //add button
    const addBtn = document.createElement("button")
    addBtn.type = "button"
    addBtn.textContent = "Add"
    container.appendChild(addBtn)

    //ul
    const ul = document.createElement("ul")
    container.appendChild(ul)

    //render list function
    function renderList(){
        ul.innerHTML = ""
        items.forEach((item, index)=> {
            const li = document.createElement("li")
            li.textContent = item

            const removeBtn = document.createElement("button")
            removeBtn.type = "button"
            removeBtn.textContent = "x"
            removeBtn.addEventListener("click", () => {
                items.splice(index,1)
                renderList()
            })
            li.appendChild(removeBtn)
            ul.appendChild(li)
        })
    }

    //add button event listener -> calls render list function
    addBtn.addEventListener("click", () => {
        const value = input.value.trim()
        if (value !== "") {
            items.push(value);
            input.value = ""
            renderList()
        }
    })
    renderList()
}


// add a game detail view
function renderGameDetailView(gameId){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const game = data.games.find(g => g.id === gameId)
    if (!game) {
        app.innerHTML = `<p>Game not found.</p>`;
        return
    }

    app.innerHTML = `
    <h2>${game.name}</h2>
    <p><strong>Publisher: </strong>${game.publisher}</p>
    <p><strong>Designed by: </strong>${game.designers.join(", ")}</p>
    <p><strong>Roles: </strong>${game.roles.join(", ")}</p>
    <p><strong>Antagonists: </strong>${game.antagonists.join(", ")}</p>
    <p><strong>Modules: </strong>${game.modules.join(", ")}</p>
    <div id="expansions-section">
        <p><strong>Expansions: </strong>
        <ul id="expansions-list"></ul>
    </div>
    </p>
    <p>
        <button type="button" id="log-play-btn">Log Play</button>
    </p>
    <button type="button" id="add-expansion-btn">Add Expansion</button>

    <div>
    <button type="button" id="edit-btn">Edit Game</button>
    <button type="button" id="back-btn">Back</button>
    </div>
    
    <hr>


    `
    const expansionIds = game.expansionIds || []
    expansionIds.map(exid=>{
        const li = document.createElement("li")
        li.textContent = getVal(data, "expansions", exid).name
        li.style.cursor = "pointer"
        li.addEventListener("click", ()=>{
            const expansionId = li.getAttribute("data-id")
            renderExpansionDetailView(exid)
        })
        document.getElementById("expansions-list").appendChild(li)
    })
    document.getElementById("add-expansion-btn").addEventListener("click",()=>renderAddExpansionView(gameId))
    document.getElementById("log-play-btn").addEventListener("click",()=>renderAddSessionView(gameId))
    document.getElementById("back-btn").addEventListener("click", renderGameListView)
    document.getElementById("edit-btn").addEventListener("click", () => renderGameFormView("edit", gameId) )
}

//* RENDER LIST VIEWS
function renderListView({ title, items, onSelect, onAdd }) {
    const app = document.getElementById("app")
    app.innerHTML = ""

    const h2 = document.createElement("h2")
    h2.textContent = title
    app.appendChild(h2)

    // list all items
    const ul = document.createElement("ul")
    items.forEach(item => {
        const li = document.createElement("li")
        li.textContent = item.name
        li.dataset.id = item.id
        li.style.cursor = "pointer"
        li.addEventListener("click", ()=>onSelect(item.id))
        ul.appendChild(li)
    })
    app.appendChild(ul)

    const btn = document.createElement("button")
    btn.type = "button"
    btn.textContent = `Add ${title.slice(0, -1)}`
    btn.addEventListener("click", onAdd)
    app.appendChild(btn)
}

//* List View Routers
function renderGameListView(){
    const data = getData();
    renderListView({
        title: "Games",
        items: data.games,
        onSelect: renderGameDetailView,
        onAdd: renderGameFormView
    })
}

function renderPlayerListView(){
    const data = getData()
    renderListView({
        title: "Players",
        items: data.players,
        onSelect: renderPlayerDetailView,
        onAdd: renderAddPlayerView
    })
}

function renderSessionListView(){
    const data = getData(
        renderListView({
            title: "Sessions",
            items: data.sessions,
            onSelect: renderSessionDetailView,
            onAdd: renderAddSessionView
        })
    )
}

function renderGameFormView(mode, gameId){
    const data = getData()

    // check if game exists - yes: retrieve; no: create empty game object
    const game = mode === "edit"
    ? data.games.find(g=>g.id === gameId)
    : {
        id: crypto.randomUUID(),
        name: "",
        designers: [],
        publisher: "",
        roles: [],
        antagonists: [],
        modules: [],
        expansionIds: []
    }

    // set up conditional html based on mode 'add' or 'edit'
    const app = document.getElementById("app")
    app.innerHTML = "";

    const h2 = document.createElement("h2")
    h2.textContent = mode == "edit" ? "Edit Game" : "New Game"
    app.appendChild(h2)

    // --- Name field ---
    const nameLabel = document.createElement("label")
    nameLabel.textContent = "Game Name: "
    const nameInput = document.createElement("input")
    nameInput.id = "game-name-input"
    nameInput.value = game.name
    app.appendChild(nameLabel)
    app.appendChild(nameInput)

    // --- Designers list ---
    let designers = [...game.designers]
    const designersContainer = document.createElement("div")
    designersContainer.id = "designers-container"
    app.appendChild(designersContainer)
    populateListField("designers-container", designers, "Designers")
    

    // -- Publisher field ---
    const publisherLabel = document.createElement("label")
    publisherLabel.textContent = "Publisher: "
    const publisherInput = document.createElement("input")
    publisherInput.id = "publisher-input"
    publisherInput.value = game.publisher
    app.appendChild(publisherLabel)
    app.appendChild(publisherInput)

    // --- Roles list ---
    let roles = [...game.roles]
    const rolesContainer = document.createElement("div")
    rolesContainer.id = "roles-container"
    app.appendChild(rolesContainer)
    populateListField("roles-container", roles, "Roles")


    // --- Antagonists list ---
    let antagonists = [...game.antagonists]
    const antagonistsContainer = document.createElement("div")
    antagonistsContainer.id = "antagonists-container"
    app.appendChild(antagonistsContainer)
    populateListField("antagonists-container", antagonists, "Antagonists")

    // --- Modules list ---
    let modules = [...game.modules]
    const modulesContainer = document.createElement("div")
    modulesContainer.id = "modules-container"
    app.appendChild(modulesContainer)
    populateListField("modules-container", modules, "Modules")

    // --- Expansion IDs list ---


    // --- Save & Cancel buttons ---
    const saveBtn = document.createElement("button")
    saveBtn.type = "button"
    saveBtn.textContent = mode === "edit" ? "Save Changes" : "Add Game"
    saveBtn.id = "save-game-btn"
    app.appendChild(saveBtn)

    const cancelBtn = document.createElement("button")
    cancelBtn.type = "button"
    cancelBtn.textContent = "Cancel"
    cancelBtn.addEventListener("click", ()=>{
        if (mode === "edit") renderGameDetailView(game.id)
        else renderGameListView()
    })
    app.appendChild(cancelBtn)   

    attachGameFormHandlers( game, { designers, roles, antagonists, modules })
}

function attachGameFormHandlers( game, lists){
    const saveBtn = document.getElementById("save-game-btn")
    saveBtn.addEventListener("click", () => {
        game.name = document.getElementById("game-name-input").value.trim()
        game.publisher = document.getElementById("publisher-input").value.trim()
        game.designers = lists.designers
        game.roles = lists.roles
        game.antagonists = lists.antagonists
        game.modules = lists.modules

        saveData("games", game)
        renderGameDetailView(game.id)
        
    })
}



//* HANDLE DATA
function initData(){
    const raw = localStorage.getItem("playTrackerData")
    let data
    
    try {
        data = raw ? JSON.parse(raw) : null
    } catch {
        data = null
    }

    // Define data shape
    const dataShape = {
        games: [],
        expansions: [],
        players: [],
        sessions: [],
    }

    // Check structure
    if (!data || typeof data !== "object"){
        localStorage.setItem("playTrackerData", JSON.stringify(dataShape))
        return dataShape
    }

    let changed = false
    for (const key in dataShape){
        if (!Array.isArray(data[key])) {
            data[key] = []
            changed = true
        }
    }

    if (changed) localStorage.setItem("playTrackerData", JSON.stringify(data))
    return data
}

function getData(){
    return JSON.parse(localStorage.getItem("playTrackerData"))
}

function saveData(model, item){
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const index = data[model].findIndex(i=>i.id===item.id)

    if (index !== -1) data[model][index] = item
    else data[model].push(item)

    localStorage.setItem("playTrackerData", JSON.stringify(data))
}

//* RUN THE APP
function runGameTracker(){
    initData()
    renderNav()
    renderGameListView()
}

runGameTracker()



