import { Page, Locator } from '@playwright/test';

/**
 * POM: Home Page
 * Owner: NUBT
 */

export type SuggestCardType = 'shopper' | 'promotion' | 'article';

export class HomePage {
    private page: Page;

    // ---------- Banner ----------
    private bannerContainer: Locator;
    private bannerItem: Locator;
    private bannerIndicatorContainer: Locator;
    public bannerDuoContainer: Locator;      // เฉพาะ Desktop
    public bannerPromotionOne: Locator;     // เฉพาะ Desktop
    public bannerPromotionTwo: Locator;     // เฉพาะ Desktop

    // ---------- Category Section ----------
    private categorySectionContainer: Locator;
    public categoryMenuContainer: Locator;
    public categoryProductTab: Locator;
    public categoryBrandTab: Locator;
    public categorySeeMoreButton: Locator;
    public categoryItemList: Locator;

    // ---------- Services Section ----------
    private servicesSectionContainer: Locator;

    // ---------- Promotion Section ----------
    private promotionSectionContainer: Locator;

    // ---------- Shopper Post Section ----------
    private shopperPostSectionContainer: Locator;
    public shopperSeeMoreButton: Locator;
    private shopperCardContainer: Locator;
    public shopperIndicatorContainer: Locator;

    // ---------- Article Section --------------
    private articleSectionContainer: Locator;
    public articleSeeMoreButton: Locator;
    public articleCardContainer: Locator;
    public articleIndicatorContainer: Locator;
    public articleCardBookmarkButton: Locator;
    public articleLargeCard_desktop: Locator;
    public articleSmallCards_desktop: Locator;
    public articleCardBookmarkButton_desktop: Locator;

    // ---------- Punpro Suggestion ------------
    public punproSuggestionContainer: Locator;
    public punproAllTab: Locator;
    public punproShopperTab: Locator;
    public punproPormotionTab: Locator;
    public punproArticleTab: Locator;
    private punproCardContainer: Locator;
    public punproCardItem: Locator;
    public punproSeeMoreButton: Locator;

    // map type -> prefix ของ styled-component จริง (ยืนยันจาก DevTools)
    public suggestCardComponentPrefix: Record<SuggestCardType, string> = {
        shopper: 'LargeCardShopperPost',
        promotion: 'LargeCardPromotion',
        article: 'LargeCardArticle',
    };

    constructor(page: Page) {
        this.page = page;

        // ---------- Banner ----------
        this.bannerContainer = page.locator('.PunproHighlight__BlockBody-sc-e94f7491-3').first();
        this.bannerItem = page.locator('.swiper-slide.swiper-slide-active');
        this.bannerIndicatorContainer = page.locator('.SlideSingle__CustomPagination-sc-a477a39f-0');
        this.bannerDuoContainer = page.locator('[class*="PunproHighlight__BlockDuo-"]');
        this.bannerPromotionOne = page.locator('[class*="PunproHighlight__PromotionOne-"]');
        this.bannerPromotionTwo = page.locator('[class*="PunproHighlight__PromotionTwo-"]');

        // ---------- Category Section ----------
        this.categorySectionContainer = page.locator('.CategoryMenuComponent__Box-sc-fd4b0526-0');
        this.categoryMenuContainer = page.locator('.CategoryMenuComponent__Body-sc-fd4b0526-5');
        this.categoryProductTab = this.categorySectionContainer.getByText('สินค้า', { exact: true });
        this.categoryBrandTab = this.categorySectionContainer.getByText('แบรนด์', { exact: true });
        this.categorySeeMoreButton = page.locator('.CategoryMenuComponent__ViewAllButton-sc-fd4b0526-4');
        this.categoryItemList = this.categoryMenuContainer.locator('[class*="CategoryMenuComponent__Menu-"]');

        // ---------- Services Section ----------
        this.servicesSectionContainer = page.locator('.ServiceAllComponent__Box-sc-2e87d014-0');

        // ---------- Promotion Section ----------
        this.promotionSectionContainer = page.locator('.RecommenComponent__Box-sc-a7c187a9-0'); // โปรโมชัน

        // ---------- Shopper Post Section ----------
        this.shopperPostSectionContainer = page.locator('.ShopperPostComponent__Box-sc-42a38944-0');
        this.shopperSeeMoreButton = page.locator('.ShopperPostComponent__ViewAllButton-sc-42a38944-3');
        this.shopperCardContainer = this.shopperPostSectionContainer.locator('.swiper');
        this.shopperIndicatorContainer = page.locator('.ShopperPostComponent__CustomPagination-sc-42a38944-5');

        // ---------- Article --------------
        this.articleSectionContainer = page.locator('.ArticleComponent__Box-sc-44596f39-0');
        this.articleSeeMoreButton = page.locator('.ArticleComponent__ViewAllButton-sc-44596f39-3');
        this.articleCardContainer = this.articleSectionContainer.locator('.swiper');
        this.articleIndicatorContainer = page.locator('.ArticleComponent__CustomPagination-sc-44596f39-7');
        this.articleCardBookmarkButton = this.articleSectionContainer.locator('.swiper-slide.swiper-slide-active').getByTestId('bookmark-button');
        this.articleLargeCard_desktop = this.articleSectionContainer.locator('[class*="ArticleLargeCard__Card-"]');
        this.articleSmallCards_desktop = this.articleSectionContainer.locator('[class*="ArticleSmallHorizontalCard__Card-"]');
        this.articleCardBookmarkButton_desktop = this.articleLargeCard_desktop.getByTestId('bookmark-button');

        // ---------- Punpro Suggestion ------------
        this.punproSuggestionContainer = page.locator('.PunproRecommend__BlockComponent-sc-7a5f31b3-0');
        this.punproAllTab = page.locator('#filter-affiliate-');
        this.punproShopperTab = page.locator('#filter-affiliate-shopper');
        this.punproPormotionTab = page.locator('#filter-affiliate-promotion');
        this.punproArticleTab = page.locator('#filter-affiliate-article');
        this.punproCardContainer = this.punproSuggestionContainer.locator('.RecommendList__MasonryContainer-sc-9d24c216-1');
        this.punproCardItem = this.punproCardContainer.locator('[class*="CardComponent"]');
        this.punproSeeMoreButton = this.punproSuggestionContainer.locator('.PunproRecommend__ButtonLoadMore-sc-7a5f31b3-1');

    }

    // ================================================================
    // Actions
    // ================================================================

    // ---------- Banner ----------
    // คลิก banner slide ตามลำดับ (0-indexed) เช่น slide แรก = 0
    async clickBanner(index: number = 0) {
        await this.bannerItem.nth(index).click();
    }

    // คลิก indicator (จุดบอกตำแหน่ง slide) ตามลำดับ
    async clickBannerIndicator(index: number) {
        await this.bannerIndicatorContainer
            .getByRole('button', { name: `Go to slide ${index}`, exact: true })
            .click();
    }

    // ---------- Category Section ----------
    async clickCategoryProductTab() {
        await this.categoryProductTab.click();
    }

    async clickCategoryBrandTab() {
        await this.categoryBrandTab.click();
    }

    // คลิกรายการหมวดหมู่ (dynamic list) เช่น 'รองเท้าผ้าใบ', 'กระเป๋า'
    async clickCategoryItem(categoryName: string) {
        await this.categoryMenuContainer
            .locator('div')
            .filter({ hasText: new RegExp(`^${categoryName}$`) })
            .last()
            .click();
    }

    async clickSeeMoreCategory() {
        await this.categorySeeMoreButton.click();
    }

    async gotoAllCategoriesProductTab() {
        await this.clickCategoryProductTab();
        await this.clickSeeMoreCategory();
        await this.page.waitForURL(/\/category_groups\/products\?category=products/, { timeout: 10000 });
    }

    async gotoAllCategoriesBrandTab() {
        await this.clickCategoryBrandTab();
        await this.clickSeeMoreCategory();
        await this.page.waitForURL(/\/category_groups\/brands\?category=brands/, { timeout: 10000 });
    }

    // ---------- All Category Page ----------
    async clickCategoryFromGroup(categoryId: string) {
        await this.page.locator(`#filter-category-groups-${categoryId}`).click();
    }

    async clickSeeAllInCategoryGroup(groupTitle: string) {
        const container = this.page
            .locator('[class*="BlockCategoryGroups__ComponentContainer"]')
            .filter({ has: this.page.locator('[class*="TitleHead"]', { hasText: groupTitle }) });

        await container.locator('[class*="ButtonNextAllOutline"]', { hasText: 'ดูทั้งหมด' }).click();
    }

    // ---------- Services Section ----------
    // คลิกรายการบริการ (dynamic list) เช่น 'ฝากหิ้ว', 'โปรใกล้ฉัน', 'คูปอง', 'บทความ'
    async clickServiceItem(serviceName: string) {
        await this.servicesSectionContainer
            .locator('div')
            .filter({ hasText: new RegExp(`^${serviceName}$`) })
            .last()
            .click();
    }

    // ---------- Promotion Section ----------
    // คลิกรายการโปรโมชัน (dynamic list) เช่น 'โปร 1 แถม 1', 'โปร 50% up'
    async clickPromotionItem(promotionName: string) {
        await this.promotionSectionContainer.locator('div:visible')
            .filter({ hasText: new RegExp(`^${promotionName}$`) })
            .last()
            .click();
    }

    // ---------- Shopper Post Section ----------
    // คลิกการ์ดฝากหิ้ว (0-indexed ตาม contract เดิม — บวก 1 เพราะ aria-label ของ Swiper เริ่มนับที่ 1)
    async clickShopperPost() {
        await this.shopperCardContainer
            .locator('.swiper-slide.swiper-slide-active > .FixSizeShopperPostCard__Card-sc-bf72de59-0 > a')
            .click();
    }

    async clickShopperPostIndicator(index: number) {
        await this.shopperIndicatorContainer
            .getByRole('button', { name: `Go to slide ${index}`, exact: true })
            .click();
    }

    async clickSeeMoreShopperPost() {
        await this.shopperSeeMoreButton.click();
    }

    // ---------- Article Section ----------
    // คลิกการ์ดบทความ ตามลำดับ (0-indexed)
    async clickArticlePost() {
        await this.articleCardContainer
            .locator('.swiper-slide.swiper-slide-active > .FixSizeArticleCard__Card-sc-a3159c29-0 > a')
            .click();
    }

    async clickArticlePost_desktop(useSmallCard = false) {
        const card = useSmallCard ? this.articleSmallCards_desktop.first() : this.articleLargeCard_desktop;
        await card.locator('a').first().click();
    }

    // Bookmark การ์ดบทความตาม index - รับ parameter แทนการ hardcode
    async clickBookmarkArticle(index: number) {
        await this.articleCardContainer
            .locator('.swiper-slide')
            .nth(index)
            .getByTestId('bookmark-button')
            .click();
    }

    async clickArticleIndicator(index: number) {
        await this.articleIndicatorContainer
            .getByRole('button', { name: `Go to slide ${index}`, exact: true })
            .click();
    }

    async clickSeeMoreArticle() {
        await this.articleSeeMoreButton.click();
    }

    // ---------- Punpro Suggestion ----------
    async clickPunproAllTab() {
        await this.punproAllTab.click();
    }

    async clickPunproShopperTab() {
        await this.punproShopperTab.click();
    }

    async clickPunproPromotionTab() {
        await this.punproPormotionTab.click();
    }

    async clickPunproArticleTab() {
        await this.punproArticleTab.click();
    }

    async clickSeeMoreSuggest() {
        await this.punproSeeMoreButton.click();
    }

    async clickSuggestCard(type: SuggestCardType, index: number = 0) {
        const card = this.getSuggestCard(type, index);
        await card.scrollIntoViewIfNeeded();
        await card.locator('a[aria-label="link"]').first().click();
    }

    // กด favorite ของการ์ดตาม index - scope เข้าการ์ดก่อนเสมอ กันชนกับการ์ดอื่นที่ favorite = 0 เหมือนกัน
    async clickFavoritePost(index: number) {
        await this.punproCardItem.nth(index).locator('[class*="BorderImageLove"][role="button"]').click();
    }

    async findSuggestCard(type: SuggestCardType, index: number = 0, maxLoadMore = 5): Promise<Locator> {
        let card = this.getSuggestCard(type, index);

        for (let i = 0; i < maxLoadMore; i++) {
            if (await card.count() > 0) return card;

            const seeMoreVisible = await this.punproSeeMoreButton.isVisible().catch(() => false);
            if (!seeMoreVisible) break; // โหลดหมดแล้ว ไม่มีปุ่มให้กดต่อ

            await this.clickSeeMoreSuggest();
            await this.page.waitForTimeout(1000); // รอ list โหลดเพิ่ม
            card = this.getSuggestCard(type, index);
        }

        return card;
    }

    async findFavoriteButton(type: SuggestCardType, index: number = 0, maxLoadMore = 5): Promise<Locator> {
        const card = await this.findSuggestCard(type, index, maxLoadMore);
        if (await card.count() === 0) return card; // ไม่เจอการ์ดเลย

        return this.getSuggestCardHeartButton(card);
    }

    // ================================================================
    // Getters (สำหรับ assert ใน spec file)
    // ================================================================

    // ---------- Banner ----------
    getBannerContainer(): Locator {
        return this.bannerContainer;
    }

    getBannerIndicatorContainer(): Locator {
        return this.bannerIndicatorContainer;
    }

    getActiveBannerIndicator(): Locator {
        return this.bannerIndicatorContainer.locator('.swiper-pagination-bullet-active');
    }

    // ---------- Category Section ----------
    getCategorySectionContainer(): Locator {
        return this.categorySectionContainer;
    }

    // ---------- Services Section ----------
    getServicesSectionContainer(): Locator {
        return this.servicesSectionContainer;
    }

    // ---------- Promotion Section ----------
    getPromotionSectionContainer(): Locator {
        return this.promotionSectionContainer;
    }

    // ---------- Shopper Post Section ----------
    getShopperPostSectionContainer(): Locator {
        return this.shopperPostSectionContainer;
    }

    getActiveShopperIndicator(): Locator {
        return this.shopperIndicatorContainer.locator('.swiper-pagination-bullet-active');
    }

    // ---------- Article Section ----------
    getArticleSectionContainer(): Locator {
        return this.articleSectionContainer;
    }

    getActiveArticleIndicator(): Locator {
        return this.articleIndicatorContainer.locator('.swiper-pagination-bullet-active');
    }

    // ---------- Punpro Suggestion ----------
    getPunproSuggestionContainer(): Locator {
        return this.punproSuggestionContainer;
    }

    /** การ์ดตาม type ที่ index ที่ระบุ (default = ใบแรก) — scope อยู่ใน punproSuggestionContainer เสมอ */
    getSuggestCard(type: SuggestCardType, index: number = 0): Locator {
        const prefix = this.suggestCardComponentPrefix[type];
        return this.punproSuggestionContainer
            .locator(`[class*="${prefix}__CardComponent"]`)
            .nth(index);
    }

    /** รูปภาพ (background-image บน div ไม่ใช่ <img>) — ใช้ [style*="background-image"] กันปัญหา DOM depth เปลี่ยน */
    getSuggestCardImage(card: Locator, type: SuggestCardType): Locator {
        const prefix = this.suggestCardComponentPrefix[type];
        return card
            .locator(`[class*="${prefix}__LayoutComponent"]`)
            .locator('[style*="background-image"]')
            .first();
    }

    /** Badge ประเภทการ์ด: "รับหิ้ว" (TypeLabel) / "โปรโมชั่น"-"โปรแนะนำ" / "บทความ" */
    getSuggestCardBadge(card: Locator, type: SuggestCardType): Locator {
        if (type === 'shopper') {
            return card.locator('[class*="LargeCardShopperPost__TypeLabel"]');
        }
        if (type === 'promotion') {
            return card.getByText(/โปรโมชั่น|โปรแนะนำ/).first();
        }
        return card.getByText('บทความ', { exact: true }); // article
    }

    /** ไอคอนหัวใจ — class เดียวกับที่ clickFavoritePost ใช้อยู่แล้ว ใช้ร่วมกันได้ทุก type */
    getSuggestCardHeartButton(card: Locator): Locator {
        return card.locator('[class*="BorderImageLove"][role="button"]');
    }

    /** จำนวนไลค์ ต่อจาก heart button */
    getSuggestCardHeartCount(card: Locator): Locator {
        return this.getSuggestCardHeartButton(card).locator('[class*="TextCountLove"]');
    }

    /** ชื่อร้านค้า — เฉพาะการ์ดประเภท "รับหิ้ว" เท่านั้น (SectionBrand เป็น optional element) */
    getSuggestCardShopName(card: Locator): Locator {
        return card.locator('[class*="LargeCardShopperPost__SectionBrand"]');
    }

    /** หัวข้อ/ชื่อสินค้า */
    getSuggestCardTitle(card: Locator, type: SuggestCardType): Locator {
        if (type === 'shopper') {
            return card.locator('[class*="LargeCardShopperPost__SectionTitle"]');
        }
        return card.locator('[class*="Title"]').first();
    }

    /** ราคา — เฉพาะการ์ดประเภท "รับหิ้ว" เท่านั้น */
    getSuggestCardPrice(card: Locator): Locator {
        return card.locator('[class*="LargeCardShopperPost__SectionProductPrice"]');
    }

    /** วันที่เหลือ/หมดอายุ (shopper, promotion) หรือวันที่เผยแพร่ (article) */
    getSuggestCardExpireOrPublishText(card: Locator, type: SuggestCardType): Locator {
        if (type === 'shopper') {
            return card.locator('[class*="LargeCardShopperPost__TextTimeRemaining"]');
        }
        if (type === 'promotion') {
            return card.locator('[class*="LargeCardPromotion__CarryTimeRemaining"]');
        }
        return card.locator('[class*="Date"], [class*="PublishDate"]').first(); // article
    }

}