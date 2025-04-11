// Fichier question.js - Gestion des requêtes API pour les questions
const API_BASE_URL = 'https://docker-133.angeli.emf-informatique.ch'; // À ajuster selon votre configuration

/**
 * Récupère les catégories disponibles
 * @param {Function} successCallback - Fonction à exécuter en cas de succès
 * @param {Function} errorCallback - Fonction à exécuter en cas d'erreur
 */
function fetchCategories(successCallback, errorCallback) {
    $.ajax({
        url: `${API_BASE_URL}/admin/getCategories`,
        method: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true  // Important pour envoyer les cookies de session
          },
        beforeSend: function() {
            console.log('🔵 Envoi de la requête pour récupérer les catégories...');
        },
        success: function(data) {
            if (successCallback && typeof successCallback === 'function') {
                successCallback(data);
            }
        },
        error: function(xhr, status, error) {
            console.error('🔴 Erreur lors de la récupération des catégories:', error);
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback(error);
            }
        }
    });
}

/**
 * Récupère le nom d'une catégorie spécifique
 * @param {number} categoryId - ID de la catégorie
 * @param {Function} successCallback - Fonction à exécuter en cas de succès
 * @param {Function} errorCallback - Fonction à exécuter en cas d'erreur
 */
function fetchCategoryName(categoryId, successCallback, errorCallback) {
    $.ajax({
        url: `${API_BASE_URL}/admin/getCategories`,
        method: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true  // Important pour envoyer les cookies de session
          },
        success: function(data) {
            const category = data.find(cat => cat.id == categoryId);
            if (category) {
                successCallback(category);
            } else {
                errorCallback('Catégorie non trouvée');
            }
        },
        error: function(xhr, status, error) {
            console.error('🔴 Erreur lors de la récupération du nom de la catégorie:', error);
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback(error);
            }
        }
    });
}

/**
 * Récupère les questions pour une catégorie donnée
 * @param {number} categoryId - ID de la catégorie
 * @param {Function} successCallback - Fonction à exécuter en cas de succès
 * @param {Function} errorCallback - Fonction à exécuter en cas d'erreur
 */
function fetchQuestions(categoryId, successCallback, errorCallback) {
    $.ajax({
        url: `${API_BASE_URL}/admin/startQuizz/${categoryId}`,
        method: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true  // Important pour envoyer les cookies de session
          },
        success: function(data) {
            if (successCallback && typeof successCallback === 'function') {
                successCallback(data);
            }
        },
        error: function(xhr, status, error) {
            console.error('🔴 Erreur lors de la récupération des questions:', error);
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback(error);
            }
        }
    });
}

/**
 * Affiche la première question et commence le quiz
 * @param {Array} questions - Liste des questions à afficher
 */
function startQuiz(questions) {
    let currentQuestionIndex = 0;
    let score = 0;
    
    function displayCurrentQuestion() {
        displayQuestion(questions[currentQuestionIndex]);
    }
    
    // Gestionnaire pour les réponses
    $(document).on('click', '.answer-button', function() {
        const selectedAnswer = $(this).text().trim();
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;
        
        if (selectedAnswer === correctAnswer) {
            score++;
            $(this).addClass('bg-green-500').removeClass('bg-blue-500 hover:bg-blue-600');
        } else {
            $(this).addClass('bg-red-500').removeClass('bg-blue-500 hover:bg-blue-600');
            // Mettre en évidence la bonne réponse
            $('.answer-button').each(function() {
                if ($(this).text().trim() === correctAnswer) {
                    $(this).addClass('bg-green-500').removeClass('bg-blue-500 hover:bg-blue-600');
                }
            });
        }
        
        $('.answer-button').off('click').css('cursor', 'default');
        $('.next-button').show();
    });
    
    // Gestionnaire pour le bouton suivant
    $(document).on('click', '.next-button', function() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayCurrentQuestion();
            $('.next-button').hide();
        } else {
            endQuiz(score, questions.length);
        }
    });
    
    // Afficher la première question
    displayCurrentQuestion();
    $('.next-button').hide();
}

/**
 * Affiche une question et ses options
 * @param {Object} question - La question à afficher
 */
function displayQuestion(question) {
    const questionContainer = $('#question-container');
    questionContainer.html(`
        <div class="mb-8">
            <h3 class="text-2xl font-semibold mb-4">${question.text}</h3>
            <div id="answers" class="space-y-3">
                ${question.options.map((option, index) => `
                    <button class="answer-button px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg w-full text-left transition-colors">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
        <button class="next-button mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-full shadow-lg text-white font-bold text-lg transition-all duration-300 hidden">
            Question suivante
        </button>
    `);
}

/**
 * Termine le quiz et affiche le score final
 * @param {number} score - Nombre de bonnes réponses
 * @param {number} total - Nombre total de questions
 */
function endQuiz(score, total) {
    $('#question-container').html(`
        <div class="text-center py-12">
            <h2 class="text-3xl font-bold mb-6">Quiz terminé !</h2>
            <div class="text-xl mb-8">
                Votre score: <span class="font-bold">${score}/${total}</span>
            </div>
            <div class="text-lg mb-8">
                ${getResultMessage(score, total)}
            </div>
            <button onclick="window.location.href='main.html'" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Retour aux catégories
            </button>
        </div>
    `);
}

/**
 * Retourne un message personnalisé selon le score
 * @param {number} score - Nombre de bonnes réponses
 * @param {number} total - Nombre total de questions
 * @returns {string} Message personnalisé
 */
function getResultMessage(score, total) {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "Excellent travail ! Vous maîtrisez parfaitement ce sujet.";
    if (percentage >= 60) return "Bon score ! Vous avez une bonne connaissance du sujet.";
    if (percentage >= 40) return "Pas mal ! Quelques révisions pourraient vous aider.";
    return "Ne vous découragez pas ! C'est l'occasion d'apprendre davantage.";
}

$(document).ready(function() {
    // Récupérer l'ID de la catégorie depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');

    if (categoryId) {
        // Récupérer le nom de la catégorie avec l'ID
        fetchCategoryName(categoryId, function(category) {
            // Afficher le nom de la catégorie dans le HTML
            $('#category-name').text(category.nom);
            
            // Récupérer les questions pour cette catégorie
            fetchQuestions(categoryId, function(questions) {
                // Démarrer le quiz avec les questions récupérées
                startQuiz(questions);
            }, function(error) {
                $('#question-container').html(`
                    <div class="text-red-500 text-center py-12">
                        Erreur lors du chargement des questions. Veuillez réessayer.
                    </div>
                `);
            });
        }, function(error) {
            $('#category-name').text('Erreur de chargement');
            $('#question-container').html(`
                <div class="text-red-500 text-center py-12">
                    Catégorie non trouvée. Veuillez sélectionner une autre catégorie.
                </div>
            `);
        });
    } else {
        $('#category-name').text('Catégorie non spécifiée');
        $('#question-container').html(`
            <div class="text-red-500 text-center py-12">
                Aucune catégorie sélectionnée. Veuillez choisir une catégorie.
            </div>
        `);
    }
});