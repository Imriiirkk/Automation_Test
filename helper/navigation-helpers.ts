import { expect, Page, BrowserContext } from '@playwright/test';

//================================================================
// เช็คการนำทางไปหน้าภายนอก (เปิด tab/popup ใหม่ แบบ https ปกติ)
//================================================================
export async function expectExternalNavigation(
    page: Page,
    context: BrowserContext,
    trigger: () => Promise<void>,
    expectedUrlParts: string[]
) {
    const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);
    await trigger();
    const popup = await popupPromise;

    expect(popup).not.toBeNull();
    await popup!.waitForLoadState('domcontentloaded');

    const popupUrl = popup!.url();
    for (const part of expectedUrlParts) {
        expect(popupUrl).toContain(part);
    }

    await popup!.close();
}

//================================================================
// เช็คการนำทางไปหน้าภายนอกที่ redirect ต่อไปยัง custom URL scheme
//================================================================
export async function expectStoreNavigation(
    context: BrowserContext,
    trigger: () => Promise<void>,
    expectedUrlPart: string
) {
    const requestPromise = new Promise<string>((resolve) => {
        context.on('request', (req) => {
            if (req.url().includes(expectedUrlPart)) {
                resolve(req.url());
            }
        });
    });

    await trigger();

    const capturedUrl = await Promise.race([
        requestPromise,
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 10000)),
    ]);

    expect(capturedUrl).not.toBeNull();
    expect(capturedUrl).toContain(expectedUrlPart);
}