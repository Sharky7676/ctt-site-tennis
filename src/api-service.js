// Service API pour remplacer localStorage
class ApiService {
  constructor() {
    this.baseUrl = '/.netlify/functions/data';
  }

  async apiCall(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}/${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  async getPlayers() {
    try {
      return await this.apiCall('players');
    } catch (error) {
      // Fallback aux données par défaut en cas d'erreur
      return [
        {id: 1, name: "Clément P", percentage: "20%"},
        {id: 2, name: "Timothee P", percentage: "65%"},
        {id: 3, name: "Pierre P", percentage: "80%"},
        {id: 4, name: "Steve B", percentage: "60%"},
        {id: 5, name: "Joe Z", percentage: "80%"},
        {id: 6, name: "Max L", percentage: "50%"}
      ];
    }
  }

  async createPlayer(playerData) {
    const players = await this.getPlayers();
    const newId = Math.max(...players.map(p => p.id), 0) + 1;
    const newPlayer = { ...playerData, id: newId };
    players.push(newPlayer);
    
    await this.apiCall('save-players', 'POST', players);
    
    // Mettre à jour la disponibilité pour tous les matchs
    const availability = await this.getAvailability();
    const matches = await this.getMatches();
    
    matches.forEach(match => {
      if (!availability[match.id]) {
        availability[match.id] = {};
      }
      availability[match.id][newId] = "absent";
    });
    
    await this.apiCall('save-availability', 'POST', availability);
    return newPlayer;
  }

  async deletePlayer(playerId) {
    const players = await this.getPlayers();
    const filteredPlayers = players.filter(p => p.id !== playerId);
    await this.apiCall('save-players', 'POST', filteredPlayers);
    
    // Supprimer de la disponibilité
    const availability = await this.getAvailability();
    Object.keys(availability).forEach(matchId => {
      delete availability[matchId][playerId];
    });
    await this.apiCall('save-availability', 'POST', availability);
    
    return { success: true };
  }

  async getMatches() {
    try {
      return await this.apiCall('matches');
    } catch (error) {
      // Fallback aux données par défaut
      return [
        {id: 1, tour: "1", date: "05.09.2025", time: "19:45", day: "ven.", opponent: "Sion V", type: "DOM", location: "École des Liddes", address: "Rte des Liddes 6, 3960 Sierre, Suisse"},
        {id: 2, tour: "2", date: "11.09.2025", time: "19:30", day: "jeu.", opponent: "Salvan", type: "EXT", location: "Salvan", address: "Le Carre 8, 1922 Salvan, Suisse"},
        {id: 3, tour: "3", date: "19.09.2025", time: "19:45", day: "ven.", opponent: "Stalden III", type: "DOM", location: "École des Liddes", address: "Rte des Liddes 6, 3960 Sierre, Suisse"},
        {id: 4, tour: "4", date: "03.10.2025", time: "20:00", day: "ven.", opponent: "Gröne III", type: "EXT", location: "Gröne III", address: "Rue Centrale, Rue de la Piscine, 3979 Gröne, Suisse"},
        {id: 5, tour: "5", date: "10.10.2025", time: "19:30", day: "ven.", opponent: "Martigny V", type: "EXT", location: "Martigny V", address: "Rue des Ecoles 9, 1920 Martigny, Suisse"},
        {id: 6, tour: "6", date: "31.10.2025", time: "19:00", day: "ven.", opponent: "Sion V", type: "EXT", location: "Sion V", address: "Rue du Chanoine-Berchtold 17, 1950 Sion, Suisse"},
        {id: 7, tour: "7", date: "07.11.2025", time: "19:45", day: "ven.", opponent: "Salvan", type: "DOM", location: "École des Liddes", address: "Rte des Liddes 6, 3960 Sierre, Suisse"},
        {id: 8, tour: "8", date: "17.11.2025", time: "20:00", day: "lun.", opponent: "Stalden III", type: "EXT", location: "Stalden III", address: "Mehrzweckhalle beim Bahnhof, 3922 Stalden, Suisse"},
        {id: 9, tour: "9", date: "28.11.2025", time: "19:45", day: "ven.", opponent: "Gröne III", type: "DOM", location: "École des Liddes", address: "Rte des Liddes 6, 3960 Sierre, Suisse"},
        {id: 10, tour: "10", date: "12.12.2025", time: "19:45", day: "ven.", opponent: "Martigny V", type: "DOM", location: "École des Liddes", address: "Rte des Liddes 6, 3960 Sierre, Suisse"}
      ];
    }
  }

  async createMatch(matchData) {
    const matches = await this.getMatches();
    const newId = Math.max(...matches.map(m => m.id), 0) + 1;
    const newMatch = { ...matchData, id: newId, tour: newId.toString() };
    matches.push(newMatch);
    
    await this.apiCall('save-matches', 'POST', matches);
    
    // Initialiser la disponibilité pour ce match
    const availability = await this.getAvailability();
    const players = await this.getPlayers();
    
    availability[newId] = {};
    players.forEach(player => {
      availability[newId][player.id] = "absent";
    });
    
    await this.apiCall('save-availability', 'POST', availability);
    return newMatch;
  }

  async updateMatch(matchId, updateData) {
    const matches = await this.getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) {
      throw new Error("Match not found");
    }
    
    matches[matchIndex] = { ...matches[matchIndex], ...updateData };
    await this.apiCall('save-matches', 'POST', matches);
    return matches[matchIndex];
  }

  async deleteMatch(matchId) {
    const matches = await this.getMatches();
    const filteredMatches = matches.filter(m => m.id !== matchId);
    await this.apiCall('save-matches', 'POST', filteredMatches);
    
    // Supprimer de la disponibilité
    const availability = await this.getAvailability();
    delete availability[matchId];
    await this.apiCall('save-availability', 'POST', availability);
    
    return { success: true };
  }

  async getAvailability() {
    try {
      return await this.apiCall('availability');
    } catch (error) {
      // Fallback aux données par défaut
      return {
        1: {1: "present", 2: "present", 3: "available", 4: "absent", 5: "available", 6: "present"},
        2: {1: "present", 2: "available", 3: "present", 4: "absent", 5: "present", 6: "absent"},
        3: {1: "absent", 2: "present", 3: "available", 4: "present", 5: "present", 6: "absent"},
        4: {1: "absent", 2: "absent", 3: "present", 4: "present", 5: "present", 6: "available"},
        5: {1: "absent", 2: "absent", 3: "present", 4: "absent", 5: "present", 6: "present"},
        6: {1: "present", 2: "present", 3: "available", 4: "available", 5: "absent", 6: "present"},
        7: {1: "absent", 2: "present", 3: "present", 4: "present", 5: "absent", 6: "absent"},
        8: {1: "absent", 2: "present", 3: "present", 4: "absent", 5: "present", 6: "absent"},
        9: {1: "available", 2: "available", 3: "present", 4: "present", 5: "present", 6: "absent"},
        10: {1: "available", 2: "present", 3: "available", 4: "present", 5: "available", 6: "present"}
      };
    }
  }

  async updateAvailability(matchId, playerId, status) {
    try {
      // Essayer d'abord l'endpoint spécifique
      return await this.apiCall('update-availability', 'POST', {
        match_id: matchId,
        player_id: playerId,
        status: status
      });
    } catch (error) {
      // Fallback : mettre à jour toute la disponibilité
      try {
        const availability = await this.getAvailability();
        
        if (!availability[matchId]) {
          availability[matchId] = {};
        }
        
        availability[matchId][playerId] = status;
        await this.apiCall('save-availability', 'POST', availability);
        return { success: true };
      } catch (fallbackError) {
        // Fallback local pour le développement
        const availability = JSON.parse(localStorage.getItem('playerAvailability') || '{}');
        
        if (!availability[matchId]) {
          availability[matchId] = {};
        }
        
        availability[matchId][playerId] = status;
        localStorage.setItem('playerAvailability', JSON.stringify(availability));
        return { success: true, message: 'Updated locally (fallback)' };
      }
    }
  }

  async getSettings() {
    try {
      return await this.apiCall('settings');
    } catch (error) {
      return { league_title: "5ème Ligue - Saison 2025/26" };
    }
  }

  async updateSettings(settings) {
    await this.apiCall('save-settings', 'POST', settings);
    return { success: true };
  }

  async getVenues() {
    try {
      return await this.apiCall('venues');
    } catch (error) {
      return [];
    }
  }

  async getTeams() {
    try {
      return await this.apiCall('teams');
    } catch (error) {
      return [];
    }
  }

  async login(credentials) {
    try {
      return await this.apiCall('login', 'POST', credentials);
    } catch (error) {
      // Fallback pour le développement local quand les fonctions Netlify ne sont pas disponibles
      if (credentials.username === 'ADMIN' && credentials.password === 'Kp7mN9qR3x') {
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true, message: 'Logged in successfully (local fallback)' };
      }
      throw new Error('Invalid credentials');
    }
  }

  async logout() {
    try {
      return await this.apiCall('logout', 'POST');
    } catch (error) {
      // Fallback pour le développement local
      localStorage.removeItem('isAuthenticated');
      return { success: true };
    }
  }

  async getAuthStatus() {
    try {
      return await this.apiCall('auth-status');
    } catch (error) {
      // Fallback pour le développement local
      return { authenticated: localStorage.getItem('isAuthenticated') === 'true' };
    }
  }

  async initializeData() {
    // Cette méthode charge toutes les données nécessaires
    try {
      await Promise.all([
        this.getPlayers(),
        this.getMatches(),
        this.getAvailability(),
        this.getSettings(),
        this.getVenues(),
        this.getTeams()
      ]);
      return { success: true, message: "Data initialized successfully" };
    } catch (error) {
      console.error('Error initializing data:', error);
      return { success: false, message: error.message };
    }
  }

  async resetData() {
    return await this.apiCall('reset-data', 'POST');
  }
}

// Exporter l'instance du service
window.ApiService = ApiService;

