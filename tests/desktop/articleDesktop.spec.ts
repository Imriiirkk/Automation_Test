import { test, expect } from '@playwright/test';
import { ArticlePage } from '../../pages/ArticlePage';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { CommentSection } from '../../pages/CommentSection';
import { AuthorPage } from '../../pages/AuthorPage';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';
// test.describe('Run test', () => {

let navbar: NavbarFooter;
let commentSection: CommentSection;
let articlePage: ArticlePage;
let authorPage: AuthorPage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    articlePage = new ArticlePage(page);
    commentSection = new CommentSection(page);
    authorPage = new AuthorPage(page);

    await navbar.goto();
    await navbar.goToMenu_desktop('Link to article');
    await page.waitForURL(/\/article/, { timeout: 10000 });

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Article Page (Desktop)', () => {
    // Pass
    test('Article_Desktop_001: ตรวจสอบการกดเข้าหน้า "บทความ" ได้', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await expect(articlePage.article_heading).toBeVisible();
    });

    // Pass
    test('Article_Desktop_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "บทความ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await expect(articlePage.articleHightlight).toBeVisible(); // เปลี่ยน aka แล้ว
        await expect(articlePage.blockMenuCategories).toBeVisible();
        await expect(articlePage.articleCard).toBeVisible();
        await expect(articlePage.loadMoreButton).toBeVisible();
    });

    // Pass
    test('Article_Desktop_003: ตรวจสอบการคลิกที่ Indicators เพื่อเปลี่ยน banner', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.waitForURL(/\/article/, { timeout: 10000 });
        const indicatorCount = await articlePage.indicatorEach.count();
        expect(indicatorCount).toBeGreaterThan(0);
        for (let i = 0; i < indicatorCount; i++) {
            await articlePage.indicatorEach.nth(i).click();
            await expect(articlePage.indicatorEach.nth(i)).toHaveClass(/swiper-pagination-bullet-active/);
            await expect(articlePage.activeBanner).toHaveAttribute('data-swiper-slide-index', String(i));
        }
    });

    // Pass
    test('Article_Desktop_004: ตรวจสอบการแสดงรายละเอียดของการ์ดบทความ บน Banner', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await expect(articlePage.activeBanner).toBeVisible();
        await expect(articlePage.imgCover_CardBanner).toBeVisible();
        await expect(articlePage.title_CardBanner).toBeVisible();
        await expect(articlePage.author_CardBanner).toBeVisible();
        await expect(articlePage.bookmark_CardBanner).toBeVisible();
        await expect(articlePage.datePublish_CardBanner).toBeVisible();
    });

    // Pass
    test('Article_Desktop_005: ตรวจสอบการนำทางไปหน้ารายละเอียดของบทความ เมื่อคลิก Banner', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await articlePage.articleHightlight.first().click();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(articlePage.title_ArticleDetail).toBeVisible();
        await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
        await expect(articlePage.postDate_ArticleDetail).toBeVisible();
        await expect(articlePage.blockAuthor_ArticleDetail).toBeVisible();
        const authorText = await articlePage.author_heading.textContent();
        expect(authorText?.replace('โดย :', '').trim().length).toBeGreaterThan(0);
        await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
        await expect(articlePage.textContent_ArticleDetail).toBeVisible();
        await expect(articlePage.comment).toBeVisible();
    });

    // Pass
    // test.describe('Run test', () => {
    test('Article_Desktop_006: ตรวจสอบการกด "Bookmark" ที่การ์ดบทความ บน Banner กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await articlePage.clickBookMarkBanner();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Fail
    test('Article_Desktop_007: ตรวจสอบการกด "Bookmark" ที่การ์ดบทความ บน Banner กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickBookMarkBanner();
        await page.reload();
        await expect(articlePage.bookmark_CardBanner.first()).toHaveAttribute('fill', '#FEBC2E');
    });

    // Fail
    test('Article_Desktop_008: ตรวจสอบการกด "Bookmark" ซ้ำที่การ์ดบทความ บน Banner กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickBookMarkBanner();
        await page.reload();
        await expect(articlePage.bookmark_CardBanner.first()).toHaveAttribute('fill', '#FEBC2E');
        await articlePage.clickBookMarkBanner();
        await page.reload();
        await expect(articlePage.bookmark_CardBanner.first()).toHaveAttribute('fill', '#979797');
    });
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
    for (const { id, filterName, label, urlPattern } of filterCases) {
        test(`${id}: กด Filter บทความ "${label}" ได้`, async ({ page }) => {
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickArticleFilter(filterName);
            await expect(page).toHaveURL(urlPattern);
            const cardCount = await articlePage.blockArticle.count();
            await expect(articlePage.articleCard).toBeVisible();
            expect(cardCount).toBeLessThanOrEqual(12);
            expect(cardCount).toBeGreaterThanOrEqual(0);
            // data-active attribute ของ filter ที่ถูกเลือกจะเป็น true
        });
    }

    // Pass
    test('Article_Desktop_015: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีบทความ', async ({ page }) => {
        for (const { filterName, urlPattern } of filterCases) {
            await navbar.goToMenu_desktop('Link to article');
            await articlePage.clickArticleFilter(filterName);
            await expect(page).toHaveURL(urlPattern);
            const cardCount = await articlePage.blockArticle.count();

            if (cardCount > 0) {
                await expect(articlePage.articleCard).toBeVisible();
                expect(cardCount).toBeLessThanOrEqual(12);
                expect(cardCount).toBeGreaterThan(0);

            } else {
                await expect(articlePage.noArticleMessage).toBeVisible();
            }
        }

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
        await navbar.goToMenu_desktop('Link to article');
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
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickBookmarkCard();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Article_Desktop_022: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดบทความ กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 10000 });
        // const articleCard_Test = articlePage.articleCardEach.filter({ has: page.locator('a[href="/p/Reunrom-Thaiband"]') }); //ถ้าไม่ได้ใช้testar-001 หรือ tester-001
        const articleCard_Test = articlePage.articleCardEach.nth(6);
        const bookmark_ArticleCard_Test = articleCard_Test.getByTestId('bookmark-button');
        const bookmarkIcon = articlePage.bookmark_ArticleCard_Test.locator('i.fa-bookmark');
        const bookmarkSvg = articlePage.bookmark_ArticleCard_Test.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await bookmark_ArticleCard_Test.click();
            await expect(bookmarkIcon).toBeVisible();
        }

        await bookmark_ArticleCard_Test.click();
        await expect(bookmark_ArticleCard_Test.locator('svg path')).toHaveAttribute('fill', '#FEBC2E');
    });

    // Pass
    test('Article_Desktop_023: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดบทความอีกครั้ง กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 10000 });
        const articleCard_Test = articlePage.articleCardEach.filter({ has: page.locator('a[href="/p/article-ppdd02"]') }); //punduangd-zodiac-16-22-Feb-2026
        const bookmark_ArticleCard_Test = articleCard_Test.getByTestId('bookmark-button');

        const bookmarkIcon = articlePage.bookmark_ArticleCard_Test.locator('i.fa-bookmark');
        const bookmarkSvg = articlePage.bookmark_ArticleCard_Test.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await bookmark_ArticleCard_Test.click();
            await expect(bookmarkIcon).toBeVisible();
        }
        await bookmark_ArticleCard_Test.click();
        await expect(bookmark_ArticleCard_Test.locator('svg path')).toHaveAttribute('fill', '#FEBC2E');
        await bookmark_ArticleCard_Test.click();
        await expect(bookmark_ArticleCard_Test.locator('i.fa-bookmark')).toBeVisible();
    });

    // pass
    test('Article_Desktop_024: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่รูปภาพ บน การ์ดบทความ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_image();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(articlePage.title_ArticleDetail).toBeVisible();
        await expect(articlePage.blockAuthor_ArticleDetail).toBeVisible();
        const authorText = await articlePage.author_heading.textContent();
        expect(authorText?.replace('โดย :', '').trim().length).toBeGreaterThan(0);
        await expect(articlePage.postDate_ArticleDetail).toBeVisible();
        await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
        await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
        await expect(articlePage.textContent_ArticleDetail).toBeVisible();
    });

    // pass
    test('Article_Desktop_025: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่ชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(articlePage.title_ArticleDetail).toBeVisible();
        await expect(articlePage.blockAuthor_ArticleDetail).toBeVisible();
        const authorText = await articlePage.author_heading.textContent();
        expect(authorText?.replace('โดย :', '').trim().length).toBeGreaterThan(0);
        await expect(articlePage.postDate_ArticleDetail).toBeVisible();
        await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
        await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
        await expect(articlePage.textContent_ArticleDetail).toBeVisible();
    });
});

// ---------- Article Detail ----------
test.describe('Article Detail', () => {
    // Pass
    test('Article_Desktop_026: ตรวจสอบการแสดงข้อมูลบนหน้า รายละเอียดบทความ', async () => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await expect(articlePage.title_ArticleDetail).toBeVisible();
        await expect(articlePage.blockAuthor_ArticleDetail).toBeVisible();
        const authorText = await articlePage.author_heading.textContent();
        expect(authorText?.replace('โดย :', '').trim().length).toBeGreaterThan(0);
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
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        await expect(articlePage.relatedArticleBlock).toBeVisible();
    });

    // Pass
    test('Article_Desktop_028: ตรวจสอบการแสดงรายละเอียดบนการ์ด "บทความที่อาจสนใจ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
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
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await articlePage.clickRelatedArticlieCard();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expect(articlePage.title_ArticleDetail).toBeVisible();
        await expect(articlePage.blockAuthor_ArticleDetail).toBeVisible();
        const authorText = await articlePage.author_heading.textContent();
        expect(authorText?.replace('โดย :', '').trim().length).toBeGreaterThan(0);
        await expect(articlePage.postDate_ArticleDetail).toBeVisible();
        await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
        await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
        await expect(articlePage.textContent_ArticleDetail).toBeVisible();
        //จะเช็คยังไงว่า ชื่อบทความที่กดเข้ามา ตรงกับชื่อบทความที่แสดงบนหน้ารายละเอียดบทความใหม่
    });

    // Pass
    test('Article_Desktop_030: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ด "บทความที่อาจสนใจ" ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await articlePage.clickBookmarkBtnRelatedArticlie();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Article_Desktop_031: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        // await navbar.goToMenu_desktop('Link to article');
        await articlePage.imgCover_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 30000 });
        const bookmarkIcon = articlePage.bookmarkBtn_RelatedArticle.locator('i.fa-bookmark');
        const bookmarkSvg = articlePage.bookmarkBtn_RelatedArticle.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(bookmarkIcon).toBeVisible();
        }

        await articlePage.clickBookmarkBtnRelatedArticlie();
        await expect(articlePage.bookmarkIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F', { timeout: 10000 });
    });

    // Pass
    test('Article_Desktop_032: ตรวจสอบการกดปุ่ม "Bookmark" อีกครั้ง บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        // await navbar.goToMenu_desktop('Link to article');
        await articlePage.imgCover_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 30000 });

        const bookmarkIcon = articlePage.bookmarkBtn_RelatedArticle.locator('i.fa-bookmark');
        const bookmarkSvg = articlePage.bookmarkBtn_RelatedArticle.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await articlePage.clickBookmarkBtnRelatedArticlie();
            await expect(bookmarkIcon).toBeVisible();
        }

        await articlePage.clickBookmarkBtnRelatedArticlie();
        await expect(articlePage.bookmarkIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F', { timeout: 10000 });
        await articlePage.clickBookmarkBtnRelatedArticlie();
        await expect(articlePage.bookmarkBtn_RelatedArticle.locator('i.fa-bookmark')).toBeVisible();
    });

    // Pass
    test('Article_Desktop_033: ตรวจสอบการกดปุ่ม "Like" บนการ์ด "บทความที่อาจสนใจ" ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await articlePage.title_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await articlePage.clickLoveBtnRelatedArticlie();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('Article_Desktop_034: ตรวจสอบการกดปุ่ม "Like" บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        // await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        const fill = await articlePage.loveIcon_RelatedArticle.getAttribute('fill');

        if (fill === '#BF202F') {
            await articlePage.clickLoveBtnRelatedArticlie();
        }

        await articlePage.clickLoveBtnRelatedArticlie();
        await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
    });

    // Pass
    test('Article_Desktop_035: ตรวจสอบการกดปุ่ม "Like" อีกครั้ง บนการ์ด "บทความที่อาจสนใจ" เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        // await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        const fill = await articlePage.loveIcon_RelatedArticle.getAttribute('fill');

        if (fill === '#BF202F') {
            await articlePage.clickLoveBtnRelatedArticlie();
        }

        await articlePage.clickLoveBtnRelatedArticlie();
        await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#BF202F');
        await articlePage.clickLoveBtnRelatedArticlie();
        await expect(articlePage.loveIcon_RelatedArticle).toHaveAttribute('fill', '#979797');
    });

    // Pass
    test('Article_Desktop_036: ตรวจสอบการกดปุ่ม "Share" บนการ์ด "บทความที่อาจสนใจ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
        await articlePage.clickShareBtnRelatedArticlie();
        await expect(articlePage.shareOnFacebook).toBeVisible();
        await expect(articlePage.shareOnLine).toBeVisible();
        await expect(articlePage.shareOnX).toBeVisible();
        await expect(articlePage.shareCopyLink).toBeVisible();
    });

    // Pass
    test('Article_Desktop_037: ตรวจสอบการกด "Icon Facebook" เพื่อแชร์บทความที่อาจสนใจ ไปที่ facebook.com บนการ์ด "บทความที่อาจสนใจ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        const popup = await articlePage.clickShareOnFacebook_Relate(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_038: ตรวจสอบการกด "Icon Line" เพื่อแชร์บทความที่อาจสนใจ ไปที่ line.me บนการ์ด "บทความที่อาจสนใจ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        const popup = await articlePage.clickShareOnLine_Relate(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_039: ตรวจสอบการกด "Icon X" เพื่อแชร์บทความที่อาจสนใจ ไปที่ x.com บนการ์ด "บทความที่อาจสนใจ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        const popup = await articlePage.clickShareOnX_Relate(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/x\.com/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_040: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกลิงก์บทความที่อาจสนใจ บนการ์ด "บทความที่อาจสนใจ"', async ({ page, context }) => {
        await articlePage.title_ArticleCard.nth(8).click();
        await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 30000 });
        const expectedUrl = await articlePage.getRelatedArticleUrl(0); // การ์ดใบแรกในโซน "บทความที่อาจสนใจ"
        const copyValue = await articlePage.clickShareCopyLink_Relate();
        expect(copyValue).toBe(expectedUrl);
    });

    // ---------- Share Button ---------- 
    // Pass
    test('Article_Desktop_041: ตรวจสอบการกดปุ่ม "Share" บนหน้ารายละเอียดโปรโมชัน (ด้านบน)', async () => {
        await articlePage.clickArticleCard_title();
        await articlePage.clickShareDetail_Button();
        await expect(articlePage.shareOnFacebook_top).toBeVisible();
        await expect(articlePage.shareOnLine_top).toBeVisible();
        await expect(articlePage.shareOnX_top).toBeVisible();
        await expect(articlePage.shareCopyLink_top).toBeVisible();
    });

    // Pass
    test('Article_Desktop_042: ตรวจสอบการกด "Icon Facebook" เพื่อแชร์บทความนั้น ไปที่ facebook.com บนหน้ารายละเอียดบทความ (ด้านบน)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        // await articlePage.clickShareDetail_Button();
        const popup = await articlePage.clickShareOnFacebook_top(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_043: ตรวจสอบการกด "Icon Line" เพื่อแชร์บทความนั้น ไปที่ line.me บนหน้ารายละเอียดบทความ (ด้านบน)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        // await articlePage.clickShareDetail_Button();
        const popup = await articlePage.clickShareOnLine_top(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_044: ตรวจสอบการกด "Icon X" เพื่อแชร์บทความนั้น ไปที่ x.com บนหน้ารายละเอียดบทความ (ด้านบน)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        // await articlePage.clickShareDetail_Button();
        const popup = await articlePage.clickShareOnX_top(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/x\.com/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_045: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกลิงก์บทความนั้น บนหน้ารายละเอียดบทความ (ด้านบน)', async ({ page, context }) => {
        await articlePage.clickArticleCard_title();
        const expectedUrl = page.url();
        const copyValue = await articlePage.clickShareCopyLink_top();
        expect(copyValue).toBe(expectedUrl);

        // const expectedUrl = page.url();
        // const copyValue = await articlePage.clickShareCopyLink_top();
        // expect(copyValue).toBe(expectedUrl);
        // await context.grantPermissions(['clipboard-read', 'clipboard-write']);

        // await articlePage.clickArticleCard_title();
        // const expectedUrl = page.url();

        // const clipboardText = await articlePage.clickShareCopyLink_top(page);
        // expect(clipboardText).toBe(expectedUrl); // เช็คจาก clipboard จริง ไม่ใช่ attribute
    });

    // Pass
    test('Article_Desktop_046: ตรวจสอบการกดปุ่ม "Share" บนหน้ารายละเอียดโปรโมชัน (ด้านล่าง)', async () => {
        await articlePage.clickArticleCard_title();
        await articlePage.clickShareDetail_Btnfooter();
        await expect(articlePage.shareOnFacebook.nth(1)).toBeVisible();
        await expect(articlePage.shareOnLine.nth(1)).toBeVisible();
        await expect(articlePage.shareOnX.nth(1)).toBeVisible();
        await expect(articlePage.shareCopyLink.nth(1)).toBeVisible();
    });

    // Pass
    test('Article_Desktop_047: ตรวจสอบการกด  "Icon Facebook" เพื่อแชร์บทความนั้น ไปที่ facebook.com บนหน้ารายละเอียดโปรโมชัน (ด้านล่าง)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        const popup = await articlePage.clickShareOnFacebook_footer(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/facebook\.com/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_048: ตรวจสอบการกด "Icon Line" เพื่อแชร์บทความนั้น ไปที่ line.me บนหน้ารายละเอียดโปรโมชัน (ด้านล่าง)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        const popup = await articlePage.clickShareOnLine_footer(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/line\.me/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_049: ตรวจสอบการกด "Icon X" เพื่อแชร์บทความนั้น ไปที่ x.com บนหน้ารายละเอียดโปรโมชัน (ด้านล่าง)', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        const popup = await articlePage.clickShareOnX_footer(page);
        await popup.waitForLoadState();
        await expect(popup).toHaveURL(/x\.com/);
        await popup.close();
    });

    // Pass
    test('Article_Desktop_050: ตรวจสอบการกด "Icon Copy Link" เพื่อคักลอกลิงก์บทความนั้น บนหน้ารายละเอียดบทความ (ด้านล่าง)', async ({ page }) => {
        await articlePage.clickArticleCard_title();
        const expectedUrl = page.url();
        const copyValue = await articlePage.clickShareCopyLink_footer();
        expect(copyValue).toBe(expectedUrl);
    });

    // Pass
    test('Article_Desktop_051: ตรวจสอบการนำทางไปหน้า "Tag" เมื่อคลิกที่ Tag ด้านล่างในหน้ารายละเอียดของบทความ (ถ้ามี)', async ({ page }) => {
        await articlePage.clickArticleCard_title();
        const tagCount = await articlePage.tagItem.count();
        console.log(`จำนวน Tag ที่พบ: ${tagCount}`);
        if (tagCount > 0) {
            await articlePage.clickTag();
            await expect(page).toHaveURL(/\/tag\/.+/);
        } else {
            console.log('ไม่มี Tag จึงข้ามการตรวจสอบการนำทาง');
        }
    });

    // ---------- Comment Section ----------
    // ----- ยังไม่ login -----
    // Pass

    test('Article_Desktop_052: ตรวจสอบการแสดงความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await commentSection.blockSentComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });

    // Pass
    test('Article_Desktop_053: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.locator('a[href="/p/testar-001"]').first().click();
        // await articlePage.clickArticleCard_title();
        await commentSection.replyComment_bth.click();
        await commentSection.textField_ReplyComment.click();
        await expect(navbar.loginModalCloseButton).toBeVisible(); // ตรวจสอบว่ามี modal login ปรากฏขึ้นมา
        await navbar.closeLoginModal()
    });


    // ----- login แล้ว -----
    test('Article_Desktop_054: ตรวจสอบการแสดงความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to article');
        await page.locator('a[href="/p/testar-001"]').first().click();
        const loggedInName = (await page.locator('a.NavbarTop__BlockUsername-sc-f8cfc4bb-5').innerText()).trim();
        await expect(commentSection.blockComment).toBeVisible();
        const countBefore = await commentSection.existingComment.count();
        await commentSection.sentComment();
        await expect(commentSection.blockComment.getByText('testcomment-auto')).toBeVisible();
        await page.reload();
        await expect(commentSection.blockComment).toBeVisible();
        await expect(commentSection.textField_Comment).toHaveValue('');
        await expect(commentSection.existingComment).toHaveCount(countBefore + 2); // จำนวนคอมเมนต์ต้องเพิ่มขึ้น 1
        await expect(commentSection.commentAuthor).toHaveText(loggedInName);
        await expect(commentSection.commentDate.first()).toContainText(/ที่แล้ว$/);
    });

    test('Article_Desktop_055: ตรวจสอบการตอบกลับความคิดเห็น กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await navbar.goToMenu_desktop('Link to article');
        await page.locator('a[href="/p/testar-001"]').first().click();
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
    test('Article_Desktop_056: ตรวจสอบการแสดงความคิดเห็นตอบกลับทั้งหมด เมื่อคลิกปุ่ม "ตอบกลับ"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.locator('a[href="/p/testar-001"]').first().click();
        await commentSection.replyComment_bth.click();
        await expect(commentSection.blockSentCommentReply).toBeVisible();
    });

    // Pass
    test('Article_Desktop_057: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อคลิกปุ่ม "ซ่อน"', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await page.locator('a[href="/p/testar-001"]').first().click();
        await commentSection.replyComment_bth.click();
        await expect(commentSection.blockSentCommentReply).toBeVisible();
        await commentSection.hideComment_bth.click();
        await expect(commentSection.blockSentCommentReply).toBeHidden();
    });

    // ---------- Bookmark / Share / Love (ยังไม่ login) ----------
    test.describe('Detail actions — Not logged in', () => {
        // Pass
        test('Article_Desktop_058: ตรวจสอบการกด "Bookmark" บนหน้ารายละเอียดบทความ กรณียังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickBookmarkDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Pass
        test('Article_Desktop_059: ตรวจสอบการกด "Like" บนหน้ารายละเอียดบทความ กรณียังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.clickLoveDetail();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });
    });

    // ---------- Bookmark / Share / Love (login แล้ว) ----------
    // Pass
    test('Article_Desktop_060: ตรวจสอบการกด "Bookmark" บนหน้ารายละเอียดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await articlePage.clickArticleCard_title();

        const bookmarkIcon = articlePage.bookMarkDetail_btn.locator('i.fa-bookmark');
        const bookmarkSvg = articlePage.bookMarkDetail_btn.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await articlePage.clickBookmarkDetail();
            await expect(bookmarkIcon).toBeVisible();
        }

        await articlePage.clickBookmarkDetail();
        await expect(articlePage.bookMarkDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
    });

    // Pass
    test('Article_Desktop_061: ตรวจสอบการกด "Bookmark" ซ้ำ บนหน้ารายละเอียดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await articlePage.clickArticleCard_title();
        const bookmarkIcon = articlePage.bookMarkDetail_btn.locator('i.fa-bookmark');
        const bookmarkSvg = articlePage.bookMarkDetail_btn.locator('svg');

        if (await bookmarkSvg.count() > 0) {
            await articlePage.clickBookmarkDetail();
            await expect(bookmarkIcon).toBeVisible();
        }

        await articlePage.clickBookmarkDetail();
        await expect(articlePage.bookMarkDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        await articlePage.clickBookmarkDetail();
        await expect(articlePage.bookMarkDetail_btn.locator('i.fa-bookmark')).toBeVisible();
    });

    // Pass
    test('Article_Desktop_062: ตรวจสอบการกด "Like" บนหน้ารายละเอียดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await articlePage.clickArticleCard_title();
        const fill = await articlePage.loveDetail_btn.locator('svg path').getAttribute('fill');

        if (fill === '#BF202F') {
            await articlePage.clickLoveDetail();
        }

        await articlePage.clickLoveDetail();
        await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
    });

    // Pass
    test('Article_Desktop_063: ตรวจสอบการกด "Like" ซ้ำ บนหน้ารายละเอียดบทความ กรณีเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await articlePage.clickArticleCard_title();
        const fill = await articlePage.loveDetail_btn.locator('svg path').getAttribute('fill');

        if (fill === '#BF202F') {
            await articlePage.clickLoveDetail();
        }

        await articlePage.clickLoveDetail();
        await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        await articlePage.clickLoveDetail();
        await expect(articlePage.loveDetail_btn.locator('svg path')).toHaveAttribute('fill', '#979797');
    });

    // Pass
    test('Article_Desktop_064: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง บนหน้ารายละเอียดบทความ', async ({ page }) => {
        await navbar.goToMenu_desktop('Link to article');
        await articlePage.clickArticleCard_title();
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Article_Desktop_065: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" บนหน้ารายละเอียดบทความ', async ({ page }) => {
        // await navbar.goToMenu_desktop('Link to article');
        await articlePage.title_ArticleCard.nth(8).click();
        await page.evaluate(() => window.scrollBy(0, 1000));

        await expect(navbar.scrollToTopButton).toBeVisible();

        await page.waitForTimeout(1000);

        await navbar.scrollToTopButton.dispatchEvent('click');

        await expect.poll(async () => {
            return await page.evaluate(() => window.scrollY);
        }).toBe(0);
    });

    // Pass
    test('Article_Desktop_066: ตรวจสอบการนำทางไปที่หน้า "นักเขียน" เมื่อกดชื่อและรูปโปไฟล์ผู้เขียน บนหน้ารายละเอียดโปรโมชัน', async ({ page }) => {
        await articlePage.clickArticleCard_title();
        await articlePage.clickAuthorLink();
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
});
});
