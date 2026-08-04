import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Search', () => {
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.searchToggle.click();
    });

    test('Search_mobile_001: ตรวจสอบการแสดง Dropdown เมื่อ Focus ช่อง Search', async ({ page }) => {
        await navbar.searchWithKeyword(['รองเท้าผ้าใบ', 'หมวก']);

        await navbar.goto();
        await navbar.searchToggle.click();
        await navbar.searchInput.click();
        await page.waitForTimeout(5000);
        await navbar.dismissAppBannerIfPresent();

        await expect(navbar.recentSearchSectionTitle).toBeVisible();
        // ปิดการทดสอบชั่วคราว เนื่องจาก Trending Search อ้างอิงข้อมูลจาก Google Analytics ซึ่งใน Staging ยังไม่มีข้อมูลเพียงพอ
        // await expect(navbar.trendingSearchSectionTitle).toBeVisible(); 
    });

    test('Search_mobile_002: ตรวจสอบการซ่อน Dropdown เมื่อคลิกนอกช่อง Search', async ({ page }) => {
        await navbar.searchWithKeyword(['รองเท้าผ้าใบ', 'หมวก']);

        await navbar.goto();
        await navbar.searchToggle.click();
        await navbar.searchInput.click();
        await expect(navbar.searchSuggestionContainer).toBeVisible();
        await page.locator('body').click({ position: { x: 10, y: 10 } });
        await expect(navbar.searchSuggestionContainer).toBeHidden();
    });

    test('Search_mobile_003: ตรวจสอบการค้นหาสินค้าเมื่อกรอกคำค้นหาและกดปุ่มค้นหา', async ({ page }) => {
        await navbar.searchInput.click();
        await navbar.searchInput.fill('สร้อย');
        await navbar.searchButton.click();
        await page.waitForURL(/\/search\?s=/, { timeout: 10000 });

        const url = new URL(page.url());
        expect(url.searchParams.get('s')).toBe('สร้อย'); // ถอด encode ก่อนเทียบ
    });

    test('Search_mobile_004: ตรวจสอบการค้นหาเมื่อไม่กรอกคำค้นหาแล้วกดปุ่มค้นหา', async ({ page }) => {
        await navbar.searchInput.click();
        await navbar.searchButton.click();
        await page.waitForTimeout(1000);
        expect(page.url()).not.toContain('/search');
    });

    test('Search_mobile_005: ตรวจสอบการไม่แสดงปุ่ม "ดูเพิ่มเติม" เมื่อค้นหาล่าสุดไม่เกิน 5 รายการ', async ({ page }) => {
        await navbar.searchWithKeyword(['สร้อย', 'เสื้อ', 'กางเกง', 'รองเท้า', 'หมวก']);
        await navbar.searchToggle.click();
        await navbar.searchInput.click();

        const seeMoreButton = navbar.searchSuggestionContainer.getByRole('button', { name: 'ดูเพิ่มเติม' });
        await expect(seeMoreButton).toBeHidden();
    });

    test('Search_mobile_006: ตรวจสอบการแสดงปุ่ม "ดูเพิ่มเติม" เมื่อค้นหาล่าสุดมากกว่า 5 รายการ', async ({ page }) => {
        await navbar.searchWithKeyword(['สร้อย', 'เสื้อ', 'กางเกง', 'รองเท้า', 'หมวก', 'กำไล']);
        await navbar.searchToggle.click();
        await navbar.searchInput.click();

        const seeMoreButton = navbar.searchSuggestionContainer.getByRole('button', { name: 'ดูเพิ่มเติม' });
        await expect(seeMoreButton).toBeVisible();
    });

    test('Search_mobile_007: ตรวจสอบการนำทางไปหน้าผลการค้นหาเมื่อกดคำค้นหาล่าสุด', async ({ page }) => {
        await navbar.searchWithKeyword(['สร้อย', 'เสื้อ']);
        await navbar.searchToggle.click();
        await navbar.searchInput.click();
        await page.waitForTimeout(5000);
        await navbar.dismissAppBannerIfPresent();
        await navbar.clickRecentSearch('เสื้อ');
        await page.waitForURL(/\/search\?s=/, { timeout: 10000 });

        const url = new URL(page.url());
        expect(url.searchParams.get('s')).toBe('เสื้อ');
    });

    test('Search_mobile_008: ตรวจสอบการลบรายการค้นหาล่าสุดด้วยปุ่ม "x"', async ({ page }) => {
        await navbar.searchWithKeyword(['สร้อย', 'กระเป๋า']);
        await navbar.searchToggle.click();
        await navbar.searchInput.click();
        const countBefore = await navbar.recentSearchItems.count();
        await navbar.removeRecentSearch('กระเป๋า');
        await expect(navbar.recentSearchItems.filter({ hasText: /^กระเป๋า$/ })).toBeHidden();
        await expect(navbar.recentSearchItems).toHaveCount(countBefore - 1);
    });

    test('Search_mobile_009: ตรวจสอบการแสดงคำค้นหาล่าสุดทั้งหมดและปุ่ม "ลบทั้งหมด" เมื่อกด "ดูเพิ่มเติม"', async ({ page }) => {
        await navbar.searchWithKeyword(['สร้อย', 'เสื้อ', 'กางเกง', 'รองเท้า', 'หมวก', 'กระเป๋า']);
        await navbar.searchToggle.click();
        await navbar.searchInput.click();

        const seeMoreButton = navbar.searchSuggestionContainer.getByRole('button', { name: 'ดูเพิ่มเติม' });
        await seeMoreButton.click();

        const deleteAllButton = navbar.searchSuggestionContainer.getByRole('button', { name: 'ลบทั้งหมด' });
        await expect(deleteAllButton).toBeVisible();
        expect(await navbar.recentSearchItems.count()).toBeGreaterThan(5);
    });

    test('Search_mobile_010: ตรวจสอบการลบค้นหาล่าสุดทั้งหมดเมื่อกดปุ่ม "ลบทั้งหมด"', async ({ page }) => {
        await navbar.searchWithKeyword(['สร้อย', 'เสื้อ', 'กางเกง', 'รองเท้า', 'หมวก', 'กระเป๋า']);
        await navbar.searchToggle.click();
        await navbar.searchInput.click();

        const seeMoreButton = navbar.searchSuggestionContainer.getByRole('button', { name: 'ดูเพิ่มเติม' });
        await seeMoreButton.click();

        const deleteAllButton = navbar.searchSuggestionContainer.getByRole('button', { name: 'ลบทั้งหมด' });
        await deleteAllButton.click();
        await expect(navbar.recentSearchItems).toHaveCount(0);
    });

    // ปิดการทดสอบชั่วคราว เนื่องจาก Trending Search อ้างอิงข้อมูลจาก Google Analytics ซึ่งใน Staging ยังไม่มีข้อมูลเพียงพอ
    // test('Search_mobile_011: ตรวจสอบการนำทางไปหน้าผลการค้นหาเมื่อกดคำค้นหามาแรง', async ({ page }) => {
    //     await navbar.clickTrendingSearch('รองเท้าผ้าใบ');
    //     await page.waitForURL(/\/search\?s=/, { timeout: 10000 });

    //     const url = new URL(page.url());
    //     expect(url.searchParams.get('s')).toBe('รองเท้าผ้าใบ');
    // });

    test('Search_mobile_012: ตรวจสอบผลลัพธ์เมื่อค้นหาด้วยคำที่ไม่มีสินค้าในระบบ', async ({ page }) => {
        await navbar.searchInput.click();
        await navbar.searchInput.fill('asdkjhqwe123456');
        await navbar.searchButton.click();
        await page.waitForURL(/\/search\?s=/, { timeout: 10000 });

        const emptyState = page.locator('div').filter({ hasText: 'ไม่มีข้อมูล' }).last();
        await expect(emptyState).toBeVisible();
        await expect(page.getByText(/error|เกิดข้อผิดพลาด/i)).toBeHidden();
    });
});

