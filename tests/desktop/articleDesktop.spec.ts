import { test, expect } from '@playwright/test';
import { ArticlePage } from '../../pages/ArticlePage';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { CommentSection } from '../../pages/CommentSection';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

let navbar: NavbarFooter;
let commentSection: CommentSection;
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

    // Pass
    test('Article_Desktop_001: ตรวจสอบการกดเข้าหน้า "บทความ" ได้', async ({ page }) => {
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await expect(articlePage.article_heading).toBeVisible();
    });

    test.describe('RunTest', () => {
        // Pass
        test('Article_Desktop_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "บทความ"', async () => {
            await expect(articlePage.articleHightlight).toBeVisible(); // เปลี่ยน aka แล้ว
            await expect(articlePage.blockMenuCategories).toBeVisible();
            await expect(articlePage.articleCard).toBeVisible();
            await expect(articlePage.loadMoreButton).toBeVisible();
        });
    });

    //Not Complete เปลี่ยน expect แล้ว
    test('Article_Desktop_003: ตรวจสอบการคลิกที่ Indicators เพื่อเปลี่ยน banner', async () => {
        await articlePage.indicator1.click();
        await expect(articlePage.indicator1).toHaveAttribute('aria-current', 'true');
        await articlePage.indicator2.click();
        await expect(articlePage.indicator2).toHaveAttribute('aria-current', 'true');
        // TODO: เช็คว่า banner ที่ active เปลี่ยนสไลด์หรือไม่ โดยอาจจะเช็คจากข้อความหรือรูปภาพที่เปลี่ยนไป aria-label สลับกันไปมา 2 / 2 = 1 / 2
        // TODO: ยืนยันจำนวน indicator ที่มีจริง แล้วลอง click indicator ตัวถัดไป เทียบว่า banner ที่ active เปลี่ยนสไลด์
    });

    // Pass >> But not complete
    test('Article_Desktop_004: ตรวจสอบการนำทางไปหน้ารายละเอียดของบทความ เมื่อคลิก Banner', async ({ page }) => {
        await articlePage.articleHightlight.first().click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(articlePage.title_ArticleDetail).toBeVisible();
    });

    // Fail >> But not complete >> Error: element(s) not found เปลี่ยน element และ expect แล้ว
    test('Article_Desktop_005: ตรวจสอบ Tab ที่กำลัง Active แสดงผลชัดเจน', async () => {
        await articlePage.clickArticleFilter('pro_fashion');
        await expect(articlePage.activeTab).toBeVisible();
        await expect(articlePage.inactiveTab).toBeVisible();
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

        // Not Complete
        test('Article_Desktop_012: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีบทความ', async () => {
            // TODO: หาหมวดหมู่ที่ยืนยันได้ว่าไม่มีบทความจริงในระบบ ก่อนเขียน assertion ต่อ
        });
    });

    // Pass
    test('Article_Desktop_013: ตรวจสอบการโหลด การ์ดบทความเพิ่ม เมื่อคลิกปุ่ม "ดูเพิ่มเติม"', async () => {
        await navbar.goToMenu_desktop('Link to article');
        const cardBefore = await articlePage.articleCard.count()
        await articlePage.clickLoadMore();
        const cardAfter = await articlePage.articleCard.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
    });

    // Pass
    test('Article_Desktop_014: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickLoadMore();
        await expect(articlePage.loadMoreButton).toBeHidden();
    });

    // Pass
    test('Article_Desktop_015: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        // await expect(navbar.scrollToTopButton).toBeHidden();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Article_Desktop_016: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
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

        // Pass
        test('Article_Desktop_017: ตรวจสอบการแสดงข้อมูลบน การ์ดบทความ', async () => {
            await expect(articlePage.articleCard.first()).toBeVisible();
            await expect(articlePage.imgCover_ArticleCard.first()).toBeVisible();
            await expect(articlePage.title_ArticleCard.first()).toBeVisible();
            await expect(articlePage.description_ArticleCard.first()).toBeVisible();
            await expect(articlePage.datePost_ArticleCard.first()).toBeVisible();
            await expect(articlePage.profileAuthor_ArticleCard.first()).toBeVisible();
            await expect(articlePage.bookmark_ArticleCard.first()).toBeVisible();
        });

        // Pass
        test('Article_Desktop_018: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" บน การ์ดบทความ ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickBookmarkCard();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Fail >> Error: element(s) not found >> เปลี่ยน element แล้ว
        test('Article_Desktop_019: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" บน การ์ดบทความ เข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickBookmarkCard();
            await expect(articlePage.bookmarkCardIcon).toHaveAttribute('fill', '#FEBC2E');

        });

        //Fail >> Expected: have attribute == Received: attribute not present
        test('Article_Desktop_020: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" บน การ์ดบทความอีกครั้ง เข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickBookmarkCard();
            await expect(articlePage.bookmarkCardIcon.locator('i')).toHaveAttribute('.fa-bookmark:before', 'content: "\\f02e"');

        });

        // Did not run >> Fail แต่ locator เดียวกันกับ ชื่อบทความ
        test('Article_Desktop_021: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่รูปภาพ บน การ์ดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_image();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expect(articlePage.title_ArticleDetail).toBeVisible();
            await expect(articlePage.imgAuthor_ArticleDetail).toBeVisible();
            await expect(articlePage.authorName_ArticleDetail).toBeVisible();
            await expect(articlePage.postDate_ArticleDetail).toBeVisible();
            await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
            await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
            await expect(articlePage.textContent_ArticleDetail).toBeVisible();
        });

        // Pass
        test('Article_Desktop_022: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่ชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expect(articlePage.title_ArticleDetail).toBeVisible();
            await expect(articlePage.imgAuthor_ArticleDetail).toBeVisible();
            await expect(articlePage.authorName_ArticleDetail).toBeVisible();
            await expect(articlePage.postDate_ArticleDetail).toBeVisible();
            await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
            await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
            await expect(articlePage.textContent_ArticleDetail).toBeVisible();
        });

    });

    // ---------- Article Detail ----------
    test.describe('Article Detail', () => {

        // Fail >> Not Complete >> authorName_ArticleDetail มีปัญหาไม่ตรง aka
        test('Article_Desktop_023: ตรวจสอบการแสดงข้อมูลบนหน้า รายละเอียดบทความ', async () => {
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

        // ---------- Article Interest Section ----------
        test('Article_Desktop_024: ตรวจสอบการแสดง "บทความที่อาจสนใจ"', async () => {
            await articlePage.clickArticleCard_title();
            await expect(articlePage.relatedArticleBlock).toBeVisible();
        });

        test('Article_Desktop_025: ตรวจสอบการแสดงรายละเอียดบนการ์ด "บทความที่อาจสนใจ"', async () => {
            await articlePage.clickArticleCard_title();
            await expect(articlePage.relatedArticleBlock).toBeVisible();
            await expect(articlePage.img_RelatedArticle).toBeVisible();
            await expect(articlePage.title_RelatedArticle).toBeVisible();
            await expect(articlePage.author_RelatedArticle).toBeVisible();
            await expect(articlePage.publishDate_RelatedArticle).toBeVisible();
            await expect(articlePage.bookmarkBtn_RelatedArticle).toBeVisible();
            await expect(articlePage.loveBtn_RelatedArticle).toBeVisible();
            await expect(articlePage.shareBtn_RelatedArticle).toBeVisible();
        });

        test('Article_Desktop_026: ตรวจสอบการกดที่การ์ด "บทความที่อาจสนใจ" เพื่อเข้าดูหน้ารายละเอียดบทความนั้น', async () => {
            await articlePage.clickRelatedArticlieCard();
            await expect(articlePage.img_RelatedArticle).toBeVisible();
            await expect(articlePage.title_RelatedArticle).toBeVisible();
            await expect(articlePage.author_RelatedArticle).toBeVisible();
            await expect(articlePage.publishDate_RelatedArticle).toBeVisible();
            await expect(articlePage.bookmarkBtn_RelatedArticle).toBeVisible();
            await expect(articlePage.loveBtn_RelatedArticle).toBeVisible();
            await expect(articlePage.shareBtn_RelatedArticle).toBeVisible();
            //จะเช็คยังไงว่า ชื่อบทความที่กดเข้ามา ตรงกับชื่อบทความที่แสดงบนหน้ารายละเอียดบทความใหม่
        });

        test('Article_Desktop_027: ตรวจสอบการกดปุ่ม "บุ๊กมาร์ก" บนการ์ด "บทความที่อาจสนใจ" ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        test('Article_Desktop_028: ตรวจสอบการกดปุ่ม "บุ๊กมาร์ก" บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async () => {
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(articlePage.bookmarkIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
        });

        test('Article_Desktop_029: ตรวจสอบการกดปุ่ม "บุ๊กมาร์ก" อีกครั้ง บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async () => {
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(articlePage.bookmarkIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(articlePage.bookmarkIcon_RelatedArticle).toHaveAttribute('fill', '#979797');
        });

        test('Article_Desktop_030: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ด "บทความที่อาจสนใจ" ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickLoveBtnRelatedArticlie();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        test('Article_Desktop_031: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async () => {
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickLoveBtnRelatedArticlie();
            await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
        });

        test('Article_Desktop_032: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async () => {
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickLoveBtnRelatedArticlie();
            await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
            await articlePage.clickLoveBtnRelatedArticlie();
            await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#979797');
        });

        test('Article_Desktop_033: ตรวจสอบการกดปุ่ม "แชร์" บนการ์ด "บทความที่อาจสนใจ"', async () => {
            await articlePage.clickShareBtnRelatedArticlie();
            await expect(articlePage.shareOnFacebook).toBeVisible();
            await expect(articlePage.shareOnLine).toBeVisible();
            await expect(articlePage.shareOnX).toBeVisible();
            await expect(articlePage.shareCopyLink).toBeVisible();
        });

        // Fail >> Not Complete >> Error: locator.count: Unexpected token "" while parsing css selector "". Did you mean to CSS.escape it?
        test('Article_Desktop_034: ตรวจสอบการนำทางไปหน้า "Tag" เมื่อคลิกที่ Tag ด้านล่างในหน้ารายละเอียดของบทความ (ถ้ามี)', async ({ page }) => {
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

    });

    // ---------- Comment Section ----------
    // ----- ยังไม่ login -----
    test('Article_Desktop_035: ตรวจสอบการแสดงความคิดเห็น ในกรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        commentSection = new CommentSection(page);
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.blockSentComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    test('Article_Desktop_036: ตรวจสอบการตอบกลับความคิดเห็น ในกรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        commentSection = new CommentSection(page);
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.replyComment.click();
        await commentSection.textBoxReplyComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // ----- login แล้ว -----
    test('Article_Desktop_037: ตรวจสอบการแสดงความคิดเห็น ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        const countBefore = await commentSection.existingComment.count();
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to article');
        await commentSection.sentComment(articlePage.title_ArticleCard.first());
        await expect(commentSection.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
        await expect(commentSection.textBoxSendComment).toHaveValue('');
        await expect(commentSection.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        // await expect(newCommentItem.getByText('testpunpro01')).toBeVisible();
        // await expect(newCommentItem.locator('.comment-time')).toBeVisible();
    });

    test('Article_Desktop_038: ตรวจสอบการตอบกลับความคิดเห็น ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        const countBefore = await commentSection.existingComment.count();
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to article');
        await commentSection.sentReplyComment(articlePage.title_ArticleCard.first());
        await expect(commentSection.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
        await expect(commentSection.textBoxReplyComment).toHaveValue('');
        await expect(commentSection.existingComment).toHaveCount(countBefore + 1); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        // await expect(newCommentItem.getByText('testpunpro01')).toBeVisible();
        // await expect(newCommentItem.locator('.comment-time')).toBeVisible();
    });

    test('Article_Desktop_039: ตรวจสอบการส่งความคิดเห็นแบบว่างเปล่า ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_040: ตรวจสอบการแสดงความคิดเห็นตอบกลับทั้งหมด เมื่อคลิกปุ่ม "ตอบกลับ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.replyComment.click();
        await expect(commentSection.blockSentCommentReply).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
    });

    test('Article_Desktop_041: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อคลิกปุ่ม "ซ่อน"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.hideComment.click();
        await expect(commentSection.blockSentCommentReply).toBeHidden();
    });

    //     // No Run
    //     test('Article_Desktop_045: คอมเมนต์เก่ายังแสดงอยู่หลังส่งคอมเมนต์ใหม่', async ({ page }) => {
    //         await articlePage.sentComment();
    //         await expect(articlePage.existingComment).toBeVisible();
    //     });

    //     // No Run
    //     test('Article_Desktop_046: คอมเมนต์ยังคงอยู่หลัง reload หน้า', async ({ page }) => {
    //         await page
    //         await expect(articlePage.blockComment.getByText('test comment')).toBeVisible();
    //     });

    /*
    เพื่มเคสที่เกี่ยวกับ user ที่แสดงความคิดเห็น คือ 
    - user ที่ login เป็นคนเดียวกับที่แสดงความคิดเห็นหรือไม่
    - เวลา
    */

    // Fail >> Not Complete
    test('Article_Desktop_043: ตรวจสอบการคลิกปุ่ม "แชร์" บนหน้ารายละเอียดบทความ', async () => {
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

        // Fail
        test('Article_Desktop_042: ตรวจสอบการคลิกปุ่ม "บุ๊คมาร์ค" บนหน้ารายละเอียดบทความ ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickBookmarkDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Pass
        test('Article_Desktop_044: ตรวจสอบการคลิกปุ่ม "หัวใจ" บนหน้ารายละเอียดบทความ ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickLoveDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });
    });

    // Re-Check Step
    // ---------- Bookmark / Share / Love (login แล้ว) ----------
    test.describe.serial('Detail actions — Logged in', () => {

        test.beforeEach(async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickArticleCard_title();
        });

        // skip >> Fail >> Not Complete
        test('Article_Desktop_045: ตรวจสอบการคลิกปุ่ม "บุ๊คมาร์ค" บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async () => {
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toHaveCount(0);
            await expect(articlePage.bookMarkDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        });

        // skip >> Fail >> Not Complete
        test('Article_Desktop_046: ตรวจสอบการคลิกปุ่ม "หัวใจ" บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async () => {
            await articlePage.clickLoveDetail();
            await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        });

        // skip >> Fail >> Not Complete
        test('Article_Desktop_047: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" อีกครั้ง บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async () => {
            // ต่อเนื่องจาก 041 ในกลุ่ม serial — บุ๊กมาร์คถูก active ไว้แล้ว กดซ้ำเพื่อยกเลิก
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toBeVisible();
        });

        // skip >> Fail >> Not Complete
        test('Article_Desktop_048: ตรวจสอบการคลิกปุ่ม "หัวใจ" (unlike) บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async () => {
            // ต่อเนื่องจาก 036 ในกลุ่ม serial — หัวใจถูก active ไว้แล้ว กดซ้ำเพื่อยกเลิก
            await articlePage.clickLoveDetail();
            await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
            await articlePage.clickLoveDetail();
            await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#979797');
        });

    });

    // skip >> Fail >> Not Complete
    test('Article_Desktop_043: ตรวจสอบการคลิกปุ่ม "แชร์" บทความ ว่ามีการ Active หรือไม่ ในกรณีที่ผู้ใช้เข้าสู่ระบบแล้ว', async () => {
        await articlePage.clickShareDetail_Button();
        await expect(articlePage.shareOnFacebook).toBeVisible();
        await expect(articlePage.shareOnLine).toBeVisible();
        await expect(articlePage.shareOnX).toBeVisible();
        await expect(articlePage.shareCopyLink).toBeVisible();
    });

    // ---------- Share Button ---------- 
    // Pass
    test('Article_Desktop_049: ตรวจสอบการแชร์ผ่าน Facebook เปิด popup ไปที่ facebook.com', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await articlePage.clickArticleCard_title();
        const popup = await articlePage.clickShareOnFacebook(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_050: ตรวจสอบการแชร์ผ่าน Line เปิด popup ไปที่ line.me', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await articlePage.clickArticleCard_title();
        const popup = await articlePage.clickShareOnLine(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_051: ตรวจสอบการแชร์ผ่าน X เปิด popup ไปที่ x.com', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await articlePage.clickArticleCard_title();
        const popup = await articlePage.clickShareOnX(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/x\.com/);
        await popup.close();
    });

    // Not Complete and No Run
    // เอาไว้ก่อน ไม่รู้จะทำยังไงดี เพราะมันเป็นการ copy link ไปที่ clipboard ของเครื่องเราเอง
    test('Article_Desktop_052: ตรวจสอบการแชร์ผ่าน Copy Link', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to promotion');
        await articlePage.clickArticleCard_title();
        const popup = await articlePage.clickShareOnFacebook(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

});