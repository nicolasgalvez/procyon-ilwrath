# Puppeteer Site Crawler

This is a Node.js script that uses Puppeteer to crawl a website and record the status codes of each visited URL. The results are saved to a CSV file.

## Installation

1. Ensure you have Node.js installed on your system. This script was tested with Node.js v14.x but should work on other recent versions as well.
2. Clone this repository:
    ```
    git clone https://github.com/<your-username>/<your-repository-name>.git
    cd <your-repository-name>
    ```
3. Install dependencies:

    ```
    npm install
    ```

## Usage

The script can be run using the following command:

```
node index.js --baseUrl <base-url> [--csvPath <output-csv-path>] [--rateLimit <rate-limit-ms>]
```

Options:
- `baseUrl` (required): The base URL to start crawling from. 
- `csvPath` (optional): The path to the output CSV file. Default is `output.csv`.
- `rateLimit` (optional): The delay between each request in milliseconds. Default is 1000 (1 second).

For example, to crawl the site at `http://example.com`, write the output to `output.csv`, and delay 2000 milliseconds (2 seconds) between each request, you could use:

```
node index.js --baseUrl http://example.com --csvPath output.csv --rateLimit 2000
```

## Notes

This script uses Puppeteer for web scraping and therefore can be resource-intensive. Be sure to use the `rateLimit` option to avoid making requests too quickly.

Always respect the website's `robots.txt` rules and terms of service when web scraping. If in doubt, contact the site owners for permission.
