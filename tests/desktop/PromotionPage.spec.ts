import { test, expect } from '@playwright/test';
import { PromotionPage } from '../../pages/PromotionPage';
import { NavbarFooter } from '../../pages/NavbarFooter';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';
const WRONG_PASSWORD = 'wrong1234';

let navbar: NavbarFooter;
let promotionPage: PromotionPage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    promotionPage = new PromotionPage(page);
    await navbar.goto();
    await navbar.goToMenu_desktop('Link to promotion');

    // ปิด popup ก่อนทำการ Filter โปรโมชัน
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Promotion Page', () => {

    // ---------- Promotion Categories Tap ----------
    test.describe('Filter Categories', () => {

        // test ผ่านแล้ว
        test('Desktop_Promotion_001: กดหน้าโปรโมชันได้', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await page.waitForURL(/\/promotion/, { timeout: 10000 });
            await expect(promotionPage.promotion_heading).toBeVisible();
        });

        const filterCases = [
            { id: 'Desktop_Promotion_Menu_002', filterName: 'oneGetone', label: '1 แถม 1', urlPattern: /buy1-get1-free/ },
            { id: 'Desktop_Promotion_Menu_003', filterName: 'percentUp', label: '50% up', urlPattern: /sale-50p-up/ },
            { id: 'Desktop_Promotion_Menu_004', filterName: 'proMobile', label: 'โปรมือถือ', urlPattern: /mobile-phone/ },
            { id: 'Desktop_Promotion_Menu_005', filterName: 'foodie', label: 'อาหาร', urlPattern: /food/ },
            { id: 'Desktop_Promotion_Menu_006', filterName: 'cheapTicket', label: 'ตั๋วถูก', urlPattern: /ticket/ },
            { id: 'Desktop_Promotion_Menu_007', filterName: 'discountCode', label: 'โค้ดส่วนลด', urlPattern: /discount/ },
        ];

        // Pass 
        // เพิ่มเช็คจำนวนการ์ดตั้งต้นที่มี 12 การ์ดก่อนกด "ดูเพิ่มเติม"
        for (const { id, filterName, label, urlPattern } of filterCases) {
            test(`${id}: กด Filter โปรโมชัน "${label}" ได้`, async ({ page }) => {
                await navbar.goToMenu_desktop('Link to promotion');
                await promotionPage.clickFilter(filterName);
                await expect(page).toHaveURL(urlPattern);
                const cardCount = await promotionPage.promotionCardEach.count()
                await expect(promotionPage.promotionCard).toBeVisible();
                expect(cardCount).toBeLessThanOrEqual(12);
                expect(cardCount).toBeGreaterThan(0);
            });
        }
    });

    // ---------- Promotion Card ----------
    test.describe('Promotion Card', () => {
        // ชื่อ test case เปลี่ยนแล้ว >> แต่ test ยังไม่ผ่าน
        test('Desktop_Promotion_002: ตรวจสอบการแสดงรายละเอียดบน การ์ดโปรโมชัน', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await expect(promotionPage.promotionCard).toBeVisible();
            await expect(promotionPage.promotionCard_image.first()).toBeVisible();
            await expect(promotionPage.promotionCard_title.first()).toBeVisible();
            await expect(promotionPage.promotionLabel.first()).toBeVisible();
            await expect(promotionPage.descriptionCard.first()).toBeVisible();
            await expect(promotionPage.remainingTime.first()).toBeVisible();
            await expect(promotionPage.dateContent.first()).toBeVisible();
        });

        // ชื่อ test case เปลี่ยนแล้ว >> pass >> แต่อาาจจะเปลี่ยน expect result ใหม่
        test('Desktop_Promotion_003: กดรูปภาพบนการ์ด "โปรโมชัน" เพื่อเข้าดูรายละเอียดได้', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_image();
            await expect(promotionPage.breadcrumb).toBeVisible();
            await expect(promotionPage.blockContent).toBeVisible();
        });

        // ชื่อ test case เปลี่ยนแล้ว >> pass >> แต่อาาจจะเปลี่ยน expect result ใหม่
        test('Desktop_Promotion_004: กดชื่อโปรโมชันบนการ์ด "โปรโมชัน" เพื่อเข้าดูรายละเอียดได้', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await expect(promotionPage.breadcrumb).toBeVisible();
            await expect(promotionPage.blockContent).toBeVisible();
        });

        // เพิ่มการโหลดการ์ดโปรโมชันเพิ่มเติมเมื่อกดปุ่ม "ดูเพิ่มเติม" ยังไม่เสร็จสมบูรณ์ ต้องแก้ไข test case นี้ให้สมบูรณ์
        // >> ชื่อ test case เปลี่ยนแล้ว
        test('Desktop_Promotion_008: กดปุ่ม "ดูเพิ่มเติม" ได้', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            const cardBefore = await promotionPage.promotionCard.count()
            await promotionPage.clickLoadMore();
            const cardAfter = await promotionPage.promotionCard.count()
            expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
            await expect(promotionPage.loadMoreButton).toBeHidden();
        });

    });

    // ---------- Love Button ----------
    test.describe.serial('Love Button', () => {
        // ชื่อ test case เปลี่ยนแล้ว กรณีที่ยังไม่ได้ login >> Pass
        test('Desktop_Promotion_005: แสดง Popup Login เมื่อกด "Love Button" ยังไม่เข้าสู่ระบบ', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickLoveButton();
            await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
            await navbar.closeLoginModal()
        });

        test.describe('Logged in', () => {
            // ชื่อ test case เปลี่ยนแล้ว >> Pass แต่ว่าถ้ากดในเว็บก่อนแล้ว จะเทสไม่ผ่าน เพราะ love button จะเปลี่ยนเป็นสีแดงแล้ว 
            // ใช้ test.describe.serial แล้ว test.beforeAll แล้วเขียน 2 case ไว้ข้างใน
            test('Desktop_Promotion_006: ตรวจสอบการกด "Love Button" เข้าสู่ระบบแล้ว', async ({ page }) => {
                await navbar.openLoginOrSignup_desktop();
                await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
                await navbar.goToMenu_desktop('Link to promotion');
                await promotionPage.clickLoveButton();
                await expect(promotionPage.loveButtonIcon).toHaveCSS('fill', 'rgb(191, 32, 47)');
            });

            // ชื่อ test case เปลี่ยนแล้ว >> พอใช้ beforeEach ไม่Pass ถ้าใช้ beforeAll ก็ไม่รันให้ อย่าลืมหาวิธีแก้นะ >> เหมือนกับ Desktop_Promotion_006
            test('Desktop_Promotion_007: กด "Love Button" อีกครั้งเพื่อกลับไปเป็น Default', async ({ page }) => {
                await navbar.openLoginOrSignup_desktop();
                await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
                await navbar.goToMenu_desktop('Link to promotion');
                await promotionPage.clickLoveButton();
                await expect(promotionPage.loveButtonIcon).toHaveCSS('fill', 'rgb(151, 151, 151)');
            });
        });

    });

    // ---------- Promotion Detail ----------
    test.describe('Promotion Detail', () => {
        test('Desktop_Promotion_002: ตรวจสอบการแสดงรายละเอียดบน รายละเอียดโปรโมชัน', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await expect(promotionPage.author_image).toBeVisible();
            await expect(promotionPage.author_name).toBeVisible();
            await expect(promotionPage.blockRemainingTime).toBeVisible();
            await expect(promotionPage.blockDate).toBeVisible();
            await expect(promotionPage.blockView).toBeVisible();
            // await expect(promotionPage.shareButton_top).toBeVisible();
            await expect(promotionPage.shareButton_footer).toBeVisible();
            // await expect(promotionPage.bookMarkButton).toBeVisible();
            await expect(promotionPage.coverImage).toBeVisible();
            await expect(promotionPage.textContent).toBeVisible();
            await expect(promotionPage.loveDetailButton_footer).toBeVisible();
            await expect(promotionPage.blockauthor_footer).toBeVisible();
            // await expect(promotionPage.blockTag).toBeVisible();
            await expect(promotionPage.blockSentComment).toBeVisible();
            await expect(promotionPage.blockComment).toBeVisible();
        });

        test
    });

});