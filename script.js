// ============================================
// ESCAPE GAME SNT - Code vérificateur
// Le code attendu pour stopper le TIMER EXTERNE
// ============================================

// 🔐 VOICI LE CODE SECRET (modifiable selon ton besoin)
const SECRET_CODE = "01001100";   // "L" en binaire (ASCII 76)

// Références DOM
const inputCode = document.getElementById("code-input");
const verifyBtn = document.getElementById("verify-btn");
const feedbackDiv = document.getElementById("message-feedback");
const hintBtn = document.getElementById("hint-btn");
const hintText = document.getElementById("hint-text");

// Indice (déjà présent mais révélable)
hintBtn.addEventListener("click", () => {
    hintText.classList.toggle("hidden");
    if (!hintText.classList.contains("hidden")) {
        hintText.innerText = "🔍 Indice avancé : Le poster binaire dit : 'Le code entre les lettres du mot passe ?'. \nTraduction: 'Le code est entre les lettres du mot passe' = L entre Passe? L = 01001100 en binaire. Essaie ce code binaire !";
    } else {
        hintText.innerText = "";
    }
});

// Fonction de vérification
function checkCode() {
    const userCode = inputCode.value.trim();
    
    if (userCode === SECRET_CODE) {
        // ✅ Succès : stopper le timer externe
        feedbackDiv.innerHTML = "✅ ✅ ✅ CODE CORRECT ! ✅ ✅ ✅<br>⏹️ Vous pouvez maintenant ARRÊTER le TIMER externe (via votre gestionnaire de timer).<br>🎉 Félicitations, mission accomplie !";
        feedbackDiv.style.color = "#a3ffb3";
        feedbackDiv.style.backgroundColor = "#0a2f1a";
        feedbackDiv.style.padding = "12px";
        feedbackDiv.style.borderRadius = "24px";
        
        // Optionnel : envoyer un événement custom pour notifier l'extérieur (si timer écoute)
        window.dispatchEvent(new CustomEvent("codeValide", { detail: { code: SECRET_CODE } }));
        
        // Désactiver le champ après succès pour éviter resubmit (optionnel)
        inputCode.disabled = true;
        verifyBtn.disabled = true;
        verifyBtn.style.opacity = "0.6";
    } 
    else if (userCode === "") {
        feedbackDiv.innerHTML = "⚠️ Entre un code (8 caractères recommandé)";
        feedbackDiv.style.color = "#ffaa88";
    }
    else {
        feedbackDiv.innerHTML = "❌ Code incorrect. Le timer continue son compte à rebours... Réessaie.";
        feedbackDiv.style.color = "#ffa098";
        // Efface après 2 secondes pour laisser le message
        setTimeout(() => {
            if (feedbackDiv.innerHTML.includes("incorrect")) {
                feedbackDiv.innerHTML = "";
            }
        }, 2000);
    }
}

verifyBtn.addEventListener("click", checkCode);

// Permet d'envoyer avec la touche Entrée
inputCode.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        checkCode();
    }
});

// Message d'accueil personnalisé pour rappeler le contexte
window.addEventListener("load", () => {
    console.log("Escape Game SNT prêt | Code secret défini : ", SECRET_CODE);
    feedbackDiv.innerHTML = "💡 Saisis le bon code pour désactiver le timer ⏲️";
    setTimeout(() => {
        if (feedbackDiv.innerHTML.includes("Saisis le bon code")) {
            feedbackDiv.innerHTML = "";
        }
    }, 4000);
});