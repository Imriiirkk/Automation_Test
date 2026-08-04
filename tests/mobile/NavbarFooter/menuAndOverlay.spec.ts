import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Menu', () => {
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        await navbar.goto();
    });

    test.describe('Display / Close', () => {
        test.beforeEach(async () => {
            await navbar.openMenu_mobile();
            await navbar.dismissAllOverlaysIfPresent();
        });

        test('Menu_mobile_001: ตรวจสอบการแสดงรายการเมนูครบถ้วน', async ({ page }) => {
            await expect(navbar.mobileNavMenu).toHaveClass(/vertical-nav-toggled/);
            await expect(navbar.loginButton_mobile).toBeVisible();
            await expect(navbar.homeMenu_mobile).toBeVisible();
            await expect(navbar.promotionMenu_mobile).toBeVisible();
            await expect(navbar.articleMenu_mobile).toBeVisible();
            await expect(navbar.shopperPostsMenu_mobile).toBeVisible();
            await expect(navbar.couponsMenu_mobile).toBeVisible();
            await expect(navbar.privacyPolicy_mobile).toBeVisible();
            await expect(navbar.termsAndConditions_mobile).toBeVisible();
            await expect(navbar.contactMenu_mobile).toBeVisible();
            await expect(navbar.jobsMenu_mobile).toBeVisible();
        });

        test('Menu_mobile_011: ตรวจสอบการปิดเมนูแฮมเบอร์เกอร์', async ({ page }) => {
            await expect(navbar.mobileNavMenu).toHaveClass(/vertical-nav-toggled/);
            await navbar.closeMenu_mobile();
            await expect(navbar.mobileNavMenu).not.toHaveClass(/vertical-nav-toggled/);
        });
    });

    test.describe('Navigation', () => {
        const menuNavigationCases = [
            { testId: 'Menu_mobile_002', label: 'หน้าแรก', getLocator: (n: NavbarFooter) => n.homeMenu_mobile, urlPattern: /punpro\.com\/?$/ },
            { testId: 'Menu_mobile_003', label: 'โปรโมชั่น', getLocator: (n: NavbarFooter) => n.promotionMenu_mobile, urlPattern: /\/promotion/ },
            { testId: 'Menu_mobile_004', label: 'บทความ', getLocator: (n: NavbarFooter) => n.articleMenu_mobile, urlPattern: /\/article/ },
            { testId: 'Menu_mobile_005', label: 'รับหิ้ว', getLocator: (n: NavbarFooter) => n.shopperPostsMenu_mobile, urlPattern: /\/shopper_posts/ },
            { testId: 'Menu_mobile_006', label: 'คูปอง', getLocator: (n: NavbarFooter) => n.couponsMenu_mobile, urlPattern: /\/coupons/ },
            { testId: 'Menu_mobile_007', label: 'นโยบายความเป็นส่วนตัว', getLocator: (n: NavbarFooter) => n.privacyPolicy_mobile, urlPattern: /\/privacy-policy/ },
            { testId: 'Menu_mobile_008', label: 'ข้อกำหนดและเงื่อนไข', getLocator: (n: NavbarFooter) => n.termsAndConditions_mobile, urlPattern: /\/terms-conditions/ },
            { testId: 'Menu_mobile_009', label: 'ติดต่อเรา', getLocator: (n: NavbarFooter) => n.contactMenu_mobile, urlPattern: /\/contact/ },
            { testId: 'Menu_mobile_010', label: 'ร่วมงานกับเรา', getLocator: (n: NavbarFooter) => n.jobsMenu_mobile, urlPattern: /\/(jobs)/ },
        ];

        for (const { testId, label, getLocator, urlPattern } of menuNavigationCases) {
            test(`${testId}: ตรวจสอบการนำทางไปหน้า "${label}"`, async ({ page }) => {
                await navbar.dismissAllOverlaysIfPresent();
                await navbar.goToMenu_mobile(getLocator(navbar));
                await page.waitForURL(urlPattern, { timeout: 10000 });
            });
        }
    });

    test.describe('Overlay', () => {
        test('Overlay_mobile_001: ตรวจสอบการแสดง App Banner เมื่อเข้าเว็บครั้งแรก', async () => {
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceInLeft/);
            await expect(navbar.appBannerDownloadButton).toBeVisible();
            await expect(navbar.appBannerCloseButton).toBeVisible();
        });

        test('Overlay_mobile_002: ตรวจสอบการปิด App Banner เมื่อกดปุ่มปิด', async () => {
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceInLeft/);
            await navbar.appBannerCloseButton.click();
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceOutLeft/);

            await navbar.appBanner.evaluate((el) =>
                new Promise<void>((resolve) => {
                    el.addEventListener('animationend', () => resolve(), { once: true });
                })
            );
        });

        test('Overlay_mobile_003: ตรวจสอบการแสดง Cookie Banner เมื่อเข้าเว็บครั้งแรก', async ({ page }) => {
            await expect(navbar.cookieContainer).toBeVisible({ timeout: 10000 });
            await expect(navbar.cookieAcceptButton).toBeVisible();
        });

        test('Overlay_mobile_004: ตรวจสอบการปิด Cookie Banner เมื่อกดปุ่ม "ยอมรับ"', async ({ page }) => {
            await expect(navbar.cookieContainer).toBeVisible({ timeout: 10000 });
            await navbar.dismissCookieBannerIfPresent();
            await expect(navbar.cookieAcceptButton).toBeHidden();
            await page.reload();
            await expect(navbar.cookieAcceptButton).toBeHidden({ timeout: 5000 });
        });

        test('Overlay_mobile_005: ตรวจสอบการแสดงปุ่มเลื่อนขึ้นบนสุด "^" เมื่อเลื่อนหน้าลง', async ({ page }) => {
            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });

            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });
        });

        test('Overlay_mobile_006: ตรวจสอบการเลื่อนกลับขึ้นบนสุด เมื่อกดปุ่ม "^"', async ({ page }) => {
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