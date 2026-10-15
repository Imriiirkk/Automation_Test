import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/homePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Home Page - Services Section', () => {
    let homePage: HomePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await homePage.getServicesSectionContainer().scrollIntoViewIfNeeded();
        await navbar.dismissAllOverlaysIfPresent();
    });

    test('Home_mobile_046: ตรวจสอบการแสดงองค์ประกอบของ Section "บริการทั้งหมด" บนหน้า "Home"', async ({ page }) => {
        const servicesContainer = homePage.getServicesSectionContainer();
        await expect(servicesContainer.getByText('ฝากหิ้ว', { exact: true })).toBeVisible();
        await expect(servicesContainer.getByText('โปรใกล้ฉัน', { exact: true })).toBeVisible();
        await expect(servicesContainer.getByText('คูปอง', { exact: true })).toBeVisible();
        await expect(servicesContainer.getByText('บทความ', { exact: true })).toBeVisible();

        const icons = servicesContainer.locator('svg');
        const iconCount = await icons.count();
        expect(iconCount).toBeGreaterThanOrEqual(4);
    });

    // ---------- Service Item Navigation (data-driven) ----------
    const serviceCases = [
        { testId: 'Home_mobile_047', name: 'ฝากหิ้ว', urlPattern: /\/shopper_posts/ },
        { testId: 'Home_mobile_048', name: 'โปรใกล้ฉัน', urlPattern: /\/promotion/ },
        { testId: 'Home_mobile_049', name: 'คูปอง', urlPattern: /\/coupons/ },
        { testId: 'Home_mobile_050', name: 'บทความ', urlPattern: /\/article/ },
    ];

    for (const { testId, name, urlPattern } of serviceCases) {
        test(`${testId}: ตรวจสอบการนำทางไปหน้าที่ถูกต้อง เมื่อกดบริการ "${name}"`, async ({ page }) => {
            await homePage.clickServiceItem(name);
            await page.waitForURL(urlPattern, { timeout: 10000 });
        });
    }

});