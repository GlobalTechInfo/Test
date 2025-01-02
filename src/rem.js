const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.mediafire = async (url) => {
    try {
        // Fetching the translated MediaFire page (Google Translate to handle redirect)
        let data = await fetch(`https://www-mediafire-com.translate.goog/${url.replace("https://www.mediafire.com/", "")}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`).then(res => res.text());
        
        // Using cheerio to parse and scrape data from the HTML
        let $ = cheerio.load(data);
        
        // Extract the download link
        let link = ($("#downloadButton").attr("href") || "").trim();
        let link2 = ($("#download_link > a.retry").attr("href") || "").trim();

        // Extract file details (name, type, extension, etc.)
        let $intro = $("div.dl-info > div.intro");
        let name = $intro.find("div.filename").text().trim();
        let filetype = $intro.find("div.filetype > span").eq(0).text().trim();
        let ext = /\(\.(.*?)\)/.exec($intro.find("div.filetype > span").eq(1).text())?.[1]?.trim() || "bin";
        let upload = $("div.dl-info > ul.details > li").eq(1).find("span").text().trim();
        let size = $("div.dl-info > ul.details > li").eq(0).find("span").text().trim();

        // Return the data as a structured object
        return {
            link,
            link2,
            name,
            filetype,
            ext,
            upload,
            size
        };
    } catch (e) {
        // Throw any errors that occur during the fetch or parsing
        throw new Error('Error fetching or parsing the MediaFire link: ' + e.message);
    }
};

exports.googleImage = async (query) => {
   try {
      // Fetch the Google Images page
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
      
      // The regex to match the image URLs in the page's HTML
      const pattern = /\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm;
      
      const matches = $.html().matchAll(pattern);

      // Decode the URL and filter valid image formats
      const decodeUrl = (url) => decodeURIComponent(JSON.parse(`"${url}"`));
      
      // Map and filter URLs
      const imageUrls = [...matches]
         .map(({ groups }) => decodeUrl(groups?.url))  // Decode and extract URL
         .filter((url) => /.*\.(jpe?g|png)$/i.test(url));  // Filter for valid image URLs (JPEG/PNG)
      
      return imageUrls;  // Return the filtered image URLs
   } catch (error) {
      console.error('Error fetching Google Images:', error);
      return [];  // Return an empty array if an error occurs
   }
};


// Function to generate a GitHub repository download URL
exports.gitclone = async (text) => {
    // Validate the GitHub link
    if (!text) {
        throw new Error("GitHub link is required.");
    }

    // Regex to match GitHub repository URL
    const regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
    const link = text;

    // If the URL does not match the GitHub format, return an error
    if (!regex1.test(link)) {
        throw new Error('Invalid GitHub URL.');
    }

    // Extract user and repo name
    let [, user, repo] = link.match(regex1) || [];
    repo = repo.replace(/.git$/, ''); // Remove the .git extension if present

    // Construct the URL for downloading the repository as a ZIP file
    const url = `https://api.github.com/repos/${user}/${repo}/zipball`;

    try {
        // Check if the repository URL exists by fetching its headers
        const response = await fetch(url, { method: 'HEAD' });

        // If the response is not OK, throw an error
        if (!response.ok) {
            throw new Error('Failed to retrieve the repository. Please check the link or try again later.');
        }

        // If everything is fine, return the download URL (this is the URL GitHub uses for downloading the ZIP file)
        return url;  // This URL will allow users to directly download the ZIP file
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching the GitHub repository.');
    }
};
