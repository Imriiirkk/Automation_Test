import { test, expect } from '@playwright/test';
import { ArticlePage } from '../../pages/ArticlePage';
import { NavbarFooter } from '../../pages/NavbarFooter';

const VALID_EMAIL = 'testpunpro01@gmail.com';
const VALID_PASSWORD = '123456';

let navbar: NavbarFooter;
let articlePage: ArticlePage;

test.beforeEach(async ({ page }) => {
    navbar = new NavbarFooter(page);
    articlePage = new ArticlePage(page);
    await navbar.goto();
    await navbar.goToMenu_desktop('Link to shopper_posts');

    // ปิด popup ก่อนทำการ click หรือ interact กับ element อื่นๆ
    await navbar.dismissAppBannerIfPresent();
    await navbar.dismissCookieBannerIfPresent();
    await navbar.dismissAnchorAdIfPresent();
});

test.describe('Article Page (Desktop)', () => {
    test('Article_Desktop_001: ตรวจสอบการกดเข้าหน้า "ปันโปรรับหิ้ว" ได้', async ({ page }) => {
    });

    test('Article_Desktop_002: ตรวจสอบการแสดงรายละเอียดบนหน้า "ปันโปรรับหิ้ว" ', async ({ page }) => {
    });

    test('Article_Desktop_003: ตรวจสอบการแสดง Banner "อันดับงานอีเวนต์ยอดนิยม" ครบ 10 รายการ', async ({ page }) => {
    });

    test('Article_Desktop_004: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม "←" , "→"', async ({ page }) => {
    });

    test('Article_Desktop_005: ตรวจสอบการเลื่อน Banner เมื่อกดปุ่ม Indicator', async ({ page }) => {
    });

    test('Article_Desktop_006: ตรวจสอบการกดรูปภาพ (Cover) ที่การ์ดอีเวนต์ บน Banner "อันดับงานอีเวนต์ยอดนิยม" เพื่อเข้าหน้ารายยละเอียด', async ({ page }) => {
    });

    test('Article_Desktop_007: ตรวจสอบการกดชื่ออีเวนต์ ที่ที่การ์ดอีเวนต์ บน Banner "อันดับงานอีเวนต์ยอดนิยม" เพื่อเข้าหน้ารายยละเอียด', async ({ page }) => {
    });

    test('Article_Desktop_008: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "ทั้งหมด" และใช้ Filter "สินค้ารายอีเวนต์"', async ({ page }) => {
    });

    test('Article_Desktop_009: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "รับหิ้วหน้างาน" และใช้ Filter "สินค้ารายอีเวนต์"', async ({ page }) => {
    });

    test('Article_Desktop_010: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "สินค้าในสต็อก" และใช้ Filter "สินค้ารายอีเวนต์"', async ({ page }) => {
    });

    test('Article_Desktop_011: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "ทั้งหมด" และใช้ Filter "สินค้ารายชิ้น"', async ({ page }) => {
    });

    test('Article_Desktop_012: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "รับหิ้วหน้างาน" และใช้ Filter "สินค้ารายชิ้น"', async ({ page }) => {
    });

    test('Article_Desktop_013: ตรวจสอบการแสดงการ์ดสินค้ารับหิ้ว เมื่อกด Tab "สินค้าในสต็อก" และใช้ Filter "สินค้ารายชิ้น"', async ({ page }) => {
    });

    test('Article_Desktop_014: ตรวจสอบการโหลดการ์ดสินค้ารับหิ้วเพิ่ม เมื่อกดปุ่ม "ดูเพิ่มเติม"', async ({ page }) => {
    });

    test('Article_Desktop_015: ตรวจสอบการแสดงรายละเอียดบนการ์ดอีเวนต์ เมื่อใช้ Filter "สินค้ารายอีเวนต์"', async ({ page }) => {
    });

    test('Article_Desktop_016: ตรวจสอบการแสดงรายละเอียดบนการ์ดสินค้ารับหิ้ว เมื่อใช้ Filter "สินค้ารายชิ้น"', async ({ page }) => {
    });

    test('Article_Desktop_017: ตรวจสอบการกดปุ่ม "หัวใจ" (รายการโปรด) บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    });

    test('Article_Desktop_018: ตรวจสอบการกดปุ่ม "หัวใจ" (รายการโปรด) บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_019: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง ในหน้า บนการ์ดสินค้ารับหิ้ว แบบรายชิ้น เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_020: ตรวจสอบการกดรูปภาพ(Cover) ที่การ์ดสินค้ารับหิ้ว เพื่อเข้าหน้ารายยละเอียด', async ({ page }) => {
    });

    test('Article_Desktop_021: ตรวจสอบการกดชื่อสินค้าหรืออีเวนต์ ที่การ์ดสินค้ารับหิ้ว เพื่อเข้าหน้ารายยละเอียด', async ({ page }) => {
    });

    test('Article_Desktop_022: ตรวจสอบการแสดงรายละเอียดบนหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
    });

    test('Article_Desktop_023: ตรวจสอบการกด "ประเภทสินค้า" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
    });

    test('Article_Desktop_024: ตรวจสอบการกด "#" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
    });

    test('Article_Desktop_025: ตรวจสอบการกดปุ่ม "ฝากหิ้วชิ้นนี้" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
    });

    test('Article_Desktop_026: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดสินค้ารายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    });

    test('Article_Desktop_027: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_028: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_029: ตรวจสอบการกดปุ่ม "แชร์" ในหน้า รายละเอียดสินค้ารายชิ้น', async ({ page }) => {
    });

    test('Article_Desktop_030: ตรวจสอบการกดแชร์ผ่าน Facebook เปิด Popup ไปที่ facebook.com', async ({ page }) => {
    });

    test('Article_Desktop_031: ตรวจสอบการกดแชร์ผ่าน Lineเปิด Popup ไปที่ line.me', async ({ page }) => {
    });

    test('Article_Desktop_032: ตรวจสอบการกดแชร์ผ่าน X เปิด Popup ไปที่ x.com', async ({ page }) => {
    });

    test('Article_Desktop_033: ตรวจสอบการกดแชร์ผ่าน Copy Link', async ({ page }) => {
    });

    test('Article_Desktop_034: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน ในหน้า รายละเอียดสินค้ารายชิ้น โดยที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    });

    test('Article_Desktop_035: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_036: ตรวจสอบการกดปุ่ม "หัวใจ" บนการ์ดสินค้าอื่นในอีเวนต์เดียวกัน อีกครั้ง ในหน้า รายละเอียดสินค้ารายชิ้น เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_037: ตรวจสอบการกด "ดูทั้งหมด >" ในหน้า รายละเอียดสินค้ารายชิ้น บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async ({ page }) => {
    });

    test('Article_Desktop_038: ตรวจสอบการเลื่อน การ์ดสินค้ารับหิ้ว เมื่อกดปุ่ม Indicator ในหน้า รายละเอียดสินค้ารายชิ้น บนสินค้าอื่นๆ ในอีเวนต์เดียวกัน', async ({ page }) => {
    });

    test('Article_Desktop_039: ตรวจสอบการแสดงรายละเอียดบนหน้า รายละเอียดรายอีเวนต์', async ({ page }) => {
    });

    test('Article_Desktop_040: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดรายอีเวนต์ โดยที่ยังไม่เข้าสู่ระบบ', async ({ page }) => {
    });

    test('Article_Desktop_041: ตรวจสอบการกดปุ่ม "หัวใจ" ในหน้า รายละเอียดรายอีเวนต์ เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_042: ตรวจสอบการกดปุ่ม "หัวใจ" อีกครั้ง ในหน้า รายละเอียดรายอีเวนต์ เมื่อเข้าสู่ระบบแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_043: ตรวจสอบการกดปุ่ม "แชร์" ในหน้า รายละเอียดรายอีเวนต์', async ({ page }) => {
    });

    test('Article_Desktop_044: ตรวจสอบการกดปุ่ม "ฝากหิ้วชิ้นนี้" บนการ์ดสินค้าในอีเวนต์นั้น ในหน้า รายละเอียดรายอีเวนต์', async ({ page }) => {
    });

    test('Article_Desktop_045: ตรวจสอบว่าปุ่ม "ดูเพิ่มเติม" หายไปเมื่อโหลดโปรโมชันครบทุกรายการแล้ว', async ({ page }) => {
    });

    test('Article_Desktop_046: ตรวจสอบการแสดงปุ่ม "^" เมื่อ Scroll หน้าจอลง', async ({ page }) => {
    });

    test('Article_Desktop_047: ตรวจสอบการเลื่อนหน้าจอกลับไปด้านบน เมื่อกดปุ่ม "^"', async ({ page }) => {
    });

    test('Article_Desktop_048: ตรวจสอบการแสดงผลเมื่อหมวดหมู่ที่เลือกไม่มีโปรโมชัน', async ({ page }) => {
    });
});



