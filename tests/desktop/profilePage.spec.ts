import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../pages/profilePage';
import { NavbarFooter } from '../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Profile Page Tests', () => {
    let profilePage: ProfilePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        profilePage = new ProfilePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();

        await navbar.openLoginOrSignup_desktop();
        await navbar.auth.loginWithEmail(email, password);
        // หยุดการตรวจสอบชั่วคราวเนื่องจากปัญหาการแสดงผลของ loginSuccessDialog
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });
        // await page.waitForTimeout(3000);
        // await page.reload(); // รีเฟรชหน้าเพื่อให้แน่ใจว่าเข้าสู่ระบบสำเร็จ
        // await page.waitForTimeout(3000);
        await navbar.goToMenu_desktop(navbar.auth.username);
        await page.waitForURL(/\/bookmark/, { timeout: 10000 });
        expect(page.url()).toContain('/bookmark');
    });

    // test('Profile_desktop_001: ตรวจสอบการแสดงเมนูแท็บครบถ้วนในหน้า Profile', async ({ page }) => {
    //     await expect(profilePage.verticalTabContainer).toBeVisible();
    //     await expect(profilePage.verticalTabInfoButton).toBeVisible();
    //     await expect(profilePage.verticalTabBookmarkButton).toBeVisible();
    //     await expect(profilePage.verticalTabFavoriteButton).toBeVisible();
    //     await expect(profilePage.verticalTabCouponButton).toBeVisible();
    //     await expect(profilePage.verticalTabPrivacyButton).toBeVisible();
    //     await expect(profilePage.verticalTabLogoutButton).toBeVisible();
    // });

    // test('Profile_desktop_002: ตรวจสอบการเปิด/ยุบเมนูแท็บ เมื่อกดปุ่มเปิดเมนู', async ({ page }) => {
    //     // เก็บความกว้างก่อนกด
    //     const widthBefore = await profilePage.verticalMenuLayout.evaluate(
    //         (el) => el.getBoundingClientRect().width
    //     );

    //     // เช็คว่าความกว้างเปลี่ยนไปจริง (ยุบ/ขยาย)
    //     await profilePage.clickVerticalHeaderOpen();
    //     await page.waitForTimeout(2000);
    //     const widthAfterCollapse = await profilePage.verticalMenuLayout.evaluate(
    //         (el) => el.getBoundingClientRect().width
    //     );
    //     expect(widthAfterCollapse).not.toBe(widthBefore);

    //     // กดซ้ำเพื่อสลับกลับ แล้วเช็คว่ากลับสู่ความกว้างเดิม
    //     await profilePage.clickVerticalHeaderOpen();
    //     await page.waitForTimeout(2000);
    //     const widthAfterExpand = await profilePage.verticalMenuLayout.evaluate(
    //         (el) => el.getBoundingClientRect().width
    //     );
    //     expect(widthAfterExpand).toBe(widthBefore);
    // });

    // test.describe('Menu Tab Functionality', () => {
    //     const tabCases = [
    //         { testId: 'Profile_desktop_003', label: 'ข้อมูลทั่วไป', clickTab: (h: ProfilePage) => h.clickVerticalTabInfo(), path: '/profile' },
    //         { testId: 'Profile_desktop_004', label: 'บุ๊คมาร์ค', clickTab: (h: ProfilePage) => h.clickVerticalTabBookmark(), path: '/bookmarks' },
    //         { testId: 'Profile_desktop_005', label: 'รายการโปรด', clickTab: (h: ProfilePage) => h.clickVerticalTabFavorite(), path: '/favourites' },
    //         { testId: 'Profile_desktop_006', label: 'คูปอง', clickTab: (h: ProfilePage) => h.clickVerticalTabCoupon(), path: '/my-coupons' },
    //         { testId: 'Profile_desktop_007', label: 'ความเป็นส่วนตัว', clickTab: (h: ProfilePage) => h.clickVerticalTabPrivacy(), path: '/profile-setting-privacy' },
    //     ];

    //     for (const { testId, label, clickTab, path } of tabCases) {
    //         test(`${testId}: ตรวจสอบการนำทางและ Active State เมื่อกดแท็บ "${label}"`, async ({ page }) => {
    //             await clickTab(profilePage);

    //             await expect(page).toHaveURL(new RegExp(path));
    //             page.pause()
    //             const tabItem = profilePage.verticalTabContainer
    //                 .filter({ has: page.locator(`a[href="${path}"]`) });
    //             const isActive = tabItem.locator('[class*="MenuItemActive"]');

    //             await expect(isActive).toHaveCSS('display', 'block');
    //         });
    //     }

    // });

    test.describe('Profile Information Form', () => {
        test.beforeEach(async ({ page }) => {
            await profilePage.clickVerticalTabInfo();
            await expect(page).toHaveURL(/\/profile/);
        });

        // test('Profile_desktop_008: ตรวจสอบการแสดงข้อมูลผู้ใช้เริ่มต้นในโหมดปกติ (ยังไม่แก้ไข)', async () => {
        //     await expect(profilePage.infoUsernameInput).toHaveValue(process.env.VALID_USERNAME!);
        //     // await expect(profilePage.infoPhoneInput).toHaveValue(process.env.VALID_PHONE!);
        //     await expect(profilePage.infoEmailInput).toHaveValue(process.env.VALID_EMAIL!);
        //     // await expect(profilePage.infoBirthdayInput).not.toHaveValue('');
        //     await expect(profilePage.infoGenderSelect).not.toHaveValue('');

        //     await expect(profilePage.infoUsernameInput).toBeDisabled();
        //     await expect(profilePage.infoPhoneInput).toBeDisabled();
        //     await expect(profilePage.infoEmailInput).toBeDisabled();
        //     await expect(profilePage.infoBirthdayInput).toBeDisabled();
        //     await expect(profilePage.infoGenderSelect).toBeDisabled();

        //     // ปุ่ม "บันทึก"/"ยกเลิก" ต้องยังไม่แสดง เพราะยังไม่ได้กด "แก้ไข"
        //     await expect(profilePage.infoSaveButton).not.toBeVisible();
        //     await expect(profilePage.infoCancelButton).not.toBeVisible();
        // });

        // test('Profile_desktop_009: ตรวจสอบการเข้าสู่โหมดแก้ไขเมื่อกดปุ่ม "แก้ไข"', async () => {
        //     await profilePage.clickInfoEdit();

        //     await expect(profilePage.infoUsernameInput).toBeEnabled();
        //     await expect(profilePage.infoPhoneInput).toBeEnabled();
        //     await expect(profilePage.infoBirthdayInput).toBeEnabled();
        //     await expect(profilePage.infoGenderSelect).toBeEnabled();

        //     // ปุ่ม "บันทึก"/"ยกเลิก" ต้องแสดงขึ้นมา
        //     await expect(profilePage.infoSaveButton).toBeVisible();
        //     await expect(profilePage.infoCancelButton).toBeVisible();
        // });

        // test('Profile_desktop_010: ตรวจสอบการบันทึกข้อมูลสำเร็จ เมื่อแก้ไขชื่อผู้ใช้', async () => {
        //     await expect(profilePage.infoUsernameInput).toHaveValue(process.env.VALID_USERNAME!)
        //     await profilePage.clickInfoEdit();
        //     await profilePage.infoUsernameInput.fill('tester punpro update');
        //     await profilePage.clickInfoSave();
        //     await expect(profilePage.infoEditProfileSuccess).toBeVisible({ timeout: 5000 });

        //     await expect(profilePage.infoUsernameInput).toHaveValue('tester punpro update')


        //     // หลังเทสเสร็จ
        //     await profilePage.clickInfoEdit();
        //     await profilePage.infoUsernameInput.fill(process.env.VALID_USERNAME!);
        //     await profilePage.clickInfoSave();
        // });

        // test('Profile_desktop_011: ตรวจสอบการบันทึกข้อมูลสำเร็จ เมื่อแก้ไขเบอร์โทรศัพท์', async () => {
        //     const phoneBefore = await profilePage.infoPhoneInput.inputValue();
        //     await profilePage.clickInfoEdit();
        //     await profilePage.infoPhoneInput.fill('0111111111');
        //     await profilePage.clickInfoSave();
        //     await expect(profilePage.infoEditProfileSuccess).toBeVisible({ timeout: 5000 });

        //     await expect(profilePage.infoPhoneInput).toHaveValue('0111111111');
        //     await expect(profilePage.infoPhoneInput.inputValue()).not.toBe(phoneBefore);

        //     // restore ค่าเดิมกลับ
        //     await profilePage.clickInfoEdit();
        //     await profilePage.infoPhoneInput.fill(phoneBefore);
        //     await profilePage.clickInfoSave();
        // });

        // test('Profile_desktop_012: ตรวจสอบว่าช่องอีเมลไม่สามารถแก้ไขได้', async () => {
        //     // เข้าสู่โหมดแก้ไข
        //     await profilePage.clickInfoEdit();

        //     // ตรวจสอบว่าฟิลด์อื่นเข้าโหมดแก้ไขได้ตามปกติ (เพื่อยืนยันว่าอยู่ใน edit mode จริง)
        //     await expect(profilePage.infoUsernameInput).toBeEnabled();

        //     // ช่อง Email ต้องยังคง Disabled แม้อยู่ในโหมดแก้ไข
        //     await expect(profilePage.infoEmailInput).toBeDisabled();

        //     // พยายาม fill ค่าใหม่ ยืนยันว่าค่าไม่เปลี่ยน (เผื่อกรณี disabled ผ่าน attribute อื่นที่ไม่ใช่ disabled property)
        //     const emailBefore = await profilePage.infoEmailInput.inputValue();
        //     await profilePage.infoEmailInput.fill('cannot-edit@test.com').catch(() => { });
        //     await expect(profilePage.infoEmailInput).toHaveValue(emailBefore);

        //     // ยกเลิกโหมดแก้ไขเพื่อคืนสถานะ
        //     await profilePage.clickInfoCancel();
        // });

        // test('Profile_desktop_013: ตรวจสอบการเลือกวันเกิดผ่าน Date Picker', async () => {
        //     const birthdayBefore = await profilePage.infoBirthdayInput.inputValue();
        //     const [yearBefore, monthBefore, dayBefore] = birthdayBefore.split('-').map(Number);

        //     await profilePage.clickInfoEdit();
        //     await profilePage.selectBirthdayFromPicker(15, 1, 2000);
        //     await profilePage.clickInfoSave();
        //     await expect(profilePage.infoEditProfileSuccess).toBeVisible({ timeout: 5000 });
        //     await expect(profilePage.infoBirthdayInput).toHaveValue('2000-1-15');

        //     // restore ค่าเดิม
        //     await profilePage.clickInfoEdit();
        //     await profilePage.selectBirthdayFromPicker(dayBefore, monthBefore, yearBefore);
        //     await profilePage.clickInfoSave();
        // });

        // test('Profile_desktop_014: ตรวจสอบการเลือกเพศแต่ละตัวเลือก', async () => {
        //     const genderBefore = await profilePage.infoGenderSelect.inputValue();

        //     await profilePage.clickInfoEdit();
        //     await profilePage.infoGenderSelect.selectOption({ label: 'หญิง' });
        //     await profilePage.clickInfoSave();
        //     await expect(profilePage.infoEditProfileSuccess).toBeVisible({ timeout: 5000 });

        //     const selectedLabel = await profilePage.infoGenderSelect
        //         .locator('option:checked')
        //         .textContent();
        //     expect(selectedLabel?.trim()).toBe('หญิง');

        //     // restore ค่าเดิม
        //     await profilePage.clickInfoEdit();
        //     await profilePage.infoGenderSelect.selectOption(genderBefore);
        //     await profilePage.clickInfoSave();
        // });

        // test('Profile_desktop_015: ตรวจสอบการยกเลิกการแก้ไข เมื่อกดปุ่ม "ยกเลิก"', async () => {
        //     const usernameBefore = await profilePage.infoUsernameInput.inputValue();

        //     await profilePage.clickInfoEdit();
        //     await expect(profilePage.infoSaveButton).toBeVisible();
        //     await expect(profilePage.infoCancelButton).toBeVisible();

        //     await profilePage.infoUsernameInput.fill('test cancel');
        //     await profilePage.clickInfoCancel();

        //     // ข้อมูลกลับเป็นค่าเดิมก่อนแก้ไข
        //     await expect(profilePage.infoUsernameInput).toHaveValue(usernameBefore);

        //     // ฟอร์มกลับสู่สถานะ Readonly
        //     await expect(profilePage.infoUsernameInput).toBeDisabled();
        //     await expect(profilePage.infoPhoneInput).toBeDisabled();
        //     await expect(profilePage.infoBirthdayInput).toBeDisabled();
        //     await expect(profilePage.infoGenderSelect).toBeDisabled();
        //     await expect(profilePage.infoSaveButton).not.toBeVisible();
        //     await expect(profilePage.infoCancelButton).not.toBeVisible();
        // });

        // test('Profile_desktop_016: ตรวจสอบการอัปโหลดรูปโปรไฟล์สำเร็จ', async ({ page }) => {
        //     await profilePage.clickInfoEdit();

        //     const avatarBefore = await profilePage.infoImageProfile
        //         .locator('img')
        //         .getAttribute('src');

        //     await profilePage.infoUploadImageInput.setInputFiles(
        //         'tests/fixtures/profile.jpg'
        //     );

        //     await profilePage.clickInfoSave();
        //     await expect(page).toHaveURL(/\/profile/);
        //     await expect(profilePage.infoSaveButton).not.toBeVisible();

        //     await expect(async () => {
        //         const avatarAfter = await profilePage.infoImageProfile
        //             .locator('img')
        //             .getAttribute('src');
        //         expect(avatarAfter).not.toBe(avatarBefore);
        //         expect(avatarAfter).not.toBeNull();
        //     }).toPass({ timeout: 10000 });

        // });
    });

    test.describe('Bookmark Section', () => {
        test.beforeEach(async ({ page }) => {
            await profilePage.clickVerticalTabBookmark();
            await expect(page).toHaveURL(/\/bookmarks/);
        });

        // test('Profile_desktop_017: ตรวจสอบการแสดงรายการบุ๊คมาร์ค เมื่อมีข้อมูล', async () => {
        //     const bookmarkCardContainer = await profilePage.getBookmarkCardContainer();
        //     await expect(bookmarkCardContainer).toBeVisible();
        // });

        // test('Profile_desktop_018: ตรวจสอบการนำโพสต์ออกจากบุ๊คมาร์ค เมื่อกดปุ่มบุ๊คมาร์คที่หน้าการ์ด', async ({ page }) => {
        //     const bookmarkCardContainer = await profilePage.getBookmarkCardContainer();
        //     await expect(bookmarkCardContainer).toBeVisible();

        //     const cardItemCount = await profilePage.bookmarkCardItem.count();
        //     await expect(profilePage.bookmarkInCardItem).toBeVisible();
        //     await profilePage.bookmarkInCardItem.click();
        //     await page.reload();

        //     const newCardItemCount = await profilePage.bookmarkCardItem.count();
        //     expect(newCardItemCount).toBeLessThanOrEqual(cardItemCount - 1);
        // });

        // test('Profile_desktop_019: ตรวจสอบการแสดงข้อความเมื่อยังไม่มีบุ๊คมาร์ค', async () => {
        //     await expect(profilePage.bookmarkTextBlank).toBeVisible();
        // });

        // test('Profile_desktop_020: ตรวจสอบการนำทางไปหน้าโพสต์ เมื่อกดที่การ์ดบุ๊คมาร์ค', async ({ page }) => {
        //     const bookmarkCardContainer = await profilePage.getBookmarkCardContainer();
        //     await expect(bookmarkCardContainer).toBeVisible();

        //     const firstCardLink = await profilePage.bookmarkFirstCard.locator('a').first().getAttribute('href');
        //     await profilePage.bookmarkFirstCard.locator('a').first().click();

        //     await page.waitForURL(firstCardLink!, { timeout: 10000 });
        //     expect(page.url()).toContain(firstCardLink!);
        // });

    });

    test.describe('Favorite Section', () => {
        test.beforeEach(async ({ page }) => {
            await profilePage.clickVerticalTabFavorite();
            await expect(page).toHaveURL(/\/favourites/);
        });

        // test('Profile_desktop_021: ตรวจสอบการแสดงรายการโปรด เมื่อมีข้อมูล', async () => {
        //     const favoriteCardContainer = await profilePage.getFavoriteCardContainer();
        //     await expect(favoriteCardContainer).toBeVisible();
        // });

        // test('Profile_desktop_022: ตรวจสอบการนำโพสต์ออกจากรายการโปรด เมื่อกดปุ่ม Fav ที่หน้าการ์ด', async ({ page }) => {
        //     const favoriteCardContainer = await profilePage.getFavoriteCardContainer();
        //     await expect(favoriteCardContainer).toBeVisible();

        //     const cardItemCount = await profilePage.favoriteCardItem.count();
        //     await expect(profilePage.favoriteInCardItem).toBeVisible();
        //     await profilePage.favoriteInCardItem.click();
        //     await page.reload();

        //     const newCardItemCount = await profilePage.favoriteCardItem.count();
        //     expect(newCardItemCount).toBeLessThanOrEqual(cardItemCount - 1);
        // });

        // test('Profile_desktop_023: ตรวจสอบการแสดงข้อความเมื่อยังไม่มีรายการโปรด', async () => {
        //     await expect(profilePage.favoriteTextBlank).toBeVisible();
        // });

        // test('Profile_desktop_024: ตรวจสอบการนำทางไปหน้าโพสต์ เมื่อกดที่การ์ดรายการโปรด', async ({ page }) => {
        //     const favoriteCardContainer = await profilePage.getFavoriteCardContainer();
        //     await expect(favoriteCardContainer).toBeVisible();

        //     const firstCardLink = await profilePage.favoriteFirstCard.locator('a').first().getAttribute('href');
        //     await profilePage.favoriteFirstCard.locator('a').first().click();

        //     await page.waitForURL(firstCardLink!, { timeout: 10000 });
        //     expect(page.url()).toContain(firstCardLink!);
        // });
    });

    test.describe('Coupons Section', () => {
        test.beforeEach(async ({ page }) => {
            await profilePage.clickVerticalTabCoupon();
            await expect(page).toHaveURL(/\/my-coupons/);
            await navbar.dismissAllOverlaysIfPresent();
        });

        // test('Search_desktop_025: ตรวจสอบการแสดงรายการคูปอง เมื่อมีข้อมูล', async () => {
        //     const couponCardContainer = await profilePage.getCouponCardContainer();
        //     await expect(couponCardContainer).toBeVisible();
        // });

        // test('Search_desktop_027: ตรวจสอบการแสดง Popup เมื่อกดปุ่ม "ใช้งานคูปอง" บนหน้าการ์ด', async () => {
        //     await profilePage.couponUseButton.click();

        //     await expect(profilePage.couponPopup).toBeVisible();
        //     await expect(profilePage.couponPopupDescription).toBeVisible();
        //     await expect(profilePage.couponPopupCloseButton).toBeVisible();
        //     await expect(profilePage.couponPopupUseButton).toBeVisible();
        // });

        // test('Search_desktop_028: ตรวจสอบการปิด Popup เมื่อกดปุ่ม "ปิด"', async () => {
        //     await profilePage.couponUseButton.click();

        //     await expect(profilePage.couponPopup).toBeVisible();
        //     await expect(profilePage.couponPopupDescription).toBeVisible();
        //     await expect(profilePage.couponPopupCloseButton).toBeVisible();
        //     await expect(profilePage.couponPopupUseButton).toBeVisible();

        //     await profilePage.couponPopupCloseButton.click();

        //     await expect(profilePage.couponPopup).not.toBeVisible();
        //     await expect(profilePage.couponPopupDescription).not.toBeVisible();
        //     await expect(profilePage.couponPopupCloseButton).not.toBeVisible();
        //     await expect(profilePage.couponPopupUseButton).not.toBeVisible();
        // });

        // test('Search_desktop_030: ตรวจสอบการแสดงปุ่ม Disable บนการ์ดคูปองที่ถูกใช้งานไปแล้ว', async () => {
        //     await profilePage.couponUsedButton.click().catch(() => { });

        //     await expect(profilePage.couponPopup).not.toBeVisible();
        //     await expect(profilePage.couponPopupDescription).not.toBeVisible();
        //     await expect(profilePage.couponPopupCloseButton).not.toBeVisible();
        //     await expect(profilePage.couponPopupUseButton).not.toBeVisible();
        // });
    });

    test.describe('Privacy Section', () => {
        test.beforeEach(async ({ page }) => {
            await profilePage.clickVerticalTabPrivacy();
            await expect(page).toHaveURL(/\/profile-setting-privacy/);
            await navbar.dismissAllOverlaysIfPresent();
            await profilePage.clickPrivacyDeleteAccount();
        });

        // test('Profile_desktop_031: ตรวจสอบการแสดง Popup ยืนยัน เมื่อกดปุ่ม "ขอลบบัญชี"', async () => {
        //     await expect(profilePage.deleteAccountPopup).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupReason).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCheckBox).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupConfirmButton).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCloseButton).toBeVisible();
        // });

        // test('Profile_desktop_032: ตรวจสอบว่าปุ่ม "ดำเนินการลบบัญชี" ไม่สามารถกดได้ ถ้ายังไม่ติ๊ก Checkbox ยืนยัน', async () => {
        //     await profilePage.deleteAccountPopupReason.fill('ลบบัญชี');
        //     await profilePage.deleteAccountPopupConfirmButton.click().catch(() => { });

        //     await expect(profilePage.deleteAccountPopup).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupReason).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCheckBox).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupConfirmButton).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCloseButton).toBeVisible();
        // });

        // test('Profile_desktop_033: ตรวจสอบว่าปุ่ม "ดำเนินการลบบัญชี" ไม่สามารถกดได้ ถ้ายังไม่กรอกสาเหตุในการลบ', async () => {
        //     await profilePage.deleteAccountPopupCheckBox.click();
        //     await profilePage.deleteAccountPopupConfirmButton.click().catch(() => { });

        //     await expect(profilePage.deleteAccountPopup).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupReason).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCheckBox).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupConfirmButton).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCloseButton).toBeVisible();
        // });

        // test('Profile_desktop_034: ตรวจสอบการยกเลิกคำขอลบสมาชิก เมื่อกดลิงก์ "เป็นสมาชิกต่อไป"', async () => {
        //     await expect(profilePage.deleteAccountPopup).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupReason).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCheckBox).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupConfirmButton).toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCloseButton).toBeVisible();

        //     await profilePage.deleteAccountPopupCloseButton.click();

        //     await expect(profilePage.deleteAccountPopup).not.toBeVisible();
        //     await expect(profilePage.deleteAccountPopupReason).not.toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCheckBox).not.toBeVisible();
        //     await expect(profilePage.deleteAccountPopupConfirmButton).not.toBeVisible();
        //     await expect(profilePage.deleteAccountPopupCloseButton).not.toBeVisible();
        // });
    });
});