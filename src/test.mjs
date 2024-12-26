// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.android1('telegram');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.mangatoon('ring');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.happymod('telegram');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
