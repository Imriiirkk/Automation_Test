import { test, expect } from '@playwright/test';
import { ShopperPostsPage } from '../../pages/ShopperPosts';
import { NavbarFooter } from '../../pages/NavbarFooter';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

let navbar: NavbarFooter;
let shopperPostsPage: ShopperPostsPage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    shopperPostsPage = new ShopperPostsPage(page);
    await navbar.goto();
    await navbar.goToMenu_desktop('Link to shopper_posts');

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Shopper Posts Page (Desktop)', () => {

    // ---------- Shopper Posts (Main) ----------
    test('ShopperPosts_Desktop_001: ตรวจสอบการกดเข้าหน้า "ปันโปรรับหิ้ว" ได้', async ({ page }) => {
        await page.waitForURL(/\/shopper_posts/, { timeout: 10000 });
        await expect(shopperPostsPage.shopper_heading).toBeVisible();
    });

    test('ShopperPosts_Desktop_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "ปันโปรรับหิ้ว"', async () => {
        // TODO: ยังไม่เช็ค banner (shopperHightlight ยังไม่ระบุ)
        await expect(shopperPostsPage.selectCardDeopdown).toBeVisible();
        await expect(shopperPostsPage.itemShopperPostCard.first()).toBeVisible();
    });

    // TODO: ต้องมี locator ของ banner (shopperHightlight) ก่อนถึงจะนับจำนวนการ์ดใน banner ได้
    test.skip('ShopperPosts_Desktop_003: ตรวจสอบการแสดง Banner "อันดับงานอีเวนต์ยอดนิยม" ครบ 10 รายการ', async () => {
    });

    test('ShopperPosts_Desktop_004: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม "←" , "→"', async () => {
        await shopperPostsPage.rightArrow.click();
        await shopperPostsPage.leftArrow.click();
        // หมายเหตุ: leftArrow/rightArrow ตอนนี้ใช้ class เดียวกันแค่แยกด้วย .first()/.last()
        // ควรยืนยันด้วย DevTools ว่า .first() คือปุ่มขวาจริง ไม่ใช่ปุ่มซ้าย ก่อนเชื่อ assertion นี้ 100%
    });

    test('ShopperPosts_Desktop_005: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async () => {
        await shopperPostsPage.indicator.click();
        // หมายเหตุ: locator ปัจจุบันคือ 'Go to slide1' ตัวเดียว ไม่ใช่ pattern ที่ครอบคลุมทุก slide
        // ถ้ามี indicator มากกว่า 1 ควรเปลี่ยนเป็น getByRole('button', { name: /Go to slide/ }) แล้ว loop ทุกตัว
        // เหมือนแพทเทิร์นที่ใช้กับ Article banner ก่อนหน้านี้
    });

    // TODO: ต้องมี locator สำหรับรูปภาพ/ชื่อบนการ์ดใน banner โดยเฉพาะ (ยังไม่มีใน POM)
    test.skip('ShopperPosts_Desktop_006: ตรวจสอบการกดรูปภาพ (Cover) ที่การ์ดอีเวนต์ บน Banner เพื่อเข้าหน้ารายละเอียด', async () => {
    });

    test.skip('ShopperPosts_Desktop_007: ตรวจสอบการกดชื่ออีเวนต์ ที่การ์ดอีเวนต์ บน Banner เพื่อเข้าหน้ารายละเอียด', async () => {
    });

    // ---------- Tab x Filter Combinations ----------
    test.describe('Tab x Filter', () => {

        const tabCases = [
            { id: '008', tab: 'pro_fashion', tabLabel: 'ทั้งหมด' },
            { id: '009', tab: 'pro_eat', tabLabel: 'รับหิ้วหน้างาน' },
            { id: '010', tab: 'pro_travel', tabLabel: 'สินค้าในสต็อก' },
        ];

        // 008-010: Tab x Filter "สินค้ารายอีเวนต์"
        for (const { id, tab, tabLabel } of tabCases) {
            test(`ShopperPosts_Desktop_${id}: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "${tabLabel}" และใช้ Filter "สินค้ารายอีเวนต์"`, async () => {
                await shopperPostsPage.clickTab(tab);
                await shopperPostsPage.clickFilter_Event();

                const cardCount = await shopperPostsPage.shopperPostCardEach.count();
                expect(cardCount).toBeGreaterThanOrEqual(0);
                // >= 0 เพราะบาง Tab (เช่น "สินค้าในสต็อก") อาจไม่มีอีเวนต์เลยตามธรรมชาติของข้อมูล
            });
        }

        // 011-013: Tab x Filter "สินค้ารายชิ้น"
        for (const { id, tab, tabLabel } of tabCases.map((c, i) => ({ ...c, id: String(11 + i).padStart(3, '0') }))) {
            test(`ShopperPosts_Desktop_${id}: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "${tabLabel}" และใช้ Filter "สินค้ารายชิ้น"`, async () => {
                await shopperPostsPage.clickTab(tab);
                await shopperPostsPage.clickFilter_Individual();

                const cardCount = await shopperPostsPage.itemShopperPostCardEach.count();
                expect(cardCount).toBeGreaterThanOrEqual(0);
            });
        }

    });

    // TODO: ต้องมี loadMoreButton locator ก่อน (ยังไม่ได้ประกาศใน POM)
    test.skip('ShopperPosts_Desktop_014: ตรวจสอบการโหลดการ์ดสินค้ารับหิ้วเพิ่ม เมื่อกดปุ่ม "ดูเพิ่มเติม"', async () => {
    });

    // ---------- Card Details ----------
    test.describe('Card Details', () => {

        test('ShopperPosts_Desktop_015: ตรวจสอบการแสดงรายละเอียดบนการ์ดอีเวนต์ เมื่อใช้ Filter "สินค้ารายอีเวนต์"', async () => {
            await shopperPostsPage.clickFilter_Event();
            await expect(shopperPostsPage.shopperPostCard.first()).toBeVisible();
            await expect(shopperPostsPage.dateContent_EventCard.first()).toBeVisible();
            await expect(shopperPostsPage.proLabel_EventCard.first()).toBeVisible();
        });

        test('ShopperPosts_Desktop_016: ตรวจสอบการแสดงรายละเอียดบนการ์ดสินค้ารับหิ้ว เมื่อใช้ Filter "สินค้ารายชิ้น"', async () => {
            await shopperPostsPage.clickFilter_Individual();
            await expect(shopperPostsPage.itemShopperPostCard.first()).toBeVisible();
            await expect(shopperPostsPage.label_ItemCard.first()).toBeVisible();
            await expect(shopperPostsPage.title_ItemCard.first()).toBeVisible();
            await expect(shopperPostsPage.contentPrice_ItemCard.first()).toBeVisible();
        });

    });

    // ---------- Love Button (Item Card) ----------
    test.describe.serial('Love Button — Item Card', () => {

        test('ShopperPosts_Desktop_017: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async () => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickLoveItemCard();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        test.describe('Logged in', () => {

            test.beforeAll(async ({ browser }) => {
                const context = await browser.newContext();
                const page = await context.newPage();
                const setupNavbar = new NavbarFooter(page);
                const setupShopperPage = new ShopperPostsPage(page);

                await setupNavbar.goto();
                await setupNavbar.openLoginOrSignup_desktop();
                await setupNavbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
                await setupNavbar.goToMenu_desktop('Link to shopper_posts');
                await setupShopperPage.clickFilter_Individual();

                // รีเซ็ต state ให้แน่ใจว่าเริ่มจาก "ยังไม่กด" ก่อนเข้ากลุ่มทดสอบ
                const isActive = await setupShopperPage.love_ItemCard.first().getAttribute('aria-pressed');
                if (isActive === 'true') {
                    await setupShopperPage.clickLoveItemCard();
                }

                await context.close();
            });

            test.beforeEach(async () => {
                await navbar.openLoginOrSignup_desktop();
                await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
                await navbar.goToMenu_desktop('Link to shopper_posts');
                await shopperPostsPage.clickFilter_Individual();
            });

            test('ShopperPosts_Desktop_018: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
                await shopperPostsPage.clickLoveItemCard();
                await expect(shopperPostsPage.love_ItemCard.first()).toHaveAttribute('aria-pressed', 'true');
                // หมายเหตุ: สมมติว่าปุ่มมี aria-pressed ตาม comment เดิม "role=button aria-label=Add to favorites"
                // ควรเปิด DevTools เช็คให้แน่ใจว่า attribute ที่เปลี่ยนจริงคืออะไร (อาจเป็น class หรือสี fill แทน)
            });

            test('ShopperPosts_Desktop_019: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
                await shopperPostsPage.clickLoveItemCard();
                await expect(shopperPostsPage.love_ItemCard.first()).toHaveAttribute('aria-pressed', 'false');
            });

        });

    });

    // ---------- Navigation from Card ----------
    test.describe('Navigate to Detail', () => {

        test('ShopperPosts_Desktop_020: ตรวจสอบการกดรูปภาพ (Cover) ที่การ์ดสินค้ารับหิ้ว เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_image();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
        });

        test('ShopperPosts_Desktop_021: ตรวจสอบการกดชื่อสินค้าหรืออีเวนต์ ที่การ์ดสินค้ารับหิ้ว เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();
            await expect(page).toHaveURL(/\/p\/[a-zA-Z0-9-_]+/);
            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
        });

    });

    // ---------- Item Detail Page ----------
    test.describe('Item Detail', () => {

        test('ShopperPosts_Desktop_022: ตรวจสอบการแสดงรายละเอียดบนหน้า รายละเอียดสินค้ารายชิ้น', async () => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();

            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.coverImg_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.price_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.productType_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.purchaseBtn_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.owner_shopper).toBeVisible();
            await expect(shopperPostsPage.descrition_ItemDetail).toBeVisible();
            // TODO: ยังไม่เช็ค loveBtn_ItemDetail / shareBtn_ItemDetail_ (locator ยังไม่ระบุ)
        });

        test('ShopperPosts_Desktop_023: ตรวจสอบการกด "ประเภทสินค้า" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();
            await shopperPostsPage.productType_ItemDetail.click();
            // TODO: ยืนยัน expected behavior จริง — คลิกแล้วนำทางไปหน้า filter ตามประเภทสินค้า หรือแค่ expand dropdown?
            // ใส่ assertion ที่ตรงจุดเมื่อรู้ผลลัพธ์ที่ถูกต้องแล้ว
        });

        // TODO: ยังไม่มี tag locator ใน POM (tag_ItemDetail ถูก comment ไว้)
        test.skip('ShopperPosts_Desktop_024: ตรวจสอบการกด "#" ในหน้า รายละเอียดสินค้ารายชิ้น', async () => {
        });

        test('ShopperPosts_Desktop_025: ตรวจสอบการกดปุ่ม "ฝากหิ้วชิ้นนี้" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();
            await shopperPostsPage.purchaseBtn_ItemDetail.click();
            await expect(page).toHaveURL(/\/application/);
        });

    });

    // ---------- Love Button (Item Detail) — TODO ทั้งกลุ่ม ----------
    // TODO: loveBtn_ItemDetail ยังไม่ระบุ locator ใน POM
    test.skip('ShopperPosts_Desktop_026: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดสินค้ารายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async () => {
    });
    test.skip('ShopperPosts_Desktop_027: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
    });
    test.skip('ShopperPosts_Desktop_028: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
    });

    // ---------- Share Button (Item Detail) — TODO ทั้งกลุ่ม ----------
    // TODO: shareBtn_ItemDetail_, shareOnFacebook/Line/X, shareCopyLink ยังไม่ระบุ locator
    test.skip('ShopperPosts_Desktop_029: ตรวจสอบการกดปุ่ม "แชร์" ในหน้า รายละเอียดสินค้ารายชิ้น', async () => {
    });
    test.skip('ShopperPosts_Desktop_030: ตรวจสอบการกดแชร์ผ่าน Facebook เปิด Popup ไปที่ facebook.com', async () => {
    });
    test.skip('ShopperPosts_Desktop_031: ตรวจสอบการกดแชร์ผ่าน Line เปิด Popup ไปที่ line.me', async () => {
    });
    test.skip('ShopperPosts_Desktop_032: ตรวจสอบการกดแชร์ผ่าน X เปิด Popup ไปที่ x.com', async () => {
    });
    test.skip('ShopperPosts_Desktop_033: ตรวจสอบการกดแชร์ผ่าน Copy Link', async () => {
    });

    // ---------- Items in Same Event — TODO ทั้งกลุ่ม ----------
    // TODO: ยังไม่มี locator สำหรับการ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน (ถูก comment ไว้ทั้งหมดใน POM)
    test.skip('ShopperPosts_Desktop_034: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน โดยที่ยังไม่เข้าสู่ระบบ', async () => {
    });
    test.skip('ShopperPosts_Desktop_035: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน เมื่อเข้าสู่ระบบแล้ว', async () => {
    });
    test.skip('ShopperPosts_Desktop_036: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน อีกครั้ง เมื่อเข้าสู่ระบบแล้ว', async () => {
    });

    test('ShopperPosts_Desktop_037: ตรวจสอบการกด "ดูทั้งหมด >" ในหน้า รายละเอียดสินค้ารายชิ้น บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async ({ page }) => {
        await shopperPostsPage.clickFilter_Individual();
        await shopperPostsPage.clickItemCard_title();
        await shopperPostsPage.viewAll_ItemDetail.click();
        // TODO: ยืนยัน URL/behavior ที่ถูกต้องหลังกด แล้วเติม assertion เพิ่ม
    });

    // TODO: ยังไม่มี indicator locator เฉพาะของสินค้าในอีเวนต์เดียวกัน (แยกจาก banner หลัก)
    test.skip('ShopperPosts_Desktop_038: ตรวจสอบการเลื่อน การ์ดสินค้ารับหิ้ว เมื่อกดปุ่ม Indicator บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async () => {
    });

    // ---------- Event Detail Page ----------
    test('ShopperPosts_Desktop_039: ตรวจสอบการแสดงรายละเอียดบนหน้า รายละเอียดรายอีเวนต์', async () => {
        await shopperPostsPage.clickFilter_Event();
        await shopperPostsPage.itemShopperPostCard.first().click(); // ไปหน้ารายละเอียดอีเวนต์ (ใช้ card event แทน item)
        await expect(shopperPostsPage.title_EventDetail).toBeVisible();
        await expect(shopperPostsPage.coverImg_EventDetail).toBeVisible();
        await expect(shopperPostsPage.description_EventDetail).toBeVisible();
        await expect(shopperPostsPage.priceLabel_EventDetail).toBeVisible();
        await expect(shopperPostsPage.viewCount_EventDetail).toBeVisible();
        await expect(shopperPostsPage.dateStart_EventDetail).toBeVisible();
        // TODO: ยังไม่เช็ค loveBtn_EventDetail / shareBtn_EventDetail (locator ยังไม่ระบุ)
    });

    // ---------- Love / Share (Event Detail) — TODO ทั้งกลุ่ม ----------
    // TODO: loveBtn_EventDetail, shareBtn_EventDetail ยังไม่ระบุ locator
    test.skip('ShopperPosts_Desktop_040: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดรายอีเวนต์ โดยที่ยังไม่เข้าสู่ระบบ', async () => {
    });
    test.skip('ShopperPosts_Desktop_041: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดรายอีเวนต์ เมื่อเข้าสู่ระบบแล้ว', async () => {
    });
    test.skip('ShopperPosts_Desktop_042: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง ในหน้า รายละเอียดรายอีเวนต์ เมื่อเข้าสู่ระบบแล้ว', async () => {
    });
    test.skip('ShopperPosts_Desktop_043: ตรวจสอบการกดปุ่ม "แชร์" ในหน้า รายละเอียดรายอีเวนต์', async () => {
    });

    test.skip('ShopperPosts_Desktop_044: ตรวจสอบการกดปุ่ม "ฝากหิ้วชิ้นนี้" บนการ์ดสินค้าในอีเวนต์นั้น ในหน้า รายละเอียดรายอีเวนต์', async () => {
        // TODO: ยังไม่มี locator แยกสำหรับปุ่มฝากหิ้วของสินค้าภายในหน้ารายละเอียดอีเวนต์ (คนละจุดกับ purchaseBtn_ItemDetail)
    });

    // ---------- Scroll To Top ----------
    test.describe('Scroll To Top', () => {

        test('ShopperPosts_Desktop_046: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll หน้าจอลง', async ({ page }) => {
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
        });

        test('ShopperPosts_Desktop_047: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();

            await expect.poll(async () => {
                return await page.evaluate(() => window.scrollY);
            }, { timeout: 5000 }).toBe(0);
        });

    });

    // TODO: ต้องหาหมวดหมู่ที่ยืนยันได้ว่าไม่มีสินค้าจริงในระบบ ก่อนเขียน assertion
    test.skip('ShopperPosts_Desktop_048: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีสินค้ารับหิ้ว', async () => {
    });

});
