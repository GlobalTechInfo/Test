// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.pinterestdl('https://pin.it/mRzIJmrED');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.gempa();
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.cariresep('https://resepkoki.id/resep/resep-ayam-woku/');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
