import { test, expect } from '@playwright/test';

test.describe('Tag Page (Mobile)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/brand');
    });

    test('Tag_Mobile_001: ตรวจสอบการแสดงรายละเอียดบนหน้า แบรนด์', async ({ page }) => {
        await expect(page.getByText('แบรนด์')).toBeVisible();

        // TODO: ตรวจสอบรายละเอียดของหน้า
    });

    test('Tag_Mobile_002: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        const breadcrumb = page.getByRole('navigation').getByRole('link').first();

        await expect(breadcrumb).toBeVisible();
        await breadcrumb.click();

        // TODO: expected URL
    });

    test('Tag_Mobile_003: ตรวจสอบการกดรูปภาพ บนการ์ดอีเว้นต์', async ({ page }) => {
        // TODO: locator จาก POM
        const eventCardImage = page.locator('[class*="EventCard"]').first()
            .locator('img');

        await expect(eventCardImage).toBeVisible();
        await eventCardImage.click();

        // TODO: ตรวจสอบ URL
    });

    test('Tag_Mobile_004: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดอีเว้นต์', async ({ page }) => {
        // TODO: locator จาก POM
        const eventTitle = page.locator('[class*="EventCard"]').first()
            .getByRole('link');

        await expect(eventTitle).toBeVisible();
        await eventTitle.click();

        // TODO: ตรวจสอบ URL
    });

    test('Tag_Mobile_005: ตรวจสอบการกดรูปภาพ บนการ์ดโปรโมชัน', async ({ page }) => {
        const promotionImage = page.locator('[class*="PromotionCard"]').first()
            .locator('img');

        await expect(promotionImage).toBeVisible();
        await promotionImage.click();

        // TODO: ตรวจสอบ URL
    });

    test('Tag_Mobile_006: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดโปรโมชัน', async ({ page }) => {
        const promotionTitle = page.locator('[class*="PromotionCard"]').first()
            .getByRole('link');

        await expect(promotionTitle).toBeVisible();
        await promotionTitle.click();

        // TODO: ตรวจสอบ URL
    });

    test('Tag_Mobile_007: ตรวจสอบการกดรูปภาพ บนการ์ดบทความ', async ({ page }) => {
        const articleImage = page.locator('[class*="ArticleCard"]').first()
            .locator('img');

        await expect(articleImage).toBeVisible();
        await articleImage.click();

        // TODO: ตรวจสอบ URL
    });

    test('Tag_Mobile_008: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดบทความ', async ({ page }) => {
        const articleTitle = page.locator('[class*="ArticleCard"]').first()
            .getByRole('link');

        await expect(articleTitle).toBeVisible();
        await articleTitle.click();

        // TODO: ตรวจสอบ URL
    });

    test('Tag_Mobile_009: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        // TODO: กด Like card
        // TODO: ตรวจสอบ Login modal/page
    });

    test('Tag_Mobile_010: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        // TODO: Login
        // TODO: กด Like
        // TODO: ตรวจสอบสถานะ Like
    });

    test('Tag_Mobile_011: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        // TODO: Login
        // TODO: Like
        // TODO: Like ซ้ำ
        // TODO: ตรวจสอบสถานะ
    });

    test('Tag_Mobile_012: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        // TODO
    });

    test('Tag_Mobile_013: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        // TODO: Login + Bookmark
    });

    test('Tag_Mobile_014: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        // TODO: Login + Bookmark ซ้ำ
    });

    test('Tag_Mobile_015: ตรวจสอบการกดปุ่ม "Share" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        // TODO: Login + Share
    });

    test('Tag_Mobile_016: ตรวจสอบการกด "Icon Facebook" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        // TODO
    });

    test('Tag_Mobile_017: ตรวจสอบการกด "Icon X" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        // TODO
    });

    test('Tag_Mobile_018: ตรวจสอบการกด "Icon Line" เพื่อ Share การ์ดต่างๆ', async ({ page }) => {
        // TODO
    });

    test('Tag_Mobile_019: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await expect(page.locator('#btn-scroll-up')).toBeVisible();
    });

    test('Tag_Mobile_020: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await page.locator('#btn-scroll-up').click();

        await expect.poll(async () => {
            return await page.evaluate(() => window.scrollY);
        }).toBeLessThan(100);
    });

});