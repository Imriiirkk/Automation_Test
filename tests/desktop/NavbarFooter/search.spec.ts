import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Navbar/Footer', () => {
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        await navbar.goto();
    });

    test('Search_desktop_001: แสดง Dropdown เมื่อ Focus ช่อง Search', async ({ page }) => {
        await navbar.search.searchWithKeyword(['รองเท้าผ้าใบ', 'หมวก']);

        await navbar.goto();
        await navbar.search.clickSearchInput();
        await page.waitForTimeout(5000);

        await expect(navbar.getRecentSearchTitle()).toBeVisible();
        // ปิดการทดสอบชั่วคราว เนื่องจาก Trending Search อ้างอิงข้อมูลจาก Google Analytics
        // ซึ่งใน Staging ยังไม่มีข้อมูลเพียงพอ
        // await expect(navbar.trendingSearchSectionTitle).toBeVisible();
    });

    test('Search_desktop_002: ซ่อน Dropdown เมื่อคลิกนอกช่อง Search', async ({ page }) => {
        await navbar.search.searchWithKeyword(['รองเท้าผ้าใบ', 'หมวก']);

        await navbar.goto();
        await navbar.search.clickSearchInput();
        await expect(navbar.getSeachSuggestionContainer()).toBeVisible();
        await page.locator('body').click({ position: { x: 10, y: 10 } });
        await expect(navbar.getSeachSuggestionContainer()).toBeHidden();
    });

    test('Search_desktop_003: ค้นหาสินค้าเมื่อกรอกคำค้นหาและกดปุ่มค้นหา', async ({ page }) => {
        await navbar.search.clickSearchInput();
        await navbar.search.fillSearch('สร้อย');
        await navbar.search.clickSearchButton();
        await page.waitForURL(/\/search\?s=/, { timeout: 10000 });

        const url = new URL(page.url());
        expect(url.searchParams.get('s')).toBe('สร้อย'); // ถอด encode ก่อนเทียบ
    });

    test('Search_desktop_004: ค้นหาเมื่อไม่กรอกคำค้นหาแล้วกดปุ่มค้นหา', async ({ page }) => {
        await navbar.search.clickSearchInput();
        await navbar.search.clickSearchButton();
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain('/search');
    });

    test('Search_desktop_005: ไม่แสดงปุ่ม "ดูเพิ่มเติม" เมื่อค้นหาล่าสุดไม่เกิน 5 รายการ', async ({ page }) => {
        await navbar.search.searchWithKeyword(['สร้อย', 'เสื้อ', 'กางเกง', 'รองเท้า', 'หมวก']);
        await navbar.search.clickSearchInput();

        const seeMoreButton = navbar.getSearchSuggestionSeemoreButton();
        await expect(seeMoreButton).toBeHidden();
    });

    test('Search_desktop_006: แสดงปุ่ม "ดูเพิ่มเติม" เมื่อค้นหาล่าสุดมากกว่า 5 รายการ', async ({ page }) => {
        await navbar.search.searchWithKeyword(['สร้อย', 'เสื้อ', 'กางเกง', 'รองเท้า', 'หมวก', 'กำไล']);
        await navbar.search.clickSearchInput();
        await navbar.search.clearSearchInput();

        const seeMoreButton = navbar.getSearchSuggestionSeemoreButton();
        await expect(seeMoreButton).toBeVisible();
    });

    test('Search_desktop_007: นำทางไปหน้าผลการค้นหาเมื่อกดคำค้นหาล่าสุด', async ({ page }) => {
        await navbar.search.searchWithKeyword(['สร้อย', 'เสื้อ']);
        await navbar.search.clickSearchInput();
        await navbar.search.clearSearchInput();
        await page.waitForTimeout(5000);
        await navbar.search.clickRecentSearch('เสื้อ');
        await page.waitForURL(/\/search\?s=/, { timeout: 10000 });

        const url = new URL(page.url());
        expect(url.searchParams.get('s')).toBe('เสื้อ');
    });

    test('Search_desktop_008: ลบรายการค้นหาล่าสุดด้วยปุ่ม "x"', async ({ page }) => {
        await navbar.search.searchWithKeyword(['สร้อย', 'กระเป๋า']);
        await navbar.search.clickSearchInput();
        await navbar.search.clearSearchInput();
        const countBefore = await navbar.getRecentSearchItemsCount();
        await navbar.search.removeRecentSearch('กระเป๋า');
        await expect(navbar.getRecentSearchItems().filter({ hasText: /^กระเป๋า$/ })).toBeHidden();
        await expect(navbar.getRecentSearchItems()).toHaveCount(countBefore - 1);
    });

    test('Search_desktop_009: แสดงคำค้นหาล่าสุดทั้งหมดและปุ่ม "ลบทั้งหมด" เมื่อกด "ดูเพิ่มเติม"', async ({ page }) => {
        await navbar.search.searchWithKeyword(['สร้อย', 'เสื้อ', 'กางเกง', 'รองเท้า', 'หมวก', 'กระเป๋า']);
        await navbar.search.clickSearchInput();
        await navbar.search.clearSearchInput();

        const seeMoreButton = navbar.getSearchSuggestionSeemoreButton();
        await seeMoreButton.click();

        const deleteAllButton = navbar.getSearchSuggestionDeleteAllButton();
        await expect(deleteAllButton).toBeVisible();
        expect(await navbar.getRecentSearchItemsCount()).toBeGreaterThan(5);
    });

    test('Search_desktop_010: ลบค้นหาล่าสุดทั้งหมดเมื่อกดปุ่ม "ลบทั้งหมด"', async ({ page }) => {
        await navbar.search.searchWithKeyword(['สร้อย', 'เสื้อ', 'กางเกง', 'รองเท้า', 'หมวก', 'กระเป๋า']);
        await navbar.search.clickSearchInput();
        await navbar.search.clearSearchInput();

        await navbar.search.clickSearchSuggestionSeeMore();
        await navbar.search.clickSearchSuggestionDeleteAll();
        await expect(navbar.getRecentSearchItems()).toHaveCount(0);
    });

    // ปิดการทดสอบชั่วคราว เนื่องจาก Trending Search อ้างอิงข้อมูลจาก Google Analytics ซึ่งใน Staging ยังไม่มีข้อมูลเพียงพอ
    // test('Search_desktop_011: นำทางไปหน้าผลการค้นหาเมื่อกดคำค้นหามาแรง', async ({ page }) => {
    //     await navbar.search.clickTrendingSearch('รองเท้าผ้าใบ');
    //     await page.waitForURL(/\/search\?s=/, { timeout: 10000 });

    //     const url = new URL(page.url());
    //     expect(url.searchParams.get('s')).toBe('รองเท้าผ้าใบ');
    // });

    test('Search_desktop_012: ผลลัพธ์เมื่อค้นหาด้วยคำที่ไม่มีสินค้าในระบบ', async ({ page }) => {
        await navbar.search.clickSearchInput();
        await navbar.search.fillSearch('asdkjhqwe123456');
        await navbar.search.clickSearchButton();
        await page.waitForURL(/\/search\?s=/, { timeout: 10000 });

        const emptyState = page.locator('div').filter({ hasText: 'ไม่มีข้อมูล' }).last();
        await expect(emptyState).toBeVisible();
        await expect(page.getByText(/error|เกิดข้อผิดพลาด/i)).toBeHidden();
    });
});

