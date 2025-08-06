# Sports Statistics App 🏆

Kapsamlı spor istatistikleri uygulaması - Tüm sporlardan atletlerin son 10 etkinlik istatistiklerini görüntüleyin.

## 🚀 Özellikler

- **Çoklu Spor Desteği**: Basketball, Football (Soccer), Baseball, Hockey, Tennis, MMA, Formula 1
- **Gerçek Zamanlı Arama**: Atlet adı ile hızlı arama
- **Son 10 Etkinlik**: Her atletin son 10 maç/yarış/müsabaka istatistikleri
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Modern UI**: Glassmorphism tasarım ile şık arayüz

## 🏃‍♂️ Desteklenen Sporlar

### 🏀 Basketball
- NBA oyuncuları için **Ball Don't Lie API** entegrasyonu (sağlanan API anahtarı ile)
- Sayı, ribaund, asist, çalma, blok istatistikleri
- Maç sonuçları ve karşılaşmalar

### ⚽ Football (Soccer)
- Dünya çapında futbolcular
- Gol, asist, şut istatistikleri
- Maç sonuçları

### ⚾ Baseball
- MLB oyuncuları
- Hit, run, RBI, home run istatistikleri

### 🏒 Hockey
- NHL oyuncuları
- Gol, asist, şut, +/- istatistikleri

### 🎾 Tennis
- ATP/WTA oyuncuları
- Set skorları, ace, double fault istatistikleri

### 🥊 MMA
- UFC ve diğer organizasyon dövüşçüleri
- Dövüş sonuçları, method, round bilgileri

### 🏎️ Formula 1
- F1 pilotları
- Yarış pozisyonları, puan, en hızlı tur bilgileri

## 🛠️ Kurulum

### GitHub'a Upload

1. **Repository oluşturun:**
```bash
git init
git add .
git commit -m "Initial commit: Sports Statistics App"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/sports-stats-app.git
git push -u origin main
```

### Vercel'de Deploy

1. [Vercel.com](https://vercel.com)'a gidin
2. GitHub hesabınızla giriş yapın
3. "New Project" butonuna tıklayın
4. Repository'nizi seçin
5. Deploy butonuna tıklayın

## 📁 Proje Yapısı

```
sports-stats-app/
├── index.html              # Ana sayfa
├── api/
│   └── sports-stats.js     # Serverless API fonksiyonu
├── vercel.json             # Vercel konfigürasyonu
├── package.json            # Proje bağımlılıkları
└── README.md              # Bu dosya
```

## 🔧 API Kullanımı

### Endpoint
```
GET /api/sports-stats?player=ATLET_ADI&sport=SPOR_TURU
```

### Parametreler
- `player` (zorunlu): Atlet adı
- `sport` (opsiyonel): Spor türü (all, basketball, football, baseball, hockey, tennis, mma, formula1)

### Örnek İstek
```javascript
const response = await fetch('/api/sports-stats?player=LeBron James&sport=basketball');
const data = await response.json();
```

### Örnek Yanıt
```json
{
  "success": true,
  "athlete": {
    "name": "LeBron James",
    "team": "Los Angeles Lakers",
    "position": "Forward",
    "sport": "Basketball"
  },
  "statistics": {
    "recent_events": [
      {
        "date": "2024-01-15",
        "opponent": "vs Golden State Warriors",
        "points": 28,
        "rebounds": 8,
        "assists": 11,
        "result": "W"
      }
    ]
  }
}
```

## 🎯 Kullanım

1. **Atlet Arama**: Arama kutusuna atlet adını girin
2. **Spor Seçimi**: İstediğiniz spor kategorisini seçin (opsiyonel)
3. **Analiz**: "ANALYZE" butonuna tıklayın
4. **Sonuçlar**: Son 10 etkinlik istatistiklerini görüntüleyin

## 🔍 Örnek Aramalar

- **Basketball**: LeBron James, Stephen Curry, Giannis Antetokounmpo
- **Football**: Messi, Ronaldo, Neymar
- **Tennis**: Djokovic, Federer, Nadal
- **Formula 1**: Hamilton, Verstappen
- **MMA**: Jones, McGregor
- **Baseball**: Trout, Judge

## 🚀 Geliştirme

### Yerel Çalıştırma
```bash
npm install -g vercel
vercel dev
```

### API Geliştirme
API fonksiyonları `/api/sports-stats.js` dosyasında bulunur. Yeni spor türleri eklemek için:

1. Yeni API handler fonksiyonu oluşturun
2. `searchMultipleSportsAPIs` fonksiyonuna ekleyin
3. Frontend'de spor seçici butonuna ekleyin

## 🔐 API Anahtarları

**Ball Don't Lie API için sağladığınız anahtar (`ef97e450-1fd1-4d12-8535-6357d948f65c`) `vercel.json` dosyasına eklenmiştir.**

Diğer gerçek API'ler için API anahtarları gerekebilir:

- **API-Sports**: RapidAPI üzerinden
- **SportsDataIO**: Doğrudan kayıt

Environment variables olarak ekleyin:
```bash
vercel env add API_SPORTS_KEY
vercel env add SPORTSDATA_KEY
```

## 📱 Responsive Tasarım

- **Desktop**: Grid layout ile çoklu kart görünümü
- **Mobile**: Tek sütun layout
- **Tablet**: Otomatik uyarlanır

## 🎨 Özelleştirme

### Tema Değişikliği
CSS değişkenleri ile kolay tema özelleştirmesi:

```css
:root {
  --primary-color: #4CAF50;
  --background-gradient: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  --card-background: rgba(255, 255, 255, 0.05);
}
```

### Yeni Spor Ekleme
1. API handler fonksiyonu yazın
2. Mock data veya gerçek API entegrasyonu
3. Frontend spor seçiciye ekleyin

## 🐛 Sorun Giderme

### API Hatası
- Network bağlantısını kontrol edin
- API anahtarlarını doğrulayın
- Rate limit kontrolü yapın

### Atlet Bulunamadı
- Atlet adını doğru yazdığınızdan emin olun
- Farklı spor kategorilerini deneyin
- Tam ad yerine sadece soyadı deneyin

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- GitHub Issues'da sorun bildirin
- README'yi tekrar okuyun
- Vercel logs'ları kontrol edin

---

**Not**: Bu uygulama demo amaçlıdır. Gerçek production kullanımı için uygun API anahtarları ve rate limiting ekleyin.

