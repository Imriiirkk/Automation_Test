import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/homePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Home Page - Promotion Section', () => {
    let homePage: HomePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await homePage.getPromotionSectionContainer().scrollIntoViewIfNeeded();
        await navbar.dismissAllOverlaysIfPresent();
    });

    test('Home_desktop_051: ตรวจสอบการแสดงองค์ประกอบของ Section "โปรแนะนำฝากหิ้ว" ในหน้า "Home"', async () => {
        const promotionContainer = homePage.getPromotionSectionContainer();
        await navbar.dismissAllOverlaysIfPresent();

        await expect(promotionContainer.getByText('โปร 1 แถม 1', { exact: true })).toBeVisible();
        await expect(promotionContainer.getByText('โปร 50% up', { exact: true })).toBeVisible();
        await expect(promotionContainer.getByText('โปรมือถือ', { exact: true })).toBeVisible();
        await expect(promotionContainer.getByText('โปรอาหาร', { exact: true })).toBeVisible();
        await expect(promotionContainer.getByText('ตั๋วถูก', { exact: true })).toBeVisible();
        await expect(promotionContainer.getByText('โค้ดส่วนลด', { exact: true })).toBeVisible();

        const icons = promotionContainer.locator('svg');
        const iconCount = await icons.count();
        expect(iconCount).toBeGreaterThanOrEqual(6);
    });

    // ---------- Promotion Filter Navigation (data-driven) ----------
    const promotionCases = [
        { testId: 'Home_desktop_052', name: 'โปร 1 แถม 1' },
        { testId: 'Home_desktop_053', name: 'โปร 50% up' },
        { testId: 'Home_desktop_054', name: 'โปรมือถือ' },
        { testId: 'Home_desktop_055', name: 'โปรอาหาร' },
        { testId: 'Home_desktop_056', name: 'ตั๋วถูก' },
        { testId: 'Home_desktop_057', name: 'โค้ดส่วนลด' },
    ];

    for (const { testId, name } of promotionCases) {
        test(`${testId}: ตรวจสอบการนำทางไปหน้า "โปรโมชัน" เมื่อกด "${name}"`, async ({ page }) => {
            await homePage.clickPromotionItem(name);
            await page.waitForURL(/\/promotion/, { timeout: 10000 });
            expect(page.url()).toContain('/promotion');
        });
    }

});