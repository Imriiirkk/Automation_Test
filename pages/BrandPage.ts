/*
POM: Brand Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class BrandPage {
    private page: Page;

    // ---------- Brand Header ----------
    // public readonly brand_heading: Locator;
    // public readonly headLayout: Locator;
    public readonly brand_title: Locator;

    // ---------- Breadcrumb ----------
    public readonly breadcrumbBlock: Locator;
    public readonly homeBreadcrumb: Locator;
    public readonly homeBreadcrumbLink: Locator;
    public readonly brandBreadcrumb: Locator;

    // ---------- Event Card ----------
    public readonly listPost_Card: Locator;
    public readonly each_PostCard: Locator;
    public readonly eventCard: Locator;
    public readonly eventLink: Locator;
    public readonly coverImg_EventCard: Locator;
    public readonly title_EventCard: Locator;
    public readonly badge_EventCard: Locator;
    public readonly pro_EventCard: Locator;
    public readonly dateContent_EventCard: Locator;

    // ---------- Button Action in/on Event Card ----------
    public readonly loveEvent_Btn: Locator;
    public readonly bookmarkEvent_Btn: Locator;
    public readonly shareEvent_Btn: Locator;

    // ---------- Share Popup ----------
    public readonly shareOnFacebook_Btn: Locator;
    public readonly shareOnX_Btn: Locator;
    public readonly shareOnLine_Btn: Locator;

    constructor(page: Page) {
        this.page = page;

        // ---------- Brand Header ----------
        // this.brand_heading = page.locator('[class*="HeadLayout__HeaderTag"]');
        // this.headLayout = page.locator('');
        this.brand_title = page.locator('[class*="HeadLayout__HeaderTag"]');

        // ---------- Breadcrumb ----------
        this.breadcrumbBlock = page.locator('[class*="Breadcrumb__BreadcrumbBlock"]');
        this.homeBreadcrumb = page.getByRole('link', { name: 'หน้าแรก', exact: true })
        this.homeBreadcrumbLink = page.locator('div[class*="Breadcrumb__BreadcrumbBlock"] a[href="/"]');
        this.brandBreadcrumb = this.breadcrumbBlock.locator('[class*="Breadcrumb__BreadcrumbLast"]');

        // ---------- Event Card ----------
        this.listPost_Card = page.locator('[class*="CardSearch__ListArticle"]').nth(1);
        this.each_PostCard = this.listPost_Card.locator('[class*="CardSearch__BlockArticle"]');
        this.eventCard = page.locator('[class*="CardCarry__CardComponent"]').first();

        // ---------- Event Card ----------
        this.listPost_Card = page.locator('[class*="CardSearch__ListArticle"]').nth(1);
        this.each_PostCard = this.listPost_Card.locator('[class*="CardSearch__BlockArticle"]');
        this.eventLink = this.eventCard.locator('a[href^="/sp/"]').first();
        this.coverImg_EventCard = this.eventLink.locator('div[style*="background-image"]');
        this.title_EventCard = this.eventCard.locator('[class*="CardCarry__Title"]');
        this.badge_EventCard = this.eventCard.locator('[class*="CardCarry__BlockBadge"]');

        this.pro_EventCard = this.eventCard
            .locator('[class*="CardCarry__BlockIcon"]')
            .filter({ has: page.locator('.icon-sale-outline') })
            .locator('xpath=following-sibling::div[contains(@class,"CardCarry__BlockLabel")] p');

        this.dateContent_EventCard = this.eventCard
            .locator('[class*="CardCarry__BlockIcon"]')
            .filter({ has: page.locator('.icon-calendar-outline') })
            .locator('xpath=following-sibling::div[contains(@class,"CardCarry__BlockLabel")] p');
        // this.pro_EventCard = this.eventCard.locator('[class*="CardCarry__BlockLabel"]').locator('p').first();
        // this.dateContent_EventCard = this.eventCard.locator('[class*="CardCarry__BlockLabel"]').locator('p').nth(1);

        // ---------- Button Action in/on Event Card ----------
        this.loveEvent_Btn = this.eventCard.locator('.action-love[role="button"]');
        this.bookmarkEvent_Btn = this.eventCard.locator('.action-bookmark[role="button"]');
        this.shareEvent_Btn = this.eventCard.locator('[class*="ButtonShare__Icon"]');

        // ---------- Share Popup ----------
        this.shareOnFacebook_Btn = this.eventCard.getByRole('button', { name: 'Share on Facebook' });
        this.shareOnX_Btn = this.eventCard.getByRole('button', { name: 'Share on X' });
        this.shareOnLine_Btn = this.eventCard.getByRole('button', { name: 'Share on Line' });
    }

    // ==================== Page Actions ====================
    async clickShare_Card() {
        await this.coverImg_EventCard.hover();
        await this.shareEvent_Btn.first().click();
    }

}