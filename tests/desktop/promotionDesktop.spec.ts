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
    test('Promotion_Desktop_003: ตรวจสอบการแสดงรายละเอียดบน "การ์ดโปรโมชัน"', async ({ page }) => {
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
    test('Promotion_Desktop_004: ตรวจสอบการแสดงโปรโมชันที่ยังไม่หมดอายุบน Banner', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await expect(promotionPage.highlightedBanner).toBeVisible();
    });

    // Pass
    // มันมีปุ่มเดียว จะกดไปยังไงละหนู
    test('Promotion_Desktop_005: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await expect(promotionPage.bannerPagination).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_006: ตรวจสอบการนำทางไปหน้า "รายละเอียดโปรโมชัน" เมื่อกด Banner', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.highlightedBanner.click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/); // ตรวจสอบว่า URL มีรูปแบบ /p/ ตามด้วยชื่อโปรโมชัน
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
    });

    // ---------- Promotion Categories Tap ----------
    const filterCases = [
        { id: 'Promotion_Desktop_007', filterName: 'oneGetone', label: '1 แถม 1', urlPattern: /buy1-get1-free/ },
        { id: 'Promotion_Desktop_008', filterName: 'percentUp', label: '50% up', urlPattern: /sale-50p-up/ },
        { id: 'Promotion_Desktop_009', filterName: 'proMobile', label: 'โปรมือถือ', urlPattern: /mobile-phone/ },
        { id: 'Promotion_Desktop_010', filterName: 'foodie', label: 'อาหาร', urlPattern: /food/ },
        { id: 'Promotion_Desktop_011', filterName: 'cheapTicket', label: 'ตั๋วถูก', urlPattern: /ticket/ },
        { id: 'Promotion_Desktop_012', filterName: 'discountCode', label: 'โค้ดส่วนลด', urlPattern: /discount/ },
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

    // ---------- Promotion Card ---------- 
    // Pass
    test('Promotion_Desktop_013: ตรวจสอบการกดรูปภาพบนการ์ด "โปรโมชัน" เพื่อเข้าดูรายละเอียดได้', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_image();
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
    });

    // pass
    test('Promotion_Desktop_014: ตรวจสอบการกดชื่อโปรโมชันบนการ์ด "โปรโมชัน" เพื่อเข้าดูรายละเอียดได้', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
    });


    test('Promotion_Desktop_015: ตรวจสอบการแสดงข้อความ "ยังไม่มีกำหนดสิ้นสุด" เมื่อโปรโมชันไม่กำหนดวันสิ้นสุด', async ({ page }) => {
    });

    test('Promotion_Desktop_016: ตรวจสอบการแสดงข้อความ "สิ้นสุดโปรใน x วัน" เมื่อโปรโมชันนั้นยังอยู่ในช่วงของโปรโมชันอยู่', async ({ page }) => {
    });

    test('Promotion_Desktop_017: ตรวจสอบการแสดงข้อความ "หมดอายุ" เมื่อโปรโมชันสิ้นสุดแล้ว', async ({ page }) => {
    });

    test('Promotion_Desktop_018: ตรวจสอบการแสดง วันที่เริ่มต้น และ สิ้นสุด เมื่อโปรโมชันมีการกำหนดวันที่', async ({ page }) => {
    });


    // ---------- Love Button ----------
    // ชื่อ test case เปลี่ยนแล้ว กรณีที่ยังไม่ได้ login >> Pass
    test('Promotion_Desktop_019: ตรวจสอบการแสดง Popup เข้าสู่ระบบ เมื่อกดปุ่ม "Like" กรณี ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickLoveButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });


    // ชื่อ test case เปลี่ยนแล้ว >> Pass แต่ว่าถ้ากดในเว็บก่อนแล้ว จะเทสไม่ผ่าน เพราะ love button จะเปลี่ยนเป็นสีแดงแล้ว 
    // ใช้ test.describe.serial แล้ว test.beforeAll แล้วเขียน 2 case ไว้ข้างใน
    // Fail
    test.describe.serial('test', () => {
        test('Promotion_Desktop_020: ตรวจสอบการกด เมื่อกดปุ่ม "Like" เข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickLoveButton();
            await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#BF202F');
        });

        // ชื่อ test case เปลี่ยนแล้ว >> พอใช้ beforeEach ไม่Pass ถ้าใช้ beforeAll ก็ไม่รันให้ อย่าลืมหาวิธีแก้นะ >> เหมือนกับ Promotion_Desktop_006
        test('Promotion_Desktop_021: ตรวจสอบการกดปุ่ม "Like" อีกครั้งเพื่อกลับไปเป็น Default', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            // await promotionPage.clickLoveButton();
            // await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#BF202F');
            await promotionPage.clickLoveButton();
            await expect(promotionPage.loveButtonIcon).toHaveAttribute('fill', '#979797');
        });
    });

    // ---------- ปุ่ม ดูเพิ่มเติม ---------- 
    // Pass
    test('Promotion_Desktop_022: ตรวจสอบการโหลดการ์ดเพิ่มเมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        const cardBefore = await promotionPage.promotionCard.count()
        await promotionPage.clickLoadMore();
        const cardAfter = await promotionPage.promotionCard.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
    });

    // No Run
    test('Promotion_Desktop_023: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickLoadMore();
        await expect(promotionPage.loadMoreButton).toBeHidden();
    });

    // ---------- ปุ่ม ^ ---------- 
    // Pass
    test('Promotion_Desktop_024: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        // await expect(navbar.scrollToTopButton).toBeHidden();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Promotion_Desktop_025: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();
        await page.waitForTimeout(3000);
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBe(0);
    });

    // No Run
    test('Promotion_Desktop_026: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีโปรโมชัน', async ({ page }) => {

    });

    // ---------- Promotion Detail ----------
    // Not complete >> มันจะมีที่ กำหนดเวลา>>สิ้นสุดใน x วัน และ ไม่กำหนดเวลา(ไม่แสดงวันเริ่ม-วันสิ้นสุด)>>ยังไม่มีกำหนดสิ้นสุด

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
        await expect(promotionPage.blockauthor_footer).toBeVisible();
        // await expect(promotionPage.blockTag).toBeVisible(); //ไม่ผ่าน => มันจะมีบางคนที่ใส่ tag บางคนไม่ใส่ tag เลยทำให้ไม่ผ่าน
        await expect(promotionPage.blockSentComment).toBeVisible();
        await expect(promotionPage.blockComment).toBeVisible();

        if (tagCount > 0) {
            await expect(promotionPage.tagItem).toBeVisible();
        } else {
            await expect(promotionPage.blockTag).toBeHidden();
        }
    });

    // Not complete
    test('Promotion_Desktop_028: ตรวจสอบการนำทาง เมื่อกด Tag บนหน้ารายละเอียดโปรโมชัน (ถ้ามี)', async ({ page }) => {
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

    // test.describe('run test', () => {
    test.describe.serial('Love Detail Button', () => {
        //Pass
        test('Promotion_Desktop_029: ตรวจสอบการแสดง Popup เข้าสู่ระบบ เมื่อกดปุ่ม Like บนหน้ารายละเอียดโปรโมชัน โดยยังไม่เข้าสู่ระบบ', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
            await navbar.closeLoginModal()
        });

        //Pass
        test('Promotion_Desktop_030: ตรวจสอบการกดไอคอน "Like" บนหน้ารายละเอียดโปรโมชัน เข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(promotionPage.loveDetailBtnIcon).toHaveAttribute('fill', '#BF202F');
        });

        //Pass
        test('Promotion_Desktop_031: ตรวจสอบการกดไอคอน "Like" ซ้ำ บนหน้ารายละเอียดโปรโมชัน เมื่อกดไปแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(promotionPage.loveDetailBtnIcon).toHaveAttribute('fill', '#979797');

        });
    });

    // Pass
    test('PPromotion_Desktop_032: ตรวจสอบการกดปุ่ม "แชร์" บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickShareTop_Button();
        await expect(promotionPage.shareOnFacebook).toBeVisible();
        await expect(promotionPage.shareOnLine).toBeVisible();
        await expect(promotionPage.shareOnX).toBeVisible();
        await expect(promotionPage.shareCopyLink).toBeVisible();

    });

    // ---------- Share Button ---------- 
    // Pass
    test('Promotion_Desktop_033: ตรวจสอบการแชร์ผ่าน Facebook เปิด popup ไปที่ facebook.com', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnFacebook(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_034: ตรวจสอบการแชร์ผ่าน Line เปิด popup ไปที่ line.me', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnLine(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me/);
        await popup.close();
    });

    // Pass
    test('Promotion_Desktop_035: ตรวจสอบการแชร์ผ่าน X เปิด popup ไปที่ x.com', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnX(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/x\.com/);
        await popup.close();
    });

    // Not Complete and No Run
    // เอาไว้ก่อน ไม่รู้จะทำยังไงดี เพราะมันเป็นการ copy link ไปที่ clipboard ของเครื่องเราเอง
    test('Promotion_Desktop_036: ตรวจสอบการแชร์ผ่าน Copy Link', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        const popup = await promotionPage.clickShareOnFacebook(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // ---------- Bookmark Button ----------
    // Pass
    test('Promotion_Desktop_037: ตรวจสอบการแสดง Popup Login เมื่อกด "Bookmark" ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookMarkButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_038: ตรวจสอบการตรวจสอบการกด "Bookmark" เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookMarkButton();
        await expect(promotionPage.bookMarkButton.locator('i.fa-bookmark')).toHaveCount(0);
        await expect(promotionPage.bookMarkButton.locator('svg path')).toHaveCSS('fill', 'rgb(191, 32, 47)');
    });

    // Pass
    test('Promotion_Desktop_039: ตรวจสอบการกด "Bookmark" อีกครั้งเพื่อกลับไปเป็น Default', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickLoveButton();
        await expect(promotionPage.bookMarkButton.locator('i.fa-bookmark')).toBeVisible();
        await expect(promotionPage.bookMarkButton.locator('svg')).toHaveCount(0);
    });


    // ---------- Comment Section ----------
    // ----- ยังไม่ login -----
    // Pass
    test('Promotion_Desktop_040: ตรวจสอบการแสดงความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.blockSentComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Desktop_041: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.replyComment.click();
        await promotionPage.textBoxReplyComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // ----- login แล้ว -----
    // Pass
    test('Promotion_Desktop_042: ตรวจสอบการแสดงความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
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
    test('Promotion_Desktop_043: ตรวจสอบการตอบกลับความคิดเห็นสำเร็จ กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
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

    // Pass
    test('Promotion_Desktop_044: ตรวจสอบการกดปุ่ม ตอบกลับ/ซ่อน เพื่อแสดง/ซ่อนความคิดเห็นทั้งหมด', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await promotionPage.clickPromotionCard_title();
        await promotionPage.replyComment.click();
        // await expect(promotionPage.blockSenCommentReply).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await promotionPage.hideComment.click();
        // await expect(promotionPage.blockSenCommentReply).toBeHidden();
    });

    // No Run
    test('Promotion_Desktop_045: คอมเมนต์เก่ายังแสดงอยู่หลังส่งคอมเมนต์ใหม่', async ({ page }) => {
        await promotionPage.sentComment();
        await expect(promotionPage.existingComment).toBeVisible();
    });

    // No Run
    test('Promotion_Desktop_046: คอมเมนต์ยังคงอยู่หลัง reload หน้า', async ({ page }) => {
        await page
        await expect(promotionPage.blockComment.getByText('test comment')).toBeVisible();
    });

});