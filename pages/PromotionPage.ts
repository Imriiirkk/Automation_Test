/*
POM: Promotion Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class PromotionPage {
    private page: Page;
    public readonly promotion_heading: Locator;

    // ---------- Promotion Categories Tap ----------
    private filterButtons: Record<string, Locator>;
    public readonly blockMenuCategories: Locator;
    public readonly noPromotionMessage: Locator;

    // ---------- Highlighted / Banner Elements ----------
    public readonly highlightedBanner: Locator;
    public readonly bannerPagination: Locator;
    public readonly bannerIndicator: Locator;
    public readonly activeSlide: Locator;

    // ---------- Element Promotion Card ----------
    public readonly promotionCardTest: Locator;
    public readonly promotionCard_titleTest: Locator;
    public readonly promotionCard: Locator;
    public readonly promotionCardEach: Locator;
    public readonly promotionCard_ForCount: Locator;
    public readonly promotionCard_image: Locator;
    public readonly promotionCard_title: Locator;
    public readonly promotionLabel: Locator;
    public readonly descriptionCard: Locator;
    public readonly remainingTime: Locator;
    public readonly dateContent: Locator;

    public readonly loveButton: Locator;
    public readonly loveButtonIcon: Locator;

    // ---------- element Promotion Detail ----------
    public readonly breadcrumb: Locator; // Breadcrumb__BreadcrumbBlock-sc-21bc5eed-0 jkrBen
    public readonly blockContent: Locator;
    public readonly heading_detail: Locator; // Text__H1-sc-30b53bf2-0 cwSmuc
    public readonly authorNameLink_ArticleDetail: Locator;
    public readonly author_image: Locator;
    public readonly author_name: Locator;
    public readonly blockRemainingTime: Locator;
    public readonly blockDate: Locator;
    public readonly blockView: Locator;
    public readonly shareButton_top: Locator;
    public readonly shareButton_footer: Locator;
    public readonly shareButton_mobile: Locator;
    public readonly bookMarkButton_mobile: Locator;
    public readonly bookMarkButton: Locator;
    public readonly coverImage: Locator;
    public readonly textContent: Locator;
    public readonly loveDetailButton_footer: Locator;
    public readonly loveDetailBtnIcon: Locator;
    public readonly blockAuthor_footer: Locator;
    public readonly blockTag: Locator;
    public readonly tagItem: Locator;
    public readonly shareOnFacebook: Locator;
    public readonly shareOnLine: Locator;
    public readonly shareOnX: Locator;
    public readonly shareCopyLink: Locator;
    public readonly multiTagCard: Locator;

    // ---------- Comment Section ----------
    public readonly layout_Comment: Locator;
    public readonly blockSentComment: Locator;
    public readonly blockComment: Locator;
    public readonly blockSentCommentReply: Locator;
    public readonly textBoxSendComment: Locator;
    public readonly submitCommentButton: Locator;
    public readonly textBoxReplyComment: Locator;
    public readonly submitReplyCommentButton: Locator;
    public readonly replyComment: Locator;
    public readonly hideComment: Locator;
    public readonly existingComment: Locator;

    // ---------- Load More Button ----------
    readonly loadMoreButton: Locator;

    // ---------- Popular Promotion ----------
    public readonly box_ProPopular: Locator;
    public readonly card_ProPopular: Locator;
    public readonly coverImg_CardProPopular: Locator;
    public readonly title_CardProPopular: Locator;
    public readonly logoBrand_CardProPopular: Locator;
    // public readonly buttonAction_CardProPopular: Locator;
    public readonly loveBtn_CardProPopular: Locator;
    public readonly bookmarkBtn_CardProPopular: Locator;
    public readonly discAndDate_CardProPopular: Locator;
    // public readonly dateContent_CardProPopular: Locator;
    public readonly labelPro_CardProPopular: Locator;
    public readonly shareBtn_CardProPopular: Locator;

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
        this.noPromotionMessage = page.locator('p').filter({ hasText: 'เปย์เป้ขออภัยครับ...' });

        // ---------- Highlighted / Banner Elements ----------
        this.highlightedBanner = page.locator('[class*="PromotionPin__BlockPromotion"]');
        this.bannerPagination = page.locator('[class*="SlidePromotionBannerMulti__CustomPagination"]');
        this.bannerIndicator = this.bannerPagination.locator('.swiper-pagination-bullet');
        this.activeSlide = page.locator('.swiper-slide-active');

        // ---------- Element Promotion Card ----------
        this.promotionCardTest = page.locator('a[href="/p/test-5000"]');
        this.promotionCard_titleTest = this.promotionCardTest.locator('div').filter({
            hasText: 'Test Create Post ;)'
        });
        this.promotionCard = page.locator('[class*="PromotionCategories__ListPromotion"]');
        this.promotionCardEach = page.locator('[class*="FixSizePromotionCard__Card-sc-"]'); //PromotionCategories__BlockArticle-sc-8c9a3c8e-1.fkOMto
        this.promotionCard_ForCount = page.locator('[class*="PromotionCategories__BlockArticle"]');
        this.promotionCard_image = page.locator('.ComponentLink__StyledLink-sc-86eeea75-0.jPGtZW');
        this.promotionCard_title = page.locator('.ComponentLink__StyledLink-sc-86eeea75-0.jPGtZW');
        this.promotionLabel = page.locator('.FixSizePromotionCard__PostLabel-sc-f00d5468-4.lnHQnd');
        this.descriptionCard = page.locator('.FixSizePromotionCard__Descriptin-sc-f00d5468-3.cRPYmC');
        this.remainingTime = page.locator('[class*="FixSizePromotionCard__Remaining"]'); //.FixSizePromotionCard__Remaining-sc-f00d5468-5.kYkGMr
        this.dateContent = page.locator('[class*="FixSizePromotionCard__DateCotent"]'); //'.FixSizePromotionCard__DateCotent-sc-f00d5468-6.idqEpo'

        this.loveButton = page.getByTestId('love-button').first();
        this.loveButtonIcon = this.loveButton.locator('svg path');

        this.loadMoreButton = page.getByRole('button', { name: 'ดูเพิ่มเติม' });

        // ---------- Element Promotion Detail ----------
        this.blockContent = page.locator('.BlockContent__RootContent-sc-766b4868-0.cAgpqz');
        this.heading_detail = this.blockContent.locator('.Text__H1-sc-30b53bf2-0');
        this.breadcrumb = page.locator('.Breadcrumb__BreadcrumbBlock-sc-21bc5eed-0.jkrBen');

        this.authorNameLink_ArticleDetail = page.locator('h5[class*="BlockContent__AuthorName"] a');
        this.author_image = page.locator('.BlockContent__ImgAuthor-sc-766b4868-4'); //
        this.author_name = page.locator('.BlockContent__AuthorName-sc-766b4868-5.NEKaJ.mt-1.mb-2'); // BlockContent__AuthorName-sc-766b4868-5 NEKaJ mt-1 mb-2
        this.blockRemainingTime = page.locator('.DateTimeContent__TextColor-sc-b3b7f32b-0'); //.DateTimeContent__TextColor-sc-b3b7f32b-0.jqqcfq นับเวลาถอยหลัง
        this.blockDate = page.locator('.DateTimeContent__BlockDate-sc-b3b7f32b-2'); //.DateTimeContent__BlockDate-sc-b3b7f32b-2.gbHPFY วันเริ่ม-สิ้นสุด
        this.blockView = page.locator('.DateTimeContent__BlockView-sc-b3b7f32b-3'); //.DateTimeContent__BlockView-sc-b3b7f32b-3.islMME ยอดวิว
        this.shareButton_top = page.locator('.BlockContent__ContentButtonShare-sc-766b4868-2').first(); //
        this.shareButton_footer = page.locator('.BlockContent__ContentButtonFooterShare-sc-766b4868-11').first(); //
        // ---------- Bookmark Mobile ----------
        this.bookMarkButton_mobile = page.locator('[class*="BlockContent__BlockTopShare"].d-block.d-lg-none [class*="ButtonIconBookMarkDetail__Button"]');
        // ---------- Share Mobile ----------
        this.shareButton_mobile = page.locator('[class*="BlockContent__ContentButtonShare"].d-block.d-lg-none [role="button"]');

        this.bookMarkButton = page.locator('.ButtonIconBookMarkDetail__Button-sc-b157073f-0').first(); //
        this.coverImage = page.locator('.BlockContent__CoverPhotoPost-sc-766b4868-9'); //BlockContent__CoverPhotoPost-sc-766b4868-9 gHDPcc rounded
        this.textContent = page.locator('.RenderContentHTML__ContentStyle-sc-84005593-0'); //<div class="RenderContentHTML__ContentStyle-sc-84005593-0 gvlvXY py-2" id="details">
        this.loveDetailButton_footer = page.locator('.ButtonIconLoveDetail__Button-sc-10d0321c-0'); //
        this.loveDetailBtnIcon = this.loveDetailButton_footer.locator('svg path');
        this.blockAuthor_footer = page.locator('.BlockContent__BlockAuthor-sc-766b4868-13'); //BlockContent__BlockAuthor-sc-766b4868-13 jSYeWt
        this.blockTag = page.locator('[class*="BlockContent__BlockTags"]'); //BlockContent__BlockTags-sc-766b4868-15 bzDMPC //การ์ดแรกมี hidden //.first()
        this.tagItem = this.blockTag.locator('a[rel="tag"]'); //Tags__TagItem-sc-89fc6391-0 jUaUqx
        this.multiTagCard = page.locator('.ProMultiTag__ListPostCard-sc-21da27a2-0') //ProMultiTag__ListPostCard-sc-21da27a2-0 eofyIs

        this.shareOnFacebook = page.getByRole('button', { name: 'Share on Facebook' }); //page.locator('#suggest-for-you-default').getByRole('button', { name: 'Share on Facebook' });
        this.shareOnLine = page.getByRole('button', { name: 'Share on Line' }); //page.locator('#suggest-for-you-default').getByRole('button', { name: 'Share on Line' });
        this.shareOnX = page.getByRole('button', { name: 'Share on X' }); //page.locator('#suggest-for-you-default').getByRole('button', { name: 'Share on X' });
        this.shareCopyLink = page.getByRole('button', { name: 'share-copy-link' });

        // ---------- Comment Section ----------
        this.layout_Comment = page.locator('.BlockSendComment__BlockSendCommentLayout-sc-d6705f8b-0');
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

        // ---------- Element Popular Promotion ----------
        this.box_ProPopular = page.locator('.BlockRelatePopular__BoxListPoppular-sc-be13f440-4');
        this.card_ProPopular = page.locator('.CardPromotion__CardComponent-sc-50ef9525-0');   //BlockRelatePopular__CardPopular-sc-be13f440-1
        this.coverImg_CardProPopular = this.card_ProPopular.locator('a[href^="/p/"]').first();   //CardPromotion__StyledLink-sc-50ef9525-2
        this.title_CardProPopular = this.card_ProPopular.locator('[class*="CardPromotion__TitleOther"]'); //CardPromotion__StyledLink-sc-50ef9525-2, CardPromotion__BlockTitle-sc-50f9525-3
        this.logoBrand_CardProPopular = this.card_ProPopular.locator('[class*="CardPromotion__BlockBrandLogo"] a'); //CardPromotion__BlockBrandLogo-sc-50f9525-6, CardPromotion__StyledLink-sc-50ef9525-2
        // this.buttonAction_CardProPopular = page.locator('.');
        this.shareBtn_CardProPopular = page.locator('.ButtonShare__ButtonWrapper-sc-686553f6-0'); //.CardPromotion__BlockShare-sc-50ef9525-13 style="visibility: hidden"
        this.loveBtn_CardProPopular = page.locator('.ButtonIconOnly__Button-sc-9be909ce-0.gRKZuw.btn.action-love'); // this.card.locator('.action-love');
        this.bookmarkBtn_CardProPopular = page.locator('.ButtonIconOnly__Button-sc-9be909ce-0.gRKZuw.btn.action-bookmark'); // this.card.locator('.action-bookmark');
        this.discAndDate_CardProPopular = this.card_ProPopular.locator('[class*="CardPromotion__Label"]'); //page.locator('.CardPromotion__Label-sc-50ef9525-10'); CardPromotion__BlockLabel
        // this.dateContent_CardProPopular = page.locator('.');
        this.labelPro_CardProPopular = this.card_ProPopular.getByText('โปรโมชัน', { exact: true }); //page.locator('#suggest-for-you-default').
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
        await this.promotionCard_titleTest.click(); //div:nth-child(4) 
        await this.page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
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
        return this.promotionCardEach.count();
    }

    async clickAuthorName() {
        await this.author_name.click();
    }

    // Re-check .first()
    async clickBookMarkButton() {
        await this.bookMarkButton.first().click();
    }

    async clickShareTop_Button() {
        await this.shareButton_top.click();
    }

    async clickShareFooter_Button() {
        await this.shareButton_footer.click();
    }

    // -------------- Relate --------------
    async clickShareOnFacebook_Relate(page: Page): Promise<Page> {
        await this.clickShare_PromotionPopular();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnFacebook.click();
        return await popupPromise;
    }

    async clickShareOnLine_Relate(page: Page): Promise<Page> {
        await this.clickShare_PromotionPopular();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnLine.click();
        return await popupPromise;
    }

    async clickShareOnX_Relate(page: Page): Promise<Page> {
        await this.clickShare_PromotionPopular();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnX.click();
        return await popupPromise;
    }

    // -------------- TOP --------------
    async clickShareOnFacebook_top(page: Page): Promise<Page> {
        await this.clickShareTop_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnFacebook.first().click();
        return await popupPromise;
    }

    async clickShareOnLine_top(page: Page): Promise<Page> {
        await this.clickShareTop_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnLine.first().click();
        return await popupPromise;
    }

    async clickShareOnX_top(page: Page): Promise<Page> {
        await this.clickShareTop_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnX.first().click();
        return await popupPromise;
    }

    // async clickShareCopyLink_top(page: Page): Promise<string> {
    async clickShareCopyLink_top() {
        await this.clickShareTop_Button();
        const clipboardValue = await this.shareCopyLink.first().getAttribute('data-clipboard-text'); // อ่านตอน element ยังอยู่
        await this.shareCopyLink.first().click(); // ค่อยคลิกจริงทีหลัง (จำลอง user คลิกจริง)
        return clipboardValue;
        // await this.clickShareTop_Button();
        // await this.shareCopyLink.first().click(); // คลิกจริง trigger การ copy
        // return await page.evaluate(() => navigator.clipboard.readText());
    }

    // -------------- FOOTER --------------
    async clickShareOnFacebook_footer(page: Page): Promise<Page> {
        await this.clickShareFooter_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnFacebook.nth(1).click();
        return await popupPromise;
    }

    async clickShareOnLine_footer(page: Page): Promise<Page> {
        await this.clickShareFooter_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnLine.nth(1).click();
        return await popupPromise;
    }

    async clickShareOnX_footer(page: Page): Promise<Page> {
        await this.clickShareFooter_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnX.nth(1).click();
        return await popupPromise;
    }

    async clickShareCopyLink_footer() {
        await this.clickShareFooter_Button();
        const clipboardValue = await this.shareCopyLink.nth(1).getAttribute('data-clipboard-text'); // อ่านตอน element ยังอยู่
        await this.shareCopyLink.nth(1).click(); // ค่อยคลิกจริงทีหลัง (จำลอง user คลิกจริง)
        return clipboardValue;
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
        const testComment = 'testcomment-auto';
        await this.promotionCard_image.first().click();
        await this.textBoxSendComment.click();
        await this.textBoxSendComment.fill(testComment);
        await this.submitCommentButton.click();
    }

    async sentReplyComment() {
        const testComment = 'testcomment-auto'
        await this.promotionCard_image.first().click();
        await this.textBoxReplyComment.click();
        await this.textBoxReplyComment.fill(testComment);
        await this.submitReplyCommentButton.click();
    }

    async clickPromotionPopular() {
        await this.coverImg_CardProPopular.first().click();
    }

    async clickLove_PromotionPopular() {
        await this.loveBtn_CardProPopular.first().click();
    }

    async clickBookmark_PromotionPopular() {
        await this.bookmarkBtn_CardProPopular.first().click();
    }

    async clickBrand_PromotionPopular() {
        await this.logoBrand_CardProPopular.first().click();
    }

    async clickShare_PromotionPopular() {
        await this.clickPromotionCard_title();
        await this.coverImg_CardProPopular.hover();
        await this.shareBtn_CardProPopular.click();
    }

    async clickAuthorLink() {
        await this.authorNameLink_ArticleDetail.first().click();
    }

    async clickShareCopyLink_mobile() {
        await this.shareButton_mobile.click();
        const clipboardValue = await this.shareCopyLink.getAttribute('data-clipboard-text');
        await this.shareCopyLink.click();
        return clipboardValue;
    }
}
