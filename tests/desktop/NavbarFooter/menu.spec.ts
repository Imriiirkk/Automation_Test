import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';
import { expectExternalNavigation } from '../../../helper/navigation-helpers';

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

    // ================================================================
    // Social Media Links - Navbar
    // ================================================================
    test.describe('Social Media Links - Navbar', () => {
        test('Social_desktop_001: ตรวจสอบการนำทางไปหน้า Facebook ของปันโปร', async ({ page, context }) => {
            await expectExternalNavigation(page, context, () => navbar.navFacebookLink.click(), ['facebook.com']);
        });

        test('Social_desktop_002: ตรวจสอบการนำทางไปหน้า Instagram ของปันโปร', async ({ page, context }) => {
            await expectExternalNavigation(page, context, () => navbar.navInstagramLink.click(), ['instagram.com']);
        });

        test('Social_desktop_003: ตรวจสอบการนำทางไปหน้า X ของปันโปร', async ({ page, context }) => {
            await expectExternalNavigation(page, context, () => navbar.navXLink.click(), ['x.com']);
        });

        test('Social_desktop_004: ตรวจสอบการนำทางไปช่อง YouTube ของปันโปร', async ({ page, context }) => {
            await expectExternalNavigation(page, context, () => navbar.navYoutubeLink.click(), ['youtube.com']);
        });
    });
});
