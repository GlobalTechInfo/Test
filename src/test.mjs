// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.palingmurah('netflix');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.wallpaper('nature');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.ringtone('nokia');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
