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
    public readonly title: Locator;

    // ---------- Breadcrumb ----------
    public readonly breadcrumbBlock: Locator;
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

    constructor(page: Page) {
        this.page = page;

        // ---------- Tag Header ----------
        this.headLayout = page.locator('[class*="client__Block"]');
        this.tag_heading = page.locator('[class*="HeadLayout__HeaderTag"]'); //<h1 class="HeadLayout__HeaderTag-sc-277e3f53-0 guHpGu kanit-regular">#ทาสแมว</h1>
        this.title = page.locator('');//<div class="HeadLayout__TitlePunpro-sc-277e3f53-1 ePWwJm">ปันโปร PUNPRO ที่ 1 ด้านโปรโมชัน อัปเดตและติดตามทุกเรื่องราวโปรโมชัน</div>

        // ---------- Breadcrumb ----------
        this.breadcrumbBlock = page.locator('[class*="Breadcrumb__BreadcrumbBlock"]');
        this.homeBreadcrumb = page.getByRole('link', { name: 'หน้าแรก', exact: true })
        this.tagBreadcrumb = this.breadcrumbBlock.locator('[class*="Breadcrumb__BreadcrumbLast"]');// ตัวอย่าง format: #ทาสแมว page.getByText(/^นักเขียน/, { exact: true });

        // ---------- Tag List Post Card ----------
        this.listPost_Card = page.locator('[class*="ProMultiTag__ListPostCard"]');
        this.each_PostCard = this.listPost_Card.locator('[class*="ProMultiTag__BlockArticle"]');
        this.articleCard = page.locator('[class*="CardArticle__CardComponent"]').first();
        this.promotionCard = page.locator('[class*="CardPromotion__CardComponent"]').first();

        // ---------- Element's Article Card ----------
        this.articleLink = this.articleCard.locator('a.CardArticle__StyledLink-sc-e8f54d39-3[href^="/p/"]').first();
        this.coverImg_ArticleCard = this.articleLink.locator('div[style*="background-image"]');
        this.type_ArticleCard = this.articleCard.locator('[class*="CardArticle__BlockBadge"]').getByText('บทความ', { exact: true });
        this.title_ArticleCard = this.articleCard.locator('[class*="CardArticle__Title"]');
        this.description_ArticleCard = this.articleCard.locator('[class*="CardArticle__Description"]');

        // ---------- Button Action in/on Article Card ----------
        this.loveArticle_Btn = this.articleCard.locator('.action-love[role="button"]');
        this.bookmarkArticle_Btn = this.articleCard.locator('.action-bookmark[role="button"]');
        this.shareArticle_Btn = this.articleCard.locator('[class*="CardArticle__BlockShare"] [class*="ButtonShare__ButtonWrapper"]');

        // ---------- Element's Promotion Card ----------
        this.promotionLink = this.promotionCard.locator('a.CardPromotion__StyledLink-sc-50ef9525-2[href^="/p/"]').first();
        this.coverImg_PromotionCard = this.promotionLink.locator('div[style*="background-image"]');
        this.badge_PromotionCard = this.promotionCard.locator('[class*="CardPromotion__BlockBadge"]').getByText('โปรโมชัน', { exact: true });
        this.title_PromotionCard = this.promotionCard.locator('[class*="CardPromotion__Title"]');
        this.pro_PromotionCard = this.promotionCard.locator('[class*="CardPromotion__Label"]').first();
        this.dateSale_PromotionCard = this.promotionCard.locator('[class*="CardPromotion__Label"]').last();

        // ---------- Button Action in/on Promotion Card ----------
        this.lovePromotion_Btn = this.promotionCard.locator('.action-love[role="button"]');
        this.bookmarkPromotion_Btn = this.promotionCard.locator('.action-bookmark[role="button"]');
        this.sharePromotion_Btn = this.promotionCard.locator('[class*="CardPromotion__BlockShare"] [class*="ButtonShare__ButtonWrapper"]');

        // ---------- Share Popup ----------
        this.shareOnFacebook_Btn = page.getByRole('button', { name: 'Share on Facebook' });
        this.shareOnX_Btn = page.getByRole('button', { name: 'Share on X' });
        this.shareOnLine_Btn = page.getByRole('button', { name: 'Share on Line' });

    }

    // ==================== Page Actions ====================

}