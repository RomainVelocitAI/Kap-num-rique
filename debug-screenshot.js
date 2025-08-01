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
  
  // Scroll to the difference section
  const diffSection = await page.$('text=LA DIFFÉRENCE DIGIQO');
  if (diffSection) {
    await diffSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Take a screenshot of the whole section
    const sectionElement = await diffSection.evaluateHandle(el => {
      // Find the parent section containing all the cards
      let parent = el;
      while (parent && !parent.classList.contains('py-24')) {
        parent = parent.parentElement;
      }
      return parent || el;
    });
    
    await page.screenshot({ path: 'difference-section-screenshot.png' });
    console.log('Difference section screenshot saved as difference-section-screenshot.png');
    
    // Get the position and visibility of the element
    const boundingBox = await sectionElement.boundingBox();
    console.log('Difference section bounding box:', boundingBox);
    
    const isVisible = await sectionElement.isVisible();
    console.log('Difference section is visible:', isVisible);
  } else {
    console.log('Difference section not found!');
  }
  
  await browser.close();
})();