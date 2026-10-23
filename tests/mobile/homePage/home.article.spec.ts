import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/homePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Home Page - Article Post Section', () => {
    let homePage: HomePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await homePage.getArticleSectionContainer().scrollIntoViewIfNeeded();
        await navbar.dismissAllOverlaysIfPresent();
    });

    test('Home_mobile_062: ตรวจสอบการแสดงองค์ประกอบของ Section "บทความยอดนิยม" ในหน้า "Home"', async ({ page }) => {
        const articleSection = homePage.getArticleSectionContainer();
        await expect(homePage.articleSeeMoreButton).toBeVisible();

        const cardCount = await page.getByRole('group', { name: /\d+ \/ \d+/ }).count();
        expect(cardCount).toBeGreaterThanOrEqual(4);

        await expect(homePage.articleIndicatorContainer).toBeVisible();
        await page.bringToFront();
        const screenshotBefore = await articleSection.screenshot();
        await page.waitForTimeout(6000);
        const screenshotAfter = await articleSection.screenshot();
        expect(screenshotBefore).not.toEqual(screenshotAfter);
    });

    test('Home_mobile_063: ตรวจสอบการเลื่อนการ์ดเมื่อกด Indicator ใน Section "บทความยอดนิยม"', async ({ page }) => {
        const targetIndex = 2;
        await homePage.clickArticleIndicator(targetIndex);
        await expect(homePage.getActiveArticleIndicator())
            .toHaveAttribute('aria-label', `Go to slide ${targetIndex}`);
    });

    test('Home_mobile_064: ตรวจสอบการนำทางไปหน้าที่ถูกต้อง เมื่อกดปุ่ม "ดูทั้งหมด" ใน Section "บทความยอดนิยม"', async ({ page }) => {
        await homePage.clickSeeMoreArticle();
        await page.waitForURL(/\/article/, { timeout: 10000 });
    });

    test('Home_mobile_065: ตรวจสอบการนำทางไปหน้า "รายละเอียดบทความ" เมื่อกดการ์ดบทความ', async ({ page }) => {
        const urlBefore = page.url();
        await homePage.clickArticlePost();
        await page.waitForURL(/\/p\//, { timeout: 10000 });
        expect(page.url()).not.toBe(urlBefore);
    });

    test('Home_mobile_066: ตรวจสอบการกดปุ่ม "บุ๊คมาร์ค" บนการ์ดบทความ กรณีที่ยังไม่ได้เข้าสู่ระบบ ', async ({ page }) => {
        const bookmarkButton = homePage.articleCardBookmarkButton.first();
        await expect(bookmarkButton).toBeVisible();
        await bookmarkButton.click();
        await expect(navbar.getLoginModalLogo()).toBeVisible({ timeout: 10000 });
    });

    test('Home_mobile_067: ตรวจสอบการกดปุ่ม "บุ๊คมาร์ค" บนการ์ดบทความ กรณีที่เข้าสู่ระบบแล้ว ', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        const bookmarkButton = homePage.articleCardBookmarkButton.first();
        await bookmarkButton.click();
        await expect(bookmarkButton.locator('svg')).toBeVisible();
    });

    test('Home_mobile_068: ตรวจสอบการยกเลิกการบันทึกบทความ เมื่อกดปุ่ม "บุ๊คมาร์ค" ซ้ำบนการ์ดบทความเดิม', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        const bookmarkButton = homePage.articleCardBookmarkButton.first();

        await bookmarkButton.click();
        await expect(bookmarkButton.locator('i.fa-bookmark')).toBeVisible();
    });

});