// api/playerstats.js
export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: 'Player name is required' });
  }

  // Girilen ismi temizle ve baş harfleri büyüt
  const formattedName = player
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    // RapidAPI key
    const apiKey = process.env.RAPIDAPI_KEY;

    // Oyuncu arama endpoint'i
    const searchResponse = await fetch(
      `https://api-basketball.p.rapidapi.com/players?search=${encodeURIComponent(formattedName)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
          'x-rapidapi-key': apiKey
        }
      }
    );

    const searchData = await searchResponse.json();

    if (!searchData.response || searchData.response.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // İlk oyuncunun ID'sini al
    const playerId = searchData.response[0].id;

    // Oyuncunun istatistiklerini çek
    const statsResponse = await fetch(
      `https://api-basketball.p.rapidapi.com/statistics/players/player/${playerId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'api-basketball.p.rapidapi.com',
          'x-rapidapi-key': apiKey
        }
      }
    );

    const statsData = await statsResponse.json();

    res.status(200).json({
      player: searchData.response[0],
      stats: statsData.response
    });

  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
}
