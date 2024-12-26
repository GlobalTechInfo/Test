// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.zippydl('https://zippyshare.day/91PaIz2g9IQvLQS/file');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.textmakervid('hot, glowing');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.apkmirror('telegram');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
