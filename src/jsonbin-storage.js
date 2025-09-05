const JSONBIN_CONFIG = {
  API_KEY: 
  '$2a$10$IjZQA6aDlEgx8/MlL9/hOOqGaKgKfbECUpCQI8vB/9Ds8E36dTUaC',
  
  BIN_ID: null,
  
  BASE_URL: 'https://api.jsonbin.io/v3'
};

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

class JsonBinStorage {
  constructor() {
    this.binId = localStorage.getItem("tennis_bin_id") || JSONBIN_CONFIG.BIN_ID;
    this.cache = null;
    this.cacheTime = 0;
    this.CACHE_DURATION = 30000; // 30 secondes
  }

  isConfigured() {
    return JSONBIN_CONFIG.API_KEY && JSONBIN_CONFIG.API_KEY !== "YOUR_API_KEY_HERE";
  }

  async createBin() {
    if (!this.isConfigured()) {
      throw new Error("Clé API JSONBin.io non configurée");
    }

    try {
      console.log("🔄 Création d'un nouveau bin JSONBin...");
      
      const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/b`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": JSONBIN_CONFIG.API_KEY,
          "X-Bin-Name": "sierre-tennis-data",
          "X-Bin-Private": "false"
        },
        body: JSON.stringify(DEFAULT_DATA)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      this.binId = result.metadata.id;
      localStorage.setItem("tennis_bin_id", this.binId);
      console.log("✅ Nouveau bin créé avec succès:", this.binId);
      console.log("🔗 URL du bin:", `https://api.jsonbin.io/v3/b/${this.binId}`);
      return DEFAULT_DATA;
    } catch (error) {
      console.error("❌ Erreur lors de la création du bin:", error);
      throw error;
    }
  }

  async loadData() {
    if (this.cache && (Date.now() - this.cacheTime) < this.CACHE_DURATION) {
      console.log("📋 Utilisation du cache local");
      return this.cache;
    }

    if (!this.isConfigured()) {
      console.log("⚠️ API non configurée, utilisation des données par défaut");
      return DEFAULT_DATA;
    }

    try {
      if (!this.binId) {
        console.log("🆕 Aucun bin ID trouvé, création d'un nouveau bin");
        return await this.createBin();
      }

      console.log("📥 Chargement des données depuis JSONBin:", this.binId);

      const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/b/${this.binId}/latest`, {
        method: "GET",
        headers: {
          "X-Master-Key": JSONBIN_CONFIG.API_KEY
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("🔄 Bin non trouvé, création d'un nouveau");
          this.binId = null;
          localStorage.removeItem("tennis_bin_id");
          return await this.createBin();
        }
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const result = await response.json();
      this.cache = result.record;
      this.cacheTime = Date.now();
      console.log("✅ Données chargées depuis JSONBin");
      console.log("📊 Dernière mise à jour:", this.cache.lastUpdated);
      return this.cache;
    } catch (error) {
      console.error("❌ Erreur lors du chargement:", error);
      console.log("🔄 Utilisation des données par défaut");
      return DEFAULT_DATA;
    }
  }

  async saveData(data) {
    if (!this.isConfigured()) {
      console.log("⚠️ API non configurée, sauvegarde locale uniquement");
      localStorage.setItem("tennis_data_backup", JSON.stringify(data));
      return { success: true, message: "Sauvegardé localement (API non configurée)" };
    }

    try {
      if (!this.binId) {
        console.log("🆕 Création d'un nouveau bin pour la sauvegarde");
        await this.createBin();
      }

      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString()
      };

      console.log("💾 Sauvegarde des données sur JSONBin...");

      const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/b/${this.binId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": JSONBIN_CONFIG.API_KEY
        },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      this.cache = dataToSave;
      this.cacheTime = Date.now();
      console.log("✅ Données sauvegardées avec succès sur JSONBin");
      return { success: true, message: "Sauvegardé avec succès" };
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
      localStorage.setItem("tennis_data_backup", JSON.stringify(data));
      return { success: true, message: "Sauvegardé localement (erreur réseau)" };
    }
  }

  async updateField(field, value) {
    console.log(`🔄 Mise à jour du champ: ${field}`);
    const data = await this.loadData();
    data[field] = value;
    return await this.saveData(data);
  }

  async getPlayers() {
    const data = await this.loadData();
    return data.playersData || [];
  }

  async savePlayersData(players) {
    return await this.updateField("playersData", players);
  }

  async getMatches() {
    const data = await this.loadData();
    return data.matchData || [];
  }

  async saveMatchData(matches) {
    return await this.updateField("matchData", matches);
  }

  async getAvailability() {
    const data = await this.loadData();
    return data.playerAvailability || {};
  }

  async updateAvailability(matchId, playerId, status) {
    console.log(`🔄 Mise à jour disponibilité: Match ${matchId}, Joueur ${playerId} → ${status}`);
    const data = await this.loadData();
    if (!data.playerAvailability) {
      data.playerAvailability = {};
    }
    if (!data.playerAvailability[matchId]) {
      data.playerAvailability[matchId] = {};
    }
    data.playerAvailability[matchId][playerId] = status;
    const result = await this.saveData(data);
    console.log(`✅ Disponibilité mise à jour avec succès`);
    return result;
  }

  async getSettings() {
    const data = await this.loadData();
    return { league_title: data.leagueTitle || "5ème Ligue - Saison 2025/26" };
  }

  async saveSettings(settings) {
    return await this.updateField("leagueTitle", settings.league_title);
  }

  async login(credentials) {
    if (credentials.username === "ADMIN" && credentials.password === "Kp7mN9qR3x") {
      await this.updateField("isAuthenticated", true);
      return { success: true, message: "Connecté avec succès" };
    } else {
      throw new Error("Identifiants invalides");
    }
  }

  async logout() {
    await this.updateField("isAuthenticated", false);
    return { success: true };
  }

  async getAuthStatus() {
    const data = await this.loadData();
    return { authenticated: data.isAuthenticated || false };
  }

  getStatus() {
    if (!this.isConfigured()) {
      return {
        configured: false,
        message: "⚠️ Configuration requise : ajoutez votre clé API JSONBin.io dans le fichier jsonbin-storage.js",
        instructions: "Remplacez YOUR_API_KEY_HERE par votre clé API gratuite de jsonbin.io"
      };
    }
    return {
      configured: true,
      binId: this.binId,
      message: "✅ Configuration OK - Synchronisation active avec JSONBin.io",
      url: this.binId ? `https://api.jsonbin.io/v3/b/${this.binId}` : null
    };
  }

  async resetData() {
    console.log("🔄 Réinitialisation des données...");
    return await this.saveData(DEFAULT_DATA);
  }

  async forceReload() {
    console.log("🔄 Rechargement forcé depuis JSONBin...");
    this.cache = null;
    this.cacheTime = 0;
    return await this.loadData();
  }
}

window.JsonBinStorage = JsonBinStorage;

document.addEventListener("DOMContentLoaded", () => {
  const storage = new JsonBinStorage();
  const status = storage.getStatus();
  console.log("🏓 Sierre Tennis - JSONBin Storage:", status.message);
  if (!status.configured) {
    console.log("📝 Instructions:", status.instructions);
  } else if (status.url) {
    console.log("🔗 URL du bin:", status.url);
  }
});



