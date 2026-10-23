import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../pages/NavbarFooter';

test.describe('Overlay', () => {
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        await navbar.goto();
    });

    test.describe('Overlay', () => {
        test('Overlay_mobile_001: ตรวจสอบการแสดง App Banner เมื่อเข้าเว็บครั้งแรก', async () => {
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceInLeft/);
            await expect(navbar.appBannerDownloadButton).toBeVisible();
            await expect(navbar.appBannerCloseButton).toBeVisible();
        });

        test('Overlay_desktop_002: ตรวจสอบการนำทางไปยังหน้าแนะนำการดาวน์โหลดแอป เมื่อกด App Banner', async () => {
            await navbar.appBannerDownloadButton.click();
            await expect(navbar.appBannerDownloadButton).toHaveAttribute('href', /app/);
        });

        test('Overlay_mobile_003: ตรวจสอบการปิด App Banner เมื่อกดปุ่มปิด', async () => {
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceInLeft/);
            await navbar.appBannerCloseButton.click();
            await expect(navbar.appBannerAnimatedWrapper).toHaveClass(/animate__bounceOutLeft/);

            await navbar.appBanner.evaluate((el) =>
                new Promise<void>((resolve) => {
                    el.addEventListener('animationend', () => resolve(), { once: true });
                })
            );
        });

        test('Overlay_mobile_004: ตรวจสอบการแสดง Cookie Banner เมื่อเข้าเว็บครั้งแรก', async ({ page }) => {
            await expect(navbar.cookieContainer).toBeVisible({ timeout: 10000 });
            await expect(navbar.cookieAcceptButton).toBeVisible();
        });

        test('Overlay_mobile_005: ตรวจสอบการปิด Cookie Banner เมื่อกดปุ่ม "ยอมรับ"', async ({ page }) => {
            await expect(navbar.cookieContainer).toBeVisible({ timeout: 10000 });
            await navbar.dismissCookieBannerIfPresent();
            await expect(navbar.cookieAcceptButton).toBeHidden();
            await page.reload();
            await expect(navbar.cookieAcceptButton).toBeHidden({ timeout: 5000 });
        });

        test('Overlay_mobile_006: ตรวจสอบการแสดงปุ่มเลื่อนขึ้นบนสุด "^" เมื่อเลื่อนหน้าลง', async ({ page }) => {
            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });

            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });
        });

        test('Overlay_mobile_007: ตรวจสอบการเลื่อนกลับขึ้นบนสุด เมื่อกดปุ่ม "^"', async ({ page }) => {
            await navbar.footerContainer.scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
            await expect(navbar.scrollToTopButton).toBeVisible({ timeout: 5000 });

            await navbar.dismissAllOverlaysIfPresent();
            await page.waitForTimeout(500);

            await navbar.scrollToTopButton.click({ force: true });
            await page.waitForTimeout(1000);
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBe(0);
        });
    });
});