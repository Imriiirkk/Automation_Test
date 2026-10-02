import { test, expect } from '@playwright/test';
import { AuthorPage } from '../../pages/AuthorPage';
import { NavbarFooter } from '../../pages/NavbarFooter';

test.describe('Author Page (Desktop)', () => {

    let authorPage: AuthorPage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        authorPage = new AuthorPage(page);
        navbar = new NavbarFooter(page);

        await page.goto('/author');
    });

    // ---------- Author Heading ----------
    test('Author_Desktop_001: ตรวจสอบการแสดงรายละเอียดบนหน้า นักเขียน', async ({ page }) => {
        await expect(authorPage.author_heading).toBeVisible();
        await expect(authorPage.headLayout).toBeVisible();
        await expect(authorPage.author_title).toBeVisible();

        // ตรวจสอบการแสดงรายการ Post Card
        await expect(authorPage.each_PostCard.first()).toBeVisible();
    });

    // ---------- Breadcrumb ----------
    test('Author_Desktop_002: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        await expect(authorPage.homeBreadcrumb).toBeVisible();

        await authorPage.homeBreadcrumb.click();

        await expect(page).toHaveURL(/\/$/);
    });

    // ---------- Promotion Card ----------
    test('Author_Desktop_003: ตรวจสอบการกดรูปภาพ บนการ์ดโปรโมชัน', async ({ page }) => {
        await expect(authorPage.promotionCard).toBeVisible();
        await expect(authorPage.coverImg_PromotionCard).toBeVisible();

        await authorPage.coverImg_PromotionCard.click();

        await expect(page).toHaveURL(/\/p\//);
    });

    test('Author_Desktop_004: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดโปรโมชัน', async ({ page }) => {
        await expect(authorPage.promotionCard).toBeVisible();
        await expect(authorPage.title_PromotionCard).toBeVisible();

        await authorPage.title_PromotionCard.click();

        await expect(page).toHaveURL(/\/p\//);
    });

    // ---------- Article Card ----------
    test('Author_Desktop_005: ตรวจสอบการกดรูปภาพ บนการ์ดบทความ', async ({ page }) => {
        await expect(authorPage.articleCard).toBeVisible();
        await expect(authorPage.coverImg_ArticleCard).toBeVisible();

        await authorPage.coverImg_ArticleCard.click();

        await expect(page).toHaveURL(/\/p\//);
    });

    test('Author_Desktop_006: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดบทความ', async ({ page }) => {
        await expect(authorPage.articleCard).toBeVisible();
        await expect(authorPage.title_ArticleCard).toBeVisible();

        await authorPage.title_ArticleCard.click();

        await expect(page).toHaveURL(/\/p\//);
    });

    // ============================================================
    // Like
    // ============================================================

    test('Author_Desktop_007: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await expect(authorPage.loveArticle_Btn).toBeVisible();

        await authorPage.loveArticle_Btn.click();

        // ตรวจสอบว่า Login/Signup ถูกเรียก
        await expect(
            page.getByText(/เข้าสู่ระบบ|ลงชื่อเข้าใช้|Login|Sign in/i).first()
        ).toBeVisible();
    });

    test('Author_Desktop_008: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();

        // TODO: ใช้ credentials / login method จริงของโปรเจกต์
        // await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        await authorPage.loveArticle_Btn.click();

        // TODO: ตรวจสอบสถานะ Like หลังจาก Login
        await expect(authorPage.loveArticle_Btn).toBeVisible();
    });

    test('Author_Desktop_009: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();

        // TODO: Login
        // await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        await authorPage.loveArticle_Btn.click();

        // กด Like ซ้ำ
        await authorPage.loveArticle_Btn.click();

        // TODO: ตรวจสอบว่าสถานะ Like ถูกยกเลิก / จำนวน Like กลับมา
        await expect(authorPage.loveArticle_Btn).toBeVisible();
    });

    // ============================================================
    // Bookmark
    // ============================================================

    test('Author_Desktop_010: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await expect(authorPage.bookmarkArticle_Btn).toBeVisible();

        await authorPage.bookmarkArticle_Btn.click();

        await expect(
            page.getByText(/เข้าสู่ระบบ|ลงชื่อเข้าใช้|Login|Sign in/i).first()
        ).toBeVisible();
    });

    test('Author_Desktop_011: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();

        // TODO: Login
        // await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        await authorPage.bookmarkArticle_Btn.click();

        // TODO: ตรวจสอบสถานะ Bookmark
        await expect(authorPage.bookmarkArticle_Btn).toBeVisible();
    });

    test('Author_Desktop_012: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();

        // TODO: Login
        // await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        await authorPage.bookmarkArticle_Btn.click();

        // กด Bookmark ซ้ำ
        await authorPage.bookmarkArticle_Btn.click();

        // TODO: ตรวจสอบว่าสถานะ Bookmark ถูกยกเลิก
        await expect(authorPage.bookmarkArticle_Btn).toBeVisible();
    });

    // ============================================================
    // Share
    // ============================================================

    test('Author_Desktop_013: ตรวจสอบการกดปุ่ม "Share" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();

        // TODO: Login
        // await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        await authorPage.shareArticle_Btn.click();

        await expect(authorPage.shareOnFacebook_Btn).toBeVisible();
        await expect(authorPage.shareOnX_Btn).toBeVisible();
        await expect(authorPage.shareOnLine_Btn).toBeVisible();
    });

    test('Author_Desktop_014: ตรวจสอบการกด "Icon Facebook" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();

        // TODO: Login
        // await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        await authorPage.shareArticle_Btn.click();

        await expect(authorPage.shareOnFacebook_Btn).toBeVisible();

        await authorPage.shareOnFacebook_Btn.click();

        // TODO: ตรวจสอบการเปิด Facebook Share
    });

    test('Author_Desktop_015: ตรวจสอบการกด "Icon X" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();

        // TODO: Login
        // await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        await authorPage.shareArticle_Btn.click();

        await expect(authorPage.shareOnX_Btn).toBeVisible();

        await authorPage.shareOnX_Btn.click();

        // TODO: ตรวจสอบการเปิด X Share
    });

    test('Author_Desktop_016: ตรวจสอบการกด "Icon Line" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();

        // TODO: Login
        // await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);

        await authorPage.shareArticle_Btn.click();

        await expect(authorPage.shareOnLine_Btn).toBeVisible();

        await authorPage.shareOnLine_Btn.click();

        // TODO: ตรวจสอบการเปิด LINE Share
    });

    // ============================================================
    // Scroll to Top
    // ============================================================

    test('Author_Desktop_017: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        const scrollUpButton = page.locator('#btn-scroll-up');

        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await expect(scrollUpButton).toBeVisible();
    });

    test('Author_Desktop_018: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        const scrollUpButton = page.locator('#btn-scroll-up');

        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await expect(scrollUpButton).toBeVisible();

        await scrollUpButton.click();

        await expect.poll(async () => {
            return await page.evaluate(() => window.scrollY);
        }).toBeLessThan(100);
    });

});
