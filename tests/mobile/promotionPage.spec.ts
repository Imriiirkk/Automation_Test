import { test, expect } from '@playwright/test';
import { PromotionPage } from '../../pages/PromotionPage';
import { NavbarFooter } from '../../pages/NavbarFooter';

test.describe('Promotion Page (Mobile)', () => {
    let navbar: NavbarFooter;
    let promotionPage: PromotionPage;

    test.beforeEach(async ({ page }) => {
        navbar = new NavbarFooter(page);
        promotionPage = new PromotionPage(page);
        await navbar.goto();
        await navbar.dismissAppBannerIfPresent();
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
    });

    // ผ่าน
    test('TC001: กดหน้าโปรโมชันได้', async ({ page }) => {
        await navbar.goToMenu_mobile(navbar.promotionMenu_mobile);
        await page.waitForURL(/\/promotion/, { timeout: 10000 });
        await expect(promotionPage.promotion_heading).toBeVisible();
    });
});