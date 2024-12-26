// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.trendtwit('Pakistan');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.pinterest('ignite');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.rexdldown('https://rexdl.com/android/rope-hero-vice-town.html');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
