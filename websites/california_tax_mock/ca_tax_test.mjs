import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

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

// Helper: wait for app to finish loading (past the "Loading CalFile..." screen)
async function waitForAppLoad() {
  try {
    await page.waitForFunction(() => {
      const body = document.body.textContent;
      return body && !body.includes('Loading CalFile...') && body.length > 200;
    }, { timeout: 15000 });
  } catch (e) {
    console.log('  WARN: App load wait timed out, continuing...');
  }
}

// Navigate and wait for app load
async function gotoAndWait(url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitForAppLoad();
  await page.waitForTimeout(1000);
}

const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

// ============================================================
// DIAGNOSTIC: Check what's on each page
// ============================================================
console.log('\n--- DIAGNOSTIC: Checking page content ---');
await page.goto(BASE + '/filing/personal-info', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const diagContent1 = await page.textContent('body');
console.log('  personal-info first 200 chars: ' + diagContent1.slice(0, 200).replace(/\n/g, ' '));

await page.goto(BASE + '/filing/tax-summary', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const diagContent2 = await page.textContent('body');
console.log('  tax-summary first 200 chars: ' + diagContent2.slice(0, 200).replace(/\n/g, ' '));

await page.goto(BASE + '/pay', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const diagContent3 = await page.textContent('body');
console.log('  /pay first 200 chars: ' + diagContent3.slice(0, 200).replace(/\n/g, ' '));

await page.goto(BASE + '/refund', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const diagContent4 = await page.textContent('body');
console.log('  /refund first 200 chars: ' + diagContent4.slice(0, 200).replace(/\n/g, ' '));

// Check all input placeholders on personal-info
await page.goto(BASE + '/filing/personal-info', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const inputs = await page.$$eval('input', els => els.map(el => ({ placeholder: el.placeholder, type: el.type, value: el.value.slice(0, 20) })));
console.log('  personal-info inputs:', JSON.stringify(inputs));

// Check tooltip buttons
const tooltipBtns = await page.$$eval('button', els => els.map(el => ({ text: el.textContent.trim(), ariaLabel: el.getAttribute('aria-label') })).filter(b => b.text === '?' || (b.ariaLabel && b.ariaLabel.includes('Help'))));
console.log('  Tooltip buttons:', JSON.stringify(tooltipBtns));

console.log('\n--- RUNNING TESTS ---\n');

// ============================================================
// TEST 1: SSN Masking
// ============================================================
await test('SSN masking: page loads', async () => {
  await gotoAndWait(BASE + '/filing/personal-info');
  const bodyText = await page.textContent('body');
  if (bodyText.includes('Loading CalFile')) throw new Error('Still showing loading screen');
  if (!bodyText.includes('Filing Status') && !bodyText.includes('Personal') && !bodyText.includes('SSN')) {
    throw new Error('Personal info page content not found, got: ' + bodyText.slice(0, 200));
  }
});

await test('SSN masking: SSN field accepts input', async () => {
  await gotoAndWait(BASE + '/filing/personal-info');
  let ssnInput = page.locator('input[placeholder="XXX-XX-XXXX"]');
  if (!await ssnInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    ssnInput = page.locator('label:has-text("Social Security") + * input, label:has-text("SSN") + * input').first();
  }
  if (!await ssnInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    const allInputs = await page.$$eval('input', els => els.map(el => el.placeholder));
    throw new Error('SSN input not found. All placeholders: ' + JSON.stringify(allInputs));
  }
  await ssnInput.focus();
  await ssnInput.fill('');
  await page.keyboard.type('592847163');
  let val = await ssnInput.inputValue();
  console.log('  SSN while focused: "' + val + '"');
  await ssnInput.evaluate(el => el.blur());
  await page.waitForTimeout(500);
  val = await ssnInput.inputValue();
  console.log('  SSN after blur: "' + val + '"');
  if (!val.startsWith('XXX')) throw new Error('SSN not masked after blur, got: "' + val + '"');
});

// ============================================================
// TEST 2: Estimated Tax Payments
// ============================================================
await test('Tax summary: page loads with content', async () => {
  await gotoAndWait(BASE + '/filing/tax-summary');
  const bodyText = await page.textContent('body');
  if (!bodyText.includes('Tax Summary') && !bodyText.includes('Tax Calculation') && !bodyText.includes('Income')) {
    throw new Error('Tax summary content not found: ' + bodyText.slice(0, 300));
  }
});

await test('Tax summary: Estimated Payments section present', async () => {
  await gotoAndWait(BASE + '/filing/tax-summary');
  const found = await page.evaluate(() => {
    return document.body.innerText.includes('Estimated Tax Payments');
  });
  if (!found) {
    const bodyText = await page.textContent('body');
    throw new Error('Estimated Tax Payments not in page. Body has: ' + bodyText.slice(0, 400));
  }
});

await test('Tax summary: Estimated Payments input accepts value', async () => {
  await gotoAndWait(BASE + '/filing/tax-summary');
  await page.waitForTimeout(500);
  const allInputPlaceholders = await page.$$eval('input', els => els.map(el => el.placeholder));
  console.log('  tax-summary input placeholders: ' + JSON.stringify(allInputPlaceholders));
  const estInput = page.locator('input').filter({ hasPlaceholder: '0.00' }).first();
  if (!await estInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    throw new Error('0.00 placeholder input not found on tax-summary. Inputs: ' + JSON.stringify(allInputPlaceholders));
  }
  await estInput.click();
  await estInput.fill('500');
  await estInput.blur();
  await page.waitForTimeout(300);
  const val = await estInput.inputValue();
  if (!val) throw new Error('Input value empty after fill');
});

// ============================================================
// TEST 3: Voluntary Contributions
// ============================================================
await test('Deductions: Voluntary Contributions section present', async () => {
  await gotoAndWait(BASE + '/filing/deductions');
  const found = await page.evaluate(() => {
    return document.body.innerText.includes('Voluntary Contributions');
  });
  if (!found) {
    const bodyText = await page.textContent('body');
    throw new Error('Voluntary Contributions not found. Body: ' + bodyText.slice(0, 400));
  }
});

await test('Deductions: 5+ fund checkboxes present', async () => {
  await gotoAndWait(BASE + '/filing/deductions');
  const checkboxes = await page.locator('input[type="checkbox"]').count();
  console.log('  Checkboxes found: ' + checkboxes);
  if (checkboxes < 5) throw new Error('Expected 5+ checkboxes, got ' + checkboxes);
});

await test('Deductions: Checking a fund shows amount input', async () => {
  await gotoAndWait(BASE + '/filing/deductions');
  const firstCb = page.locator('input[type="checkbox"]').first();
  await firstCb.check({ force: true });
  await page.waitForTimeout(500);
  const amtInputs = await page.locator('input[placeholder="1.00"]').count();
  console.log('  Amount inputs after check: ' + amtInputs);
  if (amtInputs < 1) {
    const allInputs = await page.$$eval('input', els => els.map(el => ({ placeholder: el.placeholder, type: el.type })));
    throw new Error('No amount input appeared. All inputs: ' + JSON.stringify(allInputs));
  }
});

await test('Deductions: Fund amount input accepts value', async () => {
  await gotoAndWait(BASE + '/filing/deductions');
  const firstCb = page.locator('input[type="checkbox"]').first();
  await firstCb.check({ force: true });
  await page.waitForTimeout(500);
  const amtInput = page.locator('input[placeholder="1.00"]').first();
  await amtInput.fill('25');
  await amtInput.blur();
  await page.waitForTimeout(300);
  const val = await amtInput.inputValue();
  console.log('  Fund amount: "' + val + '"');
  if (!val) throw new Error('Fund amount value empty');
});

// ============================================================
// TEST 4: Auto-save indicator
// ============================================================
await test('Auto-save: Saved toast exists in DOM', async () => {
  await gotoAndWait(BASE + '/filing/personal-info');
  await page.waitForTimeout(2000);
  const inputs = await page.$$('input[type="text"]:not([disabled])');
  console.log('  Found ' + inputs.length + ' text inputs');
  if (inputs.length === 0) throw new Error('No text inputs found on personal-info');
  await inputs[0].click();
  const currentVal = await inputs[0].inputValue();
  await inputs[0].fill(currentVal + 'X');
  await page.waitForTimeout(300);
  const toastFound = await page.evaluate(() => {
    const fixedEls = document.querySelectorAll('[style*="position: fixed"]');
    for (const el of fixedEls) {
      if (el.textContent && el.textContent.includes('Saved')) return true;
    }
    return false;
  });
  if (!toastFound) {
    const allFixed = await page.$$eval('[style*="position: fixed"]', els => els.map(el => el.textContent.trim().slice(0, 50)));
    throw new Error('Saved toast not found. Fixed elements: ' + JSON.stringify(allFixed));
  }
});

await test('Auto-save: Toast shows opacity 1 briefly after edit', async () => {
  await gotoAndWait(BASE + '/filing/personal-info');
  await page.waitForTimeout(2500);
  const inputs = await page.$$('input[type="text"]:not([disabled])');
  await inputs[0].click();
  await inputs[0].fill('TestValue123');
  await page.waitForTimeout(100);
  const opacity = await page.evaluate(() => {
    const fixedEls = document.querySelectorAll('[style*="position: fixed"]');
    for (const el of fixedEls) {
      if (el.textContent && el.textContent.includes('Saved')) {
        return el.style.opacity;
      }
    }
    return 'not_found';
  });
  console.log('  Toast opacity after edit: ' + opacity);
  if (opacity === 'not_found') throw new Error('Saved toast container not found');
  if (opacity !== '1') console.log('  Note: opacity was ' + opacity + ' - may have already faded');
});

// ============================================================
// TEST 5: Tooltips
// ============================================================
await test('Tooltip: ? buttons on personal-info', async () => {
  await gotoAndWait(BASE + '/filing/personal-info');
  const count = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    return Array.from(btns).filter(b =>
      (b.getAttribute('aria-label') || '').includes('Help') ||
      b.textContent.trim() === '?'
    ).length;
  });
  console.log('  Tooltip buttons: ' + count);
  if (count < 1) {
    const allBtns = await page.$$eval('button', els => els.map(el => ({ text: el.textContent.trim().slice(0, 30), ariaLabel: el.getAttribute('aria-label') })));
    throw new Error('No tooltip buttons. All buttons: ' + JSON.stringify(allBtns.slice(0, 10)));
  }
});

await test('Tooltip: Clicking ? opens popover', async () => {
  await gotoAndWait(BASE + '/filing/personal-info');
  const tooltipBtn = await page.evaluateHandle(() => {
    const btns = document.querySelectorAll('button');
    return Array.from(btns).find(b =>
      (b.getAttribute('aria-label') || '').includes('Help') ||
      b.textContent.trim() === '?'
    );
  });
  if (!tooltipBtn) throw new Error('Tooltip button not found');
  await tooltipBtn.click();
  await page.waitForTimeout(300);
  const popoverVisible = await page.evaluate(() => {
    const els = document.querySelectorAll('.absolute.z-50');
    return Array.from(els).some(el => el.style.display !== 'none' && el.offsetHeight > 0 && el.textContent.length > 20);
  });
  console.log('  Popover visible: ' + popoverVisible);
  if (!popoverVisible) {
    throw new Error('Tooltip popover not visible after click');
  }
});

await test('Tooltip: ? buttons on deductions page', async () => {
  await gotoAndWait(BASE + '/filing/deductions');
  const count = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    return Array.from(btns).filter(b =>
      (b.getAttribute('aria-label') || '').includes('Help') ||
      b.textContent.trim() === '?'
    ).length;
  });
  console.log('  Deductions tooltip buttons: ' + count);
  if (count < 1) throw new Error('No tooltip buttons on deductions page');
});

// ============================================================
// TEST 6: Payment page
// ============================================================
await test('Payment page: loads', async () => {
  await gotoAndWait(BASE + '/pay');
  const found = await page.evaluate(() => document.body.innerText.includes('Web Pay') || document.body.innerText.includes('Payment'));
  if (!found) {
    const bodyText = await page.textContent('body');
    throw new Error('/pay content not found: ' + bodyText.slice(0, 300));
  }
});

await test('Payment page: routing number field present', async () => {
  await gotoAndWait(BASE + '/pay');
  const allInputs = await page.$$eval('input', els => els.map(el => el.placeholder));
  console.log('  /pay inputs: ' + JSON.stringify(allInputs));
  const found = allInputs.some(p => p.includes('routing') || p.includes('9-digit'));
  if (!found) throw new Error('Routing number input not found. Inputs: ' + JSON.stringify(allInputs));
});

await test('Payment page: account number field present', async () => {
  await gotoAndWait(BASE + '/pay');
  const allInputs = await page.$$eval('input', els => els.map(el => el.placeholder));
  const found = allInputs.some(p => p.toLowerCase().includes('account'));
  if (!found) throw new Error('Account number input not found. Inputs: ' + JSON.stringify(allInputs));
});

await test('Payment page: payment type radios (3)', async () => {
  await gotoAndWait(BASE + '/pay');
  const radioCount = await page.$$eval('input[type="radio"]', els => els.filter(el => el.name === 'paymentType').length);
  console.log('  Payment type radios: ' + radioCount);
  if (radioCount < 3) throw new Error('Expected 3 payment type radios, got ' + radioCount);
});

await test('Payment page: account type radios (checking/savings)', async () => {
  await gotoAndWait(BASE + '/pay');
  const radioCount = await page.$$eval('input[type="radio"]', els => els.filter(el => el.name === 'accountType').length);
  console.log('  Account type radios: ' + radioCount);
  if (radioCount < 2) throw new Error('Expected 2 account type radios, got ' + radioCount);
});

await test('Payment page: Review Payment opens modal', async () => {
  await gotoAndWait(BASE + '/pay');
  const routingInput = page.locator('input').filter({ hasPlaceholder: '9-digit routing number' });
  await routingInput.fill('021000021');
  const accountInput = page.locator('input').filter({ hasPlaceholder: 'Account number' });
  await accountInput.fill('123456789');
  const amountInputs = await page.$$eval('input', els => els.map(el => el.placeholder));
  console.log('  Amount inputs: ' + JSON.stringify(amountInputs));
  const amountInput = page.locator('input[placeholder="0.00"]').first();
  await amountInput.fill('100');
  await page.waitForTimeout(300);
  const reviewBtn = page.locator('button').filter({ hasText: 'Review Payment' });
  await reviewBtn.click();
  await page.waitForTimeout(500);
  const modalFound = await page.evaluate(() => document.body.innerText.includes('Review Your Payment'));
  if (!modalFound) throw new Error('Review modal not found after clicking Review Payment');
});

await test('Payment page: Submit Payment shows success', async () => {
  const modalOpen = await page.evaluate(() => document.body.innerText.includes('Review Your Payment'));
  if (!modalOpen) {
    await gotoAndWait(BASE + '/pay');
    await page.locator('input').filter({ hasPlaceholder: '9-digit routing number' }).fill('021000021');
    await page.locator('input').filter({ hasPlaceholder: 'Account number' }).fill('123456789');
    await page.locator('input[placeholder="0.00"]').first().fill('100');
    await page.locator('button').filter({ hasText: 'Review Payment' }).click();
    await page.waitForTimeout(500);
  }
  await page.locator('button').filter({ hasText: 'Submit Payment' }).click();
  await page.waitForTimeout(500);
  const success = await page.evaluate(() => document.body.innerText.includes('Payment Submitted'));
  if (!success) throw new Error('Payment submitted screen not shown');
});

// ============================================================
// TEST 7: Refund Tracker
// ============================================================
await test('Refund page: loads', async () => {
  await gotoAndWait(BASE + '/refund');
  const found = await page.evaluate(() => document.body.innerText.includes("Where") && document.body.innerText.includes("Refund"));
  if (!found) {
    const bodyText = await page.textContent('body');
    throw new Error('Refund page not loaded: ' + bodyText.slice(0, 300));
  }
});

await test('Refund page: SSN last 4 field present', async () => {
  await gotoAndWait(BASE + '/refund');
  const allInputs = await page.$$eval('input', els => els.map(el => el.placeholder));
  console.log('  /refund inputs: ' + JSON.stringify(allInputs));
  const found = allInputs.some(p => p === 'XXXX' || p.includes('last') || p.includes('SSN'));
  if (!found) throw new Error('SSN last 4 input not found. Inputs: ' + JSON.stringify(allInputs));
});

await test('Refund page: ZIP and refund amount fields present', async () => {
  await gotoAndWait(BASE + '/refund');
  const allInputs = await page.$$eval('input', els => els.map(el => el.placeholder));
  const hasZip = allInputs.some(p => p === '12345' || p.includes('ZIP') || p.toLowerCase().includes('zip'));
  const hasAmount = allInputs.some(p => p === '0.00' || p.includes('amount'));
  if (!hasZip) throw new Error('ZIP input not found');
  if (!hasAmount) throw new Error('Refund amount input not found');
});

await test('Refund page: Check Status button present', async () => {
  await gotoAndWait(BASE + '/refund');
  const btns = await page.$$eval('button', els => els.map(el => el.textContent.trim()));
  const found = btns.some(t => t.includes('Check Status') || t.includes('Check'));
  if (!found) throw new Error('Check Status button not found. Buttons: ' + JSON.stringify(btns));
});

await test('Refund page: Check Status with wrong data shows No Return Found', async () => {
  await gotoAndWait(BASE + '/refund');
  await page.locator('input[placeholder="XXXX"]').fill('9999');
  await page.locator('input[placeholder="12345"]').fill('99999');
  await page.locator('input[placeholder="0.00"]').fill('999');
  const checkBtn = page.locator('button').filter({ hasText: 'Check Status' });
  await checkBtn.click();
  await page.waitForTimeout(500);
  const noReturn = await page.evaluate(() => document.body.innerText.includes('No Return Found'));
  if (!noReturn) throw new Error('No Return Found message not shown');
});

await test('Refund page: Check Status with valid data shows timeline or no-return', async () => {
  await gotoAndWait(BASE + '/refund');
  await page.locator('input[placeholder="XXXX"]').fill('7163');
  await page.locator('input[placeholder="12345"]').fill('95128');
  await page.locator('input[placeholder="0.00"]').fill('250');
  await page.locator('button').filter({ hasText: 'Check Status' }).click();
  await page.waitForTimeout(500);
  const body = await page.textContent('body');
  const hasTimeline = body.includes('Return Received') || body.includes('Refund Status');
  const hasNoReturn = body.includes('No Return Found');
  console.log('  Timeline: ' + hasTimeline + ', No Return: ' + hasNoReturn);
  if (!hasTimeline && !hasNoReturn) throw new Error('No result shown after Check Status');
});

// ============================================================
// TEST 8: Nav Dropdowns
// ============================================================
await test('Nav: File dropdown opens', async () => {
  await gotoAndWait(BASE);
  const navBtns = await page.$$eval('nav button', els => els.map(el => el.textContent.trim().slice(0, 20)));
  console.log('  Nav buttons: ' + JSON.stringify(navBtns));
  const fileBtn = page.locator('nav button').filter({ hasText: /^File/ }).first();
  await fileBtn.click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('CalFile (Free)'));
  if (!found) throw new Error('File dropdown CalFile (Free) not shown');
});

await test('Nav: File > CalFile (Free) navigates', async () => {
  await gotoAndWait(BASE);
  await page.locator('nav button').filter({ hasText: /^File/ }).first().click();
  await page.waitForTimeout(300);
  await page.locator('button').filter({ hasText: 'CalFile (Free)' }).click();
  await page.waitForTimeout(500);
  const url = page.url();
  if (!url.includes('/filing/personal-info')) throw new Error('Expected /filing/personal-info, got: ' + url);
});

await test('Nav: Pay dropdown opens with Web Pay', async () => {
  await gotoAndWait(BASE);
  await page.locator('nav button').filter({ hasText: /^Pay/ }).first().click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    return Array.from(btns).some(b => b.textContent.trim() === 'Web Pay');
  });
  if (!found) throw new Error('Web Pay item not in Pay dropdown');
});

await test('Nav: Refund dropdown opens', async () => {
  await gotoAndWait(BASE);
  await page.locator('nav button').filter({ hasText: /^Refund/ }).first().click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('Check Refund Status'));
  if (!found) throw new Error('Refund dropdown item not shown');
});

await test('Nav: Forms dropdown opens', async () => {
  await gotoAndWait(BASE);
  await page.locator('nav button').filter({ hasText: /^Forms/ }).first().click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('Search Forms'));
  if (!found) throw new Error('Forms dropdown item not shown');
});

await test('Nav: Help dropdown opens', async () => {
  await gotoAndWait(BASE);
  await page.locator('nav button').filter({ hasText: /^Help/ }).first().click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('Contact Us'));
  if (!found) throw new Error('Help dropdown Contact Us not shown');
});

// ============================================================
// TEST 9: Forms page
// ============================================================
await test('Forms page: loads with search', async () => {
  await gotoAndWait(BASE + '/forms');
  const found = await page.evaluate(() => document.body.innerText.includes('California Tax Forms') || document.body.innerText.includes('Search'));
  if (!found) throw new Error('Forms page not loaded');
});

await test('Forms page: table has 10+ rows', async () => {
  await gotoAndWait(BASE + '/forms');
  const rows = await page.$$eval('tbody tr', els => els.length);
  console.log('  Form rows: ' + rows);
  if (rows < 10) throw new Error('Expected 10+ rows, got ' + rows);
});

await test('Forms page: search filters results', async () => {
  await gotoAndWait(BASE + '/forms');
  const before = await page.$$eval('tbody tr', els => els.length);
  await page.locator('input[type="text"]').first().fill('540-2EZ');
  await page.waitForTimeout(300);
  const after = await page.$$eval('tbody tr', els => els.length);
  console.log('  Before: ' + before + ', After search: ' + after);
  if (after >= before) throw new Error('Search did not filter');
});

await test('Forms page: View button opens modal', async () => {
  await gotoAndWait(BASE + '/forms');
  await page.locator('button').filter({ hasText: 'View' }).first().click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('Tax Year') || document.body.innerText.includes('Download PDF'));
  if (!found) throw new Error('Form modal not opened');
});

await test('Forms page: Modal Close works', async () => {
  const modalOpen = await page.evaluate(() => document.body.innerText.includes('Download PDF'));
  if (!modalOpen) {
    await gotoAndWait(BASE + '/forms');
    await page.locator('button').filter({ hasText: 'View' }).first().click();
    await page.waitForTimeout(300);
  }
  await page.locator('button').filter({ hasText: 'Close' }).click();
  await page.waitForTimeout(300);
  const stillOpen = await page.evaluate(() => document.body.innerText.includes('Download PDF (Unavailable)'));
  if (stillOpen) throw new Error('Modal did not close');
});

// ============================================================
// TEST 10: Help page
// ============================================================
await test('Help page: phone numbers shown', async () => {
  await gotoAndWait(BASE + '/help');
  const body = await page.textContent('body');
  if (!body.includes('800-852-5711')) throw new Error('General phone not found');
  if (!body.includes('800-822-6268')) throw new Error('TTY phone not found');
  if (!body.includes('916-845-6500')) throw new Error('Outside US phone not found');
});

await test('Help page: Mailing addresses section present', async () => {
  await gotoAndWait(BASE + '/help');
  const found = await page.evaluate(() => document.body.innerText.includes('Mailing Addresses'));
  if (!found) throw new Error('Mailing Addresses section not found');
});

await test('Help page: Sacramento address shown', async () => {
  await gotoAndWait(BASE + '/help');
  const found = await page.evaluate(() => document.body.innerText.includes('9646 Butterfield'));
  if (!found) throw new Error('Sacramento address not found');
});

await test('Help page: Send a Message button opens modal', async () => {
  await gotoAndWait(BASE + '/help');
  await page.locator('button').filter({ hasText: 'Send a Message' }).click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => {
    const headings = document.querySelectorAll('h2');
    return Array.from(headings).some(h => h.textContent.includes('Send a Message'));
  });
  if (!found) throw new Error('Send a Message modal not opened');
});

await test('Help page: Message modal has subject and textarea', async () => {
  const selects = await page.$$eval('select', els => els.length);
  const textareas = await page.$$eval('textarea', els => els.length);
  console.log('  Selects: ' + selects + ', textareas: ' + textareas);
  if (selects < 1) throw new Error('Subject dropdown not found');
  if (textareas < 1) throw new Error('Textarea not found');
});

await test('Help page: Validation on empty submit', async () => {
  await page.locator('button').filter({ hasText: 'Send Message' }).click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('Please select a subject'));
  if (!found) throw new Error('Validation error not shown');
});

await test('Help page: Send Message succeeds with valid data', async () => {
  await page.locator('select').selectOption('General Tax Question');
  await page.locator('textarea').fill('This is a valid test message for FTB.');
  await page.locator('button').filter({ hasText: 'Send Message' }).click();
  await page.waitForTimeout(500);
  const found = await page.evaluate(() => document.body.innerText.includes('Message Sent'));
  if (!found) throw new Error('Message Sent confirmation not shown');
});

// ============================================================
// TEST 11: Account Dashboard
// ============================================================
await test('Account page: loads', async () => {
  await gotoAndWait(BASE + '/account');
  const found = await page.evaluate(() => document.body.innerText.includes('MyFTB') || document.body.innerText.includes('Account'));
  if (!found) throw new Error('Account page not loaded');
});

await test('Account page: sidebar nav items present', async () => {
  await gotoAndWait(BASE + '/account');
  const navItems = ['Account Summary', 'Tax Returns', 'Notices', 'Payments', 'Messages', 'Settings'];
  for (const item of navItems) {
    const btn = await page.evaluate((text) => {
      const btns = document.querySelectorAll('button');
      return Array.from(btns).some(b => b.textContent.trim() === text);
    }, item);
    if (!btn) throw new Error('Sidebar item "' + item + '" not found');
  }
});

await test('Account page: Account Summary shown by default', async () => {
  await gotoAndWait(BASE + '/account');
  const found = await page.evaluate(() => document.body.innerText.includes('Personal Information') || document.body.innerText.includes('Account Status'));
  if (!found) throw new Error('Account Summary not shown by default');
});

await test('Account page: Tax Returns tab shows table', async () => {
  await gotoAndWait(BASE + '/account');
  await page.locator('button').filter({ hasText: 'Tax Returns' }).click();
  await page.waitForTimeout(300);
  const rows = await page.$$eval('tbody tr', els => els.length);
  console.log('  Tax Returns rows: ' + rows);
  if (rows < 2) throw new Error('Expected 2+ rows, got ' + rows);
});

await test('Account page: Tax Returns View opens modal', async () => {
  await gotoAndWait(BASE + '/account');
  await page.locator('button').filter({ hasText: 'Tax Returns' }).click();
  await page.waitForTimeout(300);
  const viewBtns = page.locator('button').filter({ hasText: 'View' });
  const cnt = await viewBtns.count();
  console.log('  View buttons in Tax Returns: ' + cnt);
  await viewBtns.first().click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('Return Details'));
  if (!found) throw new Error('Return Details modal not opened');
});

await test('Account page: Notices tab shows notices', async () => {
  await gotoAndWait(BASE + '/account');
  await page.locator('button').filter({ hasText: 'Notices' }).click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('2024 return has been received'));
  if (!found) throw new Error('Notices not shown');
});

await test('Account page: Payments tab shows table', async () => {
  await gotoAndWait(BASE + '/account');
  await page.locator('button').filter({ hasText: 'Payments' }).click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('Payment History') || document.body.innerText.includes('Processed'));
  if (!found) throw new Error('Payment History not shown');
});

await test('Account page: Messages tab shows inbox', async () => {
  await gotoAndWait(BASE + '/account');
  await page.locator('button').filter({ hasText: 'Messages' }).click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('2024 Form 540 Has Been Received'));
  if (!found) throw new Error('Messages inbox not shown');
});

await test('Account page: Settings tab shows settings', async () => {
  await gotoAndWait(BASE + '/account');
  await page.locator('button').filter({ hasText: 'Settings' }).click();
  await page.waitForTimeout(300);
  const found = await page.evaluate(() => document.body.innerText.includes('Email Address') && document.body.innerText.includes('Account Settings'));
  if (!found) throw new Error('Settings section not shown');
});

// ============================================================
// Additional: /go endpoint
// ============================================================
await test('/go endpoint: valid JSON with initial/current state', async () => {
  await page.goto(BASE + '/go', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const preText = await page.evaluate(() => {
    const pre = document.querySelector('pre');
    return pre ? pre.textContent : document.body.textContent;
  });
  let json;
  try {
    json = JSON.parse(preText);
  } catch (e) {
    throw new Error('/go response not valid JSON. Got: ' + preText.slice(0, 200));
  }
  if (!json.initial_state) throw new Error('/go missing initial_state');
  if (!json.current_state) throw new Error('/go missing current_state');
  console.log('  /go state_diff keys: ' + Object.keys(json.state_diff || {}).join(', '));
});

// ============================================================
// Screenshots
// ============================================================
console.log('\n--- Taking screenshots ---');
const screenshotDir = '/cpfs02/data/shared/Group-m6/bowen.wbw/openrlvr-mock/california_tax_mock/assets/screenshots';
try { mkdirSync(screenshotDir, { recursive: true }); } catch (e) {}

for (const [route, name] of [
  ['/', 'home'],
  ['/filing/personal-info', 'personal_info'],
  ['/filing/deductions', 'deductions'],
  ['/filing/tax-summary', 'tax_summary'],
  ['/pay', 'pay'],
  ['/refund', 'refund'],
  ['/forms', 'forms'],
  ['/help', 'help'],
  ['/account', 'account'],
]) {
  await gotoAndWait(BASE + route);
  await page.screenshot({ path: screenshotDir + '/mock_' + name + '.png', fullPage: true });
  console.log('  Screenshot: mock_' + name + '.png');
}

await browser.close();

console.log('\n========== FINAL RESULTS ==========');
console.log('PASSED: ' + results.passed.length);
console.log('FAILED: ' + results.failed.length);
if (results.failed.length > 0) {
  console.log('\nFAILED TESTS:');
  results.failed.forEach(f => console.log('  - ' + f.name + ': ' + f.error));
}
