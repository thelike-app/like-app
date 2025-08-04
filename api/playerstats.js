export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: 'Player name is required' });
  }

  try {
    // Oyuncu bilgilerini al
    const searchResponse = await fetch(`https://www.balldontlie.io/api/v1/players?search=${encodeURIComponent(player)}`);
    const searchData = await searchResponse.json();

    if (!searchData.data || searchData.data.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const playerId = searchData.data[0].id;

    // Oyuncunun son 10 maç istatistiklerini al
    const statsResponse = await fetch(`https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerId}&per_page=10`);
    const statsData = await statsResponse.json();

    res.status(200).json({
      player: searchData.data[0],
      stats: statsData.data
    });

  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
}
