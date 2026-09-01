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
    await navbar.goToMenu_mobile(navbar.articleMenu_mobile);

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Article Page (Mobile)', () => {

    test('Article_Desktop_001: ตรวจสอบการกดเข้าหน้า "บทความ" ได้', async ({ page }) => {
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await expect(articlePage.article_heading).toBeVisible();
    });

    test('Article_Desktop_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "บทความ"', async () => {
        await expect(articlePage.articleHightlight).toBeVisible();
        await expect(articlePage.blockMenuCategories).toBeVisible();
        await expect(articlePage.articleCard.first()).toBeVisible();
    });

    test('Article_Desktop_003: ตรวจสอบการเปลี่ยน banner "บทความ" เมื่อทำการเลื่อน banner หรือคลิกที่ Indicators', async () => {
        await expect(articlePage.indicator.first()).toBeVisible();
        // TODO: ยืนยันจำนวน indicator ที่มีจริง แล้วลอง click indicator ตัวถัดไป เทียบว่า banner ที่ active เปลี่ยนสไลด์
    });

    test('Article_Desktop_004: ตรวจสอบการนำทางไปหน้ารายละเอียดของบทความ เมื่อคลิก Banner', async ({ page }) => {
        await articlePage.articleHightlight.first().click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(articlePage.title_ArticleDetail).toBeVisible();
    });

    test('Article_Desktop_006: ตรวจสอบ Tab ที่กำลัง Active แสดงผลชัดเจน', async () => {
        await articlePage.clickArticleFilter('pro_fashion');
        await expect(articlePage.activeTab).toBeVisible();
        await expect(articlePage.activeTab).toContainText('โปรสายแฟ');
    });

    test.describe('Categories Tap', () => {
        // ---------- Promotion Categories Tap ----------
        const filterCases = [
            { id: 'Article_Desktop_007', filterName: 'pro_fashion', label: 'โปรสายแฟ', urlPattern: /pro-fashion/ },
            { id: 'Article_Desktop_008', filterName: 'pro_eat', label: 'โปรกิน', urlPattern: /pro-eat/ },
            { id: 'Article_Desktop_009', filterName: 'pro_travel', label: 'โปรเที่ยว', urlPattern: /pro-travel/ },
            { id: 'Article_Desktop_010', filterName: 'pro_smart', label: 'โปรสมาร์ท', urlPattern: /pro-smart/ },
            { id: 'Article_Desktop_011', filterName: 'pro_update', label: 'โปรอัพเดท', urlPattern: /pro-update/ },
            { id: 'Article_Desktop_012', filterName: 'pro_talking', label: 'โปรชวนคุย', urlPattern: /pro-talking/ },
        ];

        // Pass 
        // เช็คจำนวนการ์ดตั้งต้นที่มี 12 การ์ดก่อนกด "ดูเพิ่มเติม"
        for (const { id, filterName, label, urlPattern } of filterCases) {
            test(`${id}: กด Filter บทความ "${label}" ได้`, async ({ page }) => {
                await navbar.goToMenu_mobile(navbar.articleMenu_mobile);
                await articlePage.clickArticleFilter(filterName);
                await expect(page).toHaveURL(urlPattern);
                const cardCount = await articlePage.articleCardEach.count()
                await expect(articlePage.articleCard).toBeVisible();
                expect(cardCount).toBeGreaterThan(0);
                expect(cardCount).toBeLessThanOrEqual(12);
                // data-active attribute ของ filter ที่ถูกเลือกจะเป็น true
            });
        }

        test('Article_Desktop_013: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีบทความ', async () => {
            // TODO: หาหมวดหมู่ที่ยืนยันได้ว่าไม่มีบทความจริงในระบบ ก่อนเขียน assertion ต่อ
        });
    });

    test('Article_Desktop_014: ตรวจสอบการโหลด การ์ดบทความ และแสดง การ์ดเพิ่ม เมื่อคลิกปุ่ม "ดูเพิ่มเติม"', async () => {
        // TODO: หาหมวดหมู่ที่ยืนยันได้ว่าไม่มีบทความจริงในระบบ ก่อนเขียน assertion ต่อ
    });

    test('Article_Desktop_015: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async () => {
        // TODO: หาหมวดหมู่ที่ยืนยันได้ว่าไม่มีบทความจริงในระบบ ก่อนเขียน assertion ต่อ
    });

    test('Article_Desktop_016: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อคลิกปุ่ม "^"', async () => {
        // TODO: หาหมวดหมู่ที่ยืนยันได้ว่าไม่มีบทความจริงในระบบ ก่อนเขียน assertion ต่อ
    });

    // ---------- Article Card ----------
    test.describe('Article Card', () => {

        test('Article_Desktop_017: ตรวจสอบการแสดงข้อมูลบน การ์ดบทความ', async () => {
            await expect(articlePage.articleCard.first()).toBeVisible();
            await expect(articlePage.imgCover_ArticleCard.first()).toBeVisible();
            await expect(articlePage.title_ArticleCard.first()).toBeVisible();
            await expect(articlePage.description_ArticleCard.first()).toBeVisible();
            await expect(articlePage.datePost_ArticleCard.first()).toBeVisible();
            await expect(articlePage.profileAuthor_ArticleCard.first()).toBeVisible();
        });

        test('Article_Desktop_018: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" บน การ์ดบทความ', async () => {
            await articlePage.clickBookmarkCard();
            // ยังไม่ login: ควรเด้ง popup login แทนการบุ๊กมาร์คจริง
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        test('Article_Desktop_019: ตรวจสอบการคลิกปุ่ม "บุ๊กมาร์ค" อีกครั้งหลังจาก คลิกไปแล้วบน การ์ดบทความ', async () => {
            // เคสนี้ต่อเนื่องจาก 018 (ยังไม่ login) — พฤติกรรมควรเหมือนเดิมคือเด้ง popup login ซ้ำ
            await articlePage.clickBookmarkCard();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
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

        // ใน staging ไม่มี block นี้ — เก็บเคสไว้เผื่อทดสอบตอนขึ้น production
        // test.skip('Article_Desktop_023: ตรวจสอบการแสดง "บทความที่อาจสนใจ" (ใน staging ไม่มี)', async () => {
        //     await articlePage.clickArticleCard_title();
        //     await expect(articlePage.relatedArticleBlock).toBeVisible();
        // });

        // test('Article_Desktop_024: ตรวจสอบการนำทางไปหน้า "Tag" เมื่อคลิกที่ Tag ด้านล่างในหน้ารายละเอียดของบทความ', async ({ page }) => {
        //     await articlePage.clickArticleCard_title();

        //     const tagCount = await articlePage.tagItem.count();
        //     if (tagCount > 0) {
        //         await articlePage.clickTag();
        //         await expect(page).toHaveURL(/\/tag\/.+/);
        //         await expect(articlePage.multiTagCard).toBeVisible();
        //     } else {
        //         await expect(articlePage.multiTagCard).toBeHidden();
        //     }
        // });

        test('Article_Desktop_025: ตรวจสอบการนำทาง เมื่อกด Tag บนหน้ารายละเอียดโปรโมชัน (ถ้ามี)', async ({ page }) => {
        });

    });

    test('Article_Desktop_026: ตรวจสอบการแสดงความคิดเห็น ในกรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    });

    test('Article_Desktop_027: ตรวจสอบการตอบกลับความคิดเห็น ในกรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    });

    test('Article_Desktop_028: ตรวจสอบการแสดงความคิดเห็น ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_029: ตรวจสอบการตอบกลับความคิดเห็น ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_030: ตรวจสอบการส่งความคิดเห็นแบบว่างเปล่า ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_031: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อคลิกปุ่ม "ซ่อน"', async ({ page }) => {
    });

    // ---------- Bookmark / Share / Love (ยังไม่ login) ----------
    test.describe('Detail actions — Not logged in', () => {

        test('Article_Desktop_032: ตรวจสอบการคลิกปุ่ม "บุ๊คมาร์ค" บทความ ว่ามีการ Active หรือไม่ ในกรณีที่ผู้ใช้ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickBookmarkDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        test('Article_Desktop_033: ตรวจสอบการคลิกปุ่ม "แชร์" บทความ ว่ามีการ Active หรือไม่ ในกรณีที่ผู้ใช้ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickShareDetail_Button();
            // ปุ่มแชร์ปกติไม่ต้อง login ก็เปิดเมนูได้ — เช็คว่าเมนูโชว์ครบแทน
            await expect(articlePage.shareOnFacebook).toBeVisible();
            await expect(articlePage.shareOnLine).toBeVisible();
            await expect(articlePage.shareOnX).toBeVisible();
            await expect(articlePage.shareCopyLink).toBeVisible();
        });

        test('Article_Desktop_034: ตรวจสอบการคลิกปุ่ม "หัวใจ" บทความ ว่ามีการ Active หรือไม่ ในกรณีที่ผู้ใช้ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickLoveDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

    });

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
            await setupNavbar.goToMenu_mobile(navbar.articleMenu_mobile);
            await setupArticlePage.clickArticleCard_title();

            // const bookmarkActive = await setupArticlePage.bookMarkDetailIcon.evaluate(
            //     (el) => el.tagName.toLowerCase() === 'svg'
            // );
            // if (bookmarkActive) {
            //     await setupArticlePage.clickBookmarkDetail();
            // }

            // const loveFill = await setupArticlePage.loveDetailIcon.evaluate(
            //     (el) => window.getComputedStyle(el).fill
            // );
            // if (loveFill === 'rgb(191, 32, 47)') {
            //     await setupArticlePage.clickLoveDetail();
            // }

            await context.close();
        });

        test.beforeEach(async () => {
            await navbar.openLoginOrSignup_desktop();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await navbar.goToMenu_mobile(navbar.articleMenu_mobile);
            await articlePage.clickArticleCard_title();
        });

        test('Article_Desktop_035: ตรวจสอบการคลิกปุ่ม "บุ๊คมาร์ค" บทความ ว่ามีการ Active หรือไม่ ในกรณีที่ผู้ใช้เข้าสู่ระบบแล้ว', async () => {
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toHaveCount(0);
            await expect(articlePage.bookMarkDetail_btn.locator('svg path')).toHaveCSS('fill', 'rgb(191, 32, 47)');
        });

        test('Article_Desktop_036: ตรวจสอบการคลิกปุ่ม "แชร์" บทความ ว่ามีการ Active หรือไม่ ในกรณีที่ผู้ใช้เข้าสู่ระบบแล้ว', async () => {
            await articlePage.clickShareDetail_Button();
            await expect(articlePage.shareOnFacebook).toBeVisible();
            await expect(articlePage.shareOnLine).toBeVisible();
            await expect(articlePage.shareOnX).toBeVisible();
            await expect(articlePage.shareCopyLink).toBeVisible();
        });

        // test('Article_Desktop_037: ตรวจสอบการคลิกปุ่ม "หัวใจ" บทความ ว่ามีการ Active หรือไม่ ในกรณีที่ผู้ใช้เข้าสู่ระบบแล้ว', async () => {
        //     await articlePage.clickLoveDetail();
        //     await expect(articlePage.loveDetailIcon).toHaveCSS('fill', 'rgb(191, 32, 47)');
        // });

        test('Article_Desktop_038: ตรวจสอบการยกเลิกบุ๊กมาร์ค (unbookmark) บนหน้ารายละเอียดบทความ ในกรณีที่เข้าสู่ระบบแล้ว', async () => {
            // ต่อเนื่องจาก 034 ในกลุ่ม serial — บุ๊กมาร์คถูก active ไว้แล้ว กดซ้ำเพื่อยกเลิก
            await articlePage.clickBookmarkDetail();
            await expect(articlePage.bookMarkDetail_btn.locator('svg')).toHaveCount(0);
            await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toBeVisible();
        });

        // test('Article_Desktop_039: ตรวจสอบการยกเลิกถูกใจ (unlike) บนหน้ารายละเอียดบทความ ในกรณีที่เข้าสู่ระบบแล้ว', async () => {
        //     // ต่อเนื่องจาก 036 ในกลุ่ม serial — หัวใจถูก active ไว้แล้ว กดซ้ำเพื่อยกเลิก
        //     await articlePage.clickLoveDetail();
        //     await expect(articlePage.loveDetailIcon).toHaveCSS('fill', 'rgb(151, 151, 151)');
        // });

    });

    test('Article_Desktop_040: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดบทความครบทุกรายการแล้ว', async ({ page }) => {
    });

});