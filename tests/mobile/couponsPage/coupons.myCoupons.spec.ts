/**
 * Spec (Mobile): Coupons - แท็บ "คูปองของฉัน" + Use Coupon Flow
 * ครอบคลุม: Coupon_mobile_012, 014 ถึง 027
 *
 * ================================================================
 * Test Data Setup
 * ================================================================
 * [My Coupons] ต้องมีคูปองครอบคลุม 3 สถานะ — ไม่ต้องระบุตำแหน่ง
 * เพราะลำดับใน list นี้ไม่คงที่อยู่แล้ว (ขึ้นกับว่า user รับ/ใช้คูปองไหนก่อน):
 *   - ยังไม่ใช้งาน (ควรมีไว้หลายใบ เผื่อรันเทสซ้ำหลายรอบไม่ให้คูปองหมด)
 *   - ใช้งานแล้ว
 *   - หมดอายุ
 *
 * Coupon_mobile_012 ต้องใช้คูปองใน All Coupons ที่รับสิทธิ์ซ้ำได้หลายรอบ
 * (ชื่อ 'test coupon', ตั้ง "สิทธิ์/คน" ไว้สูงๆ)
 *
 * ================================================================
 * หมายเหตุการรัน (สำคัญ)
 * ================================================================
 * - Test ในไฟล์นี้ที่แก้ข้อมูลจริงของบัญชีทดสอบ:
 *     012 (รับคูปองเพิ่ม → การ์ด "ยังไม่ใช้" เพิ่ม)
 *     023 ถึง 025 (ยืนยันใช้คูปอง → การ์ด "ยังไม่ใช้" ลด / "ใช้แล้ว" เพิ่ม)
 * - Coupon_mobile_025 นับจำนวนการ์ดก่อน/หลังแล้วคาดว่าเปลี่ยน ±1 พอดี
 *   ถ้ามี test อื่นที่ใช้บัญชีเดียวกันรันแทรกพร้อมกัน (เช่น Coupon_mobile_010
 *   ใน couponsPage.allCoupons.spec.ts ที่รับคูปองเพิ่ม) จำนวนจะเพี้ยนและ fail แบบสุ่ม
 * - ให้รัน couponsPage.allCoupons.spec.ts กับไฟล์นี้แบบไม่ขนานกัน
 *     โดย npx playwright test couponsPage --workers=1
 * - ภายในไฟล์เดียวกัน Playwright รัน test แบบเรียงลำดับอยู่แล้ว (ไม่ต้องตั้งค่าเพิ่ม)
 * - 019 ถึง 027 ต้องมีการ์ด "ยังไม่ใช้" อย่างน้อย 1 ใบ (023 ถึง 025 ใช้หมดไปทีละใบ)
 *   ถ้ารันซ้ำหลายรอบต้องเติมคูปองให้พอ (ดู Test Data Setup)
 */

import { test, expect } from '@playwright/test';
import { NavbarFooter } from '../../../pages/NavbarFooter';
import { CouponsPage } from '../../../pages/couponPage';
import { ProfilePage } from '../../../pages/profilePage';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

// หา index ของการ์ดใบแรกที่มีสถานะตามที่ระบุ (ใช้เฉพาะไฟล์นี้)
// TODO: ย้ายไปเป็น method ใน CouponsPage เมื่อพร้อมแก้ POM
async function findCardIndexByStatus(couponsPage: CouponsPage, status: string): Promise<number> {
    const count = await couponsPage.couponItem.count();
    for (let i = 0; i < count; i++) {
        if ((await couponsPage.getCouponStatus(i)) === status) return i;
    }
    throw new Error(`ไม่พบการ์ดสถานะ "${status}" ในแท็บคูปองของฉัน — ต้อง seed ข้อมูลก่อนรันเทสนี้`);
}

test.describe('Coupons Page (My Coupons) - เข้าสู่ระบบ', () => {
    let navbar: NavbarFooter;
    let couponsPage: CouponsPage;
    let profilePage: ProfilePage;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        couponsPage = new CouponsPage(page);
        profilePage = new ProfilePage(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();
        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        await navbar.goToMenu_mobile(navbar.couponsMenu_mobile);
        await page.waitForURL(/\/coupons/, { timeout: 10000 });
        expect(page.url()).toContain('/coupons');
    });

    // ⚠️ แก้ข้อมูลจริง: รับคูปองเพิ่ม (ดูหมายเหตุการรันด้านบนไฟล์)
    test('Coupon_mobile_012: ตรวจสอบการแสดงคูปองเดิมหลายสิทธิ์ในแท็บ คูปองของฉัน เมื่อผู้ใช้งานรับคูปองมากกว่า 1 สิทธิ์', async ({ page }) => {
        const couponName = 'test coupon'; // ชื่อคูปองการ์ดแรกที่ใช้ทดสอบรับคูปองซ้ำได้เรื่อยๆ
        const receiveQty = 2; // จำนวนที่จะรับเพิ่มในรอบนี้

        // TODO: 3 บรรทัด login/goToMenu ด้านล่างซ้ำกับ beforeEach (login และเข้าหน้า /coupons ไว้แล้ว)
        // ต้องเช็คว่า test นี้ยังผ่านอยู่ไหมบน mobile ถ้า fail ที่ขั้นตอนนี้ ให้ลบออก
        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });

        await navbar.goToMenu_mobile(navbar.couponsMenu_mobile);
        await page.waitForURL(/\/coupons/, { timeout: 10000 });
        expect(page.url()).toContain('/coupons');

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

    test('Coupon_mobile_014: ตรวจสอบการแสดงคูปองเมื่อกดแท็บ คูปองของฉัน บนหน้า "คูปอง" กรณีที่เข้าสู่ระบบแล้ว', async () => {
        await couponsPage.clickMyCouponTab();

        await expect(couponsPage.myCouponTab).toHaveClass(/active/);
        await expect(couponsPage.couponItem.first()).toBeVisible();

        const cardCount = await couponsPage.couponItem.count();
        for (let i = 0; i < cardCount; i++) {
            await expect(couponsPage.couponItem.nth(i).locator(couponsPage.couponGetButton)).toBeHidden();
        }
    });

    test('Coupon_mobile_015: ตรวจสอบการเรียงลำดับการ์ดคูปองตามสถานะในแท็บ คูปองของฉัน', async () => {
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

    test('Coupon_mobile_016: ตรวจสอบองค์ประกอบของการ์ด "คูปอง" สถานะ "ยังไม่ใช้คูปอง" ในแท็บ คูปองของฉัน', async () => {
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

    test('Coupon_mobile_017: ตรวจสอบองค์ประกอบของการ์ด "คูปอง" สถานะ "ใช้คูปองแล้ว" ในแท็บ คูปองของฉัน', async () => {
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

    test('Coupon_mobile_018: ตรวจสอบองค์ประกอบของการ์ด "คูปอง" สถานะ "คูปองหมดอายุ" ในแท็บ คูปองของฉัน', async () => {
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
        test.beforeEach(async () => {
            await couponsPage.clickMyCouponTab();
            await expect(couponsPage.couponItem.first()).toBeVisible();
            await couponsPage.loadAllCoupons();
        });

        test('Coupon_mobile_019: ตรวจสอบการแสดง Use Coupon Modal เมื่อกดปุ่ม "ใช้งานคูปอง" บนการ์ดคูปองในแท็บ คูปองของฉัน ของหน้า "โปรไฟล์"', async () => {
            const index = await findCardIndexByStatus(couponsPage, 'ยังไม่ใช้คูปอง');
            const card = couponsPage.couponItem.nth(index);
            await card.getByRole('button').click();

            await expect(couponsPage.useCouponModal).toBeVisible();
            await expect(couponsPage.useCouponModalImage).toBeVisible();
            await expect(couponsPage.useCouponModalDesc).toBeVisible();
            await expect(couponsPage.useCouponModalCloseButton).toBeVisible();
            await expect(couponsPage.useCouponModalUseButton).toBeVisible();
        });

        test('Coupon_mobile_020: ตรวจสอบการปิด Use Coupon Modal เมื่อกดปุ่ม "ปิด"', async () => {
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

        test('Coupon_mobile_021: ตรวจสอบการแสดง Confirm Modal เมื่อกดปุ่ม "กดใช้งานคูปอง" ใน Use Coupon Modal', async () => {
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

        test('Coupon_mobile_022: ตรวจสอบการยกเลิกการใช้งานคูปอง เมื่อกดปุ่ม "ยกเลิก" ใน Confirm Modal', async () => {
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

        // ⚠️ แก้ข้อมูลจริง: ยืนยันแล้วคูปองถูกใช้ (ดูหมายเหตุการรันด้านบนไฟล์)
        test('Coupon_mobile_023: ตรวจสอบการแสดง QR/Barcode Modal เมื่อกดปุ่ม "ยืนยัน" ใน Confirm Modal', async () => {
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

        // ⚠️ แก้ข้อมูลจริง: ยืนยันแล้วคูปองถูกใช้
        test('Coupon_mobile_024: ตรวจสอบการสลับแท็บ Bar Code ใน QR/Barcode Modal', async () => {
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

        // ⚠️ แก้ข้อมูลจริง + เทียบจำนวนก่อน/หลัง ต้องไม่มี test อื่นเปลี่ยนจำนวนระหว่างรัน
        test('Coupon_mobile_025: ตรวจสอบการปิด QR/Barcode Modal เมื่อกดปุ่ม "ปิด"', async () => {
            const unusedBefore = await couponsPage.countCouponsByStatus('ยังไม่ใช้คูปอง');
            const usedBefore = await couponsPage.countCouponsByStatus('ใช้คูปองแล้ว');

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

            expect(unusedAfter).toBe(unusedBefore - 1);
            expect(usedAfter).toBe(usedBefore + 1);
        });

        test('Coupon_mobile_026: ตรวจสอบการไม่สามารถกดปุ่ม "คูปองถูกใช้งานไปแล้ว" ที่อยู่ในสถานะ Disabled', async () => {
            const index = await findCardIndexByStatus(couponsPage, 'ใช้คูปองแล้ว');
            const card = couponsPage.couponItem.nth(index);
            const button = card.getByRole('button');

            await expect(button).toHaveText('คูปองถูกใช้งานไปแล้ว');
            await expect(button).toBeDisabled();

            await expect(couponsPage.useCouponModal).toBeHidden();
            await expect(couponsPage.confirmModal).toBeHidden();
            await expect(couponsPage.codeModal).toBeHidden();
        });

        test('Coupon_mobile_027: ตรวจสอบการไม่สามารถกดปุ่ม "หมดอายุ" ที่อยู่ในสถานะ Disabled', async () => {
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