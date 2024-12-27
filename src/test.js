const Qasim = require('./index');

async function test() {
  try {
    const tiktokResult = await Qasim.mangatoon('sky');
    console.log('TikTok Video:', tiktokResult);

    const twitterResult = await Qasim.styletext('sky');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.wattpad('facebook');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
