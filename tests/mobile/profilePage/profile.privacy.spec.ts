import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../../pages/profilePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Profile - Menu', () => {
    let profilePage: ProfilePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        profilePage = new ProfilePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();

        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });
        await navbar.goToMenu_mobile(navbar.editProfile_mobile);
        await page.waitForURL(/\/profile/, { timeout: 10000 });
        expect(page.url()).toContain('/profile');

        await profilePage.clickVerticalTabPrivacy();
        await expect(page).toHaveURL(/\/profile-setting-privacy/);
        await navbar.dismissAllOverlaysIfPresent();
        await profilePage.clickPrivacyDeleteAccount();
    });

    test('Profile_mobile_038: ตรวจสอบการแสดง Popup ยืนยัน เมื่อกดปุ่ม "ขอลบบัญชี"', async () => {
        await expect(profilePage.deleteAccountPopup).toBeHidden();
        await expect(profilePage.deleteAccountPopupReason).toBeVisible();
        await expect(profilePage.deleteAccountPopupCheckBox).toBeVisible();
        await expect(profilePage.deleteAccountPopupConfirmButton).toBeVisible();
        await expect(profilePage.deleteAccountPopupCloseButton).toBeVisible();
    });

    test('Profile_mobile_039: ตรวจสอบว่าปุ่ม "ดำเนินการลบบัญชี" ไม่สามารถกดได้ ถ้ายังไม่ติ๊ก Checkbox ยืนยัน', async () => {
        await profilePage.deleteAccountPopupReason.fill('ลบบัญชี');
        await profilePage.deleteAccountPopupConfirmButton.click().catch(() => { });

        await expect(profilePage.deleteAccountPopup).toBeVisible();
        await expect(profilePage.deleteAccountPopupReason).toBeVisible();
        await expect(profilePage.deleteAccountPopupCheckBox).toBeVisible();
        await expect(profilePage.deleteAccountPopupConfirmButton).toBeVisible();
        await expect(profilePage.deleteAccountPopupCloseButton).toBeVisible();
    });

    test('Profile_mobile_040: ตรวจสอบว่าปุ่ม "ดำเนินการลบบัญชี" ไม่สามารถกดได้ ถ้ายังไม่กรอกสาเหตุในการลบ', async () => {
        await profilePage.deleteAccountPopupCheckBox.click();
        await profilePage.deleteAccountPopupConfirmButton.click().catch(() => { });

        await expect(profilePage.deleteAccountPopup).toBeVisible();
        await expect(profilePage.deleteAccountPopupReason).toBeVisible();
        await expect(profilePage.deleteAccountPopupCheckBox).toBeVisible();
        await expect(profilePage.deleteAccountPopupConfirmButton).toBeVisible();
        await expect(profilePage.deleteAccountPopupCloseButton).toBeVisible();
    });

    test('Profile_mobile_041: ตรวจสอบการยกเลิกคำขอลบสมาชิก เมื่อกดลิงก์ "เป็นสมาชิกต่อไป"', async () => {
        await expect(profilePage.deleteAccountPopup).toBeVisible();
        await expect(profilePage.deleteAccountPopupReason).toBeVisible();
        await expect(profilePage.deleteAccountPopupCheckBox).toBeVisible();
        await expect(profilePage.deleteAccountPopupConfirmButton).toBeVisible();
        await expect(profilePage.deleteAccountPopupCloseButton).toBeVisible();

        await profilePage.deleteAccountPopupCloseButton.click();

        await expect(profilePage.deleteAccountPopup).not.toBeVisible();
        await expect(profilePage.deleteAccountPopupReason).not.toBeVisible();
        await expect(profilePage.deleteAccountPopupCheckBox).not.toBeVisible();
        await expect(profilePage.deleteAccountPopupConfirmButton).not.toBeVisible();
        await expect(profilePage.deleteAccountPopupCloseButton).not.toBeVisible();
    });

});