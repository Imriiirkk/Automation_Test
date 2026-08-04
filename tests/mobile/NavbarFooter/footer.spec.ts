import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';
import { expectStoreNavigation } from '../../../helper/navigation-helpers';

test.describe('Footer', () => {
    let footer: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        footer = new NavbarFooter(page);
        await footer.goto();
        await footer.footerContainer.scrollIntoViewIfNeeded();
        await footer.dismissAllOverlaysIfPresent();
    });

    test('Footer_mobile_001: ตรวจสอบองค์ประกอบของ Footer ครบถ้วน', async ({ page }) => {
        await expect(footer.footerContainer).toBeVisible();

        // Footer Menu
        await expect(footer.footerPromotionLink).toBeVisible();
        await expect(footer.footerArticleLink).toBeVisible();
        await expect(footer.footerShopperPostsLink).toBeVisible();
        await expect(footer.footerPartnerLink).toBeVisible();
        await expect(footer.footerCouponLink).toBeVisible();
        await expect(footer.footerContactLink).toBeVisible();

        // Social icons
        await expect(footer.footerFacebookLink).toBeVisible();
        await expect(footer.footerInstagramLink).toBeVisible();
        await expect(footer.footerXLink).toBeVisible();
        await expect(footer.footerYoutubeLink).toBeVisible();

        // ปุ่ม Download App
        await expect(footer.appStoreLink).toBeVisible();
        await expect(footer.playStoreLink).toBeVisible();

        // ข้อความ Copyright
        await expect(page.getByText('2020 PUNPROMOTION Co., Ltd. All rights reserved')).toBeVisible();
    });

    const footerMenuCases = [
        { testId: 'Footer_mobile_002', label: 'โปรโมชัน', getLocator: (n: NavbarFooter) => n.footerPromotionLink, urlPattern: /\/promotion/ },
        { testId: 'Footer_mobile_003', label: 'บทความ', getLocator: (n: NavbarFooter) => n.footerArticleLink, urlPattern: /\/article/ },
        { testId: 'Footer_mobile_004', label: 'ปันโปรรับหิ้ว', getLocator: (n: NavbarFooter) => n.footerShopperPostsLink, urlPattern: /\/shopper_posts/ },
        { testId: 'Footer_mobile_005', label: 'พาร์ทเนอร์', getLocator: (n: NavbarFooter) => n.footerPartnerLink, urlPattern: /\/partner/ },
        { testId: 'Footer_mobile_006', label: 'คูปอง', getLocator: (n: NavbarFooter) => n.footerCouponLink, urlPattern: /\/coupons/ },
        { testId: 'Footer_mobile_007', label: 'ติดต่อเรา', getLocator: (n: NavbarFooter) => n.footerContactLink, urlPattern: /\/contact/ },
    ];

    for (const { testId, label, getLocator, urlPattern } of footerMenuCases) {
        test(`${testId}: ตรวจสอบการนำทางจาก Footer Menu ไปหน้า "${label}"`, async ({ page }) => {
            await getLocator(footer).click();
            await page.waitForURL(urlPattern, { timeout: 10000 });
        });
    }

    test('Footer_mobile_008: ตรวจสอบการนำทางไปยัง "App Store"', async ({ page, context }) => {
        await expectStoreNavigation(context, () => footer.appStoreLink.click(), 'apps.apple.com');
    });

    test('Footer_mobile_009: ตรวจสอบการนำทางไปยัง "Google Play"', async ({ page, context }) => {
        await expectStoreNavigation(context, () => footer.playStoreLink.click(), 'play.google.com');
    });
});