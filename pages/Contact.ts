/*
POM: Contact Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class ContactPage {
    private page: Page;

    // ---------- Contact Header ----------
    public readonly contact_heading: Locator;
    // public readonly headLayout: Locator;
    // public readonly contact_title: Locator;

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


    constructor(page: Page) {
        this.page = page;

        // ---------- Contact Header ----------
        this.contact_heading = page.locator('');
        // this.headLayout = page.locator('');
        // this.contact_title = page.locator('');

        // ---------- Contact Information ----------
        this.contactInfo = page.locator('li.cx-li');

        this.address = this.contactInfo.filter({ has: page.locator('i.fa-map-marker-alt') });
        this.phone = this.contactInfo.filter({ has: page.locator('i.fa-phone') });
        this.email = this.contactInfo.filter({ has: page.locator('i.fa-envelope') });

        // ---------- Google Map ----------
        this.googleMap = page.locator('iframe[src*="google.com/maps/embed"]');
        this.googleMap_Link = this.googleMap;

        // ---------- Career Page ----------
        this.careerButton = page.locator('a[href="/jobs"]'); //ปุ่ม "ดูตำแหน่งงานที่เปิดรับสมัคร"
        this.career_heading = page.getByRole('heading', { name: 'ร่วมงานกับเรา', level: 1 });
        this.careerSection = page.locator('.card').filter({ has: page.locator('.cx-title') });
        this.career_title = this.careerSection.locator('.cx-title');

        // ---------- Breadcrumb ----------
        this.homeBreadcrumb = page.locator('a[href="/"]');
        this.contactBreadcrumb = page.getByText('ร่วมงานกับเรา', { exact: true });

        // ---------- Career Position Dropdown ----------
        this.positionDropdown = this.careerSection.locator('.cx-job-title-block');
        this.positionOption = this.careerSection.locator('.cx-job-title');
        this.positionDetail = this.careerSection.locator('.cx-job-desc-block');

    }


    // ==================== Page Actions ====================

}