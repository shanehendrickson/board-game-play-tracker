//* NAVIGATION
function renderNav() {
    const nav = document.getElementById("nav");
    const container = document.createElement("div")
    nav.innerHTML = ""

    const buttonRow = document.createElement("div")
    buttonRow.classList.add("button-row")
    
    const gamesBtn = document.createElement("button")
    gamesBtn.textContent = "Games"
    gamesBtn.addEventListener("click", renderGameListView);
    buttonRow.appendChild(gamesBtn)
    
    const playersBtn = document.createElement("button")
    playersBtn.textContent = "Players"
    playersBtn.addEventListener("click", renderPlayerListView);
    buttonRow.appendChild(playersBtn)
    
    const sessionsBtn = document.createElement("button")
    sessionsBtn.textContent = "Sessions"
    sessionsBtn.addEventListener("click", renderSessionListView);
    buttonRow.appendChild(sessionsBtn)


    container.appendChild(buttonRow)
    nav.appendChild(container)

}

function getVal(data, model, id) {
	return data[model].find((m) => m.id === id);
}

function checkDuplicate(data, model, item, check) {
	return data[model].find(
		(i) => i[check].toLowerCase() === item[check].toLowerCase(),
	);
}

function populateTextField() {}

function populateListField(containerId, items, label) {
	const container = document.getElementById(containerId);
	container.innerHTML = "";

	//title
	const title = document.createElement("h3");
	title.textContent = label;
	container.appendChild(title);

	//input
	const input = document.createElement("input");
	input.placeholder = `Add ${label.slice(0, -1)}`;
	container.appendChild(input);

	//add button
	const addBtn = document.createElement("button");
	addBtn.type = "button";
	addBtn.textContent = "Add";
	container.appendChild(addBtn);

	//ul
	const ul = document.createElement("ul");

	container.appendChild(ul);

	//render list function
	function renderList() {
		ul.innerHTML = "";
		items.forEach((item, index) => {
			const li = document.createElement("li");

			li.textContent = item;

			const removeBtn = document.createElement("button");
			removeBtn.type = "button";
			removeBtn.textContent = "x";
			removeBtn.addEventListener("click", () => {
				items.splice(index, 1);
				renderList();
			});
			li.appendChild(removeBtn);
			ul.appendChild(li);
		});
	}

	//add button event listener -> calls render list function
	addBtn.addEventListener("click", () => {
		const value = input.value.trim();
		if (value !== "") {
			items.push(value);
			input.value = "";
			renderList();
		}
	});
	renderList();
}

//* RENDER LIST VIEWS
function renderListView({ title, items, onSelect, onAdd, getLabel }) {
	const app = document.getElementById("app");
	app.innerHTML = "";

	const h2 = document.createElement("h2");
	h2.textContent = title;
	app.appendChild(h2);

	// list all items
	const ul = document.createElement("ul");
	ul.classList.add("list-view");
	items.forEach((item) => {
		const li = document.createElement("li");
		li.classList.add("list-item");
		li.textContent = getLabel ? getLabel(item) : item.name;
		li.dataset.id = item.id;
		li.style.cursor = "pointer";
		li.addEventListener("click", () => onSelect(item.id));
		ul.appendChild(li);
	});
	app.appendChild(ul);

	const addBtn = document.createElement("button");
	addBtn.type = "button";
	addBtn.textContent = `Add ${title.slice(0, -1)}`;
	addBtn.addEventListener("click", onAdd);

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");
	buttonRow.appendChild(addBtn);

    app.appendChild(buttonRow)
}

//* List View Routers
function renderGameListView() {
	const data = getData();
	renderListView({
		title: "Games",
		items: data.games,
		onSelect: renderGameDetailView,
		onAdd: renderGameFormView,
	});
}

function renderPlayerListView() {
	const data = getData();
	renderListView({
		title: "Players",
		items: data.players,
		onSelect: renderPlayerDetailView,
		onAdd: renderPlayerFormView,
	});
}

function renderSessionListView() {
	const data = getData();
	renderListView({
		title: "Sessions",
		items: data.sessions,
		getLabel: (session) => {
			const game = data.games.find((g) => g.id === session.gameId);
			const date = session.date || "(no date)";
			return `${game.name} — ${date}`;
		},
		onSelect: renderSessionDetailView,
		onAdd: renderSessionFormView,
	});
}

//* GAMES

function renderGameFormView(mode, gameId) {
	const data = getData();

	// check if game exists - yes: retrieve; no: create empty game object
	const game =
		mode === "edit"
			? data.games.find((g) => g.id === gameId)
			: {
					id: crypto.randomUUID(),
					name: "",
					designers: [],
					publisher: "",
					roles: [],
					antagonists: [],
					modules: [],
					expansionIds: [],
				};

	// set up conditional html based on mode 'add' or 'edit'
    

	const app = document.getElementById("app");
	app.innerHTML = "";

	const h2 = document.createElement("h2");
	h2.textContent = mode == "edit" ? "Edit Game" : "New Game";
	app.appendChild(h2);

	// --- Name field ---
	const nameLabel = document.createElement("label");
	nameLabel.textContent = "Game Name: ";
	const nameInput = document.createElement("input");
	nameInput.id = "game-name-input";
	nameInput.value = game.name;
	app.appendChild(nameLabel);
	app.appendChild(nameInput);

	// --- Designers list ---
	let designers = [...game.designers];
	const designersContainer = document.createElement("div");
	designersContainer.id = "designers-container";
	app.appendChild(designersContainer);
	populateListField("designers-container", designers, "Designers");

	// -- Publisher field ---
	const publisherLabel = document.createElement("label");
	publisherLabel.textContent = "Publisher: ";
	const publisherInput = document.createElement("input");
	publisherInput.id = "publisher-input";
	publisherInput.value = game.publisher;
	app.appendChild(publisherLabel);
	app.appendChild(publisherInput);

	// --- Roles list ---
	let roles = [...game.roles];
	const rolesContainer = document.createElement("div");
	rolesContainer.id = "roles-container";
	app.appendChild(rolesContainer);
	populateListField("roles-container", roles, "Roles");

	// --- Antagonists list ---
	let antagonists = [...game.antagonists];
	const antagonistsContainer = document.createElement("div");
	antagonistsContainer.id = "antagonists-container";
	app.appendChild(antagonistsContainer);
	populateListField("antagonists-container", antagonists, "Antagonists");

	// --- Modules list ---
	let modules = [...game.modules];
	const modulesContainer = document.createElement("div");
	modulesContainer.id = "modules-container";
	app.appendChild(modulesContainer);
	populateListField("modules-container", modules, "Modules");

	// --- Expansion IDs list ---

	// --- Save & Cancel buttons ---
	const saveBtn = document.createElement("button");
	saveBtn.type = "button";
	saveBtn.textContent = mode === "edit" ? "Save Changes" : "Add Game";
	saveBtn.id = "save-game-btn";
	app.appendChild(saveBtn);

	const cancelBtn = document.createElement("button");
	cancelBtn.type = "button";
	cancelBtn.textContent = "Cancel";
	cancelBtn.addEventListener("click", () => {
		if (mode === "edit") renderGameDetailView(game.id);
		else renderGameListView();
	});
	app.appendChild(cancelBtn);

	attachGameFormHandlers(game, { designers, roles, antagonists, modules });
}

function attachGameFormHandlers(game, lists) {
	const saveBtn = document.getElementById("save-game-btn");
	saveBtn.addEventListener("click", () => {
		game.name = document.getElementById("game-name-input").value.trim();
		game.publisher = document.getElementById("publisher-input").value.trim();
		game.designers = lists.designers;
		game.roles = lists.roles;
		game.antagonists = lists.antagonists;
		game.modules = lists.modules;

		saveGame(game);
		renderGameDetailView(game.id);
	});
}

// add a game detail view
function renderGameDetailView(gameId) {
	const data = getData();
	const game = data.games.find((g) => g.id === gameId);

	const container = document.createElement("div");
	container.classList.add("detail-view");

	const title = document.createElement("h2");
	title.textContent = game.name;
	container.appendChild(title);

	addInlineSection(container, "Publisher", game.publisher);
	addInlineSection(container, "Designers", game.designers.join(", "));

	if (game.roles.length) addListSection(container, "Roles", game.roles);
	if (game.antagonists.length)
		addListSection(container, "Antagonists", game.antagonists);
	if (game.modules.length) addListSection(container, "Modules", game.modules);

	const expansionNames = game.expansionIds.map(
		(ex) => getVal(data, "expansions", ex).name,
	);
	if (expansionNames.length)
		addListSection(container, "Expansions", expansionNames);

	const backBtn = document.createElement("button");
	backBtn.textContent = "Back";
	backBtn.addEventListener("click", () => renderGameListView());

	const editBtn = document.createElement("button");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () => renderGameFormView("edit", gameId));

	const addExpBtn = document.createElement("button");
	addExpBtn.textContent = "Add Expansion";
	addExpBtn.addEventListener("click", () =>
		renderExpansionFormView("add", null, gameId),
	);

	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => deleteGame(gameId));

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	buttonRow.appendChild(backBtn);
	buttonRow.appendChild(editBtn);
	buttonRow.appendChild(addExpBtn);
	buttonRow.appendChild(deleteBtn);

	container.appendChild(buttonRow);

	render(container);
}

function saveGame(game) {
	const data = getData();
	const index = data.games.findIndex((g) => g.id === game.id);
	if (index !== -1) data.games[index] = game;
	else data.games.push(game);
}

function deleteGame(gameId) {
	const data = getData();
	data.expansions = data.expansions.filter((e) => e.gameId !== gameId);
	data.sessions = data.sessions.filter((s) => s.gameId !== gameId);
	data.games = data.games.filter((g) => g.id !== gameId);
	saveData(data);
	renderGameListView();
}

//* EXPANSIONS

//* PLAYERS
function renderPlayerFormView(mode, playerId) {
	const data = getData();

	//check for existing player, retrieve or create
	const player =
		mode === "edit"
			? data.players.find((p) => p.id === playerId)
			: {
					id: crypto.randomUUID(),
					name: "",
				};

	const app = document.getElementById("app");
	app.innerHTML = "";

	const h2 = document.createElement("h2");
	h2.textContent = mode == "edit" ? "Edit Player" : "New Player";
	app.appendChild(h2);

	const nameLabel = document.createElement("label");
	nameLabel.textContent = "Player Name: ";
	const nameInput = document.createElement("input");
	nameInput.id = "player-name-input";
	nameInput.value = player.name;
	app.appendChild(nameLabel);
	app.appendChild(nameInput);

	const saveBtn = document.createElement("button");
	saveBtn.type = "button";
	saveBtn.textContent = mode === "edit" ? "Save Changes" : "Add Player";
	saveBtn.id = "save-game-btn";
	app.appendChild(saveBtn);

	const cancelBtn = document.createElement("button");
	cancelBtn.type = "button";
	cancelBtn.textContent = "Cancel";
	cancelBtn.addEventListener("click", () => {
		if (mode === "edit") renderPlayerDetailView(player.id);
		else renderPlayerListView();
	});
	app.appendChild(cancelBtn);

	attachPlayerFormHandlers(player);
}

function attachPlayerFormHandlers(player) {
	const saveBtn = document.getElementById("save-game-btn");
	saveBtn.addEventListener("click", () => {
		player.name = document.getElementById("player-name-input").value.trim();

		savePlayer(player);
		renderPlayerDetailView(player.id);
	});
}

function renderPlayerDetailView(playerId) {
	const data = getData();

	// TODO - get sessions
	// create array with sessions.filter => session players.some where playerId matches
	// get length of total sessions array

	// set up counts upject for palys of specific games
	// loop through above array and check game id
	// add new or increment if exists
	// sotre in variable: sort through with an object.entries .sort((a,b) => b[1] - a[1])[0]?.[0]
	// get the game from the one with the highest count

	const player = data.players.find((p) => p.id === playerId);

	const container = document.createElement("div");
	container.classList.add("detail-view");

	const title = document.createElement("h2");
	title.textContent = player.name;
	container.appendChild(title);

	//TODO - hook these up
	addInlineSection(container, "Total Plays", 0);
	addInlineSection(container, "Total Wins", 0);
	addInlineSection(container, "Most Played", "");

	// Buttons
	const backBtn = document.createElement("button");
	backBtn.textContent = "Back";
	backBtn.addEventListener("click", () => renderPlayerListView());

	const editBtn = document.createElement("button");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () =>
		renderPlayerFormView("edit", sessionId),
	);

	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => deletePlayer(playerId));

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	buttonRow.appendChild(backBtn);
	buttonRow.appendChild(editBtn);
	buttonRow.appendChild(deleteBtn);

	container.appendChild(buttonRow);

	render(container);
}

function savePlayer(player) {
	const data = getData();
	const index = data.players.findIndex((p) => p.id === player.id);
	if (index !== -1) data.players[index] = session;
	else data.players.push(player);

	saveData(data);
}

function deletePlayer(playerId) {
	const data = getData();

	// Remove player from all sessions
	data.sessions.forEach((session) => {
		session.participants = session.participants.filter(
			(p) => p.playerId !== playerId,
		);
	});

	// Delete player
	data.players = data.players.filter((p) => p.id !== player);
}

//* SESSIONS
function renderSessionFormView(mode, sessionId, gameId) {
	const data = getData();
	let session;

	if (mode === "edit") {
		session = data.sessions.find((s) => s.id === sessionId);
		gameId = session.gameId;
	} else {
		session = {
			id: crypto.randomUUID(),
			gameId: gameId,
			date: "",
			participants: [],
			antagonistsUsed: [],
			modulesUsed: [],
			expansionsUsed: [],
		};
	}

	const game = data.games.find((g) => g.id === gameId);

	const app = document.getElementById("app");
	app.innerHTML = "";

	const h2 = document.createElement("h2");
	h2.textContent =
		mode == "edit" ? "Edit Session" : `Log New ${game.name} Session`;
	app.appendChild(h2);

	// DATE
	const dateLabel = document.createElement("label");
	dateLabel.textContent = "Date: ";
	const dateInput = document.createElement("input");
	dateInput.id = "date-input";
	dateInput.type = "date";
	dateInput.value = session.date || new Date().toISOString().slice(0, 10);
	app.appendChild(dateLabel);
	app.appendChild(dateInput);

	// PARTICIPANTS
	const participantsContainer = document.createElement("div");
	participantsContainer.id = "participants-container";
	app.appendChild(participantsContainer);

	renderParticipantsSelector(
		participantsContainer,
		session.participants,
		data.players,
		game.roles,
	);

	// ANTAGONISTS
	const antagonistsContainer = document.createElement("div");
	antagonistsContainer.id = "antagonists-container";
	app.appendChild(antagonistsContainer);

	renderMultiSelect(
		antagonistsContainer,
		"Antagonists Used",
		session.antagonistsUsed,
		game.antagonists,
	);

	// MODULES
	const modulesContainer = document.createElement("div");
	modulesContainer.id = "modules-container";
	app.appendChild(modulesContainer);

	renderMultiSelect(
		modulesContainer,
		"Modules Used",
		session.modulesUsed,
		game.modules,
	);

	// EXPANSIONS
	const expansionsContainer = document.createElement("div");
	expansionsContainer.id = "expansions-container";
	app.appendChild(expansionsContainer);

	renderMultiSelect(
		expansionsContainer,
		"Expansions Used",
		session.expansionsUsed,
		data.expansions.filter((e) => e.gameId === gameId),
	);

	// SAVE / CANCEL
	const saveBtn = document.createElement("button");
	saveBtn.type = "button";
	saveBtn.textContent = mode === "edit" ? "Save Changes" : "Add Session";
	saveBtn.id = "save-session-btn";
	app.appendChild(saveBtn);

	const cancelBtn = document.createElement("button");
	cancelBtn.type = "button";
	cancelBtn.textContent = "Cancel";
	cancelBtn.addEventListener("click", () => {
		if (mode === "edit") {
			renderSessionDetailView(session.id);
		} else {
			renderGameDetailView(gameId);
		}
	});
	app.appendChild(cancelBtn);

	attachSessionFormHandlers(mode, session, {
		dateInput,
	});
}

function renderParticipantsSelector(
	container,
	participants,
	players,
	gameRoles,
) {
	container.innerHTML = "<h3>Participants</h3>";

	const addBtn = document.createElement("button");
	addBtn.type = "button";
	addBtn.textContent = "Add Participant";
	container.appendChild(addBtn);

	// div for participants list
	const list = document.createElement("div");
	container.appendChild(list);

	function renderList() {
		list.innerHTML = "";

		participants.forEach((p, index) => {
			const row = document.createElement("div");

			// Player Select
			const playerSelect = document.createElement("select");
			players.forEach((pl) => {
				const opt = document.createElement("option");
				opt.value = pl.id;
				opt.textContent = pl.name;
				if (pl.id === p.playerId) opt.selected = true;
				playerSelect.appendChild(opt);
			});
			playerSelect.addEventListener("change", () => {
				p.playerId = playerSelect.value;
			});
			row.appendChild(playerSelect);

			// Roles - affect gameplay in some way
			//TODO - maybe refactor into a single line downdown list?
			const rolesSelect = document.createElement("select");
			rolesSelect.multiple = true;
			gameRoles.forEach((r) => {
				const opt = document.createElement("option");
				opt.value = r;
				opt.textContent = r;
				if (p.roles && p.roles.includes(r)) opt.selected = true;
				rolesSelect.appendChild(opt);
			});
			rolesSelect.addEventListener("change", () => {
				p.roles = Array.from(rolesSelect.selectedOptions).map((o) => o.value);
			});
			row.appendChild(rolesSelect);

			// Aliases - cosmetic only - color, seat, etc
			p.aliases = p.aliases || [];

			const aliasInput = document.createElement("input");
			aliasInput.placeholder = "Add alias";
			row.appendChild(aliasInput);

			const aliasBtn = document.createElement("button");
			aliasBtn.type = "button";
			aliasBtn.textContent = "Add";
			aliasBtn.addEventListener("click", () => {
				const val = aliasInput.value.trim();
				if (val) {
					p.aliases.push(val);
					aliasInput.value = "";
					renderList();
				}
			});
			row.appendChild(aliasBtn);

			const aliasList = document.createElement("ul");
			p.aliases.forEach((a, i) => {
				const li = document.createElement("li");
				li.textContent = a;
				const x = document.createElement("button");
				x.type = "button";
				x.textContent = "x";
				x.addEventListener("click", () => {
					p.aliases.splice(i, 1);
					renderList();
				});
				li.appendChild(x);
				aliasList.appendChild(li);
			});

			// Remove Participant
			const removeBtn = document.createElement("button");
			removeBtn.type = "button";
			removeBtn.textContent = "Remove";
			removeBtn.addEventListener("click", () => {
				participants.splice(index, 1);
				renderList();
			});
			row.appendChild(removeBtn);

			list.appendChild(row);
		});
	}

	addBtn.addEventListener("click", () => {
		participants.push({
			playerId: players[0]?.id || "",
			roles: [],
			aliases: [],
		});
		renderList();
	});

	renderList();
}

function attachSessionFormHandlers(mode, session, fields) {
	const saveBtn = document.getElementById("save-session-btn");

	saveBtn.addEventListener("click", () => {
		session.date = fields.dateInput.value.trim();

		saveSession(session);

		if (mode === "edit") {
			renderSessionDetailView(session.id);
		} else {
			renderGameDetailView(session.gameId);
		}
	});
}

function renderSessionDetailView(sessionId) {
	const data = getData();
	const session = data.sessions.find((s) => s.id === sessionId);
	const game = data.games.find((g) => g.id == session.gameId);

	const container = document.createElement("div");
	container.classList.add("detail-view");

	const title = document.createElement("h2");
	title.textContent = `${game.name} - ${session.date || "(no date)"}`;
	container.appendChild(title);

	// Participants
	const participantInfo = session.participants.map((p) => {
		const participant = data.players.find((pl) => pl.id == p.playerId);
		const name = participant.name;
		const roles = p.roles?.length ? ` - Roles: ${p.roles.join(", ")}` : "";
		const alias = p.alias ? ` - ${p.alias}` : "";
		return `${name}${roles}${alias}`;
	});
	addListSection(container, "Participants", participantInfo);

	const expansionNames = session.expansionsUsed.map(
		(ex) => getVal(data, "expansions", ex).name,
	);
	if (expansionNames.length)
		addListSection(container, "Expansions", expansionNames);

	if (session.antagonistsUsed.length)
		addListSection(container, "Antagonists", session.antagonistsUsed);

	if (session.modulesUsed.length)
		addListSection(container, "Modules", session.modulesUsed);

	// Buttons
	const backBtn = document.createElement("button");
	backBtn.textContent = "Back";
	backBtn.addEventListener("click", () => renderSessionListView());

	const editBtn = document.createElement("button");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () =>
		renderSessionFormView("edit", sessionId),
	);

	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => deleteSession(sessionId));

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	buttonRow.appendChild(backBtn);
	buttonRow.appendChild(editBtn);
	buttonRow.appendChild(deleteBtn);

	container.appendChild(buttonRow);

	render(container);
}

function saveSession(session) {
	const data = getData();
	const index = data.sessions.findIndex((s) => s.id === session.id);
	if (index !== -1) data.sessions[index] = session;
	else data.sessions.push(session);

	saveData(data);
}

function deleteSession(sessionId) {
	const data = getData();
	data.sessions = data.sessions.filter((s) => s.id !== sessionId);
	saveData(data);
	renderSessionListView();
}
//* EXPANSIONS
function saveExpansion(expansion) {
	const data = getData();
	const index = data.expansions.findIndex((e) => e.id === expansion.id);
	if (index !== -1) data.expansions[index] = expansion;
	else data.expansions.push(expansion);
}

function deleteExpansion(expansionId) {
	const data = getData();

	// Remove expansion from all sessions
	data.sessions.forEach((session) => {
		session.expansionsUsed = session.expansionsUsed.filter(
			(id) => id !== expansionId,
		);
	});

	// Remove expansionId from its parent game's expansionIds array
	data.games.forEach((game) => {
		game.expansionIds = game.expansionIds.filter((id) => id !== expansionId);
	});

	// Delete the expansion itself
	data.expansions = data.expansions.filter((e) => e.id !== expansionId);

	// Save and return to expansion list
	saveData(data);
	renderExpansionListView();
}

//* UTILS

function render(container) {
	const app = document.getElementById("app");
	app.innerHTML = "";
	app.appendChild(container);
}

function renderMultiSelect(container, label, selectedArray, options) {
	container.innerHTML = `<h3>${label}</h3>`;

	const select = document.createElement("select");
	select.multiple = true;

	options.forEach((opt) => {
		const value = opt.id || opt;
		const text = opt.name || opt;
		const option = document.createElement("option");
		option.value = value;
		option.text = text;
		if (selectedArray.includes(value)) option.selected = true;
		select.appendChild(option);
	});

	select.addEventListener("change", () => {
		selectedArray.length = 0;
		selectedArray.push(
			...Array.from(select.selectedOptions).map((o) => o.value),
		);
	});

	container.appendChild(select);
}

function addInlineSection(container, label, value) {
	const header = document.createElement("div");
	header.classList.add("section-header");
	header.textContent = label;
	const row = document.createElement("div");
	row.classList.add("section-inline");

	const val = document.createElement("span");
	val.textContent = value;

	row.appendChild(val);

	container.appendChild(header);
	container.appendChild(row);
}

function addListSection(container, label, items) {
	const header = document.createElement("div");
	header.classList.add("section-header");
	header.textContent = label;
	container.appendChild(header);

	const list = document.createElement("ul");
	list.classList.add("detail-list");

	items.forEach((item) => {
		const li = document.createElement("li");
		li.textContent = item;
		list.appendChild(li);
	});

	container.appendChild(list);
}

//* HANDLE DATA
function initData() {
	const raw = localStorage.getItem("playTrackerData");
	let data;

	try {
		data = raw ? JSON.parse(raw) : null;
	} catch {
		data = null;
	}

	// Define data shape
	const dataShape = {
		games: [],
		expansions: [],
		players: [],
		sessions: [],
	};

	// Check structure
	if (!data || typeof data !== "object") {
		localStorage.setItem("playTrackerData", JSON.stringify(dataShape));
		return dataShape;
	}

	let changed = false;
	for (const key in dataShape) {
		if (!Array.isArray(data[key])) {
			data[key] = [];
			changed = true;
		}
	}

	if (changed) localStorage.setItem("playTrackerData", JSON.stringify(data));
	return data;
}

function getData() {
	return JSON.parse(localStorage.getItem("playTrackerData"));
}

function saveData(data) {
	localStorage.setItem("playTrackerData", JSON.stringify(data));
}

//* RUN THE APP
function runGameTracker() {
	initData();
	renderNav();
	renderGameListView();
}

runGameTracker();
