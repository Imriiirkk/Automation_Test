import { Page, Locator } from '@playwright/test';

/**
 * POM: Base Actions
 * เก็บ element/action ที่ใช้ร่วมกันทุกหน้า (overlays, ads, cookie banner)
 * 
 * Owner: NUBT
 */
export class BaseActions {
    protected page: Page;

    public appBanner: Locator;
    public appBannerAnimatedWrapper: Locator;
    public appBannerCloseButton: Locator;
    public appBannerDownloadButton: Locator;

    public cookieAcceptButton: Locator;
    public cookieContainer: Locator;

    public anchorAd: Locator;
    public anchorAdCloseButton: Locator;

    public scrollToTopButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.appBanner = page.locator('[class*="PPBNApp__BNAPP-"]');
        this.appBannerAnimatedWrapper = this.appBanner.locator('.animate__animated');
        this.appBannerDownloadButton = this.appBanner.locator('a[href="/app"]');
        this.appBannerCloseButton = this.appBanner.locator('button[class*="BTNCloseBNAPP"]');

        this.cookieAcceptButton = page.getByRole('button', { name: 'ยอมรับ' });
        this.cookieContainer = page.getByText('Punpro.com ใช้คุกกี้เพื่อพัฒนาประสบการณ์ใช้งานอ่านเพิ่มเติมยอมรับ');

        this.anchorAd = page.locator('.ats-overlay-bottom-wrapper-rendered');
        this.anchorAdCloseButton = this.anchorAd.getByRole('button').first();

        this.scrollToTopButton = page.getByRole('button', { name: 'scroll to top button' });
    }

    async goto() {
        await this.page.goto('/');
    }

    async dismissAppBannerIfPresent() {
        const appeared = await this.appBanner
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        if (appeared) {
            await this.appBannerCloseButton.click();
            await this.appBanner
                .evaluate((el) => new Promise<void>((resolve) => {
                    el.addEventListener('animationend', () => resolve(), { once: true });
                }));
        }
    }

    async dismissCookieBannerIfPresent() {
        const appeared = await this.cookieAcceptButton
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        if (appeared) {
            await this.cookieAcceptButton.click();
            await this.cookieAcceptButton.waitFor({ state: 'hidden' });
        }
    }

    async dismissAnchorAdIfPresent() {
        const appeared = await this.anchorAd
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        if (appeared) {
            await this.anchorAdCloseButton.click();
            await this.anchorAd.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
        }
    }

    async dismissAllOverlaysIfPresent() {
        await this.dismissCookieBannerIfPresent();
        await this.dismissAppBannerIfPresent();
        await this.dismissAnchorAdIfPresent();
    }
}