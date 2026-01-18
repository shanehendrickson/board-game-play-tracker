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
    document.getElementById("nav-plays").addEventListener("click",renderPlayListView)
}

function getVal(data, model, id){
    return data[model].find(m=>m.id === id)    
}

//* GAMES
// a Game List view for confirmation
function renderGameListView(){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData") || { games: []})

    app.innerHTML = `
    <h2>Games</h2>
    <ul id="game-list">
        ${data.games.map(g => `<li data-id="${g.id}">${g.name}</li>`).join("")}
    </ul>
    <button type="button" id="add-game-btn">Add Game</button>
    `

    document.getElementById("add-game-btn").addEventListener("click", ()=>{renderAddGameView()})
    document.querySelectorAll("#game-list li").forEach(li=>{
        li.style.cursor = "pointer"
        li.addEventListener("click", ()=>{
            const gameId = li.getAttribute("data-id")
            renderGameDetailView(gameId)
        })
    })
}

// add a simple Add Game form
function renderAddGameView(){
    const app = document.getElementById("app")

    app.innerHTML = `
    <h2>Add Game</h2>
    <form id="add-game-form">            
        <label for="game-input">Game: </label>
        <input type="text" id="game-name-input" name="game_name" required>

        <div id="designer-section">
            <label for="designer-input">Designed by: </label>
            <input type="text" id="designer-input">
            <button type="button" id="add-designer-btn">Add Designer</button>
            <ul id="designer-list"></ul>
        </div>

        <label for="publisher-input">Publisher: </label>
        <input type="text" id="publisher-input" name="publisher_name">

        <div id="roles-section">
            <label for="role-input">Roles: </label>
            <input type="text" id="role-input">
            <button type="button" id="add-role-btn">Add Role</button>
            <ul id="roles-list"></ul>
        </div>

        <div id="antagonists-section">
            <label for="antagonist-input">Antagonists: </label>
            <input type="text" id="antagonist-input">
            <button type="button" id="add-antagonist-btn">Add Antagonist</button>
            <ul id="antagonists-list"></ul>
        </div>

        <div id="modules-section">
            <label for="module-input">Modules: </label>
            <input type="text" id="module-input">
            <button type="button" id="add-module-btn">Add Module</button>
            <ul id="modules-list"></ul>
        </div>

        <div id="expansions-section">
            <label for="expansion-input">Expansions: </label>
            <input type="text" id="expansion-input">
            <button type="button" id="add-expansion-btn">Add Expansion</button>
            <ul id="expansions-list"></ul>
        </div>


        <p class="button">
            <button type="submit">Save</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </p>
    </form>
    `;

    attachAddGameHandlers();
}

// function to create a Game object
function attachAddGameHandlers() {
    const form = document.getElementById("add-game-form")
    form.addEventListener("keydown", (event)=> {
        if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault()
    })
    document.getElementById("cancel-btn").addEventListener("click", renderGameListView)
    //TODO - comes back and simplify designer, roles, and antagonists into a single function maybe
    //designer
    const designerInput = document.getElementById("designer-input");
    const designerList = document.getElementById("designer-list");
    const addDesignerBtn = document.getElementById("add-designer-btn");
    const designer = [];
    addDesignerBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newDesigner = designerInput.value.trim()
        if (newDesigner!=""){
            designer.push(newDesigner)
            const li = document.createElement("li")
            li.textContent = newDesigner
            const removeBtn = document.createElement("button")
            removeBtn.textContent = "x"
            removeBtn.classList.add("remove-btn")
            li.appendChild(removeBtn)
            removeBtn.addEventListener("click", ()=> {
                const index = designer.indexOf(newDesigner)
                if (index !==-1) designer.splice(index,1)
                li.remove()
            })
            designerList.appendChild(li)
            designerInput.value = ""
        }
    })

    //roles
    const roleInput = document.getElementById("role-input");
    const rolesList = document.getElementById("roles-list");
    const addRoleBtn = document.getElementById("add-role-btn");
    const roles = [];
    addRoleBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newRole = roleInput.value.trim()
        if (newRole!=""){
            roles.push(newRole)
            const li = document.createElement("li")
            li.textContent = newRole
            rolesList.appendChild(li)
            roleInput.value = ""
        }
    })

    //antagonists
    const antagonistInput = document.getElementById("antagonist-input");
    const antagonistsList = document.getElementById("antagonists-list");
    const addAntagonistBtn = document.getElementById("add-antagonist-btn");
    const antagonists = [];
    addAntagonistBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newAntagonist = antagonistInput.value.trim()
        if (newAntagonist!=""){
            antagonists.push(newAntagonist)
            const li = document.createElement("li")
            li.textContent = newAntagonist
            antagonistsList.appendChild(li)
            antagonistInput.value = ""
        }
    })

    //modules
    const moduleInput = document.getElementById("module-input");
    const modulesList = document.getElementById("modules-list");
    const addModuleBtn = document.getElementById("add-module-btn");
    const modules = [];
    addModuleBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newModule = moduleInput.value.trim()
        if (newModule!=""){
            modules.push(newModule)
            const li = document.createElement("li")
            li.textContent = newModule
            modulesList.appendChild(li)
            moduleInput.value = ""
        }
    })

    //submit game
    form.addEventListener("submit", (event)=> {
        event.preventDefault()
        //build game object
        const newGame = {
            id: crypto.randomUUID(),
            name: document.getElementById("game-name-input").value.trim(),
            designer: designer,
            publisher: document.getElementById("publisher-input").value.trim(),
            roles,
            antagonists,
            modules,
            expansionIds: []
        }
        saveGame(newGame)
        renderGameListView()
    })

        
}

// function to save Game object to local storage
function saveGame(game){
    const data = JSON.parse(localStorage.getItem("playTrackerData")) || {
        games: [],
        expansions: [],
        players: [],
        plays: [],
    }

    const index = data.games.findIndex(g=>g.id===game.id)

    if (index!==-1) data.games[index] = game
    else data.games.push(game)

    localStorage.setItem("playTrackerData", JSON.stringify(data))
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
    <p><strong>Designed by: </strong>${game.designer.join(", ")}</p>
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
    
    game.expansionIds.map(exid=>{
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
    document.getElementById("log-play-btn").addEventListener("click",()=>renderAddPlayView(gameId))
    document.getElementById("back-btn").addEventListener("click", renderGameListView)
    document.getElementById("edit-btn").addEventListener("click", () => renderEditGameView(gameId) )
}

function renderEditGameView(gameId){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const game = data.games.find(g => g.id === gameId)
    app.innerHTML = `
    <h2>${game.name}</h2>
    <form id="edit-game-form">
        <label for="game-input">Game: </label>
        <input type="text" id="game-name-input" name="game_name" value="${game.name}" required>

        <div id="designer-section">
            <label for="designer-input">Designed by: </label>
            <input type="text" id="designer-input">
            <button type="button" id="add-designer-btn">Add Designer</button>
            <ul id="designer-list"></ul>
        </div>

        <label for="publisher-input">Publisher: </label>
        <input type="text" id="publisher-input" name="publisher_name" value="${game.publisher}">

        <div id="roles-section">
            <label for="role-input">Roles: </label>
            <input type="text" id="role-input">
            <button type="button" id="add-role-btn">Add Role</button>
            <ul id="roles-list"></ul>
        </div>

        <div id="antagonists-section">
            <label for="antagonist-input">Antagonists: </label>
            <input type="text" id="antagonist-input">
            <button type="button" id="add-antagonist-btn">Add Antagonist</button>
            <ul id="antagonists-list"></ul>
        </div>

        <div id="modules-section">
            <label for="module-input">Modules: </label>
            <input type="text" id="module-input">
            <button type="button" id="add-module-btn">Add Module</button>
            <ul id="modules-list"></ul>
        </div>

        <div class="button">
            <button type="submit">Save</button>
            <button type="button" id="cancel-btn">Cancel</button>        
        </div>


        <p class="button">
        </p>
        <p class="button">
        </p>
    </form>
    `


    document.getElementById("cancel-btn").addEventListener("click", ()=>renderGameDetailView(gameId))
    attachEditGameHandlers(gameId)
}

function attachEditGameHandlers(gameId){
    const form = document.getElementById("edit-game-form")
    form.addEventListener("keydown", (event)=> {
        if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault()
    })
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const game = data.games.find(g => g.id === gameId)
    
    const designerInput = document.getElementById("designer-input");
    const designerList = document.getElementById("designer-list");
    const addDesignerBtn = document.getElementById("add-designer-btn");
    const designer = [...game.designer];
    designer.forEach(d=>{
        const li = document.createElement("li")
        li.textContent = d
        const removeBtn = document.createElement("button")
            removeBtn.textContent = "x"
            removeBtn.classList.add("remove-btn")
            li.appendChild(removeBtn)
            removeBtn.addEventListener("click", ()=> {
                const index = designer.indexOf(d)
                if (index !==-1) designer.splice(index,1)
                li.remove()
            })
        designerList.appendChild(li)
    })
    addDesignerBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newDesigner = designerInput.value.trim()
        if (newDesigner!=""){
            designer.push(newDesigner)
            const li = document.createElement("li")
            li.textContent = newDesigner
            const removeBtn = document.createElement("button")
            removeBtn.textContent = "x"
            removeBtn.classList.add("remove-btn")
            li.appendChild(removeBtn)
            removeBtn.addEventListener("click", ()=> {
                const index = designer.indexOf(newDesigner)
                if (index !==-1) designer.splice(index,1)
                li.remove()
            })
            designerList.appendChild(li)
            designerInput.value = ""
        }
    })

    //roles
    const roleInput = document.getElementById("role-input");
    const rolesList = document.getElementById("roles-list");
    const addRoleBtn = document.getElementById("add-role-btn");
    const roles = [...game.roles];
    roles.forEach(r=>{
        const li = document.createElement("li")
        li.textContent = r
        rolesList.appendChild(li)
    })
    addRoleBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newRole = roleInput.value.trim()
        if (newRole!=""){
            roles.push(newRole)
            const li = document.createElement("li")
            li.textContent = newRole
            rolesList.appendChild(li)
            roleInput.value = ""
        }
    })

    //antagonists
    const antagonistInput = document.getElementById("antagonist-input");
    const antagonistsList = document.getElementById("antagonists-list");
    const addAntagonistBtn = document.getElementById("add-antagonist-btn");
    const antagonists = [...game.antagonists];
    antagonists.forEach(a=>{
        const li = document.createElement("li")
        li.textContent = a
        antagonistsList.appendChild(li)
    })
    addAntagonistBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newAntagonist = antagonistInput.value.trim()
        if (newAntagonist!=""){
            antagonists.push(newAntagonist)
            const li = document.createElement("li")
            li.textContent = newAntagonist
            antagonistsList.appendChild(li)
            antagonistInput.value = ""
        }
    })
    //modules
    const moduleInput = document.getElementById("module-input");
    const modulesList = document.getElementById("modules-list");
    const addModuleBtn = document.getElementById("add-module-btn");
    const modules = [...game.modules];
    modules.forEach(a=>{
        const li = document.createElement("li")
        li.textContent = a
        modulesList.appendChild(li)
    })
    addModuleBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newModule = moduleInput.value.trim()
        if (newModule!=""){
            modules.push(newModule)
            const li = document.createElement("li")
            li.textContent = newModule
            modulesList.appendChild(li)
            moduleInput.value = ""
        }
    })

    form.addEventListener("submit", (event)=>{
        event.preventDefault()

        //update game object
        game.name = document.getElementById("game-name-input").value.trim()
        game.designer = designer
        game.publisher = document.getElementById("publisher-input").value.trim()
        game.roles = roles
        game.antagonists = antagonists
        game.modules = modules

        localStorage.setItem("playTrackerData", JSON.stringify(data))
        renderGameDetailView(gameId)

    })
}



//* PLAYERS
// Player data shape: {id: unique id, name: string, preferred color: string, notes: string}

function renderPlayerListView(){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData") || { players: []})

    app.innerHTML = `
    <h2>Players</h2>
    <ul id="player-list">
        ${data.players.map(p =>`<li data-id="${p.id}">${p.name}</li>`).join("")}
    </ul>
    <button type="button" id="add-player-btn">Add Player</button>
    `

    document.getElementById("add-player-btn").addEventListener("click",()=>{renderAddPlayerView()})
    document.querySelectorAll("#player-list li").forEach(li=>{
        li.style.cursor = "pointer"
        li.addEventListener("click", ()=>{
            const playerId = li.getAttribute("data-id")
            renderPlayerDetailView(playerId)
        })
    })
}

// add player view
function renderAddPlayerView(){
    const app = document.getElementById("app")

    app.innerHTML = `
    <h2>Add Player</h2>
    <form id="add-player-form">
        <label for="player-input">Player: </label>
        <input type="text" id="player-name-input" name="player_name" required>
        
        <p class="button">
            <button type="submit">Add Player</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </p>
    </form>
    `
    attachAddPlayerHandlers()
}

function attachAddPlayerHandlers(){
    const form = document.getElementById("add-player-form")
    form.addEventListener("keydown", (event)=> {
        if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault()
    })

    document.getElementById("cancel-btn").addEventListener("click", ()=>renderPlayerListView())


    form.addEventListener("submit", (event)=>{
        event.preventDefault()
        const newPlayer = {
            id: crypto.randomUUID(),
            name: document.getElementById("player-name-input").value.trim()
        }
        savePlayer(newPlayer)
        renderPlayerListView()
    })

}

function savePlayer(player){
    const data = JSON.parse(localStorage.getItem("playTrackerData")) || {
        games: [],
        expansions: [],
        players: [],
        plays: [],
    }

    data.players.push(player)
    localStorage.setItem("playTrackerData", JSON.stringify(data))
}

// player detail view
function renderPlayerDetailView(playerId){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const player = data.players.find(g => g.id === playerId)
    if (!player) {
        app.innerHTML = `<p>Player not found.</p>`;
        return
    }
    //TODO - get win count from all plays
    app.innerHTML = `
    <h2>${player.name}</h2>
    <p>Wins: 0 (TODO: get from logged plays)</p>
    <button type="button" id="edit-btn">Edit Player</button>
    <button type="button" id="back-btn">Back</button>
    `

    // edit player action
    document.getElementById("back-btn").addEventListener("click",renderPlayerListView)
    document.getElementById("edit-btn").addEventListener("click", () => renderEditPlayerView(playerId) )
}

function renderEditPlayerView(playerId){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const player = data.players.find(g => g.id === playerId)

    app.innerHTML = `
    <h2>${player.name}</h2>
    <form id="edit-player-form">
        <label for="player-input">Player: </label>
        <input type="text" id="player-name-input" name="player_name" required>
        
        <div class="buttons">
            <button type="submit">Add Player</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </div>
        
    </form>
    `
    document.getElementById("cancel-btn").addEventListener("click",()=>renderPlayerDetailView(playerId))
    attachEditPlayerHandlers(playerId)
}

function attachEditPlayerHandlers(playerId){
    const form = document.getElementById("edit-player-form")
    form.addEventListener("keydown", (event)=> {
        if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault()
    })
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const player = data.players.find(g => g.id === playerId)

    form.addEventListener("submit", (event)=>{
        event.preventDefault()

        player.name = document.getElementById("player-name-input").value.trim()

        localStorage.setItem("playTrackerData",JSON.stringify(data))
        renderPlayerDetailView(playerId)
    })
}

function renderPlayListView(){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))

    app.innerHTML = `
    <h2>Logged Plays</h2>
    <ul id="play-list">
        ${data.plays.map(p=>`<li data-id="${p.id}">${getVal(data, "games", p.game).name} - ${p.date}</li>`)}
    </ul>
    `
    document.querySelectorAll("#play-list li").forEach(li=>{
        li.style.curosr = "pointer"
        li.addEventListener("click", ()=>{
            const playId = li.getAttribute("data-id")
            renderPlayDetailView(playId)
        })
    })
}

function renderAddPlayView(gameId){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const game = data.games.find(g => g.id === gameId)

    

    const playersMap = data.players
        .map(p => `<option value="${p.id}">${p.name}</option>`)
        .join("")

    const antagonistsMap = game.antagonists
        .map(a => `<option value="${a}">${a}</option>`)
        .join("")
    
    const modulesMap = game.modules
        .map(m => `<option value="${m}">${m}</option>`)
        .join("")

    // need to get only expansions with a game id that matches current game
    const expansionsMap = data.expansions
        .filter(e=> e.gameId === gameId)
        .map(e => `<option value="${e.id}">${e.name}</option>`)
        .join("")

    

    app.innerHTML = `
    <h2>Log Play</h2>
    <h3>${game.name}</h3>
    <form id="log-play-form">
        <label for="date-input">Date: </label>
        <input type="date" id="date-input" name="date" required"><br />

        <label for="players-select">Players: </label><br />
        <select id="players-select" multiple size="5" required>${playersMap}</select><br />
        
        <label for="antagonists-select">Antagonists: </label><br />
        <select id="antagonists-select" multiple size="5">${antagonistsMap}</select><br />

        <label for="modules-select">Modules: </label><br />
        <select id="modules-select" multiple size="5">${modulesMap}</select><br />

        <label for="expansions-select">Expansions: </label><br />
        <select id="expansions-select" multiple size="5">${expansionsMap}</select><br />

        <p class="button">
            <button type="submit" id="save-play-btn">Save Play</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </p>
    </form>
    `

    const today = new Date().toISOString().split("T")[0]; 
    document.getElementById("date-input").value = today;

    attachAddPlayHandlers(gameId)
}

function attachAddPlayHandlers(gameId){
    const form = document.getElementById("log-play-form")
    form.addEventListener("keydown", (event)=> {
        if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault()
    })

    document.getElementById("cancel-btn").addEventListener("click", ()=>renderGameDetailView(gameId))

    const playersSelect = document.getElementById("players-select")
    const antagonistsSelect = document.getElementById("antagonists-select")
    const modulesSelect = document.getElementById("modules-select")
    const expansionsSelect = document.getElementById("expansions-select")



    form.addEventListener("submit", (event)=>{
        event.preventDefault()
        const players = Array.from(playersSelect).filter(opt=>opt.selected).map(opt=>opt.value)
        const antagonists = Array.from(antagonistsSelect).filter(opt=>opt.selected).map(opt=>opt.value)
        const modules = Array.from(modulesSelect).filter(opt=>opt.selected).map(opt=>opt.value)
        const expansions = Array.from(expansionsSelect).filter(opt=>opt.selected).map(opt=>opt.value)
        const newPlay = {
            id: crypto.randomUUID(),
            date: document.getElementById("date-input").value.trim(),
            game: gameId,
            players: players,
            antagonists: antagonists,
            modules: modules,
            expansions: expansions,
        }

        savePlay(newPlay)
        renderGameDetailView(gameId)
    })
}

function savePlay(play){
    const data = JSON.parse(localStorage.getItem("playTrackerData")) || {
        games: [],
        expansions: [],
        players: [],
        plays: [],
    }

    data.plays.push(play)
    localStorage.setItem("playTrackerData", JSON.stringify(data))
}

function renderPlayDetailView(playId){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const play = data.plays.find(p => p.id === playId)
    if (!play) {
        app.innerHTML = `<p>Play not found.</p>`;
        return
    }

    app.innerHTML = `
    <p><strong>Game: </strong>${getVal(data, "games", play.game).name}</p>
    <p><strong>Date: </strong>${play.date}</p>
    <p><strong>Players: </strong>${play.players.map(p=>getVal(data,"players",p).name).join(", ")}</p>
    <p><strong>Antagonists: </strong>${play.antagonists.join(", ")}</p>
    <p><strong>Modules: </strong>${play.modules.join(", ")}</p>
    <p><strong>Expansions: </strong>${play.expansions.map(e=>getVal(data, "expansions", e).name).join(", ")}</p>

    <div>
    <button type="button" id="back-btn">Back</button>
    </div>
    `
    document.getElementById("back-btn").addEventListener("click", renderPlayListView)

}

// EXPANSIONS
// - 1. Add Expansion form
// Name, Roles, Antagonists, Modules
function renderAddExpansionView(gameId){
    const app = document.getElementById("app")    

    app.innerHTML = `
    <h2>Add Expansion</h2>
    <form id="add-expansion-form">            
        <label for="expansion-input">Expansion Name: </label>
        <input type="text" id="expansion-name-input" name="expansion_name" required>

        <div id="roles-section">
            <label for="role-input">Roles: </label>
            <input type="text" id="role-input">
            <button type="button" id="add-role-btn">Add Role</button>
            <ul id="roles-list"></ul>
        </div>

        <div id="antagonists-section">
            <label for="antagonist-input">Antagonists: </label>
            <input type="text" id="antagonist-input">
            <button type="button" id="add-antagonist-btn">Add Antagonist</button>
            <ul id="antagonists-list"></ul>
        </div>

        <div id="modules-section">
            <label for="module-input">Modules: </label>
            <input type="text" id="module-input">
            <button type="button" id="add-module-btn">Add Module</button>
            <ul id="modules-list"></ul>
        </div>

        <p class="button">
            <button type="submit">Save</button>
            <button type="button" id="cancel-btn">Cancel</button>
        </p>
    </form>
    `

    attachAddExpansionHandlers(gameId)
}

// - 2. Expansion object creation
/* 
id:
gameId: a direct reference to the game it lives under
name:
antagonists: []
modules: []
roles: []
*/
function attachAddExpansionHandlers(gameId){
    const form = document.getElementById("add-expansion-form")
    form.addEventListener("keydown", (event)=> {
        if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault()
    })
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const game = data.games.find(g => g.id === gameId)
    document.getElementById("cancel-btn").addEventListener("click", ()=>{renderGameDetailView(gameId)})
        //roles
    const roleInput = document.getElementById("role-input");
    const rolesList = document.getElementById("roles-list");
    const addRoleBtn = document.getElementById("add-role-btn");
    const roles = [];
    addRoleBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newRole = roleInput.value.trim()
        if (newRole!=""){
            roles.push(newRole)
            const li = document.createElement("li")
            li.textContent = newRole
            rolesList.appendChild(li)
            roleInput.value = ""
        }
    })

    //antagonists
    const antagonistInput = document.getElementById("antagonist-input");
    const antagonistsList = document.getElementById("antagonists-list");
    const addAntagonistBtn = document.getElementById("add-antagonist-btn");
    const antagonists = [];
    addAntagonistBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newAntagonist = antagonistInput.value.trim()
        if (newAntagonist!=""){
            antagonists.push(newAntagonist)
            const li = document.createElement("li")
            li.textContent = newAntagonist
            antagonistsList.appendChild(li)
            antagonistInput.value = ""
        }
    })

    //modules
    const moduleInput = document.getElementById("module-input");
    const modulesList = document.getElementById("modules-list");
    const addModuleBtn = document.getElementById("add-module-btn");
    const modules = [];
    addModuleBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newModule = moduleInput.value.trim()
        if (newModule!=""){
            modules.push(newModule)
            const li = document.createElement("li")
            li.textContent = newModule
            modulesList.appendChild(li)
            moduleInput.value = ""
        }
    })

    //submit expansion
    form.addEventListener("submit", (event)=> {
        event.preventDefault()
        //build expansion object
        const newExpansion = {
            id: crypto.randomUUID(),
            gameId: gameId,
            name: document.getElementById("expansion-name-input").value.trim(),
            roles,
            antagonists,
            modules
        }
        game.expansionIds.push(newExpansion.id)
        saveGame(game)        
        saveExpansion(newExpansion)
        renderGameDetailView(gameId)
    })
}

function saveExpansion(expansion){
        const data = JSON.parse(localStorage.getItem("playTrackerData")) || {
        games: [],
        expansions: [],
        players: [],
        plays: [],
    }

    data.expansions.push(expansion)
    localStorage.setItem("playTrackerData", JSON.stringify(data))
}

function renderExpansionDetailView(expansionId){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const expansion = data.expansions.find(e=>e.id===expansionId)    
    const game = getVal(data, "games", expansion.gameId)

    app.innerHTML = `
    <h2>${game.name}</h2>
    <h3>${expansion.name}</h3>
    <p><strong>Roles: </strong>${expansion.roles.join(", ")}</p>
    <p><strong>Antagonists: </strong>${expansion.antagonists.join(", ")}</p>
    <p><strong>Modules: </strong>${expansion.modules.join(", ")}</p>
    <div>
    <button type="button" id="edit-btn">Edit Expansion</button>
    <button type="button" id="back-btn">Back</button>
    </div>
    `
    document.getElementById("back-btn").addEventListener("click", ()=>renderGameDetailView(expansion.gameId))
    document.getElementById("edit-btn").addEventListener("click", () => renderEditExpansionView(expansionId) )
}

function renderEditExpansionView(expansionId){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const expansion = data.expansions.find(g => g.id === expansionId)
    app.innerHTML = `
    <h2>${expansion.name}</h2>
    <form id="edit-expansion-form">
        <label for="expansion-input">expansion: </label>
        <input type="text" id="expansion-name-input" name="expansion_name" value="${expansion.name}" required>

        <div id="roles-section">
            <label for="role-input">Roles: </label>
            <input type="text" id="role-input">
            <button type="button" id="add-role-btn">Add Role</button>
            <ul id="roles-list"></ul>
        </div>

        <div id="antagonists-section">
            <label for="antagonist-input">Antagonists: </label>
            <input type="text" id="antagonist-input">
            <button type="button" id="add-antagonist-btn">Add Antagonist</button>
            <ul id="antagonists-list"></ul>
        </div>

        <div id="modules-section">
            <label for="module-input">Modules: </label>
            <input type="text" id="module-input">
            <button type="button" id="add-module-btn">Add Module</button>
            <ul id="modules-list"></ul>
        </div>

        <div class="button">
            <button type="submit">Save</button>
            <button type="button" id="cancel-btn">Cancel</button>        
        </div>
    </form>
    `
    document.getElementById("cancel-btn").addEventListener("click", ()=>renderExpansionDetailView(expansionId))
    attachEditExpansionHandlers(expansionId)
}

function attachEditExpansionHandlers(expansionId){
    const form = document.getElementById("edit-expansion-form")
    form.addEventListener("keydown", (event)=> {
        if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault()
    })
    const data = JSON.parse(localStorage.getItem("playTrackerData"))
    const expansion = data.expansions.find(f => f.id === expansionId)

    //roles
    const roleInput = document.getElementById("role-input");
    const rolesList = document.getElementById("roles-list");
    const addRoleBtn = document.getElementById("add-role-btn");
    const roles = [...expansion.roles];
    roles.forEach(r=>{
        const li = document.createElement("li")
        li.textContent = r
        rolesList.appendChild(li)
    })
    addRoleBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newRole = roleInput.value.trim()
        if (newRole!=""){
            roles.push(newRole)
            const li = document.createElement("li")
            li.textContent = newRole
            rolesList.appendChild(li)
            roleInput.value = ""
        }
    })

    //antagonists
    const antagonistInput = document.getElementById("antagonist-input");
    const antagonistsList = document.getElementById("antagonists-list");
    const addAntagonistBtn = document.getElementById("add-antagonist-btn");
    const antagonists = [...expansion.antagonists];
    antagonists.forEach(a=>{
        const li = document.createElement("li")
        li.textContent = a
        antagonistsList.appendChild(li)
    })
    addAntagonistBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newAntagonist = antagonistInput.value.trim()
        if (newAntagonist!=""){
            antagonists.push(newAntagonist)
            const li = document.createElement("li")
            li.textContent = newAntagonist
            antagonistsList.appendChild(li)
            antagonistInput.value = ""
        }
    })
    //modules
    const moduleInput = document.getElementById("module-input");
    const modulesList = document.getElementById("modules-list");
    const addModuleBtn = document.getElementById("add-module-btn");
    const modules = [...expansion.modules];
    modules.forEach(a=>{
        const li = document.createElement("li")
        li.textContent = a
        modulesList.appendChild(li)
    })
    addModuleBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newModule = moduleInput.value.trim()
        if (newModule!=""){
            modules.push(newModule)
            const li = document.createElement("li")
            li.textContent = newModule
            modulesList.appendChild(li)
            moduleInput.value = ""
        }
    })

    form.addEventListener("submit", (event)=>{
        event.preventDefault()

        //update expansion object
        expansion.name = document.getElementById("expansion-name-input").value.trim()        
        expansion.roles = roles
        expansion.antagonists = antagonists
        expansion.modules = modules

        localStorage.setItem("playTrackerData", JSON.stringify(data))
        renderExpansionDetailView(expansionId)

    })
}

function initData(){
    const raw = localStorage.getItem("playTrackerData")
    let data
    
    try {
        data = raw ? JSON.parse(raw) : null
    } catch {
        data = null
    }

    // Define data shape
    const defaultShape = {
        games: [],
        expansions: [],
        players: [],
        plays: []
    }

    // Check structure
    if (!data || typeof data !== "object"){
        localStorage.setItem("playTrackerData", JSON.stringify(defaultShape))
        return defaultShape
    }

    let changed = false
    for (const key in defaultShape){
        if (!Array.isArray(data[key])) {
            data[key] = []
            changed = true
        }
    }

    if (changed) localStorage.setItem("playTrackerData", JSON.stringify(data))
    return data
}

//* RUN THE APP
function runGameTracker(){
    initData()
    renderNav()
    renderGameListView()
}

runGameTracker()



