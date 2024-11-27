// Variabili globali
const users = [];
const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9", "Item 10", "Item 11", "Item 12"];
let currentUser = null;

// Gestione registrazione utenti
document.getElementById("registration-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const userName = document.getElementById("user-name").value;
    const teamName = document.getElementById("team-name").value;

    if (users.length >= 8) {
        alert("Massimo 8 utenti registrati!");
        return;
    }

    users.push({ userName, teamName, items: [], score: 0 });
    updateUserList();
    document.getElementById("user-name").value = "";
    document.getElementById("team-name").value = "";
});

// Aggiorna lista utenti
function updateUserList() {
    const userList = document.querySelector("#user-list ul");
    userList.innerHTML = "";
    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = `${user.userName} (${user.teamName})`;
        userList.appendChild(li);
    });

    if (users.length === 8) {
        startItemSelection();
    }
}

// Gestione selezione item
function startItemSelection() {
    document.getElementById("registration").style.display = "none";
    document.getElementById("item-selection").style.display = "block";

    const itemsContainer = document.getElementById("items");
    itemsContainer.innerHTML = "";
    items.forEach(item => {
        const button = document.createElement("button");
        button.textContent = item;
        button.addEventListener("click", function () {
            if (!currentUser) return;
            const selectedCount = currentUser.items.length;
            if (selectedCount < 8 && !currentUser.items.includes(item)) {
                currentUser.items.push(item);
                button.classList.add("selected");
            }
        });
        itemsContainer.appendChild(button);
    });
}

// Conferma squadra
document.getElementById("confirm-items").addEventListener("click", function () {
    if (!currentUser || currentUser.items.length < 8) {
        alert("Seleziona 8 item!");
        return;
    }
    const nextUserIndex = users.findIndex(user => !user.items.length);
    if (nextUserIndex === -1) {
        startScoreboard();
    } else {
        currentUser = users[nextUserIndex];
    }
});

// Avvia classifica
function startScoreboard() {
    document.getElementById("item-selection").style.display = "none";
    document.getElementById("scoreboard").style.display = "block";
}

// Genera punteggi
document.getElementById("generate-scores").addEventListener("click", function () {
    const scores = [...items].map(() => Math.floor(Math.random() * 11) - 5);
    const results = document.getElementById("results");
    results.innerHTML = "";

    users.forEach(user => {
        let totalScore = 0;
        user.items.slice(0, 5).forEach(item => {
            const itemIndex = items.indexOf(item);
            totalScore += scores[itemIndex] || 0;
        });

        results.innerHTML += `<p>${user.userName} (${user.teamName}): ${totalScore} punti</p>`;
    });
});
