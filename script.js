// ============================================
// ESCAPE GAME SNT - 4 Épreuves
// Code final : "SNT" en binaire = 010100110100111001010100
// ============================================

// Niveaux et solutions
const solutions = {
    1: "S",        // Épreuve 1 : "84 104 101 ... 83" = "The first key is : S"
    2: "00000000", // Adresse réseau 192.168.1.0 => dernier octet 0 => binaire 00000000
    3: "T",        // "S" + "N" + "T" = SNT (initiale Technologie)
    4: "010100110100111001010100"  // "SNT" en binaire
};

// État des niveaux
let levelStatus = [false, false, false, false]; // level 1,2,3,4
let currentLevel = 1;

// Fonction pour afficher le niveau actif
function updateLevelDisplay() {
    for (let i = 1; i <= 4; i++) {
        const levelDiv = document.getElementById(`level${i}`);
        if (i === currentLevel) {
            levelDiv.classList.add("active");
        } else {
            levelDiv.classList.remove("active");
        }
    }
    // Mise à jour barre de progression
    let completed = levelStatus.filter(v => v === true).length;
    let percent = (completed / 4) * 100;
    document.getElementById("progress-bar").style.width = `${percent}%`;
}

// Gérer la validation par niveau
function setupValidation() {
    for (let i = 1; i <= 4; i++) {
        const btn = document.querySelector(`.validate-btn[data-level='${i}']`);
        if (!btn) continue;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const inputField = document.getElementById(`level${i}-input`);
            const userAnswer = inputField.value.trim();
            const feedbackDiv = document.getElementById(`feedback${i}`);
            
            // Vérifier si le niveau est déjà débloqué
            if (levelStatus[i-1] === true) {
                feedbackDiv.innerHTML = "⚠️ Épreuve déjà validée ! Passe à la suite.";
                feedbackDiv.style.color = "#ffb347";
                return;
            }
            
            // Vérifier si c'est le bon niveau actif
            if (i !== currentLevel) {
                feedbackDiv.innerHTML = "🔒 Tu dois d'abord valider l'épreuve précédente !";
                feedbackDiv.style.color = "#ff8866";
                return;
            }
            
            // Comparaison
            if (userAnswer === solutions[i]) {
                // Succès
                feedbackDiv.innerHTML = "✅ Épreuve validée ! Tu progresses.";
                feedbackDiv.style.color = "#a3ffb3";
                levelStatus[i-1] = true;
                // Passer au niveau suivant si ce n'est pas le dernier
                if (i < 4) {
                    currentLevel = i+1;
                    updateLevelDisplay();
                    // Afficher un message global
                    document.getElementById("global-message").innerHTML = `🎉 Épreuve ${i} réussie ! Niveau ${currentLevel} déverrouillé.`;
                    setTimeout(() => {
                        document.getElementById("global-message").innerHTML = "";
                    }, 3000);
                } else if (i === 4) {
                    // VICTOIRE TOTALE
                    document.getElementById("global-message").innerHTML = "🏆 CODE FINAL ACCEPTÉ ! 🏆<br>⏹️ TU PEUX DÉSACTIVER LE TIMER EXTERNE. BRAVO !";
                    document.getElementById("global-message").style.background = "#0f3b1c";
                    document.getElementById("global-message").style.padding = "12px";
                    document.getElementById("global-message").style.borderRadius = "40px";
                    // Déclencher événement pour timer externe
                    window.dispatchEvent(new CustomEvent("gameCompleted", { detail: { code: solutions[4] } }));
                }
                updateLevelDisplay();
                // Désactiver input de ce niveau (optionnel)
                inputField.disabled = true;
                btn.disabled = true;
                btn.style.opacity = "0.6";
            } else {
                feedbackDiv.innerHTML = "❌ Code incorrect ! Réessaie.";
                feedbackDiv.style.color = "#ff9f8f";
                // Afficher le bouton indice après un échec (s'il n'est pas déjà visible)
                const hintBtn = document.querySelector(`.hint-btn[data-level='${i}']`);
                if (hintBtn && hintBtn.style.display === "none") {
                    hintBtn.style.display = "inline-block";
                    hintBtn.style.marginTop = "8px";
                }
                setTimeout(() => {
                    if (feedbackDiv.innerHTML.includes("incorrect")) {
                        feedbackDiv.innerHTML = "";
                    }
                }, 2000);
            }
        });
    }
}

// Configurer les indices pour chaque niveau (cachés au début)
function setupHints() {
    const hintsData = {
        1: "🔎 Les nombres sont des codes ASCII décimaux. 84 = T, 104 = h, 101 = e... décode tout. La dernière valeur 83 = S. La première clé est cette lettre.",
        2: "🧮 Adresse IP 192.168.1.45 & masque 255.255.255.0 → Adresse réseau = 192.168.1.0. Dernier octet = 0. Binaire de 0 = 00000000.",
        3: "💡 SNT signifie Sciences Numériques et Technologie. La lettre manquante est la première de 'Technologie'."
    };
    
    for (let i = 1; i <= 3; i++) {
        const hintBtn = document.querySelector(`.hint-btn[data-level='${i}']`);
        const hintDiv = document.getElementById(`hint${i}`);
        if (hintBtn) {
            hintBtn.addEventListener("click", () => {
                if (hintDiv.style.display === "none") {
                    hintDiv.style.display = "block";
                    hintDiv.innerHTML = hintsData[i];
                } else {
                    hintDiv.style.display = "none";
                }
            });
        }
    }
}

// Indice spécial pour niveau 4 (pas de bouton indice classique mais on peut donner un hint via console ou message)
function addLevel4Helper() {
    const level4Input = document.getElementById("level4-input");
    const level4Feedback = document.getElementById("feedback4");
    // On peut mettre un petit indice silencieux après 3 erreurs fictives
    let errorCount4 = 0;
    const originalValidate = document.querySelector(`.validate-btn[data-level='4']`);
    if (originalValidate) {
        const listener = originalValidate.addEventListener("click", () => {
            if (levelStatus[3] === false && currentLevel === 4) {
                const val = level4Input.value.trim();
                if (val !== solutions[4] && val !== "") {
                    errorCount4++;
                    if (errorCount4 === 2) {
                        level4Feedback.innerHTML = "💡 Petit indice : SNT en ASCII binaire (8 bits par lettre). S=83 => 01010011, N=78 => 01001110, T=84 => 01010100";
                        level4Feedback.style.color = "#ffdb8e";
                        setTimeout(() => {
                            if (level4Feedback.innerHTML.includes("indice")) level4Feedback.innerHTML = "";
                        }, 4000);
                    }
                }
            }
        });
    }
}

// Initialisation
function initGame() {
    setupValidation();
    setupHints();
    addLevel4Helper();
    updateLevelDisplay();
    // Message de bienvenue
    console.log("Escape Game SNT - Prêt ! Le timer externe doit écouter l'événement 'gameCompleted'");
}

initGame();