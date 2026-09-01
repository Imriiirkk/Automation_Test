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
    await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);

    // ปิด popup ก่อน
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Promotion Page (Mobile)', () => {

    /// ---------- Promotion (Main) ----------
    // ผ่าน
    test('Promotion_Mobile_001: ตรวจสอบการกดเข้าหน้า "โปรโมชัน" ได้', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await page.waitForURL(/\/promotion/, { timeout: 10000 });
        await expect(promotionPage.promotion_heading).toBeVisible();
    });

    //ผ่าน
    test('Promotion_Mobile_002: ตรวจสอบการแสดงรายละเอียดหน้า "โปรโมชัน"', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        // await page.waitForURL(/\/promotion/, { timeout: 10000 });
        await expect(promotionPage.highlightedBanner).toBeVisible();
        await expect(promotionPage.blockMenuCategories).toBeVisible();
        await expect(promotionPage.promotionCard.first()).toBeVisible();
        await expect(promotionPage.loadMoreButton).toBeVisible();
    });

    // ผ่าน
    test('Promotion_Mobile_003: ตรวจสอบการแสดงรายละเอียดบน การ์ดโปรโมชัน', async ({ page }) => {
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
    test('Promotion_Mobile_004: ตรวจสอบการแสดงโปรโมชันที่ยังไม่หมดอายุบน Banner', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await expect(promotionPage.highlightedBanner).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_005: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await expect(promotionPage.bannerPagination).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_006: ตรวจสอบการนำทางไปหน้า "รายละเอียดโปรโมชัน" เมื่อกด Banner', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.highlightedBanner.click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/); // ตรวจสอบว่า URL มีรูปแบบ /p/ ตามด้วยชื่อโปรโมชัน
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
    });

    const filterCases = [
        { id: 'Promotion_Mobile_Menu_007', filterName: 'oneGetone', label: '1 แถม 1', urlPattern: /buy1-get1-free/ },
        { id: 'Promotion_Mobile_Menu_008', filterName: 'percentUp', label: '50% up', urlPattern: /sale-50p-up/ },
        { id: 'Promotion_Mobile_Menu_009', filterName: 'proMobile', label: 'โปรมือถือ', urlPattern: /mobile-phone/ },
        { id: 'Promotion_Mobile_Menu_010', filterName: 'foodie', label: 'อาหาร', urlPattern: /food/ },
        { id: 'Promotion_Mobile_Menu_011', filterName: 'cheapTicket', label: 'ตั๋วถูก', urlPattern: /ticket/ },
        { id: 'Promotion_Mobile_Menu_012', filterName: 'discountCode', label: 'โค้ดส่วนลด', urlPattern: /discount/ },
    ];

    // Pass
    for (const { id, filterName, label, urlPattern } of filterCases) {
        test(`${id}: กด Filter โปรโมชัน "${label}" ได้`, async ({ page }) => {
            // await navbar.dismissAppBannerIfPresent();
            // await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            // await page.waitForURL(/\/promotion/, { timeout: 10000 });
            await promotionPage.clickFilter(filterName);
            await expect(page).toHaveURL(urlPattern);
            const cardCount = await promotionPage.promotionCardEach.count()
            await expect(promotionPage.promotionCard).toBeVisible();
            expect(cardCount).toBeGreaterThan(0);
            expect(cardCount).toBeLessThanOrEqual(12);
        });
    }

    // ---------- Promotion Card ----------
    // Pass
    test('Promotion_Mobile_013: กดรูปภาพบนการ์ด "โปรโมชัน" เพื่อเข้าดูรายละเอียดได้', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_image();
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
    });

    // Pass
    test('Promotion_Mobile_014: กดชื่อโปรโมชันบนการ์ด "โปรโมชัน" เพื่อเข้าดูรายละเอียดได้', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await expect(promotionPage.breadcrumb).toBeVisible();
        await expect(promotionPage.blockContent).toBeVisible();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
    });

    // No Run
    test('Promotion_Mobile_015: ตรวจสอบการแสดงข้อความ "ยังไม่มีกำหนดสิ้นสุด" เมื่อโปรโมชันไม่กำหนดวันสิ้นสุด', async ({ page }) => {
    });

    test('Promotion_Mobile_016: ตรวจสอบการแสดงข้อความ "สิ้นสุดโปรใน x วัน" เมื่อโปรโมชันนั้นยังอยู่ในช่วงของโปรโมชันอยู่', async ({ page }) => {
    });

    test('Promotion_Mobile_017: ตรวจสอบการแสดงข้อความ "หมดอายุ" เมื่อโปรโมชันสิ้นสุดแล้ว', async ({ page }) => {
    });

    test('Promotion_Mobile_018: ตรวจสอบการแสดง วันที่เริ่มต้น และ สิ้นสุด เมื่อโปรโมชันมีการกำหนดวันที่', async ({ page }) => {
    });

    // ---------- Love Button ----------
    // Pass
    test('Promotion_Mobile_019: แสดง Popup Login เมื่อกด "Love Button" ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickLoveButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Promotion_Mobile_020: ตรวจสอบการกด "Love Button" เข้าสู่ระบบแล้ว', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickLoveButton();
        await expect(promotionPage.loveButtonIcon).toHaveCSS('fill', 'rgb(191, 32, 47)');
    });

    // Fail
    test('Promotion_Mobile_021: กด "Love Button" อีกครั้งเพื่อกลับไปเป็น Default', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickLoveButton();
        await expect(promotionPage.loveButtonIcon).toHaveCSS('fill', 'rgb(151, 151, 151)');
    });

    // ---------- ปุ่ม ดูเพิ่มเติม ----------
    // Pass
    test('Promotion_Mobile_022: ตรวจสอบการโหลดการ์ดเพิ่มเมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
        // await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        const cardBefore = await promotionPage.promotionCard.count()
        await promotionPage.clickLoadMore();
        const cardAfter = await promotionPage.promotionCard.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
        await expect(promotionPage.loadMoreButton).toBeHidden();
    });

    // Pass
    test('Promotion_Mobile_023: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
        await promotionPage.clickLoadMore();
        await expect(promotionPage.loadMoreButton).toBeHidden();
    });

    // ---------- ปุ่ม ^ ---------- 
    // Pass
    test('Promotion_Mobile_024: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        // await expect(navbar.scrollToTopButton).toBeHidden();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Promotion_Mobile_025: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();
        await page.waitForTimeout(3000);
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBe(0);
    });

    // No Run
    test('Promotion_Mobile_026: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีโปรโมชัน', async ({ page }) => {

    });

    // ---------- Promotion Detail ----------
    // Not complete
    test('Promotion_Mobile_027: ตรวจสอบการแสดงรายละเอียดบน รายละเอียดโปรโมชัน', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        const tagCount = await promotionPage.tagItem.count();
        await expect(promotionPage.author_name).toBeVisible();
        await expect(promotionPage.blockRemainingTime).toBeVisible();
        await expect(promotionPage.blockDate).toBeVisible();
        await expect(promotionPage.blockView).toBeVisible();
        // await expect(promotionPage.shareButton_top).toBeVisible();   //ทำไมหาไม่เจอ
        // await expect(promotionPage.bookMarkButton).toBeVisible();    //ทำไมหาไม่เจอ
        await expect(promotionPage.coverImage).toBeVisible();
        await expect(promotionPage.textContent).toBeVisible();
        await expect(promotionPage.blockauthor_footer).toBeVisible();
        // await expect(promotionPage.blockTag).toBeVisible(); //ไม่ผ่าน => มันจะมีบางคนที่ใส่ tag บางคนไม่ใส่ tag เลยทำให้ไม่ผ่าน
        await expect(promotionPage.blockSentComment).toBeVisible();
        // await expect(promotionPage.blockComment).toBeVisible();
        if (tagCount > 0) {
            await expect(promotionPage.tagItem).toBeVisible();
        } else {
            await expect(promotionPage.blockTag).toBeHidden();
        }
    });

    // Not Complete มันไม่นับอ่ะ
    test('Promotion_Mobile_028: ตรวจสอบการนำทาง เมื่อกด Tag บนหน้ารายละเอียดโปรโมชัน (ถ้ามี)', async ({ page }) => {
        await promotionPage.clickPromotionCard_title_child();
        const tagBlock = await promotionPage.blockTag.locator('.Tags__TagItem-sc-89fc6391-0').count();
        // const count = await tagBlock.count();
        console.log('จำนวน element ที่เจอ:', tagBlock);
        // const tagCount = await promotionPage.tagItem.count();
        if (tagBlock > 0) {
            await promotionPage.tagItem.first().click();
            await expect(page).toHaveURL(/\/tag\/.+/);
            await expect(promotionPage.multiTagCard).toBeVisible();
        } else {
            await expect(promotionPage.multiTagCard).toBeHidden();
        }
    });

    // No Run
    test.describe.serial('Love Detail Button', () => {
        test('Promotion_Mobile_029: ตรวจสอบการแสดง Popup เข้าสู่ระบบ เมื่อกดปุ่ม Like บนหน้ารายละเอียดโปรโมชัน โดยยังไม่เข้าสู่ระบบ', async ({ page }) => {

            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
            await navbar.closeLoginModal()
        });

        test('Promotion_Mobile_030: ตรวจสอบการกดไอคอน "Like" บนหน้ารายละเอียดโปรโมชัน เข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(promotionPage.loveDetailBtnIcon).toHaveCSS('fill', 'rgb(191, 32, 47)');

        });

        test('Promotion_Mobile_031: ตรวจสอบการกดไอคอน "Like" ซ้ำ บนหน้ารายละเอียดโปรโมชัน เมื่อกดไปแล้ว', async ({ page }) => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to promotion');
            await promotionPage.clickPromotionCard_title();
            await promotionPage.clickLoveDetailButton();
            await expect(promotionPage.loveDetailBtnIcon).toHaveCSS('fill', 'rgb(151, 151, 151)');

        });
    });

    // Fail
    test('Promotion_Mobile_032: ตรวจสอบการกดปุ่ม "แชร์" บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickShareTop_Button();
        await expect(promotionPage.shareOnFacebook).toBeVisible();
        await expect(promotionPage.shareOnLine).toBeVisible();
        await expect(promotionPage.shareOnX).toBeVisible();
        await expect(promotionPage.shareCopyLink).toBeVisible();
    });

    // ---------- Share Button ---------- 
    test.describe('Run test', () => {
        // No Run
        test('Promotion_Mobile_033: ตรวจสอบการแชร์ผ่าน Facebook เปิด popup ไปที่ facebook.com', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            await promotionPage.clickPromotionCard_title();
            const popup = await promotionPage.clickShareOnFacebook(page);
            await popup.waitForLoadState();
            await expect(popup).toHaveURL(/facebook\.com/);
            await popup.close();
        });

        // No Run
        test('Promotion_Mobile_034: ตรวจสอบการแชร์ผ่าน Line เปิด popup ไปที่ line.me', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            await promotionPage.clickPromotionCard_title();
            const popup = await promotionPage.clickShareOnLine(page);
            await popup.waitForLoadState();
            await expect(popup).toHaveURL(/line\.me/);
            await popup.close();
        });

        // No Run
        test('Promotion_Mobile_035: ตรวจสอบการแชร์ผ่าน X เปิด popup ไปที่ x.com', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            await promotionPage.clickPromotionCard_title();
            const popup = await promotionPage.clickShareOnX(page);
            await popup.waitForLoadState();
            await expect(popup).toHaveURL(/x\.com/);
            await popup.close();
        });

        // Not Complete and No Run
        // เอาไว้ก่อน ไม่รู้จะทำยังไงดี เพราะมันเป็นการ copy link ไปที่ clipboard ของเครื่องเราเอง
        test('Promotion_Mobile_036: ตรวจสอบการแชร์ผ่าน Copy Link', async ({ page }) => {
            await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
            await promotionPage.clickPromotionCard_title();
            const popup = await promotionPage.clickShareOnFacebook(page);
            await popup.waitForLoadState();
            await expect(popup).toHaveURL(/facebook\.com/);
            await popup.close();
        });
    });

    // ---------- Bookmark Button ----------
    // No Run
    test('Promotion_Mobile_037: ตรวจสอบการแสดง Popup Login เมื่อกด "Bookmark" ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookMarkButton();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // No Run
    test('Promotion_Mobile_038: ตรวจสอบการตรวจสอบการกด "Bookmark" เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickBookMarkButton();
        await expect(promotionPage.bookMarkButton.locator('i.fa-bookmark')).toHaveCount(0);
        await expect(promotionPage.bookMarkButton.locator('svg path')).toHaveCSS('fill', 'rgb(191, 32, 47)');
    });

    // No Run
    test('Promotion_Mobile_039: ตรวจสอบการกด "Bookmark" อีกครั้งเพื่อกลับไปเป็น Default', async ({ page }) => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.clickLoveButton();
        await expect(promotionPage.bookMarkButton.locator('i.fa-bookmark')).toBeVisible();
        await expect(promotionPage.bookMarkButton.locator('svg')).toHaveCount(0);
    });


    // ---------- Comment Section ----------
    // ----- ยังไม่ login -----
    // No Run
    test('Promotion_Mobile_040: ตรวจสอบการแสดงความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.blockSentComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // No Run
    test('Promotion_Mobile_041: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.replyComment.click();
        await promotionPage.textBoxReplyComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // ----- login แล้ว -----
    // No Run
    test('Promotion_Mobile_042: ตรวจสอบการแสดงความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        const countBefore = await promotionPage.existingComment.count();
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.sentComment();
        await expect(promotionPage.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
        await expect(promotionPage.textBoxSendComment).toHaveValue('');
        await expect(promotionPage.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        // await expect(newCommentItem.getByText('testpunpro01')).toBeVisible();
        // await expect(newCommentItem.locator('.comment-time')).toBeVisible();
    });

    // No Run
    test('Promotion_Mobile_043: ตรวจสอบการตอบกลับความคิดเห็นสำเร็จ กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        const countBefore = await promotionPage.existingComment.count();
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.sentReplyComment();
        await expect(promotionPage.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
        await expect(promotionPage.textBoxReplyComment).toHaveValue('');
        await expect(promotionPage.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        // await expect(newCommentItem.getByText('testpunpro01')).toBeVisible();
        // await expect(newCommentItem.locator('.comment-time')).toBeVisible();
    });

    // No Run
    test('Promotion_Mobile_044: ตรวจสอบการกดปุ่ม ตอบกลับ/ซ่อน เพื่อแสดง/ซ่อนความคิดเห็นทั้งหมด', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await promotionPage.clickPromotionCard_title();
        await promotionPage.replyComment.click();
        // await expect(promotionPage.blockSenCommentReply).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await promotionPage.hideComment.click();
        // await expect(promotionPage.blockSenCommentReply).toBeHidden();
    });

    // No Run
    test('Promotion_Mobile_045: คอมเมนต์เก่ายังแสดงอยู่หลังส่งคอมเมนต์ใหม่', async ({ page }) => {
        await promotionPage.sentComment();
        await expect(promotionPage.existingComment).toBeVisible();
    });

    // No Run
    test('Promotion_Mobile_046: คอมเมนต์ยังคงอยู่หลัง reload หน้า', async ({ page }) => {
        await page
        await expect(promotionPage.blockComment.getByText('test comment')).toBeVisible();
    });
});
