const Qasim = require('./index');

async function test() {
  try {
    const filmResult = await Qasim.ringtone('nokia');
    console.log('Film:', filmResult);

    const zerochanResult = await Qasim.gempa();
    console.log('Manga Urls:', zerochanResult);

    // Test other functions similarly
    const anoboysResult = await Qasim.wattpad('japan');
    console.log('Ano Boys:', anoboysResult);

  } catch (error) {
    console.error('Error:', error);
  }
}

test();
