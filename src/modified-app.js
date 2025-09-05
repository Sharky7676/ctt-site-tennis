// Remplacer la classe QS par ApiService
const Be = new ApiService();

// Le reste du code reste identique, mais toutes les méthodes de Be utilisent maintenant l'API
// au lieu de localStorage

// Fonction pour initialiser l'application
async function initializeApp() {
  try {
    // Charger toutes les données depuis l'API
    const [players, matches, availability, settings, venues, teams] = await Promise.allSettled([
      Be.getPlayers(),
      Be.getMatches(),
      Be.getAvailability(),
      Be.getSettings(),
      Be.getVenues(),
      Be.getTeams()
    ]);

    console.log('Données chargées depuis l\'API:', {
      players: players.status === 'fulfilled' ? players.value : 'Erreur',
      matches: matches.status === 'fulfilled' ? matches.value : 'Erreur',
      availability: availability.status === 'fulfilled' ? availability.value : 'Erreur',
      settings: settings.status === 'fulfilled' ? settings.value : 'Erreur',
      venues: venues.status === 'fulfilled' ? venues.value : 'Erreur',
      teams: teams.status === 'fulfilled' ? teams.value : 'Erreur'
    });

    return {
      players: players.status === 'fulfilled' ? players.value : [],
      matches: matches.status === 'fulfilled' ? matches.value : [],
      availability: availability.status === 'fulfilled' ? availability.value : {},
      settings: settings.status === 'fulfilled' ? settings.value : { league_title: "5ème Ligue - Saison 2025/26" },
      venues: venues.status === 'fulfilled' ? venues.value : [],
      teams: teams.status === 'fulfilled' ? teams.value : []
    };
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    throw error;
  }
}

// Exposer les fonctions globalement
window.initializeApp = initializeApp;
window.Be = Be;

