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
        // Afficher un indicateur de chargement pendant la récupération des données
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            questionContainer.innerHTML = `
                <div class="backdrop-blur-lg bg-dark-700/50 border border-white/10 rounded-xl shadow-xl p-6 w-full animate-fade-in text-center">
                    <div class="flex justify-center mb-4">
                        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent-primary"></div>
                    </div>
                    <p class="text-gray-300">Chargement du quiz...</p>
                </div>
            `;
        }
        
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
        const instructionsElement = document.querySelector(".backdrop-blur-lg.bg-dark-700\\/50");
        if (instructionsElement) {
            instructionsElement.classList.add('hidden');
        }
        showQuestion();
    } catch (error) {
        console.error("Erreur lors du démarrage du quiz:", error);
        
        // Afficher un message d'erreur dans le conteneur de question
        const questionContainer = document.getElementById('question-container');
        if (questionContainer) {
            questionContainer.innerHTML = `
                <div class="backdrop-blur-lg bg-dark-700/50 border border-red-500/30 rounded-xl shadow-xl p-6 w-full animate-fade-in text-center">
                    <div class="flex justify-center mb-4 text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2 text-red-400">Impossible de démarrer le quiz</h3>
                    <p class="text-gray-300 mb-6">Veuillez réessayer ultérieurement.</p>
                    
                    <div class="flex justify-center">
                        <div class="relative group">
                            <div class="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                            <a href="categories.html" class="relative px-6 py-2 backdrop-blur-lg bg-dark-700/70 border border-white/10 rounded-full shadow-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 group-hover:text-white overflow-hidden">
                                <span class="relative z-10">Retour aux catégories</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <div class="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
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
        <div class="backdrop-blur-lg bg-dark-700/50 border border-white/10 rounded-xl shadow-xl p-6 w-full animate-fade-in">
            <div class="flex justify-between items-center mb-6">
                <span class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Question ${currentQuestionIndex + 1}/${currentQuizz.length}</span>
                <div class="bg-dark-900/50 rounded-full h-4 w-32 overflow-hidden border border-white/10">
                    <div id="timer-bar" class="bg-gradient-to-r from-accent-primary to-accent-secondary h-4 rounded-full transition-all duration-1000" style="width: 100%"></div>
                </div>
            </div>
            
            <h3 class="text-xl font-semibold mb-6 text-gray-100">${questionData.texte || questionData.question || "Question sans texte"}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onclick="checkAnswer(1)" class="p-4 bg-dark-600/50 hover:bg-dark-600/80 rounded-lg text-left transition-all duration-200 hover:shadow-md border border-white/10 backdrop-blur-sm">
                    ${questionData.choix1 || "Option 1"}
                </button>
                <button onclick="checkAnswer(2)" class="p-4 bg-dark-600/50 hover:bg-dark-600/80 rounded-lg text-left transition-all duration-200 hover:shadow-md border border-white/10 backdrop-blur-sm">
                    ${questionData.choix2 || "Option 2"}
                </button>
                <button onclick="checkAnswer(3)" class="p-4 bg-dark-600/50 hover:bg-dark-600/80 rounded-lg text-left transition-all duration-200 hover:shadow-md border border-white/10 backdrop-blur-sm">
                    ${questionData.choix3 || "Option 3"}
                </button>
                <button onclick="checkAnswer(4)" class="p-4 bg-dark-600/50 hover:bg-dark-600/80 rounded-lg text-left transition-all duration-200 hover:shadow-md border border-white/10 backdrop-blur-sm">
                    ${questionData.choix4 || "Option 4"}
                </button>
            </div>
            
            <div class="mt-6 text-right">
                <span class="text-gray-300">Score actuel: <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">${score}</span></span>
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
            timerBar.classList.remove('bg-gradient-to-r', 'from-accent-primary', 'to-accent-secondary');
            timerBar.classList.add('bg-red-600');
        } else {
            timerBar.classList.add('bg-gradient-to-r', 'from-accent-primary', 'to-accent-secondary');
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
        <div class="backdrop-blur-lg bg-dark-700/50 border border-white/10 rounded-xl shadow-xl p-6 w-full animate-fade-in">
            <div class="flex items-center justify-center mb-6">
                ${isCorrect 
                    ? `<span class="bg-green-500/20 text-green-400 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg></span>`
                    : `<span class="bg-red-500/20 text-red-400 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg></span>`
                }
            </div>
            
            <h3 class="text-xl font-semibold mb-2 text-center ${isCorrect ? 'text-green-400' : 'text-red-400'}">
                ${isCorrect ? 'Bonne réponse!' : 'Mauvaise réponse!'}
            </h3>
            
            <p class="text-center text-gray-300 mb-6">
                La bonne réponse était: <span class="font-bold">${correctAnswerText}</span>
            </p>
            
            <div class="flex justify-center">
                <div class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                    <button onclick="nextQuestion()" class="relative px-6 py-2 backdrop-blur-lg bg-dark-700/70 border border-white/10 rounded-full shadow-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 group-hover:text-white overflow-hidden">
                        <span class="relative z-10">Question suivante</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <div class="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </button>
                </div>
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
        messageClass = "text-green-400";
    } else if (percentage >= 60) {
        message = "Bon travail!";
        messageClass = "text-blue-400";
    } else if (percentage >= 40) {
        message = "Pas mal!";
        messageClass = "text-yellow-400";
    } else {
        message = "Continuez à apprendre!";
        messageClass = "text-red-400";
    }
    
    const resultsHTML = `
        <div class="backdrop-blur-lg bg-dark-700/50 border border-white/10 rounded-xl shadow-xl p-8 w-full animate-fade-in text-center">
            <h3 class="text-2xl font-bold mb-4 ${messageClass}">${message}</h3>
            
            <div class="mb-8">
                <div class="text-5xl font-bold text-gray-100 mb-2">${score} / ${currentQuizz.length}</div>
                <div class="text-xl text-gray-300">${percentage}% de réponses correctes</div>
            </div>
            
            <div class="w-full bg-dark-900/50 rounded-full h-4 mb-8 border border-white/10">
                <div class="h-4 rounded-full ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 60 ? 'bg-blue-500' : 
                    percentage >= 40 ? 'bg-yellow-500' : 
                    'bg-red-500'
                }" style="width: ${percentage}%"></div>
            </div>
            
            <div class="flex justify-center space-x-4">
                <div class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                    <a href="categories.html" class="relative px-6 py-3 backdrop-blur-lg bg-dark-700/70 border border-white/10 rounded-full shadow-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 group-hover:text-white overflow-hidden">
                        <span class="relative z-10">Retour aux catégories</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <div class="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </a>
                </div>
                
                <div class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                    <button onclick="restartQuiz()" class="relative px-6 py-3 backdrop-blur-lg bg-dark-700/70 border border-white/10 rounded-full shadow-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 group-hover:text-white overflow-hidden">
                        <span class="relative z-10">Recommencer ce quiz</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <div class="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </button>
                </div>
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
    
    // Créer et afficher le bouton de démarrage du quiz
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <div class="backdrop-blur-lg bg-dark-700/50 border border-white/10 rounded-xl shadow-xl p-6 w-full animate-fade-in text-center">
                <h3 class="text-xl font-semibold mb-6 text-gray-100">Prêt à commencer le quiz${categoryName !== "Quiz" ? ` sur "${categoryName}"` : ''} ?</h3>
                
                <div class="flex justify-center">
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                        <button id="start-quiz-button" class="relative px-6 py-2 backdrop-blur-lg bg-dark-700/70 border border-white/10 rounded-full shadow-lg text-white font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 group-hover:text-white overflow-hidden">
                            <span class="relative z-10">Commencer le quiz</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <div class="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </button>
                    </div>
                </div>
            </div>
        `;
        questionContainer.classList.remove('hidden');
        
        // Ajouter un écouteur d'événement au bouton de démarrage
        document.getElementById('start-quiz-button').addEventListener('click', startQuiz);
    } else {
        console.error("Élément 'question-container' non trouvé dans le DOM");
    }
});