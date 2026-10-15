import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/homePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Home Page - Shopper Post Section', () => {
    let homePage: HomePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await homePage.getShopperPostSectionContainer().scrollIntoViewIfNeeded();
        await navbar.dismissAllOverlaysIfPresent();
    });

    test('Home_desktop_058: ตรวจสอบการแสดงองค์ประกอบของ Section "ฝากหิ้ว" ในหน้า "Home"', async ({ page }) => {
        await expect(homePage.shopperSeeMoreButton).toBeVisible();
        const cardCount = await page.getByRole('group', { name: /\d+ \/ \d+/ }).count();
        expect(cardCount).toBe(5);
    });

    test('Home_desktop_059: ตรวจสอบการนำทางไปหน้า "ปันโปรรับหิ้ว" เมื่อกดปุ่ม "ดูทั้งหมด" ใน Section "ฝากหิ้ว"', async ({ page }) => {
        await homePage.clickSeeMoreShopperPost();
        await page.waitForURL(/\/shopper_posts/, { timeout: 10000 });
    });

    test('Home_desktop_060: ตรวจสอบการนำทางไปหน้า "รายละเอียดสินค้า" เมื่อกดการ์ดสินค้าใน Section "ฝากหิ้ว"', async ({ page }) => {
        const urlBefore = page.url();
        await homePage.clickShopperPost();
        await page.waitForURL(/\/sp\//, { timeout: 10000 });
        expect(page.url()).not.toBe(urlBefore);
    });

});