import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../../pages/profilePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Profile - Information', () => {
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

        await profilePage.clickVerticalTabInfo();
        await expect(page).toHaveURL(/\/profile/);
    });

    test('Profile_mobile_008: ตรวจสอบการแสดงข้อมูลผู้ใช้เริ่มต้นในโหมดปกติ (ยังไม่แก้ไข)', async () => {
        await expect(profilePage.infoUsernameInput).toHaveValue(process.env.VALID_USERNAME!);
        // await expect(profilePage.infoPhoneInput).toHaveValue(process.env.VALID_PHONE!);
        await expect(profilePage.infoEmailInput).toHaveValue(process.env.VALID_EMAIL!);
        // await expect(profilePage.infoBirthdayInput).not.toHaveValue('');
        await expect(profilePage.infoGenderSelect).not.toHaveValue('');

        await expect(profilePage.infoUsernameInput).toBeDisabled();
        await expect(profilePage.infoPhoneInput).toBeDisabled();
        await expect(profilePage.infoEmailInput).toBeDisabled();
        await expect(profilePage.infoBirthdayInput).toBeDisabled();
        await expect(profilePage.infoGenderSelect).toBeDisabled();

        // ปุ่ม "บันทึก"/"ยกเลิก" ต้องยังไม่แสดง เพราะยังไม่ได้กด "แก้ไข"
        await expect(profilePage.infoSaveButton).not.toBeVisible();
        await expect(profilePage.infoCancelButton).not.toBeVisible();
    });

    test('Profile_mobile_009: ตรวจสอบการเข้าสู่โหมดแก้ไขเมื่อกดปุ่ม "แก้ไข"', async () => {
        await profilePage.clickInfoEdit();

        await expect(profilePage.infoUsernameInput).toBeEnabled();
        await expect(profilePage.infoPhoneInput).toBeEnabled();
        await expect(profilePage.infoBirthdayInput).toBeEnabled();
        await expect(profilePage.infoGenderSelect).toBeEnabled();

        // ปุ่ม "บันทึก"/"ยกเลิก" ต้องแสดงขึ้นมา
        await expect(profilePage.infoSaveButton).toBeVisible();
        await expect(profilePage.infoCancelButton).toBeVisible();
    });

    test('Profile_mobile_010: ตรวจสอบการบันทึกข้อมูลสำเร็จ เมื่อแก้ไขชื่อผู้ใช้', async () => {
        await expect(profilePage.infoUsernameInput).toHaveValue(process.env.VALID_USERNAME!)
        await profilePage.clickInfoEdit();
        await profilePage.infoUsernameInput.fill('tester punpro update');
        await profilePage.clickInfoSave();
        await expect(profilePage.infoEditProfileSuccess).toBeVisible({ timeout: 5000 });

        await expect(profilePage.infoUsernameInput).toHaveValue('tester punpro update')

        // restore ค่าเดิมกลับ
        await profilePage.clickInfoEdit();
        await profilePage.infoUsernameInput.fill(process.env.VALID_USERNAME!);
        await profilePage.clickInfoSave();
    });

    test('Profile_mobile_011: ตรวจสอบการบันทึกข้อมูลสำเร็จ เมื่อแก้ไขเบอร์โทรศัพท์', async () => {
        const phoneBefore = await profilePage.infoPhoneInput.inputValue();
        await profilePage.clickInfoEdit();
        await profilePage.infoPhoneInput.fill('0111111111');
        await profilePage.clickInfoSave();
        await expect(profilePage.infoEditProfileSuccess).toBeVisible({ timeout: 5000 });

        await expect(profilePage.infoPhoneInput).toHaveValue('0111111111');
        await expect(profilePage.infoPhoneInput.inputValue()).not.toBe(phoneBefore);

        // restore ค่าเดิมกลับ
        await profilePage.clickInfoEdit();
        await profilePage.infoPhoneInput.fill(phoneBefore);
        await profilePage.clickInfoSave();
    });

    test('Profile_mobile_012: ตรวจสอบว่าช่องอีเมลไม่สามารถแก้ไขได้', async () => {
        // เข้าสู่โหมดแก้ไข
        await profilePage.clickInfoEdit();

        // ตรวจสอบว่าฟิลด์อื่นเข้าโหมดแก้ไขได้ตามปกติ (เพื่อยืนยันว่าอยู่ใน edit mode จริง)
        await expect(profilePage.infoUsernameInput).toBeEnabled();

        // ช่อง Email ต้องยังคง Disabled แม้อยู่ในโหมดแก้ไข
        await expect(profilePage.infoEmailInput).toBeDisabled();

        // พยายาม fill ค่าใหม่ ยืนยันว่าค่าไม่เปลี่ยน (เผื่อกรณี disabled ผ่าน attribute อื่นที่ไม่ใช่ disabled property)
        const emailBefore = await profilePage.infoEmailInput.inputValue();
        await profilePage.infoEmailInput.fill('cannot-edit@test.com').catch(() => { });
        await expect(profilePage.infoEmailInput).toHaveValue(emailBefore);

        // ยกเลิกโหมดแก้ไขเพื่อคืนสถานะ
        await profilePage.clickInfoCancel();
    });

    test('Profile_mobile_013: ตรวจสอบการเลือกวันเกิดผ่าน Date Picker', async () => {
        const birthdayBefore = await profilePage.infoBirthdayInput.inputValue();
        const [yearBefore, monthBefore, dayBefore] = birthdayBefore.split('-').map(Number);

        await profilePage.clickInfoEdit();
        await profilePage.selectBirthdayFromPicker(15, 1, 2000);
        await profilePage.clickInfoSave();
        await expect(profilePage.infoEditProfileSuccess).toBeVisible({ timeout: 5000 });
        await expect(profilePage.infoBirthdayInput).toHaveValue('2000-1-15');

        // restore ค่าเดิม
        await profilePage.clickInfoEdit();
        await profilePage.selectBirthdayFromPicker(dayBefore, monthBefore, yearBefore);
        await profilePage.clickInfoSave();
    });

    test('Profile_mobile_014: ตรวจสอบการเลือกเพศแต่ละตัวเลือก', async () => {
        const genderBefore = await profilePage.infoGenderSelect.inputValue();

        await profilePage.clickInfoEdit();
        await profilePage.infoGenderSelect.selectOption({ label: 'หญิง' });
        await profilePage.clickInfoSave();
        await expect(profilePage.infoEditProfileSuccess).toBeVisible({ timeout: 5000 });

        const selectedLabel = await profilePage.infoGenderSelect
            .locator('option:checked')
            .textContent();
        expect(selectedLabel?.trim()).toBe('หญิง');

        // restore ค่าเดิม
        await profilePage.clickInfoEdit();
        await profilePage.infoGenderSelect.selectOption(genderBefore);
        await profilePage.clickInfoSave();
    });

    test('Profile_mobile_015: ตรวจสอบการยกเลิกการแก้ไข เมื่อกดปุ่ม "ยกเลิก"', async () => {
        const usernameBefore = await profilePage.infoUsernameInput.inputValue();

        await profilePage.clickInfoEdit();
        await expect(profilePage.infoSaveButton).toBeVisible();
        await expect(profilePage.infoCancelButton).toBeVisible();

        await profilePage.infoUsernameInput.fill('test cancel');
        await profilePage.clickInfoCancel();

        // ข้อมูลกลับเป็นค่าเดิมก่อนแก้ไข
        await expect(profilePage.infoUsernameInput).toHaveValue(usernameBefore);

        // ฟอร์มกลับสู่สถานะ Readonly
        await expect(profilePage.infoUsernameInput).toBeDisabled();
        await expect(profilePage.infoPhoneInput).toBeDisabled();
        await expect(profilePage.infoBirthdayInput).toBeDisabled();
        await expect(profilePage.infoGenderSelect).toBeDisabled();
        await expect(profilePage.infoSaveButton).not.toBeVisible();
        await expect(profilePage.infoCancelButton).not.toBeVisible();
    });

    test('Profile_mobile_016: ตรวจสอบการอัปโหลดรูปโปรไฟล์สำเร็จ', async ({ page }) => {
        await profilePage.clickInfoEdit();

        const avatarBefore = await profilePage.infoImageProfile
            .locator('img')
            .getAttribute('src');

        await profilePage.infoUploadImageInput.setInputFiles(
            'tests/fixtures/profile.jpg'
        );

        await profilePage.clickInfoSave();
        await expect(page).toHaveURL(/\/profile/);
        await expect(profilePage.infoSaveButton).not.toBeVisible();

        await expect(async () => {
            const avatarAfter = await profilePage.infoImageProfile
                .locator('img')
                .getAttribute('src');
            expect(avatarAfter).not.toBe(avatarBefore);
            expect(avatarAfter).not.toBeNull();
        }).toPass({ timeout: 10000 });

    });
});