const Qasim = require('./index');

async function test() {
  try {
    const tiktokResult = await Qasim.job('anchor');
    console.log('TikTok Video:', tiktokResult);

    const twitterResult = await Qasim.zerochan('NARUTO');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.anoboys('japanese');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
