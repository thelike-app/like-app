export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: "Player name is required" });
  }

  try {
    // RapidAPI anahtarını environment variable'dan al
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    // 1. Oyuncu araması yap
    const searchUrl = `https://api-basketball.p.rapidapi.com/players?search=${encodeURIComponent(player)}`;
    const searchResponse = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "api-basketball.p.rapidapi.com",
        "x-rapidapi-key": apiKey
      }
    });

    const searchData = await searchResponse.json();
    if (!searchData.response || searchData.response.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const playerId = searchData.response[0].id;

    // 2. Oyuncu istatistiklerini çek
    const statsUrl = `https://api-basketball.p.rapidapi.com/statistics/players/player/${playerId}`;
    const statsResponse = await fetch(statsUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "api-basketball.p.rapidapi.com",
        "x-rapidapi-key": apiKey
      }
    });

    const statsData = await statsResponse.json();

    res.status(200).json({
      player: searchData.response[0],
      stats: statsData.response
    });

  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
}
