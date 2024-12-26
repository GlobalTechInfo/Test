// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const tiktokResult = await Qasim.rexdl('Telegram');
    console.log('TikTok Video:', tiktokResult);

    const twitterResult = await Qasim.merdekanews();
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.metronews();
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
