import { test, expect } from '@playwright/test';
import { PromotionPage } from '../../pages/PromotionPage';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { AuthorPage } from '../../pages/AuthorPage';
import { CommentSection } from '../../pages/CommentSection';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';
// test.describe('Run test', () => {

let navbar: NavbarFooter;
let promotionPage: PromotionPage;
let authorPage: AuthorPage;
let commentSection: CommentSection;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    promotionPage = new PromotionPage(page);
    authorPage = new AuthorPage(page);
    commentSection = new CommentSection(page);
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

    // Pass
    test('Promotion_Desktop_004: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await expect(promotionPage.highlightedBanner.first()).toBeVisible();
        await expect(promotionPage.bannerPagination).toBeVisible();

        const indicatorCount = await promotionPage.bannerIndicator.count();
        // console.log('จำนวน Indicator:', indicatorCount);
        if (indicatorCount < 2) {
            console.log('มี Banner ไม่เพียงพอสำหรับทดสอบการเลื่อน');
            return;
        }

        const beforeSlide = await promotionPage.activeSlide.getAttribute('data-swiper-slide-index'); // เก็บ Slide ก่อนกด
        // console.log('Banner ก่อนกด:', beforeSlide);
        await promotionPage.bannerIndicator.nth(0).click();

        // รอให้ Banner เปลี่ยน
        await expect.poll(
            async () => {
                return await promotionPage.activeSlide.getAttribute(
                    'data-swiper-slide-index'
                );
            },
            { timeout: 10000 }
        ).not.toBe(beforeSlide);

        const afterSlide = await promotionPage.activeSlide.getAttribute('data-swiper-slide-index'); // เก็บ Slide หลังจากกด
        // console.log('Banner หลังจากกด:', afterSlide);
        expect(afterSlide).not.toBe(beforeSlide); // ตรวจสอบว่า Banner เปลี่ยน
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
            const cardCount = await promotionPage.promotionCardEach.count();
            await expect(promotionPage.promotionCard).toBeVisible();
            expect(cardCount).toBeLessThanOrEqual(12);
            expect(cardCount).toBeGreaterThan(0);
            // data-active attribute ของ filter ที่ถูกเลือกจะเป็น true
        });
    }

    // Pass
    test('Promotion_Desktop_012: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีโปรโมชัน', async ({ page }) => {
        for (const { filterName, urlPattern } of filterCases) {
            await promotionPage.clickFilter(filterName);
            await expect(page).toHaveURL(urlPattern);
            const cardCount = await promotionPage.promotionCardEach.count();

            if (cardCount > 0) {
                await expect(promotionPage.promotionCard).toBeVisible();
                expect(cardCount).toBeLessThanOrEqual(12);
                expect(cardCount).toBeGreaterThan(0);

            } else {
                await expect(promotionPage.noPromotionMessage).toBeVisible();
            }
        }
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

    // pass
    test('Promotion_Desktop_016: ตรวจสอบการแสดงข้อความ "ยังไม่มีกำหนดสิ้นสุด" เมื่อโปรโมชันไม่กำหนดวันสิ้นสุด', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');

        const card = promotionPage.promotionCardEach.filter({
            hasText: 'Subway โปรสุดคุ้ม ซื้อ 1 ชุดแถม 1 ชิ้น เริ่มต้น 203.-'
        });

        await expect(card).toBeVisible();
        await expect(card).toContainText('ยังไม่มีกำหนดสิ้นสุด');
    });

    // pass
    test('Promotion_Desktop_017: ตรวจสอบการแสดงข้อความ "สิ้นสุดโปรใน x วัน" เมื่อโปรโมชันนั้นยังอยู่ในช่วงของโปรโมชันอยู่', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');

        const card = promotionPage.promotionCardEach.filter({
            hasText: 'Test Create Post ;)'
        });

        await expect(card).toBeVisible();
        await expect(card).toContainText(/สิ้นสุดโปรใน \d+ วัน/);
    });

    // pass
    test('Promotion_Desktop_018: ตรวจสอบการแสดงข้อความ "หมดอายุ" เมื่อโปรโมชันสิ้นสุดแล้ว', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');

        const card = promotionPage.promotionCardEach.filter({
            hasText: 'test หมดเวลา title'
        });

        await expect(card).toBeVisible();
        await expect(card).toContainText('หมดอายุ');
    });

    // pass
    test('Promotion_Desktop_019: ตรวจสอบการแสดง วันที่เริ่มต้น และ สิ้นสุด เมื่อโปรโมชันมีการกำหนดวันที่', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');

        const card = promotionPage.promotionCardEach.filter({
            hasText: 'Test Create Post ;)'
        });

        await expect(card).toBeVisible();

        const date = card.locator(
            '[class*="FixSizePromotionCard__DateCotent"]'
        );

        await expect(date).toHaveText(
            /\d{1,2} .+ \d{2} - \d{1,2} .+ \d{2}/
        );
    });

    // ---------- Love Button ----------
    // Pass
    test('Promotion_Desktop_020: ตรวจสอบการกด "Love" บนการ์ดโปรโมชัน กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickLoveButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_021: ตรวจสอบการกด "Love" บนการ์ดโปรโมชัน กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        const fill = await promotionPage.loveButtonIcon.getAttribute('fill');

        if (fill === '#BF202F') {
            await promotionPage.clickLoveButton();
        }

        await promotionPage.clickLoveButton();
        await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#BF202F');
    });

    // Pass
    test('Promotion_Desktop_022: ตรวจสอบการกด "Love" ซ้ำบนการ์ดโปรโมชัน เมื่อกดไปแล้ว (กลับไปเป็น Default) กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        const fill = await promotionPage.loveButtonIcon.getAttribute('fill');

        if (fill === '#BF202F') {
            await promotionPage.clickLoveButton();
        }
        await promotionPage.clickLoveButton();
        await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#BF202F');
        await promotionPage.clickLoveButton();
        await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#979797');
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
    // Pass
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
        await expect(promotionPage.layout_Comment).toBeVisible();
        if (tagCount > 0) {
            await expect(promotionPage.tagItem).toBeVisible()
        } else {
            console.log('ไม่มี Tag');
        }
    });

    // Pass
    test('Promotion_Desktop_028: ตรวจสอบการกด "Love" บนหน้ารายละเอียดโปรโมชัน กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickLoveDetailButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_029: ตรวจสอบการกด "Love" บนหน้ารายละเอียดโปรโมชัน กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const fill = await promotionPage.loveDetailBtnIcon.getAttribute('fill');

        if (fill === '#BF202F') {
            await promotionPage.clickLoveDetailButton();
        }

        await promotionPage.clickLoveDetailButton();
        await expect(promotionPage.loveDetailBtnIcon).toHaveAttribute('fill', '#BF202F');
    });

    // Pass
    test('Promotion_Desktop_030: ตรวจสอบการกด "Love" ซ้ำบนหน้ารายละเอียดโปรโมชัน เมื่อกดไปแล้ว (กลับไปเป็น Default) กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const fill = await promotionPage.loveDetailBtnIcon.getAttribute('fill');

        if (fill === '#BF202F') {
            await promotionPage.clickLoveDetailButton();
        }

        await promotionPage.clickLoveDetailButton();
        await expect(promotionPage.loveDetailBtnIcon).toHaveAttribute('fill', '#BF202F');
        await promotionPage.clickLoveDetailButton();
        await expect(promotionPage.loveDetailBtnIcon).toHaveAttribute('fill', '#979797');
    });

    // ---------- Share Button (Promotion Detail) ---------- 
    // Pass
    test('Promotion_Desktop_031: ตรวจสอบการกดปุ่ม "Share" บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async ({ page }) => {
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

    // Pass
    test('Promotion_Desktop_035: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกโปรโมชันนั้น บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async ({ page, context }) => {
        await promotionPage.clickPromotionCard_title();
        const expectedUrl = page.url();
        const copyValue = await promotionPage.clickShareCopyLink_top();
        expect(copyValue).toBe(expectedUrl);

        // await context.grantPermissions(['clipboard-read', 'clipboard-write']);

        // await promotionPage.clickPromotionCard_title();
        // const expectedUrl = page.url();

        // const clipboardText = await promotionPage.clickShareCopyLink_top(page);
        // expect(clipboardText).toBe(expectedUrl);
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
        const bookmarkIcon = promotionPage.bookMarkButton.locator('i.fa-bookmark');
        const bookmarkSvg = promotionPage.bookMarkButton.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await promotionPage.clickBookMarkButton();
            await expect(bookmarkIcon).toBeVisible();
        }

        await promotionPage.clickBookMarkButton();
        await expect(promotionPage.bookMarkButton.locator('svg path')).toHaveAttribute('fill', '#BF202F');
    });

    // Pass

    test('Promotion_Desktop_043: ตรวจสอบการกด "Bookmark" ซ้ำบนหน้ารายละเอียดโปรโมชัน เมื่อกดไปแล้ว (กลับไปเป็น Default) กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const bookmarkIcon = promotionPage.bookMarkButton.locator('i.fa-bookmark');
        const bookmarkSvg = promotionPage.bookMarkButton.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await promotionPage.clickBookMarkButton();
            await expect(bookmarkIcon).toBeVisible();
        }

        await promotionPage.clickBookMarkButton();
        await expect(promotionPage.bookMarkButton.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        await promotionPage.clickBookMarkButton();
        await expect(promotionPage.bookMarkButton.locator('i.fa-bookmark')).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_044: ตรวจสอบการแสดงรายละเอียดบนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await expect(promotionPage.box_ProPopular).toBeVisible();
        await expect(promotionPage.coverImg_CardProPopular).toBeVisible();
        await expect(promotionPage.title_CardProPopular).toBeVisible();
        await expect(promotionPage.logoBrand_CardProPopular).toBeVisible();
        await expect(promotionPage.loveBtn_CardProPopular).toBeVisible();
        await expect(promotionPage.bookmarkBtn_CardProPopular).toBeVisible();
        await expect(promotionPage.discAndDate_CardProPopular.nth(0)).toBeVisible();
        await expect(promotionPage.discAndDate_CardProPopular.nth(1)).toBeVisible();
        await expect(promotionPage.labelPro_CardProPopular).toBeVisible();
        await promotionPage.coverImg_CardProPopular.hover()
        await expect(promotionPage.shareBtn_CardProPopular).toBeVisible();
    });

    // Pass
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
        await expect(promotionPage.layout_Comment).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_046: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ด "โปรโมชันมาแรง" กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookmark_PromotionPopular();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_047: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ด "โปรโมชันมาแรง" กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await promotionPage.clickPromotionCard_title();
        const bookmarkIcon = promotionPage.bookmarkBtn_CardProPopular.locator('i');

        const beforeClass = await bookmarkIcon.getAttribute('class');

        await promotionPage.clickBookmark_PromotionPopular();

        await expect.poll(async () => {
            return await bookmarkIcon.getAttribute('class');
        }).not.toBe(beforeClass);

    });

    // Pass
    test('Promotion_Desktop_048: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ด "โปรโมชันมาแรง" กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();

        const bookmarkIcon = promotionPage.bookmarkBtn_CardProPopular.locator('i');
        const beforeClass = await bookmarkIcon.getAttribute('class');

        await promotionPage.clickBookmark_PromotionPopular();
        await expect.poll(async () => {
            return await bookmarkIcon.getAttribute('class');
        }).not.toBe(beforeClass);
        // const afterClass = await bookmarkIcon.getAttribute('class');

        await promotionPage.clickBookmark_PromotionPopular();
        await expect.poll(async () => {
            return await bookmarkIcon.getAttribute('class');
        }).toBe(beforeClass);
    });

    // Pass
    test('Promotion_Desktop_049: ตรวจสอบการกดปุ่ม "Love" บนการ์ด "โปรโมชันมาแรง" กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickLove_PromotionPopular();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_050: ตรวจสอบการกดปุ่ม "Love" บนการ์ด "โปรโมชันมาแรง" กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await promotionPage.clickPromotionCard_title();

        const loveIcon = promotionPage.loveBtn_CardProPopular.locator('i');
        const beforeClass = await loveIcon.getAttribute('class');
        await promotionPage.clickLove_PromotionPopular();
        await expect.poll(async () => {
            return await loveIcon.getAttribute('class');
        }).not.toBe(beforeClass);
    });

    // Pass
    test('Promotion_Desktop_051: ตรวจสอบการกดปุ่ม "Love" ซ้ำบนการ์ด "โปรโมชันมาแรง" กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();

        const loveIcon = promotionPage.loveBtn_CardProPopular.locator('i');
        const beforeClass = await loveIcon.getAttribute('class');
        await promotionPage.clickLove_PromotionPopular();
        await expect.poll(async () => {
            return await loveIcon.getAttribute('class');
        }).not.toBe(beforeClass);

        // const afterClass = await loveIcon.getAttribute('class');
        await promotionPage.clickLove_PromotionPopular();
        await expect.poll(async () => {
            return await loveIcon.getAttribute('class');
        }).toBe(beforeClass);
    });

    // Pass
    test('Promotion_Desktop_052: ตรวจสอบการนำทางไปหน้าแบรนด์นั้น เมื่อกดรูปโลโก้แบรนด์บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.logoBrand_CardProPopular.click();
        await page.waitForURL(/\/brand\?s=[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await expect(page).toHaveURL(/\/brand\?s=[a-zA-Z0-9-_]+/);
    });

    // Pass
    test('Promotion_Desktop_053: ตรวจสอบการกดปุ่ม "Share" บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        await promotionPage.clickShare_PromotionPopular();
        await expect(promotionPage.shareOnFacebook).toBeVisible();
        await expect(promotionPage.shareOnX).toBeVisible();
        await expect(promotionPage.shareOnLine).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_054: ตรวจสอบการกด "Share" ผ่าน Facebook เปิด Popup ไปที่ facebook.com บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        const popup = await promotionPage.clickShareOnFacebook_Relate(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_055: ตรวจสอบการกด "Share" ผ่าน Line เปิด Popup ไปที่ line.me บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        // await promotionPage.clickShare_PromotionPopular();
        const popup = await promotionPage.clickShareOnLine_Relate(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_056:  ตรวจสอบการกด "Share" ผ่าน X เปิด Popup ไปที่ x.com บนการ์ด "โปรโมชันมาแรง"', async ({ page }) => {
        // await promotionPage.clickShare_PromotionPopular();
        const popup = await promotionPage.clickShareOnX_Relate(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/x\.com/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_057: ตรวจสอบการนำทางไปที่หน้า "นักเขียน" เมื่อกดชื่อและรูปโปไฟล์ผู้เขียน บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickAuthorLink();
        await expect(page).toHaveURL(/\/author\/.+/);
        await expect(authorPage.homeBreadcrumb).toBeVisible();
        await expect(authorPage.authorBreadcrumb).toBeVisible();
        await expect(authorPage.headLayout).toBeVisible();
        await expect(authorPage.author_heading).toBeVisible();
        const cardCount = await authorPage.each_PostCard.count();
        expect(cardCount).toBeGreaterThan(0);
        expect(cardCount).toBeLessThanOrEqual(12);
        await expect(authorPage.articleCard).toBeVisible();
        await expect(authorPage.promotionCard).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_058: ตรวจสอบการนำทาง เมื่อกด Tag บนหน้ารายละเอียดโปรโมชัน (ถ้ามี)', async ({ page }) => {
        await promotionPage.clickPromotionCard_title();
        const title = await promotionPage.heading_detail.innerText();
        // console.log('Promotion Title:', title);
        const tagCount = await promotionPage.tagItem.count();
        console.log('จำนวน Tag ที่เจอ:', tagCount);

        if (tagCount > 0) {
            console.log('มี Tag จำนวน:', tagCount);
            await promotionPage.tagItem.first().click();
            await expect(page).toHaveURL(/\/tag\/.+/);
        } else {
            console.log('ไม่มี Tag จึงข้ามการตรวจสอบการนำทาง');
        }
    });

    // ---------- Comment Section (Promotion Detail) ----------
    // ----- ยังไม่ login -----
    // Pass
    test('Promotion_Desktop_059: ตรวจสอบการแสดงความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await promotionPage.blockSentComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_060: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await page.locator('a[href="/p/test-5000"]').first().click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await commentSection.replyComment_bth.click();
        await commentSection.textField_ReplyComment_promotion.first().click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // ----- login แล้ว -----
    // Pass
    test('Promotion_Desktop_061: ตรวจสอบการแสดงความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await page.locator('a[href="/p/test-5000"]').first().click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        const loggedInName = (await page.locator('a.NavbarTop__BlockUsername-sc-f8cfc4bb-5').innerText()).trim();
        await expect(commentSection.blockComment).toBeVisible();
        const countBefore = await commentSection.existingComment.count();
        await commentSection.sentComment();
        await page.reload();
        await expect(commentSection.blockComment.getByText('testcomment-auto')).toBeVisible();
        await expect(commentSection.blockComment).toBeVisible();
        await expect(commentSection.textField_Comment).toHaveValue('');
        await expect(commentSection.commentAuthor).toHaveText(loggedInName);
        await expect(commentSection.commentDate.first()).toContainText(/ที่แล้ว$/);
    });

    // Pass
    test('Promotion_Desktop_062: ตรวจสอบการตอบกลับความคิดเห็นสำเร็จ กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await page.locator('a[href="/p/test-5000"]').first().click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await expect(commentSection.blockComment).toBeVisible();
        const loggedInName = (await page.locator('a.NavbarTop__BlockUsername-sc-f8cfc4bb-5').innerText()).trim();
        await commentSection.sentReplyComment();
        await page.reload();
        await expect(commentSection.blockComment).toBeVisible();
        await commentSection.replyComment_bth.click();
        await expect(commentSection.replyCommentText.first()).toContainText('testryplycomment-auto');
        await expect(commentSection.replyCommentAuthor.first()).toContainText(loggedInName);
        await expect(commentSection.replyCommentDate.first()).toContainText(/ที่แล้ว$/);
    });

    // Pass
    test('Promotion_Desktop_063: ตรวจสอบการแสดงการตอบกลับความคิดเห็นทั้งหมด เมื่อกดปุ่ม "ตอบกลับ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await page.locator('a[href="/p/test-5000"]').first().click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await commentSection.replyComment_bth.click();
        await expect(commentSection.blockSentCommentReply).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_064: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อกดปุ่ม "ซ่อน"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await page.locator('a[href="/p/test-5000"]').first().click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await commentSection.replyComment_bth.click();
        await expect(commentSection.blockSentCommentReply).toBeVisible();
        await commentSection.hideComment_bth.click();
        await expect(commentSection.blockSentCommentReply).toBeHidden();
    });

    // Pass
    test('Promotion_Desktop_065: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await promotionPage.clickPromotionCard_image();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_066: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await promotionPage.clickPromotionCard_image();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();
        await page.waitForTimeout(3000);
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBe(0);
    });
});