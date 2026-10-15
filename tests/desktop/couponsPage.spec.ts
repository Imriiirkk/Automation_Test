/**
 * Test Data Setup
 *
 * [All Coupons] ต้องมีคูปองครอบคลุม 3 สถานะ โดยระบุตำแหน่งชัดเจน
 * (ลำดับการ์ดมีผลต่อ test เพราะ assert ตาม index):
 *   1. ใบแรก  = ยังไม่รับสิทธิ์ — แนะนำตั้งค่า "สิทธิ์/คน" ไว้สูงๆ เพื่อรองรับการรันเทสซ้ำหลายรอบโดยไม่ชนสิทธิ์
 *   2. ใบที่ 2 = รับสิทธิ์แล้ว
 *   3. ใบหลังสุด (default) = หมดสิทธิ์ (sold out)
 *
 * [My Coupons] ต้องมีคูปองครอบคลุม 3 สถานะ — ไม่ต้องระบุตำแหน่ง
 * เพราะลำดับใน list นี้ไม่คงที่อยู่แล้ว (ขึ้นกับว่า user รับ/ใช้คูปองไหนก่อน):
 *   - ยังไม่ใช้งาน (ควรมีไว้หลายใบ เผื่อรันเทสซ้ำหลายรอบไม่ให้คูปองหมด)
 *   - ใช้งานแล้ว
 *   - หมดอายุ
 */

import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../pages/NavbarFooter';
import { CouponsPage } from '../../pages/couponPage';
import { ProfilePage } from '../../pages/profilePage';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Coupons Page - ไม่เข้าสู่ระบบ', () => {
    let navbar: NavbarFooter;
    let couponsPage: CouponsPage;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        couponsPage = new CouponsPage(page);
        await navbar.goto();
        await navbar.goToMenu_desktop(navbar.couponsMenu_desktop);
        await page.waitForURL(/\/coupons/, { timeout: 10000 });
        expect(page.url()).toContain('/coupons');
    });

    test('Coupon_desktop_001: ตรวจสอบองค์ประกอบของหน้า "คูปอง" ได้ครบถ้วน', async () => {
        // แท็บ "คูปองทั้งหมด" ต้อง active, แท็บ "คูปองของฉัน" ต้อง inactive
        await expect(couponsPage.allCouponTab).toHaveClass(/active/);
        await expect(couponsPage.myCouponTab).not.toHaveClass(/active/);

        // แสดงรายการคูปองอย่างน้อย 1 รายการ
        await expect(couponsPage.couponList).toBeVisible();
        await expect(couponsPage.couponItem.first()).toBeVisible();
        expect(await couponsPage.couponItem.count()).toBeGreaterThan(0);
    });

    test('Coupon_desktop_002: ตรวจสอบองค์ประกอบของการ์ด "คูปอง" ในแท็บ คูปองทั้งหมด', async () => {
        const card = couponsPage.couponItem.first();
        await expect(card).toBeVisible();

        await expect(couponsPage.couponImageCard.first()).toBeVisible();
        await expect(couponsPage.couponImageCard.first()).toHaveAttribute('style', /background-image/);
        await expect(couponsPage.couponNameCard.first()).toBeVisible();
        await expect(couponsPage.couponDueCard.first()).toContainText(/เหลืออีก \d+ วัน/);
        await expect(couponsPage.couponPriceCard.first()).toContainText('แจกฟรี');
        await expect(couponsPage.couponGetButton.first()).toBeVisible();
    });

    test('Coupon_desktop_003: ตรวจสอบการนำทางไปยังหน้า "รายละเอียดคูปอง" เมื่อกดปุ่ม "กดรับคูปอง" ในการ์ดคูปองของแท็บ คูปองทั้งหมด', async ({ page }) => {
        const urlBefore = page.url();

        await couponsPage.couponGetButton.first().click();

        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });
        expect(page.url()).not.toBe(urlBefore);
        expect(page.url()).toContain('/coupon/');
    });

    test.describe('Coupon Detail - Quantity Selector', () => {
        test.beforeEach(async ({ page }) => {
            await couponsPage.couponGetButton.first().click();
            await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });
        });

        test('Coupon_desktop_007: ตรวจสอบการเพิ่มจำนวนคูปอง เมื่อกดปุ่ม "+" เมื่อสิทธิ์การรับคูปองยังไม่เต็มจำนวน', async ({ page }) => {
            await expect(couponsPage.quantityValue).toHaveText('1'); // default

            await couponsPage.quantityIncreaseButton.click();
            await expect(couponsPage.quantityValue).toHaveText(String(2));
        });

        test('Coupon_desktop_008: ตรวจสอบการลดจำนวนคูปอง เมื่อกดปุ่ม "-" เมื่อสิทธิ์การรับคูปองยังไม่เต็มจำนวน', async ({ page }) => {
            await couponsPage.quantityIncreaseButton.click(); // 1 -> 2 เพื่อให้ลดได้
            await expect(couponsPage.quantityValue).toHaveText('2');

            await couponsPage.quantityDecreaseButton.click(); // 2 -> 1
            await expect(couponsPage.quantityValue).toHaveText('1');

            // ถึง min (1) แล้ว ปุ่ม "-" ต้อง disable
            await expect(couponsPage.quantityDecreaseButton).toHaveClass("SelectedWithQuota__ButtonSelectLeft-sc-30ef3833-0 bfHcDK btn");
        });
    });

    test('Coupon_desktop_009: ตรวจสอบการรับคูปอง เมื่อกดปุ่ม "รับคูปอง" บนหน้า "รายละเอียดคูปอง" กรณีที่ยังไม่ได้เข้าสู่ระบบ', async ({ page }) => {
        await couponsPage.clickGetCoupon();
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await couponsPage.couponReceiveButton.click();
        await expect(navbar.getLoginModalLogo()).toBeVisible({ timeout: 10000 });
    });
});

test.describe('Coupons Page - เข้าสู่ระบบ', () => {
    let navbar: NavbarFooter;
    let couponsPage: CouponsPage;
    let profilePage: ProfilePage;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        couponsPage = new CouponsPage(page);
        profilePage = new ProfilePage(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();
        await navbar.openLoginOrSignup_desktop();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        await navbar.goToMenu_desktop(navbar.couponsMenu_desktop);
        await page.waitForURL(/\/coupons/, { timeout: 10000 });
        expect(page.url()).toContain('/coupons');
    });

    test('Coupon_desktop_004: ตรวจสอบองค์ประกอบของหน้า "รายละเอียดคูปอง" กรณีที่สิทธิ์การรับคูปองยังไม่เต็มจำนวน', async ({ page }) => {
        await couponsPage.clickGetCoupon(0);
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await expect(couponsPage.couponDetailImage).toBeVisible();
        await expect(couponsPage.couponDescContent).toBeVisible();
        await expect(couponsPage.couponDetailBadgeReceive).toContainText('ได้รับฟรี');
        await expect(couponsPage.couponDetailName).toBeVisible();
        await expect(couponsPage.couponTypeText).toContainText('คูปองแจกฟรี');

        // Quantity Selector ต้องแสดง (ไม่ใช่ FullQuota text) เมื่อยังไม่เต็มสิทธิ์
        await expect(couponsPage.quantityDecreaseButton).toBeVisible();
        await expect(couponsPage.quantityIncreaseButton).toBeVisible();

        await expect(couponsPage.couponQuotaText).toContainText(/สิทธิ์การรับคูปอง : \d+ คน \/ \d+ สิทธิ์/);
        await expect(couponsPage.couponReceiveButton).toBeVisible();
    });

    test('Coupon_desktop_005: ตรวจสอบองค์ประกอบของหน้า "รายละเอียดคูปอง" กรณีที่รับสิทธิ์ครบแล้ว', async ({ page }) => {
        await couponsPage.clickGetCoupon(1);
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await expect(couponsPage.couponDetailImage).toBeVisible();
        await expect(couponsPage.couponDescContent).toBeVisible();
        await expect(couponsPage.couponDetailBadgeReceive).toContainText('ได้รับฟรี');
        await expect(couponsPage.couponDetailName).toBeVisible();
        await expect(couponsPage.couponTypeText).toContainText('คูปองแจกฟรี');

        // แทนที่ Quantity Selector ด้วยข้อความ FullQuota
        await expect(couponsPage.couponFullQuotaText).toHaveText('คุณได้รับสิทธิ์ครบแล้ว');
        await expect(couponsPage.couponQuotaText).toContainText(/สิทธิ์การรับคูปอง : \d+ คน \/ \d+ สิทธิ์/);
        await expect(couponsPage.couponReceiveButton).toBeVisible();
    });

    test('Coupon_desktop_006: ตรวจสอบองค์ประกอบของหน้า "รายละเอียดคูปอง" กรณีที่คูปองหมด แต่ผู้ใช้ยังได้รับสิทธิ์ไม่ครบจำนวน', async ({ page }) => {
        await couponsPage.clickGetCoupon(-1);
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await expect(couponsPage.couponDetailImage).toBeVisible();
        await expect(couponsPage.couponDescContent).toBeVisible();
        await expect(couponsPage.couponDetailBadgeReceive).toContainText('ได้รับฟรี');
        await expect(couponsPage.couponDetailName).toBeVisible();
        await expect(couponsPage.couponTypeText).toContainText('SOLD OUT');

        await expect(couponsPage.quantityDecreaseButton).toBeVisible();
        await expect(couponsPage.quantityIncreaseButton).toBeVisible();

        await expect(couponsPage.couponQuotaText).toContainText(/สิทธิ์การรับคูปอง : \d+ คน \/ \d+ สิทธิ์/);
        await expect(couponsPage.couponReceiveButton).toBeHidden();
    });

    test('Coupon_desktop_010: ตรวจสอบการรับคูปองสำเร็จ เมื่อกดปุ่ม "รับคูปอง" บนหน้า "รายละเอียดคูปอง" กรณีที่เข้าสู่ระบบแล้วและสิทธิ์การรับคูปองยังไม่เต็มจำนวน', async ({ page }) => {
        await couponsPage.clickGetCoupon();
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await couponsPage.couponReceiveButton.click();

        // // Modal รับคูปองสำเร็จ (SweetAlert2 success)
        // const successModal = page.locator('.swal2-popup.swal2-icon-success');
        // await expect(successModal).toBeVisible({ timeout: 10000 });

        // หน้า "โปรไฟล์" แท็บ คูปองของฉัน อยู่ด้านหลัง modal
        await expect(page).toHaveURL(/\/my-coupons/);
    });

    test('Coupon_desktop_011: ตรวจสอบการรับคูปอง เมื่อกดปุ่ม "รับคูปอง" กรณีที่รับสิทธิ์ครบแล้ว', async ({ page }) => {
        await couponsPage.clickGetCoupon(1);
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await couponsPage.couponReceiveButton.click();

        await expect(couponsPage.receiveErrorModal).toBeVisible({ timeout: 10000 });
        await expect(couponsPage.receiveErrorIcon).toBeVisible();
        await expect(couponsPage.receiveErrorTitle).toContainText("คุณรับคูปองนี้ครบจำนวนแล้ว");

        await couponsPage.receiveErrorCloseButton.click();
        await expect(couponsPage.receiveErrorModal).toBeHidden();
    });

    test('Coupon_desktop_012: ตรวจสอบการแสดงคูปองเดิมหลายสิทธิ์ในแท็บ คูปองของฉัน เมื่อผู้ใช้งานรับคูปองมากกว่า 1 สิทธิ์', async ({ page }) => {
        const couponName = 'test coupon'; // ชื่อคูปองการ์ดแรกที่ใช้ทดสอบรับคูปองซ้ำได้เรื่อยๆ
        const receiveQty = 2; // จำนวนที่จะรับเพิ่มในรอบนี้

        // 1. นับจำนวนการ์ดเดิมของคูปองนี้ในแท็บ "คูปองของฉัน" ก่อนรับ
        await couponsPage.myCouponTab.click();
        await page.waitForTimeout(10000)
        const beforeCount = await couponsPage.couponItem
            .filter({ hasText: couponName })
            .count();

        await couponsPage.allCouponTab.click();
        // 2. ไปรับคูปองเพิ่มตามจำนวนที่กำหนด
        await couponsPage.clickGetCoupon();
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        for (let i = 1; i < receiveQty; i++) {
            await couponsPage.quantityIncreaseButton.click();
        }
        await expect(couponsPage.quantityValue).toHaveText(String(receiveQty));

        await couponsPage.couponReceiveButton.click();
        await expect(page).toHaveURL(/\/my-coupons/);
        await page.waitForTimeout(10000)

        // 3. กลับมาแท็บ "คูปองของฉัน" นับใหม่ ต้องเพิ่มขึ้นตรงเท่าที่รับไป
        const afterCount = await profilePage.couponCardItem
            .filter({ hasText: couponName })
            .count();

        // หาร 2 เพราะมีชื่อ class คล้ายกันซ่อนอยู่ข้างใน ระบบจึงนับ 2 รอบ
        expect((afterCount / 2) - beforeCount).toBe(receiveQty);
    });

    test('Coupon_desktop_014: ตรวจสอบการแสดงคูปองเมื่อกดแท็บ คูปองของฉัน บนหน้า "คูปอง" กรณีที่เข้าสู่ระบบแล้ว', async ({ page }) => {
        await couponsPage.clickMyCouponTab();

        await expect(couponsPage.myCouponTab).toHaveClass(/active/);
        await expect(couponsPage.couponItem.first()).toBeVisible();

        const cardCount = await couponsPage.couponItem.count();
        for (let i = 0; i < cardCount; i++) {
            await expect(couponsPage.couponItem.nth(i).locator(couponsPage.couponGetButton)).toBeHidden();
        }
    });

    test('Coupon_desktop_015: ตรวจสอบการเรียงลำดับการ์ดคูปองตามสถานะในแท็บ คูปองของฉัน', async ({ page }) => {
        await couponsPage.clickMyCouponTab();

        const statusOrder = ['ยังไม่ใช้คูปอง', 'ใช้คูปองแล้ว', 'คูปองหมดอายุ'];
        const cardCount = await couponsPage.couponItem.count();

        expect(cardCount).toBeGreaterThan(0);

        const displayedStatuses: string[] = [];
        for (let i = 0; i < cardCount; i++) {
            displayedStatuses.push(await couponsPage.getCouponStatus(i));
        }

        const groupIndexes = displayedStatuses.map((s) => statusOrder.indexOf(s));
        expect(groupIndexes).not.toContain(-1);

        for (let i = 1; i < groupIndexes.length; i++) {
            expect(groupIndexes[i]).toBeGreaterThanOrEqual(groupIndexes[i - 1]);
        }
    });

    async function findCardIndexByStatus(couponsPage: CouponsPage, status: string): Promise<number> {
        const count = await couponsPage.couponItem.count();
        for (let i = 0; i < count; i++) {
            if ((await couponsPage.getCouponStatus(i)) === status) return i;
        }
        throw new Error(`ไม่พบการ์ดสถานะ "${status}" ในแท็บคูปองของฉัน — ต้อง seed ข้อมูลก่อนรันเทสนี้`);
    }

    test('Coupon_desktop_016: ตรวจสอบองค์ประกอบของการ์ด "คูปอง" สถานะ "ยังไม่ใช้คูปอง" ในแท็บ คูปองของฉัน', async ({ page }) => {
        await couponsPage.clickMyCouponTab();
        await expect(couponsPage.couponItem.first()).toBeVisible(); // รอจนการ์ดใบแรก render จริง แทน fixed timeout

        const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
        const card = couponsPage.couponItem.nth(index);
        await card.scrollIntoViewIfNeeded();

        await expect(couponsPage.couponImageCard.nth(index)).toBeVisible();
        await expect(couponsPage.couponNameCard.nth(index)).toBeVisible();
        await expect(couponsPage.couponDueCard.nth(index)).toHaveText(/เหลืออีก \d+ วัน/);
        await expect(couponsPage.couponFreeTagCard.nth(index)).toContainText('แจกฟรี');

        const actionButton = card.getByRole('button'); // scope ในการ์ดใบนี้ใบเดียว ไม่ filter ด้วยชื่อ
        await expect(actionButton).toHaveText('ใช้งานคูปอง');
        await expect(actionButton).toBeEnabled();
    });

    test('Coupon_desktop_017: ตรวจสอบองค์ประกอบของการ์ด "คูปอง" สถานะ "ใช้คูปองแล้ว" ในแท็บ คูปองของฉัน', async ({ page }) => {
        await couponsPage.clickMyCouponTab();
        await expect(couponsPage.couponItem.first()).toBeVisible();
        await couponsPage.loadAllCoupons();

        const index = await findCardIndexByStatus(couponsPage, 'ใช้คูปองแล้ว');
        const card = couponsPage.couponItem.nth(index);
        await card.scrollIntoViewIfNeeded();

        await expect(couponsPage.couponImageCard.nth(index)).toBeVisible();
        await expect(couponsPage.couponNameCard.nth(index)).toBeVisible();
        await expect(couponsPage.couponDueCard.nth(index)).toHaveText(/เหลืออีก \d+ วัน/);
        await expect(couponsPage.couponFreeTagCard.nth(index)).toContainText('แจกฟรี');

        const actionButton = card.getByRole('button');
        await expect(actionButton).toHaveText('คูปองถูกใช้งานไปแล้ว');
        await expect(actionButton).toBeDisabled();
    });

    test('Coupon_desktop_018: ตรวจสอบองค์ประกอบของการ์ด "คูปอง" สถานะ "คูปองหมดอายุ" ในแท็บ คูปองของฉัน', async ({ page }) => {
        await couponsPage.clickMyCouponTab();
        await expect(couponsPage.couponItem.first()).toBeVisible();
        await couponsPage.loadAllCoupons();

        const index = await findCardIndexByStatus(couponsPage, 'คูปองหมดอายุ');
        const card = couponsPage.couponItem.nth(index);
        await card.scrollIntoViewIfNeeded();

        await expect(couponsPage.couponImageCard.nth(index)).toBeVisible();
        await expect(couponsPage.couponNameCard.nth(index)).toBeVisible();
        await expect(couponsPage.couponFreeTagCard.nth(index)).toContainText('แจกฟรี');
        await expect(couponsPage.couponDueCard.nth(index)).toHaveText('หมดอายุ');

        const actionButton = card.getByRole('button');
        await expect(actionButton).toHaveText('หมดอายุ');
        await expect(actionButton).toBeDisabled();
    });

    test.describe('My Coupons - Use Coupon Flow', () => {
        test.beforeEach(async ({ page }) => {
            await couponsPage.clickMyCouponTab();
            await expect(couponsPage.couponItem.first()).toBeVisible();
            await couponsPage.loadAllCoupons();
        });

        test('Coupon_desktop_019: ตรวจสอบการแสดง Use Coupon Modal เมื่อกดปุ่ม "ใช้งานคูปอง" บนการ์ดคูปองในแท็บ คูปองของฉัน ของหน้า "โปรไฟล์"', async ({ page }) => {
            const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
            const card = couponsPage.couponItem.nth(index);
            await card.getByRole('button').click();

            await expect(couponsPage.useCouponModal).toBeVisible();
            await expect(couponsPage.useCouponModalImage).toBeVisible();
            await expect(couponsPage.useCouponModalDesc).toBeVisible();
            await expect(couponsPage.useCouponModalCloseButton).toBeVisible();
            await expect(couponsPage.useCouponModalUseButton).toBeVisible();
        });

        test('Coupon_desktop_020: ตรวจสอบการปิด Use Coupon Modal เมื่อกดปุ่ม "ปิด"', async ({ page }) => {
            const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
            const card = couponsPage.couponItem.nth(index);
            await card.getByRole('button').click();

            await expect(couponsPage.useCouponModal).toBeVisible();
            await couponsPage.useCouponModalCloseButton.click();
            await expect(couponsPage.useCouponModal).toBeHidden();

            // คูปองยังคงสถานะ "ยังไม่ใช้คูปอง" ไม่เปลี่ยนแปลง
            await expect(card.getByRole('button')).toHaveText('ใช้งานคูปอง');
            await expect(card.getByRole('button')).toBeEnabled();
        });

        test('Coupon_desktop_021: ตรวจสอบการแสดง Confirm Modal เมื่อกดปุ่ม "กดใช้งานคูปอง" ใน Use Coupon Modal', async ({ page }) => {
            const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
            const card = couponsPage.couponItem.nth(index);
            await card.getByRole('button').click();

            await couponsPage.useCouponModalUseButton.click();

            await expect(couponsPage.confirmModal).toBeVisible();
            await expect(couponsPage.confirmModalIcon).toBeVisible();
            await expect(couponsPage.confirmModalDesc).toBeVisible();
            await expect(couponsPage.confirmModalCancelButton).toBeVisible();
            await expect(couponsPage.confirmModalConfirmButton).toBeVisible();
        });

        test('Coupon_desktop_022: ตรวจสอบการยกเลิกการใช้งานคูปอง เมื่อกดปุ่ม "ยกเลิก" ใน Confirm Modal', async ({ page }) => {
            const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
            const card = couponsPage.couponItem.nth(index);
            await card.getByRole('button').click();
            await couponsPage.useCouponModalUseButton.click();

            await expect(couponsPage.confirmModal).toBeVisible();
            await couponsPage.confirmModalCancelButton.click();

            await expect(couponsPage.confirmModal).toBeHidden();
            // คูปองยังคงสถานะ "ยังไม่ใช้คูปอง" ไม่เปลี่ยนแปลง
            await expect(card.getByRole('button')).toHaveText('ใช้งานคูปอง');
            await expect(card.getByRole('button')).toBeEnabled();
        });

        test('Coupon_desktop_023: ตรวจสอบการแสดง QR/Barcode Modal เมื่อกดปุ่ม "ยืนยัน" ใน Confirm Modal', async ({ page }) => {
            const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
            const card = couponsPage.couponItem.nth(index);
            await card.getByRole('button').click();
            await couponsPage.useCouponModalUseButton.click();
            await couponsPage.confirmModalConfirmButton.click();

            await expect(couponsPage.codeModal).toBeVisible();
            await expect(couponsPage.codeModalImage).toBeVisible();
            await expect(couponsPage.codeModalQrTab).toHaveClass(/active/); // ปรับตาม class active จริง
            await expect(couponsPage.codeModalBarcodeTab).not.toHaveClass(/active/);
            await expect(couponsPage.codeModalQrImage).toBeVisible();
            await expect(couponsPage.codeModalRefNumber).toHaveText(/\d+/);
            await expect(couponsPage.codeModalCloseButton).toBeVisible();
        });

        test('Coupon_desktop_024: ตรวจสอบการสลับแท็บ Bar Code ใน QR/Barcode Modal', async ({ page }) => {
            const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
            const card = couponsPage.couponItem.nth(index);
            await card.getByRole('button').click();
            await couponsPage.useCouponModalUseButton.click();
            await couponsPage.confirmModalConfirmButton.click();

            const refNumberBefore = await couponsPage.codeModalRefNumber.textContent();

            await couponsPage.codeModalBarcodeTab.click();

            await expect(couponsPage.codeModalBarcodeTab).toHaveClass(/active/);
            await expect(couponsPage.codeModalQrTab).not.toHaveClass(/active/);
            await expect(couponsPage.codeModalBarcodeImage).toBeVisible();
            await expect(couponsPage.codeModalRefNumber).toHaveText(refNumberBefore ?? '');
        });

        test('Coupon_desktop_025: ตรวจสอบการปิด QR/Barcode Modal เมื่อกดปุ่ม "ปิด"', async ({ page }) => {
            const unusedBefore = await couponsPage.countCouponsByStatus('ยังไม่ใช้คูปอง');
            const usedBefore = await couponsPage.countCouponsByStatus('ใช้คูปองแล้ว');
            console.log("unusedBefore = ", unusedBefore);
            console.log("usedBefore = ", usedBefore);

            const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
            const card = couponsPage.couponItem.nth(index);
            await card.getByRole('button').click();
            await couponsPage.useCouponModalUseButton.click();
            await couponsPage.confirmModalConfirmButton.click();

            await expect(couponsPage.codeModal).toBeVisible();
            await couponsPage.codeModalCloseButton.click();
            await expect(couponsPage.codeModal).toBeHidden();

            // เช็คจากการเปลี่ยนแปลงจำนวนต่อกลุ่ม แทนการ track การ์ดใบเดิมด้วย index
            const unusedAfter = await couponsPage.countCouponsByStatus('ยังไม่ใช้คูปอง');
            const usedAfter = await couponsPage.countCouponsByStatus('ใช้คูปองแล้ว');

            console.log("unusedAfter = ", unusedAfter);
            console.log("usedAfter = ", usedAfter);
            expect(unusedAfter).toBe(unusedBefore - 1);
            expect(usedAfter).toBe(usedBefore + 1);
        });

        test('Coupon_desktop_026: ตรวจสอบการไม่สามารถกดปุ่ม "คูปองถูกใช้งานไปแล้ว" ที่อยู่ในสถานะ Disabled', async ({ page }) => {
            const index = await findCardIndexByStatus(couponsPage, 'ใช้คูปองแล้ว');
            const card = couponsPage.couponItem.nth(index);
            const button = card.getByRole('button');

            await expect(button).toHaveText('คูปองถูกใช้งานไปแล้ว');
            await expect(button).toBeDisabled();

            await expect(couponsPage.useCouponModal).toBeHidden();
            await expect(couponsPage.confirmModal).toBeHidden();
            await expect(couponsPage.codeModal).toBeHidden();
        });

        test('Coupon_desktop_027: ตรวจสอบการไม่สามารถกดปุ่ม "หมดอายุ" ที่อยู่ในสถานะ Disabled', async ({ page }) => {
            const index = await findCardIndexByStatus(couponsPage, 'คูปองหมดอายุ');
            const card = couponsPage.couponItem.nth(index);
            const button = card.getByRole('button');

            await expect(button).toHaveText('หมดอายุ');
            await expect(button).toBeDisabled();

            await expect(couponsPage.useCouponModal).toBeHidden();
            await expect(couponsPage.confirmModal).toBeHidden();
            await expect(couponsPage.codeModal).toBeHidden();
        });
    });
});