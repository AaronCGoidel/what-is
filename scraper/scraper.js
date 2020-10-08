const puppeteer = require("puppeteer");

const process_show = async (show_url) => {
  await page.goto(show_url);
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://j-archive.com/listseasons.php");

  const get_links = async () =>
    await page.$$eval("#content > table > tbody > tr > td > a", (elts) =>
      elts.map((elt) => elt.href)
    );

  const season_links = (await get_links()).slice(0, -1);
  const episode_links = [];
  for (let season_link of season_links) {
    await page.goto(season_link);
    const links = await get_links();
    episode_links.push(...links);
  }

  const data = [];
  for (let episode of episode_links) {
    await page.goto(episode);
    const air_date = await page.$eval(
      "#game_title > h1",
      (elt) => elt.innerText.split(/, (.+)?/)[1]
    );
    data.push({ air_date: air_date });
  }
  console.log(data);
  await browser.close();
})();
