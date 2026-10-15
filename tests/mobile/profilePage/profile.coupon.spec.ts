import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../../pages/profilePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Profile - coupon', () => {
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

        await profilePage.clickVerticalTabCoupon();
        await expect(page).toHaveURL(/\/my-coupons/);
        await navbar.dismissAllOverlaysIfPresent();
    });

    test('Search_mobile_025: ตรวจสอบการแสดงรายการคูปอง เมื่อมีข้อมูล', async () => {
        const couponCardContainer = await profilePage.getCouponCardContainer();
        await expect(couponCardContainer).toBeVisible();
    });

    test('Search_mobile_027: ตรวจสอบการแสดง Popup เมื่อกดปุ่ม "ใช้งานคูปอง" บนหน้าการ์ด', async () => {
        await profilePage.couponUseButton.click();

        await expect(profilePage.couponPopup).toBeVisible();
        await expect(profilePage.couponPopupDescription).toBeVisible();
        await expect(profilePage.couponPopupCloseButton).toBeVisible();
        await expect(profilePage.couponPopupUseButton).toBeVisible();
    });

    test('Search_mobile_028: ตรวจสอบการปิด Popup เมื่อกดปุ่ม "ปิด"', async () => {
        await profilePage.couponUseButton.click();

        await expect(profilePage.couponPopup).toBeVisible();
        await expect(profilePage.couponPopupDescription).toBeVisible();
        await expect(profilePage.couponPopupCloseButton).toBeVisible();
        await expect(profilePage.couponPopupUseButton).toBeVisible();

        await profilePage.couponPopupCloseButton.click();

        await expect(profilePage.couponPopup).not.toBeVisible();
        await expect(profilePage.couponPopupDescription).not.toBeVisible();
        await expect(profilePage.couponPopupCloseButton).not.toBeVisible();
        await expect(profilePage.couponPopupUseButton).not.toBeVisible();
    });

    test('Search_mobile_030: ตรวจสอบการแสดงปุ่ม Disable บนการ์ดคูปองที่ถูกใช้งานไปแล้ว', async () => {
        await profilePage.couponUsedButton.click().catch(() => { });

        await expect(profilePage.couponPopup).not.toBeVisible();
        await expect(profilePage.couponPopupDescription).not.toBeVisible();
        await expect(profilePage.couponPopupCloseButton).not.toBeVisible();
        await expect(profilePage.couponPopupUseButton).not.toBeVisible();
    });

    async function findCardIndexByStatus(profilePage: ProfilePage, status: string): Promise<number> {
        const count = await profilePage.couponCardItem.count();
        for (let i = 0; i < count; i++) {
            if ((await profilePage.getCouponStatus(i)) === status) return i;
        }
        throw new Error(`ไม่พบการ์ดสถานะ "${status}" ในแท็บคูปองของฉัน — ต้อง seed ข้อมูลก่อนรันเทสนี้`);
    }

    test('Profile_mobile_021: ตรวจสอบการแสดง Confirm Modal เมื่อกดปุ่ม "กดใช้งานคูปอง" ใน Use Coupon Modal', async ({ page }) => {
        const index = await findCardIndexByStatus(profilePage, 'ยังไม่ใช้คูปอง');
        const card = profilePage.couponCardItem.nth(index);
        await card.getByRole('button').click();

        await profilePage.couponPopupUseButton.click();

        await expect(profilePage.confirmModal).toBeVisible();
        await expect(profilePage.confirmModalIcon).toBeVisible();
        await expect(profilePage.confirmModalDesc).toBeVisible();
        await expect(profilePage.confirmModalCancelButton).toBeVisible();
        await expect(profilePage.confirmModalConfirmButton).toBeVisible();
    });

    test('Profile_mobile_022: ตรวจสอบการยกเลิกการใช้งานคูปอง เมื่อกดปุ่ม "ยกเลิก" ใน Confirm Modal', async ({ page }) => {
        const index = await findCardIndexByStatus(profilePage, 'ยังไม่ใช้คูปอง');
        const card = profilePage.couponCardItem.nth(index);
        await card.getByRole('button').click();
        await profilePage.couponPopupUseButton.click();

        await expect(profilePage.confirmModal).toBeVisible();
        await profilePage.confirmModalCancelButton.click();

        await expect(profilePage.confirmModal).toBeHidden();
        await expect(card.getByRole('button')).toHaveText('ใช้งานคูปอง');
        await expect(card.getByRole('button')).toBeEnabled();
    });

    test('Profile_mobile_023: ตรวจสอบการแสดง QR/Barcode Modal เมื่อกดปุ่ม "ยืนยัน" ใน Confirm Modal', async ({ page }) => {
        const index = await findCardIndexByStatus(profilePage, 'ยังไม่ใช้คูปอง');
        const card = profilePage.couponCardItem.nth(index);
        await card.getByRole('button').click();
        await profilePage.couponPopupUseButton.click();
        await profilePage.confirmModalConfirmButton.click();

        await expect(profilePage.codeModal).toBeVisible();
        await expect(profilePage.codeModalImage).toBeVisible();
        await expect(profilePage.codeModalQrTab).toHaveClass(/active/);
        await expect(profilePage.codeModalBarcodeTab).not.toHaveClass(/active/);
        await expect(profilePage.codeModalQrImage).toBeVisible();
        await expect(profilePage.codeModalRefNumber).toHaveText(/\d+/);
        await expect(profilePage.codeModalCloseButton).toBeVisible();
    });

    test('Profile_mobile_024: ตรวจสอบการสลับแท็บ Bar Code ใน QR/Barcode Modal', async ({ page }) => {
        const index = await findCardIndexByStatus(profilePage, 'ยังไม่ใช้คูปอง');
        const card = profilePage.couponCardItem.nth(index);
        await card.getByRole('button').click();
        await profilePage.couponPopupUseButton.click();
        await profilePage.confirmModalConfirmButton.click();

        const refNumberBefore = await profilePage.codeModalRefNumber.textContent();

        await profilePage.codeModalBarcodeTab.click();

        await expect(profilePage.codeModalBarcodeTab).toHaveClass(/active/);
        await expect(profilePage.codeModalQrTab).not.toHaveClass(/active/);
        await expect(profilePage.codeModalBarcodeImage).toBeVisible();
        await expect(profilePage.codeModalRefNumber).toHaveText(refNumberBefore ?? '');
    });

    test('Profile_mobile_025: ตรวจสอบการปิด QR/Barcode Modal เมื่อกดปุ่ม "ปิด"', async ({ page }) => {
        await profilePage.loadAllCoupons();
        const unusedBefore = await profilePage.countCouponsByStatus('ยังไม่ใช้คูปอง');
        const usedBefore = await profilePage.countCouponsByStatus('ใช้คูปองแล้ว');

        const index = await findCardIndexByStatus(profilePage, 'ยังไม่ใช้คูปอง');
        const card = profilePage.couponCardItem.nth(index);
        await card.getByRole('button').click();
        await profilePage.couponPopupUseButton.click();
        await profilePage.confirmModalConfirmButton.click();

        await expect(profilePage.codeModal).toBeVisible();
        await profilePage.codeModalCloseButton.click();
        await expect(profilePage.codeModal).toBeHidden();
        await page.waitForTimeout(3000)

        const unusedAfter = await profilePage.countCouponsByStatus('ยังไม่ใช้คูปอง');
        const usedAfter = await profilePage.countCouponsByStatus('ใช้คูปองแล้ว');

        expect(unusedAfter / 2).toBe((unusedBefore / 2) - 1);
        expect(usedAfter / 2).toBe((usedBefore / 2) + 1);
    });

    test('Profile_mobile_026: ตรวจสอบการไม่สามารถกดปุ่ม "คูปองถูกใช้งานไปแล้ว" ที่อยู่ในสถานะ Disabled', async ({ page }) => {
        const index = await findCardIndexByStatus(profilePage, 'ใช้คูปองแล้ว');
        const card = profilePage.couponCardItem.nth(index);
        const button = card.getByRole('button');

        await expect(button).toHaveText('คูปองถูกใช้งานไปแล้ว');
        await expect(button).toBeDisabled();

        await expect(profilePage.couponPopup).toBeHidden();
        await expect(profilePage.confirmModal).toBeHidden();
        await expect(profilePage.codeModal).toBeHidden();
    });

    test('Profile_mobile_027: ตรวจสอบการไม่สามารถกดปุ่ม "หมดอายุ" ที่อยู่ในสถานะ Disabled', async ({ page }) => {
        const index = await findCardIndexByStatus(profilePage, 'คูปองหมดอายุ');
        const card = profilePage.couponCardItem.nth(index);
        const button = card.getByRole('button');

        await expect(button).toHaveText('หมดอายุ');
        await expect(button).toBeDisabled();

        await expect(profilePage.couponPopup).toBeHidden();
        await expect(profilePage.confirmModal).toBeHidden();
        await expect(profilePage.codeModal).toBeHidden();
    });

});