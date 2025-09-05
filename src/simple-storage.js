// Service de stockage simple avec JSONBin.io
// Configuration ultra-simple : remplacez juste la clé API ci-dessous

const SIMPLE_CONFIG = {
  // 👇 REMPLACEZ par votre clé API de jsonbin.io (gratuite)
  API_KEY: 'YOUR_API_KEY_HERE',
  
  // 👇 ID du bin (sera créé automatiquement)
  BIN_ID: null
};

// Données par défaut du site
const DEFAULT_DATA = {
  playersData: [
    {id: 1, name: "Clément P", percentage: "20%"},
    {id: 2, name: "Timothee P", percentage: "65%"},
    {id: 3, name: "Pierre P", percentage: "80%"},
    {id: 4, name: "Steve B", percentage: "60%"},
    {id: 5, name: "Joe Z", percentage: "80%"},
    {id: 6, name: "Max L", percentage: "50%"}
  ],
  matchData: [
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
  ],
  playerAvailability: {
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
  },
  leagueTitle: "5ème Ligue - Saison 2025/26",
  isAuthenticated: false,
  lastUpdated: new Date().toISOString()
};

class SimpleStorage {
  constructor() {
    this.binId = localStorage.getItem('tennis_bin_id') || null;
    this.cache = null;
    this.cacheTime = 0;
    this.CACHE_DURATION = 30000; // 30 secondes
  }

  // Vérifier si la configuration est valide
  isConfigured() {
    return SIMPLE_CONFIG.API_KEY && SIMPLE_CONFIG.API_KEY !== 'YOUR_API_KEY_HERE';
  }

  // Créer un nouveau bin
  async createBin() {
    if (!this.isConfigured()) {
      throw new Error('API Key not configured');
    }

    try {
      const response = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': SIMPLE_CONFIG.API_KEY,
          'X-Bin-Name': 'sierre-tennis-data'
        },
        body: JSON.stringify(DEFAULT_DATA)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.binId = result.metadata.id;
      localStorage.setItem('tennis_bin_id', this.binId);
      
      console.log('✅ Nouveau bin créé:', this.binId);
      return DEFAULT_DATA;
    } catch (error) {
      console.error('❌ Erreur création bin:', error);
      throw error;
    }
  }

  // Lire les données
  async loadData() {
    // Utiliser le cache si récent
    if (this.cache && (Date.now() - this.cacheTime) < this.CACHE_DURATION) {
      return this.cache;
    }

    if (!this.isConfigured()) {
      console.log('⚠️ API non configurée, utilisation des données par défaut');
      return DEFAULT_DATA;
    }

    try {
      // Si pas de bin ID, créer un nouveau bin
      if (!this.binId) {
        return await this.createBin();
      }

      const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': SIMPLE_CONFIG.API_KEY
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('🔄 Bin non trouvé, création d\'un nouveau');
          return await this.createBin();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      this.cache = result.record;
      this.cacheTime = Date.now();
      
      console.log('✅ Données chargées depuis JSONBin');
      return this.cache;
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      console.log('🔄 Utilisation des données par défaut');
      return DEFAULT_DATA;
    }
  }

  // Sauvegarder les données
  async saveData(data) {
    if (!this.isConfigured()) {
      console.log('⚠️ API non configurée, sauvegarde locale uniquement');
      localStorage.setItem('tennis_data_backup', JSON.stringify(data));
      return { success: true, message: 'Sauvegardé localement' };
    }

    try {
      if (!this.binId) {
        await this.createBin();
      }

      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString()
      };

      const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': SIMPLE_CONFIG.API_KEY
        },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Mettre à jour le cache
      this.cache = dataToSave;
      this.cacheTime = Date.now();
      
      console.log('✅ Données sauvegardées sur JSONBin');
      return { success: true, message: 'Sauvegardé avec succès' };
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      // Fallback local
      localStorage.setItem('tennis_data_backup', JSON.stringify(data));
      return { success: true, message: 'Sauvegardé localement (fallback)' };
    }
  }

  // Mettre à jour un champ spécifique
  async updateField(field, value) {
    const data = await this.loadData();
    data[field] = value;
    return await this.saveData(data);
  }

  // Méthodes spécifiques pour l'API
  async getPlayers() {
    const data = await this.loadData();
    return data.playersData || [];
  }

  async savePlayersData(players) {
    return await this.updateField('playersData', players);
  }

  async getMatches() {
    const data = await this.loadData();
    return data.matchData || [];
  }

  async saveMatchData(matches) {
    return await this.updateField('matchData', matches);
  }

  async getAvailability() {
    const data = await this.loadData();
    return data.playerAvailability || {};
  }

  async updateAvailability(matchId, playerId, status) {
    const data = await this.loadData();
    
    if (!data.playerAvailability) {
      data.playerAvailability = {};
    }
    
    if (!data.playerAvailability[matchId]) {
      data.playerAvailability[matchId] = {};
    }
    
    data.playerAvailability[matchId][playerId] = status;
    
    const result = await this.saveData(data);
    console.log(`✅ Disponibilité mise à jour: Joueur ${playerId} → ${status} pour le match ${matchId}`);
    return result;
  }

  async getSettings() {
    const data = await this.loadData();
    return { league_title: data.leagueTitle || "5ème Ligue - Saison 2025/26" };
  }

  async saveSettings(settings) {
    return await this.updateField('leagueTitle', settings.league_title);
  }

  async login(credentials) {
    if (credentials.username === 'ADMIN' && credentials.password === 'Kp7mN9qR3x') {
      await this.updateField('isAuthenticated', true);
      return { success: true, message: 'Connecté avec succès' };
    } else {
      throw new Error('Identifiants invalides');
    }
  }

  async logout() {
    await this.updateField('isAuthenticated', false);
    return { success: true };
  }

  async getAuthStatus() {
    const data = await this.loadData();
    return { authenticated: data.isAuthenticated || false };
  }

  // Afficher le statut de configuration
  getStatus() {
    if (!this.isConfigured()) {
      return {
        configured: false,
        message: '⚠️ Configuration requise : ajoutez votre clé API JSONBin.io'
      };
    }
    
    return {
      configured: true,
      binId: this.binId,
      message: '✅ Configuration OK - Synchronisation active'
    };
  }
}

// Créer l'instance globale
window.SimpleStorage = SimpleStorage;

// Message de statut au démarrage
document.addEventListener('DOMContentLoaded', () => {
  const storage = new SimpleStorage();
  const status = storage.getStatus();
  console.log('🏓 Sierre Tennis - Stockage:', status.message);
});

