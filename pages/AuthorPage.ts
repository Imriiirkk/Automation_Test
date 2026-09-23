/*
POM: Author Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class AuthorPage {
    private page: Page;

    // ---------- Author Heading ----------
    public readonly author_heading: Locator;
    public readonly headLayout: Locator;
    public readonly author_title: Locator;

    // ---------- Breadcrumb ----------
    public readonly homeBreadcrumb: Locator;
    public readonly authorBreadcrumb: Locator;

    // ---------- Multi-Author List Post Card ----------
    public readonly listPost_Card: Locator;
    public readonly each_PostCard: Locator;
    public readonly article_PostCard: Locator;
    public readonly promotion_PostCard: Locator;

    // ---------- Element's Article Card ----------
    public readonly coverImg_ArticleCard: Locator;
    public readonly lable_ArticleCard: Locator;
    public readonly title_ArticleCard: Locator;
    public readonly description_ArticleCard: Locator;
    // ---------- Button Action in/on Card ----------
    public readonly loveArticle_Btn: Locator;
    public readonly bookmarkArticle_Btn: Locator;
    public readonly shareArticle_Btn: Locator;

    // ---------- Element's Promotion Card ----------
    public readonly coverImg_PromotionCard: Locator;
    public readonly lable_PromotionCard: Locator;
    public readonly title_PromotionCard: Locator;
    public readonly pro_PromotionCard: Locator;
    public readonly dateSale_PromotionCard: Locator;
    // ---------- Button Action in/on Card ----------
    public readonly lovePromotion_Btn: Locator;
    public readonly bookmarkPromotion_Btn: Locator;
    public readonly sharePromotion_Btn: Locator;

    // ---------- Icon Share in/on ... ----------
    public readonly shareOnFacebook_Btn: Locator;
    public readonly shareOnX_Btn: Locator;
    public readonly shareOnLine_Btn: Locator;


    constructor(page: Page) {
        this.page = page;
        this.author_heading = page.getByRole('heading', { name: /^avatar writer/ });
        this.headLayout = page.locator('[class*="HeadLayout__HeaderLayout"]');
        this.author_title = this.headLayout.locator('[class*="HeadLayout__TitlePunpro"]');

        // ---------- Breadcrumb ----------
        this.homeBreadcrumb = page.getByRole('link', { name: 'หน้าแรก' });
        this.authorBreadcrumb = page.getByText(/^นักเขียน/, { exact: true });

        // ---------- Multi-Author List Post Card ----------
        this.listPost_Card = page.locator('[class*="ProMultiAuthor__ListPostCard"]');
        this.each_PostCard = page.locator('[class*="ProMultiAuthor__BlockArticle"]');
        this.article_PostCard = page.locator('[class*="CardArticle__CardComponent"]');
        this.promotion_PostCard = page.locator('[class*="CardPromotion__CardComponent"]');

        // ---------- Element's Article Card ----------
        this.coverImg_ArticleCard = page.locator('');
        this.lable_ArticleCard = page.locator('');
        this.title_ArticleCard = page.locator('');
        this.description_ArticleCard = page.locator('');
        // ---------- Button Action Card ----------
        this.loveArticle_Btn = page.locator('');
        this.bookmarkArticle_Btn = page.locator('');
        this.shareArticle_Btn = page.locator('');

        // ---------- Element's Promotion Card ----------
        this.coverImg_PromotionCard = page.locator('');
        this.lable_PromotionCard = page.locator('');
        this.title_PromotionCard = page.locator('');
        this.pro_PromotionCard = page.locator('');
        this.dateSale_PromotionCard = page.locator('');
        // ---------- Button Action Card ----------
        this.lovePromotion_Btn = page.locator('');
        this.bookmarkPromotion_Btn = page.locator('');
        this.sharePromotion_Btn = page.locator('');

        // ---------- Icon Share in/on ... ----------
        this.shareOnFacebook_Btn = page.getByRole('button', { name: 'Share on Facebook' });
        this.shareOnX_Btn = page.getByRole('button', { name: 'Share on X' });
        this.shareOnLine_Btn = page.getByRole('button', { name: 'Share on Line' });

    }

    // ==================== Page Actions ====================
}