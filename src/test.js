const Qasim = require('./index');

async function test() {
  try {
    const filmResult = await Qasim.film('anchor');
    console.log('Film:', filmResult);

    const zerochanResult = await Qasim.zerochan('NARUTO');
    console.log('Manga Urls:', zerochanResult);

    // Test other functions similarly
    const anoboysResult = await Qasim.anoboys('japanese');
    console.log('Ano Boys:', anoboysResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
