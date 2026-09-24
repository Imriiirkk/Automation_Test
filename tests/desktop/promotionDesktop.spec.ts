import { test, expect } from '@playwright/test';
import { PromotionPage } from '../../pages/PromotionPage';
import { NavbarFooter } from '../../pages/NavbarFooter';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

let navbar: NavbarFooter;
let promotionPage: PromotionPage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    promotionPage = new PromotionPage(page);
    await navbar.goto();
    await navbar.goToMenu_desktop('Link to promotion');

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Promotion Page (Desktop)', () => {

    // ---------- Promotion (Main) ---------- 
    // Pass
    test('Promotion_Desktop_001: ตรวจสอบการกดเข้าหน้า "โปรโมชัน" ได้', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await page.waitForURL(/\/promotion/, { timeout: 10000 });
        await expect(promotionPage.promotion_heading).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_002: ตรวจสอบการแสดงรายละเอียดหน้า "โปรโมชัน"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await expect(promotionPage.highlightedBanner).toBeVisible();
        await expect(promotionPage.blockMenuCategories).toBeVisible();
        await expect(promotionPage.promotionCard).toBeVisible();
        await expect(promotionPage.loadMoreButton).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_003: ตรวจสอบการแสดงโปรโมชันที่ยังไม่หมดอายุบน Banner', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await expect(promotionPage.highlightedBanner).toBeVisible();
    });

    // Not complete 
    test('Promotion_Desktop_004: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await expect(promotionPage.bannerPagination).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_005: ตรวจสอบการนำทางไปหน้า "รายละเอียดโปรโมชัน" เมื่อกด Banner', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.highlightedBanner.click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/); // ตรวจสอบว่า URL มีรูปแบบ /p/ ตามด้วยชื่อโปรโมชัน
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
    });

    // ---------- Promotion Categories Tap ----------
    const filterCases = [
        { id: 'Promotion_Desktop_006', filterName: 'oneGetone', label: '1 แถม 1', urlPattern: /buy1-get1-free/ },
        { id: 'Promotion_Desktop_007', filterName: 'percentUp', label: '50% up', urlPattern: /sale-50p-up/ },
        { id: 'Promotion_Desktop_008', filterName: 'proMobile', label: 'โปรมือถือ', urlPattern: /mobile-phone/ },
        { id: 'Promotion_Desktop_009', filterName: 'foodie', label: 'อาหาร', urlPattern: /food/ },
        { id: 'Promotion_Desktop_010', filterName: 'cheapTicket', label: 'ตั๋วถูก', urlPattern: /ticket/ },
        { id: 'Promotion_Desktop_011', filterName: 'discountCode', label: 'โค้ดส่วนลด', urlPattern: /discount/ },
    ];

    // Pass 
    // เช็คจำนวนการ์ดตั้งต้นที่มี 12 การ์ดก่อนกด "ดูเพิ่มเติม"
    for (const { id, filterName, label, urlPattern } of filterCases) {
        test(`${id}: กด Filter โปรโมชัน "${label}" ได้`, async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickFilter(filterName);
            await expect(page).toHaveURL(urlPattern);
            const cardCount = await promotionPage.promotionCardEach.count()
            await expect(promotionPage.promotionCard).toBeVisible();
            expect(cardCount).toBeLessThanOrEqual(12);
            expect(cardCount).toBeGreaterThan(0);
            // data-active attribute ของ filter ที่ถูกเลือกจะเป็น true
        });
    }

    test('Promotion_Desktop_012: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีโปรโมชัน', async () => {
    });

    // ---------- Promotion Card ---------- 
    // Pass
    test('Promotion_Desktop_013: ตรวจสอบการแสดงรายละเอียดบน "การ์ดโปรโมชัน"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await expect(promotionPage.promotionCard).toBeVisible();
        await expect(promotionPage.promotionCard_image.first()).toBeVisible();
        await expect(promotionPage.promotionCard_title.first()).toBeVisible();
        await expect(promotionPage.promotionLabel.first()).toBeVisible();
        await expect(promotionPage.descriptionCard.first()).toBeVisible();
        await expect(promotionPage.remainingTime.first()).toBeVisible();
        await expect(promotionPage.dateContent.first()).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_014: ตรวจสอบการกดรูปภาพบนการ์ด "โปรโมชัน" เพื่อเข้าดูรายละเอียดได้', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_image();
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
    });

    // pass
    test('Promotion_Desktop_015: ตรวจสอบการกดชื่อโปรโมชันบนการ์ด "โปรโมชัน" เพื่อเข้าดูรายละเอียดได้', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
    });


    test('Promotion_Desktop_016: ตรวจสอบการแสดงข้อความ "ยังไม่มีกำหนดสิ้นสุด" เมื่อโปรโมชันไม่กำหนดวันสิ้นสุด', async ({ page }) => {
    });

    test('Promotion_Desktop_017: ตรวจสอบการแสดงข้อความ "สิ้นสุดโปรใน x วัน" เมื่อโปรโมชันนั้นยังอยู่ในช่วงของโปรโมชันอยู่', async ({ page }) => {
    });

    test('Promotion_Desktop_018: ตรวจสอบการแสดงข้อความ "หมดอายุ" เมื่อโปรโมชันสิ้นสุดแล้ว', async ({ page }) => {
    });

    test('Promotion_Desktop_019: ตรวจสอบการแสดง วันที่เริ่มต้น และ สิ้นสุด เมื่อโปรโมชันมีการกำหนดวันที่', async ({ page }) => {
    });


    // ---------- Love Button ----------
    // Pass
    test('Promotion_Desktop_020: ตรวจสอบการกด "Like" บนการ์ดโปรโมชัน กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickLoveButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test.describe.serial('test', () => {
        test('Promotion_Desktop_021: ตรวจสอบการกด "Like" บนการ์ดโปรโมชัน กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickLoveButton();
            await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#BF202F');
        });

        // Pass
        test('Promotion_Desktop_022: ตรวจสอบการกด "Like" ซ้ำบนการ์ดโปรโมชัน เมื่อกดไปแล้ว (กลับไปเป็น Default) กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickLoveButton();
            await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#BF202F');
            await promotionPage.clickLoveButton();
            await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#979797');
        });
    });

    // ---------- ปุ่ม ดูเพิ่มเติม ---------- 
    // Pass
    test('Promotion_Desktop_023: ตรวจสอบการโหลดการ์ดเพิ่มเมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        const cardBefore = await promotionPage.promotionCard.count()
        await promotionPage.clickLoadMore();
        const cardAfter = await promotionPage.promotionCard.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
    });

    // Pass
    test('Promotion_Desktop_024: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
        await promotionPage.clickLoadMore();
        await expect(promotionPage.loadMoreButton).toBeHidden();
    });

    // ---------- ปุ่ม ^ ---------- 
    // Pass
    test('Promotion_Desktop_025: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง บนหน้าโปรโมชัน', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        // await expect(navbar.scrollToTopButton).toBeHidden();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_026: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" บนหน้าโปรโมชัน', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();
        await page.waitForTimeout(3000);
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBe(0);
    });

    // ---------- Promotion Detail ----------
    // Pass >> มันจะมีที่ กำหนดเวลา>>สิ้นสุดใน x วัน และ ไม่กำหนดเวลา(ไม่แสดงวันเริ่ม-วันสิ้นสุด)>>ยังไม่มีกำหนดสิ้นสุด
    test('Promotion_Desktop_027: ตรวจสอบการแสดงรายละเอียดบน รายละเอียดโปรโมชัน', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const tagCount = await promotionPage.tagItem.count();
        await expect(promotionPage.author_image).toBeVisible();
        await expect(promotionPage.author_name).toBeVisible();
        await expect(promotionPage.blockRemainingTime).toBeVisible();
        await expect(promotionPage.blockDate).toBeVisible();
        await expect(promotionPage.blockView).toBeVisible();
        await expect(promotionPage.shareButton_top).toBeVisible();
        await expect(promotionPage.shareButton_footer).toBeVisible();
        await expect(promotionPage.bookMarkButton).toBeVisible();
        await expect(promotionPage.coverImage).toBeVisible();
        await expect(promotionPage.textContent).toBeVisible();
        await expect(promotionPage.loveDetailButton_footer).toBeVisible();
        await expect(promotionPage.blockAuthor_footer).toBeVisible();
        // await expect(promotionPage.blockTag).toBeVisible(); //ไม่ผ่าน => มันจะมีบางคนที่ใส่ tag บางคนไม่ใส่ tag เลยทำให้ไม่ผ่าน
        await expect(promotionPage.blockSentComment).toBeVisible();
        await expect(promotionPage.blockComment).toBeVisible();

        if (tagCount > 0) {
            await expect(promotionPage.tagItem).toBeVisible();
        } else {
            await expect(promotionPage.blockTag).toBeHidden();
        }
    });

    test.describe.serial('Love Detail Button', () => {
        //Pass
        test('Promotion_Desktop_028: ตรวจสอบการกด "Like" บนหน้ารายละเอียดโปรโมชัน กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
            await navbar.closeLoginModal()
        });

        //Pass
        test('Promotion_Desktop_029: ตรวจสอบการกด "Like" บนหน้ารายละเอียดโปรโมชัน กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(promotionPage.loveDetailBtnIcon).toHaveAttribute('fill', '#BF202F');
        });

        //Pass
        test('Promotion_Desktop_030: ตรวจสอบการกด "Like" ซ้ำบนหน้ารายละเอียดโปรโมชัน เมื่อกดไปแล้ว (กลับไปเป็น Default) กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(promotionPage.loveDetailBtnIcon).toHaveAttribute('fill', '#979797');
        });
    });

    // ---------- Share Button (Promotion Detail) ---------- 
    // Pass
    test('PPromotion_Desktop_031: ตรวจสอบการกดปุ่ม "Share" บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickShareTop_Button();
        await expect(promotionPage.shareOnFacebook.first()).toBeVisible();
        await expect(promotionPage.shareOnLine.first()).toBeVisible();
        await expect(promotionPage.shareOnX.first()).toBeVisible();
        await expect(promotionPage.shareCopyLink.first()).toBeVisible();

    });

    // Pass
    test('Promotion_Desktop_032: ตรวจสอบการกด "Icon Facebook" เพื่อแชร์โปรโมชันนั้น ไปที่ facebook.com บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnFacebook_top(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_033: ตรวจสอบการกด "Icon Line" เพื่อแชร์โปรโมชันนั้น ไปที่ line.me บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnLine_top(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_034: ตรวจสอบการกด "Icon X" เพื่อแชร์โปรโมชันนั้น ไปที่ x.com บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnX_top(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/x\.com/);
        await popup.close();
    });

    // Fail
    // หา locator ปุ่มแชร์ไม่เจอ???
    // อาจต้องใช้วิธี data-clipboard-text attribute แทนถึงจะทำงานได้ครบทุก browser
    test('Promotion_Desktop_035: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกโปรโมชันนั้น บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);

        await promotionPage.clickPromotionCard_title();
        const expectedUrl = page.url();

        const clipboardText = await promotionPage.clickShareCopyLink_top(page);
        expect(clipboardText).toBe(expectedUrl);
    });

    // Pass
    test('Promotion_Desktop_036: ตรวจสอบการกดปุ่ม "Share" บนหน้ารายละเอียดโปรโมชัน (ด้านหลัง)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickShareFooter_Button();
        await expect(promotionPage.shareOnFacebook.nth(1)).toBeVisible();
        await expect(promotionPage.shareOnLine.nth(1)).toBeVisible();
        await expect(promotionPage.shareOnX.nth(1)).toBeVisible();
        await expect(promotionPage.shareCopyLink.nth(1)).toBeVisible();

    });

    // ---------- Share Button ---------- 
    // Pass
    test('Promotion_Desktop_037: ตรวจสอบการกด "Icon Facebook" เพื่อแชร์โปรโมชันนั้น ไปที่ facebook.com บนหน้ารายละเอียดโปรโมชัน (ด้านหลัง)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnFacebook_footer(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_038: ตรวจสอบการกด "Icon Line" เพื่อแชร์โปรโมชันนั้น ไปที่ line.me บนหน้ารายละเอียดโปรโมชัน (ด้านหลัง)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnLine_footer(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_039: ตรวจสอบการกด "Icon X" เพื่อแชร์โปรโมชันนั้น ไปที่ x.com บนหน้ารายละเอียดโปรโมชัน (ด้านหลัง)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnX_footer(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/x\.com/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_040: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกโปรโมชันนั้น บนหน้ารายละเอียดโปรโมชัน (ด้านหลัง)', async ({ page, context }) => {
        await promotionPage.clickPromotionCard_title();
        const expectedUrl = page.url();
        const copyValue = await promotionPage.clickShareCopyLink_footer();
        expect(copyValue).toBe(expectedUrl);
    });

    // ---------- Bookmark Button (Promotion Detail) ----------
    // Pass
    test('Promotion_Desktop_041: ตรวจสอบการกด "Bookmark" บนหน้ารายละเอียดโปรโมชัน กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookMarkButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_042: ตรวจสอบการกด "Bookmark" บนหน้ารายละเอียดโปรโมชัน กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookMarkButton();
        await expect(promotionPage.bookMarkButton.locator('i.fa-bookmark')).toHaveCount(0);
        await expect(promotionPage.bookMarkButton.locator('svg path')).toHaveCSS('fill', 'rgb(191, 32, 47)');
    });

    // Pass
    test('Promotion_Desktop_043: ตรวจสอบการกด "Bookmark" ซ้ำบนหน้ารายละเอียดโปรโมชัน เมื่อกดไปแล้ว (กลับไปเป็น Default) กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickLoveButton();
        await expect(promotionPage.bookMarkButton.locator('i.fa-bookmark')).toBeVisible();
        await expect(promotionPage.bookMarkButton.locator('svg')).toHaveCount(0);
    });

    /**
     * Fail
     * TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
    =========================== logs ===========================
    waiting for navigation until "load"
    ============================================================
     */
    test('Promotion_Desktop_044: ตรวจสอบการแสดงรายละเอียดบนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await expect(promotionPage.box_ProPopular).toBeVisible();
        await expect(promotionPage.coverImg_CardProPopular).toBeVisible();
        await expect(promotionPage.title_CardProPopular).toBeVisible();
        await expect(promotionPage.logoBrand_CardProPopular).toBeVisible();
        await expect(promotionPage.loveBtn_CardProPopular).toBeVisible();
        await expect(promotionPage.bookmarkBtn_CardProPopular).toBeVisible();
        await expect(promotionPage.discAndDate_CardProPopular).toBeVisible();
        await expect(promotionPage.labelPro_CardProPopular).toBeVisible();
        await promotionPage.coverImg_CardProPopular.hover()
        await expect(promotionPage.shareBtn_CardProPopular).toBeVisible();
    });

    // Fail
    /**
     *  TimeoutError: locator.click: Timeout 10000ms exceeded.
        Call log:
        - waiting for locator('.CardPromotion__BlockTitle-sc-50f9525-3').first()


        at ..\pages\PromotionPage.ts:320

        318 |
        319 |     async clickPromotionPopular() {
        > 320 |         await this.title_CardProPopular.first().click();
     */
    test('Promotion_Desktop_045: ตรวจสอบการกดที่การ์ด "โปรโมชันมาแรง" เพื่อเข้าดูหน้ารายละเอียดโปรโมชั่นนั้น', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickPromotionPopular();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(promotionPage.author_image).toBeVisible();
        await expect(promotionPage.author_name).toBeVisible();
        await expect(promotionPage.blockRemainingTime).toBeVisible();
        await expect(promotionPage.blockDate).toBeVisible();
        await expect(promotionPage.blockView).toBeVisible();
        await expect(promotionPage.shareButton_top).toBeVisible();
        await expect(promotionPage.shareButton_footer).toBeVisible();
        await expect(promotionPage.bookMarkButton).toBeVisible();
        await expect(promotionPage.coverImage).toBeVisible();
        await expect(promotionPage.textContent).toBeVisible();
        await expect(promotionPage.loveDetailButton_footer).toBeVisible();
        await expect(promotionPage.blockAuthor_footer).toBeVisible();
        await expect(promotionPage.blockSentComment).toBeVisible();
        await expect(promotionPage.blockComment).toBeVisible();
    });

    test('Promotion_Desktop_046: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ด "โปรโมชันมาแรง" กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookmark_PromotionPopular();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    test('Promotion_Desktop_047: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ด "โปรโมชันมาแรง" กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookmark_PromotionPopular();
        await expect(promotionPage.bookmarkBtn_CardProPopular.locator('i.fa-bookmark')).toHaveCount(0);
        await expect(promotionPage.bookmarkBtn_CardProPopular.locator('svg path')).toHaveCSS('fill', 'rgb(191, 32, 47)');
    });

    test('Promotion_Desktop_048: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ด "โปรโมชันมาแรง" กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookmark_PromotionPopular();
        await expect(promotionPage.bookmarkBtn_CardProPopular.locator('i.fa-bookmark')).toHaveCount(0);
        await expect(promotionPage.bookmarkBtn_CardProPopular.locator('svg path')).toHaveCSS('fill', 'rgb(191, 32, 47)');
        await promotionPage.clickBookmark_PromotionPopular();
        await expect(promotionPage.bookmarkBtn_CardProPopular.locator('i.fa-bookmark')).toBeVisible();
        await expect(promotionPage.bookmarkBtn_CardProPopular.locator('svg')).toHaveCount(0);
    });

    test('Promotion_Desktop_049: ตรวจสอบการกดปุ่ม "Like" บนการ์ด "โปรโมชันมาแรง" กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickLove_PromotionPopular();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    test('Promotion_Desktop_050: ตรวจสอบการกดปุ่ม "Like" บนการ์ด "โปรโมชันมาแรง" กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickLove_PromotionPopular();
        await expect(promotionPage.loveBtn_CardProPopular.locator('i.fa-bookmark')).toHaveCount(0);
        await expect(promotionPage.loveBtn_CardProPopular.locator('svg path')).toHaveCSS('fill', 'rgb(191, 32, 47)');
    });

    test('Promotion_Desktop_051: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ด "โปรโมชันมาแรง" กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickLove_PromotionPopular();
        await expect(promotionPage.loveBtn_CardProPopular.locator('i.fa-bookmark')).toHaveCount(0);
        await expect(promotionPage.loveBtn_CardProPopular.locator('svg path')).toHaveCSS('fill', 'rgb(191, 32, 47)');
        await promotionPage.clickBookmark_PromotionPopular();
        await expect(promotionPage.loveBtn_CardProPopular.locator('i.fa-bookmark')).toBeVisible();
        await expect(promotionPage.loveBtn_CardProPopular.locator('svg')).toHaveCount(0);
    });

    test('Promotion_Desktop_052: ตรวจสอบการนำทางไปหน้าแบรนด์นั้น เมื่อกดรูปโลโก้แบรนด์บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickPromotionPopular();
        await page.waitForURL(/\/brand\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await expect(page).toHaveURL(/\/brand\/[a-zA-Z0-9-_]+/);
        // TO DO: expect element ในหน้าแบรนด์
    });

    test('Promotion_Desktop_053: ตรวจสอบการกดปุ่ม "Share" บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickPromotionPopular();
        await promotionPage.clickShare_PromotionPopular();
    });

    test('Promotion_Desktop_054: ตรวจสอบการกด "Share" ผ่าน Facebook เปิด Popup ไปที่ facebook.com บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
    });

    test('Promotion_Desktop_055: ตรวจสอบการกด "Share" ผ่าน Line เปิด Popup ไปที่ line.me บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
    });

    test('Promotion_Desktop_056:  ตรวจสอบการกด "Share" ผ่าน X เปิด Popup ไปที่ x.com บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
    });

    test('Promotion_Desktop_057: ตรวจสอบการนำทางไปที่หน้า "นักเขียน" เมื่อกดชื่อและรูปโปไฟล์ผู้เขียน บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
    });

    // Not complete
    test('Promotion_Desktop_058: ตรวจสอบการนำทาง เมื่อกด Tag บนหน้ารายละเอียดโปรโมชัน (ถ้ามี)', async ({ page }) => {
        const tagBlock = page.locator('.BlockContent__BlockTags-sc-766b4868-1');
        const count = await tagBlock.count();
        console.log('จำนวน element ที่เจอ:', count);
        const tagCount = await promotionPage.tagItem.count();
        if (tagCount > 0) {
            await promotionPage.tagItem.first().click();
            await expect(page).toHaveURL(/\/tag\/.+/);
            await expect(promotionPage.multiTagCard).toBeVisible();
        } else {
            await expect(promotionPage.multiTagCard).toBeHidden();
        }
    });

    // ---------- Comment Section (Promotion Detail) ----------
    // ----- ยังไม่ login -----
    // Pass
    test('Promotion_Desktop_059: ตรวจสอบการแสดงความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.blockSentComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_060: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.replyComment.click();
        await promotionPage.textBoxReplyComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // ----- login แล้ว -----
    // Pass
    test('Promotion_Desktop_061: ตรวจสอบการแสดงความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        const countBefore = await promotionPage.existingComment.count();
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.sentComment();
        await expect(promotionPage.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
        await expect(promotionPage.textBoxSendComment).toHaveValue('');
        await expect(promotionPage.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        // await expect(newCommentItem.getByText('testpunpro01')).toBeVisible();
        // await expect(newCommentItem.locator('.comment-time')).toBeVisible();
    });

    // Fail
    test('Promotion_Desktop_062: ตรวจสอบการตอบกลับความคิดเห็นสำเร็จ กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        const countBefore = await promotionPage.existingComment.count();
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.sentReplyComment();
        await expect(promotionPage.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
        await expect(promotionPage.textBoxReplyComment).toHaveValue('');
        await expect(promotionPage.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        // await expect(newCommentItem.getByText('testpunpro01')).toBeVisible();
        // await expect(newCommentItem.locator('.comment-time')).toBeVisible();
    });

    test('Promation_Desktop_063: ตรวจสอบการส่งความคิดเห็นแบบว่างเปล่า ในกรณีที่เข้าสู่ระบบแล้ว', () => {
    });

    // Not Complete
    test('Promotion_Desktop_064: ตรวจสอบการแสดงการตอบกลับความคิดเห็นทั้งหมด เมื่อกดปุ่ม "ตอบกลับ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.replyComment.click();
        // await expect(promotionPage.blockSenCommentReply).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา

    });

    // Not Complete
    test('Promotion_Desktop_065: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อกดปุ่ม "ซ่อน"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.replyComment.click();
        // await expect(promotionPage.blockSenCommentReply).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await promotionPage.hideComment.click();
        // await expect(promotionPage.blockSenCommentReply).toBeHidden();
    });

    // Not Complete
    test('Promotion_Desktop_066: ตรวจสอบการแสดงโปรไฟล์ของผู้ใช้ที่แสดงความคิดเห็นได้ถูกต้อง', async ({ page }) => {
        await promotionPage.sentComment();
        await expect(promotionPage.existingComment).toBeVisible();
    });

    // Not Complete
    test('Promotion_Desktop_067: ตรวจสอบการแสดงเวลาในการแสดงความคิดเห็นได้ถูกต้อง', async ({ page }) => {
        await page
        await expect(promotionPage.blockComment.getByText('test comment')).toBeVisible();
    });

    // Not Complete
    test('Promotion_Desktop_068: ตรวจสอบความคิดเห็นยังคงอยู่หลัง reload หน้า', async ({ page }) => {
        await page
        await expect(promotionPage.blockComment.getByText('test comment')).toBeVisible();
    });

    // Not Complete
    test.describe('Run test', () => {
        // Pass
        test('Promotion_Desktop_069: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
            await promotionPage.clickPromotionCard_image();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
        });

        // Pass >> Desktop Safari ยังไม่ผ่าน
        test('Promotion_Desktop_070: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
            await promotionPage.clickPromotionCard_image();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();
            await page.waitForTimeout(3000);
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBe(0);
        });
    });
});