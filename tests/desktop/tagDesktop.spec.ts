import { test, expect, Locator } from '@playwright/test';
import { TagPage } from '../../pages/TagPage';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { PromotionPage } from '../../pages/PromotionPage';

// test.describe('Run test', () => {

let navbar: NavbarFooter;
let tagPage: TagPage;
let promotionPage: PromotionPage;

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

// const ICON_OFF = /cjtKzC/;
// const ICON_ON = /gxBVIB/;

async function ensureLikeOff(
    likeBtn: Locator,
    likeIcon: Locator
) {
    if (await likeIcon.getAttribute('class')?.then(
        className => className?.includes('gxBVIB') ?? false
    )) {
        await likeBtn.click();
        await expect(likeIcon).toHaveClass(/cjtKzC/);
    }
}

async function ensureBookmarkOff(
    bookmarkBtn: Locator,
    bookmarkIcon: Locator
) {
    if (
        (await bookmarkIcon.getAttribute('class'))
            ?.includes('gxBVIB')
    ) {
        await bookmarkBtn.click();
        await expect(bookmarkIcon).not.toHaveClass(/gxBVIB/);
    }
}


test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    tagPage = new TagPage(page);
    promotionPage = new PromotionPage(page);

    // await page.goto(TAG_PATH);
    // await expect(page).toHaveURL(/\/tag\/.+/);

    await navbar.goto();
    await navbar.goToMenu_desktop('Link to promotion');
    await page.waitForURL(/\/promotion/, { timeout: 10000 });
    await promotionPage.clickPromotionCard_title();
    await promotionPage.tagItem.first().click();
    await expect(page).toHaveURL(/\/tag\/.+/);

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่น ๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

// ---------- Helpers ----------

// ข้ามเทสต์ถ้าหน้า Tag นี้ไม่มีการ์ดประเภทนั้น
async function skipIfNoCard(card: Locator, name: string) {
    test.skip((await card.count()) === 0, `ไม่พบการ์ด${name}ในหน้า Tag นี้`);
}

// URL ของหน้ารายละเอียดบทความ/โปรโมชัน
const DETAIL_URL = /\/p\/.+/;

test.describe('Tag Page (Desktop)', () => {

    // pass
    test('Tag_Desktop_001: ตรวจสอบการแสดงรายละเอียดบนหน้า Tag', async () => {
        await expect(tagPage.tag_heading).toBeVisible();
        await expect(tagPage.tag_heading).toContainText('#');
        await expect(tagPage.breadcrumbBlock).toBeVisible();
        await expect(tagPage.listPost_Card).toBeVisible();
        await expect(tagPage.each_PostCard.first()).toBeVisible();
    });

    // Pass
    test('Tag_Desktop_002: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        await expect(tagPage.homeBreadcrumb).toBeVisible();
        await tagPage.homeBreadcrumbLink.click();
        await expect(page).toHaveURL(/^https?:\/\/[^/]+\/?(\?.*)?$/);
    });

    // Pass
    test('Tag_Desktop_003: ตรวจสอบการกดรูปภาพ บนการ์ดโปรโมชัน', async ({ page }) => {
        await skipIfNoCard(tagPage.promotionCard, 'โปรโมชัน');

        await expect(tagPage.coverImg_PromotionCard).toBeVisible();
        await tagPage.coverImg_PromotionCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    // Pass
    test('Tag_Desktop_004: ตรวจสอบการกดชื่อโปรโมชัน บนการ์ดโปรโมชัน', async ({ page }) => {
        await skipIfNoCard(tagPage.promotionCard, 'โปรโมชัน');

        await expect(tagPage.title_PromotionCard).toBeVisible();
        await tagPage.title_PromotionCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    // Pass
    test('Tag_Desktop_005: ตรวจสอบการกดรูปภาพ บนการ์ดบทความ', async ({ page }) => {
        await skipIfNoCard(tagPage.articleCard, 'บทความ');

        await expect(tagPage.coverImg_ArticleCard).toBeVisible();
        await tagPage.coverImg_ArticleCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    // Pass
    test('Tag_Desktop_006: ตรวจสอบการกดชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
        await skipIfNoCard(tagPage.articleCard, 'บทความ');

        await expect(tagPage.title_ArticleCard).toBeVisible();
        await tagPage.title_ArticleCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    // ============================================================
    // Card
    // ============================================================
    // ---------- Like ----------
    // Pass
    test('Tag_Desktop_007: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        const likeBtn = tagPage.lovePromotion_Btn;
        await likeBtn.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });
    //Pass
    test('Tag_Desktop_008: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const likeBtn = tagPage.lovePromotion_Btn;
        const likeIcon = likeBtn.locator('i');

        await ensureLikeOff(likeBtn, likeIcon);

        await likeBtn.click();
        await expect(likeIcon).toHaveClass(/gxBVIB/);
    });

    // Fail
    test('Tag_Desktop_009: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const likeBtn = tagPage.lovePromotion_Btn;
        const likeIcon = likeBtn.locator('i');

        await ensureLikeOff(likeBtn, likeIcon);

        await likeBtn.click();
        await expect(likeIcon).toHaveClass(/gxBVIB/);

        await likeBtn.click();
        await expect(likeIcon).toHaveClass(/cjtKzC/);
    });


    // ---------- Bookmark ----------
    // Pass
    test('Tag_Desktop_010: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        const bookmarkBtn = tagPage.bookmarkPromotion_Btn;
        await bookmarkBtn.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Tag_Desktop_011: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const bookmarkBtn = tagPage.bookmarkPromotion_Btn;
        const bookmarkIcon = bookmarkBtn.locator('i');

        // เตรียมสถานะเริ่มต้นให้เป็น OFF
        await ensureBookmarkOff(bookmarkBtn, bookmarkIcon);

        // กด Bookmark: OFF -> ON
        await bookmarkBtn.click();
        await expect(bookmarkIcon).toHaveClass(/gxBVIB/);
    });
    // Fail
    test('Tag_Desktop_012: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const bookmarkBtn = tagPage.bookmarkPromotion_Btn;
        const bookmarkIcon = bookmarkBtn.locator('i');

        // เตรียมสถานะเริ่มต้นให้เป็น OFF
        await ensureBookmarkOff(bookmarkBtn, bookmarkIcon);

        // กดครั้งแรก: OFF -> ON
        await bookmarkBtn.click();
        await expect(bookmarkIcon).toHaveClass(/gxBVIB/);

        // กดครั้งที่สอง: ON -> OFF
        await bookmarkBtn.click();
        await expect(bookmarkIcon).not.toHaveClass(/gxBVIB/);
    });

    // ============================================================
    //                          Share
    // ============================================================

    // Pass
    test('Author_Desktop_013: ตรวจสอบการกดปุ่ม "Share" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await tagPage.clickShare_Card();
        await expect(tagPage.shareOnFacebook_Btn).toBeVisible();
        await expect(tagPage.shareOnX_Btn).toBeVisible();
        await expect(tagPage.shareOnLine_Btn).toBeVisible();
    });

    // Pass
    test('Author_Desktop_014: ตรวจสอบการกด "Icon Facebook" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await tagPage.clickShare_Card();
        await expect(tagPage.shareOnFacebook_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await tagPage.shareOnFacebook_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/facebook\.com/);
    });

    // Pass
    test('Author_Desktop_015: ตรวจสอบการกด "Icon X" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await tagPage.clickShare_Card();
        await expect(tagPage.shareOnX_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await tagPage.shareOnX_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/x\.com|twitter\.com/);
    });

    // Pass
    test('Author_Desktop_016: ตรวจสอบการกด "Icon Line" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await tagPage.clickShare_Card();
        await expect(tagPage.shareOnLine_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await tagPage.shareOnLine_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/line\.me/);
    });


    test('Tag_Desktop_017: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    test('Tag_Desktop_018: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();

        await expect.poll(async () => {
            return await page.evaluate(() => window.scrollY);
        }).toBeLessThan(100);
    });
});