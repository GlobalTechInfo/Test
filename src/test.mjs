// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.wikisearch('Pakistan');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.sfilesearch('telegram');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.wattpad('telegram');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
