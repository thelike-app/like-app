// /api/playerstats.js

export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: "Player name is required" });
  }

  try {
    // 1. Oyuncuyu ara (BallDontLie API)
    const searchResponse = await fetch(
      `https://api.balldontlie.io/v1/players?search=${encodeURIComponent(player)}`,
      {
        headers: {
          "Authorization": process.env.BALLDONTLIE_API_KEY
        }
      }
    );

    const searchData = await searchResponse.json();

    if (!searchData.data || searchData.data.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const playerId = searchData.data[0].id;

    // 2. Oyuncu istatistiklerini çek (2023 sezonu)
    const statsResponse = await fetch(
      `https://api.balldontlie.io/v1/stats?player_ids[]=${playerId}&seasons[]=2023`,
      {
        headers: {
          "Authorization": process.env.BALLDONTLIE_API_KEY
        }
      }
    );

    const statsData = await statsResponse.json();

    return res.status(200).json({
      player: searchData.data[0], // Oyuncu bilgileri
      stats: statsData.data       // İstatistikler
    });

  } catch (error) {
    console.error("Error fetching player stats:", error);
    return res.status(500).json({ error: "Failed to fetch player stats" });
  }
}
