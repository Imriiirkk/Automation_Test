import { test, expect } from '@playwright/test';
import { ArticlePage } from '../../pages/ArticlePage';
import { NavbarFooter } from '../../pages/NavbarFooter';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

let navbar: NavbarFooter;
let articlePage: ArticlePage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    articlePage = new ArticlePage(page);
    await navbar.goto();
    await navbar.goToMenu_desktop('Link to article');

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Article Page (Desktop)', () => {

    test('Article_Desktop_001: ตรวจสอบการกดเข้าหน้า "บทความ" ได้', async ({ page }) => {
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await expect(articlePage.article_heading).toBeVisible();
    });

    test('Article_Desktop_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "บทความ"', async () => {
        await expect(articlePage.articleHightlight).toBeVisible();
        await expect(articlePage.blockMenuCategories).toBeVisible();
        await expect(articlePage.articleCard.first()).toBeVisible();
    });

    test('Article_Desktop_003: ตรวจสอบการคลิกที่ Indicators เพื่อเปลี่ยน banner', async () => {
        await expect(articlePage.indicator.first()).toBeVisible();
        // TODO: ยืนยันจำนวน indicator ที่มีจริง แล้วลอง click indicator ตัวถัดไป เทียบว่า banner ที่ active เปลี่ยนสไลด์
    });

    test('Article_Desktop_004: ตรวจสอบการนำทางไปหน้ารายละเอียดของบทความ เมื่อคลิก Banner', async ({ page }) => {
        await articlePage.articleHightlight.first().click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(articlePage.title_ArticleDetail).toBeVisible();
    });

    test('Article_Desktop_005: ตรวจสอบ Tab ที่กำลัง Active แสดงผลชัดเจน', async () => {
        await articlePage.clickArticleFilter('pro_fashion');
        await expect(articlePage.activeTab).toBeVisible();
        await expect(articlePage.activeTab).toContainText('โปรสายแฟ');
    });

    test.describe('Categories Tap', () => {
        // ---------- Promotion Categories Tap ----------
        const filterCases = [
            { id: 'Article_Desktop_006', filterName: 'pro_fashion', label: 'โปรสายแฟ', urlPattern: /pro-fashion/ },
            { id: 'Article_Desktop_007', filterName: 'pro_eat', label: 'โปรกิน', urlPattern: /pro-eat/ },
            { id: 'Article_Desktop_008', filterName: 'pro_travel', label: 'โปรเที่ยว', urlPattern: /pro-travel/ },
            { id: 'Article_Desktop_009', filterName: 'pro_smart', label: 'โปรสมาร์ท', urlPattern: /pro-smart/ },
            { id: 'Article_Desktop_010', filterName: 'pro_update', label: 'โปรอัพเดท', urlPattern: /pro-update/ },
            { id: 'Article_Desktop_011', filterName: 'pro_talking', label: 'โปรชวนคุย', urlPattern: /pro-talking/ },
        ];

        // Pass 
        // เช็คจำนวนการ์ดตั้งต้นที่มี 12 การ์ดก่อนกด "ดูเพิ่มเติม"
        for (const { id, filterName, label, urlPattern } of filterCases) {
            test(`${id}: กด Filter บทความ "${label}" ได้`, async ({ page }) => {
                await navbar.goToMenu_desktop('Link to article');
                await articlePage.clickArticleFilter(filterName);
                await expect(page).toHaveURL(urlPattern);
                const cardCount = await articlePage.articleCardEach.count()
                await expect(articlePage.articleCard).toBeVisible();
                expect(cardCount).toBeGreaterThan(0);
                expect(cardCount).toBeLessThanOrEqual(12);
                // data-active attribute ของ filter ที่ถูกเลือกจะเป็น true
            });
        }

        test('Article_Desktop_012: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีบทความ', async () => {
            // TODO: หาหมวดหมู่ที่ยืนยันได้ว่าไม่มีบทความจริงในระบบ ก่อนเขียน assertion ต่อ
        });
    });

    test('Article_Desktop_013: ตรวจสอบการโหลด การ์ดบทความเพิ่ม เมื่อคลิกปุ่ม "ดูเพิ่มเติม"', async () => {
        await navbar.goToMenu_desktop('Link to article');
        const cardBefore = await articlePage.articleCard.count()
        await articlePage.clickLoadMore();
        const cardAfter = await articlePage.articleCard.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
    });

    test('Promotion_Desktop_023: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await articlePage.clickLoadMore();
        await expect(articlePage.loadMoreButton).toBeHidden();
    });

    test('Article_Desktop_014: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        // await expect(navbar.scrollToTopButton).toBeHidden();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    //
    test('Article_Desktop_015: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
        await navbar.scrollToTopButton.click();
        await page.waitForTimeout(3000);
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBe(0);
    });

    // ---------- Article Card ----------
    test.describe('Article Card', () => {

        test('Article_Desktop_016: ตรวจสอบการแสดงข้อมูลบน การ์ดบทความ', async () => {
            await expect(articlePage.articleCard.first()).toBeVisible();
            await expect(articlePage.imgCover_ArticleCard.first()).toBeVisible();
            await expect(articlePage.title_ArticleCard.first()).toBeVisible();
            await expect(articlePage.description_ArticleCard.first()).toBeVisible();
            await expect(articlePage.datePost_ArticleCard.first()).toBeVisible();
            await expect(articlePage.profileAuthor_ArticleCard.first()).toBeVisible();
            await expect(articlePage.bookmark_ArticleCard.first()).toBeVisible();
        });

        test('Article_Desktop_017: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" บน การ์ดบทความ ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickBookmarkCard();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        test('Article_Desktop_018: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" บน การ์ดบทความ เข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickBookmarkCard();
            await expect(articlePage.bookmark_ArticleCard.locator('svg path')).toHaveAttribute('fill', '#FEBC2E');

        });

        test('Article_Desktop_019: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" บน การ์ดบทความอีกครั้ง เข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickBookmarkCard();
            await expect(articlePage.bookmark_ArticleCard.locator('i')).toHaveAttribute('::before');

        });

        test('Article_Desktop_020: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่รูปภาพ บน การ์ดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_image();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expect(articlePage.title_ArticleDetail).toBeVisible();
        });

        test('Article_Desktop_021: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่ชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expect(articlePage.title_ArticleDetail).toBeVisible();
        });

    });

    // ---------- Article Detail ----------
    test.describe('Article Detail', () => {

        test('Article_Desktop_022: ตรวจสอบการแสดงข้อมูลบนหน้า รายละเอียดขทความ', async () => {
            await articlePage.clickArticleCard_title();
            await expect(articlePage.title_ArticleDetail).toBeVisible();
            await expect(articlePage.imgAuthor_ArticleDetail).toBeVisible();
            await expect(articlePage.authorName_ArticleDetail).toBeVisible();
            await expect(articlePage.postDate_ArticleDetail).toBeVisible();
            await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
            await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
            await expect(articlePage.textContent_ArticleDetail).toBeVisible();
            await expect(articlePage.shareDetail_btn).toBeVisible();
            await expect(articlePage.bookMarkDetail_btn).toBeVisible();
            await expect(articlePage.loveDetail_btn).toBeVisible();
        });


        // test('Article_Desktop_023: ตรวจสอบการแสดง "บทความที่อาจสนใจ"', async () => {
        //     await articlePage.clickArticleCard_title();
        //     await expect(articlePage.relatedArticleBlock).toBeVisible();
        // });

        // Case 24-28: เป็นบทความที่อาจสนใจ

        test('Article_Desktop_029: ตรวจสอบการนำทางไปหน้า "Tag" เมื่อคลิกที่ Tag ด้านล่างในหน้ารายละเอียดของบทความ (ถ้ามี)', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            const tagCount = await articlePage.tagItem.count();
            console.log(`จำนวน Tag ที่พบ: ${tagCount}`);
            if (tagCount > 0) {
                await articlePage.clickTag();
                await expect(page).toHaveURL(/\/tag\/.+/);
                await expect(articlePage.multiTagCard).toBeVisible();
            } else {
                await expect(articlePage.multiTagCard).toBeHidden();
            }
        });

        // test('Article_Desktop_025: ตรวจสอบการนำทาง เมื่อกด Tag บนหน้ารายละเอียดโปรโมชัน (ถ้ามี)', async ({ page }) => {
        // });

    });

    test('Article_Desktop_030: ตรวจสอบการแสดงความคิดเห็น ในกรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    });

    test('Article_Desktop_031: ตรวจสอบการตอบกลับความคิดเห็น ในกรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    });

    test('Article_Desktop_032: ตรวจสอบการแสดงความคิดเห็น ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_033: ตรวจสอบการตอบกลับความคิดเห็น ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_034: ตรวจสอบการส่งความคิดเห็นแบบว่างเปล่า ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_035: ตรวจสอบการแสดงความคิดเห็นตอบกลับทั้งหมด เมื่อคลิกปุ่ม "ตอบกลับ"', async ({ page }) => {
    });

    test('Article_Desktop_036: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อคลิกปุ่ม "ซ่อน"', async ({ page }) => {
    });

    // // ---------- Comment Section ----------
    //     // ----- ยังไม่ login -----
    //     // Pass
    //     test('Promotion_Desktop_040: ตรวจสอบการแสดงความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    //         await navbar.goToMenu_desktop('Link to promotion');
    //         await promotionPage.clickPromotionCard_title();
    //         await promotionPage.blockSentComment.click();
    //         await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
    //         await navbar.closeLoginModal()
    //     });

    //     // Pass
    //     test('Promotion_Desktop_041: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    //         await navbar.goToMenu_desktop('Link to promotion');
    //         await promotionPage.clickPromotionCard_title();
    //         await promotionPage.replyComment.click();
    //         await promotionPage.textBoxReplyComment.click();
    //         await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
    //         await navbar.closeLoginModal()
    //     });

    //     // ----- login แล้ว -----
    //     // Pass
    //     test('Promotion_Desktop_042: ตรวจสอบการแสดงความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    //         const countBefore = await promotionPage.existingComment.count();
    //         await navbar.openLoginOrSignup_desktop();
    //         await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
    //         await navbar.goToMenu_desktop('Link to promotion');
    //         await promotionPage.sentComment();
    //         await expect(promotionPage.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
    //         await expect(promotionPage.textBoxSendComment).toHaveValue('');
    //         await expect(promotionPage.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
    //         // await expect(newCommentItem.getByText('testpunpro01')).toBeVisible();
    //         // await expect(newCommentItem.locator('.comment-time')).toBeVisible();
    //     });

    //     // Fail
    //     test('Promotion_Desktop_043: ตรวจสอบการตอบกลับความคิดเห็นสำเร็จ กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    //         const countBefore = await promotionPage.existingComment.count();
    //         await navbar.openLoginOrSignup_desktop();
    //         await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
    //         await navbar.goToMenu_desktop('Link to promotion');
    //         await promotionPage.sentReplyComment();
    //         await expect(promotionPage.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
    //         await expect(promotionPage.textBoxReplyComment).toHaveValue('');
    //         await expect(promotionPage.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
    //         // await expect(newCommentItem.getByText('testpunpro01')).toBeVisible();
    //         // await expect(newCommentItem.locator('.comment-time')).toBeVisible();
    //     });

    //     // Pass
    //     test('Promotion_Desktop_044: ตรวจสอบการกดปุ่ม ตอบกลับ/ซ่อน เพื่อแสดง/ซ่อนความคิดเห็นทั้งหมด', async ({ page }) => {
    //         await navbar.goToMenu_desktop('Link to promotion');
    //         await promotionPage.clickPromotionCard_title();
    //         await promotionPage.replyComment.click();
    //         // await expect(promotionPage.blockSenCommentReply).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
    //         await promotionPage.hideComment.click();
    //         // await expect(promotionPage.blockSenCommentReply).toBeHidden();
    //     });

    //     // No Run
    //     test('Promotion_Desktop_045: คอมเมนต์เก่ายังแสดงอยู่หลังส่งคอมเมนต์ใหม่', async ({ page }) => {
    //         await promotionPage.sentComment();
    //         await expect(promotionPage.existingComment).toBeVisible();
    //     });

    //     // No Run
    //     test('Promotion_Desktop_046: คอมเมนต์ยังคงอยู่หลัง reload หน้า', async ({ page }) => {
    //         await page
    //         await expect(promotionPage.blockComment.getByText('test comment')).toBeVisible();
    //     });

    /*
    เพื่มเคสที่เกี่ยวกับ user ที่แสดงความคิดเห็น คือ 
    - user ที่ login เป็นคนเดียวกับที่แสดงความคิดเห็นหรือไม่
    - เวลา
    */


    test('Article_Desktop_033: ตรวจสอบการคลิกปุ่ม "แชร์" บนหน้ารายละเอียดบทความ', async () => {
        await articlePage.clickArticleCard_title();
        await articlePage.clickShareDetail_Button();
        // ปุ่มแชร์ปกติไม่ต้อง login ก็เปิดเมนูได้ — เช็คว่าเมนูโชว์ครบแทน
        await expect(articlePage.shareOnFacebook).toBeVisible();
        await expect(articlePage.shareOnLine).toBeVisible();
        await expect(articlePage.shareOnX).toBeVisible();
        await expect(articlePage.shareCopyLink).toBeVisible();
    });

    // ---------- Bookmark / Share / Love (ยังไม่ login) ----------
    test.describe('Detail actions — Not logged in', () => {

        test('Article_Desktop_032: ตรวจสอบการคลิกปุ่ม "บุ๊คมาร์ค" บนหน้ารายละเอียดบทความ ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickBookmarkDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        test('Article_Desktop_034: ตรวจสอบการคลิกปุ่ม "หัวใจ" บนหน้ารายละเอียดบทความ ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickLoveDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });
    });

    // Re-Check Step
    // ---------- Bookmark / Share / Love (login แล้ว) ----------
    test.describe.serial('Detail actions — Logged in', () => {

        // รีเซ็ต state ครั้งเดียวก่อนเริ่มกลุ่มนี้ กันเคสค้างจากรอบทดสอบก่อนหน้า
        test.beforeAll(async ({ browser }) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            const setupNavbar = new NavbarFooter(page);
            const setupArticlePage = new ArticlePage(page);

            await setupNavbar.goto();
            await setupNavbar.openLoginOrSignup_desktop();
            await setupNavbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await setupNavbar.goToMenu_desktop('Link to article');
            await setupArticlePage.clickArticleCard_title();

            const bookmarkActive = await setupArticlePage.bookMarkDetail_btn.evaluate(
                (el) => el.tagName.toLowerCase() === 'svg'
            );
            if (bookmarkActive) {
                await setupArticlePage.clickBookmarkDetail();
            }

            const loveFill = await setupArticlePage.bookMarkDetail_btn.evaluate(
                (el) => window.getComputedStyle(el).fill
            );
            if (loveFill === 'rgb(191, 32, 47)') {
                await setupArticlePage.clickLoveDetail();
            }

            await context.close();
        });

        test.beforeEach(async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickArticleCard_title();
        });

        test('Article_Desktop_035: ตรวจสอบการคลิกปุ่ม "บุ๊คมาร์ค" บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async () => {
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toHaveCount(0);
            await expect(articlePage.bookMarkDetail_btn.locator('svg path')).toHaveAttribute('fill', 'rgb(191, 32, 47)');
        });

        test('Article_Desktop_038: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" อีกครั้ง บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async () => {
            // ต่อเนื่องจาก 034 ในกลุ่ม serial — บุ๊กมาร์คถูก active ไว้แล้ว กดซ้ำเพื่อยกเลิก
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('svg')).toHaveCount(0);
            await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toBeVisible();
        });

        // test('Article_Desktop_036: ตรวจสอบการคลิกปุ่ม "แชร์" บทความ ว่ามีการ Active หรือไม่ ในกรณีที่ผู้ใช้เข้าสู่ระบบแล้ว', async () => {
        //     await articlePage.clickShareDetail_Button();
        //     await expect(articlePage.shareOnFacebook).toBeVisible();
        //     await expect(articlePage.shareOnLine).toBeVisible();
        //     await expect(articlePage.shareOnX).toBeVisible();
        //     await expect(articlePage.shareCopyLink).toBeVisible();
        // });

        test('Article_Desktop_037: ตรวจสอบการคลิกปุ่ม "หัวใจ" บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async () => {
            await articlePage.clickLoveDetail();
            await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', 'rgb(191, 32, 47)');
        });

        test('Article_Desktop_039: ตรวจสอบการคลิกปุ่ม "หัวใจ" (unlike) บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async () => {
            // ต่อเนื่องจาก 036 ในกลุ่ม serial — หัวใจถูก active ไว้แล้ว กดซ้ำเพื่อยกเลิก
            await articlePage.clickLoveDetail();
            await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', 'rgb(151, 151, 151)');
        });

    });

});