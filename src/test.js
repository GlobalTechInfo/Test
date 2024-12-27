const Qasim = require('./index');

async function test() {
  try {
    const tiktokResult = await Qasim.soundcloud('https://on.soundcloud.com/cqEntUzm36EjbEwW7');
    console.log('TikTok Video:', tiktokResult);

    const twitterResult = await Qasim.wallpaper('nature');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.apkmirror('telegram');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
