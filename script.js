// ============================================
// ESCAPE GAME SNT - Version finale
// Le code final est chargé depuis un fichier externe
// ============================================

// Variables globales pour le timer externe
window.gameCodeFound = false;
window.gameCompletedCode = null;

let SECRET_CODE = null; // Sera chargé depuis le fichier externe
let completedLevels = [false, false, false, false];
let currentLevel = 1;
let pendingFinalCode = null;

// Éléments DOM
const epreuves = document.querySelectorAll('.epreuve');
const dots = document.querySelectorAll('.dot');
const progressText = document.getElementById('progress-text');
const systemMessage = document.getElementById('system-message');
const confirmationModal = document.getElementById('confirmation-modal');
const timerLed = document.getElementById('timer-led');
const timerStatusText = document.getElementById('timer-status-text');

// Mise à jour progression
function updateProgression() {
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
    
    epreuves.forEach((ep, idx) => {
        if (idx + 1 === currentLevel) {
            ep.classList.add('active');
        } else {
            ep.classList.remove('active');
        }
    });
}

function showSystemMessage(msg, isError = false) {
    systemMessage.innerText = msg;
    systemMessage.style.background = isError ? "#2a1a1a" : "#1f2a1f";
    systemMessage.style.borderLeftColor = isError ? "#ff6666" : "#88ff88";
    setTimeout(() => {
        if (systemMessage.innerText === msg) {
            systemMessage.innerText = "";
        }
    }, 4000);
}

function unlockNextLevel(currentLvl) {
    if (currentLvl < 4) {
        completedLevels[currentLvl - 1] = true;
        currentLevel = currentLvl + 1;
        updateProgression();
        showSystemMessage(`✅ Épreuve ${currentLvl} réussie ! Niveau ${currentLevel} déverrouillé.`);
        
        if (currentLevel === 4) {
            showSystemMessage("⚡ ACCÈS À LA CENTRALE - Trouvez le code binaire de SNT");
        }
    }
}

// Arrêter le timer (simulation + événement pour timer externe)
function stopTimer() {
    // Changer l'affichage du timer dans le jeu
    if (timerLed) {
        timerLed.style.background = "#00ff00";
        timerLed.style.boxShadow = "0 0 8px #00ff00";
        timerLed.style.animation = "none";
    }
    if (timerStatusText) {
        timerStatusText.innerText = "DÉSACTIVÉ";
        timerStatusText.style.color = "#88ff88";
    }
    
    // Variable globale pour le timer externe
    window.gameCodeFound = true;
    
    // Événement personnalisé pour le timer externe
    const event = new CustomEvent("gameCompleted", { 
        detail: { 
            code: SECRET_CODE, 
            message: "SNT binaire validé",
            timestamp: Date.now()
        } 
    });
    window.dispatchEvent(event);
    
    // Aussi disponible via console pour débogage
    console.log("%c🔐 TIMER DÉSACTIVÉ - Code trouvé !", "color: #88ff88; font-size: 16px");
}

// Gestion des objets interactifs
function setupInteractiveObjects() {
    const objects = document.querySelectorAll('.interactive-object');
    let activeView = null;
    
    objects.forEach(obj => {
        obj.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const objectType = obj.getAttribute('data-object');
            const level = parseInt(obj.getAttribute('data-level'));
            
            if (level !== currentLevel) {
                showSystemMessage(`🔒 Épreuve ${level} verrouillée. Complétez l'épreuve ${currentLevel} d'abord.`, true);
                return;
            }
            
            if (activeView) {
                activeView.classList.remove('active-view');
            }
            
            const viewId = `view-${objectType}`;
            const roomView = document.getElementById(`view${level}`);
            const targetView = document.getElementById(viewId);
            
            if (roomView && targetView) {
                const allViews = roomView.querySelectorAll('.view-content');
                allViews.forEach(v => v.classList.add('hidden'));
                targetView.classList.remove('hidden');
                roomView.classList.add('active-view');
                activeView = roomView;
                
                const closeBtn = targetView.querySelector('.close-view');
                if (closeBtn) {
                    closeBtn.onclick = () => {
                        roomView.classList.remove('active-view');
                        activeView = null;
                    };
                }
            }
        });
    });
    
    document.querySelectorAll('.room-view').forEach(view => {
        view.addEventListener('click', (e) => {
            if (e.target === view) {
                view.classList.remove('active-view');
            }
        });
    });
}

// Charger le code secret depuis un fichier externe
async function loadSecretCode() {
    try {
        // Tentative de chargement depuis un fichier caché
        // Le nom du fichier est volontairement étrange et non documenté
        const response = await fetch('.secret_config');
        if (response.ok) {
            const data = await response.json();
            SECRET_CODE = data.code;
            console.log("Configuration chargée");
        } else {
            // Fallback en cas d'échec (normal si le fichier n'existe pas en local)
            // Mais sur GitHub, le fichier existe !
            SECRET_CODE = "010100110100111001010100"; // Valeur par défaut (mais normalement chargée)
        }
    } catch (error) {
        console.warn("Fichier de configuration non trouvé, utilisation valeur par défaut");
        SECRET_CODE = "010100110100111001010100";
    }
}

// Puzzles
function setupPuzzles() {
    // Niveau 1
    const submit1 = document.getElementById('puzzle1-submit');
    const input1 = document.getElementById('puzzle1-input');
    const feedback1 = document.getElementById('puzzle1-feedback');
    
    if (submit1) {
        submit1.addEventListener('click', () => {
            if (currentLevel !== 1) return;
            const answer = input1.value.trim().toUpperCase();
            if (answer === "S") {
                feedback1.innerText = "✅ BRAVO ! Code accepté.";
                feedback1.style.color = "#88ff88";
                unlockNextLevel(1);
                input1.disabled = true;
                submit1.disabled = true;
            } else {
                feedback1.innerText = "❌ Incorrect. Décodez le message ASCII (83=S, 84=T, 78=N). La dernière valeur est 83.";
                feedback1.style.color = "#ff8888";
            }
        });
    }
    
    // Niveau 2
    const submit2 = document.getElementById('puzzle2-submit');
    const input2 = document.getElementById('puzzle2-input');
    const feedback2 = document.getElementById('puzzle2-feedback');
    
    if (submit2) {
        submit2.addEventListener('click', () => {
            if (currentLevel !== 2) return;
            const answer = input2.value.trim();
            if (answer === "00100000") {
                feedback2.innerText = "✅ Adresse réseau validée !";
                feedback2.style.color = "#88ff88";
                unlockNextLevel(2);
                input2.disabled = true;
                submit2.disabled = true;
            } else {
                feedback2.innerText = "❌ Mauvais binaire. IP 192.168.10.42 & Masque 255.255.255.224 = 192.168.10.32 → dernier octet 32 → binaire 00100000";
                feedback2.style.color = "#ff8888";
            }
        });
    }
    
    // Niveau 3 : bouton J'ai compris
    const level3Content = document.querySelector('#epreuve3 .room-content');
    if (level3Content && !document.getElementById('understood-btn')) {
        const understoodBtn = document.createElement('button');
        understoodBtn.id = 'understood-btn';
        understoodBtn.textContent = '📚 J\'AI COMPRIS - PASSER À L\'ÉPREUVE 4';
        understoodBtn.style.cssText = `
            background: #2a5f7a;
            border: none;
            padding: 12px 24px;
            border-radius: 40px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            width: 100%;
        `;
        understoodBtn.addEventListener('click', () => {
            if (currentLevel === 3) {
                completedLevels[2] = true;
                currentLevel = 4;
                updateProgression();
                showSystemMessage("✅ Vous avez compris que le sigle SNT est la clé ! Passez au terminal final.");
            } else {
                showSystemMessage("Complétez d'abord l'épreuve 2 !", true);
            }
        });
        level3Content.appendChild(understoodBtn);
    }
    
    // Niveau 4 avec confirmation
    const finalPreviewBtn = document.getElementById('final-submit-preview');
    const finalInput = document.getElementById('final-code');
    const finalFeedback = document.getElementById('final-feedback');
    
    if (finalPreviewBtn) {
        finalPreviewBtn.addEventListener('click', () => {
            if (currentLevel !== 4) {
                showSystemMessage("Le terminal n'est pas encore accessible !", true);
                return;
            }
            if (!SECRET_CODE) {
                finalFeedback.innerText = "⚠️ Erreur de chargement du code secret. Rafraîchissez la page.";
                finalFeedback.style.color = "#ffaa88";
                return;
            }
            const answer = finalInput.value.trim();
            if (answer === SECRET_CODE) {
                pendingFinalCode = answer;
                confirmationModal.classList.add('active-modal');
            } else {
                finalFeedback.innerText = "❌ Code binaire incorrect. SNT en binaire = S(01010011) + N(01001110) + T(01010100)";
                finalFeedback.style.color = "#ff8888";
            }
        });
    }
    
    // Confirmation
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    
    if (confirmYes) {
        confirmYes.addEventListener('click', () => {
            if (pendingFinalCode === SECRET_CODE) {
                finalFeedback.innerText = "🏆 CODE FINAL ACCEPTÉ ! TIMER DÉSACTIVÉ. 🏆";
                finalFeedback.style.color = "#aaffaa";
                finalFeedback.style.fontSize = "1.2rem";
                completedLevels[3] = true;
                updateProgression();
                
                // Arrêter le timer (simulation + événement externe)
                stopTimer();
                
                confirmationModal.classList.remove('active-modal');
                document.getElementById('final-code').disabled = true;
                document.getElementById('final-submit-preview').disabled = true;
                pendingFinalCode = null;
            }
        });
    }
    
    if (confirmNo) {
        confirmNo.addEventListener('click', () => {
            confirmationModal.classList.remove('active-modal');
            pendingFinalCode = null;
            showSystemMessage("Prenez votre temps pour vérifier le code binaire de SNT.");
        });
    }
}

async function init() {
    await loadSecretCode();
    updateProgression();
    setupInteractiveObjects();
    setupPuzzles();
    console.log("Escape Game prêt - Timer externe écoutable via window.addEventListener('gameCompleted', ...)");
}

init();