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
            await navbarfooter.openLoginOrSignup_desktop();
        });

        test('Auth_desktop_001: ตรวจสอบการแสดง Popup เมื่อกดปุ่มเข้าสู่ระบบ/สมัครสมาชิก', async () => {
            await expect(navbarfooter.getLoginModalLogo()).toBeVisible();
            await expect(navbarfooter.getLoginModalCloseButton()).toBeVisible();

            const loginSection = navbarfooter.getLoginSocialLoginSection();
            await expect(loginSection).toBeVisible();
            await expect(loginSection).toContainText('Google');
            await expect(loginSection).toContainText('Facebook');

            await expect(navbarfooter.getLoginModalEmailButton()).toBeVisible();
            await expect(navbarfooter.getLoginModalSignupButton()).toBeVisible();
        });

        test('Auth_desktop_002: ตรวจสอบการนำทางไปหน้า Google Login', async ({ page, context }) => {
            await expectExternalNavigation(
                page,
                context,
                () => navbarfooter.auth.loginWithGoogle(),
                ['firebaseapp.com/__/auth/handler', 'providerId=google.com']
            );
        });

        test('Auth_desktop_003: ตรวจสอบการนำทางไปหน้า Facebook Login', async ({ page, context }) => {
            await expectExternalNavigation(
                page,
                context,
                () => navbarfooter.auth.loginWithFacebook(),
                ['firebaseapp.com/__/auth/handler', 'providerId=facebook.com']
            );
        });

        test('Auth_desktop_004: ตรวจสอบการนำทางไปหน้า Email Login', async ({ page }) => {
            await navbarfooter.auth.clickLoginWithEmail();
            await expect(navbarfooter.getLoginEmailForm()).toBeVisible();
        });

        test('Auth_desktop_005: ตรวจสอบการนำทางไปหน้าสมัครสมาชิก', async ({ page }) => {
            await navbarfooter.auth.clickSignupWithEmail();
            await expect(navbarfooter.getSignupEmailForm()).toBeVisible();
        });

        test('Auth_desktop_006: ตรวจสอบการปิด Popup ด้วยปุ่ม X', async ({ page }) => {
            await navbarfooter.auth.closeLoginModal();
            await expect(navbarfooter.getLoginModalLogo()).toBeHidden();
        });

        test('Auth_desktop_009: ตรวจสอบการเข้าสู่ระบบด้วยรหัสผ่านไม่ถูกต้อง', async ({ page }) => {
            await navbarfooter.auth.loginWithEmail(email, WRONG_PASSWORD);
            await expect(navbarfooter.getLoginError()).toBeVisible();
            await navbarfooter.auth.dismissLoginError();

            await expect(navbarfooter.getLoginError()).toBeHidden();
            await expect(navbarfooter.getLoginEmailForm()).toBeVisible();
        });

        test('Auth_desktope_010: ตรวจสอบการเข้าสู่ระบบโดยไม่กรอกข้อมูล', async ({ page }) => {
            await navbarfooter.auth.clickLoginWithEmail();
            await expect(navbarfooter.getLoginEmailForm()).toBeVisible();
            await navbarfooter.auth.clickLoginSubmit();
            await expect(navbarfooter.getLoginError()).toBeVisible();
            await navbarfooter.auth.dismissLoginError();

            await expect(navbarfooter.getLoginError()).toBeHidden();
            await expect(navbarfooter.getLoginEmailForm()).toBeVisible();
        });
    });

    // ================================================================
    // Authentication - Logged-in State
    // ================================================================
    test.describe('Logged-in State', () => {
        test.beforeEach(async ({ page }) => {
            await navbarfooter.openLoginOrSignup_desktop();
            await navbarfooter.auth.loginWithEmail(email, password);
            await expect(navbarfooter.getLoginSuccess()).toBeVisible({ timeout: 10000 });

            await expect(page).toHaveURL('https://staging-www2.punpro.com/');
        });

        test('Auth_desktop_007: ตรวจสอบการแสดงชื่อผู้ใช้แทนปุ่ม Login หลังสำเร็จ', async ({ page }) => {
            await page.waitForTimeout(3000);
            await expect(navbarfooter.getUsernameBlock()).toBeVisible();
        });

        test('Auth_desktop_008: ตรวจสอบการนำทางไปหน้าโปรไฟล์เมื่อกดชื่อผู้ใช้', async ({ page }) => {
            await navbarfooter.goToMenu_desktop(navbarfooter.auth.username);
            await page.waitForURL(/\/bookmark/, { timeout: 10000 });
            expect(page.url()).toContain('/bookmark');
        });

        test('Auth_desktop_012: ตรวจสอบการออกจากระบบเมื่อกดปุ่มออกจากระบบ', async ({ page }) => {
            await navbarfooter.goToMenu_desktop(navbarfooter.auth.username);
            await navbarfooter.auth.logoutInDesktop();
            await page.waitForTimeout(3000);

            await expect(page).toHaveURL('https://staging-www2.punpro.com/');
            await navbarfooter.dismissAllOverlaysIfPresent();
            await expect(navbarfooter.getLoginOrSignupButtonDesktop()).toBeVisible({ timeout: 10000 });
        });
    });
});
