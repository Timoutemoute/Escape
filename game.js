// ============================================
// ESCAPE GAME SNT - Protocole Argos
// ============================================

let SECRET_CODE = null;
let completedLevels = [false, false, false, false];
let currentLevel = 1;
let pendingFinalCode = null;
let gameFinished = false;

// Éléments DOM
const gameArea = document.getElementById('game-area');
const dots = document.querySelectorAll('.dot');
const progressText = document.getElementById('progress-text');
const systemMessage = document.getElementById('system-message');
const confirmationModal = document.getElementById('confirmation-modal');
const blackScreen = document.getElementById('black-screen');

// Mise à jour progression
function updateProgression() {
    dots.forEach((dot, idx) => {
        if (completedLevels[idx]) {
            dot.classList.add('completed');
            dot.classList.remove('active');
        } else if (idx + 1 === currentLevel && !gameFinished) {
            dot.classList.add('active');
            dot.classList.remove('completed');
        } else {
            dot.classList.remove('active', 'completed');
        }
    });
    
    if (!gameFinished) {
        progressText.innerText = `Épreuve ${currentLevel}/4`;
    }
    
    // Afficher/masquer les niveaux
    document.querySelectorAll('.epreuve').forEach((ep, idx) => {
        if (idx + 1 === currentLevel && !gameFinished) {
            ep.classList.add('active');
        } else {
            ep.classList.remove('active');
        }
    });
}

function showSystemMessage(msg, isError = false) {
    systemMessage.innerText = msg;
    systemMessage.className = isError ? 'system-message-error' : 'system-message-success';
    setTimeout(() => {
        if (systemMessage.innerText === msg) {
            systemMessage.innerText = "";
            systemMessage.className = '';
        }
    }, 4000);
}

function unlockNextLevel(currentLvl) {
    if (currentLvl < 4 && !gameFinished) {
        completedLevels[currentLvl - 1] = true;
        currentLevel = currentLvl + 1;
        renderCurrentLevel();
        updateProgression();
        showSystemMessage(`✅ Épreuve ${currentLvl} réussie ! Niveau ${currentLevel} déverrouillé.`);
        
        if (currentLevel === 4) {
            showSystemMessage("⚡ ACCÈS À LA CENTRALE - Entrez le code binaire final");
        }
    }
}

function showFinalBlackScreen() {
    blackScreen.classList.add('active');
    gameFinished = true;
}

// Charger le code secret depuis .secret_config
async function loadSecretCode() {
    try {
        const response = await fetch('.secret_config');
        if (response.ok) {
            const data = await response.json();
            SECRET_CODE = data.code;
            console.log("✅ Configuration chargée depuis .secret_config");
        } else {
            throw new Error("Fichier non trouvé");
        }
    } catch (error) {
        console.warn("⚠️ Fichier .secret_config non trouvé, utilisation valeur par défaut");
        SECRET_CODE = "010100110100111001010100";
    }
}

// Gestion des objets interactifs
function setupInteractiveObjects(levelNum) {
    const objects = document.querySelectorAll(`#epreuve${levelNum} .interactive-object`);
    let activeView = null;
    
    objects.forEach(obj => {
        obj.removeEventListener('click', obj.clickHandler);
        const handler = (e) => {
            e.stopPropagation();
            
            if (gameFinished) {
                showSystemMessage("Jeu terminé. Rechargez la page pour recommencer.", true);
                return;
            }
            
            const level = parseInt(obj.getAttribute('data-level'));
            
            if (level !== currentLevel) {
                showSystemMessage(`🔒 Épreuve ${level} verrouillée. Complétez l'épreuve ${currentLevel} d'abord.`, true);
                return;
            }
            
            if (activeView) {
                activeView.classList.remove('active-view');
            }
            
            const objectType = obj.getAttribute('data-object');
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
        };
        obj.clickHandler = handler;
        obj.addEventListener('click', handler);
    });
    
    document.querySelectorAll(`#epreuve${levelNum} .room-view`).forEach(view => {
        view.addEventListener('click', (e) => {
            if (e.target === view) {
                view.classList.remove('active-view');
            }
        });
    });
}

// Configuration des puzzles
function setupPuzzles(levelNum) {
    if (levelNum === 1) {
        const submit1 = document.getElementById('puzzle1-submit');
        const input1 = document.getElementById('puzzle1-input');
        const feedback1 = document.getElementById('puzzle1-feedback');
        
        if (submit1) {
            submit1.replaceWith(submit1.cloneNode(true));
            const newSubmit = document.getElementById('puzzle1-submit');
            const newInput = document.getElementById('puzzle1-input');
            const newFeedback = document.getElementById('puzzle1-feedback');
            
            if (newSubmit) {
                newSubmit.addEventListener('click', () => {
                    if (gameFinished) return;
                    if (currentLevel !== 1) return;
                    const answer = newInput.value.trim().toUpperCase();
                    if (LEVELS[1].checkAnswer(answer)) {
                        newFeedback.innerText = "✅ BRAVO ! Code accepté.";
                        newFeedback.style.color = "#88ff88";
                        unlockNextLevel(1);
                        newInput.disabled = true;
                        newSubmit.disabled = true;
                    } else {
                        newFeedback.innerText = "❌ Incorrect. Relisez le message et utilisez la table ASCII.";
                        newFeedback.style.color = "#ff8888";
                    }
                });
            }
        }
    }
    
    if (levelNum === 2) {
        const submit2 = document.getElementById('puzzle2-submit');
        const input2 = document.getElementById('puzzle2-input');
        const feedback2 = document.getElementById('puzzle2-feedback');
        
        if (submit2) {
            submit2.replaceWith(submit2.cloneNode(true));
            const newSubmit = document.getElementById('puzzle2-submit');
            const newInput = document.getElementById('puzzle2-input');
            const newFeedback = document.getElementById('puzzle2-feedback');
            
            if (newSubmit) {
                newSubmit.addEventListener('click', () => {
                    if (gameFinished) return;
                    if (currentLevel !== 2) return;
                    const answer = newInput.value.trim();
                    if (LEVELS[2].checkAnswer(answer)) {
                        newFeedback.innerText = "✅ Adresse réseau validée !";
                        newFeedback.style.color = "#88ff88";
                        unlockNextLevel(2);
                        newInput.disabled = true;
                        newSubmit.disabled = true;
                    } else {
                        newFeedback.innerText = "❌ Mauvais binaire. Calculez l'adresse réseau avec IP AND Masque.";
                        newFeedback.style.color = "#ff8888";
                    }
                });
            }
        }
    }
    
    if (levelNum === 3) {
        const level3Content = document.querySelector('#epreuve3 .room-content');
        const existingBtn = document.getElementById('understood-btn');
        if (existingBtn) existingBtn.remove();
        
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
            if (gameFinished) return;
            if (currentLevel === 3) {
                completedLevels[2] = true;
                currentLevel = 4;
                renderCurrentLevel();
                updateProgression();
                showSystemMessage("✅ Épreuve 3 réussie ! Passez au terminal final.");
            } else {
                showSystemMessage("Complétez d'abord l'épreuve 2 !", true);
            }
        });
        level3Content.appendChild(understoodBtn);
    }
    
    if (levelNum === 4) {
        const finalPreviewBtn = document.getElementById('final-submit-preview');
        const finalInput = document.getElementById('final-code');
        const finalFeedback = document.getElementById('final-feedback');
        
        if (finalPreviewBtn) {
            finalPreviewBtn.replaceWith(finalPreviewBtn.cloneNode(true));
            const newBtn = document.getElementById('final-submit-preview');
            const newInput = document.getElementById('final-code');
            const newFeedback = document.getElementById('final-feedback');
            
            if (newBtn) {
                newBtn.addEventListener('click', () => {
                    if (gameFinished) return;
                    if (currentLevel !== 4) {
                        showSystemMessage("Le terminal n'est pas encore accessible !", true);
                        return;
                    }
                    if (!SECRET_CODE) {
                        newFeedback.innerText = "⚠️ Chargement du code en cours... Rafraîchissez la page.";
                        newFeedback.style.color = "#ffaa88";
                        return;
                    }
                    const answer = newInput.value.trim();
                    if (answer === SECRET_CODE) {
                        pendingFinalCode = answer;
                        confirmationModal.classList.add('active-modal');
                    } else {
                        newFeedback.innerText = "❌ Code binaire incorrect. Le sigle est celui de la matière SNT.";
                        newFeedback.style.color = "#ff8888";
                    }
                });
            }
        }
    }
}

// Rendu d'un niveau
function renderLevel(levelNum) {
    const level = LEVELS[levelNum];
    if (!level) return;
    
    const objectsHtml = level.objects.map(obj => `
        <div class="interactive-object" data-object="${obj.id}" data-level="${levelNum}">
            <div class="object-icon">${obj.icon}</div>
            <div class="object-name">${obj.name}</div>
        </div>
    `).join('');
    
    const viewsHtml = Object.entries(level.views).map(([id, view]) => `
        <div class="view-content hidden" id="view-${id}">
            <div class="close-view">✖</div>
            <h3>${view.title}</h3>
            ${view.content}
        </div>
    `).join('');
    
    return `
        <div id="epreuve${levelNum}" class="epreuve ${levelNum === 1 ? 'active' : ''}">
            <div class="room-header">
                <h2>${level.name}</h2>
                <div class="room-code">NIVEAU ${levelNum}</div>
            </div>
            <div class="room-content">
                ${objectsHtml}
            </div>
            <div class="room-view" id="view${levelNum}">
                ${viewsHtml}
            </div>
        </div>
    `;
}

function renderCurrentLevel() {
    if (!gameArea) return;
    
    let html = '';
    for (let i = 1; i <= 4; i++) {
        html += renderLevel(i);
    }
    gameArea.innerHTML = html;
    
    for (let i = 1; i <= 4; i++) {
        setupInteractiveObjects(i);
        setupPuzzles(i);
    }
}

// Configuration des modaux
function setupModals() {
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    
    if (confirmYes) {
        confirmYes.addEventListener('click', () => {
            if (pendingFinalCode === SECRET_CODE && !gameFinished) {
                confirmationModal.classList.remove('active-modal');
                showFinalBlackScreen();
            }
        });
    }
    
    if (confirmNo) {
        confirmNo.addEventListener('click', () => {
            confirmationModal.classList.remove('active-modal');
            pendingFinalCode = null;
            showSystemMessage("Vérifiez le code binaire du sigle SNT.");
        });
    }
}

// Initialisation
async function init() {
    await loadSecretCode();
    renderCurrentLevel();
    updateProgression();
    setupModals();
    console.log("🎮 Escape Game SNT prêt !");
}

init();