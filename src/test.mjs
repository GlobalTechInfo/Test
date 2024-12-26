// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.instagram('https://www.instagram.com/reel/DEAksg-NrVT/?igsh=MWt2dnlnandsMGxubw==');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.facebook('https://www.facebook.com/share/r/14mBGGz8U7');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.film('Red');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
