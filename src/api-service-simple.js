// Service API simple utilisant SimpleStorage
class ApiServiceSimple {
  constructor() {
    this.storage = new SimpleStorage();
  }

  // Méthodes pour les joueurs
  async getPlayers() {
    return await this.storage.getPlayers();
  }

  async createPlayer(playerData) {
    const players = await this.getPlayers();
    const newId = Math.max(...players.map(p => p.id), 0) + 1;
    const newPlayer = { ...playerData, id: newId };
    players.push(newPlayer);
    
    await this.storage.savePlayersData(players);
    
    // Mettre à jour la disponibilité pour tous les matchs
    const availability = await this.getAvailability();
    const matches = await this.getMatches();
    
    matches.forEach(match => {
      if (!availability[match.id]) {
        availability[match.id] = {};
      }
      availability[match.id][newId] = "absent";
    });
    
    await this.storage.updateField('playerAvailability', availability);
    return newPlayer;
  }

  async deletePlayer(playerId) {
    const players = await this.getPlayers();
    const filteredPlayers = players.filter(p => p.id !== playerId);
    
    await this.storage.savePlayersData(filteredPlayers);
    
    // Supprimer de la disponibilité
    const availability = await this.getAvailability();
    Object.keys(availability).forEach(matchId => {
      delete availability[matchId][playerId];
    });
    
    await this.storage.updateField('playerAvailability', availability);
    return { success: true };
  }

  // Méthodes pour les matchs
  async getMatches() {
    return await this.storage.getMatches();
  }

  async createMatch(matchData) {
    const matches = await this.getMatches();
    const newId = Math.max(...matches.map(m => m.id), 0) + 1;
    const newMatch = { ...matchData, id: newId, tour: newId.toString() };
    matches.push(newMatch);
    
    await this.storage.saveMatchData(matches);
    
    // Initialiser la disponibilité pour ce match
    const availability = await this.getAvailability();
    const players = await this.getPlayers();
    
    availability[newId] = {};
    players.forEach(player => {
      availability[newId][player.id] = "absent";
    });
    
    await this.storage.updateField('playerAvailability', availability);
    return newMatch;
  }

  async updateMatch(matchId, updateData) {
    const matches = await this.getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) {
      throw new Error("Match not found");
    }
    
    matches[matchIndex] = { ...matches[matchIndex], ...updateData };
    await this.storage.saveMatchData(matches);
    return matches[matchIndex];
  }

  async deleteMatch(matchId) {
    const matches = await this.getMatches();
    const filteredMatches = matches.filter(m => m.id !== matchId);
    
    await this.storage.saveMatchData(filteredMatches);
    
    // Supprimer de la disponibilité
    const availability = await this.getAvailability();
    delete availability[matchId];
    
    await this.storage.updateField('playerAvailability', availability);
    return { success: true };
  }

  // Méthodes pour la disponibilité
  async getAvailability() {
    return await this.storage.getAvailability();
  }

  async updateAvailability(matchId, playerId, status) {
    console.log(`🔄 Mise à jour disponibilité: Match ${matchId}, Joueur ${playerId} → ${status}`);
    
    try {
      const result = await this.storage.updateAvailability(matchId, playerId, status);
      console.log('✅ Disponibilité mise à jour avec succès');
      return result;
    } catch (error) {
      console.error('❌ Erreur mise à jour disponibilité:', error);
      throw error;
    }
  }

  // Méthodes pour les paramètres
  async getSettings() {
    return await this.storage.getSettings();
  }

  async updateSettings(settings) {
    return await this.storage.saveSettings(settings);
  }

  // Méthodes pour les lieux (non utilisées actuellement)
  async getVenues() {
    return [];
  }

  async getTeams() {
    return [];
  }

  // Méthodes d'authentification
  async login(credentials) {
    return await this.storage.login(credentials);
  }

  async logout() {
    return await this.storage.logout();
  }

  async getAuthStatus() {
    return await this.storage.getAuthStatus();
  }

  // Méthodes utilitaires
  async initializeData() {
    try {
      await Promise.all([
        this.getPlayers(),
        this.getMatches(),
        this.getAvailability(),
        this.getSettings()
      ]);
      
      const status = this.storage.getStatus();
      console.log('🏓 Données initialisées:', status.message);
      
      return { 
        success: true, 
        message: "Données initialisées avec succès",
        configured: status.configured
      };
    } catch (error) {
      console.error('❌ Erreur initialisation:', error);
      return { success: false, message: error.message };
    }
  }

  async resetData() {
    try {
      await this.storage.saveData(this.storage.constructor.DEFAULT_DATA || {});
      return { success: true, message: 'Données réinitialisées' };
    } catch (error) {
      console.error('❌ Erreur réinitialisation:', error);
      return { success: false, message: error.message };
    }
  }

  // Obtenir le statut de configuration
  getConfigurationStatus() {
    return this.storage.getStatus();
  }
}

// Exporter l'instance du service
window.ApiServiceSimple = ApiServiceSimple;

