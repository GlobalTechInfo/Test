const fetch = require('node-fetch');
const cheerio = require('cheerio');

// MediaFire fetcher with developer and status code in response
exports.mediafire = async (url) => {
    try {
        let data = await fetch(`https://www-mediafire-com.translate.goog/${url.replace("https://www.mediafire.com/", "")}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`).then(res => res.text());
        
        let $ = cheerio.load(data);
        
        let link = ($("#downloadButton").attr("href") || "").trim();
        let link2 = ($("#download_link > a.retry").attr("href") || "").trim();
        
        let $intro = $("div.dl-info > div.intro");
        let name = $intro.find("div.filename").text().trim();
        let filetype = $intro.find("div.filetype > span").eq(0).text().trim();
        let ext = /\(\.(.*?)\)/.exec($intro.find("div.filetype > span").eq(1).text())?.[1]?.trim() || "bin";
        let upload = $("div.dl-info > ul.details > li").eq(1).find("span").text().trim();
        let size = $("div.dl-info > ul.details > li").eq(0).find("span").text().trim();

        return {
            developer: 'Qasim Ali',
            statusCode: 200,
            link,
            link2,
            name,
            filetype,
            ext,
            upload,
            size
        };
    } catch (e) {
        return {
            developer: 'Qasim Ali',
            statusCode: 500,
            message: 'Error fetching or parsing the MediaFire link: ' + e.message
        };
    }
};

// Google Images fetcher with developer and status code in response
exports.googleImage = async (query) => {
    try {
        const response = await fetch(`https://www.google.com/search?q=${query}&tbm=isch`, {
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,id;q=0.8',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
            }
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const data = await response.text();
        const $ = cheerio.load(data);
        
        // Regex pattern to match image URLs
        const pattern = /\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm;
        
        const matches = $.html().matchAll(pattern);

        // Decode the URL and filter valid image formats
        const decodeUrl = (url) => decodeURIComponent(JSON.parse(`"${url}"`));

        // Filter and map the URLs
        const imageUrls = [...matches]
            .map(({ groups }) => decodeUrl(groups?.url))  // Decode and extract URL
            .filter((url) => /.*\.(jpe?g|png)$/i.test(url));  // Filter valid image formats

        return {
            developer: 'Qasim Ali',
            statusCode: 200,
            imageUrls
        };
    } catch (error) {
        console.error('Error fetching Google Images:', error);
        return {
            developer: 'Qasim Ali',
            statusCode: 500,
            message: 'Error fetching Google Images: ' + error.message
        };
    }
};

// GitHub Repository URL fetcher with developer and status code in response
exports.gitclone = async (text) => {
    // Validate GitHub link
    if (!text) {
        return {
            developer: 'Qasim Ali',
            statusCode: 400,
            message: "GitHub link is required."
        };
    }

    // Regex for matching GitHub repo URL
    const regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
    const link = text;

    // Validate URL format
    if (!regex1.test(link)) {
        return {
            developer: 'Qasim Ali',
            statusCode: 400,
            message: 'Invalid GitHub URL.'
        };
    }

    let [, user, repo] = link.match(regex1) || [];
    repo = repo.replace(/.git$/, '');  // Remove .git if present

    // Construct the API URL for the ZIP file
    const url = `https://api.github.com/repos/${user}/${repo}/zipball`;

    try {
        // Check repository availability by making a HEAD request
        const response = await fetch(url, { method: 'HEAD' });

        if (!response.ok) {
            return {
                developer: 'Qasim Ali',
                statusCode: 404,
                message: 'Failed to retrieve the repository. Please check the link or try again later.'
            };
        }

        return {
            developer: 'Qasim Ali',
            statusCode: 200,
            url
        };
    } catch (error) {
        console.error(error);
        return {
            developer: 'Qasim Ali',
            statusCode: 500,
            message: 'An error occurred while fetching the GitHub repository.'
        };
    }
};
