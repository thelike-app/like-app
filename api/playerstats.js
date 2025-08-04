export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: "Player name is required" });
  }

  try {
    const searchResponse = await fetch(`https://www.balldontlie.io/api/v1/players?search=${player}`);
    const searchData = await searchResponse.json();

    if (!searchData.data || searchData.data.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }

    const playerId = searchData.data[0].id;
    const playerFullName = `${searchData.data[0].first_name} ${searchData.data[0].last_name}`;

    const gamesResponse = await fetch(`https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerId}&per_page=10`);
    const gamesData = await gamesResponse.json();

    if (!gamesData.data || gamesData.data.length === 0) {
      return res.status(404).json({ error: "No recent games found" });
    }

    res.status(200).json({
      player: playerFullName,
      games: gamesData.data.map((game, index) => ({
        game: index + 1,
        points: game.pts,
        assists: game.ast,
        rebounds: game.reb,
        threes: game.fg3m
      }))
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
}
