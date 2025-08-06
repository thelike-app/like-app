// /api/sports-stats.js - Vercel Serverless Function

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { player, sport = 'all' } = req.query;

  if (!player) {
    return res.status(400).json({ error: "Player name is required" });
  }

  try {
    // Try multiple APIs for comprehensive sports coverage
    const result = await searchMultipleSportsAPIs(player, sport);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "Athlete not found in any sports database" });
    }
  } catch (error) {
    console.error("Error fetching sports stats:", error);
    return res.status(500).json({ error: "Failed to fetch athlete statistics" });
  }
}

async function searchMultipleSportsAPIs(playerName, sport) {
  const apis = [
    { name: 'basketball', handler: searchBasketballAPI },
    { name: 'football', handler: searchFootballAPI },
    { name: 'baseball', handler: searchBaseballAPI },
    { name: 'hockey', handler: searchHockeyAPI },
    { name: 'tennis', handler: searchTennisAPI },
    { name: 'mma', handler: searchMMAAPI },
    { name: 'formula1', handler: searchFormula1API }
  ];

  // If specific sport is selected, try that first
  if (sport !== 'all') {
    const specificAPI = apis.find(api => api.name === sport);
    if (specificAPI) {
      const result = await specificAPI.handler(playerName);
      if (result.success) return result;
    }
  }

  // Try all APIs if no specific sport or specific sport failed
  for (const api of apis) {
    try {
      const result = await api.handler(playerName);
      if (result.success) {
        return result;
      }
    } catch (error) {
      console.log(`${api.name} API failed:`, error.message);
      continue;
    }
  }

  return { success: false, error: "Player not found in any sports database" };
}

// Basketball API (NBA/WNBA) - Using Ball Don't Lie API
async function searchBasketballAPI(playerName) {
  try {
    // Ball Don't Lie API - Free NBA API
    const searchResponse = await fetch(
      `https://www.balldontlie.io/api/v1/players?search=${encodeURIComponent(playerName)}`,
      {
        headers: {
          'User-Agent': 'Sports-Stats-App/1.0'
        }
      }
    );
    
    if (!searchResponse.ok) {
      console.log('Basketball API response not ok:', searchResponse.status);
      return { success: false };
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.data || searchData.data.length === 0) {
      return { success: false };
    }

    const player = searchData.data[0];
    
    // Get player stats for current season
    const statsResponse = await fetch(
      `https://www.balldontlie.io/api/v1/stats?player_ids[]=${player.id}&seasons[]=2023&per_page=10`,
      {
        headers: {
          'User-Agent': 'Sports-Stats-App/1.0'
        }
      }
    );
    
    if (!statsResponse.ok) {
      console.log('Basketball stats API response not ok:', statsResponse.status);
      // Return player info without stats if stats API fails
      return {
        success: true,
        athlete: {
          name: `${player.first_name} ${player.last_name}`,
          team: player.team?.full_name || 'Free Agent',
          position: player.position || 'N/A',
          sport: 'Basketball'
        },
        statistics: {
          recent_events: []
        }
      };
    }
    
    const statsData = await statsResponse.json();
    
    return {
      success: true,
      athlete: {
        name: `${player.first_name} ${player.last_name}`,
        team: player.team?.full_name || 'Free Agent',
        position: player.position || 'N/A',
        sport: 'Basketball'
      },
      statistics: {
        recent_events: statsData.data?.slice(0, 10).map(game => ({
          date: game.game?.date || 'Recent',
          opponent: `vs ${game.game?.home_team?.abbreviation === player.team?.abbreviation ? 
                      game.game?.visitor_team?.full_name : game.game?.home_team?.full_name}`,
          points: game.pts || 0,
          rebounds: game.reb || 0,
          assists: game.ast || 0,
          steals: game.stl || 0,
          blocks: game.blk || 0,
          minutes: game.min || '0:00',
          result: game.game?.home_team_score && game.game?.visitor_team_score ? 
                  (game.game?.home_team_score > game.game?.visitor_team_score ? 
                    (game.game?.home_team?.abbreviation === player.team?.abbreviation ? 'W' : 'L') :
                    (game.game?.visitor_team?.abbreviation === player.team?.abbreviation ? 'W' : 'L')) : 'N/A'
        })) || []
      }
    };
  } catch (error) {
    console.log('Basketball API error:', error);
    return { success: false };
  }
}

// Football API (Soccer) - Mock data with realistic players
async function searchFootballAPI(playerName) {
  try {
    const mockPlayers = {
      'messi': {
        name: 'Lionel Messi',
        team: 'Inter Miami CF',
        position: 'Forward',
        sport: 'Football'
      },
      'lionel messi': {
        name: 'Lionel Messi',
        team: 'Inter Miami CF',
        position: 'Forward',
        sport: 'Football'
      },
      'ronaldo': {
        name: 'Cristiano Ronaldo',
        team: 'Al Nassr',
        position: 'Forward',
        sport: 'Football'
      },
      'cristiano ronaldo': {
        name: 'Cristiano Ronaldo',
        team: 'Al Nassr',
        position: 'Forward',
        sport: 'Football'
      },
      'neymar': {
        name: 'Neymar Jr',
        team: 'Al Hilal',
        position: 'Forward',
        sport: 'Football'
      },
      'mbappe': {
        name: 'Kylian Mbappé',
        team: 'Real Madrid',
        position: 'Forward',
        sport: 'Football'
      },
      'kylian mbappe': {
        name: 'Kylian Mbappé',
        team: 'Real Madrid',
        position: 'Forward',
        sport: 'Football'
      },
      'haaland': {
        name: 'Erling Haaland',
        team: 'Manchester City',
        position: 'Forward',
        sport: 'Football'
      },
      'erling haaland': {
        name: 'Erling Haaland',
        team: 'Manchester City',
        position: 'Forward',
        sport: 'Football'
      }
    };
    
    const playerKey = playerName.toLowerCase().trim();
    const player = mockPlayers[playerKey];
    
    if (!player) {
      return { success: false };
    }
    
    // Generate realistic recent games data
    const recentGames = Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      opponent: `vs ${['Barcelona', 'Real Madrid', 'Manchester United', 'Liverpool', 'Bayern Munich', 'PSG', 'Juventus', 'Chelsea', 'Arsenal', 'AC Milan'][i]}`,
      goals: Math.floor(Math.random() * 3),
      assists: Math.floor(Math.random() * 2),
      shots: Math.floor(Math.random() * 8) + 2,
      passes: Math.floor(Math.random() * 50) + 30,
      result: Math.random() > 0.3 ? 'W' : (Math.random() > 0.5 ? 'D' : 'L')
    }));
    
    return {
      success: true,
      athlete: player,
      statistics: {
        recent_events: recentGames
      }
    };
  } catch (error) {
    return { success: false };
  }
}

// Baseball API - Mock data
async function searchBaseballAPI(playerName) {
  try {
    const mockPlayers = {
      'trout': {
        name: 'Mike Trout',
        team: 'Los Angeles Angels',
        position: 'Center Field',
        sport: 'Baseball'
      },
      'mike trout': {
        name: 'Mike Trout',
        team: 'Los Angeles Angels',
        position: 'Center Field',
        sport: 'Baseball'
      },
      'judge': {
        name: 'Aaron Judge',
        team: 'New York Yankees',
        position: 'Right Field',
        sport: 'Baseball'
      },
      'aaron judge': {
        name: 'Aaron Judge',
        team: 'New York Yankees',
        position: 'Right Field',
        sport: 'Baseball'
      },
      'ohtani': {
        name: 'Shohei Ohtani',
        team: 'Los Angeles Dodgers',
        position: 'Designated Hitter / Pitcher',
        sport: 'Baseball'
      },
      'shohei ohtani': {
        name: 'Shohei Ohtani',
        team: 'Los Angeles Dodgers',
        position: 'Designated Hitter / Pitcher',
        sport: 'Baseball'
      }
    };
    
    const playerKey = playerName.toLowerCase().trim();
    const player = mockPlayers[playerKey];
    
    if (!player) {
      return { success: false };
    }
    
    const recentGames = Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      opponent: `vs ${['Red Sox', 'Astros', 'Dodgers', 'Mets', 'Braves', 'Phillies', 'Padres', 'Giants', 'Cubs', 'Cardinals'][i]}`,
      hits: Math.floor(Math.random() * 4),
      runs: Math.floor(Math.random() * 3),
      rbis: Math.floor(Math.random() * 4),
      home_runs: Math.random() > 0.8 ? 1 : 0,
      batting_avg: (0.200 + Math.random() * 0.200).toFixed(3),
      result: Math.random() > 0.5 ? 'W' : 'L'
    }));
    
    return {
      success: true,
      athlete: player,
      statistics: {
        recent_events: recentGames
      }
    };
  } catch (error) {
    return { success: false };
  }
}

// Hockey API - Mock data
async function searchHockeyAPI(playerName) {
  try {
    const mockPlayers = {
      'mcdavid': {
        name: 'Connor McDavid',
        team: 'Edmonton Oilers',
        position: 'Center',
        sport: 'Hockey'
      },
      'connor mcdavid': {
        name: 'Connor McDavid',
        team: 'Edmonton Oilers',
        position: 'Center',
        sport: 'Hockey'
      },
      'ovechkin': {
        name: 'Alexander Ovechkin',
        team: 'Washington Capitals',
        position: 'Left Wing',
        sport: 'Hockey'
      },
      'alexander ovechkin': {
        name: 'Alexander Ovechkin',
        team: 'Washington Capitals',
        position: 'Left Wing',
        sport: 'Hockey'
      },
      'crosby': {
        name: 'Sidney Crosby',
        team: 'Pittsburgh Penguins',
        position: 'Center',
        sport: 'Hockey'
      },
      'sidney crosby': {
        name: 'Sidney Crosby',
        team: 'Pittsburgh Penguins',
        position: 'Center',
        sport: 'Hockey'
      }
    };
    
    const playerKey = playerName.toLowerCase().trim();
    const player = mockPlayers[playerKey];
    
    if (!player) {
      return { success: false };
    }
    
    const recentGames = Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      opponent: `vs ${['Rangers', 'Bruins', 'Lightning', 'Panthers', 'Maple Leafs', 'Canadiens', 'Flames', 'Canucks', 'Kings', 'Sharks'][i]}`,
      goals: Math.floor(Math.random() * 3),
      assists: Math.floor(Math.random() * 3),
      shots: Math.floor(Math.random() * 8) + 2,
      plus_minus: Math.floor(Math.random() * 5) - 2,
      ice_time: `${Math.floor(Math.random() * 10) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      result: Math.random() > 0.5 ? 'W' : 'L'
    }));
    
    return {
      success: true,
      athlete: player,
      statistics: {
        recent_events: recentGames
      }
    };
  } catch (error) {
    return { success: false };
  }
}

// Tennis API - Mock data
async function searchTennisAPI(playerName) {
  try {
    const mockPlayers = {
      'djokovic': {
        name: 'Novak Djokovic',
        team: 'Serbia',
        position: 'Singles',
        sport: 'Tennis'
      },
      'novak djokovic': {
        name: 'Novak Djokovic',
        team: 'Serbia',
        position: 'Singles',
        sport: 'Tennis'
      },
      'federer': {
        name: 'Roger Federer',
        team: 'Switzerland',
        position: 'Singles',
        sport: 'Tennis'
      },
      'roger federer': {
        name: 'Roger Federer',
        team: 'Switzerland',
        position: 'Singles',
        sport: 'Tennis'
      },
      'nadal': {
        name: 'Rafael Nadal',
        team: 'Spain',
        position: 'Singles',
        sport: 'Tennis'
      },
      'rafael nadal': {
        name: 'Rafael Nadal',
        team: 'Spain',
        position: 'Singles',
        sport: 'Tennis'
      },
      'alcaraz': {
        name: 'Carlos Alcaraz',
        team: 'Spain',
        position: 'Singles',
        sport: 'Tennis'
      },
      'carlos alcaraz': {
        name: 'Carlos Alcaraz',
        team: 'Spain',
        position: 'Singles',
        sport: 'Tennis'
      }
    };
    
    const playerKey = playerName.toLowerCase().trim();
    const player = mockPlayers[playerKey];
    
    if (!player) {
      return { success: false };
    }
    
    const recentMatches = Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      opponent: `vs Player ${i + 1}`,
      sets_won: Math.floor(Math.random() * 3) + 1,
      sets_lost: Math.floor(Math.random() * 3),
      aces: Math.floor(Math.random() * 15) + 5,
      double_faults: Math.floor(Math.random() * 5),
      first_serve_pct: Math.floor(Math.random() * 30 + 60),
      result: Math.random() > 0.2 ? 'W' : 'L'
    }));
    
    return {
      success: true,
      athlete: player,
      statistics: {
        recent_events: recentMatches
      }
    };
  } catch (error) {
    return { success: false };
  }
}

// MMA API - Mock data
async function searchMMAAPI(playerName) {
  try {
    const mockFighters = {
      'jones': {
        name: 'Jon Jones',
        team: 'Jackson Wink MMA',
        position: 'Heavyweight Champion',
        sport: 'MMA'
      },
      'jon jones': {
        name: 'Jon Jones',
        team: 'Jackson Wink MMA',
        position: 'Heavyweight Champion',
        sport: 'MMA'
      },
      'mcgregor': {
        name: 'Conor McGregor',
        team: 'SBG Ireland',
        position: 'Lightweight',
        sport: 'MMA'
      },
      'conor mcgregor': {
        name: 'Conor McGregor',
        team: 'SBG Ireland',
        position: 'Lightweight',
        sport: 'MMA'
      },
      'adesanya': {
        name: 'Israel Adesanya',
        team: 'City Kickboxing',
        position: 'Middleweight',
        sport: 'MMA'
      },
      'israel adesanya': {
        name: 'Israel Adesanya',
        team: 'City Kickboxing',
        position: 'Middleweight',
        sport: 'MMA'
      }
    };
    
    const playerKey = playerName.toLowerCase().trim();
    const fighter = mockFighters[playerKey];
    
    if (!fighter) {
      return { success: false };
    }
    
    const recentFights = Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() - i * 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      opponent: `vs Fighter ${i + 1}`,
      method: ['Decision', 'KO/TKO', 'Submission'][Math.floor(Math.random() * 3)],
      round: Math.floor(Math.random() * 5) + 1,
      time: `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      result: Math.random() > 0.15 ? 'W' : 'L'
    }));
    
    return {
      success: true,
      athlete: fighter,
      statistics: {
        recent_events: recentFights
      }
    };
  } catch (error) {
    return { success: false };
  }
}

// Formula 1 API - Mock data
async function searchFormula1API(playerName) {
  try {
    const mockDrivers = {
      'hamilton': {
        name: 'Lewis Hamilton',
        team: 'Ferrari',
        position: 'Driver',
        sport: 'Formula 1'
      },
      'lewis hamilton': {
        name: 'Lewis Hamilton',
        team: 'Ferrari',
        position: 'Driver',
        sport: 'Formula 1'
      },
      'verstappen': {
        name: 'Max Verstappen',
        team: 'Red Bull Racing',
        position: 'Driver',
        sport: 'Formula 1'
      },
      'max verstappen': {
        name: 'Max Verstappen',
        team: 'Red Bull Racing',
        position: 'Driver',
        sport: 'Formula 1'
      },
      'leclerc': {
        name: 'Charles Leclerc',
        team: 'Ferrari',
        position: 'Driver',
        sport: 'Formula 1'
      },
      'charles leclerc': {
        name: 'Charles Leclerc',
        team: 'Ferrari',
        position: 'Driver',
        sport: 'Formula 1'
      }
    };
    
    const playerKey = playerName.toLowerCase().trim();
    const driver = mockDrivers[playerKey];
    
    if (!driver) {
      return { success: false };
    }
    
    const recentRaces = Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - i * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      event_name: `${['Monaco', 'Silverstone', 'Monza', 'Spa', 'Suzuka', 'Interlagos', 'Austin', 'Bahrain', 'Australia', 'Canada'][i]} GP`,
      position: Math.floor(Math.random() * 20) + 1,
      points: Math.max(0, 26 - Math.floor(Math.random() * 26)),
      fastest_lap: Math.random() > 0.8 ? 'Yes' : 'No',
      grid_position: Math.floor(Math.random() * 20) + 1,
      result: Math.floor(Math.random() * 20) + 1 <= 10 ? 'Points' : 'No Points'
    }));
    
    return {
      success: true,
      athlete: driver,
      statistics: {
        recent_events: recentRaces
      }
    };
  } catch (error) {
    return { success: false };
  }
}

