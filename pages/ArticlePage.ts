/*
POM: Article Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class ArticlePage {
    private page: Page;
    public article_heading: Locator;

    // ---------- Article Highlight Banner ----------
    public articleHightlight: Locator;
    public indicator1: Locator;
    public indicator2: Locator;

    // ---------- Article Categories Tap ----------
    private articleFilterBtn: Record<string, Locator>;
    public blockMenuCategories: Locator;
    public inactiveTab: Locator;
    public activeTab: Locator;

    // ---------- Article Card ----------
    public articleCard: Locator;
    public articleCardEach: Locator;
    public imgCover_ArticleCard: Locator;
    public label_ArticleCard: Locator;
    public title_ArticleCard: Locator;
    public description_ArticleCard: Locator;
    public datePost_ArticleCard: Locator;
    public profileAuthor_ArticleCard: Locator;
    // public nameAuthor_ArticleCard: Locator;
    public bookmark_ArticleCard: Locator;
    public bookmarkCardIcon: Locator;

    // ---------- Article Detail ----------
    public title_ArticleDetail: Locator;
    public imgAuthor_ArticleDetail: Locator;
    public authorName_ArticleDetail: Locator;
    public postDate_ArticleDetail: Locator;
    public viewCount_ArticleDetail: Locator;
    public coverImg_ArticleDetail: Locator;
    public textContent_ArticleDetail: Locator;
    public shareDetail_btn: Locator;
    public bookMarkDetail_btn: Locator;
    public loveDetail_btn: Locator;
    public shareOnFacebook: Locator;
    public shareOnLine: Locator;
    public shareOnX: Locator;
    public shareCopyLink: Locator;
    public tagItem: Locator;
    public multiTagCard: Locator;

    readonly loadMoreButton: Locator;

    // ---------- Comment Section (Article Detail) ----------
    public comment: Locator; //chong hai pim comment
    public replyComment: Locator; //chong hai pim tob comment
    public replyComment_Btn: Locator; //pum "ตอบกลับ" wai doo reply comment tungmod 
    public hiddenCommen_tBtn: Locator; //pum "ซ่อน" wai ซ่อน reply comment tungmod 

    // ---------- Article Interest Section ----------
    public relatedArticleBlock: Locator;
    public img_RelatedArticle: Locator;
    public title_RelatedArticle: Locator;
    public author_RelatedArticle: Locator;
    public publishDate_RelatedArticle: Locator;
    public bookmarkBtn_RelatedArticle: Locator;
    public bookmarkIcon_RelatedArticle: Locator;
    public loveBtn_RelatedArticle: Locator;
    public loveIcon_RelatedArticle: Locator;
    public shareBtn_RelatedArticle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.article_heading = page.getByRole('heading', { name: 'บทความ' });

        // ---------- Article Highlight Banner ----------
        this.articleHightlight = page.locator('.swiper'); //locator('.ArticalLageHorizontalCard__Card-sc-d1a5b486-0').first() และ 2) <div class="ArticalLageHorizontalCard__Card-sc-d1a5b486-0 weOVL">…</div> aka locator('div').filter({ hasText: /^Testerทดสอบสร้างบทความ1 ก\.ย\. 2569$/ }).nth(1)
        this.indicator1 = page.getByRole('button', { name: 'Go to slide 1' });  //.client__CustomPagination-sc-e3e6a812-0
        this.indicator2 = page.getByRole('button', { name: 'Go to slide 2' });

        this.articleFilterBtn = {
            pro_fashion: page.getByRole('button', { name: 'โปรสายแฟ' }),
            pro_eat: page.getByRole('button', { name: 'โปรกิน' }),
            pro_travel: page.getByRole('button', { name: 'โปรเที่ยว' }),
            pro_smart: page.getByRole('button', { name: 'โปรสมาร์ท' }),
            pro_update: page.getByRole('button', { name: 'โปรอัพเดท' }),
            pro_talking: page.getByRole('button', { name: 'โปรชวนคุย' })
        };
        // BlockContent__Block-sc-ba535f25-0 >> ครอบแท็บ filter ทั้งหมด
        this.blockMenuCategories = page.locator('.BlogFilterCategories__BlockMenuCategories-sc-ec10c760-0');
        this.inactiveTab = page.locator('.BlogFilterSelector__BlockInactiveTab-sc-7829bd5c-1');
        this.activeTab = page.locator('.BlogFilterSelector__BlockActiveTab-sc-7829bd5c-0');

        this.loadMoreButton = page.getByRole('button', { name: 'ดูเพิ่มเติม' });

        // ---------- Article Card ----------
        this.articleCard = page.locator('.BlogMultiCategories__ListArticle-sc-a10bddd5-0');
        this.articleCardEach = page.locator('.BlogMultiCategories__BlockArticle-sc-a10bddd5-1');
        this.imgCover_ArticleCard = page.locator('.ComponentLink__StyledLink-sc-86eeea75-0');
        this.label_ArticleCard = page.locator('.FixSizeArticleCard__ArticleLabel-sc-a3159c29-8');
        this.title_ArticleCard = page.locator('.ComponentLink__StyledLink-sc-86eeea75-0'); //FixSizeArticleCard__Title-sc-a3159c29-2
        this.description_ArticleCard = page.locator('.FixSizeArticleCard__Desction-sc-a3159c29-3'); // title + des อยู่ link div.a เดียวกัน
        this.datePost_ArticleCard = page.locator('.FixSizeArticleCard__PublishedDate-sc-a3159c29-5');
        this.profileAuthor_ArticleCard = page.locator('.FixSizeArticleCard__Profile-sc-a3159c29-7'); //block profile = img + name
        // this.nameAuthor_ArticleCard = page.locator('.BlogMultiCategories__BlockArticle-sc-a10bddd5-1'); //block profile = img + name 
        this.bookmark_ArticleCard = page.getByTestId('bookmark-button').first(); //.locator('.FixSizeArticleCard__BookmarkButton-sc-a3159c29-4'); // .getByTestId('bookmark-button')
        this.bookmarkCardIcon = this.bookmark_ArticleCard.locator('svg path'); // .locator('.FixSizeArticleCard__BookmarkButton-sc-a3159c29-4 > svg > path')

        // ---------- Article Detail ----------
        this.title_ArticleDetail = page.locator('.Text__H1-sc-30b53bf2-0');
        this.imgAuthor_ArticleDetail = page.locator('.BlockContent__ImgAuthor-sc-766b4868-4');
        this.authorName_ArticleDetail = page.locator('.BlockContent__AuthorName-sc-766b4868-5'); // link = BlockContent__StyledLink-sc-766b4868-7 >> aka getByRole('heading', { name: 'โดย : PJN Tester Punpromotion' })
        this.postDate_ArticleDetail = page.locator('.DateTimeContent__BlockDate-sc-b3b7f32b-2'); // DateTimeContent__Span-sc-b3b7f32b-4
        this.viewCount_ArticleDetail = page.locator('.DateTimeContent__BlockView-sc-b3b7f32b-3'); // DateTimeContent__Span-sc-b3b7f32b-4
        this.coverImg_ArticleDetail = page.locator('.BlockContent__CoverPhotoPost-sc-766b4868-9');
        this.textContent_ArticleDetail = page.locator('.RenderContentHTML__ContentStyle-sc-84005593-0');
        this.shareDetail_btn = page.locator('.BlockContent__ContentButtonShare-sc-766b4868-2').first(); //aka locator('.BlockContent__ContentButtonShare-sc-766b4868-2').first()
        this.bookMarkDetail_btn = page.locator('.ButtonIconBookMarkDetail__Button-sc-b157073f-0').first();
        this.loveDetail_btn = page.locator('.ButtonIconLoveDetail__Button-sc-10d0321c-0'); //.ButtonIconLoveDetail__Button-sc-10d0321c-0 > svg
        this.shareOnFacebook = page.getByRole('button', { name: 'Share on Facebook' }).first();
        this.shareOnLine = page.getByRole('button', { name: 'Share on Line' }).first();
        this.shareOnX = page.getByRole('button', { name: 'Share on X' }).first();
        this.shareCopyLink = page.getByRole('button', { name: 'share-copy-link' }).first();
        this.tagItem = page.locator('.TagItem__TagItem-sc-89fc6391-0');
        this.multiTagCard = page.locator('.BlockContent__BlockTags-sc-766b4868-15');

        // ---------- Comment Section (Article Detail) ----------
        this.comment = page.locator(''); //
        this.replyComment = page.locator(''); //
        this.replyComment_Btn = page.locator(''); // 
        this.hiddenCommen_tBtn = page.locator(''); // ยังไม่แก้ locator

        // ---------- Article Interest Section ----------
        this.relatedArticleBlock = page.locator('.BlockRelatePopular__BoxListPoppular-sc-be13f440-4'); // card = BlockRelatePopular__CardPopular-sc-be13f440-1
        this.img_RelatedArticle = page.locator('.CardArticleRelate__StyledLink-sc-4738072-3');
        this.title_RelatedArticle = page.locator('.CardArticleRelete__BlockTitle-sc-4738072-2');
        this.author_RelatedArticle = page.locator('.CardArticleRelete__SectionPlatform-sc-4738072-8');
        this.publishDate_RelatedArticle = page.locator('.CardArticleRelete__PlatformLabel-sc-4738072-11');
        this.bookmarkBtn_RelatedArticle = page.locator('.ButtonIconBookmarkOnly__Button-sc-b618260f-0');
        this.bookmarkIcon_RelatedArticle = this.bookmarkBtn_RelatedArticle.locator('svg path');
        this.loveBtn_RelatedArticle = page.locator('.ButtonArticleDetailIcon__Button-sc-bee472b4-0');
        this.loveIcon_RelatedArticle = this.loveBtn_RelatedArticle.locator('svg path');
        this.shareBtn_RelatedArticle = page.locator('.CardArticleRelate__ShareButton-sc-4738072-15');

    }

    // ==================== Page Actions ====================

    async clickArticleFilter(filterName: string) {
        const locator = this.articleFilterBtn[filterName];
        if (!locator) {
            throw new Error(`ไม่พบ filter ชื่อ "${filterName}"`);
        }
        await locator.click();
    }

    async clickHighlightBanner() {
        await this.articleHightlight.first().click();
    }

    async clickArticleCard_image() {
        await this.imgCover_ArticleCard.first().click();
    }

    async clickArticleCard_title() {
        await this.title_ArticleCard.first().click();
    }

    async clickBookmarkCard() {
        await this.bookmark_ArticleCard.click();
    }

    async clickTag() {
        await this.tagItem.first().click();
    }

    async clickLoadMore() {
        await this.loadMoreButton.click();
    }

    async clickShareDetail_Button() {
        await this.shareDetail_btn.click();
    }

    async clickShareOnFacebook(page: Page): Promise<Page> {
        await this.clickShareDetail_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnFacebook.click();
        return await popupPromise;
    }

    async clickShareOnLine(page: Page): Promise<Page> {
        await this.clickShareDetail_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnLine.click();
        return await popupPromise;
    }

    async clickShareOnX(page: Page): Promise<Page> {
        await this.clickShareDetail_Button();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnX.click();
        return await popupPromise;
    }

    async clickShareCopyLink() {
        await this.clickShareDetail_Button();
        await this.shareCopyLink.click();
    }

    async clickBookmarkDetail() {
        await this.bookMarkDetail_btn.click();
    }

    async clickLoveDetail() {
        await this.loveDetail_btn.locator('svg').click();
    }

    async clickRelatedArticlieCard() {
        await this.title_RelatedArticle.first().click();
    }

    async clickLoveBtnRelatedArticlie() {
        await this.loveBtn_RelatedArticle.first().click();
    }

    async clickBookmarkBtnRelatedArticlie() {
        await this.bookmarkBtn_RelatedArticle.first().click();
    }

    async clickShareBtnRelatedArticlie() {
        await this.shareBtn_RelatedArticle.first().click();
    }
}