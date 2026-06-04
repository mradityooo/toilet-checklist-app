import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

import dailyReportTemplate from "../templates/dailyReportTemplate.js";

const generateDailyReport = async ({
  location,
  date,
  morningInspector,
  eveningInspector,
  morningChecks,
  eveningChecks,
  completion,
}) => {

  // HTML TEMPLATE
  const html = dailyReportTemplate({
    location,
    date,
    morningInspector,
    eveningInspector,
    morningChecks,
    eveningChecks,
    completion,
  });

  // OUTPUT PATH
  const reportsDir = path.join(
  process.cwd(),
  "reports"
  );

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const outputPath = path.join(
    process.cwd(),
    "reports",
    `daily-report-${Date.now()}.png`
  );

  // PUPPETEER
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  // SET HTML
  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  // VIEWPORT
  await page.setViewport({
    width: 1000,
    height: 1400,
    deviceScaleFactor: 2,
  });

  // SCREENSHOT
  await page.screenshot({
    path: outputPath,
    fullPage: true,
  });

  await browser.close();

  return outputPath;
};

export default generateDailyReport;