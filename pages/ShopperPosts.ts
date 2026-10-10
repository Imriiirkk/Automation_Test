/*
POM: Shopper Posts Page
Owner: Film
*/

import { Page, Locator, expect } from '@playwright/test';

export class ShopperPostsPage {
    private page: Page;
    public readonly shopper_heading: Locator;
    public readonly loadMoreButton: Locator;

    // ---------- Shopper Highlight Banner ----------
    public readonly hightlight_heading: Locator;
    public readonly shopperHightlight: Locator;
    public readonly bannerSlide: Locator;
    public readonly bannerActiveSlide: Locator;
    public readonly bannerNextSlide: Locator;
    public readonly bannerPrevSlide: Locator;
    public readonly bannerCard: Locator;
    public readonly bannerCover: Locator;
    public readonly bannerTitle: Locator;
    public readonly bannerTitleLink: Locator;
    public readonly bannerPrice: Locator;
    public readonly bannerDate: Locator;

    // ---------- Indicator ----------
    public readonly bannerPagination: Locator;
    public readonly indicator: Locator;
    public readonly activeIndicator: Locator;
    public readonly leftArrow: Locator;
    public readonly rightArrow: Locator;

    // ---------- Shopper Categories Tap ----------
    private readonly shopperFilterBtn: Record<string, Locator>;
    public readonly individual_item: Locator;
    public readonly event_items: Locator;
    public readonly selectCardDeopdown: Locator;

    // ---------- Shopper Card Individual Item ----------
    public readonly itemShopperPostCard: Locator;
    public readonly itemShopperPostCardEach: Locator;
    public readonly imgCover_ItemCard: Locator;
    public readonly label_ItemCard: Locator;
    public readonly title_ItemCard: Locator;
    public readonly contentPrice_ItemCard: Locator;
    public readonly love_ItemCard: Locator;
    public readonly inStock_lable: Locator;
    public readonly itemCardTitleLink: Locator;

    // ---------- Shopper Card Event ----------
    public readonly shopperPostCard: Locator;
    public readonly shopperCardArticle: Locator;
    public readonly shopperPostCardEach: Locator;
    public readonly imgCover_EventCard: Locator; //ใช้เหมือนกันกับ imgCover_ItemCard
    public readonly title_EventCard: Locator; //ใช้เหมือนกันกับ imgCover_ItemCard
    public readonly eventCardTitleLink: Locator;
    public readonly dateContent_EventCard: Locator;
    public readonly proLabel_EventCard: Locator;

    // ---------- Shopper Individual Item Detail ----------
    public readonly shopperDetail_ContentBox: Locator;
    public readonly title_ItemDetail: Locator;
    public readonly coverImg_ItemDetail: Locator;
    public readonly price_ItemDetail: Locator;
    // public percentDiscount: Locator; อาจจะไม่มี
    public readonly productType_ItemDetail: Locator;
    public readonly purchaseBtn_ItemDetail: Locator;
    public readonly loveBtn_ItemDetail: Locator;
    public readonly shareBtn_ItemDetail: Locator;
    public readonly shareOnFacebook_ItemDetail: Locator;
    public readonly shareOnLine_ItemDetail: Locator;
    public readonly shareOnX_ItemDetail: Locator;
    public readonly shareCopyLink_ItemDetail: Locator;
    public readonly owner_shopper: Locator;
    public readonly descrition_ItemDetail: Locator;
    public readonly tag_ItemDetail: Locator;
    public readonly viewAllBtn_ItemDetail: Locator;
    public readonly inStockLable_Detail: Locator;
    public readonly nextSlide_Btn: Locator;
    public readonly previousSlide_Btn: Locator;
    public readonly allIndicator: Locator;
    public readonly indicator_Btn: Locator;
    public readonly block_ItemSameEvent: Locator;

    // ---------- การ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน ----------
    public readonly itemSameEvent: Locator;
    public readonly itemSameEvent_Slide: Locator;
    public readonly card_ItemSameEvent: Locator;
    public readonly itemSameEvent_ActiveSlide: Locator;
    public readonly itemSameEvent_NextSlide: Locator;
    public readonly itemSameEvent_PrevSlide: Locator;
    public readonly title_ItemSameEvent: Locator;
    public readonly coverImg_ItemSameEvent: Locator;
    public readonly postLabel_ItemSameEvent: Locator;
    public readonly eventName_ItemSameEvent: Locator;
    public readonly price_ItemSameEvent: Locator;
    public readonly loveBtn_ItemSameEvent: Locator;

    // ---------- Shopper Event Detail ----------
    public readonly eventDetail_ContentBox: Locator;
    public readonly eventDetail_BoxDetail: Locator;
    public readonly title_EventDetail: Locator;
    public readonly coverImg_EventDetail: Locator;
    public readonly description_EventDetail: Locator;
    public readonly priceLabel_EventDetail: Locator;
    public readonly viewCount_EventDetail: Locator;
    public readonly dateStart_EventDetail: Locator;
    public readonly shareBtn_EventDetail: Locator;
    public readonly loveBtn_EventDetail: Locator;
    public readonly shareOnFacebook_EventDetail: Locator;
    public readonly shareOnLine_EventDetail: Locator;
    public readonly shareOnX_EventDetail: Locator;
    public readonly shareCopyLink_EventDetail: Locator;

    // ---------- Shopper การ์ดสินค้าที่เข้าร่วมอีเวนต์นั้น ๆ ----------
    public readonly listEventItem: Locator;
    public readonly blockEventItem: Locator;
    public readonly title_ItemOnEvent: Locator;
    public readonly coverImg_ItemOnEvent: Locator;
    public readonly price_ItemOnEvent: Locator;
    public readonly purchaseBtn_ItemOnEvent: Locator;

    // path link เวลากด ฝากหิ้วชิ้นนี้ = /application

    constructor(page: Page) {
        this.page = page;
        this.shopper_heading = page.getByRole('heading', { name: 'สินค้ารับหิ้ว', exact: true });

        // ---------- Shopper Highlight Banner ----------
        this.hightlight_heading = page.getByRole('heading', { name: '10 อันดับงานอีเวนต์ยอดนิยม', exact: true });

        this.shopperHightlight = page.locator('.swiper');
        this.bannerSlide = this.shopperHightlight.locator('.swiper-slide');
        this.bannerActiveSlide = this.shopperHightlight.locator('.swiper-slide-active');
        this.bannerNextSlide = this.shopperHightlight.locator('.swiper-slide-next');
        this.bannerPrevSlide = this.shopperHightlight.locator('.swiper-slide-prev');
        this.bannerCard = this.bannerActiveSlide.locator('a').first();  // Card ของ Slide ที่ Active
        this.bannerCover = this.bannerCard.locator('div[style*="background-image"]');   // Cover เป็น div ที่มี background-image
        this.bannerTitle = this.bannerActiveSlide.locator('[class*="ShopperPostHorizontalCard__Title"]');   // ชื่อ Event
        this.bannerPrice = this.bannerActiveSlide.locator('[class*="ShopperPostHorizontalCard__PriceContent"]') // PriceContent lable: ShopperPostHorizontalCard__PriceContent-sc-2e29571b-5
        this.bannerDate = this.bannerActiveSlide.locator('[class*="ShopperPostHorizontalCard__DateCotent"]'); // วันเริ่ม: ShopperPostHorizontalCard__DateCotent-sc-2e29571b-4
        this.bannerTitleLink = this.bannerTitle.locator('xpath=ancestor::a');   // <a> ที่ครอบชื่อ Event

        // ---------- Indicator ----------
        this.bannerPagination = page.locator('[class*="SlideMulti__CustomPagination"]');
        this.indicator = this.bannerPagination.locator('.swiper-pagination-bullet');
        this.activeIndicator = this.bannerPagination.locator('.swiper-pagination-bullet-active');

        // ---------- Arrow ----------
        this.leftArrow = page.locator('.SlideMulti__CustomNavigationButton-sc-18f2845a-1').filter({ has: page.locator('i.fa-arrow-left') });
        this.rightArrow = page.locator('.SlideMulti__CustomNavigationButton-sc-18f2845a-1').filter({ has: page.locator('i.fa-arrow-right') });

        // this.blockMenuCategories = page.locator('.ProFilterCategories__BlockMenuCategories-sc-e0f955f4-0') //ProFilterCategories__BlockMenuCategories-sc-e0f955f4-0 deYHar
        this.shopperFilterBtn = {
            allItem: page.locator('#filter-shopper-post-all'), //.getByRole('button', { name: 'ทั้งหมด' }), //.locator('#filter-shopper-post-all')
            onEvent: page.locator('#filter-shopper-post-item'), //.getByRole('button', { name: 'รับหิ้วหน้างาน' }), //.locator('#filter-shopper-post-item')
            inStock: page.locator('#filter-shopper-post-stock'), //.getByRole('button', { name: 'สินค้าในสต็อก' }), //.locator('#filter-shopper-post-stock')
        };
        this.individual_item = page.locator('div').filter({ hasText: /^สินค้ารายชิ้น$/ }); //.locator('.SelectCardDropdown__Item-sc-271849bf-3'); //<span>สินค้ารายชิ้น</span>
        this.event_items = page.locator('div').filter({ hasText: /^สินค้ารายอีเวนต์$/ }); //locator('.SelectCardDropdown__Item-sc-271849bf-3'); //<span>สินค้ารายอีเวนต์</span>
        this.selectCardDeopdown = page.locator('.SelectCardDropdown__Wrapper-sc-271849bf-0');

        this.loadMoreButton = page.getByRole('button', { name: 'ดูเพิ่มเติม' });

        // ---------- Shopper Card Item ----------
        this.itemShopperPostCard = page.locator('[class*="ListItemShopperPost__ListPosts"]');   //.ListItemShopperPost__ListPosts-sc-c96491c8-0
        this.itemShopperPostCardEach = page.locator('[class*="FixSizeItemCard__Card"]'); //itemShopperPostCard.locator('[class*="ListItemShopperPost__BlockArticle"]')
        this.imgCover_ItemCard = this.itemShopperPostCardEach.locator('a[aria-label="link"]:has(div[style*="background-image"])');
        // this.imgCover_ItemCard = this.itemShopperPostCardEach.locator('div[style*="background-image"]'); // ใช้เหมือนกันกับ title.ComponentLink__StyledLink-sc-86eeea75-0. FixSizeItemCard__Card-sc-2c06b627-0 > a').first();
        this.label_ItemCard = this.itemShopperPostCardEach.locator('[class*="FixSizeItemCard__PostLabel"]'); //.FixSizeItemCard__PostLabel-sc-2c06b627-5
        this.title_ItemCard = this.itemShopperPostCardEach.locator('[class*="FixSizeItemCard__Title"]'); //.FixSizeItemCard__Title-sc-2c06b627-4 event: .FixSizeItemCard__PostTitle-sc-2c06b627-3
        this.itemCardTitleLink = this.title_ItemCard.locator('xpath=ancestor::a');
        this.contentPrice_ItemCard = this.itemShopperPostCardEach.locator('[class*="FixSizeItemCard__PriceContent"]'); //.FixSizeItemCard__PriceContent-sc-2c06b627-7
        this.love_ItemCard = this.itemShopperPostCardEach.locator('[class*="FixSizeItemCard__FavouriteButton"]'); //.FixSizeItemCard__FavouriteButton-sc-2c06b627-8 role="button" aria-label="Add to favorites"
        this.inStock_lable = this.itemShopperPostCardEach.locator('[class*="FixSizeItemCard__ContentPostTypeStock"]'); //.FixSizeItemCard__ContentPostTypeStock-sc-2c06b627-2


        // ---------- Shopper Card Event ----------
        this.shopperPostCard = page.locator('[class*="ListShopperPost__ListPosts"]');   //ListShopperPost__ListPosts-sc-99cb7286-0
        this.shopperCardArticle = this.shopperPostCard.locator('[class*="ListShopperPost__BlockArticle"]');
        this.shopperPostCardEach = page.locator('[class*="FixSizeShopperPostCard__Card"]'); //.ListShopperPost__ListPosts-sc-99cb7286-1
        this.imgCover_EventCard = this.shopperPostCardEach.locator('a[aria-label="link"]:has(div[style*="background-image"])');  // ใช้เหมือนกันกับ title
        this.title_EventCard = this.shopperPostCardEach.locator('[class*="FixSizeShopperPostCard__Title"]');  // ใช้เหมือนกันกับ coverImg
        this.eventCardTitleLink = this.title_EventCard.locator('xpath=ancestor::a');
        this.dateContent_EventCard = this.shopperPostCardEach.locator('[class*="FixSizeShopperPostCard__DateCotent"]').first(); //FixSizeShopperPostCard__DateContent-sc-bf72de59-4
        this.proLabel_EventCard = this.shopperPostCardEach.locator('[class*="FixSizeShopperPostCard__PriceContent"]').first(); //.FixSizeShopperPostCard__PriceContent-sc-bf72de59-5

        // ---------- Individual Item Detail ----------
        this.shopperDetail_ContentBox = page.locator('[class*="ShopperDetail__ContentBox"]');
        this.title_ItemDetail = this.shopperDetail_ContentBox.locator('[class*="ShopperDetail__Title"]'); //.ShopperDetail__Title-sc-7a17d395-3
        this.coverImg_ItemDetail = page.locator('[class*="ShopperDetail__ImageBox"]'); //ShopperDetail__ImageBox-sc-7a17d395-0
        this.price_ItemDetail = this.shopperDetail_ContentBox.locator('[class*="ShopperDetail__Price"]'); //.ShopperDetail__Price-sc-7a17d395-4
        // this.percentDiscount = page.locator('.'); อาจจะไม่มี
        this.productType_ItemDetail = this.shopperDetail_ContentBox.locator('[class*="ShopperDetail__CategoryTypeBox"] button'); //.ShopperDetail__CategoryTypeBox-sc-7a17d395-5 มี Button type="button" ข้างใน
        this.purchaseBtn_ItemDetail = this.shopperDetail_ContentBox.locator('[class*="ShopperDetail__PurchaseButton"]'); //.ShopperDetail__PurchaseButton-sc-7a17d395-9
        this.loveBtn_ItemDetail = page.locator('[class*="ShopperDetail__CircleButton"]').first(); //.ShopperDetail__CircleButton-sc-7a17d395-10
        this.shareBtn_ItemDetail = page.locator('[class*="ShopperDetail__CircleButton"].position-relative'); //.ShopperDetail__CircleButton-sc-7a17d395-10.cIwDzr.btn.position-relative
        this.shareOnFacebook_ItemDetail = page.getByTestId('share-direction-row').getByRole('button', { name: 'Share on Facebook' }); //getByTestId('share-direction-row').
        this.shareOnLine_ItemDetail = page.getByTestId('share-direction-row').getByRole('button', { name: 'Share on Line' });
        this.shareOnX_ItemDetail = page.getByTestId('share-direction-row').getByRole('button', { name: 'Share on X' });
        this.shareCopyLink_ItemDetail = page.getByTestId('share-direction-row').getByRole('button', { name: 'share-copy-link' });
        this.owner_shopper = this.shopperDetail_ContentBox.locator('[class*="ShopperDetail__ShopperOwnerBox"]'); //.ShopperDetail__ShopperOwnerBox-sc-7a17d395-12
        this.descrition_ItemDetail = this.shopperDetail_ContentBox.locator('[class*="ShopperDetail__PostDescription"]'); //.ShopperDetail__PostDescription-sc-7a17d395-15
        this.tag_ItemDetail = this.shopperDetail_ContentBox.locator('[class*="ShopperDetail__CategoryTagBox"] button');

        this.block_ItemSameEvent = page.locator('[class*="ItemList__Box"]'); //.ItemList__Box-sc-41041f1b-0
        this.viewAllBtn_ItemDetail = this.block_ItemSameEvent.locator('[class*="ItemList__BoxHeader"]').locator('[class*="ItemList__ViewAllButton"]'); //.ItemList__ViewAllButton-sc-41041f1b-3
        this.inStockLable_Detail = page.locator('.ShopperDetail__ContentPostTypeStock-sc-7a17d395-2');

        this.nextSlide_Btn = page.getByRole('button', { name: 'Next slide' });
        this.previousSlide_Btn = page.getByRole('button', { name: 'Previous slide' });
        this.allIndicator = page.locator('.ItemList__CustomPagination-sc-41041f1b-6');
        this.indicator_Btn = page.getByRole('button', { name: /Go to slide/ });

        // ---------- การ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน ----------
        this.itemSameEvent = page.locator('[class*="ItemList__BoxContent"]').locator('.swiper');
        this.itemSameEvent_Slide = this.itemSameEvent.locator('.swiper-slide');
        this.itemSameEvent_ActiveSlide = this.itemSameEvent.locator('.swiper-slide-active');
        this.itemSameEvent_NextSlide = this.itemSameEvent.locator('.swiper-slide-next');
        this.itemSameEvent_PrevSlide = this.itemSameEvent.locator('.swiper-slide-prev');
        // aria-label="n / x" n = การ์ดที่ n, x = จำนวนการ์ทั้งหมดที่มีในอีเวนท์นั้น
        // การ์ดแรก '[class*="swiper-slide swiper-slide-active"]' การ์ดที่2 '[class*="swiper-slide swiper-slide-next"]' การ์ดที่3-5 '[class*="swiper-slide"]'
        // พอกด nextSlide_Btn การ์ดแรกจะเปลี่ยนเป็น '[class*="swiper-slide swiper-slide-prev"]' การ์ดที่2 '[class*="swiper-slide  swiper-slide-active"]' การ์ดที่3 '[class*="swiper-slide swiper-slide-next"]' การ์ดที่4-5 '[class*="swiper-slide"]'
        this.card_ItemSameEvent = this.itemSameEvent_ActiveSlide.locator('[class*="FixSizeItemCard__Card"]');
        this.title_ItemSameEvent = this.itemSameEvent_ActiveSlide.locator('[class*="FixSizeItemCard__Title"]');
        this.coverImg_ItemSameEvent = this.itemSameEvent_ActiveSlide.locator('div[style*="background-image"]');
        this.postLabel_ItemSameEvent = this.itemSameEvent_ActiveSlide.locator('[class*="FixSizeItemCard__PostLabel"]');
        this.eventName_ItemSameEvent = this.itemSameEvent_ActiveSlide.locator('[class*="FixSizeItemCard__PostTitle"]');
        this.price_ItemSameEvent = this.itemSameEvent_ActiveSlide.locator('[class*="FixSizeItemCard__PriceContent"]');
        this.loveBtn_ItemSameEvent = this.itemSameEvent_ActiveSlide.getByRole('button', { name: /favorites/i });

        // ---------- Shopper Event Detail ----------
        this.eventDetail_ContentBox = page.locator('[class*="PostDetail__BlockContent"]');
        this.eventDetail_BoxDetail = this.eventDetail_ContentBox.locator('[class*="PostDetail__Box"]');
        this.title_EventDetail = this.eventDetail_BoxDetail.locator('[class*="PostDetail__Title"]');
        this.coverImg_EventDetail = this.eventDetail_ContentBox.locator('[class*="PostDetail__CoverEventDetail"]');
        this.description_EventDetail = this.eventDetail_BoxDetail.locator('[class*="PostDetail__Descript"]');
        this.priceLabel_EventDetail = this.eventDetail_BoxDetail.locator('[class*="PostDetail__Price"]');
        this.viewCount_EventDetail = this.eventDetail_BoxDetail.locator('[class*="PostDetail__ViewTotal"]');
        this.dateStart_EventDetail = this.eventDetail_BoxDetail.locator('[class*="PostDetail__StartDate-sc-"]');
        this.shareBtn_EventDetail = this.eventDetail_BoxDetail.locator('[class*="PostDetail__ActionButton"].position-relative');
        this.loveBtn_EventDetail = this.eventDetail_BoxDetail.locator('[class*="PostDetail__ActionButton"]').first();
        this.shareOnFacebook_EventDetail = page.getByRole('button', { name: 'Share on Facebook' });
        this.shareOnLine_EventDetail = page.getByRole('button', { name: 'Share on Line' });
        this.shareOnX_EventDetail = page.getByRole('button', { name: 'Share on X' });
        this.shareCopyLink_EventDetail = page.getByRole('button', { name: 'share-copy-link' });

        // ---------- Shopper การ์ดสินค้าที่เข้าร่วมอีเวนต์นั้น ๆ ----------
        // ---------- Shopper การ์ดสินค้าที่เข้าร่วมอีเวนต์นั้น ๆ ----------
        this.listEventItem = page.locator('[class*="ListItemEventDetail__ListEventItem"]');
        this.blockEventItem = this.listEventItem.locator('[class*="ListItemEventDetail__BlockEventItem"]').first();
        this.title_ItemOnEvent = this.blockEventItem.locator('[class*="CardCarryItem__BlockTitle"]');
        this.coverImg_ItemOnEvent = this.blockEventItem.locator('div[style*="background-image"]').first();
        this.price_ItemOnEvent = this.blockEventItem.locator('[class*="CardCarryItem__BlockPrice"]');
        this.purchaseBtn_ItemOnEvent = this.blockEventItem.locator('[class*="CardCarryItem__ButtonCarry"]');
    }

    // ==================== Page Actions ====================

    async clickFilter_Event() {
        await this.selectCardDeopdown.click();
        await this.event_items.click();
    }

    async clickFilter_Item() {
        await this.selectCardDeopdown.click();
        await this.individual_item.nth(1).click();
    }

    async clickTab(filterName: string) {
        const locator = this.shopperFilterBtn[filterName];
        if (!locator) {
            throw new Error(`ไม่พบ Tab ชื่อ "${filterName}"`);
        }
        await locator.click();
    }

    // ---------- Individual Item Card ----------
    async clickItemCard_image() {
        await this.imgCover_ItemCard.first().click();
    }

    async clickItemCard_title() {
        await this.title_ItemCard.first().click();
    }

    // ---------- Event Card ----------
    async clickEventCard_image() {
        await this.imgCover_EventCard.first().click();
    }

    async clickEventCard_title() {
        await this.title_EventCard.first().click();

    }

    async clickLoveItemCard() {
        await this.love_ItemCard.first().click();
    }

    async clickLoadMore() {
        await this.loadMoreButton.click();
    }

    async clickLoveItemDetail() {
        await this.loveBtn_ItemDetail.click()
    }

    async clickShareCopyLink_ItemDetail() {
        await this.shareBtn_ItemDetail.click();
        const clipboardValue = await this.shareCopyLink_ItemDetail.getAttribute('data-clipboard-text');
        await this.shareCopyLink_ItemDetail.click();
        return clipboardValue;
    }

    async clickShareCopyLink_EventDetail() {
        await this.shareBtn_EventDetail.click();
        const clipboardValue = await this.shareCopyLink_EventDetail.getAttribute('data-clipboard-text');
        await this.shareCopyLink_EventDetail.click();
        return clipboardValue;
    }

    async clickItemCard_titleByName(itemName: string) {
        const itemTitle = this.itemShopperPostCardEach
            .locator('[class*="FixSizeItemCard__Title"]')
            .filter({ hasText: itemName });

        await expect(itemTitle.first()).toBeVisible({ timeout: 15000 });
        await itemTitle.first().click();
    }

    async clickEventCard_titleByName(eventName: string) {
        const eventTitle = this.shopperPostCardEach
            .locator('[class*="FixSizeShopperPostCard__Title"]')
            .filter({ hasText: eventName });

        await expect(eventTitle.first()).toBeVisible({ timeout: 15000 });
        await eventTitle.first().click();
    }
}

