const Qasim = require('./index');

async function test() {
  try {
    const tiktokResult = await Qasim.wallpapercraft('sky');
    console.log('TikTok Video:', tiktokResult);

    const twitterResult = await Qasim.wallpaper('sky');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.ssweb('https://github.com/GlobalTechInfo/Test');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
