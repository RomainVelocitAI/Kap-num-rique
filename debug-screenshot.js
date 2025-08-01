const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to the page
  await page.goto('http://localhost:3000');
  
  // Wait for content to load
  await page.waitForTimeout(3000);
  
  // Take a full page screenshot
  await page.screenshot({ path: 'full-page-screenshot.png', fullPage: true });
  console.log('Full page screenshot saved as full-page-screenshot.png');
  
  // Scroll to the premium section
  const premiumSection = await page.$('.features-grid');
  if (premiumSection) {
    await premiumSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'premium-section-screenshot.png' });
    console.log('Premium section screenshot saved as premium-section-screenshot.png');
    
    // Get the position and visibility of the element
    const boundingBox = await premiumSection.boundingBox();
    console.log('Premium section bounding box:', boundingBox);
    
    const isVisible = await premiumSection.isVisible();
    console.log('Premium section is visible:', isVisible);
  } else {
    console.log('Premium section not found!');
  }
  
  await browser.close();
})();