const cheerio = require('cheerio')
const fetch = require('node-fetch')
const axios = require('axios')
const _math = require('mathjs')
const _url = require('url')
const qs = require('qs')
const request = require('request');
const randomarray = async (array) => {
	return array[Math.floor(Math.random() * array.length)]
};

// rexdl function: search for apps
exports.rexdl = async (query) => {
  try {
    const { data } = await axios.get('https://rexdl.com/?s=' + query);
    const $ = cheerio.load(data);

    const result = [];
    $('div > div.post-content').each(function () {
      const judul = $(this).find('h2.post-title > a').attr('title');
      const jenis = $(this).find('p.post-category').text().trim();
      const date = $(this).find('p.post-date').text().trim();
      const desc = $(this).find('div.entry.excerpt').text().trim();
      const link = $(this).find('h2.post-title > a').attr('href');

      result.push({
        creator: 'Qasim Ali 🦋',
        judul,
        kategori: jenis,
        upload_date: date,
        deskripsi: desc,
        link,
      });
    });

    // Fetch thumbnails
    const thumb = [];
    $('div > div.post-thumbnail > a > img').each(function () {
      thumb.push($(this).attr('data-src'));
    });

    // Attach thumbnails to each result
    result.forEach((item, index) => {
      item.thumb = thumb[index] || null;
    });

    return result;
  } catch (error) {
    console.error('Error in rexdl:', error);
    throw new Error('Failed to fetch rexdl data');
  }
};

// rexdldown function: get detailed info for a given download link
exports.rexdldown = async (link) => {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    const judul = $('#page > div > div > div > section > div:nth-child(2) > article > div > h1.post-title').text().trim();
    const plink = $('#page > div > div > div > section > div:nth-child(2) > center:nth-child(3) > h2 > span > a').attr('href');

    // Fetch download links
    const downloadLinks = [];
    const { data: downloadPageData } = await axios.get(plink);
    const $$ = cheerio.load(downloadPageData);

    $$('#dlbox > ul.dl > a > li > span').each(function () {
      downloadLinks.push({
        link_name: $$(this).text().trim(),
        url: $$($(this).parent()).attr('href'),
      });
    });

    // Extract other details
    const updateDate = $$('#dlbox > ul.dl-list > li.dl-update > span:nth-child(2)').text().trim();
    const version = $$('#dlbox > ul.dl-list > li.dl-version > span:nth-child(2)').text().trim();
    const size = $$('#dlbox > ul.dl-list > li.dl-size > span:nth-child(2)').text().trim();

    return {
      creator: 'Qasim Ali 🦋',
      judul,
      update_date: updateDate,
      version,
      size,
      download: downloadLinks,
    };
  } catch (error) {
    console.error('Error in rexdldown:', error);
    throw new Error('Failed to fetch rexdldown data');
  }
};

// merdekanews function to scrape Merdeka news website
exports.merdekanews = async () => {
  try {
    const { data } = await axios.get('https://www.merdeka.com/peristiwa/');
    const $ = cheerio.load(data);
    
    const result = [];
    $('#mdk-content-center > div.inner-content > ul > li > div').each(function () {
      const judul = $(this).find('h3 > a').text().trim();
      const link = 'https://www.merdeka.com' + $(this).find('h3 > a').attr('href');
      const upload = $(this).find('div > span').text().trim();
      const thumb = $(this).find('div > a > img').attr('src');
      
      result.push({
        creator: 'Qasim Ali 🦋',
        judul,
        upload_date: upload,
        link,
        thumb,
      });
    });

    return result;
  } catch (error) {
    console.error('Error fetching Merdeka news:', error);
    throw new Error('Failed to fetch Merdeka news data');
  }
};

// metronews function to scrape Metro TV news website
exports.metronews = async () => {
  try {
    const { data } = await axios.get('https://www.metrotvnews.com/news');
    const $ = cheerio.load(data);

    const result = [];
    $('body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > h3 > a').each(function () {
      const judul = $(this).attr('title');
      result.push({ judul });
    });
    
    const desc = [];
    $('body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > p').each(function () {
      const deta = $(this).text().trim();
      desc.push(deta);
    });

    const link = [];
    $('body > div.container.layout > section.content > div > div.item-list.pt-20 > div > div > h3 > a').each(function () {
      const linkUrl = 'https://www.metrotvnews.com' + $(this).attr('href');
      link.push(linkUrl);
    });

    const thumb = [];
    $('body > div.container.layout > section.content > div > div.item-list.pt-20 > div > img').each(function () {
      const thumbUrl = $(this).attr('src').replace('w=300', 'w=720');
      thumb.push(thumbUrl);
    });

    // Combine all extracted data
    for (let i = 0; i < judul.length; i++) {
      result[i] = {
        creator: 'Qasim Ali 🦋',
        judul: judul[i],
        deskripsi: desc[i] || '',
        link: link[i],
        thumb: thumb[i],
      };
    }

    return result;
  } catch (error) {
    console.error('Error fetching Metro News:', error);
    throw new Error('Failed to fetch Metro News data');
  }
};

// asupanfilm function to scrape Asupanfilm website based on query
exports.asupanfilm = async (query) => {
  try {
    const { data } = await axios.get(`https://asupanfilm.link/?search=${query}`);
    const $ = cheerio.load(data);

    const result = [];
    const judul = [];
    const desc = [];
    const thumb = [];
    const link = [];

    $('body > div > div > div.card-body.p-2 > ul > li > div > div > h6 > a').each(function () {
      const title = $(this).text().trim();
      judul.push(title);
    });

    $('body > div > div > div.card-body.p-2 > ul > li > div > div').each(function () {
      const details = $(this).text().trim();
      desc.push(details.split('   ')[2] || '');
    });

    $('body > div > div > div.card-body.p-2 > ul > li > div > img').each(function () {
      const imageUrl = $(this).attr('src').split('UX67_CR0,0,67,98_AL_')[0];
      thumb.push(imageUrl);
    });

    $('body > div > div > div.card-body.p-2 > ul > li > div > div > h6 > a').each(function () {
      const href = $(this).attr('href');
      link.push('https://asupanfilm.link/' + href);
    });

    // Combine all extracted data
    for (let i = 0; i < judul.length; i++) {
      result.push({
        creator: 'Qasim Ali 🦋',
        judul: judul[i],
        deskripsi: desc[i] || '',
        thumb: thumb[i],
        link: link[i],
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching Asupanfilm data:', error);
    throw new Error('Failed to fetch Asupanfilm data');
  }
};

// Asupanfilm info function to scrape movie details from Asupanfilm link
exports.asupanfilminfo = async (link) => {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    
    const info = {
      creator: 'Qasim Ali 🦋',  // Added creator
      judul: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(1)').text().trim(),
      thumb: $('body > div > div.card.mb-3 > div.card-footer > a').attr('href'),
      alurcerita_imdb: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(2)').text().split(' Alur Cerita IMDb: ')[1]?.trim(),
      alurcerita_tmdb: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(3)').text().split(' Alur Cerita TMDb: ')[1]?.trim(),
      direksi: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(4)').text().split(' Direksi: ')[1]?.trim(),
      pemeran: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(5)').text().split(' Pemeran: ')[1]?.trim(),
      kategori: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(6)').text().split(' Kategori: ')[1]?.trim(),
      negara: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(7)').text().split(' Negara: ')[1]?.trim(),
      tahun_rilis: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(8)').text().split(' Tahun Rilis: ')[1]?.trim(),
      durasi: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(9)').text().split(' Durasi: ')[1]?.trim(),
      skor: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(10)').text().split(' Skor: ')[1]?.trim(),
      kualitas: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(11)').text().split(' Kualitas: ')[1]?.trim(),
      jenis: $('body > div > div:nth-child(5) > div.card-body.p-2 > ul > li:nth-child(12)').text().split(' Jenis: ')[1]?.trim()
    };

    return info;
  } catch (error) {
    console.error('Error fetching Asupan Film info:', error);
    throw new Error('Failed to fetch movie info');
  }
};

// Sticker search function to search for stickers based on a query
exports.stickersearch = async (query) => {
  try {
    const { data } = await axios.get(`https://getstickerpack.com/stickers?query=${query}`);
    const $ = cheerio.load(data);
    
    const link = [];
    $('#stickerPacks > div > div:nth-child(3) > div > a').each(function () {
      link.push($(this).attr('href'));
    });

    const rand = link[Math.floor(Math.random() * link.length)];
    const { data: stickerData } = await axios.get(rand);
    const $$ = cheerio.load(stickerData);

    const url = [];
    $$('#stickerPack > div > div.row > div > img').each(function () {
      url.push($$(this).attr('src').split('&d=')[0]);
    });

    return {
      creator: 'Qasim Ali 🦋',
      title: $$('#intro > div > div > h1').text().trim(),
      author: $$('#intro > div > div > h5 > a').text().trim(),
      author_link: $$('#intro > div > div > h5 > a').attr('href'),
      sticker: url
    };
  } catch (error) {
    console.error('Error fetching sticker search data:', error);
    throw new Error('Failed to fetch sticker search data');
  }
};

// Random TikTok video function to fetch random TikTok-like videos based on a search query
exports.randomtt = async (query) => {
  try {
    const { data } = await axios.get('https://brainans.com/search?query=' + query);
    const $ = cheerio.load(data);
    
    const luser = $('#search-container > div:nth-child(1) > div.content__text > a').attr('href');
    const { data: userData } = await axios.get('https://brainans.com/' + luser);
    const $$ = cheerio.load(userData);

    const vlink = [];
    $$('#videos_container > div > div.content__list.grid.infinite_scroll.cards > div > div > a').each(function () {
      vlink.push('https://brainans.com/' + $$(this).attr('href'));
    });

    const selectedLink = vlink[Math.floor(Math.random() * vlink.length)];
    const { data: videoData } = await axios.get(selectedLink);
    const $$$ = cheerio.load(videoData);

    return {
      creator: 'Qasim Ali 🦋',
      username: $$$('#card-page > div > div.row > div > div > div > div > div.main__user-desc.align-self-center.ml-2 > a').text().trim(),
      caption: $$$('#card-page > div > div.row > div > div > div.main__info.mb-4 > div.main__list').text().trim(),
      like_count: $$$('#card-page > div > div.row > div > div > div.main__info.mb-4 > div > div:nth-child(1) > span').text().trim(),
      comment_count: $$$('#card-page > div > div.row > div > div > div.main__info.mb-4 > div.content__btns.d-flex > div:nth-child(2) > span').text().trim(),
      share_count: $$$('#card-page > div > div.row > div > div > div.main__info.mb-4 > div.content__btns.d-flex > div:nth-child(3) > span').text().trim(),
      videourl: $$$('#card-page > div > div.row > div > div > div.main__info.mb-4 > div.main__image-container > div > video').attr('src')
    };
  } catch (error) {
    console.error('Error fetching random TikTok video:', error);
    throw new Error('Failed to fetch random TikTok video');
  }
};

// Trend Twitter function to scrape Twitter trends for a given country
exports.trendtwit = async (country) => {
  try {
    const { data } = await axios.get(`https://getdaytrends.com/${country}/`);
    const $ = cheerio.load(data);
    const hastag = [];
    const tweet = [];
    const result = [];
    
    // Extract hashtags
    $('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > a').each((_, b) => {
      hastag.push($(b).text().trim());
    });

    // Extract tweet counts
    $('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > div > span').each((_, b) => {
      tweet.push($(b).text().trim());
    });

    // Combine hashtags and tweet counts
    let num = 1;
    for (let i = 0; i < hastag.length; i++) {
      result.push({
        rank: num,
        hastag: hastag[i],
        tweet: tweet[i]
      });
      num += 1;
    }

    return {
      creator: 'Qasim Ali 🦋',
      country,
      result
    };
  } catch (error) {
    console.error('Error fetching Twitter trends:', error);
    throw new Error('Failed to fetch Twitter trends');
  }
};

// Pinterest search function to fetch pins based on a query
exports.pinterest = async (query) => {
  try {
    const { data } = await axios.get(`https://id.pinterest.com/search/pins/?autologin=true&q=${query}`, {
      headers: {
        "cookie": "_auth=1; _b=AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
      }
    });

    const $ = cheerio.load(data);
    const result = [];
    
    $('div > a').each((_, b) => {
      const link = $(b).find('img').attr('src');
      if (link) result.push(link.replace(/236/g, '736'));
    });

    // Shift the first image (if needed)
    result.shift();

    return result;
  } catch (error) {
    console.error('Error fetching Pinterest data:', error);
    throw new Error('Failed to fetch Pinterest data');
  }
};

// Zerochan search function to fetch images based on a query
exports.zerochan = async (query) => {
  try {
    const { data } = await axios.get(`https://www.zerochan.net/search?q=${query}`);
    const $ = cheerio.load(data);
    const judul = [];
    const result = [];
    const id = [];
    
    // Extract image titles and IDs
    $('#thumbs2 > li > a > img').each((_, b) => {
      const altText = $(b).attr('alt');
      if (altText && !altText.startsWith('https://static.zerochan.net/')) {
        judul.push(altText);
      }
    });

    $('#thumbs2 > li > a').each((_, b) => {
      id.push($(b).attr('href'));
    });

    // Construct full image URLs
    for (let i = 0; i < judul.length; i++) {
      result.push(`https://s1.zerochan.net/${judul[i].replace(/\ /g, '.')}.600.${id[i].split('/')[1]}.jpg`);
    }

    return {
      creator: 'Qasim Ali 🦋',
      result
    };
  } catch (error) {
    console.error('Error fetching Zerochan data:', error);
    throw new Error('Failed to fetch Zerochan data');
  }
};

// HappyMod download function to fetch mod APK download links
exports.happymoddl = async (link) => {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    const linkArr = [];
    const jlink = [];
    const result = [];
    
    const title = $('body > div > div.container-left > section:nth-child(1) > div > h1').text().trim();
    const info = $('body > div > div.container-left > section:nth-child(1) > div > ul').text().trim();
    
    // Extract download links and their titles
    $('body > div.container-row.clearfix.container-wrap.pdt-font-container > div.container-left > section:nth-child(1) > div > div:nth-child(3) > div > p > a').each((_, b) => {
      const deta = $(b).text();
      jlink.push(deta);
      const href = $(b).attr('href');
      linkArr.push(href.startsWith('/') ? `https://happymod.com${href}` : href);
    });

    // Combine title and download link info
    for (let i = 0; i < linkArr.length; i++) {
      result.push({
        title: jlink[i],
        dl_link: linkArr[i]
      });
    }

    return {
      creator: 'Qasim Ali 🦋',
      title,
      info: info.replace(/\t|- /g, ''),
      download: result
    };
  } catch (error) {
    console.error('Error fetching HappyMod data:', error);
    throw new Error('Failed to fetch HappyMod data');
  }
};

// GoRedl function to scrape a video download link
exports.goredl = async (link) => {
  try {
    const { data } = await axios.get(link);
    const $$ = cheerio.load(data);
    
    const format = {
      judul: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1').text().trim(),
      views: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count').text().trim(),
      comment: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text().trim(),
      link: $$('video > source').attr('src')
    };

    return {
      creator: 'Qasim Ali 🦋',
      data: format
    };
  } catch (error) {
    console.error('Error fetching GoRedl data:', error);
    throw new Error('Failed to fetch GoRedl data');
  }
};

// Character function to fetch character details based on a query
exports.chara = async (query) => {
  try {
    const { data } = await axios.get(`https://www.anime-planet.com/characters/all?name=${query}&sort=likes&order=desc`);
    const $ = cheerio.load(data);
    
    const linkp = $('#siteContainer > table > tbody > tr:nth-child(1) > td.tableCharInfo > a').attr('href');
    const { data: characterData } = await axios.get('https://www.anime-planet.com' + linkp);
    const $$ = cheerio.load(characterData);
    
    return {
      creator: 'Qasim Ali 🦋',
      nama: $$('#siteContainer > h1').text().trim(),
      gender: $$('#siteContainer > section.pure-g.entryBar > div:nth-child(1)').text().split('\nGender: ')[1]?.trim(),
      warna_rambut: $$('#siteContainer > section.pure-g.entryBar > div:nth-child(2)').text().split('\nHair Color: ')[1]?.trim(),
      warna_mata: $$('#siteContainer > section:nth-child(11) > div > div > div > div > div:nth-child(1) > div').text().split('\n')[1]?.trim(),
      gol_darah: $$('#siteContainer > section:nth-child(11) > div > div > div > div > div:nth-child(2) > div').text().split('\n')[1]?.trim(),
      birthday: $$('#siteContainer > section:nth-child(11) > div > div > div > div > div:nth-child(3) > div').text().split('\n')[1]?.trim(),
      description: $$('#siteContainer > section:nth-child(11) > div > div > div > div:nth-child(1) > p').text().trim()
    };
  } catch (error) {
    console.error('Error fetching character data:', error);
    throw new Error('Failed to fetch character data');
  }
};

// Anime search function to fetch anime details based on a query
exports.anime = async (query) => {
  try {
    const { data } = await axios.get(`https://www.anime-planet.com/anime/all?name=${query}`);
    const $ = cheerio.load(data);
    
    const result = [];
    const judul = [];
    const link = [];
    const thumb = [];

    $('#siteContainer > ul.cardDeck.cardGrid > li > a > h3').each((_, b) => {
      judul.push($(b).text().trim());
    });

    $('#siteContainer > ul.cardDeck.cardGrid > li > a').each((_, b) => {
      link.push('https://www.anime-planet.com' + $(b).attr('href'));
    });

    $('#siteContainer > ul.cardDeck.cardGrid > li > a > div.crop > img').each((_, b) => {
      thumb.push('https://www.anime-planet.com' + $(b).attr('src'));
    });

    for (let i = 0; i < judul.length; i++) {
      result.push({
        judul: judul[i],
        thumb: thumb[i],
        link: link[i]
      });
    }

    return {
      creator: 'Qasim Ali 🦋',
      result
    };
  } catch (error) {
    console.error('Error fetching anime data:', error);
    throw new Error('Failed to fetch anime data');
  }
};

// Manga search function to fetch manga details based on a query
exports.manga = async (query) => {
  try {
    const { data } = await axios.get(`https://www.anime-planet.com/manga/all?name=${query}`);
    const $ = cheerio.load(data);
    
    const result = [];
    const judul = [];
    const link = [];
    const thumb = [];

    $('#siteContainer > ul.cardDeck.cardGrid > li > a > h3').each((_, b) => {
      judul.push($(b).text().trim());
    });

    $('#siteContainer > ul.cardDeck.cardGrid > li > a').each((_, b) => {
      link.push('https://www.anime-planet.com' + $(b).attr('href'));
    });

    $('#siteContainer > ul.cardDeck.cardGrid > li > a > div.crop > img').each((_, b) => {
      thumb.push('https://www.anime-planet.com' + $(b).attr('src'));
    });

    for (let i = 0; i < judul.length; i++) {
      result.push({
        judul: judul[i],
        thumb: thumb[i],
        link: link[i]
      });
    }

    return {
      creator: 'Qasim Ali 🦋',
      result
    };
  } catch (error) {
    console.error('Error fetching manga data:', error);
    throw new Error('Failed to fetch manga data');
  }
};

// Job search function to scrape job listings
exports.job = async (query) => {
  try {
    const { data } = await axios.get(`https://www.jobstreet.co.id/id/job-search/${query}-jobs/`);
    const $ = cheerio.load(data);

    const job = [];
    const perusahaan = [];
    const daerah = [];
    const upload = [];
    const link = [];
    const format = [];

    $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > div > h1 > a > div').each((_, b) => {
      job.push($(b).text().trim());
    });

    $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > span').each((_, b) => {
      perusahaan.push($(b).text().trim());
    });

    $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > span > span').each((_, b) => {
      daerah.push($(b).text().trim());
    });

    $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > div > h1 > a').each((_, b) => {
      link.push($(b).attr('href'));
    });

    $('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div.sx2jih0.zcydq852.zcydq842.zcydq872.zcydq862.zcydq82a.zcydq832.zcydq8d2.zcydq8cq > div.sx2jih0.zcydq832.zcydq8cq.zcydq8c6.zcydq882 > time > span').each((_, b) => {
      upload.push($(b).text().trim());
    });

    for (let i = 0; i < job.length; i++) {
      format.push({
        job: job[i],
        perusahaan: perusahaan[i],
        daerah: daerah[i],
        upload: upload[i],
        link_Detail: 'https://www.jobstreet.co.id' + link[i]
      });
    }

    return {
      creator: 'Qasim Ali 🦋',
      data: format
    };
  } catch (error) {
    console.error('Error fetching job data:', error);
    throw new Error('Failed to fetch job data');
  }
};

// Anoboys search function to scrape Anoboy media
exports.anoboys = async (query) => {
  try {
    const { data } = await axios.get('https://anoboy.media/?s=' + query);
    const $ = cheerio.load(data);

    const format = [];
    const judul = [];
    const thumb = [];
    const uptime = [];
    const link = [];

    $('body > div.wrap > div.container > div.column-content > a > div > div.amvj > h3').each((_, b) => {
      judul.push($(b).text().trim());
    });

    $('body > div.wrap > div.container > div.column-content > a > div > div.jamup').each((_, d) => {
      uptime.push($(d).text().trim());
    });

    $('body > div.wrap > div.container > div.column-content > a > div > amp-img').each((_, f) => {
      thumb.push($(f).attr('src'));
    });

    $('body > div.wrap > div.container > div.column-content > a').each((_, h) => {
      link.push($(h).attr('href'));
    });

    for (let i = 0; i < link.length; i++) {
      format.push({
        judul: judul[i],
        thumb: thumb[i],
        link: link[i]
      });
    }

    return {
      creator: 'Qasim Ali 🦋',
      data: format
    };
  } catch (error) {
    console.error('Error fetching Anoboys data:', error);
    throw new Error('Failed to fetch Anoboys data');
  }
};

// Anoboy download function to scrape download links

exports.anoboydl = async (query) => {
  try {
    const { data } = await axios.get(query);
    const $ = cheerio.load(data);

    // Helper function to extract SD and HD links
    const extractLinks = (selector) => {
      return {
        SD: $(selector + ' span:nth-child(1) > a:nth-child(3)').attr('href') || null,
        HD: $(selector + ' span:nth-child(1) > a:nth-child(5)').attr('href') || null
      };
    };

    // Extract data from the page
    const judul = $('body > div.wrap > div.container > div.pagetitle > h1').text().trim();
    const uptime = $('body > div.wrap > div.container > div.pagetitle > div > div > span > time').text().trim();
    const directLink = $('#tontonin > source').attr('src') || null;

    const mforuLinks = extractLinks('#colomb > p:nth-child(1)');
    const zippyLinks = extractLinks('#colomb > p:nth-child(3)');
    const mirrorLinks = extractLinks('#colomb > p:nth-child(5)');

    // Return structured result
    return {
      creator: 'Qasim Ali 🦋',
      judul,
      uptime,
      direct_link: directLink,
      mforu: mforuLinks,
      zippy: zippyLinks,
      mirror: mirrorLinks
    };
  } catch (error) {
    console.error(`Error fetching Anoboy download data for query: ${query}`, error);
    throw new Error('Failed to fetch Anoboy download data');
  }
};

exports.film = async (query) => {
    try {
        const { data } = await axios.get(`http://167.99.71.200/?s=${query}`);
        const $ = cheerio.load(data);

        const judul = [];
        const genre = [];
        const thumb = [];
        const link = [];
        const format = [];

        // Extracting data
        $('div > div.item-article > header > h2 > a').each((a, b) => {
            const title = $(b).text().trim();
            if (title) judul.push(title);
        });

        $('div > div.item-article > header > div.gmr-movie-on').each((a, b) => {
            const gen = $(b).text().trim();
            if (gen) genre.push(gen);
        });

        $('div > div.content-thumbnail.text-center > a > img').each((a, b) => {
            const thumbnail = $(b).attr('src');
            if (thumbnail) thumb.push(thumbnail);
        });

        $('div > div.item-article > header > div.gmr-watch-movie > a').each((a, b) => {
            const movieLink = $(b).attr('href');
            if (movieLink) link.push(movieLink);
        });

        // Construct the final result with creator
        for (let i = 0; i < judul.length; i++) {
            format.push({
                judul: judul[i],
                genre: genre[i],
                thumb: thumb[i],
                link_nonton: link[i],
                creator: 'Qasim Ali 🦋',
            });
        }

        // Return result
        if (format.length === 0) {
            return { status: 'error', message: `${query} not found.` };
        }
        return format;
    } catch (error) {
        // Handle and log error
        console.error(error);
        return { status: 'error', message: 'An error occurred while fetching data.' };
    }
};


exports.webtoons = async (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.webtoons.com/id/search?keyword=${query}`)
            .then((data) => {
                const $ = cheerio.load(data.data);
                const judul = [];
                const genre = [];
                const author = [];
                const link = [];
                const likes = [];
                const format = [];

                // Extracting data
                $('#content > div > ul > li > a > div > p.subj').each((a, b) => judul.push($(b).text()));
                $('div > ul > li > a > span').each((a, b) => genre.push($(b).text()));
                $('div > ul > li > a > div > p.author').each((a, b) => author.push($(b).text()));
                $('div > ul > li > a > div > p.grade_area > em').each((a, b) => likes.push($(b).text()));
                $('#content > div > ul > li > a').each((a, b) => link.push($(b).attr('href')));

                // Construct the final result with creator
                for (let i = 0; i < judul.length; i++) {
                    format.push({
                        judul: judul[i],
                        genre: genre[i],
                        author: author[i],
                        likes: likes[i],
                        link: 'https://www.webtoons.com' + link[i],
                        creator: 'Qasim Ali 🦋',
                    });
                }

                // Check if no results were found
                if (format.length === 0) {
                    resolve({ status: 'error', message: `${query} not found.` });
                } else {
                    resolve(format);
                }
            })
            .catch(reject);
    });
};

exports.soundcloud = async (link) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: "https://www.klickaud.co/download.php",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            formData: {
                'value': link,
                '2311a6d881b099dc3820600739d52e64a1e6dcfe55097b5c7c649088c4e50c37': '710c08f2ba36bd969d1cbc68f59797421fcf90ca7cd398f78d67dfd8c3e554e3'
            }
        };

        request(options, (error, response, body) => {
            if (error) return reject(error);

            const $ = cheerio.load(body);
            resolve({
            	creator: 'Qasim Ali 🦋',
                judul: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(2)').text(),
                download_count: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(3)').text(),
                thumb: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1) > img').attr('src'),
                link: $('#dlMP3').attr('onclick').split(`downloadFile('`)[1].split(`',`)[0],
               
            });
        });
    });
};

exports.facebook = async (url) => {
    return new Promise((resolve, reject) => {
        axios.get('https://downvideo.net/')
            .then(gdata => {
                const a = cheerio.load(gdata.data);
                const token = a('body > div > center > div.col-md-10 > form > div > input[type=hidden]:nth-child(2)').attr('value');
                
                const options = {
                    method: "POST",
                    url: `https://downvideo.net/download.php`,
                    headers: {
                        "content-type": 'application/x-www-form-urlencoded',
                        "cookie": gdata["headers"]["set-cookie"],
                        "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
                    },
                    formData: {
                        URL: url,
                        token: token
                    }
                };

                request(options, (error, response, body) => {
                    if (error) return reject(error);

                    const $ = cheerio.load(body);
                    const result = {
                    	creator: 'Qasim Ali 🦋',
                        status: 200,
                        title: $('body').find('div:nth-child(1) > h4').text(),
                        sd: $('#sd > a').attr('href'),
                        hd: $('body').find('div:nth-child(7) > a').attr('href'),
                        
                    };

                    resolve(result);
                });
            })
            .catch(reject);
    });
};

// TikTok Video Downloader
exports.tiktok = async (url) => {
    try {
        const tokenn = await axios.get(`https://downvideo.quora-wiki.com/tiktok-video-downloader#url=${url}`);
        let a = cheerio.load(tokenn.data);
        let token = a("#token").attr("value");

        const param = {
            url: url,
            token: token,
        };

        const { data } = await axios.post("https://downvideo.quora-wiki.com/system/action.php", new URLSearchParams(Object.entries(param)), {
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                "referer": "https://downvideo.quora-wiki.com/tiktok-video-downloader",
            },
        });

        return {
            creator: 'Qasim Ali 🦋',
            status: 200,
            title: data.title,
            thumbnail: `https:${data.thumbnail}`,
            duration: data.duration,
            media: data.medias,
        };
    } catch (e) {
        console.error('Error in TikTok downloader:', e);
        throw new Error('Failed to fetch TikTok video data');
    }
};

// Instagram Video Downloader
exports.instagram = async (url) => {
    try {
        const response = await axios.get('https://www.instagramsave.com/download-instagram-videos.php', {
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg"
            }
        });

        const $ = cheerio.load(response.data);
        const token = $('#token').attr('value');

        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                "cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            data: {
                'url': url,
                'action': 'post',
                'token': token,
            }
        };

        const postResponse = await axios.post('https://www.instagramsave.com/system/action.php', qs.stringify(config.data), { headers: config.headers });

        return {
            creator: 'Qasim Ali 🦋',
            status: 200,
            data: postResponse.data,
        };
    } catch (error) {
        console.error('Error in Instagram downloader:', error);
        throw new Error('Failed to fetch Instagram video data');
    }
};

// Screenshot Web Capture
exports.ssweb = async (url, device = 'desktop') => {
    try {
        const base = 'https://www.screenshotmachine.com';
        const param = {
            url: url,
            device: device,
            cacheLimit: 0
        };

        const captureResponse = await axios.post(`${base}/capture.php`, new URLSearchParams(Object.entries(param)), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });

        const cookies = captureResponse.headers['set-cookie'];
        if (captureResponse.data.status === 'success') {
            const imageResponse = await axios.get(`${base}/${captureResponse.data.link}`, {
                headers: {
                    'cookie': cookies.join('')
                },
                responseType: 'arraybuffer'
            });

            return {
                creator: 'Qasim Ali 🦋',
                status: 200,
                result: imageResponse.data,
            };
        } else {
            throw new Error('Link Error');
        }
    } catch (error) {
        console.error('Error in Screenshot capture:', error);
        throw new Error('Failed to capture screenshot');
    }
};

// Pinterest Video Downloader
exports.pinterestdl = async (url) => {
    try {
        const options = {
            method: 'POST',
            url: 'https://www.expertsphp.com/facebook-video-downloader.php',
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                "cookie": "__gads=ID=a826d8f71f32cdce-228526c6c4d30038:T=1656127044:RT=1656127044:S=ALNI_Mbc0q65XMPrQjf8pqxKtg_DfBEnNw; __gpi=UID=0000068f7e0217a6:T=1656127044:RT=1656334216:S=ALNI_MYDy-jLWlGuI8I9ZeSAgcTfDaJohQ; _gid=GA1.2.1776710921.1656334217; _gat_gtag_UA_120752274_1=1; _ga_D1XX1R246W=GS1.1.1656354473.4.1.1656354584.0; _ga=GA1.2.136312705.1656127045"
            },
            formData: { url: url }
        };

        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    return reject(new Error('Error fetching Pinterest data: ' + error));
                }

                const $ = cheerio.load(body);
                const results = [];

                $('#showdata > div:nth-child(4) > table > tbody > tr').each((index, element) => {
                    const result = {
                        creator: 'Qasim Ali 🦋',
                        status: 200,
                        quality: $(element).find('> td:nth-child(2) > strong').text(),
                        format: $(element).find('> td:nth-child(3) > strong').text(),
                        url: $(element).find('> td:nth-child(1) > a').attr('href')
                    };
                    results.push(result);
                });

                resolve(results);
            });
        });
    } catch (error) {
        console.error('Error in Pinterest downloader:', error);
        throw new Error('Failed to fetch Pinterest video data');
    }
};


// Earthquake Information (Gempa)
exports.gempa = async () => {
    try {
        const { data } = await axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg');
        const $ = cheerio.load(data);

        const drasa = [];
        $('table > tbody > tr:nth-child(1) > td:nth-child(6) > span').each((index, element) => {
            drasa.push($(element).text().replace('\t', ' '));
        });

        const rasa = drasa.join('\n');
        const format = {
            creator: 'Qasim Ali 🦋',
            imagemap: $('div.modal-body > div > div:nth-child(1) > img').attr('src'),
            magnitude: $('table > tbody > tr:nth-child(1) > td:nth-child(4)').text(),
            kedalaman: $('table > tbody > tr:nth-child(1) > td:nth-child(5)').text(),
            wilayah: $('table > tbody > tr:nth-child(1) > td:nth-child(6) > a').text(),
            waktu: $('table > tbody > tr:nth-child(1) > td:nth-child(2)').text(),
            lintang_bujur: $('table > tbody > tr:nth-child(1) > td:nth-child(3)').text(),
            dirasakan: rasa
        };

        return {
            creator: 'Qasim Ali 🦋',
            data: format
        };
    } catch (error) {
        console.error('Error in Gempa data fetch:', error);
        throw new Error('Failed to fetch Gempa (Earthquake) data');
    }
};

exports.cariresep = async (query) => {
	return new Promise(async (resolve, reject) => {
		axios.get('https://resepkoki.id/?s=' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const link = [];
				const judul = [];
				const upload_date = [];
				const format = [];
				const thumb = [];
				$('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				$('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function(c, d) {
					jud = $(d).text();
					judul.push(jud)
				})
				for (let i = 0; i < link.length; i++) {
					format.push({
						judul: judul[i],
						link: link[i]
					})
				}
				const result = {
					creator: 'Qasim Ali 🦋',
					data: format
				}
				resolve(result)
			})
			.catch(reject)
	})
};

exports.bacaresep = async (query) => {
	return new Promise(async (resolve, reject) => {
		axios.get(query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const abahan = [];
				const atakaran = [];
				const atahap = [];
				$('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name').each(function(a, b) {
					bh = $(b).text();
					abahan.push(bh)
				})
				$('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount').each(function(c, d) {
					uk = $(d).text();
					atakaran.push(uk)
				})
				$('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p').each(function(e, f) {
					th = $(f).text();
					atahap.push(th)
				})
				const judul = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1').text();
				const waktu = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span').text();
				const hasil = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span').text().split(': ')[1]
				const level = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span').text().split(': ')[1]
				const thumb = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img').attr('src')
				tbahan = 'bahan\n'
				for (let i = 0; i < abahan.length; i++) {
					tbahan += abahan[i] + ' ' + atakaran[i] + '\n'
				}
				ttahap = 'tahap\n'
				for (let i = 0; i < atahap.length; i++) {
					ttahap += atahap[i] + '\n\n'
				}
				const tahap = ttahap
				const bahan = tbahan
				const result = {
					creator: 'Qasim Ali 🦋',
					    judul_nya: judul,
						waktu_nya: waktu,
						hasil_nya: hasil,
						tingkat_kesulitan: level,
						thumb_nya: thumb,
						bahan_nya: bahan.split('bahan\n')[1],
						langkah_langkah: tahap.split('tahap\n')[1]
				}
				resolve(result)
			})
			.catch(reject)
	})
};

exports.searchgore = async (query) => {
	return new Promise(async (resolve, reject) => {
		axios.get('https://seegore.com/?s=' + query).then(dataa => {
			const $$$ = cheerio.load(dataa)
			pagina = $$$('#main > div.container.main-container > div > div.bb-col.col-content > div > div > div > div > nav > ul > li:nth-child(4) > a').text();
			rand = Math.floor(Math.random() * pagina) + 1
			if (rand === 1) {
				slink = 'https://seegore.com/?s=' + query
			} else {
				slink = `https://seegore.com/page/${rand}/?s=${query}`
			}
			axios.get(slink)
				.then(({
					data
				}) => {
					const $ = cheerio.load(data)
					const link = [];
					const judul = [];
					const uploader = [];
					const format = [];
					const thumb = [];
					$('#post-items > li > article > div.content > header > h2 > a').each(function(a, b) {
						link.push($(b).attr('href'))
					})
					$('#post-items > li > article > div.content > header > h2 > a').each(function(c, d) {
						jud = $(d).text();
						judul.push(jud)
					})
					$('#post-items > li > article > div.content > header > div > div.bb-cat-links > a').each(function(e, f) {
						upl = $(f).text();
						uploader.push(upl)
					})
					$('#post-items > li > article > div.post-thumbnail > a > div > img').each(function(g, h) {
						thumb.push($(h).attr('src'))
					})
					for (let i = 0; i < link.length; i++) {
						format.push({
							judul: judul[i],
							uploader: uploader[i],
							thumb: thumb[i],
							link: link[i]
						})
					}
					const result = {
						creator: 'Qasim Ali 🦋',
						data: format
					}
					resolve(result)
				})
				.catch(reject)
		})
	})
}
exports.randomgore = async () => {
	return new Promise(async (resolve, reject) => {
		rand = Math.floor(Math.random() * 218) + 1
		randvid = Math.floor(Math.random() * 16) + 1
		if (rand === 1) {
			slink = 'https://seegore.com/gore/'
		} else {
			slink = `https://seegore.com/gore/page/${rand}/`
		}
		axios.get(slink)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const link = [];
				const result = [];
				const username = [];
				const linkp = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a`).attr('href')
				const thumbb = $(`#post-items > li:nth-child(${randvid}) > article > div.post-thumbnail > a > div > img`).attr('src')
				axios.get(linkp)
					.then(({
						data
					}) => {
						const $$ = cheerio.load(data)
						const format = {
							judul: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > header > h1').text(),
							views: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > span > span.count').text(),
							comment: $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text() == '' ? 'Tidak ada komentar' : $$('div.single-main-container > div > div.bb-col.col-content > div > div > div > div > div.s-post-meta-block.bb-mb-el > div > div > div.col-r.d-table-cell.col-md-6.col-sm-6.text-right-sm > div > a > span.count').text(),
							thumb: thumbb,
							link: $$('video > source').attr('src')
						}
						const result = {
							creator: 'Qasim Ali 🦋',
							data: format
						}
						resolve(result)
					})
					.catch(reject)
			})
	})
};

// Function for generating text video
exports.textmakervid = async (text1, style) => {
    let tstyle;
    switch (style) {
        case 'poly': tstyle = 0; break;
        case 'bold': tstyle = 1; break;
        case 'glowing': tstyle = 2; break;
        case 'colorful': tstyle = 3; break;
        case 'army': tstyle = 4; break;
        case 'retro': tstyle = 5; break;
        default: tstyle = 0; // default style if none matches
    }

    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: "https://photooxy.com/other-design/make-a-video-that-spells-your-name-237.html",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            formData: {
                optionNumber_0: tstyle,
                text_1: text1,
                login: 'OK'
            }
        };

        request(options, async (error, response, body) => {
            if (error) return reject(error);

            const $ = cheerio.load(body);
            const result = {
                creator: 'Qasim Ali 🦋',  // Added creator here
                url: $('div.btn-group > a').attr('href')
            };
            resolve(result);
        });
    });
};

// Function for searching APKs on APKMirror
exports.apkmirror = async (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=${query}`)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const format = [];

                // Collecting app data
                $('#content > div > div > div.appRow > div > div > div > h5 > a').each(function (a, b) {
                    const nama = $(b).text();
                    const dev = $('#content > div > div > div.appRow > div > div > div > a').eq(a).text();
                    const link = 'https://www.apkmirror.com' + $('#content > div > div > div.appRow > div > div > div > div.downloadIconPositioning > a').eq(a).attr('href');
                    const size = $('#content > div > div > div.infoSlide > p > span.infoslide-value').eq(a).text().match('MB') ? $('#content > div > div > div.infoSlide > p > span.infoslide-value').eq(a).text() : '';
                    const lupdate = $('#content > div > div > div.infoSlide > p > span.infoslide-value').eq(a).text().match('UTC') ? $('#content > div > div > div.infoSlide > p > span.infoslide-value').eq(a).text() : '';
                    const down = $('#content > div > div > div.infoSlide > p > span.infoslide-value').eq(a).text().match(/(\d+)/) ? $('#content > div > div > div.infoSlide > p > span.infoslide-value').eq(a).text() : '';
                    const version = $('#content > div > div > div.infoSlide > p > span.infoslide-value').eq(a).text().match(/(\d+\.\d+)/) ? $('#content > div > div > div.infoSlide > p > span.infoslide-value').eq(a).text() : '';

                    format.push({
                        creator: 'Hanya Orang Biasa',  // Added creator here
                        judul: nama,
                        dev: dev,
                        size: size,
                        version: version,
                        uploaded_on: lupdate,
                        download_count: down,
                        link: link
                    });
                });

                const result = { creator: 'Qasim Ali 🦋', data: format };
                resolve(result);
            })
            .catch(reject);
    });
};

// Function to fetch details for SFile download
exports.sfiledown = async (link) => {
    try {
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);
        
        const nama = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(2) > b').text();
        const size = $('#download').text().split('Download File');
        const desc = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(7) > center > h1').text();
        const type = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(4) > a:nth-child(3)').text();
        const upload = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(5)').text();
        const uploader = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(4) > a:nth-child(2)').text();
        const download = $('body > div.w3-row-padding.w3-container.w3-white > div > div:nth-child(6)').text();
        const downloadLink = $('#download').attr('href');
        
        const other = downloadLink.split('/')[7].split('&is')[0];
        const format = {
            judul: nama + other.substr(other.length - 6).split('.')[1],
            size: size[1].split('(')[1].split(')')[0],
            type: type,
            mime: other.substr(other.length - 6).split('.')[1],
            desc: desc,
            uploader: uploader,
            uploaded: upload.split('\n - Uploaded: ')[1],
            download_count: download.split(' - Downloads: ')[1],
            link: downloadLink
        };

        const result = {
            creator: 'Qasim Ali 🦋',
            data: format
        };
        return result;
    } catch (error) {
        throw new Error(`Error fetching SFile data: ${error.message}`);
    }
};

// Function to fetch details for Zippy download
exports.zippydl = async (link) => {
    try {
        const { data } = await axios.get(link);
        const $ = cheerio.load(data);

        const nama = $('#lrbox > div:nth-child(2) > div:nth-child(1) > font:nth-child(4)').text();
        const size = $('#lrbox > div:nth-child(2) > div:nth-child(1) > font:nth-child(7)').text();
        const upload = $('#lrbox > div:nth-child(2) > div:nth-child(1) > font:nth-child(10)').text();

        // Function to fetch download link from Zippy
        const getLink = async (u) => {
            console.log(`⏳ Fetching page from: ${u}`);
            const zippyData = await axios.get(u).then(res => res.data).catch(err => null);
            if (!zippyData) {
                throw new Error('Failed to fetch data from Zippyshare');
            }
            const $$ = cheerio.load(zippyData);

            if (!$$('#dlbutton').length) {
                return {
                    error: true,
                    message: $$('#lrbox > div').first().text().trim()
                };
            }

            console.log('⏳ Fetching download link...');
            const url = _url.parse($$('.flagen').attr('href'), true);
            const urlori = _url.parse(u);
            const key = url.query['key'];
            let time;
            let dlurl;

            try {
                time = /var b = ([0-9]+);$/gm.exec($$('#dlbutton').next().html())[1];
                dlurl = `${urlori.protocol}//${urlori.hostname}/d/${key}/${2 + 2 * 2 + parseInt(time)}3/DOWNLOAD`;
            } catch (error) {
                time = _math.evaluate(/ \+ \((.*)\) \+ /gm.exec($$('#dlbutton').next().html())[1]);
                dlurl = `${urlori.protocol}//${urlori.hostname}/d/${key}/${time}/DOWNLOAD`;
            }

            console.log('Done fetching download link');
            return dlurl;
        };

        // Get the download link
        const downloadLink = await getLink(link);
        
        const result = {
            creator: 'Qasim Ali 🦋',
            data: {
                Judul: nama,
                size: size,
                uploaded: upload,
                link: downloadLink
            }
        };

        return result;
    } catch (error) {
        throw new Error(`Error fetching Zippy download data: ${error.message}`);
    }
};

// Function for fetching data from AN1
exports.android1 = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://an1.com/tags/MOD/?story=${query}&do=search&subaction=search`)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const format = [];
                const nama = [];
                const link = [];
                const rating = [];
                const thumb = [];
                const developer = [];

                // Extract app names
                $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.name > a > span').each((a, b) => {
                    nama.push($(b).text());
                });

                // Extract ratings
                $('div > ul > li.current-rating').each((c, d) => {
                    rating.push($(d).text());
                });

                // Extract developer info
                $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.developer.xsmf.muted').each((e, f) => {
                    developer.push($(f).text());
                });

                // Extract thumbnails
                $('body > div.page > div > div > div.app_list > div > div > div.img > img').each((g, h) => {
                    thumb.push($(h).attr('src'));
                });

                // Extract app links
                $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.name > a').each((i, j) => {
                    link.push($(j).attr('href'));
                });

                // Combine all data into a format
                for (let i = 0; i < link.length; i++) {
                    format.push({
                        judul: nama[i],
                        dev: developer[i],
                        rating: rating[i],
                        thumb: thumb[i],
                        link: link[i]
                    });
                }

                const result = {
                    creator: 'Qasim Ali 🦋',
                    data: format
                };
                resolve(result);
            })
            .catch(reject);
    });
};

// Function for fetching data from APKMody
exports.apkmody = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://apkmody.io/?s=${query}`)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const format = [];
                const nama = [];
                const link = [];
                const mod = [];
                const thumb = [];

                // Extract app names
                $('#primary > section:nth-child(3) > div > div > div > article > a > div > div > div > h2').each((a, b) => {
                    nama.push($(b).text());
                });

                // Extract mod information
                $('#primary > section:nth-child(3) > div > div > div > article > a > div > div > p').each((c, d) => {
                    mod.push($(d).text().split('\n')[1]);
                });

                // Extract thumbnails
                $('#primary > section:nth-child(3) > div > div > div > article > a > div > img').each((e, f) => {
                    thumb.push($(f).attr('src'));
                });

                // Extract links
                $('#primary > section:nth-child(3) > div > div > div > article > a').each((g, h) => {
                    link.push($(h).attr('href'));
                });

                // Combine all data into a format
                for (let i = 0; i < link.length; i++) {
                    format.push({
                        judul: nama[i],
                        infomod: mod[i],
                        thumb: thumb[i],
                        link: link[i]
                    });
                }

                const result = {
                    creator: 'Qasim Ali 🦋',
                    data: format
                };
                resolve(result);
            })
            .catch(reject);
    });
};

// Function for fetching data from HappyMod
exports.happymod = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.happymod.com/search.html?q=${query}`)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const format = [];
                const nama = [];
                const link = [];
                const rating = [];
                const thumb = [];

                // Extract app names and links
                $('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > h3 > a').each((a, b) => {
                    nama.push($(b).text());
                    link.push(`https://happymod.com${$(b).attr('href')}`);
                });

                // Extract ratings
                $('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > div.clearfix > span').each((c, d) => {
                    rating.push($(d).text());
                });

                // Extract thumbnails
                $('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > a > img').each((e, f) => {
                    thumb.push($(f).attr('data-original'));
                });

                // Combine all data into a format
                for (let i = 0; i < link.length; i++) {
                    format.push({
                        title: nama[i],
                        thumb: thumb[i],
                        rating: rating[i],
                        link: link[i]
                    });
                }

                const result = {
                    creator: 'Qasim Ali 🦋',
                    data: format
                };
                resolve(result);
            })
            .catch(reject);
    });
};

exports.nickff = (userId) => {
    if (!userId) return new Error("no userId");

    return new Promise((resolve, reject) => {
        let body = {
            "voucherPricePoint.id": 8050,
            "voucherPricePoint.price": "",
            "voucherPricePoint.variablePrice": "",
            "n": "",
            "email": "",
            "userVariablePrice": "",
            "order.data.profile": "",
            "user.userId": userId,
            "voucherTypeName": "FREEFIRE",
            "affiliateTrackingId": "",
            "impactClickId": "",
            "checkoutId": "",
            "tmwAccessToken": "",
            "shopLang": "in_ID"
        };

        axios({
            "url": "https://order.codashop.com/id/initPayment.action",
            "method": "POST",
            "data": body,
            "headers": {
                "Content-Type": "application/json; charset/utf-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
            }
        }).then(({ data }) => {
            resolve({
                "username": data.confirmationFields.roles[0].role,
                "userId": userId,
                "country": data.confirmationFields.country,
                "creator": "Qasim Ali 🦋"
            });
        }).catch(reject);
    });
};

exports.nickml = (id, zoneId) => {
    return new Promise(async (resolve, reject) => {
        axios.post(
            'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
            new URLSearchParams(
                Object.entries({
                    productId: '1',
                    itemId: '2',
                    catalogId: '57',
                    paymentId: '352',
                    gameId: id,
                    zoneId: zoneId,
                    product_ref: 'REG',
                    product_ref_denom: 'AE',
                })
            ),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Referer: 'https://www.duniagames.co.id/',
                    Accept: 'application/json',
                }
            }
        )
        .then((response) => {
            resolve({
                data: response.data.data.gameDetail,
                creator: "Qasim Ali 🦋"
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
};

exports.corona = async (country) => {
    if (!country) return "No country input";

    try {
        const res = await axios.request(`https://www.worldometers.info/coronavirus/country/` + country, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
            }
        });

        let result = {};
        const $ = cheerio.load(res.data);

        result.status = res.status;
        result.negara = $("div").find("h1").text().slice(3).split(/ /g)[0];
        result.total_kasus = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(0).text() + " total";
        result.total_kematian = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(1).text() + " total";
        result.total_sembuh = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(2).text() + " total";
        result.informasi = $("div.content-inner > div").eq(1).text();
        result.informasi_lengkap = "https://www.worldometers.info/coronavirus/country/" + country;

        if (result.negara == '') {
            result.status = 'error';
        }

        result.creator = "Qasim Ali 🦋";
        return result;

    } catch (error404) {
        return "=> Error => " + error404;
    }
};

// Mangatoon search function
exports.mangatoon = async (search) => {
    if (!search) return "No Query Input! Bakaa >\/\/<";
    
    try {
        const res = await axios.get(`https://mangatoon.mobi/en/search?word=${search}`, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
            }
        });

        const hasil = [];
        const $ = cheerio.load(res.data);

        $('div.recommend-item').each(function (a, b) {
            let comic_name = $(b).find('div.recommend-comics-title > span').text();
            let comic_type = $(b).find('div.comics-type > span').text().slice(1).split(/ /g).join("");
            let comic_url = $(b).find('a').attr('href');
            let comic_thumb = $(b).find('img').attr('src');
            
            const result = {
                status: res.status,
                creator: "Qasim Ali 🦋",
                comic_name,
                comic_type,
                comic_url: 'https://mangatoon.mobi' + comic_url,
                comic_thumb
            };
            hasil.push(result);
        });

        // Filtering undefined comic_name and comic_type
        const filt = hasil.filter(v => v.comic_name !== undefined && v.comic_type !== undefined);
        return filt;
    } catch (eror404) {
        return "=> Error =>" + eror404;
    }
}

// Palingmurah product search function
exports.palingmurah = async (produk) => {
    if (!produk) {
        return new TypeError("No Query Input! Bakaaa >\/\/<")
    }

    try {
        const res = await axios.get(`https://palingmurah.net/pencarian-produk/?term=` + produk);
        const hasil = [];
        const $ = cheerio.load(res.data);

        $('div.ui.card.wpj-card-style-2').each(function (a, b) {
            let url = $(b).find('a.image').attr('href');
            let img = $(b).find('img.my_image.lazyload').attr('data-src');
            let title = $(b).find('a.list-header').text().trim();
            let product_desc = $(b).find('div.description.visible-on-list').text().trim();
            let price = $(b).find('div.flex-master.card-job-price.text-right.text-vertical-center').text().trim();
            
            const result = {
                status: res.status,
                creator: "Qasim Ali 🦋",
                product: title,
                product_desc: product_desc,
                product_image: img,
                product_url: url,
                price
            };
            hasil.push(result);
        });

        return hasil;
    } catch (error404) {
        return new Error("=> Error =>" + error404);
    }
}

// Mediafire file details function
exports.mediafire = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(query)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const judul = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').text();
                const size = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(1) > span').text();
                const upload_date = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text();
                const link = $('#downloadButton').attr('href');
                
                const hsil = {
                    judul: link.split('/')[5],
                    upload_date: upload_date,
                    size: size,
                    mime: link.split('/')[5].split('.')[1],
                    link: link,
                    creator: "Qasim Ali 🦋"
                };
                resolve(hsil);
            })
            .catch(reject);
    });
}

// Artinama name meaning function
exports.artinama = (query) => {
    return new Promise((resolve, reject) => {
        const queryy = query.replace(/ /g, '+');
        
        axios.get('https://www.primbon.com/arti_nama.php?nama1=' + query + '&proses=+Submit%21+')
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = $('#body').text();
                const result2 = result.split('\n      \n        \n        \n')[0];
                const result4 = result2.split('ARTI NAMA')[1];
                const result5 = result4.split('.\n\n');
                const result6 = result5[0] + '\n\n' + result5[1];
                
                resolve(result6);
            })
            .catch(reject);
    });
}

// Drakor search function
exports.drakor = (query) => {
    return new Promise((resolve, reject) => {
        const queryy = query.replace(/ /g, '+');
        
        axios.get('https://drakorasia.net/?s=' + queryy + '&post_type=post')
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                const link = [];
                const judul = [];
                const thumb = [];
                
                $('#post > div > div.thumbnail > a').each(function (a, b) {
                    link.push($(b).attr('href'));
                    thumb.push($(b).find('img').attr('src'));
                });

                $('#post > div > div.title.text-center.absolute.bottom-0.w-full.py-2.pb-4.px-3 > a > h2').each(function (c, d) {
                    const titel = $(d).text();
                    judul.push(titel);
                });

                for (let i = 0; i < link.length; i++) {
                    result.push({
                        judul: judul[i],
                        thumb: thumb[i],
                        link: link[i],
                        creator: "Qasim Ali 🦋"
                    });
                }

                resolve(result);
            })
            .catch(reject);
    });
}

// Wattpad search function
exports.wattpad = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.wattpad.com/search/' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                const linkk = [];
                const judull = [];
                const thumb = [];
                const dibaca = [];
                const vote = [];
                const bab = [];

                $('ul.list-group > li.list-group-item').each((a, b) => {
                    linkk.push('https://www.wattpad.com' + $(b).find('a').attr('href'));
                    thumb.push($(b).find('img').attr('src'));
                });

                $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(1) > div.icon-container > div > span.stats-value').each((e, f) => {
                    dibaca.push($(f).text());
                });

                $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(2) > div.icon-container > div > span.stats-value').each((g, h) => {
                    vote.push($(h).text());
                });

                $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(3) > div.icon-container > div > span.stats-value').each((i, j) => {
                    bab.push($(j).text());
                });

                $('div.story-card-data.hidden-xxs > div.story-info > div.title').each((c, d) => {
                    judull.push($(d).text());
                });

                for (let i = 0; i < linkk.length; i++) {
                    if (judull[i]) {
                        result.push({
                            creator: "Qasim Ali 🦋",
                            judul: judull[i],
                            dibaca: dibaca[i],
                            divote: vote[i],
                            thumb: thumb[i],
                            link: linkk[i]
                        });
                    }
                }
                resolve(result);
            })
            .catch(reject);
    });
};

// Dewabatch search function
exports.dewabatch = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://dewabatch.com/?s=' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                const linkk = [];
                const judull = [];
                const thumb = [];
                const rating = [];

                $('div.thumb > a').each((a, b) => {
                    linkk.push($(b).attr('href'));
                    judull.push($(b).attr('title'));
                    thumb.push($(b).find('img').attr('src').split('?resize')[0]);
                });

                $('#content > div.postbody > div > div > ul > li > div.dtl > div.footer-content-post.fotdesktoppost > div.contentleft > span:nth-child(1) > rating > ratingval > ratingvalue').each((c, d) => {
                    rating.push($(d).text().split(' ')[0]);
                });

                for (let i = 0; i < linkk.length; i++) {
                    result.push({
                        creator: "Qasim Ali 🦋",
                        judul: judull[i],
                        rating: rating[i],
                        thumb: thumb[i],
                        link: linkk[i]
                    });
                }
                resolve(result);
            })
            .catch(reject);
    });
};

// Kiryu search function
exports.kiryu = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://kiryuu.id/?s=' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                const linkk = [];
                const judull = [];
                const thumb = [];
                const rating = [];

                $('div.bsx > a').each((a, b) => {
                    linkk.push($(b).attr('href'));
                    judull.push($(b).attr('title'));
                    thumb.push($(b).find('img').attr('src').split('?resize')[0]);
                });

                $('div.rating > div.numscore').each((c, d) => {
                    rating.push($(d).text());
                });

                for (let i = 0; i < linkk.length; i++) {
                    result.push({
                        creator: "Qasim Ali 🦋",
                        judul: judull[i],
                        rating: rating[i],
                        thumb: thumb[i],
                        link: linkk[i]
                    });
                }
                resolve(result);
            })
            .catch(reject);
    });
};

// sfilesearch function - Search files on sfile.mobi
exports.sfilesearch = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://sfile.mobi/search.php?q=' + query + '&search=Search')
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                const link = [];
                const name = [];
                const size = [];

                $('div.w3-card.white > div.list > a').each((a, b) => {
                    link.push($(b).attr('href'));
                });

                $('div.w3-card.white > div.list > a').each((c, d) => {
                    name.push($(d).text());
                });

                $('div.w3-card.white > div.list').each((e, f) => {
                    size.push($(f).text().split('(')[1]);
                });

                for (let i = 0; i < link.length; i++) {
                    result.push({
                        creator: "Qasim Ali 🦋",
                        nama: name[i],
                        size: size[i].split(')')[0],
                        link: link[i]
                    });
                }
                resolve(result);
            })
            .catch(reject);
    });
};

// carigc function - Search WhatsApp group links
exports.carigc = (nama) => {
    return new Promise((resolve, reject) => {
        axios.get('http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search=' + nama + '&searchby=name')
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                const lnk = [];
                const nm = [];

                $('div.wa-chat-title-container').each((a, b) => {
                    const limk = $(b).find('a').attr('href');
                    lnk.push(limk);
                });

                $('div.wa-chat-title-text').each((c, d) => {
                    const name = $(d).text();
                    nm.push(name);
                });

                for (let i = 0; i < lnk.length; i++) {
                    result.push({
                        creator: "Qasim Ali 🦋",
                        nama: nm[i].split('. ')[1],
                        link: lnk[i].split('?')[0]
                    });
                }
                resolve(result);
            })
            .catch(reject);
    });
};

// wikisearch function - Search Wikipedia page for a query
exports.wikisearch = async (query) => {
    try {
        const res = await axios.get(`https://id.m.wikipedia.org/w/index.php?search=${query}`);
        const $ = cheerio.load(res.data);
        const hasil = [];
        let wiki = $('#mf-section-0').find('p').text();
        let thumb = $('#mf-section-0').find('div > div > a > img').attr('src');
        thumb = thumb ? 'https:' + thumb : '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'; // Default image if not found
        let judul = $('h1#section_0').text();

        hasil.push({
            creator: "Qasim Ali 🦋",
            wiki,
            thumb,
            judul
        });

        return hasil;
    } catch (error) {
        return new Error("=> Error => " + error);
    }
};

// deviantart function - Search DeviantArt for images related to a query
exports.devianart = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://www.deviantart.com/search?q=' + query)
            .then(({ data }) => {
                const $$ = cheerio.load(data);
                let no = '';
                $$('a[data-href^="/art/"]').each((c, d) => {
                    no = $$(d).attr('href');
                });

                axios.get(no)
                    .then(({ data }) => {
                        const $ = cheerio.load(data);
                        const result = [];
                        $('#root img').each((a, b) => {
                            result.push($(b).attr('src'));
                        });
                        resolve(result.map(image => ({
                            creator: "Qasim Ali 🦋",
                            image
                        })));
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};

// konachan function - Search Konachan for images based on a character tag
exports.konachan = (chara) => {
    return new Promise((resolve, reject) => {
        let text = chara.replace(' ', '_');
        axios.get('https://konachan.net/post?tags=' + text + '+')
            .then(({ data }) => {
                const $$ = cheerio.load(data);
                const no = [];
                $$('div.pagination > a').each((c, d) => {
                    no.push($$(d).text());
                });

                let mat = Math.floor(Math.random() * no.length);
                axios.get('https://konachan.net/post?page=' + mat + '&tags=' + text + '+')
                    .then(({ data }) => {
                        const $ = cheerio.load(data);
                        const result = [];
                        $('#post-list > div.content > div:nth-child(4) > ul > li > a.directlink.largeimg').each((a, b) => {
                            result.push($(b).attr('href'));
                        });
                        resolve(result.map(image => ({
                            creator: "Qasim Ali 🦋",
                            image
                        })));
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};

// wallpapercave function - Search for wallpapers on Wallpapercave
exports.wallpapercave = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://wallpapercave.com/search?q=' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                $('div.imgrow > a').each((a, b) => {
                    if (!$(b).find('img').attr('src').includes('.gif')) {
                        result.push('https://wallpapercave.com/' + $(b).find('img').attr('src').replace('fuwp', 'uwp'));
                    }
                });
                resolve(result.map(image => ({
                    creator: "Qasim Ali 🦋",
                    image
                })));
            })
            .catch(reject);
    });
};

// wallpapercraft function - Search for wallpapers on Wallpaperscraft
exports.wallpapercraft = (query) => {
    return new Promise((resolve, reject) => {
        axios.get('https://wallpaperscraft.com/search/?query=' + query)
            .then(({ data }) => {
                const $ = cheerio.load(data);
                const result = [];
                $('span.wallpapers__canvas').each((a, b) => {
                    result.push($(b).find('img').attr('src'));
                });
                resolve(result.map(image => ({
                    creator: "Qasim Ali 🦋",
                    image
                })));
            })
            .catch(reject);
    });
};

// wallpaperhd function - Search for 4K HD wallpapers related to a character
exports.wallpaperhd = (chara) => {
  return new Promise((resolve, reject) => {
    axios.get('https://wall.alphacoders.com/search.php?search=' + chara + '&filter=4K+Ultra+HD')
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const result = [];
        $('div.boxgrid > a > picture').each(function (a, b) {
          result.push({
            creator: "Qasim Ali 🦋",
            image: $(b).find('img').attr('src').replace('thumbbig-', '')  // Image URL
          });
        });
        resolve(result);
      })
      .catch(reject);
  });
};

// styletext function - Convert text into different styles and return the results
exports.styletext = (teks) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://qaz.wtf/u/convert.cgi?text=${teks}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];

        $('table > tbody > tr').each(function (a, b) {
          hasil.push({
            creator: 'Qasim Ali 🦋',
            name: $(b).find('td:nth-child(1) > span').text(),
            result: $(b).find('td:nth-child(2)').text().trim(),
            status: true,  // Indicating the result is successfully fetched
          });
        });

        resolve(hasil);
      }).catch(reject);
  });
};

// ringtone function - Search for ringtones based on the title
exports.ringtone = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://meloboom.com/en/search/${title}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];

        $('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
          hasil.push({
            creator: 'Qasim Ali 🦋',
            title: $(b).find('h4').text(),
            source: 'https://meloboom.com/' + $(b).find('a').attr('href'),
            audio: $(b).find('audio').attr('src'),
            status: true,  // Indicating the result is successfully fetched
          });
        });

        resolve(hasil);
      }).catch(reject);
  });
};

// MediaUmma function - Extract media content from MediaUmma based on the provided URL
exports.mediaumma = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const images = [];

        // Collect all image sources from the page
        $('#article-content > div').find('img').each(function (a, b) {
          images.push($(b).attr('src'));
        });

        // Extract the data to structure the response
        const result = {
          title: $('#wrap > div.content-container.font-6-16 > h1').text().trim(),
          author: {
            name: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.user-ame.font-6-16.fw').text().trim(),
            profilePic: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.profile-photo > img.photo').attr('src'),
          },
          caption: $('#article-content > div > p').text().trim(),
          media: $('#article-content > div > iframe').attr('src') ? 
            [$('#article-content > div > iframe').attr('src')] : images, // Use iframe or images
          type: $('#article-content > div > iframe').attr('src') ? 'video' : 'image',
          like: $('#wrap > div.bottom-btns > div > button:nth-child(1) > div.text.font-6-12').text(),
          creator: 'Qasim Ali 🦋',  // Creator field added
          status: true,             // Status field added
        };

        resolve(result);
      })
      .catch(reject);
  });
};

// wikimedia function - Search for images in Wikimedia Commons
exports.wikimedia = (title, retries = 3) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      }
    })
    .then(({ data }) => {
      const $ = cheerio.load(data);
      const result = [];

      // Parse each image result
      $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
        result.push({
          title: $(b).find('img').attr('alt'),
          source: $(b).attr('href'),
          image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src'),
          creator: 'Qasim Ali 🦋',  // Creator field added
          status: true,             // Status field added
        });
      });

      resolve(result);
    })
    .catch((error) => {
      // Retry logic for ECONNRESET error
      if (retries > 0 && error.code === 'ECONNRESET') {
        console.log(`Connection reset, retrying... (${retries} retries left)`);
        setTimeout(() => {
          exports.wikimedia(title, retries - 1).then(resolve).catch(reject); // Recursively retry
        }, 5000); // Retry after 5 seconds
      } else {
        console.error('Request failed:', error.message);
        reject(error);
      }
    });
  });
};

exports.tiktokDl = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate the TikTok URL
      if (!url || !url.includes('tiktok.com')) {
        return reject(new Error('Invalid TikTok URL'));
      }

      let data = [];

      // Helper function to format numbers with commas as thousands separators
      function formatNumber(integer) {
        return parseInt(integer).toLocaleString().replace(/,/g, '.');
      }

      // Helper function to format dates
      function formatDate(n, locale = 'en') {
        let d = new Date(n);
        return d.toLocaleDateString(locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        });
      }

      // Set the API endpoint and make the request
      const domain = 'https://www.tikwm.com/api/';
      let response = await axios.post(domain, {}, {
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Origin': 'https://www.tikwm.com',
          'Referer': 'https://www.tikwm.com/',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        },
        params: {
          url: url,
          count: 12,
          cursor: 0,
          web: 1,
          hd: 1
        }
      });

      const res = response.data?.data;
      if (!res) {
        return reject(new Error('Invalid response data or no data found'));
      }

      // Processing the response for media data (video or images)
      if (res.size === undefined) {
        // If no size, handle it as image or different content type
        if (res.images && Array.isArray(res.images)) {
          res.images.forEach(image => {
            data.push({ type: 'photo', url: image });
          });
        }
      } else {
        // If video, process the video data with and without watermark
        data.push({
          type: 'watermark',
          url: 'https://www.tikwm.com' + res.wmplay,
        }, {
          type: 'nowatermark',
          url: 'https://www.tikwm.com' + res.play,
        }, {
          type: 'nowatermark_hd',
          url: 'https://www.tikwm.com' + res.hdplay
        });
      }

      // Structuring the response with necessary information
      let json = {
        creator: 'Qasim Ali 🦋',  // Creator field added
        status: true,
        title: res.title,
        taken_at: formatDate(res.create_time).replace('1970', ''),
        region: res.region,
        id: res.id,
        durations: res.duration,
        duration: res.duration + ' Seconds',
        cover: 'https://www.tikwm.com' + res.cover,
        size_wm: res.wm_size,
        size_nowm: res.size,
        size_nowm_hd: res.hd_size,
        data: data,
        music_info: {
          id: res.music_info.id,
          title: res.music_info.title,
          author: res.music_info.author,
          album: res.music_info.album || null,
          url: 'https://www.tikwm.com' + res.music || res.music_info.play
        },
        stats: {
          views: formatNumber(res.play_count),
          likes: formatNumber(res.digg_count),
          comment: formatNumber(res.comment_count),
          share: formatNumber(res.share_count),
          download: formatNumber(res.download_count)
        },
        author: {
          id: res.author.id,
          fullname: res.author.unique_id,
          nickname: res.author.nickname,
          avatar: 'https://www.tikwm.com' + res.author.avatar
        }
      };

      resolve(json);
    } catch (e) {
      console.error('Error in fetching TikTok video:', e.message); // Log error for debugging
      reject(new Error('Error fetching TikTok video: ' + e.message));
    }
  });
};

// Twitter media downloader function (formerly 'xdown')
exports.xdown = async (url, options = {}) => {
  try {
    // Handle invalid or missing URL input
    const input = typeof url === 'object' ? url : { url };
    const { buffer, text } = options;

    if (!input.url) {
      return { found: false, error: 'No URL provided' };
    }

    const cleanedURL = makeurl(input.url);
    if (!/\/\/x.com/.test(cleanedURL)) {
      return { found: false, error: `Invalid URL: ${cleanedURL}` };
    }

    const apiURL = cleanedURL.replace('//x.com', '//api.vxtwitter.com');
    const result = await axios.get(apiURL).then(res => res.data).catch(() => ({
      found: false,
      error: 'An issue occurred. Make sure the x link is valid.'
    }));

    if (!result.media_extended) {
      return { found: false, error: 'No media found' };
    }

    // Prepare the result structure
    const output = {
      creator: 'Qasim Ali 🦋',  // Creator field added
      found: true,
      media: result.media_extended.map(({ url, type }) => ({
        url: url,
        type: type,
      })),
      date: result.date,
      likes: result.likes,
      replies: result.replies,
      retweets: result.retweets,
      authorName: result.user_name,
      authorUsername: result.user_screen_name,
      ...(input.text && { text: result.text })
    };

    // Optionally download media as buffer if requested
    if (buffer) {
      for (const media of output.media) {
        media.buffer = await axios.get(media.url, { responseType: 'arraybuffer' })
          .then(res => Buffer.from(res.data, 'binary'))
          .catch(() => null);
      }
    }

    return output;
  } catch (error) {
    console.error('Error in xdown:', error.message);
    throw new Error('Failed to get x media');
  }
};

// Helper function to make URL valid
function makeurl(url) {
  return url.startsWith('http') ? url : 'http://' + url;
}
