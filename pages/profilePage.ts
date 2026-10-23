import { Page, Locator } from '@playwright/test';

/**
 * POM: Profile Page
 * Owner: NUBT
 */

export class ProfilePage {
    private page: Page;

    // vertical tab
    public verticalMenuLayout: Locator;
    public verticalTabContainer: Locator;
    public verticalHeaderOpenButton: Locator;
    public verticalTabInfoButton: Locator;
    public verticalTabBookmarkButton: Locator;
    public verticalTabFavoriteButton: Locator;
    public verticalTabCouponButton: Locator;
    public verticalTabPrivacyButton: Locator;
    public verticalTabLogoutButton: Locator;

    // infomation
    public infoEditButton: Locator;
    public infoImageProfile: Locator;
    public infoUploadImageButton: Locator;
    public infoUploadImageInput: Locator;
    public infoUsernameInput: Locator;
    public infoPhoneInput: Locator;
    public infoEmailInput: Locator;

    public infoBirthdayInput: Locator;
    public datePickerPopup: Locator;
    public datePickerMonthSelect: Locator;
    public datePickerYearSelect: Locator;

    public infoGenderSelect: Locator;
    public infoSaveButton: Locator;
    public infoCancelButton: Locator;

    public infoEditProfileSuccess: Locator;
    public infoEditProfileUnsuccessful: Locator;

    // bookmark
    private bookmarkCardContainer: Locator;
    public bookmarkTextBlank: Locator;
    public bookmarkCardItem: Locator;
    public bookmarkFirstCard: Locator;
    public bookmarkInCardItem: Locator;

    // favorite
    private favoriteCardContainer: Locator;
    public favoriteCardItem: Locator;
    public favoriteFirstCard: Locator;
    public favoriteInCardItem: Locator;
    public favoriteTextBlank: Locator;

    // coupon
    private couponCardContainer: Locator;
    private couponTextBlank: Locator;
    public couponCardItem: Locator;
    public couponFirstCard: Locator;
    public couponLastCard: Locator;
    public couponUseButton: Locator;
    public couponUsedButton: Locator;
    public couponPopup: Locator;
    public couponPopupDescription: Locator;
    public couponPopupCloseButton: Locator;
    public couponPopupUseButton: Locator;

    // privacy
    private privacyDeleteAccountButton: Locator;
    public deleteAccountPopup: Locator;
    public deleteAccountPopupReason: Locator;
    public deleteAccountPopupCheckBox: Locator;
    public deleteAccountPopupConfirmButton: Locator;
    public deleteAccountPopupCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // vertical tab
        this.verticalMenuLayout = page.locator('[class*="VerticalMenuLayout"]');
        this.verticalTabContainer = page.locator('li[class*="VerticalMenu__MenuItem-"]');
        this.verticalHeaderOpenButton = this.verticalMenuLayout.locator('.VerticalMenu__HeaderOpenButton-sc-f70b2ec4-3');
        this.verticalTabInfoButton = this.verticalMenuLayout.locator('a[href="/profile"]');
        this.verticalTabBookmarkButton = this.verticalMenuLayout.locator('a[href="/bookmarks"]');
        this.verticalTabFavoriteButton = this.verticalMenuLayout.locator('a[href="/favourites"]');
        this.verticalTabCouponButton = this.verticalMenuLayout.locator('a[href="/my-coupons"]');
        this.verticalTabPrivacyButton = this.verticalMenuLayout.locator('a[href="/profile-setting-privacy"]');
        this.verticalTabLogoutButton = this.verticalMenuLayout.locator('a[href="/logout"]');

        // infomation
        this.infoEditButton = page.locator('.client__EditProfileButton-sc-8662802f-3');
        this.infoImageProfile = page.locator('.client__ImageProfile-sc-8662802f-1');
        this.infoUploadImageButton = page.locator('.client__UploadImageButton-sc-8662802f-2');
        this.infoUploadImageInput = page.locator('input[type="file"]');
        this.infoUsernameInput = page.locator('input[type="text"].form-control');
        this.infoPhoneInput = page.locator('input[type="tel"].form-control');
        this.infoEmailInput = page.locator('input[type="email"].form-control');

        this.infoBirthdayInput = page.locator('input[placeholder="YYYY-M-D"]');
        this.datePickerPopup = page.locator('.DayPicker-Months');
        this.datePickerMonthSelect = this.datePickerPopup.locator('select[name="month"]');
        this.datePickerYearSelect = this.datePickerPopup.locator('select[name="year"]');

        this.infoGenderSelect = page.locator('select.form-control');
        this.infoSaveButton = page.locator('button:has-text("บันทึก")');
        this.infoCancelButton = page.locator('button:has-text("ยกเลิก")');

        this.infoEditProfileSuccess = page.getByRole('dialog', { name: 'บันทึกข้อมูลสำเร็จ' });
        this.infoEditProfileUnsuccessful = page.getByRole('dialog', { name: 'บันทึกไม่สำเร็จ' });

        // bookmark
        this.bookmarkCardContainer = page.locator('.client__ListComponent-sc-999135e6-0');
        this.bookmarkTextBlank = page.locator('.client__TextBlank-sc-999135e6-2');
        this.bookmarkCardItem = this.bookmarkCardContainer.locator('[class*="FixSizeArticleCard__Card"]');
        this.bookmarkFirstCard = this.bookmarkCardItem.first();
        this.bookmarkInCardItem = this.bookmarkCardContainer.getByTestId('bookmark-button').first();

        // favorite
        this.favoriteCardContainer = page.locator('.client__ListComponent-sc-e6d61375-0');
        this.favoriteTextBlank = page.locator('.client__TextBlank-sc-e6d61375-2');
        this.favoriteCardItem = this.favoriteCardContainer.locator('[class*="FixSizeItemSkuCard__Card"]');
        this.favoriteFirstCard = this.favoriteCardItem.first();
        this.favoriteInCardItem = this.favoriteCardContainer.getByTestId('love-button').first();

        // coupon
        this.couponCardContainer = page.locator('.client__ListComponent-sc-78449925-0');
        this.couponTextBlank = page.locator('.client__TextBlank-sc-78449925-2');
        this.couponCardItem = this.couponCardContainer.locator('[class*="FixSizeCouponCard__Card"]');
        this.couponFirstCard = this.couponCardItem.first();
        this.couponLastCard = this.couponCardItem.last();
        this.couponUseButton = this.couponFirstCard.locator('[class*="MyCouponActionButton__Button"]').getByText('ใช้งานคูปอง');
        this.couponUsedButton = this.couponLastCard.locator('[class*="MyCouponActionButton__Button"]').getByText('คูปองถูกใช้งานไปแล้ว');

        this.couponPopup = page.locator('[class*="DialogUseCoupon__DialogContent"]');
        this.couponPopupDescription = this.couponPopup.locator('[class*="DialogUseCoupon__Descript"]');
        this.couponPopupCloseButton = this.couponPopup.locator('[class*="DialogUseCoupon__Button"]').getByText('ปิด');
        this.couponPopupUseButton = this.couponPopup.locator('[class*="DialogUseCoupon__Button"]').getByText('กดใช้งานคูปอง');

        // privacy
        this.privacyDeleteAccountButton = page.locator('button:has-text("ขอลบบัญชี")');
        this.deleteAccountPopup = page.locator('[class*="DeleteMemberForm__BlockFormProfile"]');
        this.deleteAccountPopupReason = this.deleteAccountPopup.locator('[class*="DeleteMemberForm__Textarea"]');
        this.deleteAccountPopupCheckBox = this.deleteAccountPopup.locator('[class*="DeleteMemberForm__Checkbox"]');
        this.deleteAccountPopupConfirmButton = this.deleteAccountPopup.getByRole('button').getByText('ดำเนินการลบบัญชี');
        this.deleteAccountPopupCloseButton = this.deleteAccountPopup.getByRole('button').getByText('เป็นสมาชิกต่อไป');
    }

    async goToProfilePage() {
        await this.page.goto('https://punpro.com/profile');
    }

    // vertical tab
    async clickVerticalHeaderOpen() {
        await this.verticalHeaderOpenButton.click();
    }

    async clickVerticalTabInfo() {
        await this.verticalTabInfoButton.click();
    }

    async clickVerticalTabBookmark() {
        await this.verticalTabBookmarkButton.click();
    }

    async clickVerticalTabFavorite() {
        await this.verticalTabFavoriteButton.click();
    }

    async clickVerticalTabCoupon() {
        await this.verticalTabCouponButton.click();
    }

    async clickVerticalTabPrivacy() {
        await this.verticalTabPrivacyButton.click();
    }

    async clickVerticalTabLogout() {
        await this.verticalTabLogoutButton.click();
    }

    // infomation
    async clickInfoEdit() {
        await this.infoEditButton.click();
    }

    async clickInfoUploadImage() {
        await this.infoUploadImageButton.click();
    }

    async fillInfoUsername(username: string) {
        await this.infoUsernameInput.fill(username);
    }

    async fillInfoPhone(phone: string) {
        await this.infoPhoneInput.fill(phone);
    }

    async fillInfoEmail(email: string) {
        await this.infoEmailInput.fill(email);
    }

    async fillInfoBirthday(birthday: string) {
        await this.infoBirthdayInput.fill(birthday);
    }

    async selectBirthdayFromPicker(day: number, month: number, year: number) {
        // month: 1 = มกราคม ... 12 = ธันวาคม (พารามิเตอร์แบบ human-friendly)
        await this.infoBirthdayInput.click();
        await this.datePickerPopup.waitFor({ state: 'visible' });

        const targetDate = new Date(year, month - 1, day);

        // select[name="month"] เป็น 0-indexed (0=Jan...11=Dec) -> ใช้ getMonth() ตรงๆ ได้เลย
        await this.datePickerMonthSelect.selectOption(String(targetDate.getMonth()));
        await this.datePickerYearSelect.selectOption(String(year));

        const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayLabel = `${weekdayNames[targetDate.getDay()]} ${monthNames[targetDate.getMonth()]} ${String(day).padStart(2, '0')}`;

        await this.datePickerPopup.getByRole('gridcell', { name: dayLabel }).click();
    }

    async selectInfoGender(gender: string) {
        await this.infoGenderSelect.selectOption(gender);
    }

    async clickInfoSave() {
        await this.infoSaveButton.click();
    }

    async clickInfoCancel() {
        await this.infoCancelButton.click();
    }

    // bookmark
    async getBookmarkCardContainer() {
        return this.bookmarkCardContainer;
    }

    async getBookmarkTextBlank() {
        return this.bookmarkTextBlank;
    }

    // favorite
    async getFavoriteCardContainer() {
        return this.favoriteCardContainer;
    }

    async getFavoriteTextBlank() {
        return this.favoriteTextBlank;
    }

    // coupon
    async getCouponCardContainer() {
        return this.couponCardContainer;
    }

    async getCouponTextBlank() {
        return this.couponTextBlank;
    }

    // privacy
    async clickPrivacyDeleteAccount() {
        await this.privacyDeleteAccountButton.click();
    }
}

