// Variables globales
let currentQuizz = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
// N'utilisez qu'une seule déclaration de API_BASE_URL
// Si cette variable est déjà définie dans un autre fichier inclus avant celui-ci,
// utilisez-la plutôt que de la redéclarer
if (typeof API_BASE_URL === 'undefined') {
    const API_BASE_URL = 'http://localhost:8080';
}

// Fonction pour récupérer l'ID de catégorie depuis l'URL
function getCategoryIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    // Vérifier les deux formats possibles de paramètre dans l'URL (category ou categorieId)
    return urlParams.get('categorieId') || urlParams.get('category');
}

// Fonction pour récupérer les données du quiz
async function fetchQuizData() {
    const categorieId = getCategoryIdFromUrl();
    if (!categorieId) {
        alert("Aucune catégorie sélectionnée!");
        window.location.href = "categories.html";
        return;
    }
    
    try {
        // Utiliser jQuery Ajax comme dans votre fichier categories.js
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${API_BASE_URL}/admin/startQuizz/${categorieId}`,
                method: 'GET',
                beforeSend: function() {
                    console.log(`🔵 Envoi de requête à /admin/startQuizz/${categorieId}`);
                },
                success: function(response) {
                    console.log("🟢 Réponse reçue:", response);
                    resolve(response);
                },
                error: function(xhr, status, error) {
                    console.error("🔴 Erreur lors de l'appel à l'API Admin:", error);
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error("Erreur:", error);
        alert("Impossible de charger le quiz. Veuillez réessayer.");
        throw error;
    }
}

// Fonction pour démarrer le quiz
async function startQuiz() {
    try {
        // Récupérer les données de l'API
        const responseText = await fetchQuizData();
        
        // Vérifier si la réponse commence par "Quizz : "
        let quizzData;
        if (typeof responseText === 'string') {
            if (responseText.startsWith('Quizz : ')) {
                // Extraire et parser le JSON après "Quizz : "
                quizzData = JSON.parse(responseText.substring(7));
            } else {
                // Essayer de parser le JSON directement
                try {
                    quizzData = JSON.parse(responseText);
                } catch (e) {
                    console.error("Format de réponse invalide:", e);
                    alert("Format de réponse invalide. Veuillez réessayer.");
                    return;
                }
            }
        } else {
            // Si c'est déjà un objet JSON
            quizzData = responseText;
        }
        
        // Vérifier que quizzData est bien un tableau
        if (!Array.isArray(quizzData)) {
            console.error("Le format des données reçues n'est pas un tableau:", quizzData);
            // Si quizzData est un objet avec des propriétés qui contiennent les questions
            if (quizzData && typeof quizzData === 'object') {
                // Essayer de trouver un tableau de questions dans l'objet
                for (const key in quizzData) {
                    if (Array.isArray(quizzData[key])) {
                        quizzData = quizzData[key];
                        break;
                    }
                }
            } else {
                // Si on ne peut pas trouver un tableau, créer un tableau avec l'objet
                quizzData = [quizzData];
            }
        }
        
        currentQuizz = quizzData;
        
        if (!currentQuizz || currentQuizz.length === 0) {
            throw new Error("Aucune question disponible");
        }
        
        // Masquer les instructions et afficher la première question
        const instructionsElement = document.querySelector(".bg-white.p-8");
        if (instructionsElement) {
            instructionsElement.classList.add('hidden');
        }
        showQuestion();
    } catch (error) {
        console.error("Erreur lors du démarrage du quiz:", error);
        alert("Impossible de démarrer le quiz. Veuillez réessayer.");
    }
}

// Afficher la question actuelle
function showQuestion() {
    if (currentQuestionIndex >= currentQuizz.length) {
        showResults();
        return;
    }
    
    const questionData = currentQuizz[currentQuestionIndex];
    
    // Vérifier que les données de la question existent
    if (!questionData) {
        console.error("Données de question non disponibles pour l'index", currentQuestionIndex);
        alert("Données de question non disponibles. Veuillez réessayer.");
        return;
    }
    
    // Vérifier si tous les champs nécessaires sont présents
    if (!questionData.texte || !questionData.choix1 || !questionData.choix2 || 
        !questionData.choix3 || !questionData.choix4 || !questionData.bonneReponse) {
        console.error("Les données de la question sont incomplètes:", questionData);
        
        // Essayer de réparer les données manquantes
        if (!questionData.texte && questionData.question) {
            questionData.texte = questionData.question;
        }
        
        // Si toujours des champs manquants, afficher une erreur
        if (!questionData.texte) {
            alert("Les données de la question sont incomplètes. Veuillez réessayer.");
            return;
        }
    }
    
    timeLeft = 15;
    
    const questionHTML = `
        <div class="bg-white rounded-xl shadow-xl p-6 w-full animate-fade-in">
            <div class="flex justify-between items-center mb-6">
                <span class="text-lg font-bold text-blue-600">Question ${currentQuestionIndex + 1}/${currentQuizz.length}</span>
                <div class="bg-gray-200 rounded-full h-4 w-32">
                    <div id="timer-bar" class="bg-blue-600 h-4 rounded-full transition-all duration-1000" style="width: 100%"></div>
                </div>
            </div>
            
            <h3 class="text-xl font-semibold mb-6 text-gray-800">${questionData.texte || questionData.question || "Question sans texte"}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onclick="checkAnswer(1)" class="p-4 bg-gray-100 hover:bg-blue-100 rounded-lg text-left transition-all duration-200 hover:shadow-md">
                    ${questionData.choix1 || "Option 1"}
                </button>
                <button onclick="checkAnswer(2)" class="p-4 bg-gray-100 hover:bg-blue-100 rounded-lg text-left transition-all duration-200 hover:shadow-md">
                    ${questionData.choix2 || "Option 2"}
                </button>
                <button onclick="checkAnswer(3)" class="p-4 bg-gray-100 hover:bg-blue-100 rounded-lg text-left transition-all duration-200 hover:shadow-md">
                    ${questionData.choix3 || "Option 3"}
                </button>
                <button onclick="checkAnswer(4)" class="p-4 bg-gray-100 hover:bg-blue-100 rounded-lg text-left transition-all duration-200 hover:shadow-md">
                    ${questionData.choix4 || "Option 4"}
                </button>
            </div>
            
            <div class="mt-6 text-right">
                <span class="text-gray-600">Score actuel: <span class="font-bold text-blue-600">${score}</span></span>
            </div>
        </div>
    `;
    
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = questionHTML;
        questionContainer.classList.remove('hidden');
        
        // Démarrer le timer
        startTimer();
    } else {
        console.error("Élément 'question-container' non trouvé dans le DOM");
    }
}

// Démarrer le compte à rebours
function startTimer() {
    const timerBar = document.getElementById('timer-bar');
    if (!timerBar) {
        console.error("Élément 'timer-bar' non trouvé");
        return;
    }
    
    timeLeft = 15;
    
    // Réinitialiser la largeur à 100%
    timerBar.style.width = '100%';
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        // Mettre à jour la barre de progression
        const percentage = (timeLeft / 15) * 100;
        timerBar.style.width = `${percentage}%`;
        
        if (timeLeft <= 5) {
            timerBar.classList.add('bg-red-600');
            timerBar.classList.remove('bg-blue-600');
        } else {
            timerBar.classList.add('bg-blue-600');
            timerBar.classList.remove('bg-red-600');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Temps écoulé, passer à la question suivante
            showFeedback(false);
        }
    }, 1000);
}

// Vérifier la réponse sélectionnée
function checkAnswer(selectedAnswer) {
    clearInterval(timer);
    const question = currentQuizz[currentQuestionIndex];
    
    // S'assurer que la bonne réponse est un nombre
    let correctAnswer = question.bonneReponse;
    if (typeof correctAnswer === 'string') {
        correctAnswer = parseInt(correctAnswer);
    }
    
    const isCorrect = (selectedAnswer === correctAnswer);
    
    if (isCorrect) {
        score++;
    }
    
    showFeedback(isCorrect);
}

// Afficher le feedback après une réponse
function showFeedback(isCorrect) {
    const questionData = currentQuizz[currentQuestionIndex];
    
    // S'assurer que bonneReponse est un nombre
    let correctAnswerNum = questionData.bonneReponse;
    if (typeof correctAnswerNum === 'string') {
        correctAnswerNum = parseInt(correctAnswerNum);
    }
    
    const correctAnswerKey = `choix${correctAnswerNum}`;
    const correctAnswerText = questionData[correctAnswerKey] || "Réponse non disponible";
    
    const feedbackHTML = `
        <div class="bg-white rounded-xl shadow-xl p-6 w-full animate-fade-in">
            <div class="flex items-center justify-center mb-6">
                ${isCorrect 
                    ? `<span class="bg-green-100 text-green-800 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg></span>`
                    : `<span class="bg-red-100 text-red-800 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></span>`
                }
            </div>
            
            <h3 class="text-xl font-semibold mb-2 text-center ${isCorrect ? 'text-green-600' : 'text-red-600'}">
                ${isCorrect ? 'Bonne réponse!' : 'Mauvaise réponse!'}
            </h3>
            
            <p class="text-center text-gray-700 mb-6">
                La bonne réponse était: <span class="font-bold">${correctAnswerText}</span>
            </p>
            
            <div class="flex justify-center">
                <button onclick="nextQuestion()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200">
                    Question suivante
                </button>
            </div>
        </div>
    `;
    
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = feedbackHTML;
    } else {
        console.error("Élément 'question-container' non trouvé");
    }
}

// Passer à la question suivante
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizz.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Afficher les résultats finaux
function showResults() {
    const percentage = Math.round((score / currentQuizz.length) * 100);
    let message, messageClass;
    
    if (percentage >= 80) {
        message = "Excellent travail!";
        messageClass = "text-green-600";
    } else if (percentage >= 60) {
        message = "Bon travail!";
        messageClass = "text-blue-600";
    } else if (percentage >= 40) {
        message = "Pas mal!";
        messageClass = "text-yellow-600";
    } else {
        message = "Continuez à apprendre!";
        messageClass = "text-red-600";
    }
    
    const resultsHTML = `
        <div class="bg-white rounded-xl shadow-xl p-8 w-full animate-fade-in text-center">
            <h3 class="text-2xl font-bold mb-4 ${messageClass}">${message}</h3>
            
            <div class="mb-8">
                <div class="text-5xl font-bold text-gray-800 mb-2">${score} / ${currentQuizz.length}</div>
                <div class="text-xl text-gray-600">${percentage}% de réponses correctes</div>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-4 mb-8">
                <div class="h-4 rounded-full ${messageClass === 'text-green-600' ? 'bg-green-600' : messageClass === 'text-blue-600' ? 'bg-blue-600' : messageClass === 'text-yellow-600' ? 'bg-yellow-600' : 'bg-red-600'}" style="width: ${percentage}%"></div>
            </div>
            
            <div class="flex justify-center space-x-4">
                <a href="categories.html" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200">
                    Retour aux catégories
                </a>
                <button onclick="restartQuiz()" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all duration-200">
                    Recommencer ce quiz
                </button>
            </div>
        </div>
    `;
    
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = resultsHTML;
    } else {
        console.error("Élément 'question-container' non trouvé");
    }
}

// Redémarrer le quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// Au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID de catégorie depuis l'URL
    const categorieId = getCategoryIdFromUrl();
    
    // Récupérer le nom de la catégorie depuis les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('categoryName') || "Quiz";
    
    // Afficher le nom de la catégorie
    const categoryNameElement = document.getElementById('category-name');
    if (categoryNameElement) {
        categoryNameElement.textContent = categoryName;
    }
    
    // Récupérer et afficher le nom d'utilisateur s'il est disponible
    const username = localStorage.getItem('username');
    if (username) {
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = username;
        }
    }
});