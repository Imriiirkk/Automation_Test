import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { NavbarFooter } from '../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Home Page', () => {
    let homePage: HomePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();
    });

    // test('Home_mobile_001: ตรวจสอบองค์ประกอบของหน้าแรกครบถ้วนเมื่อเข้าเว็บครั้งแรก', async () => {
    //     await expect(homePage.getBannerContainer()).toBeVisible();
    //     await expect(homePage.getCategorySectionContainer()).toBeVisible();
    //     await expect(homePage.getServicesSectionContainer()).toBeVisible();
    //     await expect(homePage.getPromotionSectionContainer()).toBeVisible();
    //     await expect(homePage.getShopperPostSectionContainer()).toBeVisible();
    //     await expect(homePage.getArticleSectionContainer()).toBeVisible();
    //     await expect(homePage.getPunproSuggestionContainer()).toBeHidden();
    // });

    // ================================================================
    // Hero Banner
    // ================================================================
    // test.describe('Hero Banner', () => {
    //     test('Home_mobile_002: ตรวจสอบการแสดง Banner หลัก (Hero Banner) พร้อม Indicator', async () => {
    //         await expect(homePage.getBannerContainer()).toBeVisible();
    //         await expect(homePage.getBannerIndicatorContainer()).toBeVisible();
    //     });

    //     test('Home_mobile_003: ตรวจสอบการนำทาง เมื่อกด Banner หลัก', async ({ page }) => {
    //         const urlBefore = page.url();
    //         await homePage.clickBanner(0);
    //         await page.waitForLoadState('domcontentloaded');
    //         expect(page.url()).not.toBe(urlBefore);
    //     });

    //     test('Home_mobile_004: ตรวจสอบการกด Indicator เพื่อเลื่อนไปยังตำแหน่งสไลด์ที่ต้องการ', async () => {
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

        // test('Home_mobile_005: ตรวจสอบการแสดง Section "หมวดหมู่" พร้อมแท็บและปุ่มดูทั้งหมด', async ({ page }) => {
        //     await expect(homePage.categoryProductTab).toBeVisible();
        //     await expect(homePage.categoryBrandTab).toBeVisible();
        //     await expect(homePage.categorySeeMoreButton).toBeVisible();
        //     const categoryItems = homePage.categoryMenuContainer.locator('> div, > *');
        //     const itemCount = await categoryItems.count();
        //     expect(itemCount).toBeGreaterThanOrEqual(9);
        // });

        // // ---------- Category Item Navigation (data-driven) ----------
        // const categoryCases = [
        //     { testId: 'Home_mobile_006', name: 'รองเท้าผ้าใบ' },
        //     { testId: 'Home_mobile_007', name: 'กระเป๋า' },
        //     { testId: 'Home_mobile_008', name: 'เสื้อ' },
        //     { testId: 'Home_mobile_009', name: 'ความงาม' },
        //     { testId: 'Home_mobile_010', name: 'ไอที' },
        //     { testId: 'Home_mobile_011', name: 'กางเกง' },
        //     { testId: 'Home_mobile_012', name: 'ดูแลผิว' },
        //     { testId: 'Home_mobile_013', name: 'รองเท้าแตะ' },
        //     { testId: 'Home_mobile_014', name: 'หมวก' },
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

        // test('Home_mobile_015: ตรวจสอบการนำทางไปหน้าแสดงหมวดหมู่ทั้งหมด เมื่อกดปุ่ม "ดูทั้งหมด" ในแท็บสินค้า', async ({ page }) => {
        //     await homePage.clickCategoryProductTab();
        //     await homePage.clickSeeMoreCategory();
        //     await page.waitForURL(/\/category_groups\/products\?category=products/, { timeout: 10000 });
        //     expect(page.url()).toContain('/category_groups/products?category=products');
        // });

        // ---------- Category Group Navigation (data-driven) ----------
        const categoryGroupCases = [
            { testId: 'Home_desktop_016', group: 'แฟชั่นผู้หญิง', category: 'รองเท้าผ้าใบผู้หญิง', displayName: 'รองเท้าผ้าใบ' },
            { testId: 'Home_desktop_018', group: 'แฟชั่นผู้ชาย', category: 'รองเท้าผ้าใบผู้ชาย', displayName: 'รองเท้าผ้าใบ' },
            { testId: 'Home_desktop_020', group: 'กระเป๋า', category: 'กระเป๋าคาดอก', displayName: 'กระเป๋าคาดอก' },
            { testId: 'Home_desktop_022', group: 'ความงาม & สุขภาพ', category: 'เครื่องสำอาง', displayName: 'เครื่องสำอาง' },
            { testId: 'Home_desktop_024', group: 'เครื่องประดับ', category: 'หมวก', displayName: 'หมวก' },
            { testId: 'Home_desktop_026', group: 'ไอที', category: 'มือถือ', displayName: 'มือถือ' },
            { testId: 'Home_desktop_028', group: 'หมวดหมู่อื่นๆ', category: 'เครื่องใช้ไฟฟ้า', displayName: 'เครื่องใช้ไฟฟ้า' },
        ];

        for (const { testId, group, category, displayName } of categoryGroupCases) {
            test(`${testId}: ตรวจสอบการนำทางไปหน้า "ผลการค้นหา" เมื่อกดหมวดหมู่ ${displayName} จากกลุ่ม ${group} ที่หน้า "หมวดหมู่ทั้งหมด" ที่แท็บ สินค้า`, async ({ page }) => {
                await homePage.clickCategoryProductTab();
                await homePage.clickSeeMoreCategory();
                await page.waitForURL(/\/category_groups\/products\?category=products/, { timeout: 10000 });

                await homePage.clickCategoryFromGroup(category);
                await page.waitForURL(/\/search/, { timeout: 10000 });

                expect(page.url()).toContain('search');
                expect(page.url()).toContain(encodeURIComponent(category));
            });
        }

        // ---------- "ดูทั้งหมด" per Category Group (data-driven) ----------
        const seeAllGroupCases = [
            { testId: 'Home_desktop_017', group: 'แฟชั่นผู้หญิง' },
            { testId: 'Home_desktop_019', group: 'แฟชั่นผู้ชาย' },
            { testId: 'Home_desktop_021', group: 'กระเป๋า' },
            { testId: 'Home_desktop_023', group: 'ความงาม & สุขภาพ' },
            { testId: 'Home_desktop_025', group: 'เครื่องประดับ' },
            { testId: 'Home_desktop_027', group: 'ไอที' },
            { testId: 'Home_desktop_029', group: 'หมวดหมู่อื่นๆ' },
        ];

        for (const { testId, group } of seeAllGroupCases) {
            test(`${testId}: ตรวจสอบคลิกลิงก์ "ดูทั้งหมด" ของกลุ่ม ${group}`, async ({ page }) => {
                await homePage.clickCategoryProductTab();
                await homePage.clickSeeMoreCategory();
                await page.waitForURL(/\/category_groups\/products\?category=products/, { timeout: 10000 });

                await homePage.clickSeeAllInCategoryGroup(group);
                await page.waitForURL(/\/search/, { timeout: 10000 });

                const url = new URL(page.url());
                expect(url.pathname).toBe('/search');
                // ใช้ url.search (raw, ยังไม่ decode) เทียบ แทนการเทียบทั้งก้อนด้วย encodeURIComponent
                expect(decodeURIComponent(url.search)).toContain(group);
            });
        }
    });

    // test.describe('Category Section - Brand Tab', () => {
    //     test.beforeEach(async () => {
    //         await homePage.getCategorySectionContainer().scrollIntoViewIfNeeded();
    //         await homePage.clickCategoryBrandTab();
    //     });

    //     test('Home_mobile_016: ตรวจสอบการแสดงรายการแบรนด์ เมื่อกดแท็บ "แบรนด์"', async ({ page }) => {
    //         const brandItems = homePage.categoryMenuContainer.locator('> div, > *');
    //         const itemCount = await brandItems.count();
    //         expect(itemCount).toBeGreaterThanOrEqual(10);

    //         const brandLogos = homePage.categoryMenuContainer.locator('img');
    //         const logoCount = await brandLogos.count();
    //         expect(logoCount).toBeGreaterThanOrEqual(10);
    //     });

    //     // ---------- Brand Item Navigation (data-driven) ----------
    //     const brandCases = [
    //         { testId: 'Home_mobile_017', name: 'Adidas' },
    //         { testId: 'Home_mobile_018', name: 'Nike' },
    //         { testId: 'Home_mobile_019', name: 'LYN' },
    //         { testId: 'Home_mobile_020', name: 'FILA' },
    //         { testId: 'Home_mobile_021', name: 'Charles&Keith' },
    //         { testId: 'Home_mobile_022', name: 'Uniqlo' },
    //         { testId: 'Home_mobile_023', name: 'Converse' },
    //         { testId: 'Home_mobile_024', name: 'Guess' },
    //         { testId: 'Home_mobile_025', name: 'CalvinKlein' },
    //         { testId: 'Home_mobile_026', name: 'Starbucks' },
    //     ];

    //     for (const { testId, name } of brandCases) {
    //         test(`${testId}: ตรวจสอบการนำทางไปหน้าผลการค้นหา เมื่อกดแบรนด์ "${name}"`, async ({ page }) => {
    //             await homePage.clickCategoryItem(name);
    //             await page.waitForURL(/\/search\?s=.+&ref_type=brands/, { timeout: 10000 });
    //             await expect(page).toHaveURL(/\/search\?s=.+&ref_type=brands/);
    //         });
    //     }

    //     test('Home_mobile_027: ตรวจสอบการนำทางไปหน้าแสดงแบรนด์ทั้งหมด เมื่อกดปุ่ม "ดูทั้งหมด" ในแท็บแบรนด์', async ({ page }) => {
    //         await homePage.clickSeeMoreCategory();
    //         await page.waitForURL(/\/category_groups\/brands\?category=brands/, { timeout: 10000 });
    //         expect(page.url()).toContain('/category_groups/brands?category=brands');
    //     });
    // });

    //================================================================
    // Services Section
    //================================================================
    // test.describe('Services Section', () => {
    //     test.beforeEach(async () => {
    //         await homePage.getServicesSectionContainer().scrollIntoViewIfNeeded();
    //         await navbar.dismissAllOverlaysIfPresent();
    //     });

    //     test('Home_mobile_028: ตรวจสอบการแสดง Section "บริการทั้งหมด" ครบถ้วน', async ({ page }) => {
    //         const servicesContainer = homePage.getServicesSectionContainer();
    //         await expect(servicesContainer.getByText('ฝากหิ้ว', { exact: true })).toBeVisible();
    //         await expect(servicesContainer.getByText('โปรใกล้ฉัน', { exact: true })).toBeVisible();
    //         await expect(servicesContainer.getByText('คูปอง', { exact: true })).toBeVisible();
    //         await expect(servicesContainer.getByText('บทความ', { exact: true })).toBeVisible();

    //         const icons = servicesContainer.locator('svg');
    //         const iconCount = await icons.count();
    //         expect(iconCount).toBeGreaterThanOrEqual(4);
    //     });

    //     // ---------- Service Item Navigation (data-driven) ----------
    //     const serviceCases = [
    //         { testId: 'Home_mobile_029', name: 'ฝากหิ้ว', urlPattern: /\/shopper_posts/ },
    //         { testId: 'Home_mobile_030', name: 'โปรใกล้ฉัน', urlPattern: /\/promotion/ },
    //         { testId: 'Home_mobile_031', name: 'คูปอง', urlPattern: /\/coupons/ },
    //         { testId: 'Home_mobile_032', name: 'บทความ', urlPattern: /\/article/ },
    //     ];

    //     for (const { testId, name, urlPattern } of serviceCases) {
    //         test(`${testId}: ตรวจสอบการนำทางไปหน้าที่ถูกต้อง เมื่อกดบริการ "${name}"`, async ({ page }) => {
    //             await homePage.clickServiceItem(name);
    //             await page.waitForURL(urlPattern, { timeout: 10000 });
    //         });
    //     }
    // });

    //================================================================
    // Promotion Suggestion Section
    //================================================================
    // test.describe('Promotion Suggestion Section', () => {
    //     test.beforeEach(async () => {
    //         await homePage.getPromotionSectionContainer().scrollIntoViewIfNeeded();
    //     });

    //     test('Home_mobile_033: ตรวจสอบการแสดง Section "โปรแนะนำฝากหิ้ว" ครบถ้วน', async () => {
    //         const promotionContainer = homePage.getPromotionSectionContainer();
    //         await navbar.dismissAllOverlaysIfPresent();

    //         await expect(promotionContainer.getByText('โปร 1 แถม 1', { exact: true })).toBeVisible();
    //         await expect(promotionContainer.getByText('โปร 50% up', { exact: true })).toBeVisible();
    //         await expect(promotionContainer.getByText('โปรมือถือ', { exact: true })).toBeVisible();
    //         await expect(promotionContainer.getByText('โปรอาหาร', { exact: true })).toBeVisible();
    //         await expect(promotionContainer.getByText('ตั๋วถูก', { exact: true })).toBeVisible();
    //         await expect(promotionContainer.getByText('โค้ดส่วนลด', { exact: true })).toBeVisible();

    //         const icons = promotionContainer.locator('svg');
    //         const iconCount = await icons.count();
    //         expect(iconCount).toBeGreaterThanOrEqual(6);
    //     });

    //     // ---------- Promotion Filter Navigation (data-driven) ----------
    //     const promotionCases = [
    //         { testId: 'Home_mobile_034', name: 'โปร 1 แถม 1' },
    //         { testId: 'Home_mobile_035', name: 'โปร 50% up' },
    //         { testId: 'Home_mobile_036', name: 'โปรมือถือ' },
    //         { testId: 'Home_mobile_037', name: 'โปรอาหาร' },
    //         { testId: 'Home_mobile_038', name: 'ตั๋วถูก' },
    //         { testId: 'Home_mobile_039', name: 'โค้ดส่วนลด' },
    //     ];

    //     for (const { testId, name } of promotionCases) {
    //         test(`${testId}: ตรวจสอบการนำทางไปหน้า "โปรโมชัน" แบบ filter เมื่อกด "${name}"`, async ({ page }) => {
    //             await homePage.clickPromotionItem(name);
    //             await page.waitForURL(/\/promotion/, { timeout: 10000 });
    //             expect(page.url()).toContain('/promotion');
    //         });
    //     }
    // });

    //================================================================
    // Shopper Post Section
    //================================================================
    // test.describe('Shopper Post Section', () => {
    //     test.beforeEach(async () => {
    //         await homePage.getShopperPostSectionContainer().scrollIntoViewIfNeeded();
    //     });

    //     test('Home_mobile_040: แสดง Section "ฝากหิ้ว" บน Mobile พร้อมเลื่อนอัตโนมัติ', async ({ page }) => {
    //         const shopperSection = homePage.getShopperPostSectionContainer();
    //         await expect(homePage.shopperSeeMoreButton).toBeVisible();

    //         const cardCount = await page.getByRole('group', { name: /\d+ \/ \d+/ }).count();
    //         expect(cardCount).toBeGreaterThanOrEqual(9);

    //         await expect(homePage.shopperIndicatorContainer).toBeVisible();
    //         await page.bringToFront();
    //         const screenshotBefore = await shopperSection.screenshot();
    //         await page.waitForTimeout(6000);
    //         const screenshotAfter = await shopperSection.screenshot();
    //         expect(screenshotBefore).not.toEqual(screenshotAfter);
    //     });

    //     test('Home_mobile_041: กด Indicator เพื่อเลื่อนไปยังการ์ดที่ต้องการ', async ({ page }) => {
    //         const targetIndex = 2;
    //         await homePage.clickShopperPostIndicator(targetIndex);
    //         await expect(homePage.getActiveShopperIndicator())
    //             .toHaveAttribute('aria-label', `Go to slide ${targetIndex}`);
    //     });

    //     test('Home_mobile_042: นำทางไปหน้าปันโปรรับหิ้ว เมื่อกดปุ่ม "ดูทั้งหมด"', async ({ page }) => {
    //         await homePage.clickSeeMoreShopperPost();
    //         await page.waitForURL(/\/shopper_posts/, { timeout: 10000 });
    //     });

    //     test('Home_mobile_043: นำทางไปหน้ารายละเอียด เมื่อกดการ์ดฝากหิ้ว', async ({ page }) => {
    //         const urlBefore = page.url();
    //         await homePage.clickShopperPost();
    //         await page.waitForURL(/\/sp\//, { timeout: 10000 });
    //         expect(page.url()).not.toBe(urlBefore);
    //     });
    // });

    // //================================================================
    // // Article Post Section
    // //================================================================
    // test.describe('Article Post Section', () => {
    //     test.beforeEach(async () => {
    //         await homePage.getArticleSectionContainer().scrollIntoViewIfNeeded();
    //         await navbar.dismissAllOverlaysIfPresent();
    //     });

    //     test('Home_mobile_044: แสดง Section "บทความยอดนิยม" บน Mobile พร้อมเลื่อนอัตโนมัติ', async ({ page }) => {
    //         const articleSection = homePage.getArticleSectionContainer();
    //         await expect(homePage.articleSeeMoreButton).toBeVisible();

    //         const cardCount = await page.getByRole('group', { name: /\d+ \/ \d+/ }).count();
    //         expect(cardCount).toBeGreaterThanOrEqual(4);

    //         await expect(homePage.articleIndicatorContainer).toBeVisible();
    //         await page.bringToFront();
    //         const screenshotBefore = await articleSection.screenshot();
    //         await page.waitForTimeout(6000);
    //         const screenshotAfter = await articleSection.screenshot();
    //         expect(screenshotBefore).not.toEqual(screenshotAfter);
    //     });

    //     test('Home_mobile_045: กด Indicator เพื่อเลื่อนไปยังการ์ดที่ต้องการ', async ({ page }) => {
    //         const targetIndex = 2;
    //         await homePage.clickArticleIndicator(targetIndex);
    //         await expect(homePage.getActiveArticleIndicator())
    //             .toHaveAttribute('aria-label', `Go to slide ${targetIndex}`);
    //     });

    //     test('Home_mobile_046: นำทางไปหน้าปันโปรรับหิ้ว เมื่อกดปุ่ม "ดูทั้งหมด"', async ({ page }) => {
    //         await homePage.clickSeeMoreArticle();
    //         await page.waitForURL(/\/article/, { timeout: 10000 });
    //     });

    //     test('Home_mobile_047: นำทางไปหน้ารายละเอียด เมื่อกดการ์ดบทความ', async ({ page }) => {
    //         const urlBefore = page.url();
    //         await homePage.clickArticlePost();
    //         await page.waitForURL(/\/p\//, { timeout: 10000 });
    //         expect(page.url()).not.toBe(urlBefore);
    //     });

    //     test('Home_mobile_048: ตรวจสอบการกดปุ่ม Bookmark บนการ์ดบทความ โดยยังไม่ได้ login', async ({ page }) => {
    //         const bookmarkButton = homePage.articleCardBookmarkButton.first();
    //         await expect(bookmarkButton).toBeVisible();
    //         await bookmarkButton.click();
    //         await expect(navbar.getLoginModalLogo()).toBeVisible({ timeout: 10000 });
    //     });

    //     test('Home_mobile_049: ตรวจสอบการกดปุ่ม Bookmark บนการ์ดบทความ โดย login แล้ว', async ({ page }) => {
    //         await navbar.openLoginOrSignup_mobile();
    //         await navbar.auth.loginWithEmail(email, password);
    //         await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

    //         const bookmarkButton = homePage.articleCardBookmarkButton.first();
    //         await bookmarkButton.click();
    //         await expect(bookmarkButton.locator('svg')).toBeVisible();
    //     });

    //     test('Home_mobile_050: ตรวจสอบการยกเลิก Bookmark เมื่อกดปุ่มซ้ำ', async ({ page }) => {
    //         await navbar.openLoginOrSignup_mobile();
    //         await navbar.auth.loginWithEmail(email, password);
    //         await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

    //         const bookmarkButton = homePage.articleCardBookmarkButton.first();
    //         await bookmarkButton.click();
    //         await expect(bookmarkButton.locator('svg')).toBeVisible();
    //         await bookmarkButton.click();
    //         await expect(bookmarkButton.locator('i.fa-bookmark')).toBeVisible();
    //     });
    // });

    //================================================================
    // Suggestion Section
    //================================================================
    // test.describe('Suggestion Section', () => {
    //     test.beforeEach(async () => {
    //         await homePage.getPunproSuggestionContainer().scrollIntoViewIfNeeded();
    //     });

    //     test('Home_mobile_051: แสดง Section "ปันโปรแนะนำ" ครบถ้วน (แท็บเริ่มต้น "ทั้งหมด")', async ({ page }) => {
    //         // มีแท็บครบ 4 แท็บ
    //         await expect(homePage.punproAllTab).toBeVisible();
    //         await expect(homePage.punproShopperTab).toBeVisible();
    //         await expect(homePage.punproPormotionTab).toBeVisible();
    //         await expect(homePage.punproArticleTab).toBeVisible();

    //         // แสดงการ์ดตามแท็บที่เลือก (แท็บเริ่มต้น "ทั้งหมด") สูงสุด 10 การ์ด
    //         const cardCount = await homePage.punproCardItem.count();
    //         expect(cardCount).toBeLessThanOrEqual(10);
    //         expect(cardCount).toBeGreaterThan(0);
    //     });

    //     // ---------- Tab Switching (data-driven) ----------
    //     const tabCases = [
    //         { testId: 'Home_mobile_052', label: 'รับหิ้ว', clickTab: (h: HomePage) => h.clickPunproShopperTab() },
    //         { testId: 'Home_mobile_053', label: 'โปรแนะนำ', clickTab: (h: HomePage) => h.clickPunproPromotionTab() },
    //         { testId: 'Home_mobile_054', label: 'บทความน่าสนใจ', clickTab: (h: HomePage) => h.clickPunproArticleTab() },
    //     ];

    //     for (const { testId, label, clickTab } of tabCases) {
    //         test(`${testId}: แสดงการ์ดที่ถูกต้อง เมื่อสลับไปแท็บ "${label}"`, async ({ page }) => {
    //             await clickTab(homePage);
    //             await page.waitForTimeout(1000);
    //             const cardCount = await homePage.punproCardItem.count();
    //             expect(cardCount).toBeGreaterThan(0);
    //             expect(cardCount).toBeLessThanOrEqual(10);
    //         });
    //     }

    //     test('Home_mobile_055: โหลดการ์ดเพิ่ม เมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
    //         await homePage.clickPunproAllTab();
    //         await page.waitForTimeout(1000);

    //         const countBefore = await homePage.punproCardItem.count();
    //         const scrollYBefore = await page.evaluate(() => window.scrollY);

    //         await homePage.clickSeeMoreSuggest();
    //         await page.waitForTimeout(10000);

    //         const countAfter = await homePage.punproCardItem.count();
    //         expect(countAfter).toBeGreaterThan(countBefore);

    //         const scrollYAfter = await page.evaluate(() => window.scrollY);
    //         expect(scrollYAfter).toBeGreaterThanOrEqual(scrollYBefore);
    //     });

    //     test('Home_mobile_056: ไม่แสดงปุ่ม "ดูเพิ่มเติม" เมื่อมีรายการไม่เกิน 10 รายการ', async ({ page }) => {
    //         await homePage.clickPunproPromotionTab();
    //         await page.waitForTimeout(1000);
    //         const cardCount = await homePage.punproCardItem.count();

    //         if (cardCount <= 10) {
    //             await expect(homePage.punproSeeMoreButton).toBeHidden();
    //         } else {
    //             test.skip(true, 'แท็บนี้มีรายการมากกว่า 10 รายการ ไม่ตรงเงื่อนไขของเคสนี้ ต้องเลือกแท็บอื่น');
    //         }
    //     });

    //     test('Home_mobile_057: นำทางไปหน้ารายละเอียด เมื่อกดการ์ดในแท็บใดๆ', async ({ page }) => {
    //         const urlBefore = page.url();
    //         await homePage.clickSuggestPostCard(0);

    //         await page.waitForURL(/\/(sp|p)\//, { timeout: 10000 });
    //         expect(page.url()).not.toBe(urlBefore);
    //     });

    //     test('Home_mobile_058: ตรวจสอบการกดปุ่ม Favorite บนการ์ดแนะนำ โดยยังไม่ได้ login', async ({ page }) => {
    //         await homePage.clickFavoritePost(0);
    //         await expect(navbar.getLoginModalLogo()).toBeVisible({ timeout: 10000 });
    //     });

    //     test('Home_mobile_059: ตรวจสอบการกดปุ่ม Favorite บนการ์ดแนะนำ โดย login แล้ว', async ({ page }) => {
    //         await navbar.openLoginOrSignup_mobile();
    //         await navbar.auth.loginWithEmail(email, password);
    //         await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

    //         const favButton = homePage.punproCardItem.nth(0).locator('[class*="BorderImageLove"][role="button"]');
    //         const favIcon = favButton.locator('svg path');

    //         await favButton.click();
    //         await expect(favIcon).toHaveAttribute('fill', '#BF202F');
    //     });

    //     test('Home_mobile_060: ตรวจสอบการยกเลิก Favorite เมื่อกดปุ่มซ้ำ', async ({ page }) => {
    //         await navbar.openLoginOrSignup_mobile();
    //         await navbar.auth.loginWithEmail(email, password);
    //         await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });


    //         const favButton = homePage.punproCardItem.nth(0).locator('[class*="BorderImageLove"][role="button"]');
    //         const favIcon = favButton.locator('svg path');
    //         await homePage.clickFavoritePost(0);
    //         await expect(favIcon).toHaveAttribute('fill', '#BF202F');
    //         await homePage.clickFavoritePost(0);
    //         await expect(favIcon).toHaveAttribute('fill', '#8C8C8C');
    //     });
    // });
});