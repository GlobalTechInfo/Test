// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const WeatherResult = await Qasim.facebook('https://www.facebook.com/share/r/1D5NfahNB8/');
    console.log('Weather:', WeatherResult);

    const QuotesResult = await Qasim.wikisearch('whatsapp');
    console.log('Anime Quotes:', QuotesResult);

    // Test other functions similarly
    const PlaystoreResult = await Qasim.stickersearch('ignite');
    console.log('Play Store:', PlaystoreResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
