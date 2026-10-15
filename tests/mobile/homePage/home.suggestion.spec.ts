import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/homePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Home Page - Suggestion Section', () => {
    let homePage: HomePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();
        await homePage.getPunproSuggestionContainer().scrollIntoViewIfNeeded();
    });

    test('Home_mobile_069: ตรวจสอบการแสดงองค์ประกอบของ Section "ปันโปรแนะนำ" ในหน้า "Home"', async ({ page }) => {
        // มีแท็บครบ 4 แท็บ
        await expect(homePage.punproAllTab).toBeVisible();
        await expect(homePage.punproShopperTab).toBeVisible();
        await expect(homePage.punproPormotionTab).toBeVisible();
        await expect(homePage.punproArticleTab).toBeVisible();

        // แสดงการ์ดตามแท็บที่เลือก (แท็บเริ่มต้น "ทั้งหมด") สูงสุด 10 การ์ด
        const cardCount = await homePage.punproCardItem.count();
        expect(cardCount).toBeLessThanOrEqual(10);
        expect(cardCount).toBeGreaterThan(0);
    });

    // ---------- Tab Switching (data-driven) ----------
    const tabCases = [
        { testId: 'Home_mobile_070', label: 'รับหิ้ว', clickTab: (h: HomePage) => h.clickPunproShopperTab() },
        { testId: 'Home_mobile_071', label: 'โปรแนะนำ', clickTab: (h: HomePage) => h.clickPunproPromotionTab() },
        { testId: 'Home_mobile_072', label: 'บทความน่าสนใจ', clickTab: (h: HomePage) => h.clickPunproArticleTab() },
    ];

    for (const { testId, label, clickTab } of tabCases) {
        test(`${testId}: ตรวจสอบการแสดงการ์ดเมื่อสลับไปยังแท็บ "${label}"`, async ({ page }) => {
            await clickTab(homePage);
            await page.waitForTimeout(1000);
            const cardCount = await homePage.punproCardItem.count();
            expect(cardCount).toBeGreaterThan(0);
            expect(cardCount).toBeLessThanOrEqual(10);
        });
    }

    test('Home_mobile_073: ตรวจสอบองค์ประกอบของการ์ดประเภท "รับหิ้ว" ว่าแสดงครบถ้วน', async () => {
        await homePage.clickPunproShopperTab();
        const card = homePage.getSuggestCard('shopper');
        await expect(card).toBeVisible();

        const image = homePage.getSuggestCardImage(card, 'shopper');
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('style', /background-image/);

        await expect(homePage.getSuggestCardBadge(card, 'shopper')).toBeVisible();

        const heart = homePage.getSuggestCardHeartButton(card);
        await expect(heart).toBeVisible();
        await expect(homePage.getSuggestCardHeartCount(card)).toHaveText(/^\d+$/);

        const shopName = homePage.getSuggestCardShopName(card);
        if (await shopName.count() > 0) {
            await expect(shopName.first()).toBeVisible();
        }

        await expect(homePage.getSuggestCardTitle(card, 'shopper')).toBeVisible();
        // await expect(homePage.getSuggestCardPrice(card)).toBeVisible();

        const expireText = homePage.getSuggestCardExpireOrPublishText(card, 'shopper');
        await expect(expireText).toBeVisible();
        await expect(expireText).toContainText(/เหลือ|หมดอายุ/);
    });

    test('Home_mobile_074: ตรวจสอบองค์ประกอบของการ์ดประเภท "โปรโมชั่น" ว่าแสดงครบถ้วน', async () => {
        await homePage.clickPunproPromotionTab();
        const card = homePage.getSuggestCard('promotion');
        await expect(card).toBeVisible();

        const image = homePage.getSuggestCardImage(card, 'promotion');
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('style', /background-image/);

        await expect(homePage.getSuggestCardBadge(card, 'promotion')).toBeVisible();
        await expect(homePage.getSuggestCardHeartButton(card)).toBeVisible();
        await expect(homePage.getSuggestCardTitle(card, 'promotion')).toBeVisible();

        const expireText = homePage.getSuggestCardExpireOrPublishText(card, 'promotion');
        await expect(expireText).toBeVisible();
        await expect(expireText).toContainText(/เหลือ|หมดอายุ/);
    });

    test('Home_mobile_075: ตรวจสอบองค์ประกอบของการ์ดประเภท "บทความ" ว่าแสดงครบถ้วน', async () => {
        await homePage.clickPunproArticleTab();
        const card = homePage.getSuggestCard('article');
        await expect(card).toBeVisible();

        const image = homePage.getSuggestCardImage(card, 'article');
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('style', /background-image/);

        await expect(homePage.getSuggestCardBadge(card, 'article')).toBeVisible();
        await expect(homePage.getSuggestCardHeartButton(card)).toBeVisible();
        await expect(homePage.getSuggestCardTitle(card, 'article')).toBeVisible();
        await expect(homePage.getSuggestCardExpireOrPublishText(card, 'article')).toBeVisible();
    });

    test('Home_mobile_076: ตรวจสอบการนำทางไปหน้ารายละเอียด เมื่อกดการ์ดประเภท "รับหิ้ว" ในแท็บ "ทั้งหมด"', async ({ page }) => {
        const card = await homePage.findSuggestCard('shopper', 0);
        // test.skip((await card.count()) === 0, 'ไม่มีการ์ดประเภท "รับหิ้ว" ในแท็บ "ทั้งหมด" ขณะรันเทสต์ (data-dependent)');

        await homePage.clickSuggestCard('shopper', 0);
        await page.waitForURL(/\/sp\//, { timeout: 15000 });
        await expect(page).toHaveURL(/\/sp\//);
    });

    test('Home_mobile_077: ตรวจสอบการนำทางไปหน้ารายละเอียด เมื่อกดการ์ดประเภท "โปรโมชั่น" ในแท็บ "ทั้งหมด"', async ({ page }) => {
        const card = await homePage.findSuggestCard('promotion', 0);
        // test.skip((await card.count()) === 0, 'ไม่มีการ์ดประเภท "โปรโมชั่น" ในแท็บ "ทั้งหมด" ขณะรันเทสต์ (data-dependent)');

        await homePage.clickSuggestCard('promotion', 0);
        await page.waitForURL(/\/p\//, { timeout: 15000 });
        await expect(page).toHaveURL(/\/p\//);
    });

    test('Home_mobile_078: ตรวจสอบการนำทางไปหน้ารายละเอียด เมื่อกดการ์ดประเภท "บทความ" ในแท็บ "ทั้งหมด"', async ({ page }) => {
        const card = await homePage.findSuggestCard('article', 0);
        // test.skip((await card.count()) === 0, 'ไม่มีการ์ดประเภท "บทความ" ในแท็บ "ทั้งหมด" ขณะรันเทสต์ (data-dependent)');

        await homePage.clickSuggestCard('article', 0);
        await page.waitForURL(/\/p\//, { timeout: 15000 });
        await expect(page).toHaveURL(/\/p\//);
    });

    test('Home_mobile_079: ตรวจสอบการนำทางไปหน้ารายละเอียด เมื่อกดการ์ดประเภท "รับหิ้ว" ในแท็บ "รับหิ้ว"', async ({ page }) => {
        const urlBefore = page.url();
        await homePage.clickPunproShopperTab();

        const card = homePage.getSuggestCard('shopper');
        await homePage.getSuggestCardImage(card, 'shopper').click();

        await page.waitForURL(/\/(sp)\//, { timeout: 10000 });
        expect(page.url()).not.toBe(urlBefore);
    });

    test('Home_mobile_080: ตรวจสอบการนำทางไปหน้ารายละเอียด เมื่อกดการ์ดประเภท "โปรโมชั่น" ในแท็บ "โปรแนะนำ"', async ({ page }) => {
        const urlBefore = page.url();
        await homePage.clickPunproPromotionTab();

        const card = homePage.getSuggestCard('promotion');
        await homePage.getSuggestCardImage(card, 'promotion').click();

        await page.waitForURL(/\/(p)\//, { timeout: 10000 });
        expect(page.url()).not.toBe(urlBefore);
    });

    test('Home_mobile_081: ตรวจสอบการนำทางไปหน้ารายละเอียด เมื่อกดการ์ดประเภท "บทความ" ในแท็บ "บทความ"', async ({ page }) => {
        const urlBefore = page.url();
        await homePage.clickPunproArticleTab();

        const card = homePage.getSuggestCard('article');
        await homePage.getSuggestCardImage(card, 'article').click();

        await page.waitForURL(/\/(p)\//, { timeout: 10000 });
        expect(page.url()).not.toBe(urlBefore);
    });

    test('Home_mobile_082: ตรวจสอบการกดไอคอน "หัวใจ" บนการ์ด กรณีที่ยังไม่ได้เข้าสู่ระบบ', async ({ page }) => {
        await homePage.clickPunproShopperTab();
        await homePage.clickFavoritePost(0);
        await expect(navbar.getLoginModalLogo()).toBeVisible({ timeout: 10000 });
    });

    test('Home_mobile_083: ตรวจสอบการกดไอคอน "หัวใจ" บนการ์ด กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        await homePage.clickPunproShopperTab();
        const favButton = homePage.getSuggestCardHeartButton(homePage.getSuggestCard('shopper', 0));
        const favIcon = favButton.locator('svg path');

        if (await favIcon.getAttribute('fill') === '#BF202F') {
            await homePage.clickFavoritePost(0);
            await expect(favIcon).toHaveAttribute('fill', '#979797');
        }

        await homePage.clickFavoritePost(0);
        await expect(favIcon).toHaveAttribute('fill', '#BF202F');
    });

    test('Home_mobile_084: ตรวจสอบการยกเลิกรายการโปรด เมื่อกดไอคอน "หัวใจ" บนการ์ดเดิมซ้ำ', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        await homePage.clickPunproShopperTab();
        const favButton = homePage.getSuggestCardHeartButton(homePage.getSuggestCard('shopper', 0));
        const favIcon = favButton.locator('svg path');

        if (await favIcon.getAttribute('fill') === '#979797') {
            await homePage.clickFavoritePost(0);
            await expect(favIcon).toHaveAttribute('fill', '#BF202F');
        }

        await homePage.clickFavoritePost(0);
        await expect(favIcon).toHaveAttribute('fill', '#979797');
    });

    test('Home_mobile_085: ตรวจสอบการแสดงการ์ดเพิ่มเติม เมื่อกดปุ่ม "ดูเพิ่มเติม" ใน Section "ปันโปรแนะนำ"', async ({ page }) => {
        await homePage.clickPunproAllTab();
        await page.waitForTimeout(1000);

        const countBefore = await homePage.punproCardItem.count();
        const scrollYBefore = await page.evaluate(() => window.scrollY);

        await homePage.clickSeeMoreSuggest();
        await page.waitForTimeout(10000);

        const countAfter = await homePage.punproCardItem.count();
        expect(countAfter).toBeGreaterThan(countBefore);

        const scrollYAfter = await page.evaluate(() => window.scrollY);
        expect(scrollYAfter).toBeGreaterThanOrEqual(scrollYBefore);
    });

    test('Home_mobile_086: ตรวจสอบการไม่แสดงปุ่ม "ดูเพิ่มเติม" เมื่อมีรายการในแท็บไม่เกิน 10 รายการ', async ({ page }) => {
        await homePage.clickPunproPromotionTab();
        await page.waitForTimeout(1000);
        const cardCount = await homePage.punproCardItem.count();

        if (cardCount <= 10) {
            await expect(homePage.punproSeeMoreButton).toBeHidden();
        } else {
            test.skip(true, 'แท็บนี้มีรายการมากกว่า 10 รายการ ไม่ตรงเงื่อนไขของเคสนี้ ต้องเลือกแท็บอื่น');
        }
    });

});