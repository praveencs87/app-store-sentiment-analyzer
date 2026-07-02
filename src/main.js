import { Actor } from 'apify';
import gplay from 'google-play-scraper';
import appStore from 'app-store-scraper';
import Sentiment from 'sentiment';

await Actor.init();

try {
    const input = await Actor.getInput();
    
    if (!input || !input.appId || !input.platform) {
        throw new Error('Please provide appId and platform in the input!');
    }

    const { appId, platform, maxReviews = 100 } = input;
    const sentimentAnalyzer = new Sentiment();

    console.log(`Starting sentiment analysis for ${appId} on ${platform}...`);
    console.log(`Max reviews to extract: ${maxReviews}`);

    let extractedReviews = [];

    if (platform === 'google-play') {
        const reviews = await gplay.reviews({
            appId,
            sort: gplay.sort.NEWEST,
            num: maxReviews
        });
        
        // Some versions of gplay.reviews return an object {data: []} or just an array
        const reviewData = reviews.data || reviews;
        extractedReviews = reviewData.slice(0, maxReviews);
    } else if (platform === 'app-store') {
        // App store limits reviews per page, we might need to fetch multiple pages
        const pages = Math.ceil(maxReviews / 50);
        for (let page = 1; page <= pages && page <= 10; page++) {
            try {
                const reviews = await appStore.reviews({
                    appId: appId.toString(),
                    sort: appStore.sort.RECENT,
                    page
                });
                
                if (!reviews || reviews.length === 0) break;
                extractedReviews.push(...reviews);
                
                if (extractedReviews.length >= maxReviews) break;
            } catch (err) {
                console.error(`Failed to fetch App Store page ${page}:`, err.message);
                break;
            }
        }
        extractedReviews = extractedReviews.slice(0, maxReviews);
    } else {
        throw new Error(`Unsupported platform: ${platform}`);
    }

    console.log(`Extracted ${extractedReviews.length} reviews. Running sentiment analysis...`);

    let processedCount = 0;
    
    for (const review of extractedReviews) {
        // Normalize text content based on platform
        const text = review.text || review.content || '';
        const title = review.title || '';
        const fullText = `${title} ${text}`.trim();
        
        if (!fullText) continue;

        // Calculate sentiment
        const sentimentResult = sentimentAnalyzer.analyze(fullText);
        
        let category = 'Neutral';
        if (sentimentResult.score > 0) category = 'Positive';
        else if (sentimentResult.score < 0) category = 'Negative';

        const outputData = {
            id: review.id,
            platform,
            appId,
            author: review.userName || review.author,
            title,
            text,
            rating: review.score || review.rating,
            date: review.date,
            sentiment: {
                score: sentimentResult.score,
                comparative: sentimentResult.comparative,
                category,
                positiveWords: sentimentResult.positive,
                negativeWords: sentimentResult.negative
            },
            scrapedAt: new Date().toISOString()
        };

        // PPE Monetization - Charge per processed review
        await Actor.charge({ eventName: 'review-analyzed', count: 1 });
        await Actor.pushData(outputData);
        processedCount++;
    }

    console.log(`✅ Successfully extracted, analyzed, and saved ${processedCount} reviews!`);

} catch (error) {
    console.error('Actor failed:', error);
    throw error;
}

await Actor.exit();
