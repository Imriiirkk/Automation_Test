import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/Contact';
import { NavbarFooter } from '../../pages/NavbarFooter';

let navbar: NavbarFooter;
let contact: ContactPage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    contact = new ContactPage(page);

    await navbar.goto();
    await navbar.goToMenu_desktop('Link to contact');

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่น ๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Contact Page (Desktop)', () => {

    //
    test('Contact_Desktop_001: ตรวจสอบการแสดงรายละเอียดหน้า "ติดต่อเรา"', async ({ page }) => {
        await expect(contact.contact_heading).toBeVisible();
    });

    //
    test('Contact_Desktop_002: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    //
    test('Contact_Desktop_003: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();

        await expect.poll(async () => {
            return await page.evaluate(() => window.scrollY);
        }, { timeout: 5000 }).toBe(0);
    });

    //
    test('Contact_Desktop_004: ตรวจสอบการนำทางไปที่ Google map', async ({ page }) => {
        await expect(contact.googleMap_Link).toBeVisible();

        const href = await contact.googleMap_Link.getAttribute('href');

        expect(href).toContain('google.com/maps');
    });

    //
    test('Contact_Desktop_005: ตรวจสอบการกดปุ่ม "ดูตำแหน่งงานที่เปิดรับสมัคร"', async ({ page }) => {
        await expect(contact.careerButton).toBeVisible();

        await contact.careerButton.click();

        await expect(page).toHaveURL(/\/jobs/);
    });

    //
    test('Contact_Desktop_006: ตรวจสอบการแสดงรายละเอียดบนหน้า "ร่วมงานกับเรา"', async ({ page }) => {
        await contact.careerButton.click();

        await expect(contact.career_heading).toBeVisible();
        await expect(contact.career_title).toBeVisible();
    });

    //
    test('Contact_Desktop_007: ตรวจสอบการกด Dropdown ของตำแหน่งต่าง ๆ ที่เปิดรับ เพื่อแสดงรายละเอียด', async ({ page }) => {
        await contact.careerButton.click();

        // ตรวจสอบว่ามีตำแหน่งงาน
        await expect(contact.positionDropdown.first()).toBeVisible();

        // กดตำแหน่งแรก
        await contact.positionDropdown.first().click();

        // ตรวจสอบรายละเอียดตำแหน่งแรก
        await expect(contact.positionDetail.first()).toBeVisible();
    });

    //
    test('Contact_Desktop_008: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        // ไปหน้า Career ก่อน
        await contact.careerButton.click();

        // Breadcrumb "หน้าแรก"
        await expect(contact.homeBreadcrumb).toBeVisible();

        await contact.homeBreadcrumb.click();

        await expect(page).toHaveURL(/\/$/);
    });

});