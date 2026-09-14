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

    // Pass
    test('Article_Desktop_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "บทความ"', async () => {
        await expect(articlePage.articleHightlight).toBeVisible(); // เปลี่ยน aka แล้ว
        await expect(articlePage.blockMenuCategories).toBeVisible();
        await expect(articlePage.articleCard).toBeVisible();
        await expect(articlePage.loadMoreButton).toBeVisible();
    });

    //Pass
    test('Article_Desktop_003: ตรวจสอบการคลิกที่ Indicators เพื่อเปลี่ยน banner', async () => {
        const indicatorCount = await articlePage.indicatorEach.count();
        expect(indicatorCount).toBeGreaterThan(0);

        for (let i = 0; i < indicatorCount; i++) {
            await articlePage.indicatorEach.nth(i).click();

            await expect(articlePage.indicatorEach.nth(i)).toHaveClass(/active|selected/);
            // for (let j = 0; j < indicatorCount; j++) {
            //     if (j === i) {
            //         await expect(articlePage.articleBannerEach.nth(j)).toHaveClass(/swiper-slide swiper-slide-next swiper-slide-prev/);
            //     } else {
            //         await expect(articlePage.articleBannerEach.nth(j)).not.toHaveClass(/swiper-slide swiper-slide-active/);
            //     }
            // }
        }
    });


    // Pass >> But not complete
    test('Article_Desktop_004: ตรวจสอบการนำทางไปหน้ารายละเอียดของบทความ เมื่อคลิก Banner', async ({ page }) => {
        await articlePage.articleHightlight.first().click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(articlePage.title_ArticleDetail).toBeVisible();
        await expect(articlePage.textContent_ArticleDetail).toBeVisible();
        await expect(articlePage.comment).toBeVisible();
    });

    // 
    test('Article_Desktop_005: ตรวจสอบการนำทางไปหน้ารายละเอียดของบทความ เมื่อกด Banner', async () => {

    });

    // 
    test('Article_Desktop_006: ตรวจสอบการกด "Bookmark" ที่การ์ดบทความ บน Banner กรณียังไม่เข้าสู่ระบบ', async () => {

    });

    // 
    test('Article_Desktop_007: ตรวจสอบการกด "Bookmark" ที่การ์ดบทความ บน Banner กรณีเข้าสู่ระบบแล้ว', async () => {

    });

    // 
    test('Article_Desktop_008: ตรวจสอบการกด "Bookmark" ซ้ำที่การ์ดบทความ บน Banner กรณีเข้าสู่ระบบแล้ว', async () => {

    });

    test.describe('Categories Tap', () => {
        // ---------- Promotion Categories Tap ----------
        const filterCases = [
            { id: 'Article_Desktop_009', filterName: 'pro_fashion', label: 'โปรสายแฟ', urlPattern: /pro-fashion/ },
            { id: 'Article_Desktop_010', filterName: 'pro_eat', label: 'โปรกิน', urlPattern: /pro-eat/ },
            { id: 'Article_Desktop_011', filterName: 'pro_travel', label: 'โปรเที่ยว', urlPattern: /pro-travel/ },
            { id: 'Article_Desktop_012', filterName: 'pro_smart', label: 'โปรสมาร์ท', urlPattern: /pro-smart/ },
            { id: 'Article_Desktop_013', filterName: 'pro_update', label: 'โปรอัพเดท', urlPattern: /pro-update/ },
            { id: 'Article_Desktop_014', filterName: 'pro_talking', label: 'โปรชวนคุย', urlPattern: /pro-talking/ },
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
        test('Article_Desktop_015: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีบทความ', async () => {
            // TODO: หาหมวดหมู่ที่ยืนยันได้ว่าไม่มีบทความจริงในระบบ ก่อนเขียน assertion ต่อ
        });
    });

    // Pass
    test('Article_Desktop_016: ตรวจสอบการโหลด การ์ดบทความเพิ่ม เมื่อคลิกปุ่ม "ดูเพิ่มเติม"', async () => {
        await navbar.goToMenu_desktop('Link to article');
        const cardBefore = await articlePage.articleCard.count()
        await articlePage.clickLoadMore();
        const cardAfter = await articlePage.articleCard.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
    });

    // Pass
    test('Article_Desktop_017: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickLoadMore();
        await expect(articlePage.loadMoreButton).toBeHidden();
    });

    // Pass
    test('Article_Desktop_018: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        // await expect(navbar.scrollToTopButton).toBeHidden();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Article_Desktop_019: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
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
        test('Article_Desktop_020: ตรวจสอบการแสดงข้อมูลบน การ์ดบทความ', async () => {
            await expect(articlePage.articleCard.first()).toBeVisible();
            await expect(articlePage.imgCover_ArticleCard.first()).toBeVisible();
            await expect(articlePage.title_ArticleCard.first()).toBeVisible();
            await expect(articlePage.description_ArticleCard.first()).toBeVisible();
            await expect(articlePage.datePost_ArticleCard.first()).toBeVisible();
            await expect(articlePage.profileAuthor_ArticleCard.first()).toBeVisible();
            await expect(articlePage.bookmark_ArticleCard.first()).toBeVisible();
        });

        // Pass
        test('Article_Desktop_021: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดบทความ กรณียังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickBookmarkCard();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Pass
        test('Article_Desktop_022: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickBookmarkCard();
            await expect(articlePage.bookmarkCardIcon.first()).toHaveAttribute('fill', '#FEBC2E');

        });

        //Fail >> Expected: have attribute == Received: attribute not present 
        test('Article_Desktop_023: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดบทความอีกครั้ง กรณีเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickBookmarkCard();
            await expect(articlePage.bookmarkCardIcon.first()).toHaveAttribute('fill', '#FEBC2E');
            await articlePage.clickBookmarkCard();
            await expect(articlePage.bookmark_ArticleCard.first().locator('.FixSizeArticleCard__IconBookmark-sc-a3159c29-6')).toHaveClass(/.fa-bookmark:before/);
        });


        // Fail แต่ locator เดียวกันกับ ชื่อบทความ
        test('Article_Desktop_024: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่รูปภาพ บน การ์ดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_image();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expect(articlePage.title_ArticleDetail).toBeVisible();
            await expect(articlePage.imgAuthor_ArticleDetail).toBeVisible();
            await expect(articlePage.authorName_ArticleDetail).toBeVisible(); // locator ไม่ถูก
            await expect(articlePage.postDate_ArticleDetail).toBeVisible();
            await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
            await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
            await expect(articlePage.textContent_ArticleDetail).toBeVisible();
        });


        // Pass
        test('Article_Desktop_025: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่ชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
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
        test('Article_Desktop_026: ตรวจสอบการแสดงข้อมูลบนหน้า รายละเอียดบทความ', async () => {
            await articlePage.clickArticleCard_title();
            await expect(articlePage.title_ArticleDetail).toBeVisible();
            await expect(articlePage.imgAuthor_ArticleDetail).toBeVisible();
            await expect(articlePage.authorName_ArticleDetail).toBeVisible(); //locator ไม่ถูก
            await expect(articlePage.postDate_ArticleDetail).toBeVisible();
            await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
            await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
            await expect(articlePage.textContent_ArticleDetail).toBeVisible();
            await expect(articlePage.shareDetail_btn).toBeVisible();
            await expect(articlePage.bookMarkDetail_btn).toBeVisible();
            await expect(articlePage.loveDetail_btn).toBeVisible();
        });

        // ---------- Article Interest Section ----------

        // Pass
        test('Article_Desktop_027: ตรวจสอบการแสดง "บทความที่อาจสนใจ"', async () => {
            await articlePage.title_ArticleCard.nth(3).click();
            await expect(articlePage.relatedArticleBlock).toBeVisible();
        });

        // Pass
        test('Article_Desktop_028: ตรวจสอบการแสดงรายละเอียดบนการ์ด "บทความที่อาจสนใจ"', async ({ page }) => {
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await expect(articlePage.relatedArticleBlock).toBeVisible(); //ทำไมเป็น hidden
            await expect(articlePage.img_RelatedArticle).toBeVisible();
            await expect(articlePage.title_RelatedArticle).toBeVisible();
            await expect(articlePage.author_RelatedArticle).toBeVisible();
            await expect(articlePage.publishDate_RelatedArticle).toBeVisible();
            await expect(articlePage.bookmarkBtn_RelatedArticle).toBeVisible();
            await expect(articlePage.loveBtn_RelatedArticle).toBeVisible();
            await expect(articlePage.shareBtn_RelatedArticle).toBeVisible();
        });

        // Pass
        test('Article_Desktop_029: ตรวจสอบการกดที่การ์ด "บทความที่อาจสนใจ" เพื่อเข้าดูหน้ารายละเอียดบทความนั้น', async ({ page }) => {
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await articlePage.clickRelatedArticlieCard();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expect(articlePage.title_ArticleDetail).toBeVisible();
            await expect(articlePage.imgAuthor_ArticleDetail).toBeVisible();
            // await expect(articlePage.authorName_ArticleDetail).toBeVisible(); // locator ไม่ถูก
            await expect(articlePage.postDate_ArticleDetail).toBeVisible();
            await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
            await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
            await expect(articlePage.textContent_ArticleDetail).toBeVisible();
            //จะเช็คยังไงว่า ชื่อบทความที่กดเข้ามา ตรงกับชื่อบทความที่แสดงบนหน้ารายละเอียดบทความใหม่
        });

        // Pass
        test('Article_Desktop_030: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ด "บทความที่อาจสนใจ" ยังไม่เข้าสู่ระบบ', async ({ page }) => {
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Fail กด Login with email ไม่ได้ >> TimeoutError: locator.click: Timeout 10000ms exceeded.
        test('Article_Desktop_031: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(articlePage.bookmarkIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
        });

        // Fail กด Login with email ไม่ได้ >> TimeoutError: locator.click: Timeout 10000ms exceeded.
        test('Article_Desktop_032: ตรวจสอบการกดปุ่ม "Bookmark" อีกครั้ง บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(articlePage.bookmarkIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(articlePage.bookmarkIcon_RelatedArticle).toHaveAttribute('fill', '#979797');
        });

        // Pass
        test('Article_Desktop_033: ตรวจสอบการกดปุ่ม "Like" บนการ์ด "บทความที่อาจสนใจ" ยังไม่เข้าสู่ระบบ', async ({ page }) => {
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await articlePage.clickLoveBtnRelatedArticlie();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Fail กด Login with email ไม่ได้ >> TimeoutError: locator.click: Timeout 10000ms exceeded.
        test('Article_Desktop_034: ตรวจสอบการกดปุ่ม "Like" บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await articlePage.clickLoveBtnRelatedArticlie();
            await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
        });

        // Fail กด Login with email ไม่ได้ >> TimeoutError: locator.click: Timeout 10000ms exceeded.
        test('Article_Desktop_035: ตรวจสอบการกดปุ่ม "Like" อีกครั้ง บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async ({ page }) => {
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await articlePage.clickLoveBtnRelatedArticlie();
            await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
            await articlePage.clickLoveBtnRelatedArticlie();
            await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#979797');
        });

        // Pass
        test('Article_Desktop_036: ตรวจสอบการกดปุ่ม "Share" บนการ์ด "บทความที่อาจสนใจ"', async ({ page }) => {
            await articlePage.title_ArticleCard.nth(3).click();
            await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
            await articlePage.clickShareBtnRelatedArticlie();
            await expect(articlePage.shareOnFacebook).toBeVisible();
            await expect(articlePage.shareOnLine).toBeVisible();
            await expect(articlePage.shareOnX).toBeVisible();
            await expect(articlePage.shareCopyLink).toBeVisible();
        });

        test('Article_Desktop_037: ตรวจสอบการกด "Icon Facebook" เพื่อแชร์บทความที่อาจสนใจ ไปที่ facebook.com บนการ์ด "บทความที่อาจสนใจ"', async () => {
        });

        test('Article_Desktop_038: ตรวจสอบการกด "Icon Line" เพื่อแชร์บทความที่อาจสนใจ ไปที่ line.me บนการ์ด "บทความที่อาจสนใจ"', async () => {
        });

        test('Article_Desktop_039: ตรวจสอบการกด "Icon X" เพื่อแชร์บทความที่อาจสนใจ ไปที่ x.com บนการ์ด "บทความที่อาจสนใจ"', async () => {
        });

        test('Article_Desktop_040: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกลิงก์บทความที่อาจสนใจ บนการ์ด "บทความที่อาจสนใจ"', async () => {
        });

        // ---------- Share Button ---------- 
        // 
        test('Article_Desktop_041: ตรวจสอบการกดปุ่ม "Share" บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickShareDetail_Button();
            // ปุ่มแชร์ปกติไม่ต้อง login ก็เปิดเมนูได้ — เช็คว่าเมนูโชว์ครบแทน
            await expect(articlePage.shareOnFacebook).toBeVisible();
            await expect(articlePage.shareOnLine).toBeVisible();
            await expect(articlePage.shareOnX).toBeVisible();
            await expect(articlePage.shareCopyLink).toBeVisible();
        });

        test('Article_Desktop_042: ตรวจสอบการกด "Icon Facebook" เพื่อแชร์บทความนั้น ไปที่ facebook.com บนหน้ารายละเอียดบทความ (ด้านบน)', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickArticleCard_title();
            const popup = await articlePage.clickShareOnFacebook(page);
            await popup.waitForLoadState();
            await expect(popup).toHaveURL(/facebook\.com/);
            await popup.close();
        });

        // Pass
        test('Article_Desktop_043: ตรวจสอบการกด "Icon Line" เพื่อแชร์บทความนั้น ไปที่ line.me บนหน้ารายละเอียดบทความ (ด้านบน)', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickArticleCard_title();
            const popup = await articlePage.clickShareOnLine(page);
            await popup.waitForLoadState();
            await expect(popup).toHaveURL(/line\.me/);
            await popup.close();
        });

        // Pass
        test('Article_Desktop_044: ตรวจสอบการกด "Icon X" เพื่อแชร์บทความนั้น ไปที่ x.com บนหน้ารายละเอียดบทความ (ด้านบน)', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickArticleCard_title();
            const popup = await articlePage.clickShareOnX(page);
            await popup.waitForLoadState();
            await expect(popup).toHaveURL(/x\.com/);
            await popup.close();
        });

        // test.describe('RunTest', () => {
        // ยังไม่แก้ step
        test('Article_Desktop_045: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกลิงก์บทความนั้น บนหน้ารายละเอียดบทความ (ด้านบน)', async ({ page }) => {
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickArticleCard_title();
            const popup = await articlePage.clickShareOnFacebook(page);
            await popup.waitForLoadState();
            await expect(popup).toHaveURL(/facebook\.com/);
            await popup.close();
        });
        // });

        test('Article_Desktop_046: ตรวจสอบการกดปุ่ม "Share" บนหน้ารายละเอียดโปรโมชัน (ด้านล่าง)', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickShareDetail_Button();
            // ปุ่มแชร์ปกติไม่ต้อง login ก็เปิดเมนูได้ — เช็คว่าเมนูโชว์ครบแทน
            await expect(articlePage.shareOnFacebook).toBeVisible();
            await expect(articlePage.shareOnLine).toBeVisible();
            await expect(articlePage.shareOnX).toBeVisible();
            await expect(articlePage.shareCopyLink).toBeVisible();
        });

        test('Article_Desktop_047: ตรวจสอบการกด  "Icon Facebook" เพื่อแชร์บทความนั้น ไปที่ facebook.com บนหน้ารายละเอียดโปรโมชัน (ด้านล่าง)', async () => {
        });

        test('Article_Desktop_048: ตรวจสอบการกด "Icon Line" เพื่อแชร์บทความนั้น ไปที่ line.me บนหน้ารายละเอียดโปรโมชัน (ด้านล่าง)', async () => {
        });

        test('Article_Desktop_049: ตรวจสอบการกด "Icon X" เพื่อแชร์บทความนั้น ไปที่ x.com บนหน้ารายละเอียดโปรโมชัน (ด้านล่าง)', async () => {
        });

        test('Article_Desktop_050: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกลิงก์บทความนั้น บนหน้ารายละเอียดบทความ (ด้านล่าง)', async () => {
        });

    });

    // Pass
    test('Article_Desktop_051: ตรวจสอบการนำทางไปหน้า "Tag" เมื่อคลิกที่ Tag ด้านล่างในหน้ารายละเอียดของบทความ (ถ้ามี)', async ({ page }) => {
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

    // ---------- Comment Section ----------
    // ----- ยังไม่ login -----
    test('Article_Desktop_052: ตรวจสอบการแสดงความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        commentSection = new CommentSection(page);
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.blockSentComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    test('Article_Desktop_053: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        commentSection = new CommentSection(page);
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.replyComment.click();
        await commentSection.textBoxReplyComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // ----- login แล้ว -----
    test('Article_Desktop_054: ตรวจสอบการแสดงความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
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

    test('Article_Desktop_055: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
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

    test('Article_Desktop_056: ตรวจสอบการส่งความคิดเห็นแบบว่างเปล่า กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_057: ตรวจสอบการแสดงโปรไฟล์ของผู้ใช้ที่แสดงความคิดเห็นได้ถูกต้อง', async ({ page }) => {
    });

    test('Article_Desktop_058: ตรวจสอบการแสดงเวลาในการแสดงความคิดเห็นได้ถูกต้อง', async ({ page }) => {
    });

    test('Article_Desktop_059: ตรวจสอบความคิดเห็นยังคงอยู่หลัง reload หน้า', async ({ page }) => {
    });

    test('Article_Desktop_060: ตรวจสอบการแสดงความคิดเห็นตอบกลับทั้งหมด เมื่อคลิกปุ่ม "ตอบกลับ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.replyComment.click();
        await expect(commentSection.blockSentCommentReply).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
    });

    test('Article_Desktop_061: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อคลิกปุ่ม "ซ่อน"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.hideComment.click();
        await expect(commentSection.blockSentCommentReply).toBeHidden();
    });


    // ---------- Bookmark / Share / Love (ยังไม่ login) ----------
    test.describe('Detail actions — Not logged in', () => {

        // Pass
        test('Article_Desktop_062: ตรวจสอบการกด "Bookmark" บนหน้ารายละเอียดบทความ กรณียังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickBookmarkDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Pass
        test('Article_Desktop_065: ตรวจสอบการกด "Like" บนหน้ารายละเอียดบทความ กรณียังไม่เข้าสู่ระบบ', async () => {
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
        test('Article_Desktop_063: ตรวจสอบการกด "Bookmark" บนหน้ารายละเอียดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toHaveCount(0);
            await expect(articlePage.bookMarkDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        });

        // skip >> Fail >> Not Complete
        test('Article_Desktop_064: ตรวจสอบการกด "Bookmark" ซ้ำ บนหน้ารายละเอียดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
            // ต่อเนื่องจาก 041 ในกลุ่ม serial — บุ๊กมาร์คถูก active ไว้แล้ว กดซ้ำเพื่อยกเลิก
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toBeVisible();
        });

        // skip >> Fail >> Not Complete
        test('Article_Desktop_066: ตรวจสอบการกด "Like" บนหน้ารายละเอียดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
            await articlePage.clickLoveDetail();
            await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        });

        // skip >> Fail >> Not Complete
        test('Article_Desktop_067: ตรวจสอบการกด "Like" ซ้ำ บนหน้ารายละเอียดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
            // ต่อเนื่องจาก 036 ในกลุ่ม serial — หัวใจถูก active ไว้แล้ว กดซ้ำเพื่อยกเลิก
            await articlePage.clickLoveDetail();
            await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
            await articlePage.clickLoveDetail();
            await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#979797');
        });
    });

    test('Article_Desktop_068: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง บนหน้ารายละเอียดบทความ', async ({ page }) => {
    });

    test('Article_Desktop_069: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" บนหน้ารายละเอียดบทความ', async ({ page }) => {
    });

    test('Article_Desktop_070: ตรวจสอบการนำทางไปที่หน้า "นักเขียน" เมื่อกดชื่อและรูปโปไฟล์ผู้เขียน บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
    });

});