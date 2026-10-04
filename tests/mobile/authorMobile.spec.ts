import { test, expect, Locator } from '@playwright/test';
import { AuthorPage } from '../../pages/AuthorPage';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { ArticlePage } from '../../pages/ArticlePage';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

const ICON_OFF = /cjtKzC/; // ยังไม่กด
const ICON_ON = /gxBVIB/;  // กดแล้ว

async function ensureOff(btn: Locator) {
    const icon = btn.locator('i');

    if (ICON_ON.test((await icon.getAttribute('class')) ?? '')) {
        await btn.click();
    }

    await expect(icon).toHaveClass(ICON_OFF, { timeout: 10000 });
}

test.describe('Author Page (Mobile)', () => {

    let authorPage: AuthorPage;
    let navbar: NavbarFooter;
    let articlePage: ArticlePage;

    test.beforeEach(async ({ page }) => {
        authorPage = new AuthorPage(page);
        navbar = new NavbarFooter(page);
        articlePage = new ArticlePage(page);

        await navbar.goto();
        // await navbar.goToMenu_desktop('Link to article');
        await navbar.goToMenu_mobile(navbar.articleMenu_mobile);
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await articlePage.clickArticleCard_title();
        await articlePage.clickAuthorLink();
        await page.waitForURL(/\/author\/[a-zA-Z0-9-_]+/, { timeout: 10000 });

        await navbar.dismissAppBannerIfPresent();
        await navbar.dismissCookieBannerIfPresent();
        await navbar.dismissAnchorAdIfPresent();
    });

    // ---------- Author Heading ----------
    // Pass
    test('Author_Mobile_001: ตรวจสอบการแสดงรายละเอียดบนหน้า นักเขียน', async ({ page }) => {
        await expect(authorPage.author_title).toBeVisible();
        await expect(authorPage.homeBreadcrumb).toBeVisible();
        await expect(authorPage.authorBreadcrumb).toBeVisible();
        await expect(authorPage.headLayout).toBeVisible();
        await expect(authorPage.author_heading).toBeVisible();
        const cardCount = await authorPage.each_PostCard.count();
        expect(cardCount).toBeGreaterThan(0);
        expect(cardCount).toBeLessThanOrEqual(12);
        await expect(authorPage.articleCard).toBeVisible();
        await expect(authorPage.promotionCard).toBeVisible();
    });

    // ---------- Breadcrumb ----------
    // Pass
    test('Author_Mobile_002: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        await expect(authorPage.homeBreadcrumb).toBeVisible();
        await authorPage.homeBreadcrumbLink.click();
        await expect(page).toHaveURL(/\/$/);
    });

    // ---------- Promotion Card ----------
    // Pass
    test('Author_Mobile_003: ตรวจสอบการกดรูปภาพ บนการ์ดโปรโมชัน', async ({ page }) => {
        await expect(authorPage.promotionCard).toBeVisible();
        await expect(authorPage.coverImg_PromotionCard).toBeVisible();
        await authorPage.coverImg_PromotionCard.click();
        await expect(page).toHaveURL(/\/p\//);
    });

    // Pass
    test('Author_Mobile_004: ตรวจสอบการกดชื่อโปรโมชั่น บนการ์ดโปรโมชัน', async ({ page }) => {
        await expect(authorPage.promotionCard).toBeVisible();
        await expect(authorPage.title_PromotionCard).toBeVisible();
        await authorPage.title_PromotionCard.click();
        await expect(page).toHaveURL(/\/p\//);
    });

    // ---------- Article Card ----------
    // Pass
    test('Author_Mobile_005: ตรวจสอบการกดรูปภาพ บนการ์ดบทความ', async ({ page }) => {
        await expect(authorPage.articleCard).toBeVisible();
        await expect(authorPage.coverImg_ArticleCard).toBeVisible();
        await authorPage.coverImg_ArticleCard.click();
        await expect(page).toHaveURL(/\/p\//);
    });

    // Pass
    test('Author_Mobile_006: ตรวจสอบการกดชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
        await expect(authorPage.articleCard).toBeVisible();
        await expect(authorPage.title_ArticleCard_Mobile).toBeVisible();
        await authorPage.title_ArticleCard_Mobile.click();
        await expect(page).toHaveURL(/\/p\//);
    });

    // ============================================================
    //                          Love
    // ============================================================
    // Pass
    test('Author_Mobile_007: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await expect(authorPage.loveArticle_Btn).toBeVisible();
        await authorPage.loveArticle_Btn.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Author_Mobile_008: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const loveBtn = authorPage.lovePromotion_Btn;
        const iconLove = loveBtn.locator('i');

        // เตรียมสถานะเริ่มต้นให้เป็น Like OFF
        await ensureOff(loveBtn);

        // กด Like
        await loveBtn.click();

        // ตรวจสอบว่า Like เปลี่ยนเป็น ON
        await expect
            .poll(async () => await iconLove.getAttribute('class'), {
                timeout: 10000,
            })
            .toContain('gxBVIB');

        // คืนสถานะกลับเป็น OFF
        await ensureOff(loveBtn);
    });

    // Pass
    test('Author_Mobile_009: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        const loveBtn = authorPage.lovePromotion_Btn;
        const iconLove = loveBtn.locator('i');

        // เตรียมสถานะเริ่มต้นให้เป็น Like OFF
        await ensureOff(loveBtn);

        // กด Like ครั้งที่ 1
        await loveBtn.click();

        await expect
            .poll(async () => await iconLove.getAttribute('class'), {
                timeout: 10000,
            })
            .toContain('gxBVIB');

        // กด Like ครั้งที่ 2
        await loveBtn.click();

        // ตรวจสอบว่า Like กลับเป็น OFF
        await expect
            .poll(async () => await iconLove.getAttribute('class'), {
                timeout: 10000,
            })
            .toContain('cjtKzC');
    });

    // ============================================================
    //                          Bookmark
    // ============================================================

    // Pass
    test('Author_Mobile_010: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await expect(authorPage.bookmarkArticle_Btn).toBeVisible();
        await authorPage.bookmarkArticle_Btn.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Author_Mobile_011: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        const bookmarkBtn = authorPage.bookmarkPromotion_Btn;
        const icon = bookmarkBtn.locator('i');

        if ((await icon.getAttribute('class'))?.includes('gxBVIB')) {
            await bookmarkBtn.click();
            await expect(icon).toHaveClass(/cjtKzC/);
        }
        await bookmarkBtn.click();
        await expect(icon).toHaveClass(/gxBVIB/);
    });

    // Pass
    test('Author_Mobile_012: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        const bookmarkBtn = authorPage.bookmarkPromotion_Btn;
        const icon = bookmarkBtn.locator('i');

        if ((await icon.getAttribute('class'))?.includes('gxBVIB')) {
            await bookmarkBtn.click();
            await expect(icon).toHaveClass(/cjtKzC/);
        }
        await bookmarkBtn.click();
        await expect(icon).toHaveClass(/gxBVIB/);

        await bookmarkBtn.click();
        await expect
            .poll(async () => await icon.getAttribute('class'), {
                timeout: 10000,
            })
            .toContain('cjtKzC');
    });

    // ============================================================
    //                          Share
    // ============================================================
    // Pass
    test('Author_Mobile_013: ตรวจสอบการกดปุ่ม "Share" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await authorPage.clickShare_Card();
        await expect(authorPage.shareOnFacebook_Btn).toBeVisible();
        await expect(authorPage.shareOnX_Btn).toBeVisible();
        await expect(authorPage.shareOnLine_Btn).toBeVisible();
    });

    // Pass
    test('Author_Mobile_014: ตรวจสอบการกด "Icon Facebook" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await authorPage.clickShare_Card();
        await expect(authorPage.shareOnFacebook_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await authorPage.shareOnFacebook_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/facebook\.com/);
    });

    // Pass
    test('Author_Mobile_015: ตรวจสอบการกด "Icon X" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await authorPage.clickShare_Card();
        await expect(authorPage.shareOnX_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await authorPage.shareOnX_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/x\.com|twitter\.com/);
    });

    // Pass
    test('Author_Mobile_016: ตรวจสอบการกด "Icon Line" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await authorPage.clickShare_Card();
        await expect(authorPage.shareOnLine_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await authorPage.shareOnLine_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/line\.me/);
    });

    // ============================================================
    //                          Scroll to Top
    // ============================================================

    // Pass
    test('Author_Mobile_017: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Author_Mobile_018: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {

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

