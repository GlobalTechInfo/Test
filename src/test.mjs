// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.anoboys('manager');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.webtoons('doctor');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.film('ignite');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
