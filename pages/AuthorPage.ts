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
    public readonly articleCard: Locator;
    public readonly promotionCard: Locator;

    // ---------- Element's Article Card ----------
    public readonly articleLink: Locator;
    public readonly coverImg_ArticleCard: Locator;
    public readonly type_ArticleCard: Locator;
    public readonly title_ArticleCard: Locator;
    public readonly description_ArticleCard: Locator;
    // ---------- Button Action in/on Card ----------
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
        this.homeBreadcrumb = page.getByRole('link', { name: 'หน้าแรก', exact: true })
        this.authorBreadcrumb = page.getByText(/^นักเขียน/, { exact: true });

        // ---------- Multi-Author List Post Card ----------
        this.listPost_Card = page.locator('[class*=""]'); //ProMultiAuthor__ListPostCard
        this.each_PostCard = page.locator('[class*="ProMultiAuthor__BlockArticle"]');
        this.articleCard = page.locator('[class*="CardArticle__CardComponent"]').first();
        this.promotionCard = page.locator('[class*="CardPromotion__CardComponent"]').first();

        // ---------- Element's Article Card ----------
        this.articleLink = this.articleCard.locator('a[href^="/p/"]'); // .first()
        this.coverImg_ArticleCard = this.articleCard.locator('a[href^="/p/"]').first().locator('div').first();
        this.type_ArticleCard = this.articleCard.getByText('บทความ', { exact: true });
        this.title_ArticleCard = this.articleCard.getByRole('heading');
        this.description_ArticleCard = this.articleCard.locator('[class*="CardArticle__Description"]');
        // ---------- Button Action Card ----------
        this.loveArticle_Btn = this.articleCard.locator('.action-love');
        this.bookmarkArticle_Btn = this.articleCard.locator('.action-bookmark');
        this.shareArticle_Btn = this.articleCard.locator('[class*="ButtonShare__ButtonWrapper"]');

        // ---------- Element's Promotion Card ----------
        this.promotionLink = this.promotionCard.locator('a[href^="/p/"]').first();
        this.coverImg_PromotionCard = this.promotionCard.locator('a[href^="/p/"]').first().locator('div').first();
        this.badge_PromotionCard = this.promotionCard.getByText('โปรโมชัน', { exact: true });
        this.title_PromotionCard = this.promotionCard.getByRole('heading');
        this.pro_PromotionCard = this.promotionCard.locator('[class*="CardPromotion__Label"]');
        this.dateSale_PromotionCard = this.pro_PromotionCard.filter({ hasText: /ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\./ }).last();
        // ---------- Button Action Card ----------
        this.lovePromotion_Btn = this.promotionCard.locator('.action-love');
        this.bookmarkPromotion_Btn = this.promotionCard.locator('.action-bookmark');
        this.sharePromotion_Btn = page.locator('[class*="CardPromotion__BlockShare"]'); //[class*="ButtonShare__ButtonWrapper"]

        // ---------- Icon Share in/on ... ----------
        this.shareOnFacebook_Btn = page.getByRole('button', { name: 'Share on Facebook' });
        this.shareOnX_Btn = page.getByRole('button', { name: 'Share on X' });
        this.shareOnLine_Btn = page.getByRole('button', { name: 'Share on Line' });

    }

    // ==================== Page Actions ====================
}