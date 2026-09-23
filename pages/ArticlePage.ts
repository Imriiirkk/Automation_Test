/*
POM: Article Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class ArticlePage {
    private page: Page;
    public readonly article_heading: Locator;

    // ---------- Article Highlight Banner ----------
    public readonly articleHightlight: Locator;
    public readonly articleBannerEach: Locator;
    public readonly indicatorEach: Locator;
    public readonly imgCover_CardBanner: Locator;
    public readonly title_CardBanner: Locator;
    public readonly author_CardBanner: Locator;
    public readonly datePublish_CardBanner: Locator;
    public readonly bookmark_CardBanner: Locator;

    // ---------- Article Categories Tap ----------
    private articleFilterBtn: Record<string, Locator>;
    public readonly blockMenuCategories: Locator;
    public readonly inactiveTab: Locator;
    public readonly activeTab: Locator;

    // ---------- Article Card ----------
    public readonly articleCard: Locator;
    public readonly articleCardEach: Locator;
    public readonly imgCover_ArticleCard: Locator;
    public readonly label_ArticleCard: Locator;
    public readonly title_ArticleCard: Locator;
    public readonly description_ArticleCard: Locator;
    public readonly datePost_ArticleCard: Locator;
    public readonly profileAuthor_ArticleCard: Locator;
    // public nameAuthor_ArticleCard: Locator;
    public readonly bookmark_ArticleCard: Locator;
    public readonly bookmarkCardIcon: Locator;

    // ---------- Article Detail ----------
    public readonly title_ArticleDetail: Locator;
    public readonly blockAuthor_ArticleDetail: Locator;
    public readonly authorNameLink_ArticleDetail: Locator;
    public readonly author_heading: Locator;
    public readonly postDate_ArticleDetail: Locator;
    public readonly viewCount_ArticleDetail: Locator;
    public readonly coverImg_ArticleDetail: Locator;
    public readonly textContent_ArticleDetail: Locator;
    public readonly shareDetail_btn: Locator;
    public readonly bookMarkDetail_btn: Locator;
    public readonly loveDetail_btn: Locator;
    public readonly shareOnFacebook: Locator;
    public readonly shareOnLine: Locator;
    public readonly shareOnX: Locator;
    public readonly shareCopyLink: Locator;
    public readonly tagItem: Locator;
    public readonly multiTagCard: Locator;

    public readonly shareDetail_footer: Locator;

    // ---------- Share Menu — บน ----------
    public readonly shareOnFacebook_top: Locator;
    public readonly shareOnX_top: Locator;
    public readonly shareOnLine_top: Locator;
    public readonly shareCopyLink_top: Locator;

    // ---------- Share Menu — ล่าง ----------
    public readonly shareOnFacebook_footer: Locator;
    public readonly shareOnX_footer: Locator;
    public readonly shareOnLine_footer: Locator;
    public readonly shareCopyLink_footer: Locator;

    readonly loadMoreButton: Locator;

    // ---------- Comment Section (Article Detail) ----------
    public readonly comment: Locator; //chong hai pim comment
    public readonly submitComment_Btn: Locator;
    public readonly replyComment_Btn: Locator; //pum "ตอบกลับ" wai doo reply comment tungmod 
    public readonly hiddenCommen_tBtn: Locator; //pum "ซ่อน" wai ซ่อน reply comment tungmod 

    // ---------- Article Interest Section ----------
    public readonly relatedArticleBlock: Locator;
    public readonly img_RelatedArticle: Locator;
    public readonly title_RelatedArticle: Locator;
    public readonly author_RelatedArticle: Locator;
    public readonly publishDate_RelatedArticle: Locator;
    public readonly bookmarkBtn_RelatedArticle: Locator;
    public readonly bookmarkIcon_RelatedArticle: Locator;
    public readonly loveBtn_RelatedArticle: Locator;
    public readonly loveIcon_RelatedArticle: Locator;
    public readonly shareBtn_RelatedArticle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.article_heading = page.getByRole('heading', { name: 'บทความ' });

        // ---------- Article Highlight Banner ----------
        this.articleHightlight = page.locator('.swiper'); //locator('.ArticalLageHorizontalCard__Card-sc-d1a5b486-0').first() และ 2) <div class="ArticalLageHorizontalCard__Card-sc-d1a5b486-0 weOVL">…</div> aka locator('div').filter({ hasText: /^Testerทดสอบสร้างบทความ1 ก\.ย\. 2569$/ }).nth(1)
        this.articleBannerEach = page.locator('.swiper-slide') //aria-label = "1 / 2", data-swiper-slide-index = "0" // .swiper-slide swiper-slide-active
        // .swiper-slide swiper-slide-next swiper-slide-prev
        this.indicatorEach = page.getByRole('button', { name: /Go to slide/ });  //.client__CustomPagination-sc-e3e6a812-0
        this.imgCover_CardBanner = page.getByRole('link', { name: 'link', exact: true }).nth(2); //.ComponentLink__StyledLink-sc-86eeea75-0.jPGtZW
        this.title_CardBanner = page.locator('.ArticalLageHorizontalCard__Title-sc-d1a5b486-2.hRDRhS'); //น่าจะต้องใช้ locator('a').filter({ hasText: /^ทดสอบสร้างบทความ$/ })
        this.author_CardBanner = page.locator('.ArticalLageHorizontalCard__Profile-sc-d1a5b486-6.hJHaPa'); //น่าจะใช้ locator('div').filter({ hasText: /^Tester$/ }).nth(1)
        this.datePublish_CardBanner = page.locator('.ArticalLageHorizontalCard__PublishedDate-sc-d1a5b486-4.cJGgqw'); // getByText('ก.พ. 2569')
        this.bookmark_CardBanner = page.locator('.swiper-slide.swiper-slide swiper-slide-active').getByTestId('bookmark-button');

        // ---------- Tab Categories ----------
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
        this.bookmark_ArticleCard = page.locator('.FixSizeArticleCard__BookmarkButton-sc-a3159c29-4'); // .getByTestId('bookmark-button')
        this.bookmarkCardIcon = this.bookmark_ArticleCard.locator('svg path'); // .locator('.FixSizeArticleCard__BookmarkButton-sc-a3159c29-4 > svg > path')

        // ---------- Article Detail ----------
        this.title_ArticleDetail = page.locator('.Text__H1-sc-30b53bf2-0');
        this.blockAuthor_ArticleDetail = page.locator('.BlockContent__BlockAuthor-sc-766b4868-13'); //img = .BlockContent__ImgAuthor-sc-766b4868-4
        // this.authorNameLink_ArticleDetail = page.locator('.BlockContent__StyledLink-sc-766b4868-7'); // class = BlockContent__AuthorName-sc-766b4868-5.NEKaJ >> aka getByRole('heading', { name: 'โดย : ชื่อauthor' })
        this.authorNameLink_ArticleDetail = page.locator('h5[class*="BlockContent__AuthorName"] a');
        this.author_heading = page.getByRole('heading', { name: /^โดย :/ })
        this.postDate_ArticleDetail = page.locator('.DateTimeContent__BlockDate-sc-b3b7f32b-2'); // DateTimeContent__Span-sc-b3b7f32b-4
        this.viewCount_ArticleDetail = page.locator('.DateTimeContent__BlockView-sc-b3b7f32b-3'); // DateTimeContent__Span-sc-b3b7f32b-4
        this.coverImg_ArticleDetail = page.locator('.BlockContent__CoverPhotoPost-sc-766b4868-9');
        this.textContent_ArticleDetail = page.locator('.RenderContentHTML__ContentStyle-sc-84005593-0');
        this.shareDetail_btn = page.locator('.BlockContent__ContentButtonShare-sc-766b4868-2').first(); //aka locator('.BlockContent__ContentButtonShare-sc-766b4868-2').first()
        this.bookMarkDetail_btn = page.locator('.ButtonIconBookMarkDetail__Button-sc-b157073f-0').first();
        this.loveDetail_btn = page.locator('.ButtonIconLoveDetail__Button-sc-10d0321c-0'); //.ButtonIconLoveDetail__Button-sc-10d0321c-0 > svg
        this.shareOnFacebook = page.getByRole('button', { name: 'Share on Facebook' })
        this.shareOnLine = page.getByRole('button', { name: 'Share on Line' })
        this.shareOnX = page.getByRole('button', { name: 'Share on X' })
        this.shareCopyLink = page.getByRole('button', { name: 'share-copy-link' })
        this.tagItem = page.locator('.TagItem__TagItem-sc-89fc6391-0');
        this.multiTagCard = page.locator('.BlockContent__BlockTags-sc-766b4868-15');
        this.shareDetail_footer = page.locator('.BlockContent__ContentButtonFooterShare-sc-766b4868-11') //role="button" ถ้ากดไม่ได้ใช้ .BlockContent__ShareFooterButton-sc-766b4868-12 นะเธอ 
        // ^ เวลาจะเรียกไอคอน fb ig line link = nth(1) ^

        // ---------- Share Menu — บน ----------
        this.shareOnFacebook_top = page.locator('.ShareDirectionRow__ShareBottomList-sc-30c129c6-2')
            .getByRole('button', { name: 'Share on Facebook' });
        this.shareOnX_top = page.locator('.ShareDirectionRow__ShareBottomList-sc-30c129c6-2')
            .getByRole('button', { name: 'Share on X' });
        this.shareOnLine_top = page.locator('.ShareDirectionRow__ShareBottomList-sc-30c129c6-2')
            .getByRole('button', { name: 'Share on Line' });
        this.shareCopyLink_top = page.locator('.ShareDirectionRow__ShareBottomList-sc-30c129c6-2')
            .locator('.ShareDirectionRow__ShareCopyLinkButton-sc-30c129c6-6');

        // ---------- Share Menu — ล่าง ----------
        this.shareOnFacebook_footer = page.locator('.ShareDirectionRow__ShareList-sc-30c129c6-1')
            .getByRole('button', { name: 'Share on Facebook' });
        this.shareOnX_footer = page.locator('.ShareDirectionRow__ShareList-sc-30c129c6-1')
            .getByRole('button', { name: 'Share on X' });
        this.shareOnLine_footer = page.locator('.ShareDirectionRow__ShareList-sc-30c129c6-1')
            .getByRole('button', { name: 'Share on Line' });
        this.shareCopyLink_footer = page.getByRole('button', { name: 'share-copy-link' }).nth(1)
        // locator('.ShareDirectionRow__ShareList-sc-30c129c6-1')
        //     .locator('.ShareDirectionRow__ShareCopyLinkButton-sc-30c129c6-6');

        // ---------- Comment Section (Article Detail) ----------
        this.comment = page.getByRole('textbox', { name: 'เขียนความคิดเห็น' }); // ถ้าจะแสดงความคิดเห็นใช้ .first() ถ้าจะ reply ใช้ nth(1)
        this.submitComment_Btn = page.getByRole('button', { name: 'ส่ง' }); // ถ้าจะส่งแสดงความคิดเห็นใช้ .first() ถ้าจะส่ง reply ใช้ nth(1)
        this.replyComment_Btn = page.locator(''); // 
        this.hiddenCommen_tBtn = page.locator(''); // ยังไม่แก้ locator

        // ---------- Article Interest Section ----------
        this.relatedArticleBlock = page.locator('.BlockRelatePopular__BoxListPoppular-sc-be13f440-4'); // card = BlockRelatePopular__CardPopular-sc-be13f440-1
        this.img_RelatedArticle = page.locator('.CardArticleRelate__StyledLink-sc-4738072-3').first();
        this.title_RelatedArticle = page.locator('.CardArticleRelate__BlockTitle-sc-4738072-2').first();
        this.author_RelatedArticle = page.locator('.CardArticleRelate__SectionPlatform-sc-4738072-8').first();
        this.publishDate_RelatedArticle = page.locator('.CardArticleRelate__PlatformLabel-sc-4738072-11');
        this.bookmarkBtn_RelatedArticle = page.locator('.ButtonIconBookMarkOnly__Button-sc-b618260f-0').first();
        this.bookmarkIcon_RelatedArticle = this.bookmarkBtn_RelatedArticle.locator('svg path');
        this.loveBtn_RelatedArticle = page.locator('.ButtonArticleDetailIcon__Button-sc-bee472b4-0');
        this.loveIcon_RelatedArticle = this.loveBtn_RelatedArticle.locator('svg path');
        this.shareBtn_RelatedArticle = page.locator('#suggest-for-you-default').getByRole('button'); //page.locator('.CardArticleRelate__ShareButton-sc-4738072-15').first();
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

    async clickBookMarkBanner() {
        await this.bookmark_CardBanner.click();
    }

    async clickArticleCard_image() {
        await this.imgCover_ArticleCard.first().click();
    }

    async clickArticleCard_title() {
        await this.title_ArticleCard.first().click();
        await this.page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });
    }

    async clickBookmarkCard() {
        await this.bookmark_ArticleCard.first().click();
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

    async clickShareDetail_Btnfooter() {
        await this.shareDetail_footer.click();
    }

    // --------- TOP ---------
    async clickShareOnFacebook_top(page: Page): Promise<Page> {
        await this.shareDetail_btn.click();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnFacebook_top.click();
        return await popupPromise;
    }

    async clickShareOnLine_top(page: Page): Promise<Page> {
        await this.shareDetail_btn.click();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnLine_top.click();
        return await popupPromise;
    }

    async clickShareOnX_top(page: Page): Promise<Page> {
        await this.shareDetail_btn.click();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnX_top.click();
        return await popupPromise;
    }

    async clickShareCopyLink_top(page: Page): Promise<string> {
        await this.shareDetail_btn.click();
        await this.shareCopyLink_top.click(); // คลิกจริง trigger การ copy
        return await page.evaluate(() => navigator.clipboard.readText()); // อ่านจาก clipboard จริง
    }

    //     async clickShareCopyLink_top() {
    //     await this.shareDetail_btn.click();
    //     const clipboardValue = await this.shareCopyLink_top.getAttribute('data-clipboard-text'); // อ่านตอน element ยังอยู่
    //     await this.shareCopyLink_top.click(); // ค่อยคลิกจริงทีหลัง (จำลอง user คลิกจริง)
    //     return clipboardValue;
    // }

    // --------- FOOTER ---------
    async clickShareOnFacebook_footer(page: Page): Promise<Page> {
        await this.shareDetail_footer.click();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnFacebook_footer.click();
        return await popupPromise;
    }

    async clickShareOnLine_footer(page: Page): Promise<Page> {
        await this.shareDetail_footer.click();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnLine_footer.click();
        return await popupPromise;
    }

    async clickShareOnX_footer(page: Page): Promise<Page> {
        await this.shareDetail_footer.click();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnX_footer.click();
        return await popupPromise;
    }

    async clickShareCopyLink_footer() {
        await this.shareDetail_footer.click();
        const clipboardValue = await this.shareCopyLink_footer.getAttribute('data-clipboard-text'); // อ่านตอน element ยังอยู่
        await this.shareCopyLink_footer.click(); // ค่อยคลิกจริงทีหลัง (จำลอง user คลิกจริง)
        return clipboardValue;
        // return await this.shareCopyLink_footer.getAttribute('data-clipboard-text');
    }

    // --------- Article Relate ---------
    async clickShareOnFacebook_Relate(page: Page): Promise<Page> {
        await this.clickShareBtnRelatedArticlie();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnFacebook.click();
        return await popupPromise;
    }

    async clickShareOnLine_Relate(page: Page): Promise<Page> {
        await this.clickShareBtnRelatedArticlie();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnLine.click();
        return await popupPromise;
    }

    async clickShareOnX_Relate(page: Page): Promise<Page> {
        await this.clickShareBtnRelatedArticlie();
        const popupPromise = page.waitForEvent('popup');
        await this.shareOnX.click();
        return await popupPromise;
    }

    async clickShareCopyLink_Relate(page: Page): Promise<string> {
        await this.clickShareBtnRelatedArticlie();
        await this.shareCopyLink.click(); // คลิกจริง trigger การ copy
        return await page.evaluate(() => navigator.clipboard.readText());
    }

    // async clickShareOnFacebook(page: Page): Promise<Page> {
    //     const popupPromise = page.waitForEvent('popup');
    //     await this.shareOnFacebook.click();
    //     return await popupPromise;
    // }

    // async clickShareOnLine(page: Page): Promise<Page> {
    //     const popupPromise = page.waitForEvent('popup');
    //     await this.shareOnLine.click();
    //     return await popupPromise;
    // }

    // async clickShareOnX(page: Page): Promise<Page> {
    //     const popupPromise = page.waitForEvent('popup');
    //     await this.shareOnX.click();
    //     return await popupPromise;
    // }

    // async clickShareCopyLink() {
    //     await this.shareCopyLink.click();
    // }

    async clickBookmarkDetail() {
        await this.bookMarkDetail_btn.click();
    }

    async clickLoveDetail() {
        await this.loveDetail_btn.click(); //.locator('svg')
    }

    async clickRelatedArticlieCard() {
        await this.title_RelatedArticle.click();
    }

    async clickLoveBtnRelatedArticlie() {
        await this.loveBtn_RelatedArticle.click();
    }

    async clickBookmarkBtnRelatedArticlie() {
        await this.bookmarkBtn_RelatedArticle.click();
    }

    async clickShareBtnRelatedArticlie() {
        await this.shareBtn_RelatedArticle.click();
    }

    async clickAuthorLink() {
        await this.authorNameLink_ArticleDetail.first().click();
    }



    //     async function findArticleWithRelated(page, articlePage) {
    //     const titles = articlePage.title_ArticleCard;
    //     const count = await titles.count();

    //     for (let i = 0; i < count; i++) {
    //         await titles.nth(i).click();
    //         await page.waitForURL(/\/p\/[a-zA-Z0-9-_]+/, { timeout: 10000 });

    //         if (await articlePage.relatedArticleBlock.count() > 0) {
    //             return true; // เจอโพสต์ที่มี related แล้ว หยุด loop
    //         }
    //         await page.goBack();
    //     }
    //     return false;
    // }
}