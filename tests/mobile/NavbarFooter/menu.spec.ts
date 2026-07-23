import { test, expect, Page, BrowserContext } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Navbar', () => {
    // ================================================================
    // Menu - Display / Close
    // ================================================================
    test.describe('Menu', () => {
        let navbar: NavbarFooter;

        test.beforeEach(async ({ page }) => {
            navbar = new NavbarFooter(page);
            await navbar.goto();
            await navbar.openMenu_mobile();
            await navbar.dismissAppBannerIfPresent();
            await navbar.dismissCookieBannerIfPresent();
            await navbar.dismissAnchorAdIfPresent();
        });

        test('Menu_mobile_001: แสดงรายการเมนูครบถ้วน', async ({ page }) => {
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

        test('Menu_mobile_011: ปิดเมนูแฮมเบอร์เกอร์', async ({ page }) => {
            await expect(navbar.mobileNavMenu).toHaveClass(/vertical-nav-toggled/);
            await navbar.closeMenu_mobile();
            await expect(navbar.mobileNavMenu).not.toHaveClass(/vertical-nav-toggled/);
        });
    });

    // ================================================================
    // Menu - Navigation (data-driven)
    // ================================================================
    test.describe('Menu - Navigation', () => {
        let navbar: NavbarFooter;

        test.beforeEach(async ({ page }) => {
            navbar = new NavbarFooter(page);
            await navbar.goto();
            await navbar.dismissAppBannerIfPresent();
            await navbar.dismissCookieBannerIfPresent();
        });

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
            test(`${testId}: นำทางไปหน้า "${label}"`, async ({ page }) => {
                await navbar.dismissCookieBannerIfPresent();
                await navbar.dismissAnchorAdIfPresent();
                await navbar.goToMenu_mobile(getLocator(navbar));
                await page.waitForURL(urlPattern, { timeout: 10000 });
            });
        }
    });

});