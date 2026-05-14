import { chromium } from 'playwright';

const BASE = 'http://localhost:5180';
const results = { passed: [], failed: [] };

async function test(name, fn) {
  try {
    await fn();
    results.passed.push(name);
    console.log('PASS: ' + name);
  } catch (e) {
    results.failed.push({ name, error: e.message });
    console.error('FAIL: ' + name + ' -> ' + e.message);
  }
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

async function waitForAppLoad() {
  try {
    await page.waitForFunction(() => {
      const body = document.body.textContent;
      return body && !body.includes('Loading CalFile...') && body.length > 200;
    }, { timeout: 15000 });
  } catch (e) {}
}

async function gotoAndWait(url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitForAppLoad();
  await page.waitForTimeout(1000);
}

// TEST: Account Summary default view
await test('Account page: Account Summary default view diagnostic', async () => {
  await gotoAndWait(BASE + '/account');
  const bodyText = await page.textContent('body');
  console.log('  Account body first 400: ' + bodyText.slice(0, 400).replace(/\n/g, ' '));
  // Check what it actually shows
  const hasPersInfo = bodyText.includes('Personal Information');
  const hasAcctStatus = bodyText.includes('Account Status');
  const hasName = bodyText.includes('Maria') || bodyText.includes('Santos');
  console.log('  Has Personal Information: ' + hasPersInfo);
  console.log('  Has Account Status: ' + hasAcctStatus);
  console.log('  Has Name: ' + hasName);
  if (!hasPersInfo && !hasAcctStatus && !hasName) {
    throw new Error('Account Summary content not as expected. Body: ' + bodyText.slice(0, 500));
  }
});

// TEST: Payment page - fix strict mode locator issues
await test('Payment page: Review Payment modal', async () => {
  await gotoAndWait(BASE + '/pay');
  // Use specific locators
  await page.locator('input[placeholder="9-digit routing number"]').fill('021000021');
  await page.locator('input[placeholder="Account number"]').fill('123456789');
  await page.locator('input[placeholder="0.00"]').fill('100');
  await page.waitForTimeout(300);
  const reviewBtn = page.locator('button').filter({ hasText: 'Review Payment' });
  await reviewBtn.click();
  await page.waitForTimeout(500);
  const found = await page.evaluate(() => document.body.innerText.includes('Review Your Payment'));
  console.log('  Review modal found: ' + found);
  if (!found) {
    const bodyText = await page.textContent('body');
    throw new Error('Review modal not found. Page: ' + bodyText.slice(0, 400));
  }
});

await test('Payment page: Submit Payment success screen', async () => {
  // Modal should be open from prev test
  const modalOpen = await page.evaluate(() => document.body.innerText.includes('Review Your Payment'));
  if (!modalOpen) {
    await gotoAndWait(BASE + '/pay');
    await page.locator('input[placeholder="9-digit routing number"]').fill('021000021');
    await page.locator('input[placeholder="Account number"]').fill('123456789');
    await page.locator('input[placeholder="0.00"]').fill('100');
    await page.locator('button').filter({ hasText: 'Review Payment' }).click();
    await page.waitForTimeout(500);
  }
  await page.locator('button').filter({ hasText: 'Submit Payment' }).click();
  await page.waitForTimeout(500);
  const found = await page.evaluate(() => document.body.innerText.includes('Payment Submitted'));
  console.log('  Payment submitted: ' + found);
  if (!found) throw new Error('Payment submitted success not shown');
});

await browser.close();

console.log('\n========== TARGETED RESULTS ==========');
console.log('PASSED: ' + results.passed.length);
console.log('FAILED: ' + results.failed.length);
results.failed.forEach(f => console.log('  FAIL: ' + f.name + ': ' + f.error));
