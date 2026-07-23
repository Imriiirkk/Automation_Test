import { test, expect } from '@playwright/test';
import { PromotionPage } from '../../pages/PromotionPage';

// ปิด popup ก่อนทำการ Filter โปรโมชัน
test('TC001: กดหน้าโปรโมชันได้', async ({ page }) => {
    const promotionPage = new PromotionPage(page);
    await promotionPage.goto();
    await promotionPage.gotoPromotionPage();
    // await expect(promotionPage.promotionHeading).toBeVisible();
    await expect(page.locator('h1').filter({ hasText: 'โปรโมชัน' })).toBeVisible();
});

// รวมทุก filter case ไว้ใน array เดียว ไม่ต้องเขียน test ซ้ำทีละตัว
const filterCases = [
    { id: 'TC002', filterName: 'oneGetone', label: '1 แถม 1', urlPattern: /buy1-get1-free/ },
    { id: 'TC003', filterName: 'percentUp', label: '50% up', urlPattern: /sale-50p-up/ },
    { id: 'TC004', filterName: 'proMobile', label: 'โปรมือถือ', urlPattern: /mobile-phone/ },
    { id: 'TC005', filterName: 'foodie', label: 'อาหาร', urlPattern: /food/ },
    { id: 'TC006', filterName: 'cheapTicket', label: 'ตั๋วถูก', urlPattern: /ticket/ },
    { id: 'TC007', filterName: 'discountCode', label: 'โค้ดส่วนลด', urlPattern: /discount/ },
];

for (const { id, filterName, label, urlPattern } of filterCases) {
    test(`${id}: กด Filter โปรโมชัน "${label}" ได้`, async ({ page }) => {
        const promotionPage = new PromotionPage(page);
        await promotionPage.goto();
        // await promotionPage.closePopup();
        await promotionPage.gotoPromotionPage();
        await promotionPage.clickFilter(filterName);

        // https://www.punpro.com/promotion/sale-50p-up == https://www.punpro.com/promotion/+urlPattern
        await expect(page).toHaveURL(urlPattern);
    });
}

test('TC008: กดปุ่ม "ดูเพิ่มเติม" ได้', async ({ page }) => {
    const promotionPage = new PromotionPage(page);
    await promotionPage.goto();
    await promotionPage.gotoPromotionPage();
    await promotionPage.clickLoadMore();
    // await expect(page.locator('div').filter({ hasText: 'รวมโปรตั๋วถูก✈️ เตรียมตัวจัดกระเป๋า! งานเที่ยวทั่วไทย ไปทั่วโลก ครั้งที่ 31' }).nth(5)).toBeVisible();
});