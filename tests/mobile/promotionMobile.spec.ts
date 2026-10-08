import { test, expect } from '@playwright/test';
import { PromotionPage } from '../../pages/PromotionPage';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { AuthorPage } from '../../pages/AuthorPage';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

let navbar: NavbarFooter;
let promotionPage: PromotionPage;
let authorPage: AuthorPage;
// เข้าสู่ระบบ -> ไปหน้าโปรโมชัน -> เปิดรายละเอียดโปรโมชันแรก
async function loginAndOpenPromotionDetail() {
    await navbar.openLoginOrSignup_mobile();
    await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
    await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
    await promotionPage.clickPromotionCard_title();
}

// ส่งคอมเมนต์บนหน้ารายละเอียด (ต้องอยู่หน้ารายละเอียดแล้ว) แล้วคืนข้อความที่ส่ง
// เหตุผล: sentComment() ใน POM สร้างข้อความเองและไม่ return ทำให้ assert ด้วย Date.now() อีกรอบไม่มีทางตรง
async function postComment(): Promise<string> {
    const text = `test-${Date.now()}`;
    await promotionPage.textBoxSendComment.click();
    await promotionPage.textBoxSendComment.fill(text);
    await promotionPage.submitCommentButton.first().click();
    return text;
}

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    promotionPage = new PromotionPage(page);
    authorPage = new AuthorPage(page);

    await navbar.goto();
    await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);

    // ปิด popup ก่อน
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Promotion Page (Mobile)', () => {

    /// ---------- Promotion (Main) ----------
    // Pas
    test('Promotion_Mobile_001: ตรวจสอบการกดเข้าหน้า "โปรโมชัน" ได้', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await page.waitForURL(/\/promotion/, { timeout: 10000 });
        await expect(promotionPage.promotion_heading).toBeVisible();
    });

    //ผ่าน
    test('Promotion_Mobile_002: ตรวจสอบการแสดงรายละเอียดหน้า "โปรโมชัน"', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        // await page.waitForURL(/\/promotion/, { timeout: 10000 });
        await expect(promotionPage.highlightedBanner.first()).toBeVisible();
        await expect(promotionPage.blockMenuCategories).toBeVisible();
        await expect(promotionPage.promotionCard.first()).toBeVisible();
        await expect(promotionPage.loadMoreButton).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_003: ตรวจสอบการแสดงโปรโมชันที่ยังไม่หมดอายุบน Banner', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await expect(promotionPage.highlightedBanner.first()).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_004: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await expect(promotionPage.bannerPagination).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_005: ตรวจสอบการนำทางไปหน้า "รายละเอียดโปรโมชัน" เมื่อกด Banner', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.highlightedBanner.first().click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/); // ตรวจสอบว่า URL มีรูปแบบ /p/ ตามด้วยชื่อโปรโมชัน
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
    });

    const filterCases = [
        { id: 'Promotion_Mobile_Menu_006', filterName: 'oneGetone', label: '1 แถม 1', urlPattern: /buy1-get1-free/ },
        { id: 'Promotion_Mobile_Menu_007', filterName: 'percentUp', label: '50% up', urlPattern: /sale-50p-up/ },
        { id: 'Promotion_Mobile_Menu_008', filterName: 'proMobile', label: 'โปรมือถือ', urlPattern: /mobile-phone/ },
        { id: 'Promotion_Mobile_Menu_009', filterName: 'foodie', label: 'อาหาร', urlPattern: /food/ },
        { id: 'Promotion_Mobile_Menu_010', filterName: 'cheapTicket', label: 'ตั๋วถูก', urlPattern: /ticket/ },
        { id: 'Promotion_Mobile_Menu_011', filterName: 'discountCode', label: 'โค้ดส่วนลด', urlPattern: /discount/ },
    ];

    // Pass
    for (const { id, filterName, label, urlPattern } of filterCases) {
        test(`${id}: กด Filter โปรโมชัน "${label}" ได้`, async ({ page }) => {
            // await navbar.dismissAppBannerIfPresent();
            // await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            // await page.waitForURL(/\/promotion/, { timeout: 10000 }); 
            await promotionPage.clickFilter(filterName);
            await expect(page).toHaveURL(urlPattern);
            await expect(promotionPage.promotionCardEach.first()).toBeVisible();
            const cardCount = await promotionPage.getPromotionCardCount();
            expect(cardCount).toBeGreaterThan(0);
            expect(cardCount).toBeLessThanOrEqual(12);
        });
    }

    // Pass
    test('Promotion_Mobile_012: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีโปรโมชัน', async ({ page }) => {
        for (const { filterName, urlPattern } of filterCases) {
            await promotionPage.clickFilter(filterName);
            await expect(page).toHaveURL(urlPattern);

            // รอให้ผลลัพธ์แสดงก่อน (มีการ์ด หรือ ข้อความไม่มีโปรโมชัน) แล้วค่อยนับ
            await expect(
                promotionPage.promotionCardEach.first().or(promotionPage.noPromotionMessage)
            ).toBeVisible();

            const cardCount = await promotionPage.promotionCardEach.count();
            if (cardCount > 0) {
                await expect(promotionPage.promotionCard).toBeVisible();
                expect(cardCount).toBeLessThanOrEqual(12);
            } else {
                await expect(promotionPage.noPromotionMessage).toBeVisible();
            }
        }
    });


    // ---------- Promotion Card ----------
    // Pass
    test('Promotion_Mobile_013: ตรวจสอบการแสดงรายละเอียดบน การ์ดโปรโมชัน', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await expect(promotionPage.promotionCard).toBeVisible();
        await expect(promotionPage.promotionCard_image.first()).toBeVisible();
        await expect(promotionPage.promotionCard_title.first()).toBeVisible();
        await expect(promotionPage.promotionLabel.first()).toBeVisible();
        await expect(promotionPage.descriptionCard.first()).toBeVisible();
        await expect(promotionPage.remainingTime.first()).toBeVisible();
        await expect(promotionPage.dateContent.first()).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_014: ตรวจสอบการนำทางไปหน้ารายละเอียดโปรโมชัน เมื่อกดรูปภาพ บนการ์ดโปรโมชัน', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_image();
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
    });

    // Pass
    test('Promotion_Mobile_015: ตรวจสอบการนำทางไปหน้ารายละเอียดโปรโมชัน เมื่อกดชื่อโปรโมชัน บนการ์ดโปรโมชัน', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
    });

    // Pass
    test('Promotion_Mobile_016: ตรวจสอบการแสดงข้อความ "ยังไม่มีกำหนดสิ้นสุด" เมื่อโปรโมชันไม่กำหนดวันสิ้นสุด', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        const card = promotionPage.promotionCardEach.filter({ hasText: 'Subway โปรสุดคุ้ม ซื้อ 1 ชุดแถม 1 ชิ้น เริ่มต้น 203.-' });
        await expect(card).toBeVisible();
        await expect(card).toContainText('ยังไม่มีกำหนดสิ้นสุด');
    });

    // Pass
    test('Promotion_Mobile_017: ตรวจสอบการแสดงข้อความ "สิ้นสุดโปรใน x วัน" เมื่อโปรโมชันนั้นยังอยู่ในช่วงของโปรโมชันอยู่', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        const card = promotionPage.promotionCardEach.filter({ hasText: 'Test Create Post ;)' });
        await expect(card).toBeVisible();
        await expect(card).toContainText(/สิ้นสุดโปรใน \d+ วัน/);
    });

    // Pass
    test('Promotion_Mobile_018: ตรวจสอบการแสดงข้อความ "หมดอายุ" เมื่อโปรโมชันสิ้นสุดแล้ว', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        const card = promotionPage.promotionCardEach.filter({ hasText: 'test หมดเวลา title' });
        await expect(card).toBeVisible();
        await expect(card).toContainText('หมดอายุ');
    });

    // Pass
    test('Promotion_Mobile_019: ตรวจสอบการแสดง วันที่เริ่มต้น เมื่อโปรโมชันมีการกำหนดวันที่เริ่มต้น', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        const card = promotionPage.promotionCardEach.filter({ hasText: 'Test Create Post ;)' });
        await expect(card).toBeVisible();
        await expect(card.locator('[class*="FixSizePromotionCard__DateCotent"]')).toHaveText(/\d{1,2} .+ \d{2}/);
    });

    // ---------- Love Button ----------
    // Pass
    test('Promotion_Mobile_020: ตรวจสอบการกด "Like" บนการ์ดโปรโมชัน กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickLoveButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Mobile_021: ตรวจสอบการกด "Like" บนการ์ดโปรโมชัน กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        const fill = await promotionPage.loveButtonIcon.getAttribute('fill');

        if (fill === '#BF202F') {
            await promotionPage.clickLoveButton();
        }
        await promotionPage.clickLoveButton();
        await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#BF202F');
    });

    // Pass
    test('Promotion_Mobile_022: ตรวจสอบการกด "Like" ซ้ำบนการ์ดโปรโมชัน เมื่อกดไปแล้ว (กลับไปเป็น Default) กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
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
    test('Promotion_Mobile_023: ตรวจสอบการโหลดการ์ดเพิ่มเมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        const cardBefore = await promotionPage.promotionCard.count()
        await promotionPage.clickLoadMore();
        const cardAfter = await promotionPage.promotionCard.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
        await expect(promotionPage.loadMoreButton).toBeHidden();
    });

    // Pass
    test('Promotion_Mobile_024: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
        await promotionPage.clickLoadMore();
        await expect(promotionPage.loadMoreButton).toBeHidden();
    });

    // ---------- ปุ่ม ^ ---------- 
    // Pass
    test('Promotion_Mobile_025: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        // await expect(navbar.scrollToTopButton).toBeHidden();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_026: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();
        await page.waitForTimeout(3000);
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBe(0);
    });


    // ---------- Promotion Detail ----------
    // Pass
    test('Promotion_Mobile_027: ตรวจสอบการแสดงรายละเอียดบน รายละเอียดโปรโมชัน', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        const card = promotionPage.promotionCardEach.filter({ hasText: 'Test Create Post ;)' });
        await card.click();
        const tagCount = await promotionPage.tagItem.count();
        await expect(promotionPage.author_name).toBeVisible();
        await expect(promotionPage.blockRemainingTime).toBeVisible();
        await expect(promotionPage.blockDate).toBeVisible();
        await expect(promotionPage.blockView).toBeVisible();
        await expect(promotionPage.shareButton_mobile).toBeVisible();
        await expect(promotionPage.bookMarkButton_mobile).toBeVisible();
        await expect(promotionPage.coverImage).toBeVisible();
        await expect(promotionPage.textContent).toBeVisible();
        await expect(promotionPage.blockAuthor_footer).toBeVisible();
        await expect(promotionPage.layout_Comment).toBeVisible();

        if (tagCount > 0) {
            await expect(promotionPage.tagItem.first()).toBeVisible();
        } else {
            console.log('ไม่มี Tag');
        }
    });

    // Pass
    test('Promotion_Mobile_028: ตรวจสอบการกดปุ่ม "แชร์" บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.shareButton_mobile.click();
        await expect(promotionPage.shareOnFacebook).toBeVisible();
        await expect(promotionPage.shareOnLine).toBeVisible();
        await expect(promotionPage.shareOnX).toBeVisible();
        await expect(promotionPage.shareCopyLink).toBeVisible();
    });

    // ---------- Share Button ---------- 
    // Pass
    test('Promotion_Mobile_029: ตรวจสอบการแชร์ผ่าน Facebook เปิด popup ไปที่ facebook.com', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.shareButton_mobile.click();
        const popupPromise = page.waitForEvent('popup');
        await promotionPage.shareOnFacebook.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/facebook\.com/);
    });

    // Pass
    test('Promotion_Mobile_030: ตรวจสอบการแชร์ผ่าน Line เปิด popup ไปที่ line.me', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.shareButton_mobile.click();
        const popupPromise = page.waitForEvent('popup');
        await promotionPage.shareOnLine.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/line\.me/);
    });

    // Pass
    test('Promotion_Mobile_031: ตรวจสอบการแชร์ผ่าน X เปิด popup ไปที่ x.com', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.shareButton_mobile.click();
        const popupPromise = page.waitForEvent('popup');
        await promotionPage.shareOnX.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/x\.com|twitter\.com/);
    });

    // Pass
    test('Promotion_Mobile_032: ตรวจสอบการแชร์ผ่าน Copy Link', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        const currentUrl = new URL(page.url());
        const copyValue = await promotionPage.clickShareCopyLink_mobile();
        expect(copyValue).not.toBeNull();
        const copiedUrl = new URL(copyValue!);
        expect(copiedUrl.origin).toBe(currentUrl.origin);
        expect(copiedUrl.pathname).toBe(currentUrl.pathname);
    });

    // ---------- Bookmark Button ----------
    // Pass
    test('Promotion_Mobile_033: ตรวจสอบการกด "Bookmark" บนหน้ารายละเอียดโปรโมชัน กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.bookMarkButton_mobile.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Mobile_034: ตรวจสอบการกด "Bookmark" บนหน้ารายละเอียดโปรโมชัน กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        const bookmarkIcon = promotionPage.bookMarkButton_mobile.locator('i.fa-bookmark');
        const bookmarkSvg = promotionPage.bookMarkButton_mobile.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await promotionPage.bookMarkButton_mobile.click();
            await expect(bookmarkIcon).toBeVisible();
        }

        await promotionPage.bookMarkButton_mobile.click();
        await expect(bookmarkIcon).toHaveCount(0);
        await expect(promotionPage.bookMarkButton_mobile.locator('svg path')).toHaveAttribute('fill', '#BF202F');
    });

    // Pass
    test('Promotion_Mobile_035: ตรวจสอบการกด "Bookmark" ซ้ำบนหน้ารายละเอียดโปรโมชัน เมื่อกดไปแล้ว (กลับไปเป็น Default) กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();

        const bookmarkButton = promotionPage.bookMarkButton_mobile;
        const bookmarkIcon = bookmarkButton.locator('i.fa-bookmark');
        const bookmarkSvg = bookmarkButton.locator('svg');

        // ตรวจสอบ Initial State
        if (await bookmarkSvg.count() > 0) {
            await bookmarkButton.click();
            await expect(bookmarkIcon).toBeVisible();
        }

        // กดครั้งแรก → Active
        await bookmarkButton.click();

        await expect(bookmarkButton.locator('svg')).toBeVisible();
        await expect(bookmarkButton.locator('svg path')).toHaveAttribute('fill', '#BF202F');

        // กดซ้ำ → Default
        await bookmarkButton.click();

        await expect(bookmarkButton.locator('i.fa-bookmark')).toBeVisible();
        await expect(bookmarkButton.locator('svg')).toHaveCount(0);
    });

    // Pass
    test('Promotion_Mobile_036: ตรวจสอบการนำทางไปที่หน้า "นักเขียน" เมื่อกดชื่อและรูปโปไฟล์ผู้เขียน บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
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
    test('Promotion_Mobile_037: ตรวจสอบการนำทาง เมื่อกด Tag บนหน้ารายละเอียดโปรโมชัน (ถ้ามี)', async ({ page }) => {
        const card = promotionPage.promotionCardEach.filter({ hasText: 'Test Create Post ;)' });
        await card.click();
        const title = await promotionPage.heading_detail.innerText();
        console.log('ชื่อโปรโมชัน:', title);
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

    // ---------- Comment Section ----------
    // No Run
    test.describe('Run test', () => {
        test('Promotion_Mobile_038: ตรวจสอบการแสดงความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            await promotionPage.clickPromotionCard_title();
            await promotionPage.blockSentComment.click();
            await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
            await navbar.closeLoginModal()
        });

        // No Run
        test('Promotion_Mobile_039: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            await promotionPage.clickPromotionCard_title();
            await promotionPage.replyComment.click();
            await promotionPage.textBoxReplyComment.click();
            await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
            await navbar.closeLoginModal()
        });

        // No Run
        test('Promotion_Mobile_040: ตรวจสอบการแสดงความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
            await loginAndOpenPromotionDetail();
            await expect(promotionPage.layout_Comment).toBeVisible();

            // นับหลังเข้าหน้ารายละเอียดแล้ว (ของเดิมนับที่หน้า list เลยได้ 0 เสมอ)
            const countBefore = await promotionPage.existingComment.count();
            const commentText = await postComment();

            await expect(promotionPage.blockComment.getByText(commentText)).toBeVisible();
            await expect(promotionPage.textBoxSendComment).toHaveValue('');
            await expect(promotionPage.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        });

        // No Run
        test('Promotion_Mobile_041: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
            await loginAndOpenPromotionDetail();

            // ต้องกด "ตอบกลับ" ก่อน กล่องพิมพ์ตอบกลับถึงจะขึ้น (โพสต์ต้องมีคอมเมนต์อยู่แล้ว)
            await promotionPage.replyComment.click();
            const countBefore = await promotionPage.existingComment.count();

            const replyText = `test-${Date.now()}`;
            const replyBox = promotionPage.textBoxReplyComment.getByRole('textbox');
            await replyBox.click();
            await replyBox.fill(replyText);
            await promotionPage.submitReplyCommentButton.click();

            await expect(promotionPage.blockComment.getByText(replyText)).toBeVisible();
            await expect(replyBox).toHaveValue('');
            await expect(promotionPage.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        });

        // No Run
        test('Promotion_Mobile_042: ตรวจสอบการแสดงการตอบกลับความคิดเห็นทั้งหมด เมื่อกดปุ่ม "ตอบกลับ"', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            await promotionPage.clickPromotionCard_title();
            await promotionPage.replyComment.click();
            await expect(promotionPage.blockSentCommentReply).toBeVisible();
        });

        // No Run
        test('Promotion_Mobile_043: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อกดปุ่ม "ซ่อน"', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            await promotionPage.clickPromotionCard_title();
            await promotionPage.replyComment.click();
            await expect(promotionPage.blockSentCommentReply).toBeVisible();
            await promotionPage.hideComment.click();
            await expect(promotionPage.blockSentCommentReply).toBeHidden();
        });

        // No Run
        test('Promotion_Mobile_044: ตรวจสอบการแสดงโปรไฟล์ของผู้ใช้ที่แสดงความคิดเห็นได้ถูกต้อง', async ({ page }) => {
            await loginAndOpenPromotionDetail();
        });

        // No Run
        test('Promotion_Mobile_045: ตรวจสอบการแสดงเวลาในการแสดงความคิดเห็นได้ถูกต้อง', async ({ page }) => {
            await loginAndOpenPromotionDetail();
        });

        // No Run
        test('Promotion_Mobile_046: คอมเมนต์ยังคงอยู่หลัง reload หน้า', async ({ page }) => {
            await loginAndOpenPromotionDetail();

            const commentText = await postComment();
            await expect(promotionPage.blockComment.getByText(commentText)).toBeVisible();

            await page.reload();
            await expect(promotionPage.blockComment.getByText(commentText)).toBeVisible({ timeout: 15000 });
        });
    });

    // Pass
    test('Promotion_Mobile_047: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await promotionPage.clickPromotionCard_image();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_048: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await promotionPage.clickPromotionCard_image();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
        await page.waitForTimeout(1000);
        await navbar.scrollToTopButton.dispatchEvent('click'); // desktop ใช้ dispatchEvent เพราะ click ปกติไม่เสถียร
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });
});