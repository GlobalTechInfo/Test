// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const WeatherResult = await Qasim.weather('Lahore');
    console.log('Weather:', WeatherResult);

    const QuotesResult = await Qasim.quotesanime();
    console.log('Anime Quotes:', QuotesResult);

    // Test other functions similarly
    const PlaystoreResult = await Qasim.playstore('whatsapp');
    console.log('Play Store:', PlaystoreResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
