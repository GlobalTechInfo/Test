// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.bacaresep('nature');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.searchgore('hot');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.randomgore();
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
