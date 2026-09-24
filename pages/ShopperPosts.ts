/*
POM: Shopper Posts Page
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class ShopperPostsPage {
    private page: Page;
    public readonly shopper_heading: Locator;
    public readonly loadMoreButton: Locator;

    // ---------- Shopper Highlight Banner ----------
    public readonly shopperHightlight: Locator;
    public readonly indicator: Locator;
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

    // ---------- Shopper Card Event ----------
    public readonly shopperPostCard: Locator;
    public readonly shopperPostCardEach: Locator;
    // public imgCover_EventCard: Locator; //ใช้เหมือนกันกับ imgCover_ItemCard
    // public title_EventCard: Locator; //ใช้เหมือนกันกับ imgCover_ItemCard
    public readonly dateContent_EventCard: Locator;
    public readonly proLabel_EventCard: Locator;

    // ---------- Shopper Individual Item Detail ----------
    public readonly title_ItemDetail: Locator;
    public readonly coverImg_ItemDetail: Locator;
    public readonly price_ItemDetail: Locator;
    // public percentDiscount: Locator; อาจจะไม่มี
    public readonly productType_ItemDetail: Locator;
    public readonly purchaseBtn_ItemDetail: Locator;
    public readonly loveBtn_ItemDetail: Locator;
    public readonly shareBtn_ItemDetail_: Locator;
    public readonly shareOnFacebook_ItemDetail: Locator;
    public readonly shareOnLine_ItemDetail: Locator;
    public readonly shareOnX_ItemDetail: Locator;
    public readonly shareCopyLink_ItemDetail: Locator;
    public readonly owner_shopper: Locator;
    public readonly descrition_ItemDetail: Locator;
    // public tag_ItemDetail: Locator;
    public readonly viewAllBtn_ItemDetail: Locator;
    public readonly inStockLable_Detail: Locator;
    public readonly nextSlide_Btn: Locator;
    public readonly previousSlide_Btn: Locator;
    public readonly allIndicator: Locator;
    public readonly indicator_Btn: Locator;
    public readonly block_ItemSameEvent: Locator;

    // ---------- การ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน ----------
    public readonly listCard_ItemSameEvent: Locator;
    public readonly cardEach_ItemSameEvent: Locator;
    public readonly title_ItemSameEvent: Locator;
    public readonly coverImg_ItemSameEvent: Locator;
    public readonly postLabel_ItemSameEvent: Locator;
    public readonly eventName_ItemSameEvent: Locator;
    public readonly price_ItemSameEvent: Locator;
    public readonly loveBtn_ItemSameEvent: Locator;

    // ---------- Shopper Event Detail ----------
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
        this.shopperHightlight = page.locator('.'); // class: swiper-wrapper => แต่ละอันเป็น class: swiper-slide
        this.indicator = page.getByRole('button', { name: 'Go to slide1' });  // มี 1-10 .SlideMulti__CustomPagination-sc-18f2845a-2 <span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide 1"></span>
        this.leftArrow = page.locator('.SlideMulti__CustomNavigationButton-sc-18f2845a-1'); // right: auto, left: -20px
        this.rightArrow = page.locator('.SlideMulti__CustomNavigationButton-sc-18f2845a-1').first(); //right: -20px, left: auto
        // วันเริ่ม: ShopperPostHorizontalCard__DateCotent-sc-2e29571b-4
        // PriceContent lable: ShopperPostHorizontalCard__PriceContent-sc-2e29571b-5

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

        // ---------- Shopper Card Individual Item ----------
        this.itemShopperPostCard = page.locator('.ListItemShopperPost__ListPosts-sc-c96491c8-0');
        this.itemShopperPostCardEach = page.locator('.ListItemShopperPost__BlockArticle-sc-c96491c8-1');
        this.imgCover_ItemCard = page.locator('.FixSizeItemCard__Card-sc-2c06b627-0 > a').first(); // ใช้เหมือนกันกับ title.ComponentLink__StyledLink-sc-86eeea75-0
        this.label_ItemCard = page.locator('.FixSizeItemCard__PostLabel-sc-2c06b627-5');
        this.title_ItemCard = page.locator('.FixSizeItemCard__Title-sc-2c06b627-4'); //event: .FixSizeItemCard__PostTitle-sc-2c06b627-3
        this.contentPrice_ItemCard = page.locator('.FixSizeItemCard__PriceContent-sc-2c06b627-7');
        this.love_ItemCard = page.locator('.FixSizeItemCard__FavouriteButton-sc-2c06b627-8'); //role="button" aria-label="Add to favorites"
        this.inStock_lable = page.locator('.FixSizeItemCard__ContentPostTypeStock-sc-2c06b627-2');

        // ---------- Shopper Card Event Item ----------
        this.shopperPostCard = page.locator('.ListShopperPost__ListPosts-sc-99cb7286-0');
        this.shopperPostCardEach = page.locator('.ListShopperPost__ListPosts-sc-99cb7286-1');
        // this.imgCover_EventCard = page.locator('.');  // ใช้เหมือนกันกับ title
        // this.title_EventCard = page.locator('.');  // ใช้เหมือนกันกับ coverImg
        this.dateContent_EventCard = page.locator('.FixSizeShopperPostCard__DateContent-sc-bf72de59-4'); //[class*="FixSizeShopperPostCard__DateContent"]
        this.proLabel_EventCard = page.locator('.FixSizeShopperPostCard__PriceContent-sc-bf72de59-5');

        // ---------- Shopper Individual Item Detail ----------
        this.title_ItemDetail = page.locator('.ShopperDetail__Title-sc-7a17d395-3');
        this.coverImg_ItemDetail = page.locator('.ShopperDetail__ImageBox-sc-7a17d395-0');
        this.price_ItemDetail = page.locator('.ShopperDetail__Price-sc-7a17d395-4');
        // this.percentDiscount = page.locator('.'); อาจจะไม่มี
        this.productType_ItemDetail = page.locator('.ShopperDetail__CategoryTypeBox-sc-7a17d395-5'); // มี Button type="button" ข้างใน
        this.purchaseBtn_ItemDetail = page.locator('.ShopperDetail__PurchaseButton-sc-7a17d395-9');
        this.loveBtn_ItemDetail = page.locator('.ShopperDetail__CircleButton-sc-7a17d395-10').first();
        this.shareBtn_ItemDetail_ = page.locator('.ShopperDetail__CircleButton-sc-7a17d395-10.cIwDzr.btn.position-relative');
        this.shareOnFacebook_ItemDetail = page.getByTestId('share-direction-row').getByRole('button', { name: 'Share on Facebook' });
        this.shareOnLine_ItemDetail = page.getByTestId('share-direction-row').getByRole('button', { name: 'Share on X' });
        this.shareOnX_ItemDetail = page.getByTestId('share-direction-row').getByRole('button', { name: 'Share on Line' });
        this.shareCopyLink_ItemDetail = page.getByTestId('share-direction-row').getByRole('button', { name: 'share-copy-link' });
        this.owner_shopper = page.locator('.ShopperDetail__ShopperOwnerBox-sc-7a17d395-12');
        this.descrition_ItemDetail = page.locator('.ShopperDetail__PostDescription-sc-7a17d395-15');
        // this.tag_ItemDetail = page.locator('.');
        this.viewAllBtn_ItemDetail = page.locator('.ItemList__ViewAllButton-sc-41041f1b-3');
        this.inStockLable_Detail = page.locator('.ShopperDetail__ContentPostTypeStock-sc-7a17d395-2');
        this.nextSlide_Btn = page.getByRole('button', { name: 'Next slide' });
        this.previousSlide_Btn = page.getByRole('button', { name: 'Previous slide' });
        this.allIndicator = page.locator('.ItemList__CustomPagination-sc-41041f1b-6');
        this.indicator_Btn = page.getByRole('button', { name: /Go to slide/ });
        this.block_ItemSameEvent = page.locator('.ItemList__Box-sc-41041f1b-0');

        // ---------- การ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน ----------
        this.listCard_ItemSameEvent = page.locator('[class*="swiper-wrapper"]');
        this.cardEach_ItemSameEvent = page.locator('[class*="swiper-slide"]');
        // aria-label="n / x" n = การ์ดที่ n, x = จำนวนการ์ทั้งหมดที่มีในอีเวนท์นั้น
        // การ์ดแรก '[class*="swiper-slide swiper-slide-active"]' การ์ดที่2 '[class*="swiper-slide swiper-slide-next"]' การ์ดที่3-5 '[class*="swiper-slide"]'
        // พอกด nextSlide_Btn การ์ดแรกจะเปลี่ยนเป็น '[class*="swiper-slide swiper-slide-prev"]' การ์ดที่2 '[class*="swiper-slide  swiper-slide-active"]' การ์ดที่3 '[class*="swiper-slide swiper-slide-next"]' การ์ดที่4-5 '[class*="swiper-slide swiper-slide-next"]'
        this.title_ItemSameEvent = this.cardEach_ItemSameEvent.locator('a[href^="/items/"]').first().locator('div').first();;
        this.coverImg_ItemSameEvent = page.locator('[class*="FixSizeItemCard__PostLabel"]');
        this.postLabel_ItemSameEvent = page.locator('[class*="FixSizeItemCard__PostLabel"]');
        this.eventName_ItemSameEvent = page.locator('[class*="FixSizeItemCard__PostTitle"]');
        this.price_ItemSameEvent = page.locator('[class*="FixSizeItemCard__PriceContent"]');
        this.loveBtn_ItemSameEvent = page.getByRole('button', { name: 'Add to favorites' });

        // ---------- Shopper Event Detail ----------
        this.title_EventDetail = page.locator('.PostDetail__Title-sc-b1e566b2-3');
        this.coverImg_EventDetail = page.locator('.PostDetail__CoverEventDetail-sc-b1e566b2-0');
        this.description_EventDetail = page.locator('.PostDetail__Descript-sc-b1e566b2-5');
        this.priceLabel_EventDetail = page.locator('.PostDetail__Price-sc-b1e566b2-6');
        this.viewCount_EventDetail = page.locator('.PostDetail__ViewTotal-sc-b1e566b2-0');
        this.dateStart_EventDetail = page.locator('.PostDetail__StartDate-sc-b1e566b2-0');
        this.shareBtn_EventDetail = page.locator('.PostDetail__ActionButton-sc-b1e566b2-10.cDTTRI.btn.position-relative');
        this.loveBtn_EventDetail = page.locator('.PostDetail__ActionButton-sc-b1e566b2-10').first();
        this.shareOnFacebook_EventDetail = page.getByRole('button', { name: 'Share on Facebook' });
        this.shareOnLine_EventDetail = page.getByRole('button', { name: 'Share on Line' });
        this.shareOnX_EventDetail = page.getByRole('button', { name: 'Share on X' });
        this.shareCopyLink_EventDetail = page.getByRole('button', { name: 'share-copy-link' });

        // ---------- Shopper การ์ดสินค้าที่เข้าร่วมอีเวนต์นั้น ๆ ----------
        this.listEventItem = page.locator('.ListItemEventDetail__ListEventItem');
        this.blockEventItem = page.locator('[class*="ListItemEventDetail__BlockEventItem"]');
        this.title_ItemOnEvent = page.locator('[class*="CardCarryItem__BlockTitle"]');
        this.coverImg_ItemOnEvent = this.blockEventItem.locator('div').locator('div > [style*="background-image"]');
        this.price_ItemOnEvent = page.locator('[class*="CardCarryItem__BlockPrice"]');
        this.purchaseBtn_ItemOnEvent = page.locator('a').filter({ hasText: 'ฝากหิ้วชิ้นนี้' }).first();
    }

    // ==================== Page Actions ====================

    async clickFilter_Event() {
        await this.selectCardDeopdown.click();
        await this.event_items.click();
    }

    async clickFilter_Individual() {
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

    // อาจจะต้องแยก สำหรับ item & Event
    async clickItemCard_image() {
        await this.imgCover_ItemCard.first().click();
    }

    async clickItemCard_title() {
        await this.title_ItemCard.first().click();
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
}

