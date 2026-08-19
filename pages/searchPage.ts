import { Page, Locator } from '@playwright/test';

/**
 * POM: Search Page
 * Owner: NUBT
 */

export class SearchPage {
    private page: Page;

    private breadcrumb: Locator;

    constructor(page: Page) {
        this.page = page;

        this.breadcrumb = ;
    };
};