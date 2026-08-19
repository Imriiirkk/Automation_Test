import { Page, Locator, BrowserContext } from '@playwright/test';

/**
 * POM: Navbar & Footer
 * Owner: NUBT
 */

export class NavbarFooter {
    private page: Page;

    // ---------- Navbar ----------
    private menuToggle: Locator;
    public mobileNavMenu: Locator;
    private closeMenuButton: Locator;
    private desktopNavMenu: Locator;

    // ---------- Authentication ----------
    public loginButton_desktop: Locator;
    public loginButton_mobile: Locator;

    public loginModalCloseButton: Locator;
    public loginModalLogo: Locator;
    public loginSocialLoginSection: Locator; // ครอบ social login (Google/Facebook)
    public loginModalEmailButton: Locator;
    public loginModalSignupButton: Locator;

    public loginEmailForm: Locator;
    private loginEmailInput: Locator;
    private loginPasswordInput: Locator;
    public loginSubmitButton: Locator;

    public loginSuccessDialog: Locator;  // dialog ที่แสดงเมื่อ login สำเร็จ
    public loginErrorText: Locator;  // ข้อความ error จาก Firebase (เช่น รหัสผ่านไม่ถูกต้อง)
    public loginErrorOkButton: Locator; // ปุ่ม OK ใน dialog error ของ Firebase

    public signupForm: Locator;
    private signupEmailInput: Locator;
    private signupPasswordInput: Locator;
    private signupConfirmPasswordInput: Locator;
    private signupSubmitButton: Locator;

    private signupErrorText: Locator;

    private userNameDisplay: Locator;  // profile name ที่แสดงหลัง login สำเร็จ
    public username: Locator;

    public logoutLink: Locator;
    public logout_desktop: Locator;

    // ---------- Social Media Links ----------
    public navFacebookLink: Locator;
    public navInstagramLink: Locator;
    public navXLink: Locator;
    public navYoutubeLink: Locator;

    public footerFacebookLink: Locator;
    public footerInstagramLink: Locator;
    public footerXLink: Locator;
    public footerYoutubeLink: Locator;

    // ---------- Header Menu ----------
    // desktop
    public homeMenu_desktop: Locator;
    public promotionMenu_desktop: Locator;
    public articleMenu_desktop: Locator;
    public shopperPostsMenu_desktop: Locator;
    public partnerMenu_desktop: Locator;
    public couponsMenu_desktop: Locator;
    public contactMenu_desktop: Locator;

    // mobile
    public editProfile_mobile: Locator;
    public homeMenu_mobile: Locator;
    public promotionMenu_mobile: Locator;
    public articleMenu_mobile: Locator;
    public shopperPostsMenu_mobile: Locator;
    public couponsMenu_mobile: Locator;
    public privacyPolicy_mobile: Locator;
    public termsAndConditions_mobile: Locator;
    public contactMenu_mobile: Locator;
    public jobsMenu_mobile: Locator;

    // ---------- Search ----------
    public searchToggle: Locator; // ปุ่ม toggle search bar สำหรับ mobile
    public searchInput: Locator;
    public searchButton: Locator;
    public searchSuggestionContainer: Locator;
    public searchInputClearButton: Locator;
    public recentSearchSectionTitle: Locator;
    public recentSearchItems: Locator;
    public trendingSearchSectionTitle: Locator;
    private trendingSearchItems: Locator;

    // ---------- Footer ----------
    public footerContainer: Locator;
    public footerPromotionLink: Locator;
    public footerArticleLink: Locator;
    public footerShopperPostsLink: Locator;
    public footerPartnerLink: Locator;
    public footerCouponLink: Locator;
    public footerContactLink: Locator;

    public footerPromotion_pro1get1: Locator;
    public footerPromotion_50up: Locator;
    public footerPromotion_phone: Locator;
    public footerPromotion_food: Locator;
    public footerPromotion_ticket: Locator;
    public footerPromotion_discount: Locator;

    public footerArticle_fashion: Locator;
    public footerArticle_eat: Locator;
    public footerArticle_travel: Locator;
    public footerArticle_smart: Locator;
    public footerArticle_updates: Locator;
    public footerArticle_talking: Locator;

    public appStoreLink: Locator;
    public playStoreLink: Locator;

    public termsAndConditionsLink: Locator;
    public privacyPolicyLink: Locator;
    public scrollToTopButton: Locator;

    // ---------- Ads/banners ----------
    public appBanner: Locator;
    public appBannerAnimatedWrapper: Locator;
    public appBannerCloseButton: Locator;
    public appBannerDownloadButton: Locator;

    public cookieAcceptButton: Locator;
    public cookieContainer: Locator;

    public anchorAd: Locator;
    public anchorAdCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // ---------- Mobile Navbar ----------
        this.menuToggle = page.getByRole('button', { name: 'Toggle navigation' }).first();
        this.mobileNavMenu = page.getByRole('complementary');
        this.closeMenuButton = page.locator('.VerticalNav__NavHeaderAction-sc-2fb0d474-6');
        this.desktopNavMenu = page.locator('.main-header');

        // ---------- Authentication ----------
        this.loginButton_desktop = page.getByRole('button', { name: 'เข้าสู่ระบบ หรือ สมัครสมาชิก' });
        this.loginButton_mobile = page.locator('div').filter({ hasText: 'เข้าสู่ระบบ / สมัครสมาชิก' }).last();

        this.loginModalCloseButton = page.locator('.LoginTemplate__ButtonCloseModal-sc-13087779-4');
        this.loginModalLogo = page.locator('.LoginTemplate__PunproLogo-sc-13087779-1');
        this.loginSocialLoginSection = page.locator('.LoginTemplate__LoginSection-sc-13087779-0');
        this.loginModalEmailButton = page.getByRole('button', { name: 'เข้าสู่ระบบด้วยอีเมล', exact: true });
        this.loginModalSignupButton = page.getByRole('button', { name: 'สมัครสมาชิก', exact: true });

        this.loginEmailForm = page.locator('.LoginEmailForm__BlockEmailLogin-sc-468fc2ea-0');
        this.loginEmailInput = page.getByRole('textbox', { name: 'email', exact: true });
        this.loginPasswordInput = page.getByRole('textbox', { name: 'password', exact: true });
        this.loginSubmitButton = page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true });

        this.loginSuccessDialog = page.getByRole('dialog', { name: 'เข้าสู่ระบบสำเร็จ', exact: true });
        this.loginErrorText = page.getByText('× Firebase: Error (auth/');
        this.loginErrorOkButton = page.getByRole('button', { name: 'OK', exact: true });

        this.signupForm = page.locator('.RegisterForm__BlockEmailLogin-sc-b93e4feb-0');
        this.signupEmailInput = page.getByRole('textbox', { name: 'email', exact: true });
        this.signupPasswordInput = page.getByPlaceholder('รหัสผ่าน', { exact: true });
        this.signupConfirmPasswordInput = page.getByPlaceholder('รหัสผ่านอีกครั้ง', { exact: true });
        this.signupSubmitButton = page.getByRole('button', { name: 'สมัครสมาชิก', exact: true });

        this.signupErrorText = page.getByRole('dialog', { name: 'โปรดกรอกข้อมูลให้ครบถ้วน' });

        this.userNameDisplay = page.locator('.UserMenu__UserName-sc-1g0x7jv-2');
        this.username = page.locator('.NavbarTop__BlockUsername-sc-f8cfc4bb-5');

        this.logoutLink = page.getByRole('link', { name: 'ออกจากระบบ', exact: true });
        this.logout_desktop = page.getByRole('link', { name: 'ออกจากระบบ' }).last();


        // ---------- Social Media Links ----------
        const headerNav = page.getByRole('navigation').filter({ hasText: 'PUNPRO #MoreforLife' });
        this.navFacebookLink = headerNav.getByLabel('Link to Facebook');
        this.navInstagramLink = headerNav.getByLabel('Link to Instagram');
        this.navXLink = headerNav.getByLabel('Link to X');
        this.navYoutubeLink = headerNav.getByLabel('Link to YouTube');

        const footer = page.getByRole('contentinfo');
        this.footerFacebookLink = footer.getByLabel('Link to Facebook');
        this.footerInstagramLink = footer.getByLabel('Link to Instagram');
        this.footerXLink = footer.getByLabel('Link to X');
        this.footerYoutubeLink = footer.getByLabel('Link to YouTube');

        // ---------- Header Menu ----------
        // desktop
        this.homeMenu_desktop = this.desktopNavMenu.getByRole('link', { name: 'Link to Home Page', exact: true });
        this.promotionMenu_desktop = this.desktopNavMenu.getByRole('link', { name: 'Link to promotion', exact: true });
        this.articleMenu_desktop = this.desktopNavMenu.getByRole('link', { name: 'Link to article', exact: true });
        this.shopperPostsMenu_desktop = this.desktopNavMenu.getByRole('link', { name: 'Link to shopper_posts', exact: true });
        this.partnerMenu_desktop = this.desktopNavMenu.getByRole('link', { name: 'Link to partner', exact: true });
        this.couponsMenu_desktop = this.desktopNavMenu.getByRole('link', { name: 'Link to coupons', exact: true });
        this.contactMenu_desktop = this.desktopNavMenu.getByRole('link', { name: 'Link to contact', exact: true });

        // mobile
        this.editProfile_mobile = this.mobileNavMenu.getByRole('link', { name: 'แก้ไขโปรไฟล์' });
        this.homeMenu_mobile = this.mobileNavMenu.getByRole('link', { name: 'หน้าแรก', exact: true });
        this.promotionMenu_mobile = this.mobileNavMenu.getByRole('link', { name: 'โปรโมชั่น', exact: true });
        this.articleMenu_mobile = this.mobileNavMenu.getByRole('link', { name: 'บทความ', exact: true });
        this.shopperPostsMenu_mobile = this.mobileNavMenu.getByRole('link', { name: 'รับหิ้ว', exact: true });
        this.couponsMenu_mobile = this.mobileNavMenu.getByRole('link', { name: 'คูปอง', exact: true });
        this.privacyPolicy_mobile = this.mobileNavMenu.getByRole('link', { name: 'นโยบายความเป็นส่วนตัว', exact: true });
        this.termsAndConditions_mobile = this.mobileNavMenu.getByRole('link', { name: 'ข้อกำหนดและเงื่อนไข', exact: true });
        this.contactMenu_mobile = this.mobileNavMenu.getByRole('link', { name: 'ติดต่อเรา', exact: true });
        this.jobsMenu_mobile = this.mobileNavMenu.getByRole('link', { name: 'ร่วมงานกับเรา', exact: true });

        // ---------- Search ----------
        this.searchToggle = page.getByRole('button', { name: 'Toggle navigation' }).nth(1);
        this.searchInput = page.getByRole('textbox', { name: 'text' });
        this.searchButton = page.getByRole('button', { name: 'search' });
        this.searchSuggestionContainer = page.locator('.ContentSuggestBlockSearch__SuggestionContainer-sc-307edbf9-0.ixeKMo');
        this.searchInputClearButton = page.locator('.InputSearch__InputAndClearWrapper-sc-a10b220a-4').getByRole('button', { name: '×' });
        this.recentSearchSectionTitle = page.locator('.ContentSuggestBlockSearch__SectionTitle-sc-307edbf9-1:visible');
        this.recentSearchItems = page.locator('.ContentSuggestBlockSearch__SuggestionText-sc-307edbf9-3:visible');
        this.trendingSearchSectionTitle = page.locator('.TrendingSearchWord__SectionTitle-sc-b258d58c-2:visible').first();
        this.trendingSearchItems = page.locator('.TrendingSearchWord__TrendingItem-sc-b258d58c-0:visible');

        // ---------- Footer ----------
        this.footerContainer = page.getByRole('contentinfo');
        this.footerPromotionLink = footer.getByRole('link', { name: 'โปรโมชัน' });
        this.footerArticleLink = footer.getByRole('link', { name: 'บทความ' });
        this.footerShopperPostsLink = footer.getByRole('link', { name: 'ปันโปรรับหิ้ว' });
        this.footerPartnerLink = footer.getByRole('link', { name: 'พาร์ทเนอร์' });
        this.footerCouponLink = footer.getByRole('link', { name: 'คูปอง' });
        this.footerContactLink = footer.getByRole('link', { name: 'ติดต่อเรา' });

        this.footerPromotion_pro1get1 = page.getByRole('link', { name: 'โปร 1 แถม' });
        this.footerPromotion_50up = page.getByRole('link', { name: '% up' });
        this.footerPromotion_phone = page.getByRole('link', { name: 'โปรมือถือ' });
        this.footerPromotion_food = page.getByRole('link', { name: 'โปรอาหาร' });
        this.footerPromotion_ticket = page.getByRole('link', { name: 'โปรตั๋วถูก' });
        this.footerPromotion_discount = page.getByRole('link', { name: 'โค้ดส่วนลด' });

        this.footerArticle_fashion = page.getByRole('link', { name: 'โปรสายแฟ' });
        this.footerArticle_eat = page.getByRole('link', { name: 'โปรกิน' });
        this.footerArticle_travel = page.getByRole('link', { name: 'โปรเที่ยว' });
        this.footerArticle_smart = page.getByRole('link', { name: 'โปรสมาร์ท' });
        this.footerArticle_updates = page.getByRole('link', { name: 'โปรอัพเดท' });
        this.footerArticle_talking = page.getByRole('link', { name: 'โปรชวนคุย' });

        this.appStoreLink = footer.getByRole('link', { name: 'punpro-app-store' });
        this.playStoreLink = footer.getByRole('link', { name: 'punpro-playstore' });

        this.termsAndConditionsLink = page.getByRole('link', { name: 'Terms & Conditions' });
        this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
        this.scrollToTopButton = page.getByRole('button', { name: 'scroll to top button' });

        // ---------- Ads/banners ----------
        this.appBanner = page.locator('[class*="PPBNApp__BNAPP-"]');
        this.appBannerAnimatedWrapper = this.appBanner.locator('.animate__animated');
        this.appBannerDownloadButton = this.appBanner.locator('a[href="/app"]');
        this.appBannerCloseButton = this.appBanner.locator('button[class*="BTNCloseBNAPP"]');

        this.cookieAcceptButton = page.getByRole('button', { name: 'ยอมรับ' });
        this.cookieContainer = page.getByText('Punpro.com ใช้คุกกี้เพื่อพัฒนาประสบการณ์ใช้งานอ่านเพิ่มเติมยอมรับ');

        this.anchorAd = page.locator('.ats-overlay-bottom-wrapper-rendered');
        this.anchorAdCloseButton = this.anchorAd.getByRole('button').first();
    }

    // ==================== Page Actions ====================

    // เริ่มต้นเว็บ
    async goto() {
        await this.page.goto('/');
    }

    // =============== Ads/banners ===============
    async dismissAppBannerIfPresent() {
        const appeared = await this.appBanner
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        if (appeared) {
            await this.appBannerCloseButton.click();
            await this.appBanner
                .evaluate((el) => new Promise<void>((resolve) => {
                    el.addEventListener('animationend', () => resolve(), { once: true });
                }));
        }
    }

    async dismissCookieBannerIfPresent() {
        const appeared = await this.cookieAcceptButton
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        if (appeared) {
            await this.cookieAcceptButton.click();
            await this.cookieAcceptButton.waitFor({ state: 'hidden' });
        }
    }

    async dismissAnchorAdIfPresent() {
        const appeared = await this.anchorAd
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        if (appeared) {
            await this.anchorAdCloseButton.click();
            await this.anchorAd.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
        }
    }

    async dismissAllOverlaysIfPresent() {
        await this.dismissCookieBannerIfPresent();
        await this.dismissAppBannerIfPresent();
        await this.dismissAnchorAdIfPresent();
    }

    // ============================================

    // เปิดเมนู
    async openMenu_mobile() {
        await this.menuToggle.click();
        await this.dismissAppBannerIfPresent();
        await this.dismissCookieBannerIfPresent();
        await this.dismissAnchorAdIfPresent();
    }

    // ปิดเมนู
    async closeMenu_mobile() {
        await this.closeMenuButton.click();
    }

    // ไปที่เมนูต่างๆ
    async goToMenu_mobile(linkName: Locator) {
        await this.openMenu_mobile();
        await linkName.click();
    }

    async goToMenu_desktop(linkName: Locator) {
        await linkName.click();
    }

    // =============== Authentication ===============
    // เปิด modal login
    async openLoginOrSignup_mobile() {
        await this.openMenu_mobile();
        await this.loginButton_mobile.click();
    }

    async openLoginOrSignup_desktop() {
        await this.loginButton_desktop.click();
    }

    // ปิด modal login
    async closeLoginModal() {
        await this.loginModalCloseButton.click();
    }

    // Login ด้วยอีเมล
    async loginWithEmail(email: string, password: string) {
        await this.loginModalEmailButton.click();
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.loginSubmitButton.click();
    }

    // ปิด modal การเตือนเข้าสู่ระบบไม่สำเร็จ
    async dismissLoginError() {
        if (await this.loginErrorText.isVisible().catch(() => false)) {
            await this.loginErrorOkButton.click();
            await this.loginErrorText.waitFor({ state: 'hidden' });
        }
    }

    // สมัครสมาชิก
    async signupWithEmail(email: string, password: string, confirmpassword: string) {
        await this.loginModalSignupButton.click();
        await this.signupEmailInput.fill(email);
        await this.signupPasswordInput.fill(password);
        await this.signupConfirmPasswordInput.fill(confirmpassword);
        await this.signupSubmitButton.click();
    }

    // ออกจากระบบ
    async logout() {
        await this.logoutLink.click();
    }

    async logoutInDesktop() {
        await this.logout_desktop.click();
    }

    // =============== Search ===============
    // ค้นหาด้วยคำค้นหา
    async searchWithKeyword(keyword: string[]) {
        for (const word of keyword) {
            await this.searchInput.click();
            await this.searchInput.fill(word);
            await this.searchButton.click();
            await this.page.waitForURL(/\/search\?s=/, { timeout: 15000 });
            await this.page.waitForTimeout(5000);
        }

        await this.goto();
        await this.dismissAppBannerIfPresent();
        await this.dismissCookieBannerIfPresent();
    }

    // คลิกรายการค้นหาล่าสุด (filter จาก text เพราะมีหลายรายการ class เดียวกัน)
    async clickRecentSearch(keyword: string) {
        await this.recentSearchItems
            .filter({ hasText: new RegExp(`^${keyword}$`) })
            .click();
        await this.page.waitForURL(/\/search\?s=/, { timeout: 15000 });
        await this.page.waitForTimeout(5000);
    }

    // ลบรายการค้นหาล่าสุด - ใช้ data-item แทน text filter แม่นยำกว่าและเร็วกว่า
    async removeRecentSearch(keyword: string) {
        await this.page
            .locator(`.ContentSuggestBlockSearch__ClearItemButton-sc-307edbf9-4[data-item="${keyword}"]:visible`)
            .click();
    }

    // คลิกรายการคำค้นหามาแรง
    async clickTrendingSearch(keyword: string) {
        await this.searchInput.click();
        await this.trendingSearchItems
            .filter({ hasText: new RegExp(`^${keyword}$`) })
            .click();
        await this.page.waitForURL(/\/search\?s=/, { timeout: 15000 });
        await this.page.waitForTimeout(5000);
    }

    // =============== Footer ===============
    async goToLinkFooter_mobile(linkName: string) {
        await this.footerContainer.getByRole('link', { name: linkName, exact: true }).click();
    }

    // ================= Getters (สำหรับ assert ใน spec file) =================
    getDesktopNavMenu(): Locator {
        return this.desktopNavMenu;
    }
}