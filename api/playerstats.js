export default async function handler(req, res) {
  const { player } = req.query;

  if (!player) {
    return res.status(400).json({ error: 'Player name is required' });
  }

  try {
    // RapidAPI endpoint - oyuncu arama
    const url = `https://api-basketball.p.rapidapi.com/players?search=${encodeURIComponent(player)}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'api-basketball.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();

    // API'den sonuç gelmezse hata döndür
    if (!data || !data.response || data.response.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
}
