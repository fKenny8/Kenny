// Variabili globali
const users = [];
const items = [
    "Item 1", "Item 2", "Item 3", "Item 4", "Item 5", 
    "Item 6", "Item 7", "Item 8", "Item 9", "Item 10", 
    "Item 11", "Item 12"
];
let currentUserIndex = 0; // Indice dell'utente corrente

// Gestione registrazione utenti
document.getElementById("registration-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const userName = document.getElementById("user-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();

    if (users.length >= 8) {
        alert("Massimo 8 utenti registrati!");
        return;
    }

    if (!userName || !teamName) {
        alert("Inserisci sia il nome utente che il nome della squadra!");
        return;
    }

    users.push({ userName, teamName, items: [], score: 0 });
    updateUserList();
    document.getElementById("user-name").value = "";
    document.getElementById("team-name").value = "";
});

// Aggiorna lista utenti registrati
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

    currentUserIndex = 0; // Inizia dal primo utente
    updateItemSelection();
}

// Aggiorna selezione degli item per l'utente corrente
function updateItemSelection() {
    const user = users[currentUserIndex];
    document.querySelector("#item-selection h2").textContent = 
        `Seleziona gli Item per ${user.userName} (${user.teamName})`;

    const itemsContainer = document.getElementById("items");
    itemsContainer.innerHTML = ""; // Svuota la lista degli item

    items.forEach(item => {
        const button = document.createElement("button");
        button.textContent = item;

        // Stato iniziale dei pulsanti
        if (user.items.includes(item)) {
            button.classList.add("selected");
        }

        button.addEventListener("click", function () {
            if (user.items.length < 8 && !user.items.includes(item)) {
                user.items.push(item);
                button.classList.add("selected");
            } else if (user.items.includes(item)) {
                alert("Non puoi selezionare lo stesso item più volte!");
            }

            if (user.items.length === 8) {
                alert(`Hai completato la squadra: ${user.items.join(", ")}`);
            }
        });

        itemsContainer.appendChild(button);
    });
}

// Conferma la squadra e passa al prossimo utente
document.getElementById("confirm-items").addEventListener("click", function () {
    const user = users[currentUserIndex];

    if (user.items.length < 8) {
        alert("Devi selezionare 8 item per completare la squadra!");
        return;
    }

    currentUserIndex++; // Passa al prossimo utente
    if (currentUserIndex < users.length) {
        updateItemSelection();
    } else {
        startScoreboard();
    }
});

// Avvia la classifica
function startScoreboard() {
    document.getElementById("item-selection").style.display = "none";
    document.getElementById("scoreboard").style.display = "block";
}

// Genera i punteggi degli item e calcola la classifica
document.getElementById("generate-scores").addEventListener("click", function () {
    const randomScores = items.map(() => {
        const scores = [10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, -5];
        return scores[Math.floor(Math.random() * scores.length)];
    });

    const results = document.getElementById("results");
    results.innerHTML = "<h3>Punteggi degli Item:</h3>";
    items.forEach((item, index) => {
        results.innerHTML += `<p>${item}: ${randomScores[index]} punti</p>`;
    });

    results.innerHTML += "<h3>Classifica delle Squadre:</h3>";
    users.forEach(user => {
        let totalScore = 0;
        user.items.slice(0, 5).forEach(item => {
            const itemIndex = items.indexOf(item);
            totalScore += randomScores[itemIndex];
        });

        // Gestione delle sostituzioni
        const zeroItems = user.items.slice(0, 5).filter(item => {
            const itemIndex = items.indexOf(item);
            return randomScores[itemIndex] === 0;
        });

        if (zeroItems.length > 0) {
            const substitutes = user.items.slice(5);
            substitutes.forEach(item => {
                if (zeroItems.length > 0) {
                    const itemIndex = items.indexOf(item);
                    totalScore += randomScores[itemIndex];
                    zeroItems.pop();
                }
            });
        }

        user.score = totalScore;
        results.innerHTML += `<p>${user.userName} (${user.teamName}): ${totalScore} punti</p>`;
    });

    // Classifica finale
    users.sort((a, b) => b.score - a.score);
    results.innerHTML += "<h3>Classifica Finale:</h3>";
    users.forEach((user, index) => {
        results.innerHTML += `<p>${index + 1}. ${user.userName} (${user.teamName}): ${user.score} punti</p>`;
    });
});
