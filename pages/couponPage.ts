import { Page, Locator } from '@playwright/test';

/**
 * POM: Coupon Page
 * Owner: NUBT
 */
// ================================
// coupons page (list)
// ================================
export class CouponsPage {
    protected page: Page;

    private allCouponTab: Locator;
    private myCouponTab: Locator;

    private couponCard: Locator;
    private couponTakeButton: Locator;
    private couponUseButton: Locator;

    // coupons card details
    private couponImageCard: Locator;
    private couponNameCard: Locator;
    private couponDueCard: Locator;
    private couponPriceCard: Locator;

    constructor(page: Page) {
        this.page = page;

        this.allCouponTab = page.locator('[class*="client__Tab"]').getByText('คูปองทั้งหมด');
        this.myCouponTab = page.locator('[class*="client__Tab"]').getByText('คูปองของฉัน');

        this.couponCard = page.locator('[class*="client__Box"]');
        this.couponTakeButton = this.couponCard.getByRole('button', { name: 'รับคูปอง' });
        this.couponUseButton = this.couponCard.getByRole('button', { name: 'ใช้คูปอง' });

        this.couponImageCard = this.couponCard.locator('img');
        this.couponNameCard = this.couponCard.locator('[class*="client__ContentTitle"]');
        this.couponDueCard = this.couponCard.locator('[class*="client__DueDate"]');
        this.couponPriceCard = this.couponCard.locator('[class*="client__PriceText"]');
    }

    async clickAllCouponTab() {
        await this.allCouponTab.click();
    }

    async clickMyCouponTab() {
        await this.myCouponTab.click();
    }

    async clickTakeCoupon(index = 0) {
        await this.couponTakeButton.nth(index).click();
    }
}

// ================================
// coupon details page
// ================================
export class CouponDetailsPage {
    protected page: Page;

    private couponImage: Locator;
    private couponBadge: Locator;
    private couponTitle: Locator;
    private couponPrice: Locator;

    private couponSelectedQuota: Locator;
    private couponQuotaLabel: Locator;
    private couponReceiveButton: Locator;

    private couponDescription: Locator;

    constructor(page: Page) {
        this.page = page;

        this.couponImage = page.locator('div[title][data-gtm_class][data-gtm_text]');
        this.couponBadge = page.locator('[class*="client__BadgeReceive"]');
        this.couponTitle = page.locator('[class*="client__ContentTitle"]').first();
        this.couponPrice = page.locator('[class*="client__PriceText"]');

        this.couponSelectedQuota = page.locator('[class*="client__FullQuota"]');
        this.couponQuotaLabel = page.locator('[class*="client__Quota"]:not([class*="FullQuota"])');
        this.couponReceiveButton = page.locator('[class*="client__ButtonReceive"]', { hasText: 'รับคูปอง' });

        this.couponDescription = page.locator('[class*="client__Description"] p');
    }

    async clickReceiveCoupon() {
        await this.couponReceiveButton.click();
    }

    async getQuotaLabelText(): Promise<string> {
        return (await this.couponQuotaLabel.textContent())?.trim() ?? '';
    }
}