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
    public readonly homeBreadcrumbLink: Locator;
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
        this.contact_heading = page.getByRole('heading', { name: 'ติดต่อเรา' });
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
        this.careerButton = page.getByRole('link', { name: 'ดูตำแหน่งงานที่รับสมัคร' }); //ปุ่ม "ดูตำแหน่งงานที่เปิดรับสมัคร" page.locator('a[href="/jobs"]'); 
        this.career_heading = page.getByRole('heading', { name: 'ร่วมงานกับเรา' });
        this.careerSection = page.locator('[class*="card"]');
        this.career_title = page.getByRole('heading', { name: 'ตำแหน่งงานที่เปิดรับสมัครทั้งหมดของ บริษัท ปันโปรโมชั่น จำกัด' });

        // ---------- Breadcrumb ----------
        this.homeBreadcrumb = page.locator('[class*="Breadcrumb__BreadcrumbBlock"]');
        this.homeBreadcrumbLink = page.locator('div[class*="Breadcrumb__BreadcrumbBlock"] a[href="/"]');
        this.contactBreadcrumb = page.getByText('ร่วมงานกับเรา', { exact: true });

        // ---------- Career Position Dropdown ----------
        this.positionDropdown = this.careerSection.locator('[class*="cx-job-title-block"]');
        this.positionOption = this.careerSection.locator('[class*="cx-job-title"]');
        this.positionDetail = this.careerSection.locator('[class*="cx-job-desc-block"]');

    }


    // ==================== Page Actions ====================

}