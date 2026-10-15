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

test.describe('Author Page (Desktop)', () => {

    let authorPage: AuthorPage;
    let navbar: NavbarFooter;
    let articlePage: ArticlePage;

    test.beforeEach(async ({ page }) => {
        authorPage = new AuthorPage(page);
        navbar = new NavbarFooter(page);
        articlePage = new ArticlePage(page);

        await navbar.goto();
        await navbar.goToMenu_desktop('Link to article');
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await articlePage.clickArticleCard_title();
        await articlePage.clickAuthorLink();
        await page.waitForURL(/\/author\/.+/);

        await navbar.dismissAppBannerIfPresent();
        await navbar.dismissCookieBannerIfPresent();
        await navbar.dismissAnchorAdIfPresent();
    });

    // ---------- Author Heading ----------
    // Pass
    test('Author_Desktop_001: ตรวจสอบการแสดงรายละเอียดบนหน้า นักเขียน', async ({ page }) => {
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
    test('Author_Desktop_002: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        await expect(authorPage.homeBreadcrumb).toBeVisible();
        await authorPage.homeBreadcrumbLink.click();
        await expect(page).toHaveURL(/\/$/);
    });

    // ---------- Promotion Card ----------
    // Pass
    test('Author_Desktop_003: ตรวจสอบการกดรูปภาพ บนการ์ดโปรโมชัน', async ({ page }) => {
        await expect(authorPage.promotionCard).toBeVisible();
        await expect(authorPage.coverImg_PromotionCard).toBeVisible();
        await authorPage.coverImg_PromotionCard.click();
        await expect(page).toHaveURL(/\/p\//);
    });

    // Pass
    test('Author_Desktop_004: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดโปรโมชัน', async ({ page }) => {
        await expect(authorPage.promotionCard).toBeVisible();
        await expect(authorPage.title_PromotionCard).toBeVisible();
        await authorPage.title_PromotionCard.click();
        await expect(page).toHaveURL(/\/p\//);
    });

    // ---------- Article Card ----------
    // Pass
    test('Author_Desktop_005: ตรวจสอบการกดรูปภาพ บนการ์ดบทความ', async ({ page }) => {
        await expect(authorPage.articleCard).toBeVisible();
        await expect(authorPage.coverImg_ArticleCard).toBeVisible();
        await authorPage.coverImg_ArticleCard.click();
        await expect(page).toHaveURL(/\/p\//);
    });

    // Pass
    test('Author_Desktop_006: ตรวจสอบการกดชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
        await expect(authorPage.articleCard).toBeVisible();
        await expect(authorPage.title_ArticleCard).toBeVisible();
        await authorPage.title_ArticleCard.click();
        await expect(page).toHaveURL(/\/p\//);
    });

    // ============================================================
    //                          Love
    // ============================================================
    // Pass
    test('Author_Desktop_007: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await expect(authorPage.loveArticle_Btn).toBeVisible();
        await authorPage.loveArticle_Btn.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Author_Desktop_008: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
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
    test('Author_Desktop_009: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
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
    test('Author_Desktop_010: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await expect(authorPage.bookmarkArticle_Btn).toBeVisible();
        await authorPage.bookmarkArticle_Btn.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Author_Desktop_011: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        const bookmarkBtn = authorPage.bookmarkPromotion_Btn;
        const iconBookmark = bookmarkBtn.locator('i');

        await ensureOff(bookmarkBtn);
        await bookmarkBtn.click();
        await expect(iconBookmark).toHaveClass(ICON_ON);

        await ensureOff(bookmarkBtn);
    });

    // Pass
    test('Author_Desktop_012: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        const bookmarkBtn = authorPage.bookmarkPromotion_Btn;
        const iconBookmark = bookmarkBtn.locator('i');

        await ensureOff(bookmarkBtn);
        await bookmarkBtn.click();
        await expect(iconBookmark).toHaveClass(ICON_ON);

        await bookmarkBtn.click();
        await expect(iconBookmark).toHaveClass(ICON_OFF);
    });

    // ============================================================
    //                          Share
    // ============================================================

    // Pass
    test('Author_Desktop_013: ตรวจสอบการกดปุ่ม "Share" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await authorPage.clickShare_Card();
        await expect(authorPage.shareOnFacebook_Btn).toBeVisible();
        await expect(authorPage.shareOnX_Btn).toBeVisible();
        await expect(authorPage.shareOnLine_Btn).toBeVisible();
    });

    // Pass
    test('Author_Desktop_014: ตรวจสอบการกด "Icon Facebook" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await authorPage.clickShare_Card();
        await expect(authorPage.shareOnFacebook_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await authorPage.shareOnFacebook_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/facebook\.com/);
    });

    // Pass
    test('Author_Desktop_015: ตรวจสอบการกด "Icon X" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await authorPage.clickShare_Card();
        await expect(authorPage.shareOnX_Btn).toBeVisible();
        const popupPromise = page.waitForEvent('popup');
        await authorPage.shareOnX_Btn.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/x\.com|twitter\.com/);
    });

    // Pass
    test('Author_Desktop_016: ตรวจสอบการกด "Icon Line" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
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
    test('Author_Desktop_017: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Author_Desktop_018: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {

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

