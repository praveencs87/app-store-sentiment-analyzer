# App Store & Google Play Sentiment Analyzer

**Extract user reviews from Google Play or the Apple App Store and automatically calculate their sentiment scores (Positive, Negative, Neutral).**

Instantly understand what users love or hate about any mobile application. This actor safely extracts authentic user reviews from official app stores and runs them through a lightweight Natural Language Processing (NLP) sentiment analyzer.

## What can this Actor do?

- ✅ **Google Play Support** - Extract reviews from any Android app.
- ✅ **Apple App Store Support** - Extract reviews from any iOS app.
- ✅ **Automated Sentiment Analysis** - Every review gets scored and categorized as Positive, Negative, or Neutral.
- ✅ **Keyword Extraction** - Identifies the specific positive and negative words used in the review.
- ✅ **Export formats** - Download the rich data as JSON, CSV, or Excel.

## Why scrape App Store reviews?

- 🎯 **Competitor Analysis** - Find out exactly what users hate about your competitor's app so you can build a better feature.
- 📊 **Product Feedback** - Aggregate sentiment trends over time for your own app.
- 📍 **Market Research** - Validate app ideas before building them by reading complaints in similar apps.

## How to use it

1. Select your platform (Google Play or App Store).
2. Enter the **App ID**.
   - *For Google Play:* The ID in the URL after `id=` (e.g., `com.whatsapp`).
   - *For App Store:* The numeric ID in the URL (e.g., `310633997`).
3. Set the maximum number of reviews to extract.
4. Click Start!

## How much does it cost?

This actor uses a **Pay-Per-Event (PPE)** pricing model. You only pay for the successful data you extract!
- **$1.50 per 1,000 reviews analyzed.**

## Output Example

```json
{
  "id": "gp:AOqpTOE...",
  "platform": "google-play",
  "appId": "com.whatsapp",
  "author": "John Doe",
  "title": "",
  "text": "I absolutely love this app, but the new update is completely broken.",
  "rating": 3,
  "date": "2023-10-25T14:30:00.000Z",
  "sentiment": {
    "score": 1,
    "comparative": 0.08,
    "category": "Positive",
    "positiveWords": ["love"],
    "negativeWords": ["broken"]
  },
  "scrapedAt": "2023-10-25T15:00:00.000Z"
}
```
