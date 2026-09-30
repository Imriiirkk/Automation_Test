/*
POM: Tag Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class TagPage {
    private page: Page;

    // ---------- Tag Header ----------
    public readonly tag_heading: Locator;
    public readonly headLayout: Locator;
    public readonly tag_title: Locator;

    // ---------- Breadcrumb ----------
    public readonly homeBreadcrumb: Locator;
    public readonly tagBreadcrumb: Locator;

    // ---------- Tag List Post Card ----------
    public readonly listPost_Card: Locator;
    public readonly each_PostCard: Locator;
    public readonly articleCard: Locator;
    public readonly promotionCard: Locator;

    // ---------- Element's Article Card ----------
    public readonly articleLink: Locator;
    public readonly coverImg_ArticleCard: Locator;
    public readonly type_ArticleCard: Locator;
    public readonly title_ArticleCard: Locator;
    public readonly description_ArticleCard: Locator;

    // ---------- Button Action in/on Article Card ----------
    public readonly loveArticle_Btn: Locator;
    public readonly bookmarkArticle_Btn: Locator;
    public readonly shareArticle_Btn: Locator;

    // ---------- Element's Promotion Card ----------
    public readonly promotionLink: Locator;
    public readonly coverImg_PromotionCard: Locator;
    public readonly badge_PromotionCard: Locator;
    public readonly title_PromotionCard: Locator;
    public readonly pro_PromotionCard: Locator;
    public readonly dateSale_PromotionCard: Locator;

    // ---------- Button Action in/on Promotion Card ----------
    public readonly lovePromotion_Btn: Locator;
    public readonly bookmarkPromotion_Btn: Locator;
    public readonly sharePromotion_Btn: Locator;

    // ---------- Share Popup ----------
    public readonly shareOnFacebook_Btn: Locator;
    public readonly shareOnX_Btn: Locator;
    public readonly shareOnLine_Btn: Locator;

    // ---------- Scroll to Top ----------
    public readonly scrollToTop_Btn: Locator;


    constructor(page: Page) {
        this.page = page;

        // ---------- Tag Header ----------
        this.tag_heading = page.locator('');
        this.headLayout = page.locator('');
        this.tag_title = page.locator('');

        // ---------- Breadcrumb ----------
        this.homeBreadcrumb = page.locator('');
        this.tagBreadcrumb = page.locator('');

        // ---------- Tag List Post Card ----------
        this.listPost_Card = page.locator('');
        this.each_PostCard = page.locator('');
        this.articleCard = page.locator('');
        this.promotionCard = page.locator('');

        // ---------- Element's Article Card ----------
        this.articleLink = page.locator('');
        this.coverImg_ArticleCard = page.locator('');
        this.type_ArticleCard = page.locator('');
        this.title_ArticleCard = page.locator('');
        this.description_ArticleCard = page.locator('');

        // ---------- Button Action in/on Article Card ----------
        this.loveArticle_Btn = page.locator('');
        this.bookmarkArticle_Btn = page.locator('');
        this.shareArticle_Btn = page.locator('');

        // ---------- Element's Promotion Card ----------
        this.promotionLink = page.locator('');
        this.coverImg_PromotionCard = page.locator('');
        this.badge_PromotionCard = page.locator('');
        this.title_PromotionCard = page.locator('');
        this.pro_PromotionCard = page.locator('');
        this.dateSale_PromotionCard = page.locator('');

        // ---------- Button Action in/on Promotion Card ----------
        this.lovePromotion_Btn = page.locator('');
        this.bookmarkPromotion_Btn = page.locator('');
        this.sharePromotion_Btn = page.locator('');

        // ---------- Share Popup ----------
        this.shareOnFacebook_Btn = page.locator('');
        this.shareOnX_Btn = page.locator('');
        this.shareOnLine_Btn = page.locator('');

        // ---------- Scroll to Top ----------
        this.scrollToTop_Btn = page.locator('');
    }

    // ==================== Page Actions ====================

}