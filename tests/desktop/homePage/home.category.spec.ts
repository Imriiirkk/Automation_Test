import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/homePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

test.describe('Home Page', () => {
    let homePage: HomePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();
    });

    // test('Home_desktop_001: ตรวจสอบองค์ประกอบของหน้าแรกครบถ้วนเมื่อเข้าเว็บครั้งแรก', async () => {
    //     await expect(homePage.getBannerContainer()).toBeVisible();
    //     await expect(homePage.getCategorySectionContainer()).toBeVisible();
    //     await expect(homePage.getServicesSectionContainer()).toBeVisible();
    //     await expect(homePage.getPromotionSectionContainer()).toBeVisible();
    //     await expect(homePage.getShopperPostSectionContainer()).toBeVisible();
    //     await expect(homePage.getArticleSectionContainer()).toBeVisible();
    //     await expect(homePage.getPunproSuggestionContainer()).toBeVisible();
    // });

    // //================================================================
    // // Hero Banner
    // // ================================================================
    // test.describe('Hero Banner', () => {
    //     test('Home_desktop_002: ตรวจสอบการแสดง Banner หลัก (Hero Banner) พร้อม Banner โปรโมชันคู่', async () => {
    //         // Banner หลัก (ฝั่งซ้าย) พร้อม Indicator
    //         await expect(homePage.getBannerContainer()).toBeVisible();
    //         await expect(homePage.getBannerIndicatorContainer()).toBeVisible();

    //         const targetIndex = 1;
    //         await homePage.clickBannerIndicator(targetIndex);
    //         await expect(homePage.getActiveBannerIndicator())
    //             .toHaveAttribute('aria-label', `Go to slide ${targetIndex}`);

    //         // Banner โปรโมชันคู่ (ฝั่งขวา) - เฉพาะ Desktop
    //         await expect(homePage.bannerDuoContainer).toBeVisible();
    //         await expect(homePage.bannerPromotionOne).toBeVisible();
    //         await expect(homePage.bannerPromotionTwo).toBeVisible();
    //     });

    //     test('Home_desktop_003: ตรวจสอบการนำทาง เมื่อกด Banner หลัก', async ({ page }) => {
    //         const urlBefore = page.url();
    //         await homePage.clickBanner(0);
    //         await page.waitForLoadState('domcontentloaded');
    //         expect(page.url()).not.toBe(urlBefore);
    //     });

    //     test('Home_desktop_004: ตรวจสอบการกด Indicator เพื่อเลื่อนไปยังตำแหน่งสไลด์ที่ต้องการ', async () => {
    //         const targetIndex = 2;
    //         await homePage.clickBannerIndicator(targetIndex);
    //         await expect(homePage.getActiveBannerIndicator())
    //             .toHaveAttribute('aria-label', `Go to slide ${targetIndex}`);
    //     });
    // });

    //================================================================
    // Category Section
    //================================================================
    test.describe('Category Section - Product Tab', () => {
        test.beforeEach(async () => {
            await homePage.getCategorySectionContainer().scrollIntoViewIfNeeded();
        });

        // test('Home_desktop_005: ตรวจสอบการแสดงองค์ประกอบของ Section "หมวดหมู่" ในหน้า "Home"', async ({ page }) => {
        //     await expect(homePage.categoryProductTab).toBeVisible();
        //     await expect(homePage.categoryBrandTab).toBeVisible();
        //     await expect(homePage.categorySeeMoreButton).toBeVisible();
        //     await expect(homePage.categoryMenuContainer).toBeVisible();
        // });

        // test('Home_desktop_006: ตรวจสอบองค์ประกอบของ Section "หมวดหมู่" เมื่ออยู่ในแท็บสินค้า บนหน้า "Home"', async () => {
        //     const expectedCategories = [
        //         'รองเท้าผ้าใบ',
        //         'กระเป๋า',
        //         'เสื้อ',
        //         'ความงาม',
        //         'ไอที',
        //         'กางเกง',
        //         'ดูแลผิว',
        //         'รองเท้าแตะ',
        //         'หมวก',
        //     ];

        //     // เช็กจำนวนหมวดหมู่ครบ 9 รายการ — เป็นหลักฐานทางอ้อมว่ากำลังอยู่แท็บ "สินค้า"
        //     await expect(homePage.categoryItemList).toHaveCount(expectedCategories.length);

        //     for (let i = 0; i < expectedCategories.length; i++) {
        //         const item = homePage.categoryItemList.nth(i);
        //         await expect(item.locator('span')).toHaveText(expectedCategories[i]);
        //         await expect(item.locator('[class*="CategoryMenuComponent__MenuButton-"]')).toBeVisible();
        //     }
        // });

        // // ---------- Category Item Navigation (data-driven) ----------
        // const categoryCases = [
        //     { testId: 'Home_desktop_007', name: 'รองเท้าผ้าใบ' },
        //     { testId: 'Home_desktop_008', name: 'กระเป๋า' },
        //     { testId: 'Home_desktop_009', name: 'เสื้อ' },
        //     { testId: 'Home_desktop_010', name: 'ความงาม' },
        //     { testId: 'Home_desktop_011', name: 'ไอที' },
        //     { testId: 'Home_desktop_012', name: 'กางเกง' },
        //     { testId: 'Home_desktop_013', name: 'ดูแลผิว' },
        //     { testId: 'Home_desktop_014', name: 'รองเท้าแตะ' },
        //     { testId: 'Home_desktop_015', name: 'หมวก' },
        // ];

        // for (const { testId, name } of categoryCases) {
        //     test(`${testId}: ตรวจสอบการนำทางไปหน้าผลการค้นหา เมื่อกดหมวดหมู่ "${name}"`, async ({ page }) => {
        //         await homePage.clickCategoryProductTab();
        //         await homePage.clickCategoryItem(name);
        //         await page.waitForURL(/\/search\?s=.+&ref_type=products/, { timeout: 10000 });

        //         const url = new URL(page.url());
        //         expect(url.searchParams.get('s')).toBe(name);
        //     });
        // }

        // test('Home_desktop_016: ตรวจสอบการนำทางไปหน้า "หมวดหมู่ทั้งหมด" เมื่อกดปุ่ม "ดูทั้งหมด" ในแท็บ สินค้า', async ({ page }) => {
        //     await homePage.clickCategoryProductTab();
        //     await homePage.clickSeeMoreCategory();
        //     await page.waitForURL(/\/category_groups\/products\?category=products/, { timeout: 10000 });
        //     expect(page.url()).toContain('/category_groups/products?category=products');
        // });

        // // ---------- Category Group Navigation (data-driven) ----------
        // const categoryGroupCases = [
        //     { testId: 'Home_desktop_017', group: 'แฟชั่นผู้หญิง', category: 'รองเท้าผ้าใบผู้หญิง', displayName: 'รองเท้าผ้าใบ' },
        //     { testId: 'Home_desktop_019', group: 'แฟชั่นผู้ชาย', category: 'รองเท้าผ้าใบผู้ชาย', displayName: 'รองเท้าผ้าใบ' },
        //     { testId: 'Home_desktop_021', group: 'กระเป๋า', category: 'กระเป๋าคาดอก', displayName: 'กระเป๋าคาดอก' },
        //     { testId: 'Home_desktop_023', group: 'ความงาม & สุขภาพ', category: 'เครื่องสำอาง', displayName: 'เครื่องสำอาง' },
        //     { testId: 'Home_desktop_025', group: 'เครื่องประดับ', category: 'หมวก', displayName: 'หมวก' },
        //     { testId: 'Home_desktop_027', group: 'ไอที', category: 'มือถือ', displayName: 'มือถือ' },
        //     { testId: 'Home_desktop_029', group: 'หมวดหมู่อื่นๆ', category: 'เครื่องใช้ไฟฟ้า', displayName: 'เครื่องใช้ไฟฟ้า' },
        // ];

        // for (const { testId, group, category, displayName } of categoryGroupCases) {
        //     test(`${testId}: ตรวจสอบการนำทางไปหน้า "ผลการค้นหา" เมื่อกดหมวดหมู่ ${displayName} จากกลุ่ม ${group} ที่หน้า "หมวดหมู่ทั้งหมด" ที่แท็บ สินค้า`, async ({ page }) => {
        //         await homePage.clickCategoryProductTab();
        //         await homePage.clickSeeMoreCategory();
        //         await page.waitForURL(/\/category_groups\/products\?category=products/, { timeout: 10000 });

        //         await homePage.clickCategoryFromGroup(category);
        //         await page.waitForURL(/\/search/, { timeout: 10000 });

        //         expect(page.url()).toContain('search');
        //         expect(page.url()).toContain(encodeURIComponent(category));
        //     });
        // }

        // // ---------- "ดูทั้งหมด" per Category Group (data-driven) ----------
        // const seeAllGroupCases = [
        //     { testId: 'Home_desktop_018', group: 'แฟชั่นผู้หญิง' },
        //     { testId: 'Home_desktop_020', group: 'แฟชั่นผู้ชาย' },
        //     { testId: 'Home_desktop_022', group: 'กระเป๋า' },
        //     { testId: 'Home_desktop_024', group: 'ความงาม & สุขภาพ' },
        //     { testId: 'Home_desktop_026', group: 'เครื่องประดับ' },
        //     { testId: 'Home_desktop_028', group: 'ไอที' },
        //     { testId: 'Home_desktop_030', group: 'หมวดหมู่อื่นๆ' },
        // ];

        // for (const { testId, group } of seeAllGroupCases) {
        //     test(`${testId}: ตรวจสอบคลิกลิงก์ "ดูทั้งหมด" ของกลุ่มสินค้า ${group}`, async ({ page }) => {
        //         await homePage.gotoAllCategoriesProductTab();

        //         await homePage.clickSeeAllInCategoryGroup(group);
        //         await page.waitForURL(/\/search/, { timeout: 10000 });

        //         const url = new URL(page.url());
        //         expect(url.pathname).toBe('/search');
        //         // ใช้ url.search (raw, ยังไม่ decode) เทียบ แทนการเทียบทั้งก้อนด้วย encodeURIComponent
        //         expect(decodeURIComponent(url.search)).toContain(group);
        //     });
        // }
    });

    test.describe('Category Section - Brand Tab', () => {
        test.beforeEach(async () => {
            await homePage.getCategorySectionContainer().scrollIntoViewIfNeeded();
            await homePage.clickCategoryBrandTab();
        });

        // test('Home_desktop_031: ตรวจสอบการแสดงรายการแบรนด์ เมื่อกดแท็บ แบรนด์ ใน Section "หมวดหมู่" บนหน้า "Home"', async ({ page }) => {
        //     const brandItems = homePage.categoryMenuContainer.locator('> div, > *');
        //     const itemCount = await brandItems.count();
        //     expect(itemCount).toBeGreaterThanOrEqual(10);

        //     const brandLogos = homePage.categoryMenuContainer.locator('img');
        //     const logoCount = await brandLogos.count();
        //     expect(logoCount).toBeGreaterThanOrEqual(10);
        // });

        // test('Home_desktop_032: ตรวจสอบองค์ประกอบของ Section "หมวดหมู่" บนหน้า "Home" เมื่ออยู่ที่แท็บ แบรนด์', async ({ page }) => {
        //     const expectedCategories = [
        //         'Adidas',
        //         'Nike',
        //         'LYN',
        //         'FILA',
        //         'Charles&Keith',
        //         'Uniqlo',
        //         'Converse',
        //         'Guess',
        //         'CalvinKlein',
        //         'Starbucks',
        //     ];

        //     // เช็กจำนวนหมวดหมู่ครบ 10 รายการ — เป็นหลักฐานทางอ้อมว่ากำลังอยู่แท็บ "แบรนด์"
        //     await expect(homePage.categoryItemList).toHaveCount(expectedCategories.length);

        //     // เช็กชื่อ + ลำดับ + ไอคอนของแต่ละหมวดหมู่
        //     for (let i = 0; i < expectedCategories.length; i++) {
        //         const item = homePage.categoryItemList.nth(i);
        //         await expect(item.locator('span')).toHaveText(expectedCategories[i]);
        //         await expect(item.locator('[class*="CategoryMenuComponent__MenuButton-"]')).toBeVisible();
        //     }
        // });

        // // ---------- Brand Item Navigation (data-driven) ----------
        // const brandCases = [
        //     { testId: 'Home_desktop_033', name: 'Adidas' },
        //     { testId: 'Home_desktop_034', name: 'Nike' },
        //     { testId: 'Home_desktop_035', name: 'LYN' },
        //     { testId: 'Home_desktop_036', name: 'FILA' },
        //     { testId: 'Home_desktop_037', name: 'Charles&Keith' },
        //     { testId: 'Home_desktop_038', name: 'Uniqlo' },
        //     { testId: 'Home_desktop_039', name: 'Converse' },
        //     { testId: 'Home_desktop_040', name: 'Guess' },
        //     { testId: 'Home_desktop_041', name: 'CalvinKlein' },
        //     { testId: 'Home_desktop_042', name: 'Starbucks' },
        // ];

        // for (const { testId, name } of brandCases) {
        //     test(`${testId}: ตรวจสอบการนำทางไปหน้าผลการค้นหา เมื่อกดแบรนด์ "${name}"`, async ({ page }) => {
        //         await homePage.clickCategoryItem(name);
        //         await page.waitForURL(/\/search\?s=.+&ref_type=brands/, { timeout: 10000 });
        //         await expect(page).toHaveURL(/\/search\?s=.+&ref_type=brands/);
        //     });
        // }

        test('Home_desktop_043: ตรวจสอบการนำทางไปหน้าแสดงแบรนด์ทั้งหมด เมื่อกดปุ่ม "ดูทั้งหมด" ในแท็บแบรนด์', async ({ page }) => {
            await homePage.clickSeeMoreCategory();
            await page.waitForURL(/\/category_groups\/brands\?category=brands/, { timeout: 10000 });
            expect(page.url()).toContain('/category_groups/brands?category=brands');
        });

        // ---------- Category Group Navigation (data-driven) ----------
        const categoryGroupCases = [
            { testId: 'Home_desktop_044', group: 'แบรนด์แฟชั่น', category: 'Nike', displayName: 'Nike' },
            // { testId: 'Home_desktop_045', group: 'แบรนด์อื่นๆ', category: '_Gift_Brand', displayName: '_Gift_Brand' },
        ];

        for (const { testId, group, category, displayName } of categoryGroupCases) {
            test(`${testId}: ตรวจสอบการนำทางไปหน้า "ผลการค้นหา" เมื่อกดหมวดหมู่ ${displayName} จากกลุ่ม ${group} ที่หน้า "หมวดหมู่ทั้งหมด" ที่แท็บ แบรนด์`, async ({ page }) => {
                await homePage.gotoAllCategoriesBrandTab();

                await homePage.clickCategoryFromGroup(category);
                await page.waitForURL(/\/search/, { timeout: 10000 });

                expect(page.url()).toContain('search');
                expect(page.url()).toContain(encodeURIComponent(category));
            });
        }
    });

});