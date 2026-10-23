/**
 * Spec (Mobile): Coupons - แท็บ "คูปองทั้งหมด" + หน้า "รายละเอียดคูปอง"
 * ครอบคลุม: Coupon_mobile_001 ถึง 011
 *
 * ================================================================
 * Test Data Setup
 * ================================================================
 * [All Coupons] ต้องมีคูปองครอบคลุม 3 สถานะ โดยระบุตำแหน่งชัดเจน
 * (ลำดับการ์ดมีผลต่อ test เพราะ assert ตาม index):
 *   1. ใบแรก  = ยังไม่รับสิทธิ์ — แนะนำตั้งค่า "สิทธิ์/คน" ไว้สูงๆ เพื่อรองรับการรันเทสซ้ำหลายรอบโดยไม่ชนสิทธิ์
 *   2. ใบที่ 2 = รับสิทธิ์แล้ว
 *   3. ใบหลังสุด (default) = หมดสิทธิ์ (sold out)
 *
 * ================================================================
 * หมายเหตุการรัน (สำคัญ)
 * ================================================================
 * - Test ในไฟล์นี้ที่แก้ข้อมูลจริงของบัญชีทดสอบ: Coupon_mobile_010 (รับคูปอง
 *   ทำให้จำนวนการ์ด "ยังไม่ใช้คูปอง" ใน My Coupons เพิ่มขึ้น)
 * - ไฟล์ couponsPage.myCoupons.spec.ts ใช้บัญชีเดียวกัน และ Coupon_mobile_025
 *   นับจำนวนการ์ดก่อน/หลังใช้คูปองแล้วคาดว่าเปลี่ยน ±1 พอดี
 *   ถ้า 2 ไฟล์รันพร้อมกัน (คนละ worker) จำนวนจะเพี้ยนและ fail แบบสุ่ม
 * - ให้รัน couponsPage.allCoupons.spec.ts กับไฟล์นี้แบบไม่ขนานกัน
 *     โดย npx playwright test couponsPage --workers=1
 * - ภายในไฟล์เดียวกัน Playwright รัน test แบบเรียงลำดับอยู่แล้ว (ไม่ต้องตั้งค่าเพิ่ม)
 */

import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';
import { CouponsPage } from '../../../pages/couponPage';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Coupons Page (All Coupons) - ไม่เข้าสู่ระบบ', () => {
    let navbar: NavbarFooter;
    let couponsPage: CouponsPage;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        couponsPage = new CouponsPage(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();
        await navbar.goToMenu_mobile(navbar.couponsMenu_mobile);
        await page.waitForURL(/\/coupons/, { timeout: 10000 });
        expect(page.url()).toContain('/coupons');
    });

    test('Coupon_mobile_001: ตรวจสอบองค์ประกอบของหน้า "คูปอง" ได้ครบถ้วน', async () => {
        // แท็บ "คูปองทั้งหมด" ต้อง active, แท็บ "คูปองของฉัน" ต้อง inactive
        await expect(couponsPage.allCouponTab).toHaveClass(/active/);
        await expect(couponsPage.myCouponTab).not.toHaveClass(/active/);

        // แสดงรายการคูปองอย่างน้อย 1 รายการ
        await expect(couponsPage.couponList).toBeVisible();
        await expect(couponsPage.couponItem.first()).toBeVisible();
        expect(await couponsPage.couponItem.count()).toBeGreaterThan(0);
    });

    test('Coupon_mobile_002: ตรวจสอบองค์ประกอบของการ์ด "คูปอง" ในแท็บ คูปองทั้งหมด', async () => {
        const card = couponsPage.couponItem.first();
        await expect(card).toBeVisible();

        await expect(couponsPage.couponImageCard.first()).toBeVisible();
        await expect(couponsPage.couponImageCard.first()).toHaveAttribute('style', /background-image/);
        await expect(couponsPage.couponNameCard.first()).toBeVisible();
        await expect(couponsPage.couponDueCard.first()).toContainText(/เหลืออีก \d+ วัน/);
        await expect(couponsPage.couponPriceCard.first()).toContainText('แจกฟรี');
        await expect(couponsPage.couponGetButton.first()).toBeVisible();
    });

    test('Coupon_mobile_003: ตรวจสอบการนำทางไปยังหน้า "รายละเอียดคูปอง" เมื่อกดปุ่ม "กดรับคูปอง" ในการ์ดคูปองของแท็บ คูปองทั้งหมด', async ({ page }) => {
        const urlBefore = page.url();

        await couponsPage.clickGetCoupon(0);

        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });
        expect(page.url()).not.toBe(urlBefore);
        expect(page.url()).toContain('/coupon/');
    });

    test.describe('Coupon Detail - Quantity Selector', () => {
        test.beforeEach(async ({ page }) => {
            await couponsPage.couponGetButton.first().click();
            await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });
        });

        test('Coupon_mobile_007: ตรวจสอบการเพิ่มจำนวนคูปอง เมื่อกดปุ่ม "+" เมื่อสิทธิ์การรับคูปองยังไม่เต็มจำนวน', async () => {
            await expect(couponsPage.quantityValue).toHaveText('1'); // default
            await couponsPage.quantityIncreaseButton.click();
            await expect(couponsPage.quantityValue).toHaveText(String(2));
        });

        test('Coupon_mobile_008: ตรวจสอบการลดจำนวนคูปอง เมื่อกดปุ่ม "-" เมื่อสิทธิ์การรับคูปองยังไม่เต็มจำนวน', async () => {
            await couponsPage.quantityIncreaseButton.click(); // 1 -> 2 เพื่อให้ลดได้
            await expect(couponsPage.quantityValue).toHaveText('2');

            await couponsPage.quantityDecreaseButton.click(); // 2 -> 1
            await expect(couponsPage.quantityValue).toHaveText('1');

            // ถึง min (1) แล้ว ปุ่ม "-" ต้อง disable
            await expect(couponsPage.quantityDecreaseButton).toHaveClass("SelectedWithQuota__ButtonSelectLeft-sc-30ef3833-0 bfHcDK btn");
        });
    });

    test('Coupon_mobile_009: ตรวจสอบการรับคูปอง เมื่อกดปุ่ม "รับคูปอง" บนหน้า "รายละเอียดคูปอง" กรณีที่ยังไม่ได้เข้าสู่ระบบ', async ({ page }) => {
        await couponsPage.clickGetCoupon();
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await couponsPage.couponReceiveButton.click();
        await expect(navbar.getLoginModalLogo()).toBeVisible({ timeout: 10000 });
    });
});

test.describe('Coupons Page (All Coupons) - เข้าสู่ระบบ', () => {
    let navbar: NavbarFooter;
    let couponsPage: CouponsPage;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        couponsPage = new CouponsPage(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();
        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        await navbar.goToMenu_mobile(navbar.couponsMenu_mobile);
        await page.waitForURL(/\/coupons/, { timeout: 10000 });
        expect(page.url()).toContain('/coupons');
    });

    test('Coupon_mobile_004: ตรวจสอบองค์ประกอบของหน้า "รายละเอียดคูปอง" กรณีที่สิทธิ์การรับคูปองยังไม่เต็มจำนวน', async ({ page }) => {
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

    test('Coupon_mobile_005: ตรวจสอบองค์ประกอบของหน้า "รายละเอียดคูปอง" กรณีที่รับสิทธิ์ครบแล้ว', async ({ page }) => {
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

    test('Coupon_mobile_006: ตรวจสอบองค์ประกอบของหน้า "รายละเอียดคูปอง" กรณีที่คูปองหมด แต่ผู้ใช้ยังได้รับสิทธิ์ไม่ครบจำนวน', async ({ page }) => {
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

    // ⚠️ แก้ข้อมูลจริง: รับคูปอง → จำนวนการ์ด "ยังไม่ใช้คูปอง" ใน My Coupons เพิ่ม (ดูหมายเหตุการรันด้านบนไฟล์)
    test('Coupon_mobile_010: ตรวจสอบการรับคูปองสำเร็จ เมื่อกดปุ่ม "รับคูปอง" บนหน้า "รายละเอียดคูปอง" กรณีที่เข้าสู่ระบบแล้วและสิทธิ์การรับคูปองยังไม่เต็มจำนวน', async ({ page }) => {
        await couponsPage.clickGetCoupon();
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await couponsPage.couponReceiveButton.click();

        // // Modal รับคูปองสำเร็จ (SweetAlert2 success)
        // const successModal = page.locator('.swal2-popup.swal2-icon-success');
        // await expect(successModal).toBeVisible({ timeout: 10000 });

        // หน้า "โปรไฟล์" แท็บ คูปองของฉัน อยู่ด้านหลัง modal
        await expect(page).toHaveURL(/\/my-coupons/);
    });

    test('Coupon_mobile_011: ตรวจสอบการรับคูปอง เมื่อกดปุ่ม "รับคูปอง" กรณีที่รับสิทธิ์ครบแล้ว', async ({ page }) => {
        await couponsPage.clickGetCoupon(1);
        await page.waitForURL(/\/coupon\/[^/]+/, { timeout: 10000 });

        await couponsPage.couponReceiveButton.click();

        await expect(couponsPage.receiveErrorModal).toBeVisible({ timeout: 10000 });
        await expect(couponsPage.receiveErrorIcon).toBeVisible();
        await expect(couponsPage.receiveErrorTitle).toContainText("คุณรับคูปองนี้ครบจำนวนแล้ว");

        await couponsPage.receiveErrorCloseButton.click();
        await expect(couponsPage.receiveErrorModal).toBeHidden();
    });
});