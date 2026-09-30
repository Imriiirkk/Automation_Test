import { test, expect } from '@playwright/test';

test.describe('Contact Page (Desktop)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/contact');
    });

    // Pass
    test('Contact_Desktop_001: ตรวจสอบการแสดงรายละเอียดหน้า "ติดต่อเรา"', async ({ page }) => {
        await expect(page.getByText('ติดต่อเรา')).toBeVisible();

        // TODO: ตรวจสอบรายละเอียดอื่น ๆ ของหน้า Contact
    });

    // Pass
    test('Contact_Desktop_002: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await expect(
            page.locator('#btn-scroll-up')
        ).toBeVisible();
    });

    // Pass
    test('Contact_Desktop_003: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        const scrollUpButton = page.locator('#btn-scroll-up');

        await expect(scrollUpButton).toBeVisible();
        await scrollUpButton.click();

        await expect.poll(async () => {
            return await page.evaluate(() => window.scrollY);
        }).toBeLessThan(100);
    });

    // Pass
    test('Contact_Desktop_004: ตรวจสอบการนำทางไปที่ Google map', async ({ page }) => {
        const googleMapLink = page.locator('a[href*="google.com/maps"]').first();

        await expect(googleMapLink).toBeVisible();

        const href = await googleMapLink.getAttribute('href');

        expect(href).toContain('google.com/maps');
    });

    // Pass
    test('Contact_Desktop_005: ตรวจสอบการกดปุ่ม "ดูตำแหน่งงานที่สมัคร"', async ({ page }) => {
        const jobButton = page.getByRole('link', {
            name: 'ดูตำแหน่งงานที่สมัคร'
        });

        await expect(jobButton).toBeVisible();
        await jobButton.click();

        await expect(page).toHaveURL(/career|job|jobs/i);
    });

    // Pass
    test('Contact_Desktop_006: ตรวจสอบการแสดงรายละเอียดบนหน้า "ร่วมงานกับเรา"', async ({ page }) => {
        const jobButton = page.getByRole('link', {
            name: 'ดูตำแหน่งงานที่สมัคร'
        });

        await jobButton.click();

        await expect(page.getByText('ร่วมงานกับเรา')).toBeVisible();

        // TODO: ตรวจสอบรายละเอียดอื่น ๆ
    });

    // Pass
    test('Contact_Desktop_007: ตรวจสอบการกด Dropdown ของตำแหน่งต่าง ๆ ที่เปิดรับ เพื่อแสดงรายละเอียด', async ({ page }) => {
        const jobButton = page.getByRole('link', {
            name: 'ดูตำแหน่งงานที่สมัคร'
        });

        await jobButton.click();

        // TODO: ปรับ locator ตาม POM
        const dropdown = page.locator('button').filter({
            hasText: /Developer|Designer|Engineer/
        }).first();

        await dropdown.click();

        // TODO: ตรวจสอบรายละเอียดตำแหน่งงาน
    });

    // Pass
    test('Contact_Desktop_008: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        const breadcrumb = page.getByRole('navigation').getByRole('link').first();

        await expect(breadcrumb).toBeVisible();
        await breadcrumb.click();

        // TODO: เปลี่ยน expected URL ตาม breadcrumb จริง
        await expect(page).toHaveURL(/\/$/);
    });

});