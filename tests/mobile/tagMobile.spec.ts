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

const ICON_OFF = /cjtKzC/;
const ICON_ON = /gxBVIB/;

async function ensureLikeOff(btn: Locator) {
    const icon = btn.locator('i');

    if (ICON_ON.test((await icon.getAttribute('class')) ?? '')) {
        await btn.click();
        await expect(icon).toHaveClass(ICON_OFF);
    }
}

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    tagPage = new TagPage(page);
    promotionPage = new PromotionPage(page);

    // await page.goto(TAG_PATH);
    // await expect(page).toHaveURL(/\/tag\/.+/);

    await navbar.goto();
    await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
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

test.describe('Tag Page (Mobile)', () => {
    // pass
    test('Tag_Mobile_001: ตรวจสอบการแสดงรายละเอียดบนหน้า Tag', async () => {
        await expect(tagPage.tag_heading).toBeVisible();
        await expect(tagPage.tag_heading).toContainText('#');
        await expect(tagPage.breadcrumbBlock).toBeVisible();
        await expect(tagPage.listPost_Card).toBeVisible();
        await expect(tagPage.each_PostCard.first()).toBeVisible();
    });

    // Pass
    test('Tag_Mobile_002: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        await expect(tagPage.homeBreadcrumb).toBeVisible();
        await tagPage.homeBreadcrumbLink.click();
        await expect(page).toHaveURL(/^https?:\/\/[^/]+\/?(\?.*)?$/);
    });

    // Pass
    test('Tag_Mobile_003: ตรวจสอบการกดรูปภาพ บนการ์ดโปรโมชัน', async ({ page }) => {
        await skipIfNoCard(tagPage.promotionCard, 'โปรโมชัน');

        await expect(tagPage.coverImg_PromotionCard).toBeVisible();
        await tagPage.coverImg_PromotionCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    // Pass
    test('Tag_Mobile_004: ตรวจสอบการกดชื่อโปรโมชัน บนการ์ดโปรโมชัน', async ({ page }) => {
        await skipIfNoCard(tagPage.promotionCard, 'โปรโมชัน');

        await expect(tagPage.title_PromotionCard).toBeVisible();
        await tagPage.title_PromotionCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    // Pass
    test('Tag_Mobile_005: ตรวจสอบการกดรูปภาพ บนการ์ดบทความ', async ({ page }) => {
        await skipIfNoCard(tagPage.articleCard, 'บทความ');

        await expect(tagPage.coverImg_ArticleCard).toBeVisible();
        await tagPage.coverImg_ArticleCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    // Pass
    test('Tag_Mobile_006: ตรวจสอบการกดชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
        await skipIfNoCard(tagPage.articleCard, 'บทความ');

        await expect(tagPage.title_ArticleCard).toBeVisible();
        await tagPage.title_ArticleCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    // ============================================================
    // Card
    // ============================================================
    // ---------- Like ----------
    test.describe('Run test', () => {
        test('Tag_Mobile_007: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
            const likeBtn = tagPage.lovePromotion_Btn;
            await likeBtn.click();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        test('Tag_Mobile_008: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

            const likeBtn = tagPage.lovePromotion_Btn;
            const likeIcon = likeBtn.locator('i');

            if ((await likeIcon.getAttribute('class'))?.includes('gxBVIB')) {
                await likeBtn.click();
                await expect(likeIcon).toHaveClass(/cjtKzC/);
            }

            await likeBtn.click();
            await expect(likeIcon).toHaveClass(/gxBVIB/);
        });


        test('Tag_Mobile_009: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

            const likeBtn = tagPage.lovePromotion_Btn;
            const likeIcon = likeBtn.locator('i');

            if ((await likeIcon.getAttribute('class'))?.includes('gxBVIB')) {
                await likeBtn.click();
                await expect(likeIcon).toHaveClass(/cjtKzC/);
            }

            await likeBtn.click();
            await expect(likeIcon).toHaveClass(/gxBVIB/);

            await likeBtn.click();
            await expect
                .poll(async () => await likeIcon.getAttribute('class'), {
                    timeout: 10000,
                })
                .toContain('cjtKzC');
        });


        // ---------- Bookmark ----------

        test('Tag_Mobile_010: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
            const bookmarkBtn = tagPage.bookmarkPromotion_Btn;
            await bookmarkBtn.click();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });


        test('Tag_Mobile_011: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

            const bookmarkBtn = tagPage.bookmarkPromotion_Btn;
            const bookmarkIcon = bookmarkBtn.locator('i');

            if ((await bookmarkIcon.getAttribute('class'))?.includes('gxBVIB')) {
                await bookmarkBtn.click();
                await expect(bookmarkIcon).toHaveClass(/cjtKzC/);
            }

            await bookmarkBtn.click();
            await expect(bookmarkIcon).toHaveClass(/gxBVIB/);
        });

        test('Tag_Mobile_012: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

            const bookmarkBtn = tagPage.bookmarkPromotion_Btn;
            const bookmarkIcon = bookmarkBtn.locator('i');

            if ((await bookmarkIcon.getAttribute('class'))?.includes('gxBVIB')) {
                await bookmarkBtn.click();
                await expect(bookmarkIcon).toHaveClass(/cjtKzC/);
            }

            await bookmarkBtn.click();
            await expect(bookmarkIcon).toHaveClass(/gxBVIB/);

            await bookmarkBtn.click();
            await expect(bookmarkIcon).toHaveClass(/cjtKzC/);
        });
    });

    // ============================================================
    //                          Share
    // ============================================================

    // Pass
    test('Author_Mobile_013: ตรวจสอบการกดปุ่ม "Share" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await tagPage.clickShare_Card();
        await expect(tagPage.shareOnFacebook_Btn).toBeVisible();
        await expect(tagPage.shareOnX_Btn).toBeVisible();
        await expect(tagPage.shareOnLine_Btn).toBeVisible();
    });

    // Pass
    test('Author_Mobile_014: ตรวจสอบการกด "Icon Facebook" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await tagPage.clickShare_Card();
        await expect(tagPage.shareOnFacebook_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await tagPage.shareOnFacebook_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/facebook\.com/);
    });

    // Pass
    test('Author_Mobile_015: ตรวจสอบการกด "Icon X" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await tagPage.clickShare_Card();
        await expect(tagPage.shareOnX_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await tagPage.shareOnX_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/x\.com|twitter\.com/);
    });

    // Pass
    test('Author_Mobile_016: ตรวจสอบการกด "Icon Line" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await tagPage.clickShare_Card();
        await expect(tagPage.shareOnLine_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await tagPage.shareOnLine_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/line\.me/);
    });

    // Pass
    test('Tag_Mobile_017: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); });
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Tag_Mobile_018: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); });
        await expect(navbar.scrollToTopButton).toBeVisible();
        await page.waitForTimeout(1000);
        await navbar.scrollToTopButton.dispatchEvent('click'); // desktop ใช้ dispatchEvent เพราะ click ปกติไม่เสถียร
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });
});