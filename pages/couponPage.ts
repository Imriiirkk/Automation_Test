import { Page, Locator } from '@playwright/test';

/**
 * POM: Coupon Page
 * Owner: NUBT
 */
export class CouponsPage {
    protected page: Page;

    public allCouponTab: Locator;
    public myCouponTab: Locator;
    public couponList: Locator;
    public couponItem: Locator;
    public couponGetButton: Locator;
    public couponUseButton: Locator;

    // coupons card details
    public couponImageCard: Locator;
    public couponNameCard: Locator;
    public couponDueCard: Locator;
    public couponPriceCard: Locator;

    // ---------- Coupon Detail Page ----------
    public couponDetailImage: Locator;
    public couponDetailBadgeReceive: Locator;
    public couponDetailBlock: Locator;
    public couponDetailName: Locator;
    public couponTypeText: Locator;              // "คูปองแจกฟรี"
    public quantitySelectorContainer: Locator;
    public quantityDecreaseButton: Locator;
    public quantityIncreaseButton: Locator;
    public quantityValue: Locator;
    public couponFullQuotaText: Locator;         // "คุณได้รับสิทธิ์ครบแล้ว" (แสดงแทน quantity selector เมื่อเต็มสิทธิ์)
    public couponQuotaText: Locator;             // "สิทธิ์การรับคูปอง : X คน / Y สิทธิ์"
    public couponReceiveButton: Locator;
    public couponDescBlock: Locator;
    public couponDescTitle: Locator;
    public couponDescContent: Locator;

    // ---------- Coupon Receive Error Modal (SweetAlert2) ----------
    public receiveErrorModal: Locator;
    public receiveErrorIcon: Locator;
    public receiveErrorTitle: Locator;
    public receiveErrorCloseButton: Locator;

    // ---------- Coupon My Tab ----------
    public couponFreeTagCard: Locator; // Tag "แจกฟรี" บนการ์ด
    public couponUsedButton: Locator;   // ปุ่ม "คูปองถูกใช้งานไปแล้ว" (Disabled)
    public couponExpiredButton: Locator; // ปุ่ม "หมดอายุ" (Disabled)

    // ---------- Use Coupon Modal ----------
    public useCouponModal: Locator;
    public useCouponModalImage: Locator;
    public useCouponModalDesc: Locator;
    public useCouponModalCloseButton: Locator;
    public useCouponModalUseButton: Locator;

    // ---------- Confirm Modal ----------
    public confirmModal: Locator;
    public confirmModalIcon: Locator;
    public confirmModalDesc: Locator;
    public confirmModalCancelButton: Locator;
    public confirmModalConfirmButton: Locator;

    // ---------- QR/Barcode Modal ----------
    public codeModal: Locator;
    public codeModalImage: Locator;
    public codeModalQrTab: Locator;
    public codeModalBarcodeTab: Locator;
    public codeModalQrImage: Locator;
    public codeModalBarcodeImage: Locator;
    public codeModalRefNumber: Locator;
    public codeModalCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.allCouponTab = page.locator('[class*="client__Tab"]').getByText('คูปองทั้งหมด');
        this.myCouponTab = page.locator('[class*="client__Tab"]').getByText('คูปองของฉัน');

        this.couponList = page.locator('[class*="client__ListBox"]');

        this.couponItem = page.locator('[class*="client__Box"]');
        this.couponGetButton = this.couponItem.getByRole('button', { name: 'กดรับคูปอง' });
        this.couponUseButton = this.couponItem.getByRole('button', { name: 'ใช้งานคูปอง' });

        this.couponImageCard = this.couponItem
            .locator('[class*="FixSizeCouponCard__Card-"]')
            .locator('[style*="background-image"]');
        this.couponNameCard = this.couponItem.locator('[class*="FixSizeCouponCard__Title"]');
        this.couponDueCard = this.couponItem.locator('[class*="FixSizeCouponCard__RemainingTime"]');
        this.couponPriceCard = this.couponItem.locator('[class*="FixSizeCouponCard__PriceContent"]');

        this.couponDetailImage = page.locator('div > [style*="background-image"]');
        this.couponDetailBadgeReceive = page.locator('[class*="client__BadgeReceive-"]');

        this.couponDetailBlock = page.locator('[class*="client__BlockDetail-"]').first();
        this.couponDetailName = this.couponDetailBlock.locator('[class*="client__ContentTitle-"]');

        this.couponTypeText = page.locator('[class*="client__PriceText-"]');

        this.quantitySelectorContainer = page.locator('[class*="client__BlockSelected-"]');
        this.quantityDecreaseButton = page.locator('[class*="SelectedWithQuota__ButtonSelectLeft-"]');
        this.quantityIncreaseButton = page.locator('[class*="SelectedWithQuota__ButtonSelectRight-"]');
        this.quantityValue = page.locator('[class*="SelectedWithQuota__ValueSelect-"]');
        this.couponFullQuotaText = page.locator('[class*="client__FullQuota-"]');

        this.couponQuotaText = page.locator('[class*="client__Quota-"]');
        this.couponReceiveButton = page.locator('[class*="client__ButtonReceive-"]');

        this.couponDescBlock = page.locator('[class*="client__BlockDesc-"]');
        this.couponDescTitle = this.couponDescBlock.locator('[class*="client__ContentTitle-"]');
        this.couponDescContent = this.couponDescBlock.locator('[class*="client__Description-"]');

        this.receiveErrorModal = page.locator('.swal2-popup.swal2-icon-error');
        this.receiveErrorIcon = this.receiveErrorModal.locator('.swal2-x-mark');
        this.receiveErrorTitle = this.receiveErrorModal.locator('.swal2-title');
        this.receiveErrorCloseButton = this.receiveErrorModal.locator('.swal2-confirm');

        this.couponFreeTagCard = this.couponItem.locator('[class*="FixSizeCouponCard__PriceContent"]'); // ปรับ class ให้ตรง DOM จริง
        this.couponUsedButton = this.couponItem.getByRole('button', { name: 'คูปองถูกใช้งานไปแล้ว' });
        this.couponExpiredButton = this.couponItem.getByRole('button', { name: 'หมดอายุ' });

        this.useCouponModal = page.locator('[class*="DialogUseCoupon__Dialog-"]');
        this.useCouponModalImage = this.useCouponModal.locator('div > div > [style*="background-image"]');
        this.useCouponModalDesc = this.useCouponModal.locator('[class*="DialogUseCoupon__Descript"]');
        this.useCouponModalCloseButton = this.useCouponModal.getByRole('button', { name: 'ปิด' });
        this.useCouponModalUseButton = this.useCouponModal.getByRole('button', { name: 'ใช้งานคูปอง' });

        this.confirmModal = page.locator('[class*="DialogConfirmUseCoupon__DialogContent-"]'); // ปรับตาม library modal จริง (SweetAlert2 หรืออื่น)
        this.confirmModalIcon = this.confirmModal.locator('[class*="DialogConfirmUseCoupon__Icon"]');
        this.confirmModalDesc = this.confirmModal.locator('[class*="DialogConfirmUseCoupon__Descript"]');
        this.confirmModalCancelButton = this.confirmModal.getByRole('button', { name: 'ยกเลิก' });
        this.confirmModalConfirmButton = this.confirmModal.getByRole('button', { name: 'ยืนยัน' });

        this.codeModal = page.locator('[class*="DialogUseCoupon__Dialog-"]');
        this.codeModalImage = this.codeModal.locator('div > div > [style*="background-image"]');
        this.codeModalQrTab = this.codeModal.locator('[class*="DialogUseCoupon__CodeMenu-"]').filter({ hasText: 'QR Code' });
        this.codeModalBarcodeTab = this.codeModal.locator('[class*="DialogUseCoupon__CodeMenu-"]').filter({ hasText: 'Bar Code' });
        this.codeModalQrImage = this.codeModal.locator('div > div > div > div > svg'); // ปรับตามที่ render จริง
        this.codeModalBarcodeImage = this.codeModal.locator('div > div > div > svg');
        this.codeModalRefNumber = this.codeModal.locator('div > div > div > span'); // ต้องดู class จริงของเลขอ้างอิงเพิ่ม ยังไม่เห็นใน screenshot นี้
        this.codeModalCloseButton = this.codeModal.getByRole('button', { name: 'ปิด' });
    }

    async clickAllCouponTab() {
        await this.allCouponTab.click();
    }

    async clickMyCouponTab() {
        await this.myCouponTab.click();
    }

    async clickGetCoupon(index = 0) {
        await this.couponGetButton.nth(index).click();
    }

    async getMaxQuota(): Promise<number> {
        const text = await this.couponQuotaText.textContent();
        if (!text) {
            throw new Error('couponQuotaText ไม่มีข้อความ — element อาจยังไม่ visible');
        }

        const match = text.match(/สิทธิ์การรับคูปอง\s*:\s*(\d+)\s*คน\s*\/\s*(\d+)\s*สิทธิ์/);
        if (!match) {
            throw new Error(`รูปแบบข้อความ couponQuotaText ไม่ตรงตามที่คาด: "${text}"`);
        }

        return Number(match[2]); // group ที่ 2 คือตัวเลขหลัง "/" = max
    }

    async getCouponStatus(index: number): Promise<string> {
        const item = this.couponItem.nth(index);
        const buttonText = (await item.getByRole('button').textContent())?.trim() ?? '';

        if (buttonText === 'ใช้งานคูปอง') return 'ยังไม่ใช้คูปอง';
        if (buttonText === 'คูปองถูกใช้งานไปแล้ว') return 'ใช้คูปองแล้ว';
        if (buttonText === 'หมดอายุ') return 'คูปองหมดอายุ';

        throw new Error(`ไม่รู้จักข้อความปุ่มบนการ์ด: "${buttonText}"`);
    }

    // เพิ่มใน CouponsPage.ts
    async loadAllCoupons(maxScrolls = 30): Promise<void> {
        let previousCount = -1;
        let currentCount = await this.couponItem.count();
        let attempts = 0;

        while (currentCount !== previousCount && attempts < maxScrolls) {
            previousCount = currentCount;

            // await this.couponItem.last().scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500); // เผื่อ debounce ของ infinite scroll trigger

            currentCount = await this.couponItem.count();
            attempts++;
        }

        if (attempts >= maxScrolls) {
            throw new Error(`โหลดคูปองไม่ครบภายใน ${maxScrolls} รอบ scroll — อาจมีปัญหาการโหลดหรือ quota เยอะเกินคาด`);
        }
    }

    async countCouponsByStatus(status: string): Promise<number> {
        const count = await this.couponItem.count();
        let matched = 0;
        for (let i = 0; i < count; i++) {
            if ((await this.getCouponStatus(i)) === status) matched++;
        }
        return matched;
    }
}