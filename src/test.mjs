// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const WeatherResult = await Qasim.cariresep('https://resepkoki.id/resep-nasi-daun-jeruk-praktis-untuk-menu-sehari-hari/');
    console.log('Weather:', WeatherResult);

    const QuotesResult = await Qasim.konachan('neko');
    console.log('Anime Quotes:', QuotesResult);

    // Test other functions similarly
    const PlaystoreResult = await Qasim.apksearch('whatsapp');
    console.log('Play Store:', PlaystoreResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
