// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.stickersearch('Babar Azam');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.merdekanews();
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.randomtt('Indonesia');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
