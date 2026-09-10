/*
POM: Promotion Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class PromotionPage {
    private page: Page;
    public promotion_heading: Locator;

    // ---------- Promotion Categories Tap ----------
    private filterButtons: Record<string, Locator>;
    public blockMenuCategories: Locator;

    // ---------- Highlighted / Banner Elements ----------
    public highlightedBanner: Locator;
    public bannerPagination: Locator;

    // ---------- Element Promotion Card ----------
    public promotionCard: Locator;
    public promotionCardEach: Locator;
    public promotionCard_image: Locator;
    public promotionCard_title: Locator;
    public promotionLabel: Locator;
    public descriptionCard: Locator;
    public remainingTime: Locator;
    public dateContent: Locator;

    public loveButton: Locator;
    public loveButtonIcon: Locator;

    // ---------- element Promotion Detail ----------
    public breadcrumb: Locator; // Breadcrumb__BreadcrumbBlock-sc-21bc5eed-0 jkrBen
    public blockContent: Locator;
    public heading_detail: Locator; // Text__H1-sc-30b53bf2-0 cwSmuc
    public author_image: Locator;
    public author_name: Locator;
    public blockRemainingTime: Locator;
    public blockDate: Locator;
    public blockView: Locator;
    public shareButton_top: Locator;
    public shareButton_footer: Locator;
    public bookMarkButton: Locator;
    public coverImage: Locator;
    public textContent: Locator;
    public loveDetailButton_footer: Locator;
    public loveDetailBtnIcon: Locator;
    public blockauthor_footer: Locator;
    public blockTag: Locator;
    public tagItem: Locator;
    public shareOnFacebook: Locator;
    public shareOnLine: Locator;
    public shareOnX: Locator;
    public shareCopyLink: Locator;
    public multiTagCard: Locator;

    // ---------- Comment Section ----------
    public blockSentComment: Locator;
    public blockComment: Locator;
    public blockSentCommentReply: Locator;
    public textBoxSendComment: Locator;
    public submitCommentButton: Locator;
    public textBoxReplyComment: Locator;
    public submitReplyCommentButton: Locator;
    public replyComment: Locator;
    public hideComment: Locator;
    public existingComment: Locator;

    // ---------- Load More Button ----------
    readonly loadMoreButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.promotion_heading = page.getByRole('heading', { name: 'โปรโมชัน' });

        this.blockMenuCategories = page.locator('.ProFilterCategories__BlockMenuCategories-sc-e0f955f4-0') //ProFilterCategories__BlockMenuCategories-sc-e0f955f4-0 deYHar
        this.filterButtons = {
            oneGetone: page.getByRole('button', { name: '1 แถม 1' }),
            percentUp: page.getByRole('button', { name: '% up' }),
            proMobile: page.getByRole('button', { name: 'โปรมือถือ' }),
            foodie: page.getByRole('button', { name: 'อาหาร' }),
            cheapTicket: page.getByRole('button', { name: 'ตั๋วถูก' }),
            discountCode: page.getByRole('button', { name: 'โค้ดส่วนลด' })
        };

        // ---------- Highlighted / Banner Elements ----------
        this.highlightedBanner = page.locator('.PromotionPin__BlockPromotion-sc-1fd3630-0');
        this.bannerPagination = page.locator('.SlidePromotionBannerMulti__CustomPagination-sc-33329c3a-0');

        // ---------- Element Promotion Card ----------
        this.promotionCard = page.locator('.PromotionCategories__ListPromotion-sc-8c9a3c8e-0');
        this.promotionCardEach = page.locator('.PromotionCategories__BlockArticle-sc-8c9a3c8e-1.fkOMto');
        this.promotionCard_image = page.locator('.ComponentLink__StyledLink-sc-86eeea75-0.jPGtZW');
        this.promotionCard_title = page.locator('.ComponentLink__StyledLink-sc-86eeea75-0.jPGtZW');
        this.promotionLabel = page.locator('.FixSizePromotionCard__PostLabel-sc-f00d5468-4.lnHQnd');
        this.descriptionCard = page.locator('.FixSizePromotionCard__Descriptin-sc-f00d5468-3.cRPYmC');
        this.remainingTime = page.locator('.FixSizePromotionCard__Remaining-sc-f00d5468-5.kYkGMr');
        this.dateContent = page.locator('.FixSizePromotionCard__DateCotent-sc-f00d5468-6.idqEpo');

        this.loveButton = page.getByTestId('love-button').first();
        this.loveButtonIcon = this.loveButton.locator('svg path');

        this.loadMoreButton = page.getByRole('button', { name: 'ดูเพิ่มเติม' });

        // ---------- element Promotion Detail ----------
        this.heading_detail = page.locator('.Text__H1-sc-30b53bf2-0');
        this.blockContent = page.locator('.BlockContent__RootContent-sc-766b4868-0.cAgpqz');
        this.breadcrumb = page.locator('.Breadcrumb__BreadcrumbBlock-sc-21bc5eed-0.jkrBen');

        this.author_image = page.locator('.BlockContent__ImgAuthor-sc-766b4868-4'); //
        this.author_name = page.locator('.BlockContent__AuthorName-sc-766b4868-5.NEKaJ.mt-1.mb-2'); // BlockContent__AuthorName-sc-766b4868-5 NEKaJ mt-1 mb-2
        this.blockRemainingTime = page.locator('.DateTimeContent__TextColor-sc-b3b7f32b-0'); //.DateTimeContent__TextColor-sc-b3b7f32b-0.jqqcfq นับเวลาถอยหลัง
        this.blockDate = page.locator('.DateTimeContent__BlockDate-sc-b3b7f32b-2'); //.DateTimeContent__BlockDate-sc-b3b7f32b-2.gbHPFY วันเริ่ม-สิ้นสุด
        this.blockView = page.locator('.DateTimeContent__BlockView-sc-b3b7f32b-3'); //.DateTimeContent__BlockView-sc-b3b7f32b-3.islMME ยอดวิว
        this.shareButton_top = page.locator('.BlockContent__ContentButtonShare-sc-766b4868-2').first(); //
        this.shareButton_footer = page.locator('.BlockContent__ContentButtonFooterShare-sc-766b4868-11').first(); //
        // this.shareButton_mobile = page.locator('.BlockContent__ShareButton-sc-766b4868-3').first(); // ปุ่มแชร์ในหน้ารายละเอียดโปรโมชันบนมือถือ
        this.bookMarkButton = page.locator('.ButtonIconBookMarkDetail__Button-sc-b157073f-0').first(); //
        this.coverImage = page.locator('.BlockContent__CoverPhotoPost-sc-766b4868-9'); //BlockContent__CoverPhotoPost-sc-766b4868-9 gHDPcc rounded
        this.textContent = page.locator('.RenderContentHTML__ContentStyle-sc-84005593-0'); //<div class="RenderContentHTML__ContentStyle-sc-84005593-0 gvlvXY py-2" id="details">
        this.loveDetailButton_footer = page.locator('.ButtonIconLoveDetail__Button-sc-10d0321c-0'); //
        this.loveDetailBtnIcon = this.loveDetailButton_footer.locator('svg path');
        this.blockauthor_footer = page.locator('.BlockContent__BlockAuthor-sc-766b4868-13'); //BlockContent__BlockAuthor-sc-766b4868-13 jSYeWt
        this.blockTag = page.locator('.BlockContent__BlockTags-sc-766b4868-15'); //BlockContent__BlockTags-sc-766b4868-15 bzDMPC //การ์ดแรกมี hidden //.first()
        this.tagItem = page.locator('.Tags__TagItem-sc-89fc6391-0'); //Tags__TagItem-sc-89fc6391-0 jUaUqx
        this.multiTagCard = page.locator('.ProMultiTag__ListPostCard-sc-21da27a2-0') //ProMultiTag__ListPostCard-sc-21da27a2-0 eofyIs

        this.shareOnFacebook = page.getByRole('button', { name: 'Share on Facebook' }).first();
        this.shareOnLine = page.getByRole('button', { name: 'Share on Line' }).first();
        this.shareOnX = page.getByRole('button', { name: 'Share on X' }).first();
        this.shareCopyLink = page.getByRole('button', { name: 'share-copy-link' }).first();

        // ---------- Comment Section ----------
        this.blockSentComment = page.locator('.SendComment__BlockSendComment-sc-cbc590b3-0').first(); //BlockSendComment__BlockSendCommentLayout-sc-d6705f8b-0 ensIGq >> กล่องพิมพ์ส่ง Comment (อันบน)
        this.blockComment = page.locator('.BlockComment__BlockComments-sc-86b7d0e5-0'); //BlockComment__BlockComments-sc-86b7d0e5-0 cOIDBs >> กล่อง comment ทั้งหมด
        this.blockSentCommentReply = page.locator('.CommentComponents__BlockSendCommentReply-sc-34e5e5de-3'); //comment ที่แต่ละคน reply ก่อนหน้า
        this.textBoxSendComment = page.getByRole('textbox', { name: 'เขียนความคิดเห็น' }).first(); //กล่องพิมพ์คอมเมนต์
        this.submitCommentButton = page.getByRole('button', { name: 'ส่ง' }); //ปุ่มส่งคอมเมนต์
        this.textBoxReplyComment = page.locator('.SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0').first(); //กล่องพิมพ์ ตอบกลับ คอมเมนต์ SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0
        // this.textBoxReplyComment = page.getByRole('textbox', { name: 'เขียนความคิดเห็น' }).nth(1); //กล่องพิมพ์ ตอบกลับ คอมเมนต์ SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0
        this.submitReplyCommentButton = page.getByRole('button', { name: 'ส่ง' }).nth(1); //ปุ่มส่ง ตอบกลับ คอมเมนต์
        this.replyComment = page.getByRole('button', { name: 'ตอบกลับ' }).first(); //ปุ่ม ตอบกลับ เพื่อดู คอมเมนต์ที่ตอบกลับทั้งหมด
        this.hideComment = page.getByRole('button', { name: 'ซ่อน' }); //ปุ่ม ซ่อน เพื่อซ่อน คอมเมนต์ที่ตอบกลับทั้งหมด
        this.existingComment = page.locator('.CommentComponents__BlockComment-sc-34e5e5de-0'); // comment ที่มีอยู่ก่อนหน้าแล้ว
    }

    // ==================== Page Actions ====================

    async clickFilter(filterName: string) {
        const locator = this.filterButtons[filterName];
        if (!locator) {
            throw new Error(`ไม่พบ filter ชื่อ "${filterName}"`);
        }
        await locator.click();
    }

    async checkDetails() {
        await this.promotionCard.first().click(); //เปลี่ยนเป็นดูที่ .locator('.ComponentLink__StyledLink-sc-86eeea75-0 jPGtZW') นี้
    }

    async clickPromotionCard_image() {
        await this.promotionCard_image.first().click();
    }

    async clickPromotionCard_title() {
        await this.promotionCard_title.first().click(); //div:nth-child(4) 
    }

    async clickPromotionCard_title_child() {
        await this.promotionCard_title.nth(4).click(); //div:nth-child(4) 
    }

    async clickLoveButton() {
        await this.loveButtonIcon.click();
    }

    async clickLoadMore() {
        await this.loadMoreButton.click();
    }

    async getPromotionCardCount() {
        return await this.promotionCardEach.count();
    }

    async clickAuthorName() {
        await this.author_name.click();
    }

    // Re-check .first()
    async clickBookMarkButton() {
        await this.bookMarkButton.click();
    }

    async clickShareTop_Button() {
        await this.shareButton_top.click();
    }

    async clickShareFooter_Button() {
        await this.shareButton_footer.click();
    }

    async clickShareOnFacebook(page: Page): Promise<Page> {
        await this.clickShareTop_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnFacebook.click();
        return await popupPromise;
    }

    async clickShareOnLine(page: Page): Promise<Page> {
        await this.clickShareTop_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnLine.click();
        return await popupPromise;
    }

    async clickShareOnX(page: Page): Promise<Page> {
        await this.clickShareTop_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnX.click();
        return await popupPromise;
    }

    async clickShareCopyLink() {
        await this.clickShareTop_Button();
        await this.shareCopyLink.click();
    }

    // Re-check .first()
    async clickLoveDetailButton() {
        await this.loveDetailBtnIcon.scrollIntoViewIfNeeded();
        await this.page.evaluate(() => {
            window.scrollBy(0, -120);
        });
        await this.loveDetailBtnIcon.click({ force: true });
        // await this.loveDetailButton_footer.click();
    }

    async clickTag() {
        await this.blockTag.click();
    }

    async sentComment() {
        const testComment = `test-${Date.now()}`;
        await this.promotionCard_image.first().click();
        await this.textBoxSendComment.click();
        await this.textBoxSendComment.fill(testComment);
        await this.submitCommentButton.click();
    }

    async sentReplyComment() {
        const testComment = `test-${Date.now()}`;
        await this.promotionCard_image.first().click();
        await this.textBoxReplyComment.click();
        await this.textBoxReplyComment.fill(testComment);
        await this.submitReplyCommentButton.click();
    }

}
