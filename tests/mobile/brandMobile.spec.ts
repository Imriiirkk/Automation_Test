import { Locator, test, expect } from '@playwright/test';
import { PromotionPage } from '../../pages/PromotionPage';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { BrandPage } from '../../pages/BrandPage';

const VALID_EMAIL = ''; //อย่าลืมใส่อีเมลกับรหัสนะคะ
const VALID_PASSWORD = ''; //อย่าลืมใส่อีเมลกับรหัสนะคะ
// test.describe('Run test', () => {

let navbar: NavbarFooter;
let promotionPage: PromotionPage;
let brandPage: BrandPage;

const DETAIL_URL = /\/sp\/.+/;

async function ensureLikeOff(
    likeBtn: Locator,
    likeIcon: Locator
) {
    const className = await likeIcon.getAttribute('class');

    if (className?.includes('gxBVIB')) {
        await likeBtn.click();
        await expect(likeIcon).toHaveClass(/cjtKzC/);
    } else {
        await expect(likeIcon).toHaveClass(/cjtKzC/);
    }
}

async function ensureBookmarkOff(
    bookmarkBtn: Locator,
    bookmarkIcon: Locator
) {
    const className = await bookmarkIcon.getAttribute('class');

    if (className?.includes('gxBVIB')) {
        // ON -> OFF
        await bookmarkBtn.click();
        await expect(bookmarkIcon).toHaveClass(/cjtKzC/);
    } else {
        // ยืนยันว่าเริ่มต้นเป็น OFF
        await expect(bookmarkIcon).toHaveClass(/cjtKzC/);
    }
}

test.describe('Brand Page (Mobile)', () => {

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        promotionPage = new PromotionPage(page);
        brandPage = new BrandPage(page);
        await page.goto('/brand?s=punprotest');
        await page.waitForURL(/\/brand\?s=[a-zA-Z0-9-_]+/, { timeout: 10000 });

        // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
        await navbar.dismissAppBannerIfPresent();
        await navbar.dismissCookieBannerIfPresent();
        await navbar.dismissAnchorAdIfPresent();
    });

    test.describe('Run test', () => {
        // Pass
        test('Brand_Mobile_001: ตรวจสอบการแสดงรายละเอียดบนหน้า แบรนด์', async ({ page }) => {
            await expect(brandPage.brand_title).toBeVisible();
            await expect(brandPage.breadcrumbBlock).toBeVisible();
            await expect(brandPage.listPost_Card).toBeVisible();
            await expect(brandPage.each_PostCard.first()).toBeVisible();
        });

        // Pass
        test('Brand_Mobile_002: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
            await expect(brandPage.homeBreadcrumb).toBeVisible();
            await brandPage.homeBreadcrumbLink.click();
            await expect(page).toHaveURL(/^https?:\/\/[^/]+\/?(\?.*)?$/);
        });

        // Pass
        test('Brand_Mobile_003: ตรวจสอบการกดรูปภาพ บนการ์ดสินค้า', async ({ page }) => {
            await expect(brandPage.coverImg_EventCard).toBeVisible();
            await brandPage.coverImg_EventCard.click();
            await expect(page).toHaveURL(DETAIL_URL);
        });

        // Pass
        test('Brand_Mobile_004: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดสินค้า', async ({ page }) => {
            await expect(brandPage.title_EventCard).toBeVisible();
            await brandPage.title_EventCard.click();
            await expect(page).toHaveURL(DETAIL_URL);
        });
    });

    // Pass
    test('Brand_Mobile_005: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        const likeBtn = brandPage.loveEvent_Btn;
        await likeBtn.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Brand_Mobile_006: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const likeBtn = brandPage.loveEvent_Btn.first();
        const likeIcon = likeBtn.locator('i');

        await ensureLikeOff(likeBtn, likeIcon);

        await likeBtn.click();
        await expect(likeIcon).toHaveClass(/gxBVIB/);
    });

    // Pass
    test('Brand_Mobile_007: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ด กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const likeBtn = brandPage.loveEvent_Btn.first();
        const likeIcon = likeBtn.locator('i');

        await expect(likeBtn).toBeVisible();
        await expect(likeBtn).toBeEnabled();

        await ensureLikeOff(likeBtn, likeIcon);
        await expect(likeIcon).toHaveClass(/cjtKzC/);

        await likeBtn.scrollIntoViewIfNeeded();
        await likeBtn.click();

        await expect(likeIcon).toHaveClass(/gxBVIB/, { timeout: 10000, });
        await likeBtn.click();

        await expect(likeIcon).toHaveClass(/cjtKzC/, { timeout: 10000, });
    });

    // Pass
    test('Brand_Mobile_008: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        const bookmarkBtn = brandPage.bookmarkEvent_Btn;
        await bookmarkBtn.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Brand_Mobile_009: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const bookmarkBtn = brandPage.bookmarkEvent_Btn.first();
        const bookmarkIcon = bookmarkBtn.locator('i');

        await expect(bookmarkBtn).toBeVisible();
        await ensureBookmarkOff(bookmarkBtn, bookmarkIcon);

        await bookmarkBtn.click();
        await expect(bookmarkIcon).toHaveClass(/gxBVIB/, { timeout: 10000, });
    });

    // Pass
    test('Brand_Mobile_010: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const bookmarkBtn = brandPage.bookmarkEvent_Btn.first();
        const bookmarkIcon = bookmarkBtn.locator('i');

        await expect(bookmarkBtn).toBeVisible();
        await ensureBookmarkOff(bookmarkBtn, bookmarkIcon);

        await bookmarkBtn.click();
        await expect(bookmarkIcon).toHaveClass(/gxBVIB/, { timeout: 10000, });

        await bookmarkBtn.click();
        await expect(bookmarkIcon).toHaveClass(/cjtKzC/, { timeout: 10000, });
    });

    // Pass
    test('Brand_Mobile_011: ตรวจสอบการกดปุ่ม "Share" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await brandPage.clickShare_Card();
        await expect(brandPage.shareOnFacebook_Btn).toBeVisible();
        await expect(brandPage.shareOnX_Btn).toBeVisible();
        await expect(brandPage.shareOnLine_Btn).toBeVisible();
    });

    // Pass
    test('Brand_Mobile_012: ตรวจสอบการกด "Icon Facebook" เพื่อ Share การ์ดต่างๆ', async ({ page, context }) => {
        await brandPage.clickShare_Card();
        await expect(brandPage.shareOnFacebook_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await brandPage.shareOnFacebook_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/facebook\.com/);
    });

    // Pass
    test('Brand_Mobile_013: ตรวจสอบการกด "Icon X" เพื่อ Share การ์ดต่างๆ', async ({ page, context }) => {
        await brandPage.clickShare_Card();
        await expect(brandPage.shareOnX_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await brandPage.shareOnX_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/x\.com|twitter\.com/);
    });

    // Pass
    test('Brand_Mobile_014: ตรวจสอบการกด "Icon Line" เพื่อ Share การ์ดต่างๆ', async ({ page, context }) => {
        await brandPage.clickShare_Card();
        const lineBtn = brandPage.shareOnLine_Btn.first();
        await expect(lineBtn).toBeVisible();
        const popupPromise = context.waitForEvent('page');
        await lineBtn.click();
        const popup = await popupPromise;
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me|line\.biz/i);
    });

    // Pass
    test('Brand_Mobile_015: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Brand_Mobile_016: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();

        await expect.poll(async () => {
            return await page.evaluate(() => window.scrollY);
        }).toBeLessThan(100);
    });
});