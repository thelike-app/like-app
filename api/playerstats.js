export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: 'Player name is required' });
  }

  try {
    const apiKey = process.env.RAPIDAPI_KEY;

    // RapidAPI Player Search endpoint
    const searchResponse = await fetch(
      `https://api-basketball.p.rapidapi.com/players?search=${encodeURIComponent(player)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'api-basketball.p.rapidapi.com',
        },
      }
    );

    const searchData = await searchResponse.json();

    if (!searchData.response || searchData.response.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const playerId = searchData.response[0].id;

    // RapidAPI Player Statistics endpoint
    const statsResponse = await fetch(
      `https://api-basketball.p.rapidapi.com/statistics/players/player/${playerId}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'api-basketball.p.rapidapi.com',
        },
      }
    );

    const statsData = await statsResponse.json();

    res.status(200).json({
      player: searchData.response[0],
      stats: statsData.response,
    });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
}
