/*
POM: Brand Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class BrandPage {
    private page: Page;

    // ---------- Brand Header ----------
    public readonly brand_heading: Locator;
    public readonly headLayout: Locator;
    public readonly brand_title: Locator;

    // ---------- Breadcrumb ----------
    public readonly homeBreadcrumb: Locator;
    public readonly brandBreadcrumb: Locator;

    // ---------- Event Card ----------
    public readonly eventCard: Locator;
    public readonly eventLink: Locator;
    public readonly coverImg_EventCard: Locator;
    public readonly title_EventCard: Locator;

    // ---------- Promotion Card ----------
    public readonly promotionCard: Locator;
    public readonly promotionLink: Locator;
    public readonly coverImg_PromotionCard: Locator;
    public readonly badge_PromotionCard: Locator;
    public readonly title_PromotionCard: Locator;
    public readonly pro_PromotionCard: Locator;
    public readonly dateSale_PromotionCard: Locator;

    // ---------- Article Card ----------
    public readonly articleCard: Locator;
    public readonly articleLink: Locator;
    public readonly coverImg_ArticleCard: Locator;
    public readonly type_ArticleCard: Locator;
    public readonly title_ArticleCard: Locator;
    public readonly description_ArticleCard: Locator;

    // ---------- Button Action in/on Event Card ----------
    public readonly loveEvent_Btn: Locator;
    public readonly bookmarkEvent_Btn: Locator;
    public readonly shareEvent_Btn: Locator;

    // ---------- Button Action in/on Promotion Card ----------
    public readonly lovePromotion_Btn: Locator;
    public readonly bookmarkPromotion_Btn: Locator;
    public readonly sharePromotion_Btn: Locator;

    // ---------- Button Action in/on Article Card ----------
    public readonly loveArticle_Btn: Locator;
    public readonly bookmarkArticle_Btn: Locator;
    public readonly shareArticle_Btn: Locator;

    // ---------- Share Popup ----------
    public readonly shareOnFacebook_Btn: Locator;
    public readonly shareOnX_Btn: Locator;
    public readonly shareOnLine_Btn: Locator;

    // ---------- Scroll to Top ----------
    public readonly scrollToTop_Btn: Locator;

    constructor(page: Page) {
        this.page = page;

        // ---------- Brand Header ----------
        this.brand_heading = page.locator('');
        this.headLayout = page.locator('');
        this.brand_title = page.locator('');

        // ---------- Breadcrumb ----------
        this.homeBreadcrumb = page.locator('');
        this.brandBreadcrumb = page.locator('');

        // ---------- Event Card ----------
        this.eventCard = page.locator('');
        this.eventLink = page.locator('');
        this.coverImg_EventCard = page.locator('');
        this.title_EventCard = page.locator('');

        // ---------- Promotion Card ----------
        this.promotionCard = page.locator('');
        this.promotionLink = page.locator('');
        this.coverImg_PromotionCard = page.locator('');
        this.badge_PromotionCard = page.locator('');
        this.title_PromotionCard = page.locator('');
        this.pro_PromotionCard = page.locator('');
        this.dateSale_PromotionCard = page.locator('');

        // ---------- Article Card ----------
        this.articleCard = page.locator('');
        this.articleLink = page.locator('');
        this.coverImg_ArticleCard = page.locator('');
        this.type_ArticleCard = page.locator('');
        this.title_ArticleCard = page.locator('');
        this.description_ArticleCard = page.locator('');

        // ---------- Button Action in/on Event Card ----------
        this.loveEvent_Btn = page.locator('');
        this.bookmarkEvent_Btn = page.locator('');
        this.shareEvent_Btn = page.locator('');

        // ---------- Button Action in/on Promotion Card ----------
        this.lovePromotion_Btn = page.locator('');
        this.bookmarkPromotion_Btn = page.locator('');
        this.sharePromotion_Btn = page.locator('');

        // ---------- Button Action in/on Article Card ----------
        this.loveArticle_Btn = page.locator('');
        this.bookmarkArticle_Btn = page.locator('');
        this.shareArticle_Btn = page.locator('');

        // ---------- Share Popup ----------
        this.shareOnFacebook_Btn = page.locator('');
        this.shareOnX_Btn = page.locator('');
        this.shareOnLine_Btn = page.locator('');

        // ---------- Scroll to Top ----------
        this.scrollToTop_Btn = page.locator('');
    }

    // ==================== Page Actions ====================

}