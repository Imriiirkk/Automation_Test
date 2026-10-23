import { test, expect } from '@playwright/test';
import { ContactPage } from '../../pages/ContactPage';
import { NavbarFooter } from '../../pages/NavbarFooter';

let navbar: NavbarFooter;
let contactPage: ContactPage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    contactPage = new ContactPage(page);

    await navbar.goto();
    await navbar.goToMenu_mobile(navbar.contactMenu_mobile);

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่น ๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Contact Page (Mobile)', () => {
    test.describe('Run test', () => {
        // Pass
        test('Contact_Mobile_001: ตรวจสอบการแสดงรายละเอียดหน้า "ติดต่อเรา"', async ({ page }) => {
            await expect(contactPage.contact_heading).toBeVisible();
        });

        // Pass
        test('Contact_Mobile_002: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
            await contactPage.careerButton.click();
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            await expect(navbar.scrollToTopButton).toBeVisible();
        });

        // Fail
        test('Contact_Mobile_003: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
            await contactPage.careerButton.click();
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();

            await expect.poll(async () => {
                return await page.evaluate(() => window.scrollY);
            }).toBeLessThan(100);
        });

        // Pass
        test('Contact_Mobile_004: ตรวจสอบการแสดง Google map', async ({ page }) => {
            await expect(contactPage.googleMap).toBeVisible();
            const src = await contactPage.googleMap.getAttribute('src');
            expect(src).toContain('google.com/maps/embed');
        });

        // Pass
        test('Contact_Mobile_005: ตรวจสอบการกดปุ่ม "ดูตำแหน่งงานที่เปิดรับสมัคร"', async ({ page }) => {
            await expect(contactPage.careerButton).toBeVisible();
            await contactPage.careerButton.click();
            await expect(page).toHaveURL(/\/jobs/);
        });


        // Pass
        test('Contact_Mobile_006: ตรวจสอบการแสดงรายละเอียดบนหน้า "ร่วมงานกับเรา"', async ({ page }) => {
            await contactPage.careerButton.click();
            await expect(contactPage.career_heading).toBeVisible();
            await expect(contactPage.career_title).toBeVisible();
        });

        // Pass
        test('Contact_Mobile_007: ตรวจสอบการกด Dropdown ของตำแหน่งต่าง ๆ ที่เปิดรับ เพื่อแสดงรายละเอียด', async ({ page }) => {
            await contactPage.careerButton.click();
            await expect(contactPage.positionDropdown.first()).toBeVisible();
            await contactPage.positionDropdown.first().click();
            await expect(contactPage.positionDetail.first()).toBeVisible();
        });

        // Pass
        test('Contact_Mobile_008: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
            await contactPage.careerButton.click();
            await expect(contactPage.homeBreadcrumb).toBeVisible();
            await contactPage.homeBreadcrumbLink.click();
            await expect(page).toHaveURL(/\/$/);
        });
    });

});