import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';
import { expectExternalNavigation } from '../../../helper/navigation-helpers';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;
const WRONG_PASSWORD = 'wrong1234';

test.describe('Authentication', () => {
    let navbarfooter: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        navbarfooter = new NavbarFooter(page);
        await navbarfooter.goto();
        await navbarfooter.dismissAllOverlaysIfPresent();
    });

    // ================================================================
    // Authentication - Login Modal
    // ================================================================
    test.describe('Login Modal', () => {
        test.beforeEach(async () => {
            await navbarfooter.openLoginOrSignup_mobile();
        });

        test('Auth_mobile_001: ตรวจสอบการแสดง Popup เมื่อกดปุ่มเข้าสู่ระบบ/สมัครสมาชิก', async ({ page }) => {
            await expect(navbarfooter.loginModalLogo).toBeVisible();
            await expect(navbarfooter.loginModalCloseButton).toBeVisible();

            const loginSection = navbarfooter.loginSocialLoginSection;
            await expect(loginSection).toBeVisible();
            await expect(loginSection).toContainText('Google');
            await expect(loginSection).toContainText('Facebook');

            await expect(navbarfooter.loginModalEmailButton).toBeVisible();
            await expect(navbarfooter.loginModalSignupButton).toBeVisible();
        });

        test('Auth_mobile_002: ตรวจสอบการนำทางไปหน้า Google Login', async ({ page, context }) => {
            const googleButton = navbarfooter.loginSocialLoginSection.getByRole('button', { name: /google/i });
            await expectExternalNavigation(page, context, () => googleButton.click(), ['firebaseapp.com/__/auth/handler', 'providerId=google.com']);
        });

        test('Auth_mobile_003: ตรวจสอบการนำทางไปหน้า Facebook Login', async ({ page, context }) => {
            const facebookButton = navbarfooter.loginSocialLoginSection.getByRole('button', { name: /facebook/i });
            await expectExternalNavigation(page, context, () => facebookButton.click(), ['firebaseapp.com/__/auth/handler', 'providerId=facebook.com']);
        });

        test('Auth_mobile_004: ตรวจสอบการนำทางไปหน้า Email Login', async ({ page }) => {
            await navbarfooter.loginModalEmailButton.click();
            await expect(navbarfooter.loginEmailForm).toBeVisible();
        });

        test('Auth_mobile_005: ตรวจสอบการนำทางไปหน้าสมัครสมาชิก', async ({ page }) => {
            await navbarfooter.loginModalSignupButton.click();
            await expect(navbarfooter.signupForm).toBeVisible();
        });

        test('Auth_mobile_006: ตรวจสอบการปิด Popup ด้วยปุ่ม X', async ({ page }) => {
            await navbarfooter.loginModalCloseButton.click();
            await expect(navbarfooter.loginModalLogo).toBeHidden();
        });

        test('Auth_mobile_009: ตรวจสอบการเข้าสู่ระบบด้วยรหัสผ่านไม่ถูกต้อง', async ({ page }) => {
            await navbarfooter.loginWithEmail(email, WRONG_PASSWORD);
            await expect(navbarfooter.loginErrorText).toBeVisible();
            await navbarfooter.loginErrorOkButton.click();

            await expect(navbarfooter.loginErrorText).toBeHidden();
            await expect(navbarfooter.loginEmailForm).toBeVisible();
        });

        test('Auth_mobile_010: ตรวจสอบการเข้าสู่ระบบโดยไม่กรอกข้อมูล', async ({ page }) => {
            await navbarfooter.loginModalEmailButton.click();
            await expect(navbarfooter.loginEmailForm).toBeVisible();
            await navbarfooter.loginSubmitButton.click();
            await expect(navbarfooter.loginErrorText).toBeVisible();
            await navbarfooter.loginErrorOkButton.click();

            await expect(navbarfooter.loginErrorText).toBeHidden();
            await expect(navbarfooter.loginEmailForm).toBeVisible();
        });
    });

    // ================================================================
    // Authentication - Logged-in State
    // ================================================================
    test.describe('Logged-in State', () => {
        test.beforeEach(async ({ page }) => {
            await navbarfooter.openLoginOrSignup_mobile();
            await navbarfooter.loginWithEmail(email, password);
            await expect(navbarfooter.loginSuccessDialog).toBeVisible({ timeout: 10000 });

            await expect(page).toHaveURL('https://staging-www2.punpro.com/');
            await navbarfooter.openMenu_mobile();
        });

        test('Auth_mobile_007: ตรวจสอบการแสดงชื่อผู้ใช้แทนปุ่ม Login หลังสำเร็จ', async ({ page }) => {
            await expect(page.locator('div').filter({ hasText: 'tester Punproแก้ไขโปรไฟล์' }).last()).toBeVisible();
        });

        test('Auth_mobile_008: ตรวจสอบการนำทางไปหน้าโปรไฟล์เมื่อกดชื่อผู้ใช้', async ({ page }) => {
            await navbarfooter.goToMenu_mobile(navbarfooter.editProfile_mobile);
            await page.waitForURL(/\/profile/, { timeout: 10000 });
            expect(page.url()).toContain('/profile');
        });

        test('Auth_mobile_011: ตรวจสอบการแสดงปุ่ม "ออกจากระบบ" เมื่อ login แล้ว', async ({ page }) => {
            await expect(navbarfooter.logoutLink).toBeVisible();
        });

        test('Auth_mobile_012: ตรวจสอบการออกจากระบบ เมื่อกดปุ่ม "ออกจากระบบ"', async ({ page }) => {
            await navbarfooter.logout();

            await expect(page).toHaveURL('https://staging-www2.punpro.com/');
            await navbarfooter.dismissCookieBannerIfPresent();
            await navbarfooter.dismissAnchorAdIfPresent();
            await navbarfooter.openMenu_mobile();
            await expect(navbarfooter.loginButton_mobile).toBeVisible({ timeout: 10000 });
        });
    });

    // ================================================================
    // Social Media Links - Footer
    // ================================================================
    test.describe('Social Media Links - Footer', () => {
        test('Social_mobile_001: ตรวจสอบการนำทางไปหน้า Facebook ของปันโปร', async ({ page, context }) => {
            await navbarfooter.footerFacebookLink.scrollIntoViewIfNeeded();
            await expectExternalNavigation(page, context, () => navbarfooter.footerFacebookLink.click(), ['facebook.com']);
        });

        test('Social_mobile_002: ตรวจสอบการนำทางไปหน้า Instagram ของปันโปร', async ({ page, context }) => {
            await navbarfooter.footerInstagramLink.scrollIntoViewIfNeeded();
            await expectExternalNavigation(page, context, () => navbarfooter.footerInstagramLink.click(), ['instagram.com']);
        });

        test('Social_mobile_003: ตรวจสอบการนำทางไปหน้า X ของปันโปร', async ({ page, context }) => {
            await navbarfooter.footerXLink.scrollIntoViewIfNeeded();
            await expectExternalNavigation(page, context, () => navbarfooter.footerXLink.click(), ['x.com']);
        });

        test('Social_mobile_004: ตรวจสอบการนำทางไปช่อง YouTube ของปันโปร', async ({ page, context }) => {
            await navbarfooter.footerYoutubeLink.scrollIntoViewIfNeeded();
            await expectExternalNavigation(page, context, () => navbarfooter.footerYoutubeLink.click(), ['youtube.com']);
        });
    });
});