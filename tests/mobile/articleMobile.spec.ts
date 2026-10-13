import { expect, test, Page, Locator } from '@playwright/test';
import { ArticlePage } from '../../pages/ArticlePage';
import { CommentSection } from '../../pages/CommentSection';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { AuthorPage } from '../../pages/AuthorPage';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

let navbar: NavbarFooter;
let commentSection: CommentSection;
let articlePage: ArticlePage;
let authorPage: AuthorPage;

// ---------- Helpers ----------
// TODO: mobile เข้าเมนู/login ผ่าน hamburger — ถ้า NavbarFooter มี method ฝั่ง mobile
// ให้สลับที่ helper สองตัวนี้ที่เดียว ไม่ต้องไล่แก้ทุกเคส
async function goToArticlePage() {
    await navbar.goToMenu_mobile(navbar.articleMenu_mobile);
}

async function loginAndGoToArticle(page: Page) {
    await navbar.openLoginOrSignup_mobile();
    await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
    await expect(page.locator('.swal2-container')).toBeHidden({ timeout: 10000 });
    await goToArticlePage();
}

// สถานะ bookmark/like ของบัญชีเทสจะค้างข้ามรอบ (และข้ามชุด desktop/mobile)
// จึงรีเซ็ตให้เป็น "ยังไม่กด" ก่อนเริ่มเช็คทุกครั้ง
async function ensureNotBookmarked(bookmark: Locator) {
    await expect(bookmark).toBeVisible();
    if (await bookmark.locator('svg path').count() > 0) {
        await bookmark.click();
        await expect(bookmark.locator('i.fa-bookmark')).toBeVisible();
    }
}

// เช็คข้อมูลพื้นฐานบนหน้ารายละเอียดบทความ (ใช้ซ้ำหลายเคส)
async function expectArticleDetailInfo() {
    await expect(articlePage.title_ArticleDetail).toBeVisible();
    await expect(articlePage.blockAuthor_ArticleDetail).toBeVisible();
    const authorText = await articlePage.author_heading.textContent();
    expect(authorText?.replace('โดย :', '').trim().length).toBeGreaterThan(0);
    await expect(articlePage.postDate_ArticleDetail).toBeVisible();
    await expect(articlePage.viewCount_ArticleDetail).toBeVisible();
    await expect(articlePage.coverImg_ArticleDetail).toBeVisible();
    await expect(articlePage.textContent_ArticleDetail).toBeVisible();
}

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    articlePage = new ArticlePage(page);
    commentSection = new CommentSection(page);
    authorPage = new AuthorPage(page);

    await navbar.goto();
    await navbar.goToMenu_mobile(navbar.articleMenu_mobile);

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Article Page (Mobile)', () => {
    // Pass
    test('Article_Mobile_001: ตรวจสอบการกดเข้าหน้า "บทความ" ได้สำเร็จ', async ({ page }) => {
        await page.waitForURL(/\/article/, { timeout: 10000 });
        await expect(articlePage.article_heading).toBeVisible();
    });

    // Pass
    test('Article_Mobile_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "บทความ"', async () => {
        await expect(articlePage.articleHightlight).toBeVisible(); // เปลี่ยน aka แล้ว >> fail
        await expect(articlePage.blockMenuCategories).toBeVisible();
        await expect(articlePage.articleCard).toBeVisible();
        await expect(articlePage.loadMoreButton).toBeVisible();
    });

    // Pass
    test('Article_Mobile_003: ตรวจสอบการคลิกที่ Indicators เพื่อเปลี่ยน banner', async () => {
        const indicatorCount = await articlePage.indicatorEach.count();
        expect(indicatorCount).toBeGreaterThan(0);
        for (let i = 0; i < indicatorCount; i++) {
            await articlePage.indicatorEach.nth(i).click();
            await expect(articlePage.indicatorEach.nth(i)).toHaveClass(/swiper-pagination-bullet-active/);
            await expect(articlePage.activeBanner).toHaveAttribute('data-swiper-slide-index', String(i));
        }
    });

    // Pass
    test('Article_Mobile_004: ตรวจสอบการแสดงรายละเอียดของการ์ดบทความ บน Banner', async () => {
        await expect(articlePage.activeBanner).toBeVisible();
        await expect(articlePage.imgCover_CardBanner).toBeVisible();
        await expect(articlePage.title_CardBanner).toBeVisible();
        await expect(articlePage.author_CardBanner).toBeVisible();
        await expect(articlePage.bookmark_CardBanner).toBeVisible();
        await expect(articlePage.datePublish_CardBanner).toBeVisible();
    });

    // Pass
    test('Article_Mobile_005: ตรวจสอบการนำทางไปหน้ารายละเอียดของบทความ เมื่อกด Banner', async ({ page }) => {
        await articlePage.clickHighlightBanner();
        await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
        await expectArticleDetailInfo();
        await expect(articlePage.comment).toBeVisible();
    });

    test('Article_Mobile_006: ตรวจสอบการกด "Bookmark" ที่การ์ดบทความ บน Banner กรณียังไม่เข้าสู่ระบบ', async () => {
        await articlePage.clickBookMarkBanner();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // ฝั่ง desktop เคสนี้ Fail — fill อยู่ที่ svg path ไม่ใช่ตัวปุ่ม จึงเปลี่ยนมาเช็คที่ svg path
    // และ banner อาจ auto-slide ระหว่างเทส (ยังไม่ยืนยัน)
    test('Article_Mobile_007: ตรวจสอบการกด "Bookmark" ที่การ์ดบทความ บน Banner กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await loginAndGoToArticle(page);
        await articlePage.clickBookMarkBanner();
        await expect(articlePage.bookmark_CardBanner.locator('svg path')).toHaveAttribute('fill', '#FEBC2E');
    });

    // TODO: สี '#979797' ตอนยกเลิก bookmark ที่ banner ยังไม่ได้ verify กับ site จริง
    test('Article_Mobile_008: ตรวจสอบการกด "Bookmark" ซ้ำที่การ์ดบทความ บน Banner กรณีเข้าสู่ระบบแล้ว', async ({ page }) => {
        await loginAndGoToArticle(page);
        await articlePage.clickBookMarkBanner();
        await expect(articlePage.bookmark_CardBanner.locator('svg path')).toHaveAttribute('fill', '#FEBC2E');
        await articlePage.clickBookMarkBanner();
        await expect(articlePage.bookmark_CardBanner.locator('svg path')).toHaveAttribute('fill', '#979797');
    });

    // ---------- Promotion Categories Tap ----------
    test.describe('Categories Tap', () => {
        const filterCases = [
            { id: 'Article_Mobile_009', filterName: 'pro_fashion', label: 'โปรสายแฟ', urlPattern: /pro-fashion/ },
            { id: 'Article_Mobile_010', filterName: 'pro_eat', label: 'โปรกิน', urlPattern: /pro-eat/ },
            { id: 'Article_Mobile_011', filterName: 'pro_travel', label: 'โปรเที่ยว', urlPattern: /pro-travel/ },
            { id: 'Article_Mobile_012', filterName: 'pro_smart', label: 'โปรสมาร์ท', urlPattern: /pro-smart/ },
            { id: 'Article_Mobile_013', filterName: 'pro_update', label: 'โปรอัพเดท', urlPattern: /pro-update/ },
            { id: 'Article_Mobile_014', filterName: 'pro_talking', label: 'โปรชวนคุย', urlPattern: /pro-talking/ },
        ];

        // Pass 
        for (const { id, filterName, label, urlPattern } of filterCases) {
            test(`${id}: กด Filter บทความ "${label}" ได้`, async ({ page }) => {
                await articlePage.clickArticleFilter(filterName);
                await expect(page).toHaveURL(urlPattern);
                await expect(articlePage.articleCardEach.first()).toBeVisible();
                const cardCount = await articlePage.articleCardEach.count();
                expect(cardCount).toBeGreaterThan(0);
                expect(cardCount).toBeLessThanOrEqual(12);
                // data-active attribute ของ filter ที่ถูกเลือกจะเป็น true
            });
        }

        // Pass
        test('Article_Mobile_015: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีบทความ', async ({ page }) => {
            for (const { filterName, urlPattern } of filterCases) {
                await articlePage.clickArticleFilter(filterName);
                await expect(page).toHaveURL(urlPattern);

                // รอให้ผลลัพธ์แสดงก่อน (มีการ์ด หรือ ข้อความไม่มีโปรโมชัน) แล้วค่อยนับ
                await expect(
                    articlePage.articleCardEach.first().or(articlePage.noArticleMessage)
                ).toBeVisible();

                const cardCount = await articlePage.articleCardEach.count();
                if (cardCount > 0) {
                    await expect(articlePage.articleCardEach.first()).toBeVisible();
                    expect(cardCount).toBeLessThanOrEqual(12);
                } else {
                    await expect(articlePage.noArticleMessage).toBeVisible();
                }
            }
        });
    });

    // Pass
    test('Article_Mobile_016: ตรวจสอบการโหลด การ์ดบทความเพิ่ม เมื่อคลิกปุ่ม "ดูเพิ่มเติม"', async () => {
        // await navbar.goToMenu_mobile(navbar.articleMenu_mobile);
        const cardBefore = await articlePage.articleCard.count()
        await articlePage.clickLoadMore();
        const cardAfter = await articlePage.articleCard.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
    });

    // Pass
    test('Article_Mobile_017: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
        // await navbar.goToMenu_mobile(navbar.articleMenu_mobile);
        await articlePage.clickLoadMore();
        await expect(articlePage.loadMoreButton).toBeHidden();
    });

    // Pass
    test('Article_Mobile_018: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        // await navbar.goToMenu_mobile(navbar.articleMenu_mobile);
        await page.evaluate(() => window.scrollBy(0, 1000));
        await expect(navbar.scrollToTopButton).toBeVisible();
    });

    // Pass
    test('Article_Mobile_019: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        // await navbar.goToMenu_mobile(navbar.articleMenu_mobile);
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
        test('Article_Mobile_020: ตรวจสอบการแสดงข้อมูลบน การ์ดบทความ', async () => {
            await expect(articlePage.articleCard.first()).toBeVisible();
            await expect(articlePage.imgCover_ArticleCard.first()).toBeVisible();
            await expect(articlePage.title_ArticleCard.first()).toBeVisible();
            await expect(articlePage.description_ArticleCard.first()).toBeVisible();
            await expect(articlePage.datePost_ArticleCard.first()).toBeVisible();
            await expect(articlePage.profileAuthor_ArticleCard.first()).toBeVisible();
            await expect(articlePage.bookmark_ArticleCard.first()).toBeVisible();
        });

        // Pass
        test('Article_Mobile_021: ตรวจสอบการคลิกปุ่ม "Bookmark" บน การ์ดบทความ ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickBookmarkCard();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Pass
        test('Article_Mobile_022: ตรวจสอบการคลิกปุ่ม "Bookmark" บน การ์ดบทความ เข้าสู่ระบบแล้ว', async ({ page }) => {
            await loginAndGoToArticle(page);
            const bookmark = articlePage.bookmark_ArticleCard_Test;
            await ensureNotBookmarked(bookmark);
            await bookmark.click();
            await expect(bookmark.locator('svg path')).toHaveAttribute('fill', '#FEBC2E');
        });

        // Pass
        test('Article_Mobile_023: ตรวจสอบการคลิกปุ่ม "Bookmark" บน การ์ดบทความอีกครั้ง เข้าสู่ระบบแล้ว', async ({ page }) => {
            await loginAndGoToArticle(page);
            const bookmark = articlePage.bookmark_ArticleCard_Test;
            await ensureNotBookmarked(bookmark);
            await bookmark.click();
            await expect(bookmark.locator('svg path')).toHaveAttribute('fill', '#FEBC2E');
            await bookmark.click();
            await expect(bookmark.locator('i.fa-bookmark')).toBeVisible();
        });

        // Pass
        test('Article_Mobile_024: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่รูปภาพ บน การ์ดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_image();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expectArticleDetailInfo();
        });

        // Pass
        test('Article_Mobile_025: ตรวจสอบการนำทางไปยังหน้าบทความ เมื่อคลิกที่ชื่อบทความ บนการ์ดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expectArticleDetailInfo();
        });
    });

    // ---------- Article Detail ----------
    test.describe('Article Detail', () => {
        // Pass
        test('Article_Mobile_026: ตรวจสอบการแสดงข้อมูลบนหน้า รายละเอียดบทความ', async () => {
            await articlePage.clickArticleCard_title();
            await expectArticleDetailInfo();
            await expect(articlePage.bookMarkButton_mobile).toBeVisible();
            await expect(articlePage.shareButton_mobile).toBeVisible();
        });

        // ---------- Tag ----------
        // Pass
        test('Article_Mobile_027: ตรวจสอบการนำทางไปหน้า "Tag" เมื่อคลิกที่ Tag ด้านล่างในหน้ารายละเอียดของบทความ (ถ้ามี)', async ({ page }) => {
            // const articleCard_Test = articlePage.articleCardEach.filter({ hasText: 'ทดสอบสร้างบทความ' });
            // await articleCard_Test.click();
            await articlePage.clickArticleCard_title();
            const title = await articlePage.title_ArticleDetail.innerText();
            console.log('ชื่อโปรโมชัน:', title);
            const tagCount = await articlePage.tagItem.count();
            console.log('จำนวน Tag ที่เจอ:', tagCount);

            if (tagCount > 0) {
                console.log('มี Tag จำนวน:', tagCount);
                await articlePage.tagItem.first().click();
                await expect(page).toHaveURL(/\/tag\/.+/);
            } else {
                console.log('ไม่มี Tag จึงข้ามการตรวจสอบการนำทาง');
            }
        });



        // ---------- Comment Section ----------
        test.describe('Run test', () => {
            test.describe('Comment Section', () => {
                // ----- ยังไม่ login -----
                // Not Complete
                test('Article_Mobile_028: ตรวจสอบการแสดงความคิดเห็น ในกรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
                    // const articleCard_Test = articlePage.articleCardEach.filter({ hasText: 'ทดสอบสร้างบทความ' });
                    // await articleCard_Test.click();
                    await articlePage.clickArticleCard_title();
                    const title = await articlePage.title_ArticleDetail.innerText();
                    console.log('ชื่อโปรโมชัน:', title);
                    await expect(commentSection.blockSentComment).toBeVisible();
                    await commentSection.blockSentComment.click();
                    await expect(navbar.loginModalCloseButton).toBeVisible();
                });

                test('Article_Mobile_029: ตรวจสอบการตอบกลับความคิดเห็น ในกรณีที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
                    // const articleCard_Test = articlePage.articleCardEach.filter({ hasText: 'ทดสอบสร้างบทความ' });
                    // await articleCard_Test.click();
                    await articlePage.clickArticleCard_title();
                    const title = await articlePage.title_ArticleDetail.innerText();
                    console.log('ชื่อโปรโมชัน:', title);
                    await expect(commentSection.replyComment_bth).toBeVisible();
                    await commentSection.replyComment_bth.click();
                    await commentSection.textField_ReplyComment.click();
                    await expect(navbar.loginModalCloseButton).toBeVisible();
                });

                // ----- login แล้ว -----
                // TODO (041-042, ยกมาจาก desktop 054-055 ทั้งสองจุดนี้ยังไม่ถูก):
                //  1) countBefore ถูกนับก่อนเข้าหน้าบทความ ค่าจึงไม่ใช่จำนวนคอมเมนต์ของบทความ
                //  2) `test-${Date.now()}` ตอน assert เป็นคนละเวลากับตอนพิมพ์ จะไม่ตรงกัน
                //  ต้องดู CommentSection.sentComment ว่าพิมพ์ข้อความอะไร แล้วเทียบด้วยค่านั้นแทน
                test('Article_Mobile_030: ตรวจสอบการแสดงความคิดเห็น ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
                    const countBefore = await commentSection.existingComment.count();
                    await loginAndGoToArticle(page);
                    await commentSection.sentComment(articlePage.title_ArticleCard.first());
                    await expect(commentSection.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
                    await expect(commentSection.textField_Comment).toHaveValue('');
                    await expect(commentSection.existingComment).toHaveCount(countBefore + 1);
                });

                test('Article_Mobile_031: ตรวจสอบการตอบกลับความคิดเห็น ในกรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
                    const countBefore = await commentSection.existingComment.count();
                    await loginAndGoToArticle(page);
                    await commentSection.sentReplyComment(articlePage.title_ArticleCard.first());
                    await expect(commentSection.blockComment.getByText(`test-${Date.now()}`)).toBeVisible();
                    await expect(commentSection.textField_ReplyComment).toHaveValue('');
                    await expect(commentSection.existingComment).toHaveCount(countBefore + 1);
                });

                test('Article_Mobile_032: ตรวจสอบการแสดงความคิดเห็นตอบกลับทั้งหมด เมื่อคลิกปุ่ม "ตอบกลับ"', async () => {
                    await articlePage.clickArticleCard_title();
                    await commentSection.replyComment_bth.click();
                    await expect(commentSection.blockSentCommentReply).toBeVisible();
                });

                test('Article_Mobile_033: ตรวจสอบการซ่อนการตอบกลับความคิดเห็น เมื่อคลิกปุ่ม "ซ่อน"', async () => {
                    await articlePage.clickArticleCard_title();
                    await commentSection.replyComment_bth.click();
                    await expect(commentSection.blockSentCommentReply).toBeVisible();
                    await commentSection.hideComment_bth.click();
                    await expect(commentSection.blockSentCommentReply).toBeHidden();
                });
            });
        });


        // ---------- Bookmark ----------
        // Pass
        test('Article_Mobile_034: ตรวจสอบการคลิกปุ่ม "Bookmark" บนหน้ารายละเอียดบทความ ยังไม่เข้าสู่ระบบ', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.bookMarkButton_mobile.click();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Pass
        test('Article_Mobile_035: ตรวจสอบการคลิกปุ่ม "Bookmark" บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async ({ page }) => {
            await loginAndGoToArticle(page);
            await articlePage.clickArticleCard_title();
            const bookmarkIcon = articlePage.bookMarkButton_mobile.locator('i.fa-bookmark');
            const bookmarkSvg = articlePage.bookMarkButton_mobile.locator('svg');

            if (await bookmarkSvg.count() > 0) {
                await articlePage.bookMarkButton_mobile.click();
                await expect(bookmarkIcon).toBeVisible();
            }

            await articlePage.bookMarkButton_mobile.click();
            await expect(bookmarkIcon).toHaveCount(0);
            await expect(articlePage.bookMarkButton_mobile.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        });

        // Pass
        test('Article_Mobile_036: ตรวจสอบการคลิกปุ่ม "Bookmark" ซ้ำ บนหน้ารายละเอียดบทความ เข้าสู่ระบบแล้ว', async ({ page }) => {
            await loginAndGoToArticle(page);
            await articlePage.clickArticleCard_title();

            const bookmarkButton = articlePage.bookMarkButton_mobile;
            const bookmarkIcon = bookmarkButton.locator('i.fa-bookmark');
            const bookmarkSvg = bookmarkButton.locator('svg');

            // ตรวจสอบ Initial State
            if (await bookmarkSvg.count() > 0) {
                await bookmarkButton.click();
                await expect(bookmarkIcon).toBeVisible();
            }

            await bookmarkButton.click();
            await expect(bookmarkButton.locator('svg')).toBeVisible();
            await expect(bookmarkButton.locator('svg path')).toHaveAttribute('fill', '#BF202F');

            await bookmarkButton.click();
            await expect(bookmarkButton.locator('i.fa-bookmark')).toBeVisible();
            await expect(bookmarkButton.locator('svg')).toHaveCount(0);
        });


        // ---------- Share Button (ด้านบน) ----------
        // Pass
        test('Article_Mobile_037: ตรวจสอบการกดปุ่ม "แชร์" บนหน้ารายละเอียดบทความ (ด้านบน)', async () => {
            await articlePage.clickArticleCard_title();
            await articlePage.shareButton_mobile.click();
            await expect(articlePage.shareOnFacebook).toBeVisible();
            await expect(articlePage.shareOnLine).toBeVisible();
            await expect(articlePage.shareOnX).toBeVisible();
            await expect(articlePage.shareCopyLink).toBeVisible();
        });

        // Pass
        test('Article_Mobile_038: ตรวจสอบการกด "Icon Facebook" เพื่อแชร์บทความ ไปที่ facebook.com (ด้านบน)', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            await articlePage.shareButton_mobile.click();
            const popupPromise = page.waitForEvent('popup');
            await articlePage.shareOnFacebook.click();
            const popup = await popupPromise;
            await expect(popup).toHaveURL(/facebook\.com/);
        });

        // Pass
        test('Article_Mobile_039: ตรวจสอบการกด "Icon Line" เพื่อแชร์บทความ ไปที่ line.me (ด้านบน)', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            await articlePage.shareButton_mobile.click();
            const popupPromise = page.waitForEvent('popup');
            await articlePage.shareOnLine.click();
            const popup = await popupPromise;
            await expect(popup).toHaveURL(/line\.me/);
        });

        // Pass
        test('Article_Mobile_040: ตรวจสอบการกด "Icon X" เพื่อแชร์บทความ ไปที่ x.com (ด้านบน)', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            await articlePage.shareButton_mobile.click();
            const popupPromise = page.waitForEvent('popup');
            await articlePage.shareOnX.click();
            const popup = await popupPromise;
            await expect(popup).toHaveURL(/x\.com|twitter\.com/);
        });

        // Pass
        test('Article_Mobile_041: ตรวจสอบการกด "Icon Copy Link" เพื่อคัดลอกลิงก์บทความ (ด้านบน)', async ({ page, context }) => {
            await articlePage.clickArticleCard_title();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            const currentUrl = new URL(page.url());
            const copyValue = await articlePage.clickShareCopyLink_mobile();
            expect(copyValue).not.toBeNull();
            const copiedUrl = new URL(copyValue!);
            expect(copiedUrl.origin).toBe(currentUrl.origin);
            expect(copiedUrl.pathname).toBe(currentUrl.pathname);
        });

        // ---------- Scroll to top (หน้ารายละเอียดบทความ) ----------
        // Pass
        test('Article_Mobile_042: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง บนหน้ารายละเอียดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
        });

        // Pass
        test('Article_Mobile_043: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" บนหน้ารายละเอียดบทความ', async ({ page }) => {
            await articlePage.clickArticleCard_title();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
            await page.waitForTimeout(1000);
            await navbar.scrollToTopButton.dispatchEvent('click'); // desktop ใช้ dispatchEvent เพราะ click ปกติไม่เสถียร
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
        });

        // ---------- Author ----------
        // Pass
        test('Article_Mobile_044: ตรวจสอบการนำทางไปที่หน้า "นักเขียน" เมื่อกดชื่อและรูปโปรไฟล์ผู้เขียน บนหน้ารายละเอียดบทความ', async ({ page }) => {
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