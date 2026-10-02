import { test, expect, Locator } from '@playwright/test';
import { TagPage } from '../../pages/Tag';
import { NavbarFooter } from '../../pages/NavbarFooter';
// test.describe('Run test', () => {

let navbar: NavbarFooter;
let tagPage: TagPage;

// หน้า Tag ที่ใช้ทดสอบ: #การ์ตูน (ต่อท้าย baseURL ใน playwright.config.ts)
const TAG_PATH = '/tag/การ์ตูน';

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    tagPage = new TagPage(page);

    await page.goto(TAG_PATH);
    await expect(page).toHaveURL(/\/tag\/.+/);

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่น ๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

// ---------- Helpers ----------

// ข้ามเทสต์ถ้าหน้า Tag นี้ไม่มีการ์ดประเภทนั้น
async function skipIfNoCard(card: Locator, name: string) {
    test.skip((await card.count()) === 0, `ไม่พบการ์ด${name}ในหน้า Tag นี้`);
}

// URL ของหน้ารายละเอียดบทความ/โปรโมชัน
const DETAIL_URL = /\/p\/.+/;

test.describe('Tag Page (Desktop)', () => {

    test('Tag_Desktop_001: ตรวจสอบการแสดงรายละเอียดบนหน้า แบรนด์', async () => {
        await expect(tagPage.tag_heading).toBeVisible();
        await expect(tagPage.tag_heading).toContainText('#');
        await expect(tagPage.breadcrumbBlock).toBeVisible();
        await expect(tagPage.listPost_Card).toBeVisible();
        await expect(tagPage.each_PostCard.first()).toBeVisible();
    });

    test('Tag_Desktop_002: ตรวจสอบการกด breadcrumbs', async ({ page }) => {
        await expect(tagPage.homeBreadcrumb).toBeVisible();
        await tagPage.homeBreadcrumb.click();

        // กลับหน้าแรก (path = "/")
        await expect(page).toHaveURL(/^https?:\/\/[^/]+\/?(\?.*)?$/);
    });

    test.fixme('Tag_Desktop_003: ตรวจสอบการกดรูปภาพ บนการ์ดอีเว้นต์', async () => {
        // FIXME: POM Tag.ts ยังไม่มี locator ของ Event Card
        // เพิ่ม eventCard / coverImg_EventCard ใน POM ก่อน แล้วค่อยเขียนเทสต์
    });

    test.fixme('Tag_Desktop_004: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดอีเว้นต์', async () => {
        // FIXME: เหมือนข้อ 003
    });

    test('Tag_Desktop_005: ตรวจสอบการกดรูปภาพ บนการ์ดโปรโมชัน', async ({ page }) => {
        await skipIfNoCard(tagPage.promotionCard, 'โปรโมชัน');

        await expect(tagPage.coverImg_PromotionCard).toBeVisible();
        await tagPage.coverImg_PromotionCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    test('Tag_Desktop_006: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดโปรโมชัน', async ({ page }) => {
        await skipIfNoCard(tagPage.promotionCard, 'โปรโมชัน');

        await expect(tagPage.title_PromotionCard).toBeVisible();
        await tagPage.title_PromotionCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    test('Tag_Desktop_007: ตรวจสอบการกดรูปภาพ บนการ์ดบทความ', async ({ page }) => {
        await skipIfNoCard(tagPage.articleCard, 'บทความ');

        await expect(tagPage.coverImg_ArticleCard).toBeVisible();
        await tagPage.coverImg_ArticleCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    test('Tag_Desktop_008: ตรวจสอบการกดชื่ออีเว้นต์ บนการ์ดบทความ', async ({ page }) => {
        await skipIfNoCard(tagPage.articleCard, 'บทความ');

        await expect(tagPage.title_ArticleCard).toBeVisible();
        await tagPage.title_ArticleCard.click();

        await expect(page).toHaveURL(DETAIL_URL);
    });

    test('Tag_Desktop_009: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        const cases = [
            { name: 'บทความ', card: tagPage.articleCard, btn: tagPage.loveArticle_Btn },
            { name: 'โปรโมชัน', card: tagPage.promotionCard, btn: tagPage.lovePromotion_Btn },
        ];

        for (const c of cases) {
            await test.step(`Like การ์ด${c.name}`, async () => {
                if ((await c.card.count()) === 0) return;

                await c.btn.click();

                // ASSUMPTION: ถ้ายังไม่ login จะขึ้น dialog หรือพาไปหน้า login
                // ปรับ locator ให้ตรงกับเว็บจริง
                const loginUI = page.getByRole('dialog').or(page.locator('[class*="Login"]')).first();
                await expect(loginUI.or(page.locator('body:has-text("เข้าสู่ระบบ")'))).toBeVisible();
            });
        }
    });

    test.fixme('Tag_Desktop_010: ตรวจสอบการกดปุ่ม "Like" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        // FIXME: รอ login helper (ยังไม่มีใน POM ที่ส่งมา)
        // flow: login -> กลับมาหน้า Tag -> กด loveArticle_Btn / lovePromotion_Btn -> ตรวจสถานะปุ่ม
    });

    test.fixme('Tag_Desktop_011: ตรวจสอบการกดปุ่ม "Like" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        // FIXME: รอ login helper
        // flow: login -> Like -> Like ซ้ำ -> ตรวจว่าสถานะกลับเป็นเดิม
    });

    test('Tag_Desktop_012: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณียังไม่เข้าสู่ระบบ', async ({ page }) => {
        const cases = [
            { name: 'บทความ', card: tagPage.articleCard, btn: tagPage.bookmarkArticle_Btn },
            { name: 'โปรโมชัน', card: tagPage.promotionCard, btn: tagPage.bookmarkPromotion_Btn },
        ];

        for (const c of cases) {
            await test.step(`Bookmark การ์ด${c.name}`, async () => {
                if ((await c.card.count()) === 0) return;

                await c.btn.click();

                // ASSUMPTION: เหมือนข้อ 009
                const loginUI = page.getByRole('dialog').or(page.locator('[class*="Login"]')).first();
                await expect(loginUI.or(page.locator('body:has-text("เข้าสู่ระบบ")'))).toBeVisible();
            });
        }
    });

    test.fixme('Tag_Desktop_013: ตรวจสอบการกดปุ่ม "Bookmark" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        // FIXME: รอ login helper
    });

    test.fixme('Tag_Desktop_014: ตรวจสอบการกดปุ่ม "Bookmark" ซ้ำบนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        // FIXME: รอ login helper
    });

    test.fixme('Tag_Desktop_015: ตรวจสอบการกดปุ่ม "Share" บนการ์ดต่างๆ กรณีเข้าสู่ระบบแล้ว', async () => {
        // FIXME: รอ login helper
        // หลัง login: กด shareArticle_Btn / sharePromotion_Btn -> ตรวจว่า popup ทั้ง 3 ปุ่มแสดง
    });

    // ---------- Share popup (016-018) ----------
    // ASSUMPTION: ปุ่ม Share เปิด popup ได้โดยไม่ต้อง login และกดไอคอนแล้วเปิดหน้าต่างใหม่
    // ถ้าต้อง login ให้ย้ายไปทำหลังมี login helper

    const shareCases = [
        { id: '016', label: 'Facebook', btn: () => tagPage.shareOnFacebook_Btn, url: /facebook\.com/ },
        { id: '017', label: 'X', btn: () => tagPage.shareOnX_Btn, url: /(x|twitter)\.com/ },
        { id: '018', label: 'Line', btn: () => tagPage.shareOnLine_Btn, url: /line\.me/ },
    ];

    for (const s of shareCases) {
        test(`Tag_Desktop_${s.id}: ตรวจสอบการกด "Icon ${s.label}" เพื่อ Share การ์ดต่างๆ`, async ({ page }) => {
            const cards = [
                { name: 'บทความ', card: tagPage.articleCard, shareBtn: tagPage.shareArticle_Btn },
                { name: 'โปรโมชัน', card: tagPage.promotionCard, shareBtn: tagPage.sharePromotion_Btn },
            ];

            for (const c of cards) {
                await test.step(`Share ${s.label} จากการ์ด${c.name}`, async () => {
                    if ((await c.card.count()) === 0) return;

                    await c.shareBtn.click();
                    await expect(s.btn()).toBeVisible();

                    const [popup] = await Promise.all([
                        page.waitForEvent('popup'),
                        s.btn().click(),
                    ]);

                    await popup.waitForLoadState('domcontentloaded');
                    expect(popup.url()).toMatch(s.url);
                    await popup.close();
                });
            }
        });
    }

    test('Tag_Desktop_019: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll ลง', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await expect(page.locator('#btn-scroll-up')).toBeVisible();
    });

    test('Tag_Desktop_020: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await page.locator('#btn-scroll-up').click();

        await expect.poll(async () => {
            return await page.evaluate(() => window.scrollY);
        }).toBeLessThan(100);
    });
});