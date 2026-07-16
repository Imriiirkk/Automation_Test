import { Page, Locator } from '@playwright/test';

export class PromotionPage {
    private page: Page;
    private linkToPromotion: Locator;
    private loadMoreButton: Locator;
    private filterButtons: Record<string, Locator>;

    constructor(page: Page) {
        this.page = page;
        this.linkToPromotion = page.getByRole('link', { name: 'Link to promotion' });
        this.filterButtons = {
            oneGetone: page.getByRole('button', { name: '1 แถม 1' }),
            percentUp: page.getByRole('button', { name: '% up' }),
            proMobile: page.getByRole('button', { name: 'โปรมือถือ' }),
            foodie: page.getByRole('button', { name: 'อาหาร' }),
            cheapTicket: page.getByRole('button', { name: 'ตั๋วถูก' }),
            discountCode: page.getByRole('button', { name: 'โค้ดส่วนลด' })
        };

        this.loadMoreButton = page.getByRole('button', { name: 'ดูเพิ่มเติม' });
    }

    async goto() {
        await this.page.goto('/');
    }

    async gotoPromotionPage() {
        await this.linkToPromotion.click();
    }

    async clickFilter(filterName: string) {
        const locator = this.filterButtons[filterName];
        if (!locator) {
            throw new Error(`ไม่พบ filter ชื่อ "${filterName}"`);
        }
        await locator.click();
    }

    async clickLoadMore() {
        await this.loadMoreButton.click();
    }
}
