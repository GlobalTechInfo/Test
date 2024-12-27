
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const axios = require('axios')
const _url = require('url')
const request = require('request');

exports.merdekanews = async () => {
	return new Promise((resolve) => {
		axios.get('https://www.merdeka.com/peristiwa/')
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const judul = [];
				const upload = [];
				const link = [];
				const thumb = [];
				const result = [];
				$('#mdk-content-center > div.inner-content > ul > li > div').each(function(a, b) {
					deta = $(b).find('h3 > a').text();
					judul.push(deta)
					link.push('https://www.merdeka.com' + $(b).find('h3 > a').attr('href'))
					upload.push($(b).find('div > span').text())
					thumb.push($(b).find('div > a > img').attr('src'))
				})
				for (let i = 0; i < judul.length; i++) {
					result.push({
						judul: judul[i],
						upload_date: upload[i],
						link: link[i],
						thumb: thumb[i]
					})
				}
				resolve(result)
			})
	})
}

exports.stickersearch = async (query) => {
	return new Promise((resolve) => {
		axios.get(`https://getstickerpack.com/stickers?query=${query}`)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const link = [];
				$('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				rand = link[Math.floor(Math.random() * link.length)]
				axios.get(rand)
					.then(({
						data
					}) => {
						const $$ = cheerio.load(data)
						const url = [];
						$$('#stickerPack > div > div.row > div > img').each(function(a, b) {
							url.push($$(b).attr('src').split('&d=')[0])
						})
						resolve({
							creator: 'Qasim Ali ',
							title: $$('#intro > div > div > h1').text(),
							author: $$('#intro > div > div > h5 > a').text(),
							author_link: $$('#intro > div > div > h5 > a').attr('href'),
							sticker: url
						})
					})
			})
	})
}

exports.trendtwit = async (country) => {
	return new Promise((resolve, reject) => {
		axios.get(`https://getdaytrends.com/${country}/`)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const hastag = [];
				const tweet = [];
				const result = [];
				$('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr> td.main > a').each(function(a, b) {
					deta = $(b).text()
					hastag.push(deta)
				})
				$('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > div > span').each(function(a, b) {
					deta = $(b).text()
					tweet.push(deta)
				})
				num = 1
				for (let i = 0; i < hastag.length; i++) {
					result.push({
						rank: num,
						hastag: hastag[i],
						tweet: tweet[i]
					})
					num += 1
				}
				resolve({
					country: country,
					result: result
				})
			})
			.catch(reject)
	})
}
exports.pinterest = async (querry) => {
	return new Promise(async (resolve, reject) => {
		axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
			headers: {
				"cookie": "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
			}
		}).then(({
			data
		}) => {
			const $ = cheerio.load(data)
			const result = [];
			const hasil = [];
			$('div > a').get().map(b => {
				const link = $(b).find('img').attr('src')
				result.push(link)
			});
			result.forEach(v => {
				if (v == undefined) return
				hasil.push(v.replace(/236/g, '736'))
			})
			hasil.shift();
			resolve(hasil)
		})
	})
}
exports.zerochan = async (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://www.zerochan.net/search?q=' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const judul = [];
				const result = [];
				const id = [];
				$('#thumbs2 > li > a > img').each(function(a, b) {
					if (!$(b).attr('alt').startsWith('https://static.zerochan.net/')) {
						judul.push($(b).attr('alt'))
					}
				})
				$('#thumbs2 > li > a').each(function(a, b) {
					id.push($(b).attr('href'))
				})
				for (let i = 0; i < judul.length; i++) {
					result.push('https://s1.zerochan.net/' + judul[i].replace(/\ /g, '.') + '.600.' + id[i].split('/')[1] + '.jpg')
				}
				resolve({
					creator: 'Qasim Ali ',
					result: result
				})
			})
			.catch(reject)
	})
}

exports.job = async (query) => {
	return new Promise((resolve, reject) => {
		axios.get(`https://www.jobstreet.co.id/id/job-search/${query}-jobs/`)
			.then((data) => {
				//console.log(data.data)
				const $ = cheerio.load(data.data)
				const job = [];
				const perusahaan = [];
				const daerah = [];
				const format = [];
				const link = [];
				const upload = [];
				$('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > div > h1 > a > div').each(function(a, b) {
					deta = $(b).text();
					job.push(deta)
				})
				$('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > div > span').each(function(a, b) {
					deta = $(b).text();
					perusahaan.push(deta)
				})
				$('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > span > span').each(function(a, b) {
					deta = $(b).text();
					daerah.push(deta)
				})
				$('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div > div > div > h1 > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				$('#jobList > div > div:nth-child(3) > div > div > div > div > article > div > div > div.sx2jih0.zcydq852.zcydq842.zcydq872.zcydq862.zcydq82a.zcydq832.zcydq8d2.zcydq8cq > div.sx2jih0.zcydq832.zcydq8cq.zcydq8c6.zcydq882 > time > span').each(function(a, b) {
					deta = $(b).text();
					upload.push(deta)
				})
				for (let i = 0; i < job.length; i++) {
					format.push({
						job: job[i],
						perusahaan: perusahaan[i],
						daerah: daerah[i],
						upload: upload[i],
						link_Detail: 'https://www.jobstreet.co.id' + link[i]
					})
				}
				resolve(format)
			})
			.catch(reject)
	})
}
exports.anoboys = async (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://anoboy.media/?s=' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const format = [];
				const link = [];
				const judul = [];
				const thumb = [];
				const uptime = [];
				$('body > div.wrap > div.container > div.column-content > a > div > div.amvj > h3').each(function(a, b) {
					jud = $(b).text();
					judul.push(jud)
				})
				$('body > div.wrap > div.container > div.column-content > a > div > div.jamup').each(function(c, d) {
					upt = $(d).text();
					uptime.push(upt)
				})
				$('body > div.wrap > div.container > div.column-content > a > div > amp-img').each(function(e, f) {
					thumb.push($(f).attr('src'))
				})
				$('body > div.wrap > div.container > div.column-content > a').each(function(g, h) {
					link.push($(h).attr('href'))
				})
				for (let i = 0; i < link.length; i++) {
					format.push({
						judul: judul[i],
						thumb: thumb[i],
						link: link[i]
					})
				}
				const result = {
					status: data.status,
					creator: 'Qasim Ali ',
					data: format
				}
				resolve(result)
			})
			.catch(reject)
	})
}

exports.film = async (query) => {
	return new Promise((resolve, reject) => {
		axios.get(`http://167.99.71.200/?s=${query}`)
			.then((data) => {
				const $ = cheerio.load(data.data)
				const judul = [];
				const genre = [];
				const thumb = [];
				const link = [];
				const format = [];
				$('div > div.item-article > header > h2 > a').each(function(a, b) {
					deta = $(b).text();
					judul.push(deta)
				})
				$('div > div.item-article > header > div.gmr-movie-on').each(function(a, b) {
					deta = $(b).text();
					genre.push(deta)
				})
				$('div > div.content-thumbnail.text-center > a > img').each(function(a, b) {
					thumb.push($(b).attr('src'))
				})
				$('div > div.item-article > header > div.gmr-watch-movie > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				for (let i = 0; i < judul.length; i++) {
					format.push({
						judul: judul[i],
						genre: genre[i],
						thumb: thumb[i],
						link_nonton: link[i]
					})
				}
				if (format == '') {
					resolve({
						status: 'error'
					})
				} else {
					resolve(format)
				}
			})
			.catch(reject)
	})
}
exports.webtoons = async (query) => {
	return new Promise((resolve, reject) => {
		axios.get(`https://www.webtoons.com/id/search?keyword=${query}`)
			.then((data) => {
				const $ = cheerio.load(data.data)
				const judul = [];
				const genre = [];
				const author = [];
				const link = [];
				const likes = [];
				const format = [];
				$('#content > div > ul > li > a > div > p.subj').each(function(a, b) {
					deta = $(b).text();
					judul.push(deta)
				})
				$('div > ul > li > a > span').each(function(a, b) {
					deta = $(b).text();
					genre.push(deta)
				})
				$('div > ul > li > a > div > p.author').each(function(a, b) {
					deta = $(b).text();
					author.push(deta)
				})
				$('div > ul > li > a > div > p.grade_area > em').each(function(a, b) {
					deta = $(b).text();
					likes.push(deta)
				})
				$('#content > div > ul > li > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				for (let i = 0; i < judul.length; i++) {
					format.push({
						judul: judul[i],
						genre: genre[i],
						author: author[i],
						likes: likes[i],
						link: 'https://www.webtoons.com' + link[i]
					})
				}
				if (likes == '') {
					resolve({
						status: `${query} tidak dapat ditemukan/error`
					})
				} else {
					resolve(format)
				}
			})
			.catch(reject)
	})
}
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
		request(options, async function(error, response, body) {
			console.log(body)
			if (error) throw new Error(error);
			const $ = cheerio.load(body)
			resolve({
				judul: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(2)').text(),
				download_count: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(3)').text(),
				thumb: $('#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1) > img').attr('src'),
				link: $('#dlMP3').attr('onclick').split(`downloadFile('`)[1].split(`',`)[0]
			});
		});
	})
}

// Screenshot Web Capture

exports.ssweb = async (url) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${url}`
    )
    const siteData = response.data
    const dataURL = siteData.lighthouseResult?.fullPageScreenshot?.screenshot?.data
    const base64Data = dataURL.replace(/^data:image\/webp;base64,/, '')
    return Buffer.from(base64Data, 'base64')
  } catch (e) {
    throw new Error('Failed to fetch Buffer')
  }
}

exports.gempa = async () => {
	return new Promise(async (resolve, reject) => {
		axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg')
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const drasa = [];
				$('table > tbody > tr:nth-child(1) > td:nth-child(6) > span').get().map((rest) => {
					dir = $(rest).text();
					drasa.push(dir.replace('\t', ' '))
				})
				teks = ''
				for (let i = 0; i < drasa.length; i++) {
					teks += drasa[i] + '\n'
				}
				const rasa = teks
				const format = {
					imagemap: $('div.modal-body > div > div:nth-child(1) > img').attr('src'),
					magnitude: $('table > tbody > tr:nth-child(1) > td:nth-child(4)').text(),
					kedalaman: $('table > tbody > tr:nth-child(1) > td:nth-child(5)').text(),
					wilayah: $('table > tbody > tr:nth-child(1) > td:nth-child(6) > a').text(),
					waktu: $('table > tbody > tr:nth-child(1) > td:nth-child(2)').text(),
					lintang_bujur: $('table > tbody > tr:nth-child(1) > td:nth-child(3)').text(),
					dirasakan: rasa
				}
				const result = {
					creator: 'Qasim Ali ',
					data: format
				}
				resolve(result)
			})
			.catch(reject)
	})
}
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
					creator: 'Qasim Ali ',
					data: format
				}
				resolve(result)
			})
			.catch(reject)
	})
}

exports.textmakervid = async (text1, style) => {
	if (style == 'poly') {
		var tstyle = 0
	} else if (style == 'bold') {
		var tstyle = 1
	} else if (style == 'glowing') {
		var tstyle = 2
	} else if (style == 'colorful') {
		var tstyle = 3
	} else if (style == 'army') {
		var tstyle = 4
	} else if (style == 'retro') {
		var tstyle = 5
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
		request(options, async function(error, response, body) {
			if (error) throw new Error(error);
			const $ = cheerio.load(body)
			const result = {
				url: $('div.btn-group > a').attr('href')
			}
			resolve(result);
		});
	})
}

exports.android1 = (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://an1.com/tags/MOD/?story=' + query + '&do=search&subaction=search')
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const nama = [];
				const link = [];
				const rating = [];
				const thumb = [];
				const developer = [];
				const format = [];
				$('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.name > a > span').each(function(a, b) {
					nem = $(b).text();
					nama.push(nem)
				})
				$('div > ul > li.current-rating').each(function(c, d) {
					rat = $(d).text();
					rating.push(rat)
				})
				$('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.developer.xsmf.muted').each(function(e, f) {
					dev = $(f).text();
					developer.push(dev)
				})
				$('body > div.page > div > div > div.app_list > div > div > div.img > img').each(function(g, h) {
					thumb.push($(h).attr('src'))
				})
				$('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.name > a').each(function(i, j) {
					link.push($(j).attr('href'))
				})
				for (let i = 0; i < link.length; i++) {
					format.push({
						judul: nama[i],
						dev: developer[i],
						rating: rating[i],
						thumb: thumb[i],
						link: link[i]
					})
				}
				const result = {
					creator: 'Qasim Ali ',
					data: format
				}
				resolve(result)
			})
			.catch(reject)
	})
}
exports.happymod = (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://www.happymod.com/search.html?q=' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const nama = [];
				const link = [];
				const rating = [];
				const thumb = [];
				const format = [];
				$('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > h3 > a').each(function(a, b) {
					nem = $(b).text();
					nama.push(nem)
					link.push('https://happymod.com' + $(b).attr('href'))
				})
				$('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > div.clearfix > span').each(function(c, d) {
					rat = $(d).text();
					rating.push(rat)
				})
				$('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > a > img').each(function(e, f) {
					thumb.push($(f).attr('data-original'))
				})
				for (let i = 0; i < link.length; i++) {
					format.push({
						title: nama[i],
						thumb: thumb[i],
						rating: rating[i],
						link: link[i]
					})
				}
				const result = {
					creator: 'Qasim Ali ',
					data: format
				}
				resolve(result)
			})
			.catch(reject)
	})
}
exports.nickff = (userId) => {
if (!userId) return new Error("no userId")
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
}).then(({
data
}) => {
resolve({
"username": data.confirmationFields.roles[0].role,
"userId": userId,
"country": data.confirmationFields.country
});
}).catch(reject);
});
}

exports.nickml = (id, zoneId) => {
return new Promise(async (resolve, reject) => {
axios
.post(
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
},
}
)
.then((response) => {
resolve(response.data.data.gameDetail)
})
.catch((err) => {
reject(err)
})
})
}
exports.corona = async (country) => {
	if (!country) return loghandler.noinput;
	try {
		const res = await axios.request(`https://www.worldometers.info/coronavirus/country/` + country, {
			method: "GET",
			headers: {
				"User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
			}
		});
		let result = {};
		const $ = cheerio.load(res.data);
		result.status = res.status
		result.negara = $("div").find("h1").text().slice(3).split(/ /g)[0];
		result.total_kasus = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(0).text() + " total";
		result.total_kematian = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(1).text() + " total";
		result.total_sembuh = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(2).text() + " total";
		result.informasi = $("div.content-inner > div").eq(1).text();
		result.informasi_lengkap = "https://www.worldometers.info/coronavirus/country/" + country;
		if (result.negara == '') {
			result.status = 'error'
		}
		return result;
	} catch (error404) {
		return "=> Error => " + error404;
	}
};
exports.mangatoon = async (search) => {
	if (!search) return "No Querry Input! Bakaa >\/\/<";
	try {
		const res = await axios.get(`https://mangatoon.mobi/en/search?word=${search}`, {
			method: "GET",
			headers: {
				"User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
			}
		});
		const hasil = [];
		const $ = cheerio.load(res.data);
		$('div.recommend-item').each(function(a, b) {
			let comic_name = $(b).find('div.recommend-comics-title > span').text();
			let comic_type = $(b).find('div.comics-type > span').text().slice(1).split(/ /g).join("");
			let comic_url = $(b).find('a').attr('href');
			let comic_thumb = $(b).find('img').attr('src');
			const result = {
				status: res.status,
				creator: "Qasim Ali ",
				comic_name,
				comic_type,
				comic_url: 'https://mangatoon.mobi' + comic_url,
				comic_thumb
			};
			hasil.push(result);
		});
		let filt = hasil.filter(v => v.comic_name !== undefined && v.comic_type !== undefined);
		return filt;
	} catch (eror404) {
		return "=> Error =>" + eror404;
	}
}
exports.palingmurah = async (produk) => {
	if (!produk) {
		return new TypeError("No Querry Input! Bakaaa >\/\/<")
	}
	try {
		const res = await axios.get(`https://palingmurah.net/pencarian-produk/?term=` + produk)
		const hasil = []
		const $ = cheerio.load(res.data)
		$('div.ui.card.wpj-card-style-2 ').each(function(a, b) {
			let url = $(b).find('a.image').attr('href')
			let img = $(b).find('img.my_image.lazyload').attr('data-src')
			let title = $(b).find('a.list-header').text().trim()
			let product_desc = $(b).find('div.description.visible-on-list').text().trim()
			let price = $(b).find('div.flex-master.card-job-price.text-right.text-vertical-center').text().trim()
			const result = {
				status: res.status,
				creator: "Qasim Ali ",
				product: title,
				product_desc: product_desc,
				product_image: img,
				product_url: url,
				price
			}
			hasil.push(result)
		})
		return hasil
	} catch (error404) {
		return new Error("=> Error =>" + error404)
	}
}

exports.artinama = (query) => {
	return new Promise((resolve, reject) => {
		queryy = query.replace(/ /g, '+')
		axios.get('https://www.primbon.com/arti_nama.php?nama1=' + query + '&proses=+Submit%21+')
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const result = $('#body').text();
				const result2 = result.split('\n      \n        \n        \n')[0]
				const result4 = result2.split('ARTI NAMA')[1]
				const result5 = result4.split('.\n\n')
				const result6 = result5[0] + '\n\n' + result5[1]
				resolve(result6)
			})
			.catch(reject)
	})
}

exports.wattpad = (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://www.wattpad.com/search/' + query)
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const result = [];
				const linkk = [];
				const judull = [];
				const thumb = [];
				const dibaca = [];
				const vote = [];
				const bab = [];
				$('ul.list-group > li.list-group-item').each(function(a, b) {
					linkk.push('https://www.wattpad.com' + $(b).find('a').attr('href'))
					thumb.push($(b).find('img').attr('src'))
				})
				$('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(1) > div.icon-container > div > span.stats-value').each(function(e, f) {
					baca = $(f).text();
					dibaca.push(baca)
				})
				$('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(2) > div.icon-container > div > span.stats-value').each(function(g, h) {
					vot = $(h).text();
					vote.push(vot)
				})
				$('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(3) > div.icon-container > div > span.stats-value').each(function(i, j) {
					bb = $(j).text();
					bab.push(bb)
				})
				$('div.story-card-data.hidden-xxs > div.story-info > div.title').each(function(c, d) {
					titel = $(d).text();
					judull.push(titel)
				})
				for (let i = 0; i < linkk.length; i++) {
					if (!judull[i] == '') {
						result.push({
							judul: judull[i],
							dibaca: dibaca[i],
							divote: vote[i],
							thumb: thumb[i],
							link: linkk[i]
						})
					}
				}
				resolve(result)
			})
			.catch(reject)
	})
}
exports.sfilesearch = (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://sfile.mobi/search.php?q=' + query + '&search=Search')
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const result = [];
				const link = [];
				const neme = [];
				const size = [];
				$('div.w3-card.white > div.list > a').each(function(a, b) {
					link.push($(b).attr('href'))
				})
				$('div.w3-card.white > div.list > a').each(function(c, d) {
					name = $(d).text();
					neme.push(name)
				})
				$('div.w3-card.white > div.list').each(function(e, f) {
					siz = $(f).text();
					//sz = siz.
					size.push(siz.split('(')[1])
				})
				for (let i = 0; i < link.length; i++) {
					result.push({
						nama: neme[i],
						size: size[i].split(')')[0],
						link: link[i]
					})
				}
				resolve(result)
			})
			.catch(reject)
	})
}
exports.wikisearch = async (query) => {
	const res = await axios.get(`https://id.m.wikipedia.org/w/index.php?search=${query}`)
	const $ = cheerio.load(res.data)
	const hasil = []
	let wiki = $('#mf-section-0').find('p').text()
	let thumb = $('#mf-section-0').find('div > div > a > img').attr('src')
	thumb = thumb ? thumb : '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'
	thumb = 'https:' + thumb
	let judul = $('h1#section_0').text()
	hasil.push({
		wiki,
		thumb,
		judul
	})
	return hasil
}
exports.devianart = (query) => {
	return new Promise((resolve, reject) => {
		axios.get('https://www.deviantart.com/search?q=' + query)
			.then(({
				data
			}) => {
				const $$ = cheerio.load(data)
				no = ''
				$$('#root > div.hs1JI > div > div._3WsM9 > div > div > div:nth-child(3) > div > div > div:nth-child(1) > div > div:nth-child(1) > div > section > a').each(function(c, d) {
					no = $$(d).attr('href')
				})
				axios.get(no)
					.then(({
						data
					}) => {
						const $ = cheerio.load(data)
						const result = [];
						$('#root > main > div > div._2QovI > div._2rKEX._17aAh._1bdC8 > div > div._2HK_1 > div._1lkTS > div > img').each(function(a, b) {
							result.push($(b).attr('src'))
						})
						resolve(result)
					})
			})
			.catch(reject)
	})
}
exports.konachan = (chara) => {
	return new Promise((resolve, reject) => {
		let text = chara.replace(' ', '_')
		axios.get('https://konachan.net/post?tags=' + text + '+')
			.then(({
				data
			}) => {
				const $$ = cheerio.load(data)
				const no = [];
				$$('div.pagination > a').each(function(c, d) {
					no.push($$(d).text())
				})
				let mat = Math.floor(Math.random() * no.length)
				axios.get('https://konachan.net/post?page=' + mat + '&tags=' + text + '+')
					.then(({
						data
					}) => {
						const $ = cheerio.load(data)
						const result = [];
						$('#post-list > div.content > div:nth-child(4) > ul > li > a.directlink.largeimg').each(function(a, b) {
							result.push($(b).attr('href'))
						})
						resolve(result)
					})
			})
			.catch(reject)
	})
}


exports.wallpaper = async (title, page = '1') => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];

        $('div.grid-item').each(function (a, b) {
          hasil.push({
            title: $(b).find('div.info > a > h3').text(),
            type: $(b).find('div.info > a:nth-child(2)').text(),
            source: 'https://www.besthdwallpaper.com/' + $(b).find('div > a:nth-child(3)').attr('href'),
            image: [
              $(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'),
              $(b).find('picture > source:nth-child(1)').attr('srcset'),
              $(b).find('picture > source:nth-child(2)').attr('srcset')
            ],
          });
        });
        resolve({
          creator: 'Qasim Ali ',
          status: true,
          results: hasil,
        });
      }).catch(error => {
        reject({
          creator: 'Qasim Ali ',
          status: false,
          error: error.message,
        });
      });
  });
}

exports.styletext = (teks) =>  {
  return new Promise((resolve, reject) => {
    axios.get(`http://qaz.wtf/u/convert.cgi?text=${teks}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];

        $('table > tbody > tr').each(function (a, b) {
          hasil.push({
            name: $(b).find('td:nth-child(1) > span').text(),
            result: $(b).find('td:nth-child(2)').text().trim(),
            creator: 'Qasim Ali ',
            status: true,
          });
        });
        resolve(hasil);
      }).catch(reject);
  });
}

exports.ringtone = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://meloboom.com/en/search/${title}`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];

        $('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
          hasil.push({
            title: $(b).find('h4').text(),
            source: 'https://meloboom.com/' + $(b).find('a').attr('href'),
            audio: $(b).find('audio').attr('src'),
            creator: 'Qasim Ali ',  // Add your name here
            status: true,           // Add status (true or false)
          });
        });
        resolve(hasil);
      }).catch(reject);
  });
}

exports.mediaumma = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const image = [];

        // Collect all image sources
        $('#article-content > div').find('img').each(function (a, b) {
          image.push($(b).attr('src'));
        });

        const hasil = {
          title: $('#wrap > div.content-container.font-6-16 > h1').text().trim(),
          author: {
            name: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.user-ame.font-6-16.fw').text().trim(),
            profilePic: $('#wrap > div.content-container.font-6-16 > div.content-top > div > div.profile-photo > img.photo').attr('src'),
          },
          caption: $('#article-content > div > p').text().trim(),
          media: $('#article-content > div > iframe').attr('src') ? [$('#article-content > div > iframe').attr('src')] : image,
          type: $('#article-content > div > iframe').attr('src') ? 'video' : 'image',
          like: $('#wrap > div.bottom-btns > div > button:nth-child(1) > div.text.font-6-12').text(),
          creator: 'Qasim Ali ',  // Add your name here
          status: true,           // Add status (true or false)
        };
        resolve(hasil);
      }).catch(reject);
  });
}

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
      const hasil = [];

      $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
        hasil.push({
          title: $(b).find('img').attr('alt'),
          source: $(b).attr('href'),
          image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src'),
          creator: 'Qasim Ali ',  // Add your name here
          status: true,           // Add status (true or false)
        });
      });
      resolve(hasil);
    })
    .catch((error) => {
      if (retries > 0 && error.code === 'ECONNRESET') {
        console.log(`Connection reset, retrying... (${retries} retries left)`);
        setTimeout(() => {
          wikimedia(title, retries - 1).then(resolve).catch(reject);
        }, 5000); // Retry after 5 seconds
      } else {
        console.error('Request failed:', error.message);
        reject(error);
      }
    });
  });
}

exports.tiktokDl = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!url || !url.includes('tiktok.com')) {
        return reject(new Error('Invalid TikTok URL'));
      }

      let data = [];

      function formatNumber(integer) {
        return parseInt(integer).toLocaleString().replace(/,/g, '.');
      }

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

      // Processing the response
      if (res.size === undefined) {
        // If no size, handle as image or different content type
        if (res.images && Array.isArray(res.images)) {
          res.images.forEach(image => {
            data.push({ type: 'photo', url: image });
          });
        }
      } else {
        // If size exists, process video data
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

      // Structuring the response
      let json = {
        creator: 'Qasim Ali ',
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
}

exports.xdown = (url) => {
    try {
      const input =
          'object' == typeof url
            ? url.url
              ? url
              : {
                  found: !1,
                  error: 'No URL provided',
                }
            : {
                url: url,
              },
        { buffer, text } = options
      ;(buffer || text) && ((input.buffer = buffer), (input.text = text))
      const cleanedURL = makeurl(input.url)
      if (!/\/\/x.com/.test(cleanedURL))
        return {
          found: !1,
          error: `Invalid URL: ${cleanedURL}`,
        }
      const apiURL = cleanedURL.replace('//x.com', '//api.vxtwitter.com'),
        result = await axios
          .get(apiURL)
          .then(res => res.data)
          .catch(() => ({
            found: !1,
            error: 'An issue occurred. Make sure the x link is valid.',
          }))
      if (!result.media_extended)
        return {
          found: !1,
          error: 'No media found',
        }
      const output = {
        creator: 'Qasim Ali ',
        found: !0,
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
        ...(input.text && {
          text: result.text,
        }),
      }
      if (input.buffer)
        for (const media of output.media)
          media.buffer = await axios
            .get(media.url, {
              responseType: 'arraybuffer',
            })
            .then(res => Buffer.from(res.data, 'binary'))
            .catch(() => {})
      return output
    } catch (error) {
      throw (console.error('Error in xdown:', error.message), new Error('Failed to get x media'))
    }
  }
  
  exports.facebook= async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Send POST request to get download page
      const response = await fetch('https://www.getfvid.com/downloader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Referer: 'https://www.getfvid.com/',
        },
        body: new URLSearchParams({
          url: url,
        }),
      });

      // Get the page content
      const body = await response.text();

      // Load HTML content using cheerio
      const $ = cheerio.load(body);

      // Extract relevant data
      const title = $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-5.no-padd > div > h5 > a').text().trim();
      const time = $('#time').text().trim();
      const hd = $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a').attr('href');
      const sd = $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a').attr('href');
      const audio = $('body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(3) > a').attr('href');

      // If any of the fields are empty, log them
      if (!title || !time || !hd || !sd || !audio) {
        console.warn('Some fields are missing or not found!');
      }

      // Return the extracted data in a structured JSON
      resolve({
        result: {
          creator: 'Qasim Ali ',
          url: url,
          title: title || 'Title not found',
          time: time || 'Time not found',
          hd: hd || 'HD link not found',
          sd: sd || 'SD link not found',
          audio: audio || 'Audio link not found',
        },
      });

    } catch (error) {
      console.error('Error with FB DOWNLOAD', error.message);
      reject(new Error('Error fetching FB download link: ' + error.message));
    }
  });
}

exports.bitly = async (url) => {
  try {
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 7e22401ef9e6777813e43a52dfef0ade98c6d3f9',
      },
      body: JSON.stringify({
        long_url: url,
      }),
    })
    return (await response.json()).link
  } catch (error) {
    return console.error(error), null
  }
}

exports.tinyurl = async (url) => {
  try {
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
    return await response.text()
  } catch (error) {
    return console.error(error), null
  }
}

exports.playstore = async (search) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`),
        result = [],
        $ = cheerio.load(data)
      if (
        ($(
          '.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a'
        ).each((i, u) => {
          const linkk = $(u).attr('href'),
            name = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text(),
            developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text(),
            img = $(u).find('.j2FCNc > img').attr('src'),
            rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label'),
            rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text(),
            link = `https://play.google.com${linkk}`
          result.push({
            creator: 'Qasim Ali ',
            link: link,
            name: name || 'No name',
            developer: developer || 'No Developer',
            img: img || 'https://i.ibb.co/G7CrCwN/404.png',
            rating: rate || 'No Rate',
            rating_Num: rate2 || 'No Rate',
            link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(' ').join('+')}`,
          })
        }),
        result.every(x => void 0 === x))
      )
        return resolve({
          creator: 'Qasim Ali ',
          text: 'no result found',
        })
      resolve(result)
    } catch (err) {
      console.error(err)
    }
  })
}

exports.quotesanime = () => {
  return new Promise(async (resolve) => {
    try {
      const data = await axios.get(`https://qasimapi.vercel.app/api/quotesanime`);
      
      resolve(data.data);
    } catch (error) {
      resolve({
        developer: 'Qasim Ali ',
        status: false,
        msg: 'Quotes API error',
      });
    }
  });
};

exports.weather = async (city) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`;

        // Fetch the weather data using axios
        const response = await axios.get(url);

        // Access weather data from the response
        const cuaca = response.data;

        // Prepare the result with only necessary details
        const result = {
            status: true,
            code: 200,
            creator: "Qasim Ali ",  // This is fine to keep as is
            weather: {
                main: cuaca.weather[0].main,
                description: cuaca.weather[0].description,
                temp: cuaca.main.temp,
                feels_like: cuaca.main.feels_like,
                pressure: cuaca.main.pressure,
                humidity: cuaca.main.humidity,
                wind_speed: cuaca.wind.speed,
                latitude: cuaca.coord.lat,
                longitude: cuaca.coord.lon,
                country: cuaca.sys.country
            }
        };

        // Return the structured result
        return result;

    } catch (err) {
        // Log error with more context
        console.error('Error fetching weather:', err.message);

        // Return user-friendly error message
        return {
            status: false,
            code: 500,
            message: 'There was an issue fetching the weather data. Please try again later.'
        };
    }
};
