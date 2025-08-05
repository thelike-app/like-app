export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: "Player name is required" });
  }

  try {
    const searchUrl = `https://www.balldontlie.io/api/v1/players?search=${encodeURIComponent(player)}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    // Debug: API cevabını aynen döndür
    if (!searchData.data || searchData.data.length === 0) {
      return res.status(404).json({
        error: "Player not found",
        debug: searchData // Burada API cevabı gözükecek
      });
    }

    const playerInfo = searchData.data[0];
    const playerId = playerInfo.id;

    const statsUrl = `https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerId}&seasons[]=2023`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    res.status(200).json({
      player: playerInfo,
      stats: statsData.data
    });

  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ error: "Failed to fetch player stats", debug: error.message });
  }
}
