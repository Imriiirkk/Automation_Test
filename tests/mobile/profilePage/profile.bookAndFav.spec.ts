import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../../pages/profilePage';
import { NavbarFooter } from '../../../pages/NavbarFooter';

const email = process.env.VALID_EMAIL!;
const password = process.env.VALID_PASSWORD!;

test.describe('Profile', () => {
    let profilePage: ProfilePage;
    let navbar: NavbarFooter;

    test.beforeEach(async ({ page }) => {
        profilePage = new ProfilePage(page);
        navbar = new NavbarFooter(page);
        await navbar.goto();
        await navbar.dismissAllOverlaysIfPresent();

        await navbar.openLoginOrSignup_mobile();
        await navbar.auth.loginWithEmail(email, password);
        await expect(navbar.getLoginSuccess()).toBeVisible({ timeout: 10000 });
        await navbar.goToMenu_mobile(navbar.editProfile_mobile);
        await page.waitForURL(/\/profile/, { timeout: 10000 });
        expect(page.url()).toContain('/profile');
    });

    test.describe('Bookmark Section', () => {
        test.beforeEach(async ({ page }) => {
            await profilePage.clickVerticalTabBookmark();
            await expect(page).toHaveURL(/\/bookmarks/);
        });

        test('Profile_mobile_017: ตรวจสอบการแสดงรายการบุ๊คมาร์ค เมื่อมีข้อมูล', async () => {
            const bookmarkCardContainer = await profilePage.getBookmarkCardContainer();
            await expect(bookmarkCardContainer).toBeVisible();
        });

        test('Profile_mobile_018: ตรวจสอบการนำโพสต์ออกจากบุ๊คมาร์ค เมื่อกดปุ่มบุ๊คมาร์คที่หน้าการ์ด', async ({ page }) => {
            const bookmarkCardContainer = await profilePage.getBookmarkCardContainer();
            await expect(bookmarkCardContainer).toBeVisible();

            const cardItemCount = await profilePage.bookmarkCardItem.count();
            await expect(profilePage.bookmarkInCardItem).toBeVisible();
            await profilePage.bookmarkInCardItem.click();
            await page.reload();

            const newCardItemCount = await profilePage.bookmarkCardItem.count();
            expect(newCardItemCount).toBeLessThanOrEqual(cardItemCount - 1);
        });

        test('Profile_mobile_019: ตรวจสอบการแสดงข้อความเมื่อยังไม่มีบุ๊คมาร์ค', async () => {
            await expect(profilePage.bookmarkTextBlank).toBeVisible();
        });

        test('Profile_mobile_020: ตรวจสอบการนำทางไปหน้าโพสต์ เมื่อกดที่การ์ดบุ๊คมาร์ค', async ({ page }) => {
            const bookmarkCardContainer = await profilePage.getBookmarkCardContainer();
            await expect(bookmarkCardContainer).toBeVisible();

            const firstCardLink = await profilePage.bookmarkFirstCard.locator('a').first().getAttribute('href');
            await profilePage.bookmarkFirstCard.locator('a').first().click();

            await page.waitForURL(firstCardLink!, { timeout: 10000 });
            expect(page.url()).toContain(firstCardLink!);
        });

    });

    test.describe('Favorite Section', () => {
        test.beforeEach(async ({ page }) => {
            await profilePage.clickVerticalTabFavorite();
            await expect(page).toHaveURL(/\/favourites/);
        });

        test('Profile_mobile_021: ตรวจสอบการแสดงรายการโปรด เมื่อมีข้อมูล', async () => {
            const favoriteCardContainer = await profilePage.getFavoriteCardContainer();
            await expect(favoriteCardContainer).toBeVisible();
        });

        test('Profile_mobile_022: ตรวจสอบการนำโพสต์ออกจากรายการโปรด เมื่อกดปุ่ม Fav ที่หน้าการ์ด', async ({ page }) => {
            const favoriteCardContainer = await profilePage.getFavoriteCardContainer();
            await expect(favoriteCardContainer).toBeVisible();

            const cardItemCount = await profilePage.favoriteCardItem.count();
            await expect(profilePage.favoriteInCardItem).toBeVisible();
            await profilePage.favoriteInCardItem.click();
            await page.reload();

            const newCardItemCount = await profilePage.favoriteCardItem.count();
            expect(newCardItemCount).toBeLessThanOrEqual(cardItemCount - 1);
        });

        test('Profile_mobile_023: ตรวจสอบการแสดงข้อความเมื่อยังไม่มีรายการโปรด', async () => {
            await expect(profilePage.favoriteTextBlank).toBeVisible();
        });

        test('Profile_mobile_024: ตรวจสอบการนำทางไปหน้าโพสต์ เมื่อกดที่การ์ดรายการโปรด', async ({ page }) => {
            const favoriteCardContainer = await profilePage.getFavoriteCardContainer();
            await expect(favoriteCardContainer).toBeVisible();

            const firstCardLink = await profilePage.favoriteFirstCard.locator('a').first().getAttribute('href');
            await profilePage.favoriteFirstCard.locator('a').first().click();

            await page.waitForURL(firstCardLink!, { timeout: 10000 });
            expect(page.url()).toContain(firstCardLink!);
        });
    });

});