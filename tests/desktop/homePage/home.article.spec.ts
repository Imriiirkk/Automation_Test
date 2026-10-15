// รันทีละ browser เพื่อหลีกเลี่ยงปัญหาเกี่ยวกับการบันทึกบทความ

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

    test('Home_desktop_061: ตรวจสอบการแสดงองค์ประกอบของ Section "บทความยอดนิยม" ในหน้า "Home"', async ({ page }) => {
        await expect(homePage.articleSeeMoreButton).toBeVisible();
        await expect(homePage.articleLargeCard_desktop).toHaveCount(1);
        await expect(homePage.articleSmallCards_desktop).toHaveCount(3);
    });

    test('Home_desktop_062: ตรวจสอบการนำทางไปหน้าที่ถูกต้อง เมื่อกดปุ่ม "ดูทั้งหมด" ใน Section "บทความยอดนิยม"', async ({ page }) => {
        await homePage.clickSeeMoreArticle();
        await page.waitForURL(/\/article/, { timeout: 10000 });
    });

    test('Home_desktop_063: ตรวจสอบการนำทางไปหน้า "รายละเอียดบทความ" เมื่อกดการ์ดบทความ', async ({ page }) => {
        const urlBefore = page.url();
        await homePage.clickArticlePost_desktop();
        await page.waitForURL(/\/p\//, { timeout: 10000 });
        expect(page.url()).not.toBe(urlBefore);
    });

    test('Home_desktop_064: ตรวจสอบการกดปุ่ม "บุ๊คมาร์ค" บนการ์ดบทความ กรณีที่ยังไม่ได้เข้าสู่ระบบ ', async ({ page }) => {
        const bookmarkButton = homePage.articleCardBookmarkButton_desktop;
        await expect(bookmarkButton).toBeVisible();
        await bookmarkButton.click();
        await expect(navbar.getLoginModalLogo()).toBeVisible({ timeout: 10000 });
    });

    test('Home_desktop_065: ตรวจสอบการกดปุ่ม "บุ๊คมาร์ค" บนการ์ดบทความ กรณีที่เข้าสู่ระบบแล้ว ', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        const bookmarkButton = homePage.articleCardBookmarkButton_desktop;

        if (await bookmarkButton.locator('svg').isVisible()) {
            await bookmarkButton.click();
            await expect(bookmarkButton.locator('i.fa-bookmark')).toBeVisible();
        }

        await bookmarkButton.click();
        await expect(bookmarkButton.locator('svg')).toBeVisible();
    });

    test('Home_desktop_066: ตรวจสอบการยกเลิกการบันทึกบทความ เมื่อกดปุ่ม "บุ๊คมาร์ค" ซ้ำบนการ์ดบทความเดิม', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        const bookmarkButton = homePage.articleCardBookmarkButton_desktop;

        if (await bookmarkButton.locator('i.fa-bookmark').isVisible()) {
            await bookmarkButton.click();
            await expect(bookmarkButton.locator('svg')).toBeVisible();
        }

        await bookmarkButton.click();
        await expect(bookmarkButton.locator('i.fa-bookmark')).toBeVisible();
    });

});