import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../pages/NavbarFooter';

test.describe('Search - Result Page', () => {
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();

        // Steps 2-5 ตาม test case: กดแว่นขยาย -> คลิกช่องค้นหา -> กรอกคำค้นหา -> กดปุ่มค้นหา
        await navbar.search.clickSearchInput();
        await navbar.search.fillSearch('เสื้อ');
        await navbar.search.clickSearchButton();
        await page.waitForURL(/\/search\?s=/, { timeout: 15000 });
        await navbar.dismissAllOverlaysIfPresent();
    });

    // test('Search_desktop_013: ตรวจสอบการแสดง Breadcrumb ในหน้าผลการค้นหา', async ({ page }) => {
    //     await expect(navbar.search.breadcrumbContainer).toBeVisible();
    //     await expect(navbar.search.breadcrumbContainer).toContainText('หน้าแรก');
    //     await expect(navbar.search.breadcrumbContainer).toContainText('ค้นหา');
    // });

    // test('Search_desktop_014: ตรวจสอบการนำทางกลับหน้าแรก เมื่อกด Breadcrumb "หน้าแรก"', async ({ page }) => {
    //     await navbar.search.clickBreadcrumbHome();
    //     await page.waitForURL(/punpro\.com\/?$/, { timeout: 10000 });
    //     expect(page.url()).not.toContain('/search');
    // });

    // test('Search_desktop_015: ตรวจสอบการแสดงจำนวนผลลัพธ์ที่ถูกต้อง', async ({ page }) => {
    //     await expect(navbar.search.resultCountText).toBeVisible();
    //     await expect(navbar.search.resultCountText).toContainText('เสื้อ');

    //     const expectedCount = await navbar.search.getResultCountNumber();
    //     const actualCount = await navbar.search.waitForAllCardsToRender(expectedCount, 30000, 'รับหิ้ว');
    //     expect(actualCount).toBe(expectedCount);
    // });

    // test('Search_desktop_016: ตรวจสอบแท็บเริ่มต้นของผลการค้นหา', async ({ page }) => {
    //     await expect(navbar.search.resultTabAll).not.toHaveClass('PJYRN');
    // });

    // const resultTabCases = [
    //     {
    //         testId: 'Search_desktop_017',
    //         label: 'รับหิ้ว',
    //         getTab: (n: NavbarFooter) => n.search.resultTabShopperPost,
    //         getCards: (n: NavbarFooter) => n.search.resultCardShopper,
    //         classLabel: '[class*="FixSizeItemCard__PostLabel"]',
    //         renderTimeout: 15000,
    //     },
    //     {
    //         testId: 'Search_desktop_018',
    //         label: 'โปรแนะนำ',
    //         getTab: (n: NavbarFooter) => n.search.resultTabPromotion,
    //         getCards: (n: NavbarFooter) => n.search.resultCardPromotion,
    //         classLabel: '[class*="LargeCardArticle__TypeLabel"]',
    //         renderTimeout: 15000,
    //     },
    //     {
    //         testId: 'Search_desktop_019',
    //         label: 'บทความน่าสนใจ',
    //         getTab: (n: NavbarFooter) => n.search.resultTabArticle,
    //         getCards: (n: NavbarFooter) => n.search.resultCardArticle,
    //         classLabel: '[class*="LargeCardPromotion__TypeLabel"]',
    //         renderTimeout: 30000,
    //     },
    // ];

    // for (const { testId, label, getTab, getCards, classLabel, renderTimeout } of resultTabCases) {
    //     test(`${testId}: ตรวจสอบการสลับแท็บ "${label}" ในหน้าผลการค้นหา`, async ({ page }) => {
    //         await navbar.search.clickResultTab(getTab(navbar));

    //         const expectedCount = await navbar.search.getResultCountNumber(); // ข้อความ "พบ N รายการ" ควรอัปเดตตามแท็บที่เลือก
    //         const cardCount = await navbar.search.waitForAllCardsToRender(expectedCount, renderTimeout, label);
    //         expect(cardCount).toBe(expectedCount);

    //         if (cardCount === 0) {
    //             expect(navbar.search.noData).toBeVisible();
    //             return;
    //         }

    //         const tagTexts = await getCards(navbar).locator(classLabel).allTextContents();
    //         for (const tag of tagTexts) {
    //             expect(tag).toContain(label);
    //         }
    //     });
    // }

    // test('Search_desktop_020: ตรวจสอบตัวเลือกเรียงลำดับเริ่มต้น', async ({ page }) => {
    //     await expect(navbar.search.sortButton).toHaveText(/เรียงตาม:\s*แนะนำ/);
    // });

    // test('Search_desktop_021: ตรวจสอบการเปิด Dropdown ตัวเลือกการเรียงลำดับ', async ({ page }) => {
    //     await navbar.search.openSortDropdown();
    //     await expect(navbar.search.sortDropdown).toBeVisible();
    //     await expect(navbar.search.sortOptionRecommended).toBeVisible();
    //     await expect(navbar.search.sortOptionPriceAsc).toBeVisible();
    //     await expect(navbar.search.sortOptionPriceDesc).toBeVisible();
    // });

    // test('Search_mobile_022: ตรวจสอบการเรียงลำดับสินค้าตามราคา (น้อย-มาก)', async ({ page }) => {
    //     const expectedCount = await navbar.search.getResultCountNumber();
    //     await navbar.search.selectSortOption(navbar.search.sortOptionPriceAsc);
    //     await navbar.search.waitForAllCardsToRender(expectedCount, 15000, 'รับหิ้ว');

    //     const prices = await navbar.search.getAllCardPrices();
    //     const sortedAscending = [...prices].sort((a, b) => a - b);
    //     expect(prices).toEqual(sortedAscending);
    // });

    // test('Search_mobile_023: ตรวจสอบการเรียงลำดับสินค้าตามราคา (มาก-น้อย)', async ({ page }) => {
    //     const expectedCount = await navbar.search.getResultCountNumber();
    //     await navbar.search.selectSortOption(navbar.search.sortOptionPriceDesc);
    //     await navbar.search.waitForAllCardsToRender(expectedCount, 15000, 'รับหิ้ว');

    //     const prices = await navbar.search.getAllCardPrices();
    //     const sortedDescending = [...prices].sort((a, b) => b - a);
    //     expect(prices).toEqual(sortedDescending);
    // });

    // test('Search_desktop_024: ตรวจสอบการแสดงองค์ประกอบของการ์ดสินค้าครบถ้วน', async ({ page }) => {
    //     const firstCard = navbar.search.resultCardShopper.first();
    //     await expect(firstCard).toBeVisible();

    //     // TODO: ยืนยัน selector รูปภาพ (รอ expand <a> ตัวแรกดูก่อน)
    //     await expect(firstCard.locator('[style*="background-image"]')).toBeVisible();

    //     await expect(firstCard.locator('[class*="FixSizeItemCard__PostLabel"]')).toBeVisible();
    //     await expect(firstCard.locator('[class*="FixSizeItemCard__PostTitle"]')).toBeVisible();
    //     await expect(firstCard.locator('[class*="FixSizeItemCard__Title"]')).toBeVisible();
    //     await expect(firstCard.locator('[class*="FixSizeItemCard__PriceContent"]')).toBeVisible();
    // });

    // test('Search_desktop_025: ตรวจสอบการแสดงราคาแบบมีส่วนลด', async ({ page }) => {
    //     const cardCount = await navbar.search.resultCardShopper.count();

    //     let discountedIndex = -1;
    //     for (let i = 0; i < cardCount; i++) {
    //         if (await navbar.search.hasDiscount(i)) {
    //             discountedIndex = i;
    //             break;
    //         }
    //     }

    //     if (discountedIndex === -1) {
    //         test.skip(true, 'ไม่พบการ์ดที่มีส่วนลดในคำค้นหานี้ - ลองเปลี่ยนคำค้นหาที่มีสินค้าลดราคาแน่ๆ');
    //         return;
    //     }

    //     const originalPrice = navbar.search.getCardOriginalPrice(discountedIndex);
    //     const currentPrice = navbar.search.getCardCurrentPrice(discountedIndex);

    //     await expect(originalPrice).toBeVisible();
    //     // TODO: ถ้า assert นี้ fail ให้เช็ค CSS จริงจาก DevTools (อาจไม่ใช่ text-decoration-line ตรงๆ เช่นอาจอยู่ที่ class อื่นที่ครอบ)
    //     await expect(originalPrice).toHaveCSS('text-decoration-line', 'line-through');
    //     await expect(currentPrice).toBeVisible();
    // });

    // test('Search_desktop_026: ตรวจสอบการนำทางไปหน้ารายละเอียดสินค้า เมื่อกดการ์ด', async ({ page }) => {
    //     const urlBefore = page.url();
    //     await navbar.search.clickResultCard(0);
    //     await page.waitForURL(/\/items\//, { timeout: 10000 }); // ยืนยันแล้วว่า path จริงคือ /items/<id>
    //     expect(page.url()).not.toBe(urlBefore);
    // });

    // test('Search_desktop_027: ตรวจสอบการกดปุ่ม Favorite (หัวใจ) บนการ์ดสินค้า โดยยังไม่ได้ login', async ({ page }) => {
    //     await navbar.search.clickCardFavorite(0);
    //     expect(navbar.auth.loginModalLogo).toBeVisible({ timeout: 10000 });
    // });

    test('Search_desktop_028: ตรวจสอบการกดปุ่ม Favorite (หัวใจ) บนการ์ดสินค้า โดย login แล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.auth.loginWithEmail(process.env.VALID_EMAIL!, process.env.VALID_PASSWORD!);
        await expect(navbar.auth.loginSuccessDialog).toBeVisible({ timeout: 10000 });

        const favIcon = navbar.search.getCardFavoriteButton(1);
        if (await navbar.search.isCardFavorited(1)) {
            await navbar.search.clickCardFavorite(1);
            await expect(favIcon).toHaveAttribute('fill', '#979797');
        }

        await navbar.search.clickCardFavorite(1);
        await expect(favIcon).toHaveAttribute('fill', '#BF202F');
    });

    test('Search_desktop_029: ตรวจสอบการยกเลิก Favorite เมื่อกดปุ่มหัวใจซ้ำ', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.auth.loginWithEmail(process.env.VALID_EMAIL!, process.env.VALID_PASSWORD!);
        await expect(navbar.auth.loginSuccessDialog).toBeVisible({ timeout: 10000 });

        const favIcon = navbar.search.getCardFavoriteButton(1);
        if (!(await navbar.search.isCardFavorited(1))) {
            await navbar.search.clickCardFavorite(1);
            await expect(favIcon).toHaveAttribute('fill', '#BF202F');
        }

        await navbar.search.clickCardFavorite(1);
        await expect(favIcon).toHaveAttribute('fill', '#979797');
    });
});