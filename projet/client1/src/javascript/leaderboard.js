// Fonction pour formater les rangs avec suffixes (1st, 2nd, 3rd, etc.)
function formatRank(rank) {
    if (rank === 1) {
      return "1er";
    } else if (rank === 2) {
      return "2ème";
    } else if (rank === 3) {
      return "3ème";
    } else {
      return rank + "ème";
    }
  }
  
  // Fonction pour actualiser le leaderboard
  function fetchLeaderboard() {
    const leaderboardBody = document.getElementById("leaderboard-body");
    
    // Afficher l'indicateur de chargement
    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="4" class="px-6 py-12 text-center text-gray-400">
          <div class="flex flex-col items-center justify-center">
            <svg class="animate-spin h-8 w-8 text-accent-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Chargement des données...</span>
          </div>
        </td>
      </tr>
    `;
    
    // Créer la requête AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/client/GetLeaderboard", true);
    xhr.withCredentials = true; // Important pour les cookies de session
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          // Analyser la réponse JSON
          const data = JSON.parse(xhr.responseText);
          
          // Vider le tableau
          leaderboardBody.innerHTML = "";
          
          // Vérifier si le leaderboard est vide
          if (data.leaderboard.length === 0) {
            leaderboardBody.innerHTML = `
              <tr>
                <td colspan="4" class="px-6 py-8 text-center text-gray-400">
                  Aucune donnée disponible pour le moment
                </td>
              </tr>
            `;
            return;
          }
          
          // Remplir le tableau avec les données
          data.leaderboard.forEach((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.username === data.currentUser.username;
            const rowClass = isCurrentUser ? "bg-accent-primary/20" : (index % 2 === 0 ? "bg-dark-600/20" : "bg-dark-700/20");
            
            // Créer la ligne pour l'utilisateur
            const row = document.createElement("tr");
            row.className = rowClass + " hover:bg-dark-600/40 transition-colors duration-150";
            
            // Formater le rang avec des médailles pour le top 3
            let rankDisplay = '';
            if (rank === 1) {
              rankDisplay = `<span class="inline-flex items-center justify-center w-6 h-6 bg-yellow-500/20 text-yellow-400 rounded-full">🥇</span>`;
            } else if (rank === 2) {
              rankDisplay = `<span class="inline-flex items-center justify-center w-6 h-6 bg-gray-400/20 text-gray-300 rounded-full">🥈</span>`;
            } else if (rank === 3) {
              rankDisplay = `<span class="inline-flex items-center justify-center w-6 h-6 bg-amber-700/20 text-amber-600 rounded-full">🥉</span>`;
            } else {
              rankDisplay = `<span class="text-gray-400">${rank}</span>`;
            }
            
            // Contenu de la ligne
            row.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">${rankDisplay}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="${isCurrentUser ? 'font-semibold text-accent-primary' : 'text-gray-300'}">${user.username}</span>
                ${isCurrentUser ? '<span class="ml-2 text-xs bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full">Vous</span>' : ''}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-medium text-gray-300">${user.score.toLocaleString()}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">${user.quizzesCompleted}</td>
            `;
            
            leaderboardBody.appendChild(row);
          });
          
          // Mettre à jour la section "Votre classement"
          if (data.currentUser) {
            document.getElementById("user-rank").textContent = formatRank(data.currentUser.rank);
            document.getElementById("user-name").textContent = data.currentUser.username;
            document.getElementById("user-score").textContent = data.currentUser.score.toLocaleString();
            document.getElementById("user-quizzes").textContent = data.currentUser.quizzesCompleted;
            document.getElementById("current-username").textContent = data.currentUser.username;
          }
          
        } catch (error) {
          console.error("Erreur lors du traitement des données:", error);
          leaderboardBody.innerHTML = `
            <tr>
              <td colspan="4" class="px-6 py-8 text-center text-red-400">
                Erreur lors du chargement des données
              </td>
            </tr>
          `;
        }
      } else {
        console.error("Erreur lors de la récupération du leaderboard:", xhr.status);
        leaderboardBody.innerHTML = `
          <tr>
            <td colspan="4" class="px-6 py-8 text-center text-red-400">
              Erreur lors de la récupération des données (${xhr.status})
            </td>
          </tr>
        `;
      }
    };
    
    xhr.onerror = function() {
      console.error("Erreur réseau lors de la récupération du leaderboard");
      leaderboardBody.innerHTML = `
        <tr>
          <td colspan="4" class="px-6 py-8 text-center text-red-400">
            Erreur de connexion au serveur
          </td>
        </tr>
      `;
    };
    
    xhr.send();
  }
  
  // Charger le leaderboard au chargement de la page
  document.addEventListener("DOMContentLoaded", function() {
    fetchLeaderboard();
    
    // Ajouter un gestionnaire d'événements pour le bouton d'actualisation
    document.getElementById("refresh-btn").addEventListener("click", function() {
      fetchLeaderboard();
    });
  });