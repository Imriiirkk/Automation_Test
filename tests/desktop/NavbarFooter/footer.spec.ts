import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';
import { expectStoreNavigation } from '../../../helper/navigation-helpers';

test.describe('Footer - Desktop', () => {
    let footer: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        footer = new NavbarFooter(page);
        await footer.goto();
        await footer.footerContainer.scrollIntoViewIfNeeded();
        await footer.dismissAllOverlaysIfPresent();
    });

    test('Footer_desktop_001: ตรวจสอบองค์ประกอบของ Footer ครบถ้วนบน Desktop', async ({ page }) => {
        await expect(footer.footerContainer).toBeVisible();

        // Footer Menu
        await expect(footer.footerPromotionLink).toBeVisible();
        await expect(footer.footerArticleLink).toBeVisible();
        await expect(footer.footerShopperPostsLink).toBeVisible();
        await expect(footer.footerPartnerLink).toBeVisible();
        await expect(footer.footerCouponLink).toBeVisible();
        await expect(footer.footerContactLink).toBeVisible();

        // Social icons ครบ 4 ช่องทาง
        await expect(footer.footerFacebookLink).toBeVisible();
        await expect(footer.footerInstagramLink).toBeVisible();
        await expect(footer.footerXLink).toBeVisible();
        await expect(footer.footerYoutubeLink).toBeVisible();

        // หมวด Promotion ครบ
        await expect(footer.footerPromotion_pro1get1).toBeVisible();
        await expect(footer.footerPromotion_50up).toBeVisible();
        await expect(footer.footerPromotion_phone).toBeVisible();
        await expect(footer.footerPromotion_food).toBeVisible();
        await expect(footer.footerPromotion_ticket).toBeVisible();
        await expect(footer.footerPromotion_discount).toBeVisible();

        // หมวดบทความครบ
        await expect(footer.footerArticle_fashion).toBeVisible();
        await expect(footer.footerArticle_eat).toBeVisible();
        await expect(footer.footerArticle_travel).toBeVisible();
        await expect(footer.footerArticle_smart).toBeVisible();
        await expect(footer.footerArticle_updates).toBeVisible();
        await expect(footer.footerArticle_talking).toBeVisible();

        // ปุ่ม Download App
        await expect(footer.appStoreLink).toBeVisible();
        await expect(footer.playStoreLink).toBeVisible();

        // ข้อความ Copyright
        await expect(page.getByText('2020 PUNPROMOTION Co., Ltd. All rights reserved')).toBeVisible();

        // Link ครบ 2 รายการ (ต่างจาก mobile ที่ซ่อนไว้)
        await expect(footer.termsAndConditionsLink).toBeVisible();
        await expect(footer.privacyPolicyLink).toBeVisible();
    });

    // ---------- Footer Menu Navigation (data-driven) ----------
    const footerMenuCases = [
        { testId: 'Footer_desktop_002', label: 'โปรโมชัน', getLocator: (n: NavbarFooter) => n.footerPromotionLink, urlPattern: /\/promotion/ },
        { testId: 'Footer_desktop_003', label: 'บทความ', getLocator: (n: NavbarFooter) => n.footerArticleLink, urlPattern: /\/article/ },
        { testId: 'Footer_desktop_004', label: 'ปันโปรรับหิ้ว', getLocator: (n: NavbarFooter) => n.footerShopperPostsLink, urlPattern: /\/shopper_posts/ },
        { testId: 'Footer_desktop_005', label: 'พาร์ทเนอร์', getLocator: (n: NavbarFooter) => n.footerPartnerLink, urlPattern: /\/partner/ },
        { testId: 'Footer_desktop_006', label: 'คูปอง', getLocator: (n: NavbarFooter) => n.footerCouponLink, urlPattern: /\/coupons/ },
        { testId: 'Footer_desktop_007', label: 'ติดต่อเรา', getLocator: (n: NavbarFooter) => n.footerContactLink, urlPattern: /\/contact/ },
    ];

    for (const { testId, label, getLocator, urlPattern } of footerMenuCases) {
        test(`${testId}: นำทางจาก Footer Menu ไปหน้า "${label}"`, async ({ page }) => {
            await getLocator(footer).click();
            await page.waitForURL(urlPattern, { timeout: 10000 });
        });
    }

    // ---------- Footer Promotion Filter Navigation (data-driven) ----------
    const footerPromotionCases = [
        { testId: 'Footer_desktop_008', label: '1 แถม 1', getLocator: (n: NavbarFooter) => n.footerPromotion_pro1get1 },
        { testId: 'Footer_desktop_009', label: '50% up', getLocator: (n: NavbarFooter) => n.footerPromotion_50up },
        { testId: 'Footer_desktop_010', label: 'โปรมือถือ', getLocator: (n: NavbarFooter) => n.footerPromotion_phone },
        { testId: 'Footer_desktop_011', label: 'อาหาร', getLocator: (n: NavbarFooter) => n.footerPromotion_food },
        { testId: 'Footer_desktop_012', label: 'ตั๋วถูก', getLocator: (n: NavbarFooter) => n.footerPromotion_ticket },
        { testId: 'Footer_desktop_013', label: 'โค้ดส่วนลด', getLocator: (n: NavbarFooter) => n.footerPromotion_discount },
    ];

    for (const { testId, label, getLocator } of footerPromotionCases) {
        test(`${testId}: นำทางไปหน้า "โปรโมชัน" แบบ filter เมื่อกด "${label}" ใน Footer`, async ({ page }) => {
            await getLocator(footer).click();
            await page.waitForURL(/\/promotion/, { timeout: 10000 });
            expect(page.url()).toContain('/promotion');
        });
    }

    // ---------- Footer Article Category Navigation (data-driven) ----------
    const footerArticleCases = [
        { testId: 'Footer_desktop_014', label: 'โปรสายแฟ', getLocator: (n: NavbarFooter) => n.footerArticle_fashion },
        { testId: 'Footer_desktop_015', label: 'โปรกิน', getLocator: (n: NavbarFooter) => n.footerArticle_eat },
        { testId: 'Footer_desktop_016', label: 'โปรเที่ยว', getLocator: (n: NavbarFooter) => n.footerArticle_travel },
        { testId: 'Footer_desktop_017', label: 'โปรสมาร์ท', getLocator: (n: NavbarFooter) => n.footerArticle_smart },
        { testId: 'Footer_desktop_018', label: 'โปรอัพเดต', getLocator: (n: NavbarFooter) => n.footerArticle_updates },
        { testId: 'Footer_desktop_019', label: 'โปรชวนคุย', getLocator: (n: NavbarFooter) => n.footerArticle_talking },
    ];

    for (const { testId, label, getLocator } of footerArticleCases) {
        test(`${testId}: นำทางไปหน้า "บทความ" หมวด "${label}" ใน Footer`, async ({ page }) => {
            await getLocator(footer).click();
            await page.waitForURL(/\/article/, { timeout: 10000 });
            expect(page.url()).toContain('/article');
        });
    }

    test('Footer_desktop_020: นำทางไปยัง "App Store"', async ({ page, context }) => {
        await expectStoreNavigation(context, () => footer.appStoreLink.click(), 'apps.apple.com');
    });

    test('Footer_desktop_021: นำทางไปยัง "Google Play"', async ({ page, context }) => {
        await expectStoreNavigation(context, () => footer.playStoreLink.click(), 'play.google.com');
    });

    test('Footer_desktop_022: นำทางไปหน้า "Terms & Conditions" เมื่อกด Link', async ({ page }) => {
        await footer.termsAndConditionsLink.click();
        await page.waitForURL(/\/terms/, { timeout: 10000 });
    });

    test('Footer_desktop_023: นำทางไปหน้า "Privacy Policy" เมื่อกด Link', async ({ page }) => {
        await footer.privacyPolicyLink.click();
        await page.waitForURL(/\/privacy/, { timeout: 10000 });
    });
});