import { test, expect } from '@playwright/test';
import { ShopperPostsPage } from '../../pages/ShopperPosts';
import { NavbarFooter } from '../../pages/NavbarFooter';

const VALID_EMAIL = ''; //อย่าลืมใส่อีเมลกับรหัสนะคะ
const VALID_PASSWORD = ''; //อย่าลืมใส่อีเมลกับรหัสนะคะ

let navbar: NavbarFooter;
let shopperPostsPage: ShopperPostsPage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    shopperPostsPage = new ShopperPostsPage(page);
    await navbar.goto();
    await navbar.goToMenu_mobile(navbar.shopperPostsMenu_mobile);
    // await navbar.goToMenu_desktop('Link to shopper_posts');

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Shopper Posts Page (Mobile)', () => {
    // ---------- Helpers (ใช้เฉพาะเคสที่เพิ่มใหม่) ----------
    const openItemDetail = async () => {
        await shopperPostsPage.clickFilter_Item();
        await shopperPostsPage.clickItemCard_title();
    };
    const openEventDetail = async () => {
        await shopperPostsPage.clickFilter_Event();
        await shopperPostsPage.clickEventCard_title();
    };

    // ---------- Shopper Posts (Main) ----------
    // Pass
    test('ShopperPosts_Mobile_001: ตรวจสอบการกดเข้าหน้า "ปันโปรรับหิ้ว" ได้', async ({ page }) => {
        await page.waitForURL(/\/shopper_posts/, { timeout: 10000 });
        await expect(shopperPostsPage.shopper_heading).toBeVisible();
    });

    // Pass
    test('ShopperPosts_Mobile_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "ปันโปรรับหิ้ว"', async () => {
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
    test('ShopperPosts_Mobile_003: ตรวจสอบการแสดงรายละเอียดบน Banner "อันดับงานอีเวนต์ยอดนิยม" ในหน้า "ปันโปรรับหิ้ว"', async () => {
        await expect(shopperPostsPage.bannerCover).toBeVisible();
        await expect(shopperPostsPage.bannerTitle).toBeVisible();
        await expect(shopperPostsPage.bannerPrice).toBeVisible();
        await expect(shopperPostsPage.bannerDate).toBeVisible();
    });

    // Pass
    test('ShopperPosts_Mobile_004: ตรวจสอบการแสดง Banner "อันดับงานอีเวนต์ยอดนิยม" ครบ 10 รายการ', async () => {
        await expect(shopperPostsPage.shopperHightlight).toBeVisible();
        await expect(shopperPostsPage.bannerSlide).toHaveCount(10);
        await expect(shopperPostsPage.bannerActiveSlide).toHaveCount(1);
        await expect(shopperPostsPage.bannerNextSlide).toHaveCount(1);
        await expect(shopperPostsPage.bannerCover).toBeVisible();
        await expect(shopperPostsPage.bannerTitle).toBeVisible();
    });

    // Pass
    test('ShopperPosts_Mobile_005: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async () => {
        await expect(shopperPostsPage.indicator).toHaveCount(10);

        // กด Indicator ทุกตัว
        for (let i = 0; i < 10; i++) {
            const currentIndicator = shopperPostsPage.indicator.nth(i);
            await currentIndicator.click();
            await expect(currentIndicator).toHaveClass(/swiper-pagination-bullet-active/);   // ตรวจสอบว่า Indicator ที่กดเป็น Active
            await expect(currentIndicator).toHaveAttribute('aria-current', 'true'); // ตรวจสอบ aria-current ของ Indicator ที่ Active
            await expect(shopperPostsPage.bannerActiveSlide).toHaveCount(1);
            await expect(shopperPostsPage.bannerActiveSlide).toHaveAttribute('aria-label', `${i + 1} / 10`);    // ตรวจสอบ aria-label ของ Active Slide
        }
    });

    // Pass
    test('ShopperPosts_Mobile_006: ตรวจสอบการกดรูปภาพ (Cover) ของ Banner', async ({ page }) => {
        const expectedHref = await shopperPostsPage.bannerCover.locator('xpath=ancestor::a').getAttribute('href');  // เก็บ href ของ Cover
        expect(expectedHref).toBeTruthy();
        const expectedUrl = new URL(expectedHref!, page.url()).href; // แปลงเป็น URL เต็ม

        await shopperPostsPage.bannerCover.click();
        await expect(page).toHaveURL(expectedUrl);
    });

    // Pass
    test('ShopperPosts_Mobile_007: ตรวจสอบการกดชื่ออีเวนต์ของ Banner', async ({ page }) => {
        const expectedHref = await shopperPostsPage.bannerTitleLink.getAttribute('href');
        expect(expectedHref).toBeTruthy();
        const expectedUrl = new URL(expectedHref!, page.url()).href;

        await shopperPostsPage.bannerTitle.click();
        await expect(page).toHaveURL(expectedUrl);
    });

    // ---------- Tab x Filter Combinations ----------
    test.describe('Tab x Filter', () => {
        const tabCases = [
            { id: '008', tab: 'allItem', tabLabel: 'ทั้งหมด' },
            { id: '009', tab: 'onEvent', tabLabel: 'รับหิ้วหน้างาน' },
            { id: '010', tab: 'inStock', tabLabel: 'สินค้าในสต็อก' },
        ];

        // 008-010: Tab x Filter "สินค้ารายอีเวนต์"
        // Pass
        for (const { id, tab, tabLabel } of tabCases) {
            test(`ShopperPosts_Mobile_${id}: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "${tabLabel}" และใช้ Filter "สินค้ารายอีเวนต์"`, async ({ page }) => {
                await shopperPostsPage.clickTab(tab);
                await shopperPostsPage.clickFilter_Event();

                await expect
                    .poll(
                        async () => await shopperPostsPage.shopperPostCardEach.count(),
                        {
                            timeout: 15000,
                        }
                    )
                    .toBeGreaterThan(0);

                await expect(shopperPostsPage.shopperPostCardEach.first()).toBeVisible();
            });
        }

        // 011-013: Tab x Filter "สินค้ารายชิ้น"
        // Pass
        for (const { id, tab, tabLabel } of tabCases.map((c, i) => ({ ...c, id: String(12 + i).padStart(3, '0') }))) {
            test(`ShopperPosts_Mobile_${id}: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "${tabLabel}" และใช้ Filter "สินค้ารายชิ้น"`, async ({ page }) => {
                await shopperPostsPage.clickTab(tab);
                await shopperPostsPage.clickFilter_Item();

                await expect
                    .poll(
                        async () => await shopperPostsPage.itemShopperPostCardEach.count(),
                        {
                            timeout: 15000,
                        }
                    )
                    .toBeGreaterThan(0);

                await expect(shopperPostsPage.itemShopperPostCardEach.first()).toBeVisible();
            });
        }
    });

    // Pass
    test('ShopperPosts_Mobile_014: ตรวจสอบการโหลดการ์ดสินค้ารับหิ้วเพิ่ม เมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
        const cardBefore = await shopperPostsPage.itemShopperPostCardEach.count()
        await shopperPostsPage.clickLoadMore();
        const cardAfter = await shopperPostsPage.itemShopperPostCardEach.count()
        expect(cardAfter).toBeGreaterThanOrEqual(cardBefore)
    });

    // Pass 
    test('ShopperPosts_Mobile_015: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดการ์ดสินค้ารับหิ้วครบทุกรายการแล้ว', async ({ page }) => {
        await shopperPostsPage.clickLoadMore();
        await expect(shopperPostsPage.loadMoreButton).toBeHidden();
    });


    // ---------- Card Details ---------- //////
    test.describe('Card Details', () => {
        // Pass
        test('ShopperPosts_Mobile_016: ตรวจสอบการแสดงรายละเอียดบนการ์ดอีเวนต์ เมื่อใช้ Filter "สินค้ารายอีเวนต์"', async () => {
            await shopperPostsPage.clickFilter_Event();
            const eventCard = shopperPostsPage.shopperPostCardEach.first();
            await expect(eventCard).toBeVisible();
            await expect(shopperPostsPage.dateContent_EventCard).toBeVisible();
            await expect(shopperPostsPage.proLabel_EventCard).toBeVisible();
        });

        // Pass
        test('ShopperPosts_Mobile_017: ตรวจสอบการแสดงรายละเอียดบนการ์ดสินค้ารับหิ้ว เมื่อใช้ Filter "สินค้ารายชิ้น"', async () => {
            await shopperPostsPage.clickFilter_Item();
            const itemCard = shopperPostsPage.itemShopperPostCardEach.first();
            await expect(itemCard).toBeVisible();
            await expect(shopperPostsPage.imgCover_ItemCard.first()).toBeVisible();
            await expect(shopperPostsPage.label_ItemCard.first()).toBeVisible();
            await expect(shopperPostsPage.title_ItemCard.first()).toBeVisible();
            await expect(shopperPostsPage.contentPrice_ItemCard.first()).toBeVisible();
        });

    });


    // ---------- Love Button (Item Card) ----------
    test.describe.serial('Love Button — Item Card', () => {

        // Pass
        test('ShopperPosts_Mobile_018: ตรวจสอบการกดปุ่ม "Like" บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async () => {
            await shopperPostsPage.clickFilter_Item();
            await shopperPostsPage.clickLoveItemCard();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Pass
        test('ShopperPosts_Mobile_019: ตรวจสอบการกดปุ่ม "Like" บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await shopperPostsPage.clickLoveItemCard();
            await expect(shopperPostsPage.love_ItemCard.first()).toHaveAttribute('aria-label', 'Remove from favorites');
        });

        // Pass
        test('ShopperPosts_Mobile_020: ตรวจสอบการกดปุ่ม "Like" อีกครั้ง บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await shopperPostsPage.clickLoveItemCard();
            await expect(shopperPostsPage.love_ItemCard.first()).toHaveAttribute('aria-label', 'Remove from favorites');
            await shopperPostsPage.clickLoveItemCard();
            await expect(shopperPostsPage.love_ItemCard.first()).toHaveAttribute('aria-label', 'Add to favorites');
        });
    });

    // ---------- Navigation from Card ----------
    test.describe('Navigate to Detail', () => {
        // Pass
        test('ShopperPosts_Mobile_021: ตรวจสอบการกดรูปภาพ (Cover) ที่การ์ดสินค้ารับหิ้ว เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickItemCard_image();
            await expect(page).toHaveURL(/\/items\/[a-zA-Z0-9-_]+/);
            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
        });

        // Pass
        test('ShopperPosts_Mobile_022: ตรวจสอบการกดชื่อสินค้า ที่การ์ดสินค้ารับหิ้ว เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            const itemTitle = await shopperPostsPage.title_ItemCard.first().innerText();
            await shopperPostsPage.clickItemCard_title();
            await expect(page).toHaveURL(/\/items\/[a-zA-Z0-9-_]+/);
            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.title_ItemDetail).toHaveText(itemTitle);
        });

        // Pass
        test('ShopperPosts_Mobile_023: ตรวจสอบการกดรูปภาพ (Cover) ที่การ์ดอีเวนต์ เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickFilter_Event();
            await shopperPostsPage.clickEventCard_image();
            await expect(page).toHaveURL(/\/sp\/[a-zA-Z0-9_-]+/);
            await expect(shopperPostsPage.title_EventDetail).toBeVisible();
        });

        // Pass
        test('ShopperPosts_Mobile_024: ตรวจสอบการกดชื่ออีเวนต์ ที่การ์ดอีเวนต์ เพื่อเข้าหน้ารายละเอียด', async ({ page }) => {
            await shopperPostsPage.clickFilter_Event();
            const itemTitle = await shopperPostsPage.title_EventCard.first().innerText();
            await shopperPostsPage.clickEventCard_title();
            await expect(page).toHaveURL(/\/sp\/[a-zA-Z0-9-_]+/);
            await expect(shopperPostsPage.title_EventDetail).toBeVisible();
            await expect(shopperPostsPage.title_EventDetail).toHaveText(itemTitle);
        });
    });

    // ---------- Item Detail Page ----------
    test.describe('Item Detail', () => {
        // Pass
        test('ShopperPosts_Mobile_025: ตรวจสอบการแสดงรายละเอียดบนหน้า รายละเอียดสินค้ารายชิ้น', async () => {
            await shopperPostsPage.clickFilter_Item();
            await shopperPostsPage.clickItemCard_title();
            await expect(shopperPostsPage.title_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.coverImg_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.price_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.productType_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.purchaseBtn_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.owner_shopper).toBeVisible();
            await expect(shopperPostsPage.descrition_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.loveBtn_ItemDetail).toBeVisible();
            await expect(shopperPostsPage.shareBtn_ItemDetail).toBeVisible();
        });

        // Pass
        test('ShopperPosts_Mobile_026: ตรวจสอบการกด "ประเภทสินค้า" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Item();
            await shopperPostsPage.clickItemCard_title();
            await shopperPostsPage.productType_ItemDetail.click();
            await page.waitForURL(/\/search\?s=/, { timeout: 10000 });
        });

        // Pass
        test('ShopperPosts_Mobile_027: ตรวจสอบการกด "#" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Item();
            await shopperPostsPage.clickItemCard_title();
            await shopperPostsPage.tag_ItemDetail.first().click();
            await page.waitForURL(/\/search\?s=/, { timeout: 10000 });
        });

        // Pass
        test('ShopperPosts_Mobile_028: ตรวจสอบการกดปุ่ม "ฝากหิ้วชิ้นนี้" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page, context }) => {
            await shopperPostsPage.clickItemCard_title();
            const newPagePromise = context.waitForEvent('page');
            await shopperPostsPage.purchaseBtn_ItemDetail.click();
            const newPage = await newPagePromise;
            await newPage.waitForLoadState();
            await expect(newPage).toHaveURL(/\/application$/);
        });
    });

    // ---------- Love Button (Item Detail) — TODO ทั้งกลุ่ม ----------
    // Pass

    test('ShopperPosts_Mobile_029: ตรวจสอบการกดปุ่ม "Like" ในหน้า รายละเอียดสินค้ารายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async () => {
        await openItemDetail();
        await shopperPostsPage.clickLoveItemDetail();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });


    //Fail
    test('ShopperPosts_Mobile_030: ตรวจสอบการกดปุ่ม "Like" ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await openItemDetail();
        const fill = await shopperPostsPage.loveBtn_ItemDetail.locator('svg path').getAttribute('fill');

        if (fill === '#BF202F') {
            await shopperPostsPage.clickLoveItemDetail();
        }
        await shopperPostsPage.clickLoveItemDetail();
        await expect(shopperPostsPage.loveBtn_ItemDetail.locator('svg path')).toHaveAttribute('fill', '#BF202F');
    });

    // Pass
    test('ShopperPosts_Mobile_031: ตรวจสอบการกดปุ่ม "Like" อีกครั้ง ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await openItemDetail();
        const fill = await shopperPostsPage.loveBtn_ItemDetail.locator('svg path').getAttribute('fill');

        if (fill === '#BF202F') {
            await shopperPostsPage.clickLoveItemDetail();
        }
        await shopperPostsPage.clickLoveItemDetail();
        await expect(shopperPostsPage.loveBtn_ItemDetail.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        await shopperPostsPage.clickLoveItemDetail();
        await expect(shopperPostsPage.loveBtn_ItemDetail.locator('svg path')).toHaveAttribute('fill', '#686868');
    });

    // ---------- Share Button (Item Detail) — TODO ทั้งกลุ่ม ----------
    // Pass
    test('ShopperPosts_Mobile_032: ตรวจสอบการกดปุ่ม "Share" ในหน้า รายละเอียดสินค้ารายชิ้น', async () => {
        await openItemDetail();
        await shopperPostsPage.shareBtn_ItemDetail.click();
        await expect(shopperPostsPage.shareOnFacebook_ItemDetail).toBeVisible();
        await expect(shopperPostsPage.shareOnLine_ItemDetail).toBeVisible();
        await expect(shopperPostsPage.shareOnX_ItemDetail).toBeVisible();
        await expect(shopperPostsPage.shareCopyLink_ItemDetail).toBeVisible();
    });

    // Pass
    test('ShopperPosts_Mobile_033: ตรวจสอบการกด "Share" ผ่าน Facebook เปิด Popup ไปที่ facebook.com ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
        await openItemDetail();
        await shopperPostsPage.shareBtn_ItemDetail.click();
        const popupPromise = page.waitForEvent('popup');
        await shopperPostsPage.shareOnFacebook_ItemDetail.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/facebook\.com/);
    });

    // Pass
    test('ShopperPosts_Mobile_034: ตรวจสอบการกด "Share" ผ่าน Line เปิด Popup ไปที่ line.me ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
        await openItemDetail();
        await shopperPostsPage.shareBtn_ItemDetail.click();
        const popupPromise = page.waitForEvent('popup');
        await shopperPostsPage.shareOnLine_ItemDetail.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/line\.me/);
    });

    // Pass
    test('ShopperPosts_Mobile_035: ตรวจสอบการกด "Share" ผ่าน X เปิด Popup ไปที่ x.com ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
        await openItemDetail();
        await shopperPostsPage.shareBtn_ItemDetail.click();
        const popupPromise = page.waitForEvent('popup');
        await shopperPostsPage.shareOnX_ItemDetail.click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL(/x\.com|twitter\.com/); // บางที redirect มาจาก twitter.com
    });

    // Pass
    test('ShopperPosts_Mobile_036: ตรวจสอบการกด "Share" ผ่าน Copy Link ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
        await openItemDetail();
        await expect(page).toHaveURL(/\/items\/[a-zA-Z0-9-_]+/);
        const currentUrl = new URL(page.url());
        const copyValue = await shopperPostsPage.clickShareCopyLink_ItemDetail();
        expect(copyValue).not.toBeNull();
        const copiedUrl = new URL(copyValue!);
        expect(copiedUrl.origin).toBe(currentUrl.origin);
        expect(copiedUrl.pathname).toBe(currentUrl.pathname);
    });

    // ---------- Items in Same Event — TODO ทั้งกลุ่ม ----------
    // Pass

    test('ShopperPosts_Mobile_037: ตรวจสอบการกดปุ่ม "Like" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน โดยที่ยังไม่เข้าสู่ระบบ', async () => {
        await shopperPostsPage.clickItemCard_titleByName('หมวก1');
        await shopperPostsPage.loveBtn_ItemSameEvent.click();
        await expect(navbar.loginModalCloseButton).toBeVisible();
        await navbar.closeLoginModal();
    });

    // Pass
    test('ShopperPosts_Mobile_038: ตรวจสอบการกดปุ่ม "Like" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน เมื่อเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await shopperPostsPage.clickItemCard_titleByName('หมวก1');
        const ariaLabel = await shopperPostsPage.loveBtn_ItemSameEvent.getAttribute('aria-label');
        if (ariaLabel === 'Remove from favorites') {
            await shopperPostsPage.loveBtn_ItemSameEvent.click();
        }
        await shopperPostsPage.loveBtn_ItemSameEvent.click();
        await expect(shopperPostsPage.loveBtn_ItemSameEvent).toHaveAttribute('aria-label', 'Remove from favorites');
    });

    // Pass
    test('ShopperPosts_Mobile_039: ตรวจสอบการกดปุ่ม "Like" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน อีกครั้ง เมื่อเข้าสู่ระบบแล้ว', async () => {
        await navbar.openLoginOrSignup_mobile();
        await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
        await shopperPostsPage.clickItemCard_titleByName('หมวก1');
        const ariaLabel = await shopperPostsPage.loveBtn_ItemSameEvent.getAttribute('aria-label');
        if (ariaLabel === 'Add to favorites') {
            await shopperPostsPage.loveBtn_ItemSameEvent.click();
        }
        await expect(shopperPostsPage.loveBtn_ItemSameEvent).toHaveAttribute('aria-label', 'Remove from favorites');
        await shopperPostsPage.loveBtn_ItemSameEvent.click();
        await expect(shopperPostsPage.loveBtn_ItemSameEvent).toHaveAttribute('aria-label', 'Add to favorites');
    });

    // Pass 
    test('ShopperPosts_Mobile_040: ตรวจสอบการกด "ดูทั้งหมด >" ในหน้า รายละเอียดสินค้ารายชิ้น บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async ({ page }) => {
        await shopperPostsPage.clickFilter_Item();
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
        // To DO: เช็คต่อว่าชื่อ title_ItemSameEvent กับ title_EventDetail ตรงกันไหม >> อันนี้ข้ามไปก่อนเดี๋ยวทำ pom หน้าอีกที search
    });


    // Pass
    test.describe('Run test', () => {
        test('ShopperPosts_Mobile_041: ตรวจสอบการเลื่อน การ์ดสินค้ารับหิ้ว เมื่อกดปุ่ม Indicator บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async () => {
            await openItemDetail();
            const indicators = shopperPostsPage.indicator_Btn;
            // รอให้ Pagination แสดงผล
            await expect(shopperPostsPage.allIndicator).toBeVisible();

            const count = await indicators.count();
            expect(count).toBeGreaterThan(1);

            for (let i = 0; i < count; i++) {
                const current = indicators.nth(i);
                await current.click();
                await expect(current).toHaveClass(/swiper-pagination-bullet-active/);
                await expect(current).toHaveAttribute('aria-current', 'true');
                await expect(shopperPostsPage.itemSameEvent_ActiveSlide).toHaveCount(1);
            }
        });
    });

    // ---------- Event Detail Page ----------
    // Pass
    test('ShopperPosts_Mobile_042: ตรวจสอบการแสดงรายละเอียดบนหน้า รายละเอียดรายอีเวนต์', async ({ page }) => {
        await openEventDetail();
        await expect(page).toHaveURL(/\/sp\/[a-zA-Z0-9-_]+/);
        await expect(shopperPostsPage.title_EventDetail).toBeVisible();
        await expect(shopperPostsPage.coverImg_EventDetail).toBeVisible();
        await expect(shopperPostsPage.description_EventDetail).toBeVisible();
        await expect(shopperPostsPage.priceLabel_EventDetail).toBeVisible();
        await expect(shopperPostsPage.viewCount_EventDetail).toBeVisible();
        await expect(shopperPostsPage.dateStart_EventDetail).toBeVisible();
        await expect(shopperPostsPage.loveBtn_EventDetail).toBeVisible();
        await expect(shopperPostsPage.shareBtn_EventDetail).toBeVisible();
        //To DO: เช็คต่อว่าชื่อ title_EventCard กับ title_EventDetail ตรงกันไหม >> อันนี้ข้ามไปก่อนเดี๋ยวทำ pom หน้าอีกที search
    });

    // ---------- Love / Share (Event Detail) — TODO ทั้งกลุ่ม ----------
    // 

    test.describe.serial('Love Button — Event Detail', () => {
        // Pass
        test('ShopperPosts_Mobile_043: ตรวจสอบการกดปุ่ม "Like" ในหน้า รายละเอียดรายอีเวนต์ โดยที่ยังไม่เข้าสู่ระบบ', async () => {
            await shopperPostsPage.clickFilter_Event();
            await shopperPostsPage.clickEventCard_titleByName('ทดสอบการสร้างโพสรับหิ้ว');
            await shopperPostsPage.loveBtn_EventDetail.click();
            await expect(navbar.loginModalCloseButton).toBeVisible();
            await navbar.closeLoginModal();
        });

        // Pass
        test('ShopperPosts_Mobile_044: ตรวจสอบการกดปุ่ม "Like" ในหน้า รายละเอียดรายอีเวนต์ เมื่อเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await shopperPostsPage.clickFilter_Event();
            await shopperPostsPage.clickEventCard_titleByName('ทดสอบการสร้างโพสรับหิ้ว');
            const fill = await shopperPostsPage.loveBtn_EventDetail.locator('svg path').getAttribute('fill');

            if (fill === '#BF202F') {
                await shopperPostsPage.loveBtn_EventDetail.click();
            }

            await shopperPostsPage.loveBtn_EventDetail.click();
            await expect(shopperPostsPage.loveBtn_EventDetail.locator('svg path')).toHaveAttribute('fill', '#BF202F');
        });

        // Pass
        test('ShopperPosts_Mobile_045: ตรวจสอบการกดปุ่ม "Like" อีกครั้ง ในหน้า รายละเอียดรายอีเวนต์ เมื่อเข้าสู่ระบบแล้ว', async () => {
            await navbar.openLoginOrSignup_mobile();
            await navbar.loginWithEmail(VALID_EMAIL, VALID_PASSWORD);
            await shopperPostsPage.clickFilter_Event();
            await shopperPostsPage.clickEventCard_titleByName('ทดสอบการสร้างโพสรับหิ้ว');
            const fill = await shopperPostsPage.loveBtn_EventDetail.locator('svg path').getAttribute('fill');

            if (fill === '#686868') {
                await shopperPostsPage.loveBtn_EventDetail.click();
            }

            await expect(shopperPostsPage.loveBtn_EventDetail.locator('svg path')).toHaveAttribute('fill', '#BF202F');
            await shopperPostsPage.loveBtn_EventDetail.click();
            await expect(shopperPostsPage.loveBtn_EventDetail.locator('svg path')).toHaveAttribute('fill', '#686868');
        });

        // Pass
        test('ShopperPosts_Mobile_046: ตรวจสอบการกดปุ่ม "Share" ในหน้า รายละเอียดรายอีเวนต์', async () => {
            await openEventDetail();
            await shopperPostsPage.shareBtn_EventDetail.click();
            await expect(shopperPostsPage.shareOnFacebook_EventDetail).toBeVisible();
            await expect(shopperPostsPage.shareOnLine_EventDetail).toBeVisible();
            await expect(shopperPostsPage.shareOnX_EventDetail).toBeVisible();
            await expect(shopperPostsPage.shareCopyLink_EventDetail).toBeVisible();
        });

        // Pass  
        test('ShopperPosts_Mobile_047: ตรวจสอบการกด "Share"ผ่าน Facebook เปิด Popup ไปที่ facebook.com ในหน้า รายละเอียดรายอีเวนต์', async ({ page }) => {
            await openEventDetail();
            await shopperPostsPage.shareBtn_EventDetail.click();
            const popupPromise = page.waitForEvent('popup');
            await shopperPostsPage.shareOnFacebook_EventDetail.click();
            const popup = await popupPromise;
            await expect(popup).toHaveURL(/facebook\.com/);
        });

        // Pass
        test('ShopperPosts_Mobile_048: ตรวจสอบการกด "Share"ผ่าน Line เปิด Popup ไปที่ line.me ในหน้า รายละเอียดรายอีเวนต์', async ({ page }) => {
            await openEventDetail();
            await shopperPostsPage.shareBtn_EventDetail.click();
            const popupPromise = page.waitForEvent('popup');
            await shopperPostsPage.shareOnLine_EventDetail.click();
            const popup = await popupPromise;
            await expect(popup).toHaveURL(/line\.me/);
        });

        // Pass
        test('ShopperPosts_Mobile_049: ตรวจสอบการกด "Share" ผ่าน X เปิด Popup ไปที่ x.com ในหน้า รายละเอียดรายอีเวนต์', async ({ page }) => {
            await openEventDetail();
            await shopperPostsPage.shareBtn_EventDetail.click();
            const popupPromise = page.waitForEvent('popup');
            await shopperPostsPage.shareOnX_EventDetail.click();
            const popup = await popupPromise;
            await expect(popup).toHaveURL(/x\.com|twitter\.com/); // บางที redirect มาจาก twitter.com
        });

        // Pass
        test('ShopperPosts_Mobile_050: ตรวจสอบการกด "Share" ผ่าน Copy Link ในหน้า รายละเอียดรายอีเวนต์', async ({ page, context }) => {
            await openEventDetail();
            await expect(page).toHaveURL(/\/sp\/[a-zA-Z0-9-_]+/);
            const currentUrl = new URL(page.url());
            const eventId = currentUrl.pathname.split('/').pop();
            const copyValue = await shopperPostsPage.clickShareCopyLink_EventDetail();
            expect(copyValue).not.toBeNull();
            const copiedUrl = new URL(copyValue!);
            expect(copiedUrl.origin).toBe(currentUrl.origin);
            expect(copiedUrl.pathname).toBe(`/s/${eventId}`);
        });
    });

    // Pass
    test('ShopperPosts_Mobile_051: ตรวจสอบการแสดงรายละเอียดบนการ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน ในหน้า รายละเอียดรายอีเวนต์', async () => {
        await openEventDetail();

        await expect(shopperPostsPage.title_ItemOnEvent).toBeVisible();
        await expect(shopperPostsPage.title_ItemOnEvent).not.toBeEmpty();

        await expect(shopperPostsPage.coverImg_ItemOnEvent).toBeVisible();
        await expect(shopperPostsPage.coverImg_ItemOnEvent)
            .toHaveAttribute('style', /background-image/);

        await expect(shopperPostsPage.price_ItemOnEvent).toBeVisible();
        await expect(shopperPostsPage.price_ItemOnEvent).not.toBeEmpty();

        await expect(shopperPostsPage.purchaseBtn_ItemOnEvent).toBeVisible();
        await expect(shopperPostsPage.purchaseBtn_ItemOnEvent)
            .toContainText('ฝากหิ้วชิ้นนี้');
    });

    // Pass
    test('ShopperPosts_Mobile_052: ตรวจสอบการกดปุ่ม "ฝากหิ้วชิ้นนี้" บนการ์ดสินค้าในอีเวนต์นั้น ในหน้า รายละเอียดรายอีเวนต์', async ({ page, context }) => {
        await openEventDetail();
        const newPagePromise = context.waitForEvent('page');
        await shopperPostsPage.purchaseBtn_ItemOnEvent.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL(/\/s\/[a-zA-Z0-9-_]+/);
    });

    // ---------- Scroll To Top ----------
    test.describe('Scroll To Top', () => {
        // Pass
        test('ShopperPosts_Mobile_053: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll หน้าจอลง ในหน้าปันโปรรับหิ้ว', async ({ page }) => {
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
        });

        // Pass
        test('ShopperPosts_Mobile_054: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" ในหน้าปันโปรรับหิ้ว', async ({ page }) => {
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();

            await expect.poll(async () => {
                return await page.evaluate(() => window.scrollY);
            }, { timeout: 5000 }).toBe(0);
        });

        // Pass
        test('ShopperPosts_Mobile_055: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll หน้าจอลง ในหน้ารายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await shopperPostsPage.clickFilter_Item();
            await shopperPostsPage.clickItemCard_title();
            await page.evaluate(() => window.scrollBy(0, 1000));
            await expect(navbar.scrollToTopButton).toBeVisible();
        });

        // Pass
        test('ShopperPosts_Mobile_056: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" ในหน้ารายละเอียดสินค้ารายชิ้น', async ({ page }) => {
            await openItemDetail();
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();

            await expect.poll(async () => {
                return await page.evaluate(() => window.scrollY);
            }).toBeLessThan(100);
        });

        // Pass
        test('ShopperPosts_Mobile_057: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll หน้าจอลง ในหน้ารายละเอียดรายอีเวนต์', async ({ page }) => {
            await openEventDetail();
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            await expect(navbar.scrollToTopButton).toBeVisible();
        });

        // Pass
        test('ShopperPosts_Mobile_058: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^" ในหน้ารายละเอียดรายอีเวนต์', async ({ page }) => {
            await openEventDetail();
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });

            await expect(navbar.scrollToTopButton).toBeVisible();
            await navbar.scrollToTopButton.click();

            await expect.poll(async () => {
                return await page.evaluate(() => window.scrollY);
            }).toBeLessThan(100);
        });
    });
});