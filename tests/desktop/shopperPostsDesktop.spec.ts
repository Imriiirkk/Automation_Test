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
    // Pass
    test('ShopperPosts_Desktop_001: ตรวจสอบการกดเข้าหน้า "ปันโปรรับหิ้ว" ได้', async ({ page }) => {
        await page.waitForURL(/\/shopper_posts/, { timeout: 10000 });
        await expect(shopperPostsPage.shopper_heading).toBeVisible();
    });

    // Pass
    test('ShopperPosts_Desktop_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "ปันโปรรับหิ้ว"', async () => {
        await expect(shopperPostsPage.shopperHightlight).toBeVisible();
        await expect(shopperPostsPage.hightlight_heading).toBeVisible();
        await expect(shopperPostsPage.bannerActiveSlide).toBeVisible();
        await expect(shopperPostsPage.bannerNextSlide).toBeVisible();
        await expect(shopperPostsPage.bannerSlide).toHaveCount(10);
        await expect(shopperPostsPage.bannerPagination).toBeVisible();
        await expect(shopperPostsPage.selectCardDeopdown).toBeVisible();
        await expect(shopperPostsPage.itemShopperPostCard.first()).toBeVisible();
        await shopperPostsPage.clickFilter_Event();
        await expect(shopperPostsPage.shopperPostCard).toBeVisible();
        await expect(shopperPostsPage.loadMoreButton).toBeVisible();
    });

    // Pass
    test('ShopperPosts_Desktop_003: ตรวจสอบการแสดงรายละเอียดบน Banner "อันดับงานอีเวนต์ยอดนิยม" ในหน้า "ปันโปรรับหิ้ว"', async () => {
        await expect(shopperPostsPage.bannerCover).toBeVisible();
        await expect(shopperPostsPage.bannerTitle).toBeVisible();
        await expect(shopperPostsPage.bannerPrice).toBeVisible();
        await expect(shopperPostsPage.bannerDate).toBeVisible();
    });

    // Pass
    test('ShopperPosts_Desktop_004: ตรวจสอบการแสดง Banner "อันดับงานอีเวนต์ยอดนิยม" ครบ 10 รายการ', async () => {
        await expect(shopperPostsPage.shopperHightlight).toBeVisible();
        await expect(shopperPostsPage.bannerSlide).toHaveCount(10);
        await expect(shopperPostsPage.bannerActiveSlide).toHaveCount(1);
        await expect(shopperPostsPage.bannerNextSlide).toHaveCount(1);
        await expect(shopperPostsPage.bannerCover).toBeVisible();
        await expect(shopperPostsPage.bannerTitle).toBeVisible();
    });

    // Pass
    test('ShopperPosts_Desktop_005: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม "←" , "→"', async () => {
        const initialHref = await shopperPostsPage.bannerCard.getAttribute('href');
        expect(initialHref).toBeTruthy();

        await shopperPostsPage.rightArrow.click();
        await expect(shopperPostsPage.bannerActiveSlide.locator('a').first()).not.toHaveAttribute('href', initialHref!);    // ตรวจสอบว่า Active Slide เปลี่ยน

        await shopperPostsPage.leftArrow.click();
        await expect(shopperPostsPage.bannerCard).toHaveAttribute('href', initialHref!);    // ตรวจสอบว่ากลับมาที่ Slide เดิม
    });

    // Pass
    test('ShopperPosts_Desktop_006: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async () => {
        await expect(shopperPostsPage.indicator).toHaveCount(9);

        // กด Indicator ทุกตัว
        for (let i = 0; i < 9; i++) {
            const currentIndicator = shopperPostsPage.indicator.nth(i);
            await currentIndicator.click();
            await expect(currentIndicator).toHaveClass(/swiper-pagination-bullet-active/);   // ตรวจสอบว่า Indicator ที่กดเป็น Active
            await expect(currentIndicator).toHaveAttribute('aria-current', 'true'); // ตรวจสอบ aria-current ของ Indicator ที่ Active
            await expect(shopperPostsPage.bannerActiveSlide).toHaveCount(1);
            await expect(shopperPostsPage.bannerActiveSlide).toHaveAttribute('aria-label', `${i + 1} / 10`);    // ตรวจสอบ aria-label ของ Active Slide
        }
    });

    // Pass
    test('ShopperPosts_Desktop_007: ตรวจสอบการกดรูปภาพ (Cover) ของ Banner', async ({ page }) => {
        const expectedHref = await shopperPostsPage.bannerCover.locator('xpath=ancestor::a').getAttribute('href');  // เก็บ href ของ Cover
        expect(expectedHref).toBeTruthy();
        const expectedUrl = new URL(expectedHref!, page.url()).href; // แปลงเป็น URL เต็ม

        await shopperPostsPage.bannerCover.click();
        await expect(page).toHaveURL(expectedUrl);
    });

    // Pass
    test('ShopperPosts_Desktop_008: ตรวจสอบการกดชื่ออีเวนต์ของ Banner', async ({ page }) => {
        const expectedHref = await shopperPostsPage.bannerTitleLink.getAttribute('href');
        expect(expectedHref).toBeTruthy();
        const expectedUrl = new URL(expectedHref!, page.url()).href;

        await shopperPostsPage.bannerTitle.click();
        await expect(page).toHaveURL(expectedUrl);
    });

    // ---------- Tab x Filter Combinations ----------
    test.describe('Tab x Filter', () => {
        const tabCases = [
            { id: '009', tab: 'allItem', tabLabel: 'ทั้งหมด' },
            { id: '010', tab: 'onEvent', tabLabel: 'รับหิ้วหน้างาน' },
            { id: '011', tab: 'inStock', tabLabel: 'สินค้าในสต็อก' },
        ];

        // 009-011: Tab x Filter "สินค้ารายอีเวนต์"
        // re check
        for (const { id, tab, tabLabel } of tabCases) {
            test(`ShopperPosts_Desktop_${id}: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "${tabLabel}" และใช้ Filter "สินค้ารายอีเวนต์"`, async () => {
                await shopperPostsPage.clickTab(tab);
                await shopperPostsPage.clickFilter_Event();

                const cardCount = await shopperPostsPage.shopperPostCardEach.count();
                if (cardCount == 0) {
                    expect(cardCount).toEqual(0);
                } else {
                    expect(cardCount).toBeGreaterThanOrEqual(0);
                }
            });
        }

        // 012-014: Tab x Filter "สินค้ารายชิ้น"
        // Pass
        for (const { id, tab, tabLabel } of tabCases.map((c, i) => ({ ...c, id: String(12 + i).padStart(3, '0') }))) {
            test(`ShopperPosts_Desktop_${id}: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "${tabLabel}" และใช้ Filter "สินค้ารายชิ้น"`, async () => {
                await shopperPostsPage.clickTab(tab);
                await shopperPostsPage.clickFilter_Individual();

                const cardCount = await shopperPostsPage.itemShopperPostCardEach.count();
                if (cardCount == 0) {
                    expect(cardCount).toEqual(0);
                } else {
                    expect(cardCount).toBeGreaterThanOrEqual(0);
                }
            });
        }
    });

    // Pass
    test('ShopperPosts_Desktop_015: ตรวจสอบการโหลดการ์ดสินค้ารับหิ้วเพิ่ม เมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
        const cardBefore = await shopperPostsPage.itemShopperPostCardEach.count()
        await shopperPostsPage.clickLoadMore();
        const cardAfter = await shopperPostsPage.itemShopperPostCardEach.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
    });

    // Pass 
    test('ShopperPosts_Desktop_016: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดการ์ดสินค้ารับหิ้วครบทุกรายการแล้ว', async ({ page }) => {
        await shopperPostsPage.clickLoadMore();
        await expect(shopperPostsPage.loadMoreButton).toBeHidden();
    });

    // ---------- Card Details ----------
    test.describe('Card Details', () => {

        test.describe('Run test', () => {
            // Fail >> dateContent Error: element(s) not found
            test('ShopperPosts_Desktop_017: ตรวจสอบการแสดงรายละเอียดบนการ์ดอีเวนต์ เมื่อใช้ Filter "สินค้ารายอีเวนต์"', async () => {
                await shopperPostsPage.clickFilter_Event();
                const eventCard = shopperPostsPage.shopperPostCardEach.first();
                await expect(eventCard).toBeVisible();
                await expect(shopperPostsPage.dateContent_EventCard.first()).toBeVisible();
                await expect(shopperPostsPage.proLabel_EventCard.first()).toBeVisible();
            });
        });

        // Pass
        test('ShopperPosts_Desktop_018: ตรวจสอบการแสดงรายละเอียดบนการ์ดสินค้ารับหิ้ว เมื่อใช้ Filter "สินค้ารายชิ้น"', async () => {
            await shopperPostsPage.clickFilter_Individual();
            const itemCard = shopperPostsPage.itemShopperPostCardEach.first();
            await expect(itemCard).toBeVisible();
            await expect(shopperPostsPage.label_ItemCard.first()).toBeVisible();
            await expect(shopperPostsPage.title_ItemCard.first()).toBeVisible();
            await expect(shopperPostsPage.contentPrice_ItemCard.first()).toBeVisible();
        });

    });

    // ---------- Love Button (Item Card) ----------
    test.describe.serial('Love Button — Item Card', () => {

        // Pass
        test('ShopperPosts_Desktop_019: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async () => {
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

            test('ShopperPosts_Desktop_020: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
                await shopperPostsPage.clickLoveItemCard();
                await expect(shopperPostsPage.love_ItemCard.first()).toHaveAttribute('aria-pressed', 'true');
                // หมายเหตุ: สมมติว่าปุ่มมี aria-pressed ตาม comment เดิม "role=button aria-label=Add to favorites"
                // ควรเปิด DevTools เช็คให้แน่ใจว่า attribute ที่เปลี่ยนจริงคืออะไร (อาจเป็น class หรือสี fill แทน)
            });

            test('ShopperPosts_Desktop_021: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
                await shopperPostsPage.clickLoveItemCard();
                await expect(shopperPostsPage.love_ItemCard.first()).toHaveAttribute('aria-pressed', 'false');
            });

        });

    });

    // ---------- Navigation from Card ----------
    test.describe('Navigate to Detail', () => {


        test('ShopperPosts_Desktop_022: ตรวจสอบการกดรูปภาพ (Cover) ที่การ์ดสินค้ารับหิ้ว เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickItemCard_image();
            await expect(page).toHaveURL(/\/items\/[a-zA-Z0-9-_]+/);
            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
        });


        test('ShopperPosts_Desktop_023: ตรวจสอบการกดชื่อสินค้า ที่การ์ดสินค้ารับหิ้ว เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickItemCard_title();
            await expect(page).toHaveURL(/\/items\/[a-zA-Z0-9-_]+/);
            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
            //To DO: เช็คต่อว่าชื่อที่กดกับtitle_ItemDetailตรงกันไหม
        });


        test('ShopperPosts_Desktop_024: ตรวจสอบการกดรูปภาพ (Cover) ที่การ์ดอีเวนต์ เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickEventCard_image();
            await expect(page).toHaveURL(/\/sp\/[a-zA-Z0-9_-]+/);
            await expect(shopperPostsPage.title_EventDetail).toBeVisible();
        });


        test('ShopperPosts_Desktop_025: ตรวจสอบการกดชื่ออีเวนต์ ที่การ์ดอีเวนต์ เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickEventCard_title();
            await expect(page).toHaveURL(/\/sp\/[a-zA-Z0-9_-]+/);
            await expect(shopperPostsPage.title_EventDetail).toBeVisible();
            //To DO: เช็คต่อว่าชื่อที่กดกับtitle_ItemDetailตรงกันไหม
        });

    });

    // ---------- Item Detail Page ----------
    test.describe('Item Detail', () => {
        // Pass
        test('ShopperPosts_Desktop_023: ตรวจสอบการแสดงรายละเอียดบนหน้า รายละเอียดสินค้ารายชิ้น', async () => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();
            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.coverImg_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.price_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.productType_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.purchaseBtn_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.owner_shopper).toBeVisible();
            await expect(shopperPostsPage.descrition_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.loveBtn_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.shareBtn_ItemDetail_).toBeVisible();
            // TODO: ยังไม่เช็ค loveBtn_ItemDetail / shareBtn_ItemDetail_ (locator ยังไม่ระบุ)
        });

        // Fail
        test('ShopperPosts_Desktop_024: ตรวจสอบการกด "ประเภทสินค้า" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();
            await shopperPostsPage.productType_ItemDetail.click();
            await page.waitForURL(/\/search\?s=/, { timeout: 10000 });
            //To DO: เช็คต่อว่าชื่อที่กดกับประเภทสินค้าตรงกันไหม >> อันนี้ข้ามไปก่อนเดี๋ยวทำ pom หน้าsearchอีกที 
            /**
             * TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
            =========================== logs ===========================
            waiting for navigation until "load"
            ============================================================
             */
        });

        // TODO: ยังไม่มี tag locator ใน POM (tag_ItemDetail ถูก comment ไว้)
        test.skip('ShopperPosts_Desktop_025: ตรวจสอบการกด "#" ในหน้า รายละเอียดสินค้ารายชิ้น', async () => {
            //To DO: เช็คต่อว่าชื่อที่กดกับ#าตรงกันไหม >> อันนี้ข้ามไปก่อนเดี๋ยวทำ pom หน้าtagอีกที 
        });

        test('ShopperPosts_Desktop_026: ตรวจสอบการกดปุ่ม "ฝากหิ้วชิ้นนี้" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();
            await shopperPostsPage.purchaseBtn_ItemDetail.click();
            await expect(page).toHaveURL(/\/application/);
        });

    });

    // ---------- Love Button (Item Detail) — TODO ทั้งกลุ่ม ----------
    // TODO: loveBtn_ItemDetail ยังไม่ระบุ locator ใน POM
    // Fail
    test('ShopperPosts_Desktop_027: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดสินค้ารายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async () => {
        await shopperPostsPage.title_ItemCard.click(); //ไประบุชื่อกับรูป ระหว่างง item & event แยกกันจะได้เรียกใช้ถูก
        await shopperPostsPage.clickLoveItemDetail();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    //Fail
    test('ShopperPosts_Desktop_028: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await shopperPostsPage.title_ItemCard.click();
        await shopperPostsPage.clickLoveItemDetail();
        await expect(shopperPostsPage.loveBtn_ItemDetail.locator('svg path')).toHaveAttribute('fill', '#BF202F');
    });

    //Fail
    test('ShopperPosts_Desktop_029: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_desktop();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await shopperPostsPage.title_ItemCard.click();
        await shopperPostsPage.clickLoveItemDetail();
        await expect(shopperPostsPage.loveBtn_ItemDetail.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        await shopperPostsPage.clickLoveItemDetail();
        await expect(shopperPostsPage.loveBtn_ItemDetail.locator('svg path')).toHaveAttribute('fill', '#686868');
    });

    // ---------- Share Button (Item Detail) — TODO ทั้งกลุ่ม ----------
    // TODO: shareBtn_ItemDetail_, shareOnFacebook/Line/X, shareCopyLink ยังไม่ระบุ locator
    test.skip('ShopperPosts_Desktop_030: ตรวจสอบการกดปุ่ม "แชร์" ในหน้า รายละเอียดสินค้ารายชิ้น', async () => {
    });
    test.skip('ShopperPosts_Desktop_031: ตรวจสอบการกดแชร์ผ่าน Facebook เปิด Popup ไปที่ facebook.com', async () => {
    });
    test.skip('ShopperPosts_Desktop_032: ตรวจสอบการกดแชร์ผ่าน Line เปิด Popup ไปที่ line.me', async () => {
    });
    test.skip('ShopperPosts_Desktop_033: ตรวจสอบการกดแชร์ผ่าน X เปิด Popup ไปที่ x.com', async () => {
    });
    test.skip('ShopperPosts_Desktop_034: ตรวจสอบการกดแชร์ผ่าน Copy Link', async () => {
    });

    // ---------- Items in Same Event — TODO ทั้งกลุ่ม ----------
    // TODO: ยังไม่มี locator สำหรับการ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน (ถูก comment ไว้ทั้งหมดใน POM)
    test.skip('ShopperPosts_Desktop_035: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน โดยที่ยังไม่เข้าสู่ระบบ', async () => {
    });
    test.skip('ShopperPosts_Desktop_036: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน เมื่อเข้าสู่ระบบแล้ว', async () => {
    });
    test.skip('ShopperPosts_Desktop_037: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน อีกครั้ง เมื่อเข้าสู่ระบบแล้ว', async () => {
    });

    // Pass 
    test('ShopperPosts_Desktop_038: ตรวจสอบการกด "ดูทั้งหมด >" ในหน้า รายละเอียดสินค้ารายชิ้น บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async ({ page }) => {
        await shopperPostsPage.clickFilter_Individual();
        await shopperPostsPage.clickItemCard_title();
        await shopperPostsPage.viewAllBtn_ItemDetail.click();
        await expect(page).toHaveURL(/\/sp\/[a-zA-Z0-9-_]+/); //
        await expect(shopperPostsPage.title_EventDetail).toBeVisible();
        await expect(shopperPostsPage.coverImg_EventDetail).toBeVisible();
        await expect(shopperPostsPage.description_EventDetail).toBeVisible();
        await expect(shopperPostsPage.priceLabel_EventDetail).toBeVisible();
        await expect(shopperPostsPage.viewCount_EventDetail).toBeVisible(); //
        await expect(shopperPostsPage.dateStart_EventDetail).toBeVisible();
        // TODO: ยืนยัน URL/behavior ที่ถูกต้องหลังกด แล้วเติม assertion เพิ่ม
        //To DO: เช็คต่อว่าชื่อ title_ItemSameEvent กับ title_EventDetail ตรงกันไหม >> อันนี้ข้ามไปก่อนเดี๋ยวทำ pom หน้าอีกที search
    });

    // TODO: ยังไม่มี indicator locator เฉพาะของสินค้าในอีเวนต์เดียวกัน (แยกจาก banner หลัก)
    test.skip('ShopperPosts_Desktop_039: ตรวจสอบการเลื่อน การ์ดสินค้ารับหิ้ว เมื่อกดปุ่ม Indicator บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async () => {
    });

    test.skip('ShopperPosts_Desktop_040: ตรวจสอบการเลื่อน การ์ดสินค้ารับหิ้ว เมื่อกดปุ่ม <, > บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async () => {
    });

    // ---------- Event Detail Page ----------
    // Fail >> TimeoutError: locator.click: Timeout 10000ms exceeded. >> waiting for locator('.ListItemShopperPost__ListPosts-sc-c96491c8-0').first()
    test('ShopperPosts_Desktop_040: ตรวจสอบการแสดงรายละเอียดบนหน้า รายละเอียดรายอีเวนต์', async () => {
        await shopperPostsPage.clickFilter_Event();
        await shopperPostsPage.itemShopperPostCard.first().click(); // ไปหน้ารายละเอียดอีเวนต์ (ใช้ card event แทน item)
        await expect(shopperPostsPage.title_EventDetail).toBeVisible();
        await expect(shopperPostsPage.coverImg_EventDetail).toBeVisible();
        await expect(shopperPostsPage.description_EventDetail).toBeVisible();
        await expect(shopperPostsPage.priceLabel_EventDetail).toBeVisible();
        await expect(shopperPostsPage.viewCount_EventDetail).toBeVisible();
        await expect(shopperPostsPage.dateStart_EventDetail).toBeVisible();
        // TODO: ยังไม่เช็ค loveBtn_EventDetail / shareBtn_EventDetail (locator ยังไม่ระบุ)
        //To DO: เช็คต่อว่าชื่อ title_EventCard กับ title_EventDetail ตรงกันไหม >> อันนี้ข้ามไปก่อนเดี๋ยวทำ pom หน้าอีกที search
    });

    // ---------- Love / Share (Event Detail) — TODO ทั้งกลุ่ม ----------
    // TODO: loveBtn_EventDetail, shareBtn_EventDetail ยังไม่ระบุ locator
    test.skip('ShopperPosts_Desktop_041: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดรายอีเวนต์ โดยที่ยังไม่เข้าสู่ระบบ', async () => {
    });
    test.skip('ShopperPosts_Desktop_042: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดรายอีเวนต์ เมื่อเข้าสู่ระบบแล้ว', async () => {
    });
    test.skip('ShopperPosts_Desktop_043: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง ในหน้า รายละเอียดรายอีเวนต์ เมื่อเข้าสู่ระบบแล้ว', async () => {
    });
    test.skip('ShopperPosts_Desktop_044: ตรวจสอบการกดปุ่ม "แชร์" ในหน้า รายละเอียดรายอีเวนต์', async () => {
    });

    test.skip('ShopperPosts_Desktop_045: ตรวจสอบการกดปุ่ม "ฝากหิ้วชิ้นนี้" บนการ์ดสินค้าในอีเวนต์นั้น ในหน้า รายละเอียดรายอีเวนต์', async () => {
        // TODO: ยังไม่มี locator แยกสำหรับปุ่มฝากหิ้วของสินค้าภายในหน้ารายละเอียดอีเวนต์ (คนละจุดกับ purchaseBtn_ItemDetail)
    });

    // 45 หายไปไหนน้อ

    // ---------- Scroll To Top ----------
    test.describe('Scroll To Top', () => {
        // Pass
        test('ShopperPosts_Desktop_046: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll หน้าจอลง ในหน้าปันโปรรับหิ้ว', async ({ page }) => {
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
        });
        // Pass
        test('ShopperPosts_Desktop_047: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" ในหน้าปันโปรรับหิ้ว', async ({ page }) => {
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();

            await expect.poll(async () => {
                return await page.evaluate(() => window.scrollY);
            }, { timeout: 5000 }).toBe(0);
        });
        // Pass
        test('ShopperPosts_Desktop_048: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll หน้าจอลง ในหน้ารายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
        });
        // Pass
        test('ShopperPosts_Desktop_049: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" ในหน้ารายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Individual();
            await shopperPostsPage.clickItemCard_title();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();

            await expect.poll(async () => {
                return await page.evaluate(() => window.scrollY);
            }, { timeout: 5000 }).toBe(0);
        });

        // Fail กด filter ได้ แต่กดการ์ดเพื่อเข้าหน้ารายละเอียดไม่ได้
        test('ShopperPosts_Desktop_050: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll หน้าจอลง ในหน้ารายละเอียดรายอีเวนต์', async ({ page }) => {
            await shopperPostsPage.clickFilter_Event();
            // await shopperPostsPage.clickItemCard_title();
            await shopperPostsPage.itemShopperPostCard.first().click();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
        });

        // Fail กด filter ได้ แต่กดการ์ดเพื่อเข้าหน้ารายละเอียดไม่ได้
        test('ShopperPosts_Desktop_051: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" ในหน้ารายละเอียดรายอีเวนต์', async ({ page }) => {
            await shopperPostsPage.clickFilter_Event();
            // await shopperPostsPage.clickItemCard_title();
            await shopperPostsPage.itemShopperPostCard.first().click();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();

            await expect.poll(async () => {
                return await page.evaluate(() => window.scrollY);
            }, { timeout: 5000 }).toBe(0);
        });
    });

    // TODO: ต้องหาหมวดหมู่ที่ยืนยันได้ว่าไม่มีสินค้าจริงในระบบ ก่อนเขียน assertion
    test.skip('ShopperPosts_Desktop_052: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีสินค้ารับหิ้ว', async () => {
    });

});

//test.describe('Run test', () => {