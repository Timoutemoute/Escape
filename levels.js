// ============================================
// NIVEAUX DE L'ESCAPE GAME
// ============================================

const LEVELS = {
    1: {
        id: 1,
        name: "LABO ASCII - Terminal 1984",
        objects: [
            { id: "ascii-terminal", icon: "📟", name: "Terminal" },
            { id: "ascii-poster", icon: "📜", name: "Tableau pédagogique" },
            { id: "ascii-computer", icon: "💻", name: "Ordinateur" }
        ],
        views: {
            "ascii-terminal": {
                title: "📟 TERMINAL ASCII",
                content: `
                    <div class="ascii-art">
╔══════════════════════════════════════════════════════╗
║  >> LOGS SYSTEME v1.0                               ║
║                                                      ║
║  Message encodé :                                    ║
║                                                      ║
║  83  84  78  32  69  115  116  32  108 101           ║
║  32  99  111  100  101  32  100  101  32             ║
║  108  97  32  112  114  101  109  105 101 114        ║
║  101  32  101  115  116  32  58  32  83              ║
║                                                      ║
║  [ Table ASCII : 65=A, 66=B, 67=C ... ]              ║
╚══════════════════════════════════════════════════════╝
                    </div>
                    <div class="puzzle-input">
                        <label>🔐 Quelle est la LETTRE finale du message décodé ?</label>
                        <input type="text" id="puzzle1-input" maxlength="1" placeholder="Lettre majuscule">
                        <button id="puzzle1-submit">VALIDER</button>
                        <div class="puzzle-feedback" id="puzzle1-feedback"></div>
                    </div>
                `
            },
            "ascii-poster": {
                title: "📜 TABLE ASCII",
                content: `
                    <div class="poster-content">
                        <pre>
┌─────┬─────┬─────┬─────┐
│ 65  │ 66  │ 67  │ 68  │
│ A   │ B   │ C   │ D   │
├─────┼─────┼─────┼─────┤
│ 69  │ 70  │ 71  │ 72  │
│ E   │ F   │ G   │ H   │
├─────┼─────┼─────┼─────┤
│ 73  │ 74  │ 75  │ 76  │
│ I   │ J   │ K   │ L   │
├─────┼─────┼─────┼─────┤
│ 77  │ 78  │ 79  │ 80  │
│ M   │ N   │ O   │ P   │
├─────┼─────┼─────┼─────┤
│ 81  │ 82  │ 83  │ 84  │
│ Q   │ R   │ S   │ T   │
├─────┼─────┼─────┼─────┤
│ 85  │ 86  │ 87  │ 88  │
│ U   │ V   │ W   │ X   │
├─────┼─────┼─────┼─────┤
│ 89  │ 90  │     │     │
│ Y   │ Z   │     │     │
└─────┴─────┴─────┴─────┘
                        </pre>
                    </div>
                `
            },
            "ascii-computer": {
                title: "💻 ORDINATEUR",
                content: `
                    <div class="computer-screen">
                        <p>> Accès restreint</p>
                        <p>> Niveau 1 : Décoder le message ASCII</p>
                        <p>> Utilisez la table ASCII pour convertir les nombres en lettres</p>
                        <div class="blinking-cursor">_</div>
                    </div>
                `
            }
        },
        solution: "S",
        checkAnswer: (answer) => answer.trim().toUpperCase() === "S"
    },
    
    2: {
        id: 2,
        name: "🌐 SALLE RÉSEAU - Routeur Cisco",
        objects: [
            { id: "router-config", icon: "📡", name: "Routeur" },
            { id: "switch-info", icon: "🔌", name: "Commutateur" },
            { id: "cable-info", icon: "🔗", name: "Documentation" }
        ],
        views: {
            "router-config": {
                title: "📡 ROUTEUR PRINCIPAL",
                content: `
                    <div class="config-panel">
                        <div class="config-line">Interface IP: 192.168.10.42</div>
                        <div class="config-line">Subnet Mask: 255.255.255.224</div>
                        <div class="config-line">Gateway: 192.168.10.1</div>
                        <div class="config-line">━━━━━━━━━━━━━━━━━━</div>
                        <div class="config-line">[CONFIGURATION]</div>
                        <div class="config-line">Adresse réseau = IP & Masque</div>
                        <div class="config-line">Calculez l'adresse réseau puis le dernier octet en binaire</div>
                    </div>
                    <div class="puzzle-input">
                        <label>🔐 Adresse réseau (dernier octet en binaire 8 bits)</label>
                        <input type="text" id="puzzle2-input" placeholder="Ex: 00100000">
                        <button id="puzzle2-submit">VALIDER</button>
                        <div class="puzzle-feedback" id="puzzle2-feedback"></div>
                    </div>
                `
            },
            "switch-info": {
                title: "🔌 COMMUTATEUR",
                content: `
                    <p>Étiquette technique :</p>
                    <div class="etiquette">"Adresse réseau = Adresse IP AND Masque"</div>
                    <div class="etiquette">"Rappel : AND bit à bit"</div>
                `
            },
            "cable-info": {
                title: "🔗 DOCUMENTATION RÉSEAU",
                content: `
                    <p>Rappel : Masque /27 = 255.255.255.224</p>
                    <p>Pour trouver l'adresse réseau : appliquer un AND logique entre IP et masque</p>
                    <p>Puis convertir le dernier octet en binaire sur 8 bits</p>
                `
            }
        },
        solution: "00100000",
        checkAnswer: (answer) => answer.trim() === "00100000"
    },
    
    3: {
        id: 3,
        name: "📚 SALLE DE COURS - Culture SNT",
        objects: [
            { id: "textbook", icon: "📖", name: "Manuel SNT" },
            { id: "whiteboard-snt", icon: "📋", name: "Tableau blanc" },
            { id: "poster-snt", icon: "🖼️", name: "Affiche" }
        ],
        views: {
            "textbook": {
                title: "📖 MANUEL SNT",
                content: `
                    <div class="book-page">
                        <p><strong>Chapitre 1 : Qu'est-ce que la SNT ?</strong></p>
                        <p>S.N.T. est un sigle important en classe de 2nde.</p>
                        <p>Cette matière introduit les bases du numérique.</p>
                    </div>
                `
            },
            "whiteboard-snt": {
                title: "📋 TABLEAU BLANC",
                content: `
                    <div class="whiteboard-text">
                        <p>✏️ Quelqu'un a écrit :</p>
                        <p style="font-size: 2rem; text-align: center; margin: 20px;">_ _ _</p>
                        <p>En dessous : "Le code final est ce sigle"...</p>
                    </div>
                `
            },
            "poster-snt": {
                title: "🖼️ AFFICHE PÉDAGOGIQUE",
                content: `
                    <div class="poster-content">
                        <p>🎓 Programme de Seconde :</p>
                        <ul>
                            <li>Internet et le Web</li>
                            <li>Réseaux sociaux</li>
                            <li>Données structurées</li>
                            <li>Algorithmique</li>
                            <li>Codage de l'information</li>
                        </ul>
                    </div>
                `
            }
        },
        requiresButton: true
    },
    
    4: {
        id: 4,
        name: "⚙️ CENTRALE - Validation finale",
        objects: [
            { id: "final-terminal", icon: "🖥️", name: "Terminal maître" },
            { id: "control-panel", icon: "🎛️", name: "Panneau" },
            { id: "info-screen", icon: "ℹ️", name: "Informations" }
        ],
        views: {
            "final-terminal": {
                title: "🖥️ TERMINAL MAÎTRE",
                content: `
                    <div class="final-screen">
                        <p>🔐 SYSTÈME DE VALIDATION 🔐</p>
                        <p>Entrez le code binaire du sigle trouvé dans la salle 3</p>
                        <p>(Rappel: chaque lettre = 8 bits, 24 bits au total)</p>
                        <div class="final-input-area">
                            <input type="text" id="final-code" placeholder="24 bits (ex: 010100110100111001010100)">
                            <button id="final-submit-preview">🚨 VALIDER LE CODE 🚨</button>
                        </div>
                        <div id="final-feedback"></div>
                    </div>
                `
            },
            "control-panel": {
                title: "🎛️ PANNEAU DE CONTRÔLE",
                content: `
                    <p>Indicateurs :</p>
                    <p>🟢 Alimentation OK</p>
                    <p>🟡 En attente du code binaire...</p>
                    <p>🔴 En attente de validation</p>
                `
            },
            "info-screen": {
                title: "ℹ️ INFORMATIONS",
                content: `
                    <p>Le code à entrer est le sigle de la matière enseignée en 2nde.</p>
                    <p>Convertissez chaque lettre en binaire (ASCII standard).</p>
                    <p>Exemple: A = 01000001</p>
                `
            }
        }
    }
};