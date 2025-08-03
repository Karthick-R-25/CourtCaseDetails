
  const puppeteer = require('puppeteer');

async function fetchCaseData({ caseType, caseNumber, filingYear }) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Step 1: Navigate to initial page and submit case details
    await page.goto('https://dhcmisc.nic.in/pcase/guiCaseWise.php', {
      waitUntil: 'networkidle2',
    });

    await page.select("#ctype", caseType);
    await page.type('input[name="regno"]', caseNumber);
    await page.type('#regyr', filingYear);

    // Handle CAPTCHA
    const captchaText = await page.$eval('#cap', el => el.innerText.trim());
    await page.type('input[name="captcha_code"]', captchaText);

    // Submit form
    await Promise.all([
      page.click('input[name="Submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    // Step 2: Click "Listing Details" and wait for content to load
    await Promise.all([
      page.click('input[name="listing"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    // Step 3: Extract all case data
    const caseData = await page.evaluate(() => {
      // Helper function to get text by label
      const getText = (label) => {
        const cell = Array.from(document.querySelectorAll('td')).find(td =>
          td.textContent.trim().includes(label)
        );
        return cell?.nextElementSibling?.textContent.trim() || '';
      };

      // Extract petitioner and respondent
      const extractParties = () => {
        const partyElements = Array.from(document.querySelectorAll('td[align="center"] b'));
        if (partyElements.length < 2) return { petitioner: '', respondent: '' };

        const petitioner = partyElements[1].textContent.split('Vs.')[0].trim();
        const respondent = partyElements[2].textContent.trim();

        return { petitioner, respondent };
      };

      // Extract detailed listing information
      const extractListingDetails = () => {
        const tables = Array.from(document.querySelectorAll('table[width="60%"]'));
        const listingTable = tables.find(table => {
          const headers = Array.from(table.querySelectorAll('td'))
            .map(td => td.textContent.trim());
          return headers.includes('Details of listing');
        });

        if (!listingTable) return [];

        const rows = Array.from(listingTable.querySelectorAll('tr')).slice(1);
        
        return rows.map(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length < 3) return null;
          
          const serialNo = cells[0].textContent.trim();
          const dateLink = cells[1].querySelector('a');
          const date = dateLink ? dateLink.textContent.trim() : cells[1].textContent.trim();
          const pdfUrl = dateLink ? dateLink.href : null;
          const details = cells[2].textContent.trim();

          // Extract court number and status
          const courtMatch = details.match(/COURT NO\.(\d+)/i);
          const statusMatch = details.match(/(TO BE LISTED|LISTED IN)/i);

          return {
            serial_no: serialNo,
            date: date,
            pdf_url: pdfUrl,
            listing_details: details,
            court_number: courtMatch ? courtMatch[1] : null,
            status: statusMatch ? statusMatch[0] : null,
            is_listed: details.includes('LISTED IN'),
            is_to_be_listed: details.includes('TO BE LISTED')
          };
        }).filter(Boolean);
      };

      const { petitioner, respondent } = extractParties();
      const listingDetails = extractListingDetails();

      return {
        case_no: getText('Case No :'),
        cnr_no: getText('CNR No. :'),
        date_of_filing: getText('Date of Filing :'),
        date_of_registration: getText('Date of Registration :'),
        status: getText('Status :'),
        petitioner,
        respondent,
        filing_advocate: getText('Filing Advocate :'),
        dealing_assistant: getText('Dealing Assistant :'),
        listing_details: listingDetails
      };
    });

    await browser.close();
    return caseData;

  } catch (error) {
    await browser.close();
    console.error('Scraping failed:', error.message);
    throw new Error('Failed to fetch case data');
  }
}

module.exports = fetchCaseData;