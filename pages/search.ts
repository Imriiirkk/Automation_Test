import { Page, Locator } from '@playwright/test';

/**
 * POM: Search
 * Owner: NUBT
 */
export class SearchComponent {
    private page: Page;

    // input Search
    public searchToggle: Locator;
    public searchInput: Locator;
    public searchButton: Locator;
    public searchSuggestionContainer: Locator;
    public searchSuggestionSeeMoreButton: Locator;
    public searchSuggestionDeleteAllButton: Locator;
    public searchInputClearButton: Locator;
    public recentSearchSectionTitle: Locator;
    public recentSearchItems: Locator;
    public trendingSearchSectionTitle: Locator;
    private trendingSearchItems: Locator;

    // ========== Search Result Page ==========
    public breadcrumbContainer: Locator;
    public breadcrumbHomeLink: Locator;

    public resultCountText: Locator;

    public resultTabAll: Locator;
    public resultTabShopperPost: Locator;
    public resultTabPromotion: Locator;
    public resultTabArticle: Locator;

    public sortButton: Locator;
    public sortDropdown: Locator;
    public sortOptionRecommended: Locator;
    public sortOptionPriceAsc: Locator;
    public sortOptionPriceDesc: Locator;

    public resultCardContainer: Locator;
    public resultCardShopper: Locator; // การ์ดแต่ละใบ (repeat element)
    public resultCardPromotion: Locator;
    public resultCardArticle: Locator;
    public noData: Locator;

    // ---------- Product Card: sub-locator ต่อการ์ด ----------
    private cardLink(index: number): Locator {
        return this.resultCardShopper.nth(index).locator('a').first();
    }

    private cardTypeTag(index: number): Locator {
        return this.resultCardShopper.nth(index).locator('[class*="FixSizeItemCard__PostLabel"]');
    }

    private cardTitle(index: number): Locator {
        return this.resultCardShopper.nth(index).locator('[class*="FixSizeItemCard__PostTitle"]');
    }

    private cardPriceContent(index: number): Locator {
        return this.resultCardShopper.nth(index).locator('[class*="FixSizeItemCard__PriceContent"]');
    }

    public cardFavoriteButton(index: number): Locator {
        return this.resultCardShopper.nth(index).locator('[class*="FixSizeItemCard__FavouriteButton"]');
    }

    constructor(page: Page) {
        this.page = page;

        this.searchToggle = page.getByRole('button', { name: 'Toggle navigation' }).nth(1);
        this.searchInput = page.getByRole('textbox', { name: 'text' });
        this.searchButton = page.getByRole('button', { name: 'search' });
        this.searchSuggestionContainer = page.locator('[class*="ContentSuggestBlockSearch__SuggestionContainer"]:visible');
        this.searchSuggestionSeeMoreButton = this.searchSuggestionContainer.getByRole('button', { name: 'ดูเพิ่มเติม' });
        this.searchSuggestionDeleteAllButton = this.searchSuggestionContainer.getByRole('button', { name: 'ลบทั้งหมด' });
        this.searchInputClearButton = page.locator('[class*="InputSearch__InputAndClearWrapper"]').getByRole('button', { name: '×' });
        this.recentSearchSectionTitle = page.locator('[class*="ContentSuggestBlockSearch__SectionTitle"]:visible');
        this.recentSearchItems = page.locator('[class*="ContentSuggestBlockSearch__SuggestionText"]:visible');
        this.trendingSearchSectionTitle = page.locator('[class*="TrendingSearchWord__SectionTitle"]:visible').first();
        this.trendingSearchItems = page.locator('[class*="TrendingSearchWord__TrendingItem"]:visible');

        // ---------- Breadcrumb ----------
        this.breadcrumbContainer = page.locator('[class*="Breadcrumb__BreadcrumbBlock"]');
        this.breadcrumbHomeLink = this.breadcrumbContainer.locator('[class*="Breadcrumb__BreadcrumbItem"]');

        // ---------- Result Count ----------
        this.resultCountText = page.getByText(/พบ\s*\d+\s*รายการ\s*สำหรับ/);

        // ---------- Tabs ----------
        this.resultTabAll = page.locator('[class*="PostTypeFilter__MenuCategoryTypeActive"]').getByText('สินค้าทั้งหมด');
        this.resultTabShopperPost = page.locator('[class*="PostTypeFilter__MenuCategoryTypeActive"]').getByText('รับหิ้ว');
        this.resultTabPromotion = page.locator('[class*="PostTypeFilter__MenuCategoryTypeActive"]').getByText('โปรแนะนำ');
        this.resultTabArticle = page.locator('[class*="PostTypeFilter__MenuCategoryTypeActive"]').getByText('บทความน่าสนใจ');

        // ---------- Sort ----------
        this.sortButton = page.locator('[class*="SelectSortDropdown__Wrapper"]');
        this.sortDropdown = page.locator('[class*="SelectSortDropdown__Menu"]');
        this.sortOptionRecommended = this.sortDropdown.getByText('แนะนำ', { exact: true });
        this.sortOptionPriceAsc = this.sortDropdown.getByText('ราคา (น้อย-มาก)', { exact: true });
        this.sortOptionPriceDesc = this.sortDropdown.getByText('ราคา (มาก-น้อย)', { exact: true });

        // ---------- Product Card ----------
        // TODO: ยืนยัน class จริง — เดาจาก pattern เดียวกับ homePage.ts (RecommendList__MasonryContainer + CardComponent)
        // เพราะแท็บของหน้านี้ (ทั้งหมด/รับหิ้ว/โปรแนะนำ/บทความ) หน้าตาเหมือนกับ section "ปันโปรแนะนำ" ใน Home
        this.resultCardContainer = page.locator('[class*="CardList__MasonryContainer"]');
        this.resultCardShopper = this.resultCardContainer.locator('[class*="FixSizeItemCard__Card-"]');
        this.resultCardPromotion = this.resultCardContainer.locator('[class*="LargeCardPromotion__CardComponent-"]');
        this.resultCardArticle = this.resultCardContainer.locator('[class*="LargeCardArticle__CardComponent-"]');
        this.noData = page.getByText('ไม่มีข้อมูล')

    }

    async clickSearchInput() {
        await this.searchInput.click();
    }

    async clickSearchToggle() {
        await this.searchToggle.click();
    }

    async fillSearch(word: string) {
        await this.searchInput.fill(word);
    }

    async clearSearchInput() {
        await this.searchInput.clear();
    }

    async clickSearchButton() {
        await this.searchButton.click();
    }

    async searchWithKeyword(keyword: string[]) {
        for (const word of keyword) {
            await this.searchInput.click();
            await this.searchInput.fill(word);
            await this.searchButton.click();
            await this.page.waitForURL(/\/search\?s=/, { timeout: 15000 });
            await this.page.waitForTimeout(5000);
        }
        // การกลับหน้าแรก + dismiss overlay ถูกย้ายออก
        // เพราะเป็นความรับผิดชอบของ caller (spec) ไม่ใช่ของ search component เอง
    }

    async clickRecentSearch(keyword: string) {
        await this.recentSearchItems
            .filter({ hasText: new RegExp(`^${keyword}$`) })
            .click();
        await this.page.waitForURL(/\/search\?s=/, { timeout: 15000 });
        await this.page.waitForTimeout(5000);
    }

    async removeRecentSearch(keyword: string) {
        await this.page
            .locator(`.ContentSuggestBlockSearch__ClearItemButton-sc-307edbf9-4[data-item="${keyword}"]:visible`)
            .click();
    }

    async clickSearchSuggestionSeeMore() {
        this.searchSuggestionSeeMoreButton.click();
    }

    async clickSearchSuggestionDeleteAll() {
        this.searchSuggestionDeleteAllButton.click();
    }

    async clickTrendingSearch(keyword: string) {
        await this.searchInput.click();
        await this.trendingSearchItems
            .filter({ hasText: new RegExp(`^${keyword}$`) })
            .click();
        await this.page.waitForURL(/\/search\?s=/, { timeout: 15000 });
        await this.page.waitForTimeout(5000);
    }

    // ---------- Breadcrumb ----------
    async clickBreadcrumbHome() {
        await this.breadcrumbHomeLink.click();
    }

    // ---------- Result Count ----------
    async getResultCountNumber(): Promise<number> {
        const text = await this.resultCountText.textContent() ?? '';
        const match = text.match(/พบ\s*(\d+)\s*รายการ/);
        return match ? Number(match[1]) : NaN;
    }

    // รอให้การ์ดทั้งหมด render ครบ (grid เป็น lazy-load ตามการเลื่อนจอ)
    async waitForAllCardsToRender(expectedCount: number, timeout: number = 15000, type: string): Promise<number> {
        const deadline = Date.now() + timeout;
        let currentCount;
        if (type === 'รับหิ้ว') {
            currentCount = await this.resultCardShopper.count();
            while (currentCount < expectedCount && Date.now() < deadline) {
                // เลื่อนไปที่การ์ดใบสุดท้ายที่ render แล้ว เพื่อ trigger ให้โหลดใบต่อไป
                await this.resultCardShopper.last().scrollIntoViewIfNeeded().catch(() => { });
                await this.page.waitForTimeout(500);
                currentCount = await this.resultCardShopper.count();
            }
        } else if (type === 'โปรแนะนำ') {
            currentCount = await this.resultCardPromotion.count();
            while (currentCount < expectedCount && Date.now() < deadline) {
                // เลื่อนไปที่การ์ดใบสุดท้ายที่ render แล้ว เพื่อ trigger ให้โหลดใบต่อไป
                await this.resultCardPromotion.last().scrollIntoViewIfNeeded().catch(() => { });
                await this.page.waitForTimeout(500);
                currentCount = await this.resultCardPromotion.count();
            }
        } else {
            currentCount = await this.resultCardArticle.count();
            while (currentCount < expectedCount && Date.now() < deadline) {
                // เลื่อนไปที่การ์ดใบสุดท้ายที่ render แล้ว เพื่อ trigger ให้โหลดใบต่อไป
                await this.resultCardArticle.last().scrollIntoViewIfNeeded().catch(() => { });
                await this.page.waitForTimeout(500);
                currentCount = await this.resultCardArticle.count();
            }
        }
        return currentCount;
    }

    // ---------- Tabs ----------
    async clickResultTab(tab: Locator) {
        await tab.click();
        await this.page.waitForTimeout(1000); // รอ list re-render ตามแท็บที่เลือก
    }

    // ---------- Sort ----------
    async openSortDropdown() {
        await this.sortButton.click();
    }

    async selectSortOption(option: Locator) {
        await this.openSortDropdown();
        await option.click();
        await this.page.waitForTimeout(1000); // รอ list re-render ตามลำดับใหม่
    }

    // ---------- Product Card ----------

    // ---------- Favorite ----------
    // TODO: ยืนยัน selector ปุ่มหัวใจจริง (aria-label / data-testid / class เฉพาะ)
    private favoriteButtonInCard(index: number): Locator {
        return this.resultCardShopper.nth(index).locator('[aria-label*="favorite" i], [class*="Favorite"]').first();
    }

    // ---------- Actions ----------
    async clickResultCard(index: number = 0) {
        await this.cardLink(index).click();
    }

    // ---------- Price helpers ----------
    getCardCurrentPrice(index: number): Locator {
        // ราคาที่ใช้ขายจริง (ราคาหลังลด ถ้ามีส่วนลด, หรือราคาปกติถ้าไม่มี) - มีเสมอทุกการ์ด
        return this.resultCardShopper.nth(index).locator('[class*="FixSizeItemCard__PriceContent"] > div.d-flex.align-items-center');
    }

    getCardOriginalPrice(index: number): Locator {
        // ราคาก่อนลด (ขีดฆ่า) - เป็น <span> sibling ของ div ด้านบน มีเฉพาะการ์ดที่มีส่วนลด
        return this.resultCardShopper.nth(index).locator('[class*="FixSizeItemCard__PriceContent"] > span');
    }

    async hasDiscount(index: number): Promise<boolean> {
        return (await this.getCardOriginalPrice(index).count()) > 0;
    }

    // แก้จากเดิมที่ดึงทั้ง container (รวมราคาก่อน+หลังลดปนกัน) มาดึงเฉพาะราคาที่ใช้ขายจริงต่อการ์ด
    async getAllCardPrices(): Promise<number[]> {
        // การ์ดถูกจัดแบ่งเป็นหลาย column ด้วย react-masonry-css (round-robin: การ์ด index คู่/คี่แยกคนละ column)
        // query แบบ flat จะได้ column ซ้ายทั้งหมดก่อนแล้วค่อยตามด้วย column ขวา ทำให้ลำดับไม่ตรงกับลำดับ sort จริง
        // ต้องดึงทีละ column แล้ว interleave กลับ
        // TODO: ยืนยัน class ".my-masonry-grid_column" ว่าอยู่ใต้ resultCardContainer จริงหรือไม่ (ถ้า count ออกมาเป็น 0 ให้เช็คจาก DevTools อีกที)
        const columns = this.resultCardContainer.locator('.my-masonry-grid_column');
        const columnCount = await columns.count();

        const pricesPerColumn: number[][] = [];
        for (let c = 0; c < columnCount; c++) {
            const texts = await columns
                .nth(c)
                .locator('[class*="FixSizeItemCard__PriceContent"] > div.d-flex.align-items-center')
                .allTextContents();
            pricesPerColumn.push(texts.map(t => Number(t.replace(/[^0-9.]/g, ''))));
        }

        // ประกอบกลับตามลำดับ round-robin เดิม: column0[0], column1[0], column2[0], column0[1], column1[1], ...
        const result: number[] = [];
        const maxLen = Math.max(...pricesPerColumn.map(arr => arr.length), 0);
        for (let i = 0; i < maxLen; i++) {
            for (let c = 0; c < columnCount; c++) {
                if (pricesPerColumn[c][i] !== undefined) result.push(pricesPerColumn[c][i]);
            }
        }
        return result;
    }

    async clickCardFavorite(index: number) {
        await this.cardFavoriteButton(index).click();
    }

    getCardFavoriteButton(index: number): Locator {
        return this.cardFavoriteButton(index).locator('svg > path');
    }
    // ยืนยันแล้วว่า default aria-label = "Add to favorites"
    // TODO: ยังไม่เห็นตัวอย่าง state หลังกดแล้ว (เดาว่าเปลี่ยนเป็น "Remove from favorites" ตาม a11y pattern ทั่วไป) - ลองกดจริงแล้วดู aria-label เพื่อยืนยัน
    async isCardFavorited(index: number) {
        const label = await this.cardFavoriteButton(index).getAttribute('aria-label');
        return label === 'Remove from favorites';
    }

}