const puppeteer = require("puppeteer");

const url = "https://djinni.co/jobs/";

async function start() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const result = await page.evaluate(() => {
    const vacancies = [];

    document.querySelectorAll(".list-jobs__item").forEach((item) => {
      const titleElement = item.querySelector(
        ".job-list-item__title .job-list-item__link"
      );
      const salaryElement = item.querySelector(".public-salary-item");
      const experienceElement = item.querySelector(".job-list-item__job-info");

      const title = titleElement ? titleElement.innerText.trim() : "No title";
      const salary = salaryElement
        ? salaryElement.innerText.trim()
        : "No salary";
      let experience = "No experience";

      if (experienceElement) {
        const experienceMatch =
          experienceElement.innerText.match(/(\d+)\s+рок/i);
        if (experienceMatch) {
          const years = parseInt(experienceMatch[1], 10);
          experience =
            years === 1
              ? "1 рік"
              : years <= 4
              ? `${years} роки`
              : `${years} років`;
        }
      }

      vacancies.push({ title, salary, experience });
    });

    return vacancies;
  });

  console.log(result);

  await browser.close();
}

start();
