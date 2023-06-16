const puppeteer = require('puppeteer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
    .option('baseUrl', {
        alias: 'b',
        type: 'string',
        description: 'Set the base URL to crawl',
        demandOption: true,
    })
    .option('csvPath', {
        alias: 'c',
        type: 'string',
        description: 'Set the output CSV file path',
        default: 'output.csv',
    })
    .option('rateLimit', {
        alias: 'r',
        type: 'number',
        description: 'Set the rate limit (in milliseconds)',
        default: 1000,  // 1 second by default
    })
    .argv;

// Set to keep track of visited URLs
const visitedUrls = new Set();

async function checkPage(page, csvWriter, baseUrl, url, rateLimit) {
    if (visitedUrls.has(url)) {
        return;  // skip if URL has already been visited
    }

    visitedUrls.add(url);  // mark URL as visited

    const response = await page.goto(url);

    // Write to CSV
    await csvWriter.writeRecords([{ url: url, status: response.status() }]);

    // Extract other links to visit
    const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), a => a.href));

    // Visit each link
    for (const link of links) {
        if (link.startsWith(baseUrl)) {
            // Delay before the next request
            await new Promise(resolve => setTimeout(resolve, rateLimit));
            await checkPage(page, csvWriter, baseUrl, link, rateLimit);
        }
    }
}

const run = async (baseUrl, csvPath, rateLimit) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const csvWriter = createCsvWriter({
        path: csvPath,
        header: [
            {id: 'url', title: 'URL'},
            {id: 'status', title: 'STATUS'},
        ],
    });

    await checkPage(page, csvWriter, baseUrl, baseUrl, rateLimit);

    await browser.close();
};

// Take the base URL from the command line arguments
const baseUrl = argv.baseUrl;
const csvPath = argv.csvPath;
const rateLimit = argv.rateLimit;

run(baseUrl, csvPath, rateLimit);
