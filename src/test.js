const { Qasim } = require('./index');

async function test() {
  try {
    const tiktokResult = await Qasim.tiktokDl('https://www.tiktok.com/@username/video/1234567890');
    console.log('TikTok Video:', tiktokResult);

    const twitterResult = await Qasim.xdown('https://x.com/someuser/status/1234567890');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.MediaUmma('https://media.example.com');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
