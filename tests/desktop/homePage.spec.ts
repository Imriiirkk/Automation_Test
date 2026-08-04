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

    test('Home_desktop_001: ตรวจสอบองค์ประกอบของหน้าแรกครบถ้วนเมื่อเข้าเว็บครั้งแรก', async () => {
        await expect(homePage.getBannerContainer()).toBeVisible();
        await expect(homePage.getCategorySectionContainer()).toBeVisible();
        await expect(homePage.getServicesSectionContainer()).toBeVisible();
        await expect(homePage.getPromotionSectionContainer()).toBeVisible();
        await expect(homePage.getShopperPostSectionContainer()).toBeVisible();
        await expect(homePage.getArticleSectionContainer()).toBeVisible();
        await expect(homePage.getPunproSuggestionContainer()).toBeVisible();
    });

    //================================================================
    // Hero Banner
    // ================================================================
    test.describe('Hero Banner', () => {
        test('Home_desktop_002: ตรวจสอบการแสดง Banner หลัก (Hero Banner) พร้อม Banner โปรโมชันคู่', async () => {
            // Banner หลัก (ฝั่งซ้าย) พร้อม Indicator
            await expect(homePage.getBannerContainer()).toBeVisible();
            await expect(homePage.getBannerIndicatorContainer()).toBeVisible();

            const targetIndex = 1;
            await homePage.clickBannerIndicator(targetIndex);
            await expect(homePage.getActiveBannerIndicator())
                .toHaveAttribute('aria-label', `Go to slide ${targetIndex}`);

            // Banner โปรโมชันคู่ (ฝั่งขวา) - เฉพาะ Desktop
            await expect(homePage.bannerDuoContainer).toBeVisible();
            await expect(homePage.bannerPromotionOne).toBeVisible();
            await expect(homePage.bannerPromotionTwo).toBeVisible();
        });

        test('Home_desktop_003: ตรวจสอบการนำทาง เมื่อกด Banner หลัก', async ({ page }) => {
            const urlBefore = page.url();
            await homePage.clickBanner(0);
            await page.waitForLoadState('domcontentloaded');
            expect(page.url()).not.toBe(urlBefore);
        });

        test('Home_desktop_004: ตรวจสอบการกด Indicator เพื่อเลื่อนไปยังตำแหน่งสไลด์ที่ต้องการ', async () => {
            const targetIndex = 2;
            await homePage.clickBannerIndicator(targetIndex);
            await expect(homePage.getActiveBannerIndicator())
                .toHaveAttribute('aria-label', `Go to slide ${targetIndex}`);
        });
    });

    //================================================================
    // Category Section
    //================================================================
    test.describe('Category Section - Product Tab', () => {
        test.beforeEach(async () => {
            await homePage.getCategorySectionContainer().scrollIntoViewIfNeeded();
        });

        test('Home_desktop_005: แสดง Section "หมวดหมู่" พร้อมแท็บและปุ่มดูทั้งหมด', async () => {
            await expect(homePage.categoryProductTab).toBeVisible();
            await expect(homePage.categoryBrandTab).toBeVisible();
            await expect(homePage.categorySeeMoreButton).toBeVisible();
            const categoryItems = homePage.categoryMenuContainer.locator('> div, > *');
            const itemCount = await categoryItems.count();
            expect(itemCount).toBeGreaterThanOrEqual(9);
        });

        // ---------- Category Item Navigation (data-driven) ----------
        const categoryCases = [
            { testId: 'Home_desktop_006', name: 'รองเท้าผ้าใบ' },
            { testId: 'Home_desktop_007', name: 'กระเป๋า' },
            { testId: 'Home_desktop_008', name: 'เสื้อ' },
            { testId: 'Home_desktop_009', name: 'ความงาม' },
            { testId: 'Home_desktop_010', name: 'ไอที' },
            { testId: 'Home_desktop_011', name: 'กางเกง' },
            { testId: 'Home_desktop_012', name: 'ดูแลผิว' },
            { testId: 'Home_desktop_013', name: 'รองเท้าแตะ' },
            { testId: 'Home_desktop_014', name: 'หมวก' },
        ];

        for (const { testId, name } of categoryCases) {
            test(`${testId}: ตรวจสอบการนำทางไปหน้าผลการค้นหา เมื่อกดหมวดหมู่ "${name}"`, async ({ page }) => {
                await homePage.clickCategoryProductTab();
                await homePage.clickCategoryItem(name);
                await page.waitForURL(/\/search\?s=.+&ref_type=products/, { timeout: 10000 });

                const url = new URL(page.url());
                expect(url.searchParams.get('s')).toBe(name);
            });
        }

        test('Home_desktop_015: ตรวจสอบการนำทางไปหน้าแสดงหมวดหมู่ทั้งหมด เมื่อกดปุ่ม "ดูทั้งหมด" ในแท็บสินค้า', async ({ page }) => {
            await homePage.clickCategoryProductTab();
            await homePage.clickSeeMoreCategory();
            await page.waitForURL(/\/category_groups\/products\?category=products/, { timeout: 10000 });
            expect(page.url()).toContain('/category_groups/products?category=products');
        });
    });

    test.describe('Category Section - Brand Tab', () => {
        test.beforeEach(async () => {
            await homePage.getCategorySectionContainer().scrollIntoViewIfNeeded();
            await homePage.clickCategoryBrandTab();
        });

        test('Home_desktop_016: แสดงรายการแบรนด์ เมื่อกดแท็บ "แบรนด์"', async () => {
            const brandItems = homePage.categoryMenuContainer.locator('> div, > *');
            const itemCount = await brandItems.count();
            expect(itemCount).toBeGreaterThanOrEqual(10);

            const brandLogos = homePage.categoryMenuContainer.locator('img');
            const logoCount = await brandLogos.count();
            expect(logoCount).toBeGreaterThanOrEqual(10);
        });

        // ---------- Brand Item Navigation (data-driven) ----------
        const brandCases = [
            { testId: 'Home_desktop_017', name: 'Adidas' },
            { testId: 'Home_desktop_018', name: 'Nike' },
            { testId: 'Home_desktop_019', name: 'LYN' },
            { testId: 'Home_desktop_020', name: 'FILA' },
            { testId: 'Home_desktop_021', name: 'Charles&Keith' },
            { testId: 'Home_desktop_022', name: 'Uniqlo' },
            { testId: 'Home_desktop_023', name: 'Converse' },
            { testId: 'Home_desktop_024', name: 'Guess' },
            { testId: 'Home_desktop_025', name: 'CalvinKlein' },
            { testId: 'Home_desktop_026', name: 'Starbucks' },
        ];

        for (const { testId, name } of brandCases) {
            test(`${testId}: ตรวจสอบการนำทางไปหน้าผลการค้นหา เมื่อกดแบรนด์ "${name}"`, async ({ page }) => {
                await homePage.clickCategoryItem(name);
                await page.waitForURL(/\/search\?s=.+&ref_type=brands/, { timeout: 10000 });
                await expect(page).toHaveURL(/\/search\?s=.+&ref_type=brands/);
            });
        }

        test('Home_desktop_027: ตรวจสอบการนำทางไปหน้าแสดงแบรนด์ทั้งหมด เมื่อกดปุ่ม "ดูทั้งหมด" ในแท็บแบรนด์', async ({ page }) => {
            await homePage.clickSeeMoreCategory();
            await page.waitForURL(/\/category_groups\/brands\?category=brands/, { timeout: 10000 });
            expect(page.url()).toContain('/category_groups/brands?category=brands');
        });
    });

    //================================================================
    // Services Section
    //================================================================
    test.describe('Services Section', () => {
        test.beforeEach(async () => {
            await homePage.getServicesSectionContainer().scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
        });

        test('Home_desktop_028: แสดง Section "บริการทั้งหมด" ครบถ้วน', async () => {
            const servicesContainer = homePage.getServicesSectionContainer();
            await expect(servicesContainer.getByText('ฝากหิ้ว', { exact: true })).toBeVisible();
            await expect(servicesContainer.getByText('โปรใกล้ฉัน', { exact: true })).toBeVisible();
            await expect(servicesContainer.getByText('คูปอง', { exact: true })).toBeVisible();
            await expect(servicesContainer.getByText('บทความ', { exact: true })).toBeVisible();

            const icons = servicesContainer.locator('svg');
            const iconCount = await icons.count();
            expect(iconCount).toBeGreaterThanOrEqual(4);
        });

        // ---------- Service Item Navigation (data-driven) ----------
        const serviceCases = [
            { testId: 'Home_desktop_029', name: 'ฝากหิ้ว', urlPattern: /\/shopper_posts/ },
            { testId: 'Home_desktop_030', name: 'โปรใกล้ฉัน', urlPattern: /\/promotion/ },
            { testId: 'Home_desktop_031', name: 'คูปอง', urlPattern: /\/coupons/ },
            { testId: 'Home_desktop_032', name: 'บทความ', urlPattern: /\/article/ },
        ];

        for (const { testId, name, urlPattern } of serviceCases) {
            test(`${testId}: ตรวจสอบการนำทางไปหน้าที่ถูกต้อง เมื่อกดบริการ "${name}"`, async ({ page }) => {
                await homePage.clickServiceItem(name);
                await page.waitForURL(urlPattern, { timeout: 10000 });
            });
        }
    });

    //================================================================
    // Promotion Suggestion Section
    //================================================================
    test.describe('Promotion Suggestion Section', () => {
        test.beforeEach(async () => {
            await homePage.getPromotionSectionContainer().scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
        });

        test('Home_desktop_033: แสดง Section "โปรแนะนำฝากหิ้ว" ครบถ้วน', async () => {
            const promotionContainer = homePage.getPromotionSectionContainer();
            await navbar.dismissAllOverlaysIfPresent();
            await expect(promotionContainer.getByText('โปร 1 แถม 1', { exact: true })).toBeVisible();
            await expect(promotionContainer.getByText('โปร 50% up', { exact: true })).toBeVisible();
            await expect(promotionContainer.getByText('โปรมือถือ', { exact: true })).toBeVisible();
            await expect(promotionContainer.getByText('โปรอาหาร', { exact: true })).toBeVisible();
            await expect(promotionContainer.getByText('ตั๋วถูก', { exact: true })).toBeVisible();
            await expect(promotionContainer.getByText('โค้ดส่วนลด', { exact: true })).toBeVisible();

            const icons = promotionContainer.locator('svg');
            const iconCount = await icons.count();
            expect(iconCount).toBeGreaterThanOrEqual(6);
        });

        // ---------- Promotion Filter Navigation (data-driven) ----------
        const promotionCases = [
            { testId: 'Home_desktop_034', name: 'โปร 1 แถม 1' },
            { testId: 'Home_desktop_035', name: 'โปร 50% up' },
            { testId: 'Home_desktop_036', name: 'โปรมือถือ' },
            { testId: 'Home_desktop_037', name: 'โปรอาหาร' },
            { testId: 'Home_desktop_038', name: 'ตั๋วถูก' },
            { testId: 'Home_desktop_039', name: 'โค้ดส่วนลด' },
        ];

        for (const { testId, name } of promotionCases) {
            test(`${testId}: ตรวจสอบการนำทางไปหน้า "โปรโมชัน" แบบ filter เมื่อกด "${name}"`, async ({ page }) => {
                await homePage.clickPromotionItem(name);
                await page.waitForURL(/\/promotion/, { timeout: 10000 });
                expect(page.url()).toContain('/promotion');
            });
        }
    });

    //================================================================
    // Shopper Post Section
    //================================================================
    test.describe('Shopper Post Section', () => {
        test.beforeEach(async () => {
            await homePage.getShopperPostSectionContainer().scrollIntoViewIfNeeded();
        });

        test('Home_desktop_040: ตรวจสอบการแสดง Section "ฝากหิ้ว" บน Desktop', async ({ page }) => {
            await expect(homePage.shopperSeeMoreButton).toBeVisible();
            const cardCount = await page.getByRole('group', { name: /\d+ \/ \d+/ }).count();
            expect(cardCount).toBe(5);
        });

        test('Home_desktop_041: ตรวจสอบการนำทางไปหน้าปันโปรรับหิ้ว เมื่อกดปุ่ม "ดูทั้งหมด"', async ({ page }) => {
            await homePage.clickSeeMoreShopperPost();
            await page.waitForURL(/\/shopper_posts/, { timeout: 10000 });
        });

        test('Home_desktop_042: ตรวจสอบการนำทางไปหน้ารายละเอียด เมื่อกดการ์ดฝากหิ้ว', async ({ page }) => {
            const urlBefore = page.url();
            await homePage.clickShopperPost();
            await page.waitForURL(/\/sp\//, { timeout: 10000 });
            expect(page.url()).not.toBe(urlBefore);
        });
    });

    //================================================================
    // Article Post Section
    //================================================================
    test.describe('Article Post Section', () => {
        test.beforeEach(async () => {
            await homePage.getArticleSectionContainer().scrollIntoViewIfNeeded();
            await navbar.dismissAllOverlaysIfPresent();
        });

        test('Home_desktop_043: ตรวจสอบการแสดง Section "บทความยอดนิยม" บน Desktop', async ({ page }) => {
            await expect(homePage.articleSeeMoreButton).toBeVisible();
            await expect(homePage.articleLargeCard_desktop).toHaveCount(1);
            await expect(homePage.articleSmallCards_desktop).toHaveCount(3);
        });

        test('Home_desktop_044: ตรวจสอบการนำทางไปหน้าที่ถูกต้อง เมื่อกดปุ่ม "ดูทั้งหมด"', async ({ page }) => {
            await homePage.clickSeeMoreArticle();
            await page.waitForURL(/\/article/, { timeout: 10000 });
        });

        test('Home_desktop_045: ตรวจสอบการนำทางไปหน้ารายละเอียดบทความ เมื่อกดการ์ดบทความ', async ({ page }) => {
            const urlBefore = page.url();
            await homePage.clickArticlePost_desktop();
            await page.waitForURL(/\/p\//, { timeout: 10000 });
            expect(page.url()).not.toBe(urlBefore);
        });

        test('Home_desktop_048: ตรวจสอบการกดปุ่ม Bookmark บนการ์ดบทความ โดยยังไม่ได้ login', async ({ page }) => {
            const bookmarkButton = homePage.articleCardBookmarkButton_desktop;
            await expect(bookmarkButton).toBeVisible();
            await bookmarkButton.click();
            await expect(navbar.loginModalLogo).toBeVisible({ timeout: 10000 });
        });

        test('Home_desktop_049: ตรวจสอบการกดปุ่ม Bookmark บนการ์ดบทความ โดย login แล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(email, password);
            await expect(navbar.loginSuccessDialog).toBeVisible({ timeout: 10000 });

            const bookmarkButton = homePage.articleCardBookmarkButton_desktop;
            await bookmarkButton.click();
            await expect(bookmarkButton.locator('svg')).toBeVisible();
        });

        test('Home_desktop_050: ตรวจสอบการยกเลิก Bookmark เมื่อกดปุ่มซ้ำ', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(email, password);
            await expect(navbar.loginSuccessDialog).toBeVisible({ timeout: 10000 });

            const bookmarkButton = homePage.articleCardBookmarkButton_desktop;
            await bookmarkButton.click();
            await expect(bookmarkButton.locator('svg')).toBeVisible();
            await bookmarkButton.click();
            await expect(bookmarkButton.locator('i.fa-bookmark')).toBeVisible();
        });
    });

    //================================================================
    // Suggestion Section
    //================================================================
    test.describe('Suggestion Section', () => {
        test.beforeEach(async () => {
            await homePage.getPunproSuggestionContainer().scrollIntoViewIfNeeded();
        });

        test('Home_desktop_049: แสดง Section "ปันโปรแนะนำ" ครบถ้วน (แท็บเริ่มต้น "ทั้งหมด")', async ({ page }) => {
            // มีแท็บครบ 4 แท็บ
            await expect(homePage.punproAllTab).toBeVisible();
            await expect(homePage.punproShopperTab).toBeVisible();
            await expect(homePage.punproPormotionTab).toBeVisible();
            await expect(homePage.punproArticleTab).toBeVisible();

            // แสดงการ์ดตามแท็บที่เลือก (แท็บเริ่มต้น "ทั้งหมด") สูงสุด 10 การ์ด
            const cardCount = await homePage.punproCardItem.count();
            expect(cardCount).toBeLessThanOrEqual(10);
            expect(cardCount).toBeGreaterThan(0);
        });

        // ---------- Tab Switching (data-driven) ----------
        const tabCases = [
            { testId: 'Home_desktop_050', label: 'รับหิ้ว', clickTab: (h: HomePage) => h.clickPunproShopperTab() },
            { testId: 'Home_desktop_051', label: 'โปรแนะนำ', clickTab: (h: HomePage) => h.clickPunproPromotionTab() },
            { testId: 'Home_desktop_052', label: 'บทความน่าสนใจ', clickTab: (h: HomePage) => h.clickPunproArticleTab() },
        ];

        for (const { testId, label, clickTab } of tabCases) {
            test(`${testId}: แสดงการ์ดที่ถูกต้อง เมื่อสลับไปแท็บ "${label}"`, async ({ page }) => {
                await clickTab(homePage);
                await page.waitForTimeout(1000);
                const cardCount = await homePage.punproCardItem.count();
                expect(cardCount).toBeGreaterThan(0);
                expect(cardCount).toBeLessThanOrEqual(10);
            });
        }

        test('Home_desktop_053: ตรวจสอบการโหลดการ์ดเพิ่ม เมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
            await homePage.clickPunproAllTab();
            await page.waitForTimeout(1000);

            const countBefore = await homePage.punproCardItem.count();
            const scrollYBefore = await page.evaluate(() => window.scrollY);

            await homePage.clickSeeMoreSuggest();
            await page.waitForTimeout(10000);

            const countAfter = await homePage.punproCardItem.count();
            expect(countAfter).toBeGreaterThan(countBefore);

            const scrollYAfter = await page.evaluate(() => window.scrollY);
            expect(scrollYAfter).toBeGreaterThanOrEqual(scrollYBefore);
        });

        test('Home_desktop_054: ไม่แสดงปุ่ม "ดูเพิ่มเติม" เมื่อมีรายการไม่เกิน 10 รายการ', async ({ page }) => {
            await homePage.clickPunproShopperTab();
            await page.waitForTimeout(1000);
            const cardCount = await homePage.punproCardItem.count();

            if (cardCount <= 10) {
                await expect(homePage.punproSeeMoreButton).toBeHidden();
            } else {
                test.skip(true, 'แท็บนี้มีรายการมากกว่า 10 รายการ ไม่ตรงเงื่อนไขของเคสนี้ ต้องเลือกแท็บอื่น');
            }
        });

        test('Home_desktop_055: นำทางไปหน้ารายละเอียด เมื่อกดการ์ดในแท็บใดๆ', async ({ page }) => {
            const urlBefore = page.url();
            await homePage.clickSuggestPostCard(0);

            await page.waitForURL(/\/(sp|p)\//, { timeout: 10000 });
            expect(page.url()).not.toBe(urlBefore);
        });

        test('Home_desktop_056: ตรวจสอบการกดปุ่ม Favorite บนการ์ดแนะนำ โดยยังไม่ได้ login', async ({ page }) => {
            await homePage.clickFavoritePost(0);
            await expect(navbar.loginModalLogo).toBeVisible({ timeout: 10000 });
        });

        test('Home_desktop_059: ตรวจสอบการกดปุ่ม Favorite บนการ์ดแนะนำ โดย login แล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(email, password);
            await expect(navbar.loginSuccessDialog).toBeVisible({ timeout: 10000 });

            const favButton = homePage.punproCardItem.nth(0).locator('[class*="BorderImageLove"][role="button"]');
            const favIcon = favButton.locator('svg path');

            await favButton.click();
            await expect(favIcon).toHaveAttribute('fill', '#BF202F');
        });

        test('Home_desktop_060: ตรวจสอบการยกเลิก Favorite เมื่อกดปุ่มซ้ำ', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(email, password);
            await expect(navbar.loginSuccessDialog).toBeVisible({ timeout: 10000 });

            const favButton = homePage.punproCardItem.nth(0).locator('[class*="BorderImageLove"][role="button"]');
            const favIcon = favButton.locator('svg path');
            await homePage.clickFavoritePost(0);
            await expect(favIcon).toHaveAttribute('fill', '#BF202F');
            await homePage.clickFavoritePost(0);
            await expect(favIcon).toHaveAttribute('fill', '#8C8C8C');
        });
    });
});