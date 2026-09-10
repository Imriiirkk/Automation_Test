import { Page, Locator } from '@playwright/test';
import { BaseActions } from './base';
import { AuthComponent } from './auth';
import { SearchComponent } from './search';

/**
 * POM: Navbar & Footer
 * Owner: NUBT
 */
export class NavbarFooter extends BaseActions {
    // ---------- Sub-components ----------
    public auth: AuthComponent;
    public search: SearchComponent;

    // ---------- Navbar ----------
    private menuToggle: Locator;
    public mobileNavMenu: Locator;
    private closeMenuButton: Locator;
    private desktopNavMenu: Locator;

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

    constructor(page: Page) {
        super(page);

        this.auth = new AuthComponent(page);
        this.search = new SearchComponent(page);

        // ---------- Mobile Navbar ----------
        this.menuToggle = page.getByRole('button', { name: 'Toggle navigation' }).first();
        this.mobileNavMenu = page.getByRole('complementary');
        this.closeMenuButton = page.locator('[class*="VerticalNav__NavHeaderAction"]');
        this.desktopNavMenu = page.locator('.main-header');

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
    }

    // เปิดเมนู (mobile)
    async openMenu_mobile() {
        await this.menuToggle.click();
        await this.dismissAllOverlaysIfPresent();
    }

    // ปิดเมนู (mobile)
    async closeMenu_mobile() {
        await this.closeMenuButton.click();
    }

    async goToMenu_mobile(linkName: Locator) {
        await this.openMenu_mobile();
        await linkName.click();
    }

    async goToMenu_desktop(linkName: Locator) {
        await linkName.click();
    }

    async openLoginOrSignup_mobile() {
        await this.openMenu_mobile();
        await this.auth.loginButton_mobile.click();
    }

    async openLoginOrSignup_desktop() {
        await this.auth.loginButton_desktop.click();
    }

    async goToLinkFooter_mobile(linkName: string) {
        await this.footerContainer.getByRole('link', { name: linkName, exact: true }).click();
    }

    // ================= Getters (สำหรับ assert ใน spec file) =================

    getLoginOrSignupButtonDesktop(): Locator {
        return this.auth.loginButton_desktop;
    }
    getLoginModalLogo(): Locator {
        return this.auth.loginModalLogo;
    }

    getLoginModalCloseButton(): Locator {
        return this.auth.loginModalCloseButton;
    }

    getLoginSocialLoginSection(): Locator {
        return this.auth.loginSocialLoginSection;
    }

    getLoginModalEmailButton(): Locator {
        return this.auth.loginModalCloseButton;
    }

    getLoginModalSignupButton(): Locator {
        return this.auth.loginModalSignupButton;
    }

    getLoginEmailForm(): Locator {
        return this.auth.loginEmailForm;
    }

    getSignupEmailForm(): Locator {
        return this.auth.signupForm;
    }

    getLoginError(): Locator {
        return this.auth.loginErrorText;
    }

    getLoginSuccess(): Locator {
        return this.auth.loginSuccessDialog;
    }

    getUserDisplayNameMobile(): Locator {
        return this.page.locator('[class*="VerticalNav__NavHeaderProfile-"]'); // TODO: ระบุ element ที่ครอบชื่อผู้ใช้จริง (แยกจากเมนู "แก้ไขโปรไฟล์")
    }

    getUsernameBlock(): Locator {
        return this.auth.username;
    }

    getRecentSearchTitle(): Locator {
        return this.search.recentSearchSectionTitle;
    }

    getSeachSuggestionContainer(): Locator {
        return this.search.searchSuggestionContainer;
    }

    getSearchSuggestionSeemoreButton(): Locator {
        return this.search.searchSuggestionSeeMoreButton;
    }

    getSearchSuggestionDeleteAllButton(): Locator {
        return this.search.searchSuggestionDeleteAllButton;
    }

    getRecentSearchItems(): Locator {
        return this.search.recentSearchItems;
    }

    getRecentSearchItemsCount() {
        return this.search.recentSearchItems.count();
    }



}