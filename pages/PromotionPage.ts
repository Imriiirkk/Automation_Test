import { Page, Locator } from '@playwright/test';

export class PromotionPage {
    private page: Page;
    public promotion_heading: Locator;

    // ---------- Promotion Categories Tap ----------
    private filterButtons: Record<string, Locator>;

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
    public blockauthor_footer: Locator;
    public blockTag: Locator;
    public blockSentComment: Locator;
    public blockComment: Locator;

    // ---------- Load More Button ----------
    readonly loadMoreButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.promotion_heading = page.getByRole('heading', { name: 'โปรโมชัน' });

        this.filterButtons = {
            oneGetone: page.getByRole('button', { name: '1 แถม 1' }),
            percentUp: page.getByRole('button', { name: '% up' }),
            proMobile: page.getByRole('button', { name: 'โปรมือถือ' }),
            foodie: page.getByRole('button', { name: 'อาหาร' }),
            cheapTicket: page.getByRole('button', { name: 'ตั๋วถูก' }),
            discountCode: page.getByRole('button', { name: 'โค้ดส่วนลด' })
        };

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
        this.blockContent = page.locator('.BlockContent__RootContent-sc-766b4868-0.cAgpqz')
        this.breadcrumb = page.locator('.Breadcrumb__BreadcrumbBlock-sc-21bc5eed-0.jkrBen')

        this.author_image = page.locator('.BlockContent__ImgAuthor-sc-766b4868-4') //
        this.author_name = page.locator('.BlockContent__AuthorName-sc-766b4868-5.NEKaJ.mt-1.mb-2') // BlockContent__AuthorName-sc-766b4868-5 NEKaJ mt-1 mb-2
        this.blockRemainingTime = page.locator('.DateTimeContent__TextColor-sc-b3b7f32b-0') //.DateTimeContent__TextColor-sc-b3b7f32b-0.jqqcfq
        this.blockDate = page.locator('.DateTimeContent__BlockDate-sc-b3b7f32b-2') //.DateTimeContent__BlockDate-sc-b3b7f32b-2.gbHPFY
        this.blockView = page.locator('.DateTimeContent__BlockView-sc-b3b7f32b-3') //.DateTimeContent__BlockView-sc-b3b7f32b-3.islMME
        this.shareButton_top = page.locator('.BlockContent__ContentButtonShare-sc-766b4868-2') //
        this.shareButton_footer = page.locator('.BlockContent__ContentButtonFooterShare-sc-766b4868-11') //
        this.bookMarkButton = page.locator('.ButtonIconBookMarkDetail__Button-sc-b157073f-0') //
        this.coverImage = page.locator('.BlockContent__CoverPhotoPost-sc-766b4868-9') //BlockContent__CoverPhotoPost-sc-766b4868-9 gHDPcc rounded
        this.textContent = page.locator('.RenderContentHTML__ContentStyle-sc-84005593-0') //<div class="RenderContentHTML__ContentStyle-sc-84005593-0 gvlvXY py-2" id="details">
        this.loveDetailButton_footer = page.locator('.ButtonIconLoveDetail__Button-sc-10d0321c-0') //
        this.blockauthor_footer = page.locator('.BlockContent__BlockAuthor-sc-766b4868-13') //BlockContent__BlockAuthor-sc-766b4868-13 jSYeWt
        this.blockTag = page.locator('.BlockContent__BlockTags-sc-766b4868-15:hidden') //BlockContent__BlockTags-sc-766b4868-15 bzDMPC //การ์ดแรกมี hidden
        this.blockSentComment = page.locator('.BlockSendComment__BlockSendCommentLayout-sc-d6705f8b-0') //BlockSendComment__BlockSendCommentLayout-sc-d6705f8b-0 ensIGq
        this.blockComment = page.locator('.BlockComment__BlockComments-sc-86b7d0e5-0') //BlockComment__BlockComments-sc-86b7d0e5-0 cOIDBs
    }

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
        await this.promotionCard_title.first().click();
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
        await this.bookMarkButton.first().click();
    }

    async clickShareTop_Button() {
        await this.shareButton_top.first().click();
    }

    async clickShareFooter_Button() {
        await this.shareButton_footer.first().click();
    }
    // Re-check .first()

    async clickLoveDetailButton() {
        await this.loveDetailButton_footer.click();
    }

    async clickTag() {
        await this.blockTag.click();
    }
}
