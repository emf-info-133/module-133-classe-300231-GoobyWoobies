// Fonction pour formater les rangs avec suffixes (1er, 2ème, 3ème, etc.)
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

// Fonction pour déterminer le rang en fonction du score
function calculateRankTier(score) {
  // Définition des seuils pour chaque rang
const tiers = [
  {
    min: 1500,
    name: "Grandmaster",
    color: "bg-gradient-to-r from-purple-900 to-pink-600",
    textColor: "text-white",
    iconUrl: "../images/rank10.png"
  },
  {
    min: 1000,
    name: "Master",
    color: "bg-gradient-to-r from-purple-700 to-purple-500",
    textColor: "text-white",
    iconUrl: "../images/rank9.png"
  },
  {
    min: 500,
    name: "Diamond",
    color: "bg-gradient-to-r from-blue-600 to-indigo-500",
    textColor: "text-white",
    iconUrl: "../images/rank8.png"
  },
  {
    min: 250,
    name: "Platinum",
    color: "bg-gradient-to-r from-cyan-500 to-teal-400",
    textColor: "text-gray-900",
    iconUrl: "../images/rank7.png"
  },
  {
    min: 150,
    name: "Gold",
    color: "bg-gradient-to-r from-yellow-400 to-amber-500",
    textColor: "text-gray-900",
    iconUrl: "../images/rank6.png"
  },
  {
    min: 100,
    name: "Silver",
    color: "bg-gradient-to-r from-gray-300 to-gray-400",
    textColor: "text-gray-900",
    iconUrl: "../images/rank5.png"
  },
  {
    min: 50,
    name: "Bronze",
    color: "bg-gradient-to-r from-amber-700 to-amber-800",
    textColor: "text-white",
    iconUrl: "../images/rank4.png"
  },
  {
    min: 25,
    name: "Iron",
    color: "bg-gradient-to-r from-gray-700 to-gray-800",
    textColor: "text-white",
    iconUrl: "../images/rank3.png"
  },
  {
    min: 10,
    name: "Rookie",
    color: "bg-gradient-to-r from-gray-800 to-black",
    textColor: "text-gray-300",
    iconUrl: "../images/rank2.png"
  },
  {
    min: 0,
    name: "Unranked",
    color: "bg-gradient-to-r from-black to-gray-900",
    textColor: "text-gray-400",
    iconUrl: "../images/rank1.png"
  }
];

  // Trouver le rang correspondant au score
  for (const tier of tiers) {
    if (score >= tier.min) {
      return tier;
    }
  }
  
  // Si aucun rang n'est trouvé (impossible en théorie)
  return tiers[tiers.length - 1];
}

// Fonction pour générer le HTML du badge de rang
function generateRankBadge(score) {
  const tier = calculateRankTier(score);
  
  return `
    <div class="flex items-center gap-4">
      <div class="flex-shrink-0 w-20 h-20">
        <img src="${tier.iconUrl}" alt="${tier.name}" class="w-full h-full rounded-lg" />
      </div>
      <div>
        <div class="text-sm uppercase tracking-wider text-gray-300 opacity-80">Rang</div>
        <div class="font-bold text-lg text-white">${tier.name}</div>
        <div class="text-sm text-gray-300">${score} points</div>
      </div>
    </div>
  `;
}

// Fonction pour créer le marqueur de position
function createPositionBadge(rank) {
  if (rank === 1) {
    return `<div class="inline-flex items-center justify-center w-10 h-10 bg-yellow-500/30 text-yellow-400 rounded-full text-xl font-bold border border-yellow-500/40 shadow-md shadow-yellow-500/20">🥇</div>`;
  } else if (rank === 2) {
    return `<div class="inline-flex items-center justify-center w-10 h-10 bg-gray-400/20 text-gray-300 rounded-full text-xl font-bold border border-gray-400/30 shadow-md shadow-gray-400/20">🥈</div>`;
  } else if (rank === 3) {
    return `<div class="inline-flex items-center justify-center w-10 h-10 bg-amber-700/20 text-amber-600 rounded-full text-xl font-bold border border-amber-700/30 shadow-md shadow-amber-700/20">🥉</div>`;
  } else {
    return `<div class="inline-flex items-center justify-center w-10 h-10 bg-dark-600/40 text-gray-400 rounded-full text-sm font-semibold border border-gray-700/30">${rank}</div>`;
  }
}

// Fonction pour afficher la progression vers le prochain rang
function generateProgressBar(score) {
  const tier = calculateRankTier(score);
  const tiers = [
    { min: 1500, name: "GrandMaster" },
    { min: 1000, name: "Master" },
    { min: 500, name: "Diamond" },
    { min: 250, name: "Platinum" },
    { min: 150, name: "Gold" },
    { min: 100, name: "Silver" },
    { min: 50, name: "Bronze" },
    { min: 25, name: "Iron" },
    { min: 10, name: "Rookie" },
    { min: 0, name: "Unranked" }
  ];
  
  // Trouver le prochain rang
  let nextTierIndex = -1;
  for (let i = 0; i < tiers.length; i++) {
    if (tiers[i].min <= score) {
      nextTierIndex = i - 1;
      break;
    }
  }
  
  // Si c'est déjà le rang le plus élevé
  if (nextTierIndex < 0) {
    return `
      <div class="mt-4 w-full">
        <div class="text-sm text-center text-purple-300 mb-2">Rang maximum atteint!</div>
        <div class="w-full bg-dark-600/40 rounded-full h-3">
          <div class="bg-gradient-to-r from-purple-600 to-pink-400 h-3 rounded-full w-full"></div>
        </div>
      </div>
    `;
  }
  
  const nextTier = tiers[nextTierIndex];
  const currentMin = tier.min;
  const nextMin = nextTier.min;
  const progress = Math.min(100, Math.round(((score - currentMin) / (nextMin - currentMin)) * 100));
  
  return `
    <div class="mt-4 w-full">
      <div class="flex justify-between text-sm text-gray-300 mb-2">
        <span>${score - currentMin} / ${nextMin - currentMin} points</span>
        <span>Prochain rang: ${nextTier.name}</span>
      </div>
      <div class="w-full bg-dark-600/40 rounded-full h-3">
        <div class="bg-gradient-to-r from-accent-primary to-accent-secondary h-3 rounded-full" style="width: ${progress}%"></div>
      </div>
    </div>
  `;
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
  xhr.open("GET", "https://docker-133.angeli.emf-informatique.ch/client/getLeaderboard", true); // URL relative
  xhr.withCredentials = true; // Important pour les cookies de session
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
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

        // Filtrer les utilisateurs qui commencent par "adm-"
        const filteredLeaderboard = data.leaderboard.filter(user => !user.username.startsWith('adm-'));

        // Ne prendre que les 5 premiers utilisateurs
        const topFiveUsers = filteredLeaderboard.slice(0, 5);

        // Remplir le tableau avec les données
        topFiveUsers.forEach((user, index) => {
          const rank = index + 1;
          const isCurrentUser = user.username === data.currentUser.username;
          const rowClass = isCurrentUser ? "bg-accent-primary/20" : (index % 2 === 0 ? "bg-dark-600/20" : "bg-dark-700/20");
          const tier = calculateRankTier(user.score);

          // Créer la ligne pour l'utilisateur
          const row = document.createElement("tr");
          row.className = rowClass + " hover:bg-dark-600/40 transition-colors duration-150";

          row.innerHTML = `
  <td class="pl-4 py-5 whitespace-nowrap">
    ${createPositionBadge(rank)}
  </td>
  <td class="px-6 py-5 whitespace-nowrap">
    <div class="flex items-center">
      <div class="flex-grow">
        <span class="${isCurrentUser ? 'font-semibold text-accent-primary text-lg' : 'text-gray-300 text-lg'} flex items-center gap-2">
          ${user.username}
          ${isCurrentUser ? '<span class="text-xs bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full">Vous</span>' : ''}
        </span>
      </div>
    </div>
  </td>
  <td class="px-6 py-5 whitespace-nowrap text-right">
    <div class="text-sm text-gray-300 font-medium flex flex-col items-end">
      <span class="font-mono text-xl">${user.score.toLocaleString()}</span>
      <span class="text-xs text-gray-400">points</span>
    </div>
  </td>
  <td class="pr-4 py-5 whitespace-nowrap">
    <div class="w-20 h-20 flex-shrink-0 ml-2">
      <div class="w-full h-full flex items-center justify-center flex-col">
    <img src="${tier.iconUrl}" alt="${tier.name}" class="ml-32 w-16 h-16 rounded-lg mb-2" />
    <span class="text-white text-sm bg-dark-700/50 px-2 py-0.5 rounded-md ml-32">${tier.name}</span>
</div>
    </div>
  </td>
`;

          leaderboardBody.appendChild(row);
        });

        // Mettre à jour la section "Votre classement"
        if (data.currentUser) {
          // Calculer le rang réel de l'utilisateur actuel parmi les utilisateurs filtrés
          const filteredUsers = data.leaderboard.filter(user => !user.username.startsWith('adm-'));
          let userRank = filteredUsers.findIndex(user => user.username === data.currentUser.username) + 1;
          if (userRank === 0) userRank = filteredUsers.length + 1; // Au cas où l'utilisateur ne serait pas dans la liste filtrée
          
          const userRankTier = calculateRankTier(data.currentUser.score);
          
          // Ne pas afficher la section si l'utilisateur est un administrateur
          if (!data.currentUser.username.startsWith('adm-')) {
            const userRankingSection = document.getElementById("user-ranking");
            userRankingSection.innerHTML = `
              <div class="flex flex-col md:flex-row justify-between items-center gap-6 p-4">
                <div class="flex items-center gap-6">
                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0 w-20 h-20">
                      <img src="${userRankTier.iconUrl}" alt="${userRankTier.name}" class="w-full h-full rounded-lg" />
                    </div>
                    <div>
                      <div class="text-sm uppercase tracking-wider text-gray-300 opacity-80">Rang actuel</div>
                      <div class="font-bold text-lg text-white">${userRankTier.name}</div>
                      <div class="text-sm text-gray-300">${data.currentUser.score} points</div>
                    </div>
                  </div>
                  <div class="px-6 py-3 bg-dark-700/30 rounded-lg border border-white/10">
                    <div class="text-sm text-gray-400">Classement</div>
                    <div class="font-bold text-2xl text-white">${formatRank(userRank)}</div>
                  </div>
                  <div class="px-6 py-3 bg-dark-700/30 rounded-lg border border-white/10">
                    <div class="text-sm text-gray-400">Score total</div>
                    <div class="font-mono font-bold text-2xl text-white">${data.currentUser.score.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              ${generateProgressBar(data.currentUser.score)}
            `;
          } else {
            // Si l'utilisateur est un administrateur, cacher ou afficher un message approprié
            const userRankingSection = document.getElementById("user-ranking");
            userRankingSection.innerHTML = `
              <div class="p-4 text-center text-gray-400">
                Les administrateurs ne sont pas affichés dans le classement
              </div>
            `;
          }
        }

      } catch (error) {
        leaderboardBody.innerHTML = `
          <tr>
            <td colspan="4" class="px-6 py-8 text-center text-red-400">
              Erreur lors du chargement des données: ${error.message}
            </td>
          </tr>
        `;
      }
    } else {
      leaderboardBody.innerHTML = `
        <tr>
          <td colspan="4" class="px-6 py-8 text-center text-red-400">
            Erreur lors de la récupération des données (${xhr.status}): ${xhr.responseText}
          </td>
        </tr>
      `;
    }
  };

  xhr.onerror = function () {
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
document.addEventListener("DOMContentLoaded", function () {
  fetchLeaderboard();

  // Ajouter un gestionnaire d'événements pour le bouton d'actualisation
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      // Animation de rotation du bouton
      const refreshIcon = refreshBtn.querySelector("svg");
      refreshIcon.classList.add("animate-spin");
      
      fetchLeaderboard();
      
      // Arrêter l'animation après 1 seconde
      setTimeout(() => {
        refreshIcon.classList.remove("animate-spin");
      }, 1000);
    });
  }
});