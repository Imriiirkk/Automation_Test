/*
POM: Contact Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class ContactPage {
    private page: Page;

    // ---------- Contact Header ----------
    public readonly contact_heading: Locator;
    public readonly headLayout: Locator;
    public readonly contact_title: Locator;

    // ---------- Breadcrumb ----------
    public readonly homeBreadcrumb: Locator;
    public readonly contactBreadcrumb: Locator;

    // ---------- Contact Information ----------
    public readonly contactInfo: Locator;
    public readonly address: Locator;
    public readonly phone: Locator;
    public readonly email: Locator;

    // ---------- Google Map ----------
    public readonly googleMap: Locator;
    public readonly googleMap_Link: Locator;

    // ---------- Career ----------
    public readonly careerSection: Locator;
    public readonly careerButton: Locator;

    // ---------- Career Page ----------
    public readonly career_heading: Locator;
    public readonly career_title: Locator;

    // ---------- Career Position Dropdown ----------
    public readonly positionDropdown: Locator;
    public readonly positionOption: Locator;
    public readonly positionDetail: Locator;

    // ---------- Scroll to Top ----------
    public readonly scrollToTop_Btn: Locator;


    constructor(page: Page) {
        this.page = page;

        // ---------- Contact Header ----------
        this.contact_heading = page.locator('');
        this.headLayout = page.locator('');
        this.contact_title = page.locator('');

        // ---------- Breadcrumb ----------
        this.homeBreadcrumb = page.locator('');
        this.contactBreadcrumb = page.locator('');

        // ---------- Contact Information ----------
        this.contactInfo = page.locator('');
        this.address = page.locator('');
        this.phone = page.locator('');
        this.email = page.locator('');

        // ---------- Google Map ----------
        this.googleMap = page.locator('');
        this.googleMap_Link = page.locator('');

        // ---------- Career ----------
        this.careerSection = page.locator('');
        this.careerButton = page.locator('');

        // ---------- Career Page ----------
        this.career_heading = page.locator('');
        this.career_title = page.locator('');

        // ---------- Career Position Dropdown ----------
        this.positionDropdown = page.locator('');
        this.positionOption = page.locator('');
        this.positionDetail = page.locator('');

        // ---------- Scroll to Top ----------
        this.scrollToTop_Btn = page.locator('');
    }


    // ==================== Page Actions ====================

}