// test.mjs
import Qasim from './index.mjs';

async function test() {
  try {
    const asupanfilmResult = await Qasim.chara('Itachi UCHIHA');
    console.log('TikTok Video:', asupanfilmResult);

    const twitterResult = await Qasim.happymoddl('https://happymod.com/race-max-pro-car-racing-mod/game.revani.racemaxpro');
    console.log('X Video:', twitterResult);

    // Test other functions similarly
    const mediaResult = await Qasim.zerochan('ignite');
    console.log('Media Umma:', mediaResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
