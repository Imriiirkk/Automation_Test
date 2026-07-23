import { test, expect, Page, BrowserContext } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';

const VALID_EMAIL = 'testerpunpro02@hotmail.com';
const VALID_PASSWORD = '123456';
const WRONG_PASSWORD = 'wrong1234';

//================================================================
// เช็คการนำทางไปหน้าภายนอก (เปิด tab/popup ใหม่ แบบ https ปกติ)
//================================================================
async function expectExternalNavigation(
    page: Page,
    context: BrowserContext,
    trigger: () => Promise<void>,
    expectedUrlParts: string[] // รับ 1 หรือหลาย substring ที่ต้อง contain
) {
    const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);
    await trigger();
    const popup = await popupPromise;

    expect(popup).not.toBeNull();
    await popup!.waitForLoadState('domcontentloaded');

    const popupUrl = popup!.url();
    for (const part of expectedUrlParts) {
        expect(popupUrl).toContain(part);
    }

    await popup!.close();
}

test.describe('Navbar', () => {

    // ================================================================
    // Authentication - Login Modal
    // ================================================================

    // test.describe('Authentication - Login Modal', () => {
    //     let navbar: NavbarFooter;

    //     test.beforeEach(async ({ page }) => {
    //         navbar = new NavbarFooter(page);
    //         await navbar.goto();
    //         await navbar.openLoginOrSignup_mobile();
    //     });

    //     test('Auth_mobile_001: ตรวจสอบการแสดง Popup เมื่อกดปุ่มเข้าสู่ระบบ/สมัครสมาชิก', async ({ page }) => {
    //         await expect(navbar.loginModalLogo).toBeVisible();
    //         await expect(navbar.loginModalCloseButton).toBeVisible();

    //         const loginSection = navbar.loginSocialLoginSection;
    //         await expect(loginSection).toBeVisible();
    //         await expect(loginSection).toContainText('Google');
    //         await expect(loginSection).toContainText('Facebook');

    //         await expect(navbar.loginModalEmailButton).toBeVisible();
    //         await expect(navbar.loginModalSignupButton).toBeVisible();
    //     });

    //     test('Auth_mobile_002: นำทางไปหน้า Google Login', async ({ page, context }) => {
    //         const googleButton = navbar.loginSocialLoginSection.getByRole('button', { name: /google/i });
    //         await expectExternalNavigation(page, context, () => googleButton.click(), ['firebaseapp.com/__/auth/handler', 'providerId=google.com']);
    //     });

    //     test('Auth_mobile_003: นำทางไปหน้า Facebook Login', async ({ page, context }) => {
    //         const facebookButton = navbar.loginSocialLoginSection.getByRole('button', { name: /facebook/i });
    //         await expectExternalNavigation(page, context, () => facebookButton.click(), ['firebaseapp.com/__/auth/handler', 'providerId=facebook.com']);
    //     });

    //     test('Auth_mobile_004: นำทางไปหน้า Email Login', async ({ page }) => {
    //         await navbar.loginModalEmailButton.click();
    //         await expect(navbar.loginEmailForm).toBeVisible();
    //     });

    //     test('Auth_mobile_005: นำทางไปหน้าสมัครสมาชิก', async ({ page }) => {
    //         await navbar.loginModalSignupButton.click();
    //         await expect(navbar.signupForm).toBeVisible();
    //     });

    //     test('Auth_mobile_006: ปิด Popup ด้วยปุ่ม X', async ({ page }) => {
    //         await navbar.loginModalCloseButton.click();
    //         await expect(navbar.loginModalLogo).toBeHidden();
    //     });

    //     test('Auth_mobile_009: เข้าสู่ระบบด้วยรหัสผ่านไม่ถูกต้อง', async ({ page }) => {
    //         await navbar.loginWithEmail(VALID_EMAIL, WRONG_PASSWORD);
    //         await expect(navbar.loginErrorText).toBeVisible();
    //         await navbar.loginErrorOkButton.click();

    //         await expect(navbar.loginErrorText).toBeHidden();
    //         await expect(navbar.loginEmailForm).toBeVisible();
    //     });

    //     test('Auth_mobile_010: เข้าสู่ระบบโดยไม่กรอกข้อมูล', async ({ page }) => {
    //         await navbar.loginModalEmailButton.click();
    //         await expect(navbar.loginEmailForm).toBeVisible();
    //         await navbar.loginSubmitButton.click();
    //         await expect(navbar.loginErrorText).toBeVisible();
    //         await navbar.loginErrorOkButton.click();

    //         await expect(navbar.loginErrorText).toBeHidden();
    //         await expect(navbar.loginEmailForm).toBeVisible();
    //     });
    // });

    // ================================================================
    // Authentication - Logged-in State
    // ================================================================
    // test.describe('Authentication - Logged-in State', () => {
    //     let navbar: NavbarFooter;

    //     test.beforeEach(async ({ page }) => {
    //         navbar = new NavbarFooter(page);
    //         await navbar.goto();
    //         await navbar.openLoginOrSignup_mobile();
    //         await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
    //         await expect(navbar.loginSuccessDialog).toBeVisible({ timeout: 10000 });

    //         await expect(page).toHaveURL('https://www.punpro.com/');
    //         await navbar.openMenu_mobile();
    //     });

    //     test('Auth_mobile_007: แสดงชื่อผู้ใช้แทนปุ่ม Login หลังสำเร็จ', async ({ page }) => {
    //         await expect(page.locator('div').filter({ hasText: 'tester Punproแก้ไขโปรไฟล์' }).last()).toBeVisible();
    //     });

    //     test('Auth_mobile_008: นำทางไปหน้าโปรไฟล์เมื่อกดชื่อผู้ใช้', async ({ page }) => {
    //         await page.getByRole('link', { name: 'แก้ไขโปรไฟล์' }).click();
    //         await page.waitForURL(/\/profile/, { timeout: 10000 });
    //         expect(page.url()).toContain('/profile');
    //     });

    //     test('Auth_mobile_011: แสดงปุ่มออกจากระบบเมื่อ login แล้ว', async ({ page }) => {
    //         await expect(navbar.logoutLink).toBeVisible();
    //     });

    //     test('Auth_mobile_012: ออกจากระบบเมื่อกดปุ่มออกจากระบบ', async ({ page }) => {
    //         await navbar.logout();

    //         await expect(page).toHaveURL('https://www.punpro.com/');
    //         await navbar.dismissCookieBannerIfPresent();
    //         await navbar.dismissAnchorAdIfPresent();
    //         await navbar.openMenu_mobile();
    //         await expect(navbar.loginButton_mobile).toBeVisible({ timeout: 10000 });
    //     });
    // });

    // ================================================================
    // Social Media Links - Footer
    // ================================================================
    // test.describe('Social Media Links - Footer', () => {
    //     let footer: NavbarFooter;

    //     test.beforeEach(async ({ page }) => {
    //         footer = new NavbarFooter(page);
    //         await footer.goto();
    //         await footer.dismissCookieBannerIfPresent();
    //         await footer.dismissAnchorAdIfPresent();
    //     });

    //     test('Social_mobile_005: นำทางไปหน้า Facebook ของปันโปร', async ({ page, context }) => {
    //         await footer.footerFacebookLink.scrollIntoViewIfNeeded();
    //         await expectExternalNavigation(page, context, () => footer.footerFacebookLink.click(), ['facebook.com']);
    //     });

    //     test('Social_mobile_006: นำทางไปหน้า Instagram ของปันโปร', async ({ page, context }) => {
    //         await footer.footerInstagramLink.scrollIntoViewIfNeeded();
    //         await expectExternalNavigation(page, context, () => footer.footerInstagramLink.click(), ['instagram.com']);
    //     });

    //     test('Social_mobile_007: นำทางไปหน้า X ของปันโปร', async ({ page, context }) => {
    //         await footer.footerXLink.scrollIntoViewIfNeeded();
    //         await expectExternalNavigation(page, context, () => footer.footerXLink.click(), ['x.com']);
    //     });

    //     test('Social_mobile_008: นำทางไปช่อง YouTube ของปันโปร', async ({ page, context }) => {
    //         await footer.footerYoutubeLink.scrollIntoViewIfNeeded();
    //         await expectExternalNavigation(page, context, () => footer.footerYoutubeLink.click(), ['youtube.com']);
    //     });
    // });
});

