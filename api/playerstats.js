// like-app/api/playerstats.js

export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: "Player name is required" });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = "api-nba-v1.p.rapidapi.com";

  try {
    // 1️⃣ Oyuncu arama
    const searchUrl = `https://${apiHost}/players?search=${encodeURIComponent(player)}`;
    const searchResponse = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost
      }
    });

    const searchData = await searchResponse.json();

    if (!searchData.response || searchData.response.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const playerInfo = searchData.response[0];
    const playerId = playerInfo.id;

    // 2️⃣ Oyuncu istatistikleri
    const statsUrl = `https://${apiHost}/players/statistics?id=${playerId}&season=2023`;
    const statsResponse = await fetch(statsUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost
      }
    });

    const statsData = await statsResponse.json();

    res.status(200).json({
      player: playerInfo,
      stats: statsData.response
    });

  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
}
