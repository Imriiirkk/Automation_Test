import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../../pages/profilePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Profile - Menu', () => {
    let profilePage: ProfilePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        profilePage = new ProfilePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();

        await navbar.openLoginOrSignup_desktop();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });
        await navbar.goToMenu_desktop(navbar.auth.username);
        await page.waitForURL(/\/bookmark/, { timeout: 10000 });
        expect(page.url()).toContain('/bookmark');
    });

    test('Profile_desktop_001: ตรวจสอบการแสดงเมนูแท็บครบถ้วนในหน้า Profile', async ({ page }) => {
        await expect(profilePage.verticalMenuLayout).toBeVisible();
        await expect(profilePage.verticalTabInfoButton).toBeVisible();
        await expect(profilePage.verticalTabBookmarkButton).toBeVisible();
        await expect(profilePage.verticalTabFavoriteButton).toBeVisible();
        await expect(profilePage.verticalTabCouponButton).toBeVisible();
        await expect(profilePage.verticalTabPrivacyButton).toBeVisible();
        await expect(profilePage.verticalTabLogoutButton).toBeVisible();
    });

    test('Profile_desktop_002: ตรวจสอบการเปิด/ยุบเมนูแท็บ เมื่อกดปุ่มเปิดเมนู', async ({ page }) => {
        // เก็บความกว้างก่อนกด
        const widthBefore = await profilePage.verticalMenuLayout.evaluate(
            (el) => el.getBoundingClientRect().width
        );

        // เช็คว่าความกว้างเปลี่ยนไปจริง (ยุบ/ขยาย)
        await profilePage.clickVerticalHeaderOpen();
        await page.waitForTimeout(2000);
        const widthAfterCollapse = await profilePage.verticalMenuLayout.evaluate(
            (el) => el.getBoundingClientRect().width
        );
        expect(widthAfterCollapse).not.toBe(widthBefore);

        // กดซ้ำเพื่อสลับกลับ แล้วเช็คว่ากลับสู่ความกว้างเดิม
        await profilePage.clickVerticalHeaderOpen();
        await page.waitForTimeout(2000);
        const widthAfterExpand = await profilePage.verticalMenuLayout.evaluate(
            (el) => el.getBoundingClientRect().width
        );
        expect(widthAfterExpand).toBe(widthBefore);
    });

    test.describe('Menu Tab Functionality', () => {
        const tabCases = [
            { testId: 'Profile_desktop_003', label: 'ข้อมูลทั่วไป', clickTab: (h: ProfilePage) => h.clickVerticalTabInfo(), path: '/profile' },
            { testId: 'Profile_desktop_004', label: 'บุ๊คมาร์ค', clickTab: (h: ProfilePage) => h.clickVerticalTabBookmark(), path: '/bookmarks' },
            { testId: 'Profile_desktop_005', label: 'รายการโปรด', clickTab: (h: ProfilePage) => h.clickVerticalTabFavorite(), path: '/favourites' },
            { testId: 'Profile_desktop_006', label: 'คูปอง', clickTab: (h: ProfilePage) => h.clickVerticalTabCoupon(), path: '/my-coupons' },
            { testId: 'Profile_desktop_007', label: 'ความเป็นส่วนตัว', clickTab: (h: ProfilePage) => h.clickVerticalTabPrivacy(), path: '/profile-setting-privacy' },
        ];

        for (const { testId, label, clickTab, path } of tabCases) {
            test(`${testId}: ตรวจสอบการนำทางและ Active State เมื่อกดแท็บ "${label}"`, async ({ page }) => {
                await clickTab(profilePage);

                await expect(page).toHaveURL(new RegExp(path));
                page.pause()
                const tabItem = profilePage.verticalTabContainer
                    .filter({ has: page.locator(`a[href="${path}"]`) });
                const isActive = tabItem.locator('[class*="MenuItemActive"]');

                await expect(isActive).toHaveCSS('display', 'block');
            });
        }

    });

});