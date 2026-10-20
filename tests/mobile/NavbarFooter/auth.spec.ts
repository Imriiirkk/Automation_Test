import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';
import { expectExternalNavigation } from '../../../helper/navigation-helpers';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;
const wrongPassword = 'wrong1234';

test.describe('Authentication', () => {
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();
    });

    // ================================================================
    // Authentication - Login Modal
    // ================================================================
    test.describe('Login Modal', () => {
        test.beforeEach(async () => {
            await navbar.openLoginOrSignup_mobile();
        });

        test('Auth_mobile_001: ตรวจสอบการแสดง Popup เมื่อกดปุ่มเข้าสู่ระบบ/สมัครสมาชิก', async ({ page }) => {
            await expect(navbar.getLoginModalLogo()).toBeVisible();
            await expect(navbar.getLoginModalCloseButton()).toBeVisible();

            const loginSection = navbar.getLoginSocialLoginSection();
            await expect(loginSection).toBeVisible();
            await expect(loginSection).toContainText('Google');
            await expect(loginSection).toContainText('Facebook');

            await expect(navbar.getLoginModalEmailButton()).toBeVisible();
            await expect(navbar.getLoginModalSignupButton()).toBeVisible();
        });

        test('Auth_mobile_002: ตรวจสอบการนำทางไปหน้า Google Login', async ({ page, context }) => {
            await expectExternalNavigation(
                page,
                context,
                () => navbar.auth.loginWithGoogle(),
                ['firebaseapp.com/__/auth/handler', 'providerId=google.com']
            );
        });

        test('Auth_mobile_003: ตรวจสอบการนำทางไปหน้า Facebook Login', async ({ page, context }) => {
            await expectExternalNavigation(
                page,
                context,
                () => navbar.auth.loginWithFacebook(),
                ['firebaseapp.com/__/auth/handler', 'providerId=facebook.com']
            );
        });

        test('Auth_mobile_004: ตรวจสอบการนำทางไปหน้า Email Login', async ({ page }) => {
            await navbar.auth.clickLoginWithEmail();
            await expect(navbar.getLoginEmailForm()).toBeVisible();
        });

        test('Auth_mobile_005: ตรวจสอบการนำทางไปหน้าสมัครสมาชิก', async ({ page }) => {
            await navbar.auth.clickSignupWithEmail();
            await expect(navbar.getSignupEmailForm()).toBeVisible();
        });

        test('Auth_mobile_006: ตรวจสอบการปิด Popup ด้วยปุ่ม X', async ({ page }) => {
            await navbar.auth.closeLoginModal();
            await expect(navbar.getLoginModalLogo()).toBeHidden();
        });

        test('Auth_mobile_009: ตรวจสอบการเข้าสู่ระบบด้วยรหัสผ่านไม่ถูกต้อง', async ({ page }) => {
            await navbar.auth.loginWithEmail(email, wrongPassword);
            await expect(navbar.getLoginError()).toBeVisible();
            await navbar.auth.dismissLoginError();

            await expect(navbar.getLoginError()).toBeHidden();
            await expect(navbar.getLoginEmailForm()).toBeVisible();
        });

        test('Auth_mobile_010: ตรวจสอบการเข้าสู่ระบบโดยไม่กรอกข้อมูล', async ({ page }) => {
            await navbar.auth.clickLoginWithEmail();
            await expect(navbar.getLoginEmailForm()).toBeVisible();
            await navbar.auth.clickLoginSubmit();
            await expect(navbar.getLoginError()).toBeVisible();
            await navbar.auth.dismissLoginError();

            await expect(navbar.getLoginError()).toBeHidden();
            await expect(navbar.getLoginEmailForm()).toBeVisible();
        });
    });

    // ================================================================
    // Authentication - Logged-in State
    // ================================================================
    test.describe('Logged-in State', () => {
        test.beforeEach(async ({ page }) => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.auth.loginWithEmail(email, password);
            await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

            await expect(page).toHaveURL('https://staging-www2.punpro.com/');
            await navbar.dismissAllOverlaysIfPresent();
        });

        test('Auth_mobile_007: ตรวจสอบการแสดงชื่อผู้ใช้แทนปุ่ม Login หลังสำเร็จ', async ({ page }) => {
            await navbar.openMenu_mobile();
            await expect(navbar.getUserDisplayNameMobile()).toBeVisible();
            await expect(navbar.editProfile_mobile).toBeVisible();
        });

        test('Auth_mobile_008: ตรวจสอบการนำทางไปหน้าโปรไฟล์เมื่อกดชื่อผู้ใช้', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.editProfile_mobile);
            await page.waitForURL(/\/profile/, { timeout: 10000 });
            expect(page.url()).toContain('/profile');
        });

        test('Auth_mobile_011: ตรวจสอบการแสดงปุ่ม "ออกจากระบบ" เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.openMenu_mobile();
            await expect(navbar.auth.logoutLink).toBeVisible({ timeout: 10000 });
        });

        test('Auth_mobile_011: ตรวจสอบการออกจากระบบเมื่อกดปุ่มออกจากระบบ', async ({ page }) => {
            await navbar.openMenu_mobile();
            await navbar.auth.logout();
            await page.waitForTimeout(3000);

            await expect(page).toHaveURL('https://staging-www2.punpro.com/');
            await navbar.dismissAllOverlaysIfPresent();
            await navbar.openMenu_mobile();
            await expect(navbar.auth.loginButton_mobile).toBeVisible({ timeout: 10000 });
        });
    });
});