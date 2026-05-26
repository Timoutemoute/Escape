// ============================================
// ESCAPE GAME SNT - 4 ÉPREUVES VERROUILLÉES
// Code final : SNT en binaire = 010100110100111001010100
// ============================================

// SOLUTIONS
const SOLUTIONS = {
    1: "S",                              // Décodage ASCII: 83=S,84=T,78=N,... le message finit par S
    2: "00010001",                       // IP 10.0.1.25 & Masque 255.255.255.240 -> Adresse réseau: 10.0.1.16 (dernier octet 16) -> binaire 00010001
    3: "00011101",                       // XOR entre S(01010011) et N(01001110) = 00011101
    4: "010100110100111001010100"        // SNT en binaire
};

// État du jeu
let completedLevels = [false, false, false, false];
let currentLevel = 1; // 1-indexed

// Éléments DOM
const epreuves = document.querySelectorAll('.epreuve');
const dots = document.querySelectorAll('.dot');
const progressText = document.getElementById('progress-text');
const systemMessage = document.getElementById('system-message');

// Mise à jour de l'affichage (verrouillage progression)
function updateProgression() {
    // Mettre à jour les dots
    dots.forEach((dot, idx) => {
        if (completedLevels[idx]) {
            dot.classList.add('completed');
            dot.classList.remove('active');
        } else if (idx + 1 === currentLevel) {
            dot.classList.add('active');
            dot.classList.remove('completed');
        } else {
            dot.classList.remove('active', 'completed');
        }
    });
    
    progressText.innerText = `Épreuve ${currentLevel}/4`;
    
    // Afficher la bonne épreuve
    epreuves.forEach((ep, idx) => {
        if (idx + 1 === currentLevel) {
            ep.classList.add('active');
        } else {
            ep.classList.remove('active');
        }
    });
}

// Débloquer le niveau suivant
function unlockNextLevel(currentLvl) {
    if (currentLvl < 4) {
        completedLevels[currentLvl - 1] = true;
        currentLevel = currentLvl + 1;
        updateProgression();
        showSystemMessage(`✅ Épreuve ${currentLvl} réussie ! Niveau ${currentLevel} déverrouillé.`);
        
        // Si on a fini toutes les épreuves intermédiaires et qu'on arrive au niveau 4
        if (currentLevel === 4) {
            showSystemMessage("⚡ ACCÈS AU TERMINAL MAÎTRE - Trouvez le code binaire de SNT");
        }
    }
}

// Message système temporaire
function showSystemMessage(msg, isError = false) {
    systemMessage.innerText = msg;
    systemMessage.style.background = isError ? "#2a1a1a" : "#1f2a1f";
    systemMessage.style.borderLeftColor = isError ? "#ff6666" : "#88ff88";
    setTimeout(() => {
        if (systemMessage.innerText === msg) {
            systemMessage.innerText = "";
        }
    }, 3000);
}

// Gestion des vues interactives (objets cliquables)
function setupInteractiveObjects() {
    const objects = document.querySelectorAll('.interactive-object');
    objects.forEach(obj => {
        obj.addEventListener('click', (e) => {
            const objectType = obj.getAttribute('data-object');
            const parentEpreuve = obj.closest('.epreuve');
            const epreuveId = parentEpreuve.id; // "epreuve1", "epreuve2"...
            const level = parseInt(epreuveId.replace('epreuve', ''));
            
            // Vérifier si le niveau est accessible
            if (level !== currentLevel) {
                showSystemMessage(`🔒 Épreuve ${level} verrouillée. Complétez l'épreuve ${currentLevel} d'abord.`, true);
                return;
            }
            
            // Afficher la vue correspondante
            const viewId = `view-${objectType}`;
            const roomView = document.getElementById(`view${level}`);
            const targetView = document.getElementById(viewId);
            
            if (roomView && targetView) {
                // Cacher toutes les vues dans cette room
                const allViews = roomView.querySelectorAll('.view-content');
                allViews.forEach(v => v.classList.add('hidden'));
                targetView.classList.remove('hidden');
                roomView.classList.add('active-view');
                
                // Gestion fermeture
                const closeBtn = targetView.querySelector('.close-view');
                if (closeBtn) {
                    closeBtn.onclick = () => {
                        roomView.classList.remove('active-view');
                    };
                }
            }
        });
    });
    
    // Fermer les vues en cliquant sur le fond
    document.querySelectorAll('.room-view').forEach(view => {
        view.addEventListener('click', (e) => {
            if (e.target === view) {
                view.classList.remove('active-view');
            }
        });
    });
}

// Configuration des puzzles
function setupPuzzles() {
    // Puzzle 1 (ASCII)
    const submit1 = document.getElementById('puzzle1-submit');
    const input1 = document.getElementById('puzzle1-input');
    const feedback1 = document.getElementById('puzzle1-feedback');
    
    if (submit1) {
        submit1.addEventListener('click', () => {
            if (currentLevel !== 1) {
                showSystemMessage("Vous n'êtes pas au bon niveau !", true);
                return;
            }
            const answer = input1.value.trim().toUpperCase();
            if (answer === SOLUTIONS[1]) {
                feedback1.innerText = "✅ BRAVO ! Code accepté.";
                feedback1.style.color = "#88ff88";
                unlockNextLevel(1);
                // Désactiver le puzzle
                input1.disabled = true;
                submit1.disabled = true;
            } else {
                feedback1.innerText = "❌ Code incorrect. Regardez mieux le message ASCII.";
                feedback1.style.color = "#ff8888";
            }
        });
    }
    
    // Puzzle 2 (Réseau)
    const submit2 = document.getElementById('puzzle2-submit');
    const input2 = document.getElementById('puzzle2-input');
    const feedback2 = document.getElementById('puzzle2-feedback');
    
    if (submit2) {
        submit2.addEventListener('click', () => {
            if (currentLevel !== 2) {
                showSystemMessage("Accès refusé, complétez l'épreuve précédente !", true);
                return;
            }
            const answer = input2.value.trim();
            if (answer === SOLUTIONS[2]) {
                feedback2.innerText = "✅ Adresse réseau validée !";
                feedback2.style.color = "#88ff88";
                unlockNextLevel(2);
                input2.disabled = true;
                submit2.disabled = true;
            } else {
                feedback2.innerText = "❌ Mauvais binaire. Calculez l'adresse réseau (IP & Masque) puis le dernier octet en binaire 8 bits.";
                feedback2.style.color = "#ff8888";
            }
        });
    }
    
    // Puzzle 3 (XOR)
    const submit3 = document.getElementById('puzzle3-submit');
    const input3 = document.getElementById('puzzle3-input');
    const feedback3 = document.getElementById('puzzle3-feedback');
    
    if (submit3) {
        submit3.addEventListener('click', () => {
            if (currentLevel !== 3) {
                showSystemMessage("Veuillez terminer l'épreuve précédente.", true);
                return;
            }
            const answer = input3.value.trim();
            if (answer === SOLUTIONS[3]) {
                feedback3.innerText = "✅ XOR correct ! Niveau suivant déverrouillé.";
                feedback3.style.color = "#88ff88";
                unlockNextLevel(3);
                input3.disabled = true;
                submit3.disabled = true;
            } else {
                feedback3.innerText = "❌ Résultat XOR faux. Calculez S ⊕ N (binaire).";
                feedback3.style.color = "#ff8888";
            }
        });
    }
    
    // Puzzle Final (SNT binaire)
    const finalSubmit = document.getElementById('final-submit');
    const finalInput = document.getElementById('final-code');
    const finalFeedback = document.getElementById('final-feedback');
    
    if (finalSubmit) {
        finalSubmit.addEventListener('click', () => {
            if (currentLevel !== 4) {
                showSystemMessage("Le terminal n'est pas encore accessible !", true);
                return;
            }
            const answer = finalInput.value.trim();
            if (answer === SOLUTIONS[4]) {
                finalFeedback.innerText = "🏆 CODE FINAL ACCEPTÉ ! TIMER DÉSACTIVÉ. 🏆";
                finalFeedback.style.color = "#aaffaa";
                finalFeedback.style.fontSize = "1.2rem";
                completedLevels[3] = true;
                updateProgression();
                
                // 🔥 ÉVÉNEMENT POUR LE TIMER EXTERNE
                window.dispatchEvent(new CustomEvent("gameCompleted", { 
                    detail: { code: SOLUTIONS[4], message: "SNT binaire validé" } 
                }));
                
                showSystemMessage("🎉 Félicitations ! Vous avez désamorcé le timer externe.");
                finalInput.disabled = true;
                finalSubmit.disabled = true;
            } else {
                finalFeedback.innerText = "❌ Code binaire incorrect. SNT en binaire = S (01010011) + N (01001110) + T (01010100)";
                finalFeedback.style.color = "#ff8888";
            }
        });
    }
}

// Initialisation
function init() {
    updateProgression();
    setupInteractiveObjects();
    setupPuzzles();
}

init();