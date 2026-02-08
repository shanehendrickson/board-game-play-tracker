//* NAVIGATION
function renderNav() {
	const nav = document.getElementById("nav");
	const container = document.createElement("div");
	nav.innerHTML = "";

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	const gamesBtn = document.createElement("button");
	gamesBtn.classList.add("btn");
	gamesBtn.textContent = "Games";
	gamesBtn.addEventListener("click", renderGameListView);
	buttonRow.appendChild(gamesBtn);

	const playersBtn = document.createElement("button");
	playersBtn.classList.add("btn");
	playersBtn.textContent = "Players";
	playersBtn.addEventListener("click", renderPlayerListView);
	buttonRow.appendChild(playersBtn);

	const sessionsBtn = document.createElement("button");
	sessionsBtn.classList.add("btn");
	sessionsBtn.textContent = "Sessions";
	sessionsBtn.addEventListener("click", renderSessionListView);
	buttonRow.appendChild(sessionsBtn);

	container.appendChild(buttonRow);
	nav.appendChild(container);
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
	addBtn.classList.add("btn");
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
			removeBtn.classList.add("btn");
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
	const buttonRow = document.createElement("div");

	//! maybe default onAdd to null, pass in where needed
	let addBtn;
	if (title !== "Sessions") {
		addBtn = document.createElement("button");
		addBtn.classList.add("btn");
		addBtn.type = "button";
		addBtn.textContent = `Add ${title.slice(0, -1)}`;
		addBtn.addEventListener("click", onAdd);
		buttonRow.classList.add("button-row");
		buttonRow.appendChild(addBtn);
	}

	app.appendChild(buttonRow);
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

	const container = document.createElement("div");
	container.classList.add("form-view");

	// Basic Information
	const infoHeader = document.createElement("div");
	infoHeader.classList.add("section-header");
	infoHeader.textContent = "Game Info";
	container.appendChild(infoHeader);

	container.appendChild(
		createFormRow("Name", "text", game.name, (val) => (game.name = val)),
	);
	container.appendChild(
		createFormRow(
			"Publisher",
			"text",
			game.publisher,
			(val) => (game.publisher = val),
		),
	);
	container.appendChild(
		createFormRow(
			"Designers",
			"text",
			game.designers.join(", "),
			(val) =>
				(game.designers = val
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean)),
		),
	);

	const gameplayHeader = document.createElement("div");
	gameplayHeader.classList.add("section-header");
	gameplayHeader.textContent = "Gameplay Elements";
	container.appendChild(gameplayHeader);

	container.appendChild(
		createListEditor("Roles", game.roles, (updated) => (game.roles = updated)),
	);

	container.appendChild(
		createListEditor(
			"Antagonists",
			game.antagonists,
			(updated) => (game.antagonists = updated),
		),
	);

	container.appendChild(
		createListEditor(
			"Modules",
			game.modules,
			(updated) => (game.modules = updated),
		),
	);

	// button row
	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	const saveBtn = document.createElement("button");
	saveBtn.classList.add("btn");
	saveBtn.textContent = "Save";
	saveBtn.addEventListener("click", () => {
		saveGame(game);
		renderGameDetailView(game.id);
	});

	const cancelBtn = document.createElement("button");
	cancelBtn.classList.add("btn");
	cancelBtn.textContent = "Cancel";
	cancelBtn.addEventListener("click", () => {
		if (mode === "edit") renderGameDetailView(game.id);
		else renderGameListView();
	});

	buttonRow.appendChild(saveBtn);
	buttonRow.appendChild(cancelBtn);
	container.appendChild(buttonRow);
	renderContainer(container);
}

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
		addListSection(container, "Expansions", expansionNames, {
			clickable: true,
			onClick: (index) => {
				const expansionId = game.expansionIds[index];
				renderExpansionDetailView(expansionId);
			},
		});

	const logSessionBtn = document.createElement("button");
	logSessionBtn.classList.add("btn");
	logSessionBtn.textContent = "Log Session";
	logSessionBtn.addEventListener("click", () =>
		renderSessionFormView(null, null, gameId),
	);

	const sessionButtonRow = document.createElement("div");
	sessionButtonRow.classList.add("button-row");
	sessionButtonRow.appendChild(logSessionBtn);
	container.appendChild(sessionButtonRow);

	const backBtn = document.createElement("button");
	backBtn.classList.add("btn");
	backBtn.textContent = "Back";
	backBtn.addEventListener("click", () => renderGameListView());

	const editBtn = document.createElement("button");
	editBtn.classList.add("btn");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () => renderGameFormView("edit", gameId));

	const addExpBtn = document.createElement("button");
	addExpBtn.classList.add("btn");
	addExpBtn.textContent = "Add Expansion";
	addExpBtn.addEventListener("click", () =>
		renderExpansionFormView("add", null, gameId),
	);

	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("btn");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => deleteGame(gameId));

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	buttonRow.appendChild(backBtn);
	buttonRow.appendChild(editBtn);
	buttonRow.appendChild(addExpBtn);
	buttonRow.appendChild(deleteBtn);

	container.appendChild(buttonRow);

	renderContainer(container);
}

function saveGame(game) {
	const data = getData();
	const index = data.games.findIndex((g) => g.id === game.id);
	if (index !== -1) data.games[index] = game;
	else data.games.push(game);
	saveData(data);
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

function renderExpansionFormView(mode, expansionId, gameId) {
	const data = getData();

	const expansion =
		mode === "edit"
			? data.expansions.find((e) => e.id === expansionId)
			: {
					id: crypto.randomUUID(),
					gameId,
					name: "",
					roles: [],
					antagonists: [],
					modules: [],
				};

	const container = document.createElement("div");
	container.classList.add("form-view");

	// Basic Information
	const infoHeader = document.createElement("div");
	infoHeader.classList.add("section-header");
	infoHeader.textContent = "Expansion Info";
	container.appendChild(infoHeader);

	container.appendChild(
		createFormRow(
			"Name",
			"text",
			expansion.name,
			(val) => (expansion.name = val),
		),
	);

	// Gameplay Information
	const gameplayHeader = document.createElement("div");
	gameplayHeader.classList.add("section-header");
	gameplayHeader.textContent = "Gameplay Elements";
	container.appendChild(gameplayHeader);

	container.appendChild(
		createListEditor(
			"Roles",
			expansion.roles,
			(updated) => (expansion.roles = updated),
		),
	);

	container.appendChild(
		createListEditor(
			"Antagonists",
			expansion.antagonists,
			(updated) => (expansion.antagonists = updated),
		),
	);

	container.appendChild(
		createListEditor(
			"Modules",
			expansion.modules,
			(updated) => (expansion.modules = updated),
		),
	);

	// Button Row
	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	const saveBtn = document.createElement("button");
	saveBtn.classList.add("btn");
	saveBtn.textContent = "Save";
	saveBtn.addEventListener("click", () => {
		// Save Expansion
		const index = data.expansions.findIndex((e) => e.id === expansionId);
		if (index !== -1) data.expansions[index] = expansion;
		else data.expansions.push(expansion);

		// Ensure connection between Game and Expansion
		const game = data.games.find((g) => g.id === expansion.gameId);
		if (!game.expansionIds.includes(expansion.id))
			game.expansionIds.push(expansion.id);

		saveData(data);
		renderGameDetailView(game.id);
	});

	const cancelBtn = document.createElement("button");
	cancelBtn.classList.add("btn");
	cancelBtn.textContent = "Cancel";
	cancelBtn.addEventListener("click", () => {
		if (mode === "edit") renderExpansionDetailView(expansion.id);
		else renderGameDetailView(expansion.gameId);
	});

	buttonRow.appendChild(saveBtn);
	buttonRow.appendChild(cancelBtn);
	container.appendChild(buttonRow);

	renderContainer(container);
}

function renderExpansionDetailView(expansionId) {
	const data = getData();
	const expansion = data.expansions.find((e) => e.id === expansionId);
	const game = data.games.find((g) => g.id === expansion.gameId);

	const container = document.createElement("div");
	container.classList.add("detail-view");

	const title = document.createElement("h2");
	title.textContent = `${game.name}: ${expansion.name}`;
	container.appendChild(title);

	if (expansion.roles.length)
		addListSection(container, "Roles", expansion.roles);
	if (expansion.antagonists.length)
		addListSection(container, "Antagonists", expansion.antagonists);
	if (expansion.modules.length)
		addListSection(container, "Modules", expansion.modules);

	// Buttons
	const backBtn = document.createElement("button");
	backBtn.classList.add("btn");
	backBtn.textContent = "Back";
	backBtn.addEventListener("click", () =>
		renderGameDetailView(expansion.gameId),
	);

	const editBtn = document.createElement("button");
	editBtn.classList.add("btn");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () =>
		renderExpansionFormView("edit", expansionId, expansion.gameId),
	);

	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("btn");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => deleteExpansion(expansionId));

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	buttonRow.appendChild(backBtn);
	buttonRow.appendChild(editBtn);
	buttonRow.appendChild(deleteBtn);

	container.appendChild(buttonRow);

	renderContainer(container);
}

function saveExpansion(expansion) {
	const data = getData();
	const index = data.expansions.findIndex((e) => e.id === expansion.id);
	if (index !== -1) data.expansions[index] = expansion;
	else data.expansions.push(expansion);
}

function deleteExpansion(expansionId) {
	const data = getData();
	const expansion = data.expansions.find((e) => e.id === expansionId);
	const gameId = expansion.gameId;

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
	renderGameDetailView(gameId);
}

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

	const container = document.createElement("div");
	container.classList.add("form-view");

	const infoHeader = document.createElement("div");
	infoHeader.classList.add("section-header");
	infoHeader.textContent = "Player Info";
	container.appendChild(infoHeader);

	container.appendChild(
		createFormRow("Name", "text", player.name, (val) => (player.name = val)),
	);

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	const saveBtn = document.createElement("button");
	saveBtn.classList.add("btn");
	saveBtn.textContent = "Save";
	saveBtn.addEventListener("click", () => {
		savePlayer(player);
		renderPlayerDetailView(player.id);
	});

	const cancelBtn = document.createElement("button");
	cancelBtn.classList.add("btn");
	cancelBtn.textContent = "Cancel";
	cancelBtn.addEventListener("click", () => {
		if (mode === "edit") renderPlayerDetailView(player.id);
		else renderPlayerListView();
	});

	buttonRow.appendChild(saveBtn);
	buttonRow.appendChild(cancelBtn);
	container.appendChild(buttonRow);
	renderContainer(container);
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
	backBtn.classList.add("btn");
	backBtn.textContent = "Back";
	backBtn.addEventListener("click", () => renderPlayerListView());

	const editBtn = document.createElement("button");
	editBtn.classList.add("btn");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () =>
		renderPlayerFormView("edit", sessionId),
	);

	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("btn");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => deletePlayer(playerId));

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	buttonRow.appendChild(backBtn);
	buttonRow.appendChild(editBtn);
	buttonRow.appendChild(deleteBtn);

	container.appendChild(buttonRow);

	renderContainer(container);
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

	const session =
		mode === "edit"
			? data.sessions.find((s) => s.id === sessionId)
			: {
					id: crypto.randomUUID(),
					gameId,
					date: "",
					participants: [],
					antagonistsUsed: [],
					modulesUsed: [],
					expansionsUsed: [],
				};

	const game = data.games.find((g) => g.id === session.gameId);

	const container = document.createElement("div");
	container.classList.add("form-view");

	// Merged Arrays (game + selected expansions)
	let mergedRoles = [];
	let mergedAntagonists = [];
	let mergedModules = [];

	// Sections to Re-render
	let participantsSection;
	let expansionsSection;
	let antagonistsSection;
	let modulesSection;

	// Basic Information
	const infoHeader = document.createElement("div");
	infoHeader.classList.add("section-header");
	infoHeader.textContent = `${game.name} Session Info`;
	container.appendChild(
		createFormRow("Date", "date", session.date, (val) => (session.date = val)),
	);

	// PARTICIPANTS
	participantsSection = renderParticipantsSelector(
		session.participants,
		data.players,
		mergedRoles,
	);
	container.appendChild(participantsSection);

	let selectedExpansionIds = [...session.expansionsUsed];

	const expansionOptions = data.expansions.filter((e) => e.gameId === gameId);

	function updateMergedOptions() {
		const expansions = data.expansions.filter((exp) =>
			selectedExpansionIds.includes(exp.id),
		);

		// Update merged arrays
		mergedRoles.length = 0;
		mergedRoles.push(...game.roles, ...expansions.flatMap((exp) => exp.roles));

		mergedAntagonists.length = 0;
		mergedAntagonists.push(
			...game.antagonists,
			...expansions.flatMap((exp) => exp.antagonists),
		);

		mergedModules.length = 0;
		mergedModules.push(
			...game.modules,
			...expansions.flatMap((exp) => exp.modules),
		);

		// Keep session.expansionsUsed in sync with UI
		session.expansionsUsed = [...selectedExpansionIds];

		// Prune invalid selections
		session.participants.forEach((p) => {
			p.roles = p.roles.filter((r) => mergedRoles.includes(r));
		});

		session.antagonistsUsed = session.antagonistsUsed.filter((a) =>
			mergedAntagonists.includes(a),
		);

		session.modulesUsed = session.modulesUsed.filter((m) =>
			mergedModules.includes(m),
		);

		// Re-render UI
		const newExpansions = renderMultiSelect(
			"Expansions Used",
			selectedExpansionIds,
			expansionOptions,
			updateMergedOptions,
		);
		expansionsSection.replaceWith(newExpansions);
		expansionsSection = newExpansions;

		const newParticipants = renderParticipantsSelector(
			session.participants,
			data.players,
			mergedRoles,
		);
		participantsSection.replaceWith(newParticipants);
		participantsSection = newParticipants;

		const newAntagonists = renderMultiSelect(
			"Antagonists Used",
			session.antagonistsUsed,
			mergedAntagonists,
		);
		antagonistsSection.replaceWith(newAntagonists);
		antagonistsSection = newAntagonists;

		const newModules = renderMultiSelect(
			"Modules Used",
			session.modulesUsed,
			mergedModules,
		);
		modulesSection.replaceWith(newModules);
		modulesSection = newModules;
	}

	// EXPANSIONS
	((expansionsSection = renderMultiSelect(
		"Expansions Used",
		selectedExpansionIds,
		expansionOptions,
		updateMergedOptions,
	)),
		container.appendChild(expansionsSection));

	// ANTAGONISTS
	antagonistsSection = renderMultiSelect(
		"Antagonists Used",
		session.antagonistsUsed,
		mergedAntagonists,
	);
	container.appendChild(antagonistsSection);

	// MODULES
	modulesSection = renderMultiSelect(
		"Modules Used",
		session.modulesUsed,
		mergedModules,
	);
	container.appendChild(modulesSection);

	updateMergedOptions();

	// button row
	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	const saveBtn = document.createElement("button");
	saveBtn.classList.add("btn");
	saveBtn.textContent = "Save";
	saveBtn.addEventListener("click", () => {
		saveSession(session);
		renderSessionDetailView(session.id);
	});

	const cancelBtn = document.createElement("button");
	cancelBtn.classList.add("btn");
	cancelBtn.textContent = "Cancel";
	cancelBtn.addEventListener("click", () => {
		if (mode === "edit") renderSessionDetailView(session.id);
		else renderGameDetailView(session.gameId);
	});

	buttonRow.appendChild(saveBtn);
	buttonRow.appendChild(cancelBtn);
	container.appendChild(buttonRow);
	renderContainer(container);
}

function renderParticipantsSelector(participants, players, mergedRoles) {
	const container = document.createElement("div");

	const addBtn = document.createElement("button");
	addBtn.classList.add("btn");
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
			row.classList.add("participant-row");

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
			const rolesControl = createMultiSelectControl(
				mergedRoles,
				p.roles,
				(newRoles) => {
					p.roles = [...newRoles];
				},
			);
			row.appendChild(rolesControl);

			// Aliases - cosmetic only - color, seat, etc
			p.aliases = p.aliases || [];

			const aliasInput = document.createElement("input");
			aliasInput.placeholder = "Add alias";
			row.appendChild(aliasInput);

			const aliasBtn = document.createElement("button");
			aliasBtn.classList.add("btn");
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
				x.classList.add("btn");
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
			removeBtn.classList.add("btn");
			removeBtn.type = "button";
			removeBtn.textContent = "Remove";
			removeBtn.addEventListener("click", () => {
				participants.splice(index, 1);
				renderList();
			});
			row.appendChild(removeBtn);

			list.appendChild(row);
		});
		container.appendChild(list);
		return container;
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
	return container;
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
	backBtn.classList.add("btn");
	backBtn.textContent = "Back";
	backBtn.addEventListener("click", () => renderSessionListView());

	const editBtn = document.createElement("button");
	editBtn.classList.add("btn");
	editBtn.textContent = "Edit";
	editBtn.addEventListener("click", () =>
		renderSessionFormView("edit", sessionId, game.id),
	);

	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("btn");
	deleteBtn.textContent = "Delete";
	deleteBtn.addEventListener("click", () => deleteSession(sessionId));

	const buttonRow = document.createElement("div");
	buttonRow.classList.add("button-row");

	buttonRow.appendChild(backBtn);
	buttonRow.appendChild(editBtn);
	buttonRow.appendChild(deleteBtn);

	container.appendChild(buttonRow);

	renderContainer(container);
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

//* UTILS

function sanitizeData(data) {
	// Ensure top-level arrays exist
	data.games = Array.isArray(data.games) ? data.games : [];
	data.players = Array.isArray(data.players) ? data.players : [];
	data.expansions = Array.isArray(data.expansions) ? data.expansions : [];
	data.sessions = Array.isArray(data.sessions) ? data.sessions : [];

	// Fix Games
	data.games.forEach((g) => {
		g.id = g.id || crypto.randomUUID();
		g.name = g.name || "";
		g.designers = Array.isArray(g.designers) ? g.designers : [];
		g.publisher = g.publisher || "";
		g.roles = Array.isArray(g.roles) ? g.roles : [];
		g.antagonists = Array.isArray(g.antagonists) ? g.antagonists : [];
		g.modules = Array.isArray(g.modules) ? g.modules : [];
		g.expansionIds = Array.isArray(g.expansionIds) ? g.expansionIds : [];
	});

	// Fix Expansions
	data.expansions.forEach((e) => {
		e.id = e.id || crypto.randomUUID();
		e.gameId = e.gameId || "";
		e.name = e.name || "";
		e.roles = Array.isArray(e.roles) ? e.roles : [];
		e.antagonists = Array.isArray(e.antagonists) ? e.antagonists : [];
		e.modules = Array.isArray(e.modules) ? e.modules : [];
	});

	// Fix Players
	data.players.forEach((p) => {
		p.id = p.id || crypto.randomUUID();
		p.name = p.name || "";
	});

	// Fix Sessions
	data.sessions.forEach((s) => {
		s.id = s.id || crypto.randomUUID();
		s.gameId = s.gameId || "";
		s.date = s.date || "";
		s.expansionsUsed = Array.isArray(s.expansionsUsed) ? s.expansionsUsed : [];
		s.antagonistsUsed = Array.isArray(s.antagonistsUsed)
			? s.antagonistsUsed
			: [];
		s.modulesUsed = Array.isArray(s.modulesUsed) ? s.modulesUsed : [];

		// Participants
		s.participants = Array.isArray(s.participants) ? s.participants : [];
		s.participants.forEach((p) => {
			p.playerId = p.playerId || "";
			p.roles = Array.isArray(p.roles) ? p.roles : [];
			p.aliases = Array.isArray(p.aliases) ? p.aliases : [];
		});
	});

	return data;
}

function renderContainer(container) {
	const app = document.getElementById("app");
	app.innerHTML = "";
	app.appendChild(container);
}

function renderMultiSelect(label, selectedValues, options, onChange) {
	const container = document.createElement("div");
	container.classList.add("form-row");

	const lbl = document.createElement("label");
	lbl.textContent = label;
	container.appendChild(lbl);

	const control = createMultiSelectControl(options, selectedValues, onChange);
	container.appendChild(control);

	return container;
}

function createMultiSelectControl(options, selectedValues, onChange) {
	const wrapperDiv = document.createElement("div");
	wrapperDiv.classList.add("multi-select");

	const list = document.createElement("div");
	list.classList.add("multi-select-options");
	wrapperDiv.appendChild(list);

	function renderOptions() {
		list.innerHTML = "";

		options.forEach((opt) => {
			const value = typeof opt === "string" ? opt : opt.id;
			const label = typeof opt === "string" ? opt : opt.name;

			const btn = document.createElement("button");
			btn.type = "button";
			btn.classList.add("multi-select-option");

			if (selectedValues.includes(value)) btn.classList.add("selected");

			btn.textContent = label;

			btn.addEventListener("click", () => {
				const idx = selectedValues.indexOf(value);

				if (idx === -1) {
					selectedValues.push(value);
				} else {
					selectedValues.splice(idx, 1);
				}
				if (onChange) onChange(selectedValues);
				renderOptions();
			});
			list.appendChild(btn);
		});
	}
	renderOptions();
	return wrapperDiv;
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

function addListSection(container, label, items, options = {}) {
	const { clickable = false, onClick = null } = options;

	const header = document.createElement("div");
	header.classList.add("section-header");
	header.textContent = label;
	container.appendChild(header);

	const list = document.createElement("ul");
	list.classList.add("detail-list");

	items.forEach((item, index) => {
		const li = document.createElement("li");
		li.textContent = item;

		if (clickable && onClick) {
			li.classList.add("list-item");
			li.addEventListener("click", () => onClick(index));
		}

		list.appendChild(li);
	});

	container.appendChild(list);
}

function createFormRow(labelText, type, value, onChange) {
	const row = document.createElement("div");
	row.classList.add("form-row");

	const label = document.createElement("label");
	label.classList.add("form-label");
	label.textContent = labelText;

	const input = document.createElement("input");
	input.type = type;
	input.value = value;
	input.addEventListener("input", (e) => onChange(e.target.value));

	row.appendChild(label);
	row.appendChild(input);
	return row;
}

function createListEditor(labelText, items, onChange) {
	const container = document.createElement("div");

	const header = document.createElement("div");
	header.classList.add("form-label");
	header.textContent = labelText;
	container.appendChild(header);

	const list = document.createElement("ul");
	list.classList.add("detail-list");

	function refresh() {
		list.innerHTML = "";
		items.forEach((item, index) => {
			const li = document.createElement("li");
			li.textContent = item;

			const removeBtn = document.createElement("button");
			removeBtn.classList.add("btn");
			removeBtn.textContent = "Remove";
			removeBtn.addEventListener("click", () => {
				items.splice(index, 1);
				onChange(items);
				refresh();
			});
			li.appendChild(removeBtn);
			list.appendChild(li);
		});
	}
	refresh();
	container.appendChild(list);

	const addRow = document.createElement("div");
	addRow.classList.add("form-row");

	const input = document.createElement("input");
	input.type = "text";

	const addBtn = document.createElement("button");
	addBtn.classList.add("btn");
	addBtn.textContent = "Add";
	addBtn.addEventListener("click", () => {
		if (!input.value.trim()) return;
		items.push(input.value.trim());
		onChange(items);
		input.value = "";
		refresh();
	});

	addRow.appendChild(input);
	addRow.appendChild(addBtn);
	container.appendChild(addRow);

	return container;
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
	const raw = localStorage.getItem("playTrackerData");
	let data = raw ? JSON.parse(raw) : {};

	data = sanitizeData(data);
	return data;
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
