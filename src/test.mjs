// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const WeatherResult = await Qasim.happymod('telegram');
    console.log('Weather:', WeatherResult);

    const QuotesResult = await Qasim.android1('whatsapp');
    console.log('Anime Quotes:', QuotesResult);

    // Test other functions similarly
    const PlaystoreResult = await Qasim.pinterest('ignite');
    console.log('Play Store:', PlaystoreResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
