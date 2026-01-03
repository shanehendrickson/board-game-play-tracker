
// add a simple Add Game form
function renderAddGameView(){
    const app = document.getElementById("app")

    app.innerHTML = `
    <h2>Add Game</h2>
    <form id="add-game-form">            
        <label for="game-input">Game: </label>
        <input type="text" id="game-name-input" name="game_name" required>

        <div id="designers-section">
            <label for="designer-input">Designers: </label>
            <input type="text" id="designer-input">
            <button type="button" id="add-designer-btn">Add Designer</button>
            <ul id="designers-list"></ul>
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


        <p class="button">
            <button type="submit">Add Game</button>
        </p>
    </form>
    `;

    attachAddGameHandlers();
}

// function to create a Game object
function attachAddGameHandlers() {
    const form = document.getElementById("add-game-form")
    //TODO - comes back and simplify designer, roles, and antagonists into a single function maybe
    //designer
    const designerInput = document.getElementById("designer-input");
    const designersList = document.getElementById("designers-list");
    const addDesignerBtn = document.getElementById("add-designer-btn");
    const designers = [];
    addDesignerBtn.addEventListener("click", ()=> {
        //make sure not empty
        const newDesigner = designerInput.value.trim()
        if (newDesigner!=""){
            designers.push(newDesigner)
            const li = document.createElement("li")
            li.textContent = newDesigner
            designersList.appendChild(li)
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

    //submit game
    form.addEventListener("submit", (event)=> {
        event.preventDefault()
        //build game object
        const newGame = {
            id: crypto.randomUUID(),
            name: document.getElementById("game-name-input").value.trim(),
            designer: designers,
            publisher: document.getElementById("publisher-input").value.trim(),
            roles,
            antagonists,
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

    data.games.push(game)

    localStorage.setItem("playTrackerData", JSON.stringify(data))
}

// a Game List view for confirmation
function renderGameListView(){
    const app = document.getElementById("app")
    const data = JSON.parse(localStorage.getItem("playTrackerData") || { games: []})

    app.innerHTML = `
    <h2>Games</h2>
    <ul id="game-list">
        ${data.games.map(g => `<li data-id="${g.id}">${g.name}</li>`).join("")}
    </ul>
    <button id="add-game-btn">Add Another Game</button>
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

// kick off the app
// renderAddGameView()
renderGameListView()

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
    <p><strong>Designers: </strong>${game.designer.join(", ")}</p>
    <p><strong>Roles: </strong>${game.roles.join(", ")}</p>
    <p><strong>Antagonists: </strong>${game.antagonists.join(", ")}</p>
    <button id="back-btn">Back to Games</button>
    `

    document.getElementById("back-btn").addEventListener("click", renderGameListView)
}