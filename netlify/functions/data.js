// Version simplifiée utilisant GitHub Gist comme base de données
// GitHub Gist est gratuit et permet de stocker des fichiers JSON

const GITHUB_TOKEN = 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Token d'exemple
const GIST_ID = 'your-gist-id-here'; // ID du Gist

// Données par défaut
const defaultData = {
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
  venuesData: { venues: [], teams: [] },
  isAuthenticated: false
};

// Stockage temporaire en mémoire avec persistance simulée
let dataStore = { ...defaultData };
let lastSaveTime = Date.now();

// Simulation d'une base de données persistante
// En production, remplacer par une vraie base de données
const STORAGE_KEY = 'sierre_tennis_data';

// Fonctions de persistance simulée
function saveToStorage(data) {
  // En production, ceci ferait un appel à une vraie base de données
  dataStore = { ...data };
  lastSaveTime = Date.now();
  console.log('Data saved at:', new Date(lastSaveTime).toISOString());
  return true;
}

function loadFromStorage() {
  // En production, ceci chargerait depuis une vraie base de données
  return { ...dataStore };
}

exports.handler = async (event, context) => {
  // Gérer CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { httpMethod, path, body } = event;
    const requestData = body ? JSON.parse(body) : {};

    // Extraire l'action de l'URL
    const pathParts = path.split('/');
    const action = pathParts[pathParts.length - 1];

    // Charger les données actuelles
    const currentData = loadFromStorage();

    switch (httpMethod) {
      case 'GET':
        return handleGet(action, currentData, headers);
      case 'POST':
        return handlePost(action, requestData, currentData, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

function handleGet(action, data, headers) {
  console.log('GET request for:', action);
  
  switch (action) {
    case 'players':
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.playersData || [])
      };
    case 'matches':
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.matchData || [])
      };
    case 'availability':
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.playerAvailability || {})
      };
    case 'settings':
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ league_title: data.leagueTitle || "5ème Ligue - Saison 2025/26" })
      };
    case 'venues':
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.venuesData?.venues || [])
      };
    case 'teams':
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.venuesData?.teams || [])
      };
    case 'auth-status':
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ authenticated: data.isAuthenticated || false })
      };
    default:
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Endpoint not found' })
      };
  }
}

function handlePost(action, requestData, currentData, headers) {
  console.log('POST request for:', action, 'with data:', requestData);
  
  try {
    let updatedData = { ...currentData };

    switch (action) {
      case 'login':
        if (requestData.username === 'ADMIN' && requestData.password === 'Kp7mN9qR3x') {
          updatedData.isAuthenticated = true;
          saveToStorage(updatedData);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Logged in successfully' })
          };
        } else {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials' })
          };
        }

      case 'logout':
        updatedData.isAuthenticated = false;
        saveToStorage(updatedData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };

      case 'save-players':
        updatedData.playersData = requestData;
        saveToStorage(updatedData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Players saved successfully' })
        };

      case 'save-matches':
        updatedData.matchData = requestData;
        saveToStorage(updatedData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Matches saved successfully' })
        };

      case 'save-availability':
        updatedData.playerAvailability = requestData;
        saveToStorage(updatedData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Availability saved successfully' })
        };

      case 'update-availability':
        if (!updatedData.playerAvailability) {
          updatedData.playerAvailability = {};
        }
        if (!updatedData.playerAvailability[requestData.match_id]) {
          updatedData.playerAvailability[requestData.match_id] = {};
        }
        updatedData.playerAvailability[requestData.match_id][requestData.player_id] = requestData.status;
        saveToStorage(updatedData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Availability updated successfully' })
        };

      case 'save-settings':
        updatedData.leagueTitle = requestData.league_title;
        saveToStorage(updatedData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Settings saved successfully' })
        };

      case 'save-venues':
        if (!updatedData.venuesData) {
          updatedData.venuesData = {};
        }
        updatedData.venuesData.venues = requestData;
        saveToStorage(updatedData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Venues saved successfully' })
        };

      case 'reset-data':
        saveToStorage(defaultData);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Data reset successfully' })
        };

      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Endpoint not found' })
        };
    }
  } catch (error) {
    console.error('Error in handlePost:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + error.message })
    };
  }
}

