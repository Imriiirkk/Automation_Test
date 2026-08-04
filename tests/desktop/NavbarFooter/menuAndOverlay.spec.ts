import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Menu', () => {
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        await navbar.goto();
    });

    test.describe('Navigation', () => {
        const menuNavigationCases = [
            { testId: 'Menu_desktop_001', label: 'หน้าแรก', getLocator: (n: NavbarFooter) => n.homeMenu_desktop, urlPattern: /punpro\.com\/?$/ },
            { testId: 'Menu_desktop_002', label: 'โปรโมชั่น', getLocator: (n: NavbarFooter) => n.promotionMenu_desktop, urlPattern: /\/promotion/ },
            { testId: 'Menu_desktop_003', label: 'บทความ', getLocator: (n: NavbarFooter) => n.articleMenu_desktop, urlPattern: /\/article/ },
            { testId: 'Menu_desktop_004', label: 'รับหิ้ว', getLocator: (n: NavbarFooter) => n.shopperPostsMenu_desktop, urlPattern: /\/shopper_posts/ },
            { testId: 'Menu_desktop_005', label: 'คูปอง', getLocator: (n: NavbarFooter) => n.couponsMenu_desktop, urlPattern: /\/coupons/ },
            { testId: 'Menu_desktop_006', label: 'พาร์ทเนอร์', getLocator: (n: NavbarFooter) => n.partnerMenu_desktop, urlPattern: /\/partner/ },
            { testId: 'Menu_desktop_007', label: 'ติดต่อเรา', getLocator: (n: NavbarFooter) => n.contactMenu_desktop, urlPattern: /\/contact/ },
        ];

        for (const { testId, label, getLocator, urlPattern } of menuNavigationCases) {
            test(`${testId}: นำทางไปหน้า "${label}"`, async ({ page }) => {
                await navbar.goToMenu_desktop(getLocator(navbar));
                await page.waitForURL(urlPattern, { timeout: 10000 });
            });
        }

        test('Menu_desktop_008: แสดง visual indicator บนเมนูที่ active อยู่', async ({ page }) => {
            await navbar.goToMenu_desktop(navbar.promotionMenu_desktop);
            await page.waitForURL(/\/promotion/, { timeout: 10000 });

            await expect(navbar.promotionMenu_desktop).toHaveClass('NavbarMenu__MenuText-sc-7eaa4a1-3 iNzLUv nav-link kanit-regular position-relative active ')
        });

    });

    test.describe('Overlay', () => {
        test('Home_desktop_004: ตรวจสอบการแสดง App Banner เมื่อเข้าเว็บครั้งแรก', async () => {
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceInLeft/);
            await expect(navbar.appBannerDownloadButton).toBeVisible();
            await expect(navbar.appBannerCloseButton).toBeVisible();
        });

        test('Home_desktop_005: ตรวจสอบการปิด App Banner เมื่อกดปุ่มปิด', async () => {
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceInLeft/);
            await navbar.appBannerCloseButton.click();
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceOutLeft/);

            await navbar.appBanner.evaluate((el) =>
                new Promise<void>((resolve) => {
                    el.addEventListener('animationend', () => resolve(), { once: true });
                })
            );
        });

        test('Home_desktop_006: ตรวจสอบการแสดง Cookie Banner เมื่อเข้าเว็บครั้งแรก', async ({ page }) => {
            await expect(navbar.cookieContainer).toBeVisible({ timeout: 10000 });
            await expect(navbar.cookieAcceptButton).toBeVisible();
        });

        test('Home_desktop_007: ตรวจสอบการปิด Cookie Banner เมื่อกดปุ่ม "ยอมรับ"', async ({ page }) => {
            await expect(navbar.cookieContainer).toBeVisible({ timeout: 10000 });
            await navbar.dismissCookieBannerIfPresent();
            await expect(navbar.cookieAcceptButton).toBeHidden();
            await page.reload();
            await expect(navbar.cookieAcceptButton).toBeHidden({ timeout: 5000 });
        });

        test('Home_desktop_008: ตรวจสอบการแสดงปุ่มเลื่อนขึ้นบนสุด "^" เมื่อเลื่อนหน้าลง', async ({ page }) => {
            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });

            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });
        });

        test('Home_desktop_009: ตรวจสอบการเลื่อนกลับขึ้นบนสุด เมื่อกดปุ่ม "^"', async ({ page }) => {
            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });

            await navbar.dismissAllOverlaysIfPresent();
            await page.waitForTimeout(500);

            await navbar.scrollToTopButton.click({ force: true });
            await page.waitForTimeout(1000);
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBe(0);
        });
    });

    test.describe('All Overlay', () => {
        test('Overlay_desktop_001: ตรวจสอบการแสดง App Banner เมื่อเข้าเว็บครั้งแรก', async () => {
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceInLeft/);
            await expect(navbar.appBannerDownloadButton).toBeVisible();
            await expect(navbar.appBannerCloseButton).toBeVisible();
        });

        test('Overlay_desktop_002: ตรวจสอบการปิด App Banner เมื่อกดปุ่มปิด', async () => {
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceInLeft/);
            await navbar.appBannerCloseButton.click();
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceOutLeft/);

            await navbar.appBanner.evaluate((el) =>
                new Promise<void>((resolve) => {
                    el.addEventListener('animationend', () => resolve(), { once: true });
                })
            );
        });

        test('Overlay_desktop_003: ตรวจสอบการแสดง Cookie Banner เมื่อเข้าเว็บครั้งแรก', async ({ page }) => {
            await expect(navbar.cookieContainer).toBeVisible({ timeout: 10000 });
            await expect(navbar.cookieAcceptButton).toBeVisible();
        });

        test('Overlay_desktop_004: ตรวจสอบการปิด Cookie Banner เมื่อกดปุ่ม "ยอมรับ"', async ({ page }) => {
            await expect(navbar.cookieContainer).toBeVisible({ timeout: 10000 });
            await navbar.dismissCookieBannerIfPresent();
            await expect(navbar.cookieAcceptButton).toBeHidden();
            await page.reload();
            await expect(navbar.cookieAcceptButton).toBeHidden({ timeout: 5000 });
        });

        test('Overlay_desktop_005: ตรวจสอบการแสดงปุ่มเลื่อนขึ้นบนสุด "^" เมื่อเลื่อนหน้าลง', async ({ page }) => {
            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });

            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });
        });

        test('Overlay_desktop_006: ตรวจสอบการเลื่อนกลับขึ้นบนสุด เมื่อกดปุ่ม "^"', async ({ page }) => {
            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });

            await navbar.dismissAllOverlaysIfPresent();
            await page.waitForTimeout(500);

            await navbar.scrollToTopButton.click({ force: true });
            await page.waitForTimeout(1000);
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBe(0);
        });
    });
});
