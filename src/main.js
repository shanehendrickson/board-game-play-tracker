
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
    <p><strong>Designed by: </strong>${game.designer.join(", ")}</p>
    <p><strong>Roles: </strong>${game.roles.join(", ")}</p>
    <p><strong>Antagonists: </strong>${game.antagonists.join(", ")}</p>
    <button id="edit-btn">Edit Game</button>
    <button id="back-btn">Back to Games</button>
    `
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


        <p class="button">
            <button type="submit">Save</button>
        </p>
        <p class="button">
            <button id="cancel-btn">Cancel</button>
        </p>
    </form>
    `


    document.getElementById("cancel-btn").addEventListener("click", ()=>renderGameDetailView(gameId))
    attachEditGameHandlers(gameId)
}

function attachEditGameHandlers(gameId){
    const form = document.getElementById("edit-game-form")
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

    form.addEventListener("submit", (event)=>{
        event.preventDefault()

        //update game object
        game.name = document.getElementById("game-name-input").value.trim()
        game.designer = designer
        game.publisher = document.getElementById("publisher-input").value.trim()
        game.roles = roles
        game.antagonists = antagonists

        localStorage.setItem("playTrackerData", JSON.stringify(data))
        renderGameDetailView(gameId)

    })
}
