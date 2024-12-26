const Qasim = require('./index');

async function test() {
  try {
    const tiktokResult = await Qasim.tiktokDl('https://vm.tiktok.com/ZS6MECcuP');
    console.log('TikTok Video:', tiktokResult);

    const twitterResult = await Qasim.xdown('https://x.com/Shumail03099172/status/1869339539418038286?s=19');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.MediaUmma('https://www.ummamedia.co.za/2024/10/21/south-africa-expect-tough-challenge-from-bangladesh-even-without-shakib');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
