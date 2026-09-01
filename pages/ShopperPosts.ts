/*
POM: Shopper Posts Page
Owner: Film
*/


import { Page, Locator } from '@playwright/test';

export class ShopperPostsPage {
    private page: Page;
    public shopper_heading: Locator;

    // ---------- Shopper Highlight Banner ----------
    public shopperHightlight: Locator;
    public indicator: Locator;
    public leftArrow: Locator;
    public rightArrow: Locator;

    // ---------- Shopper Categories Tap ----------
    private shopperFilterBtn: Record<string, Locator>;
    public individual_item: Locator;
    public event_items: Locator;
    public selectCardDeopdown: Locator;

    // ---------- Shopper Card Individual Item ----------
    public itemShopperPostCard: Locator;
    public itemShopperPostCardEach: Locator;
    public imgCover_ItemCard: Locator;
    public label_ItemCard: Locator;
    public title_ItemCard: Locator;
    public contentPrice_ItemCard: Locator;
    public love_ItemCard: Locator;
    public inStock_lable: Locator;

    // ---------- Shopper Card Event ----------
    public shopperPostCard: Locator;
    public shopperPostCardEach: Locator;
    // public imgCover_EventCard: Locator; //ใช้เหมือนกันกับ imgCover_ItemCard
    // public title_EventCard: Locator; //ใช้เหมือนกันกับ imgCover_ItemCard
    public dateContent_EventCard: Locator;
    public proLabel_EventCard: Locator;

    // ---------- Shopper Individual Item Detail ----------
    public title_ItemDetail: Locator;
    public coverImg_ItemDetail: Locator;
    public price_ItemDetail: Locator;
    // public percentDiscount: Locator; อาจจะไม่มี
    public productType_ItemDetail: Locator;
    public purchaseBtn_ItemDetail: Locator;
    public loveBtn_ItemDetail: Locator;
    public shareBtn_ItemDetail_: Locator;
    public shareOnFacebook: Locator;
    public shareOnLine: Locator;
    public shareOnX: Locator;
    public shareCopyLink: Locator;
    public owner_shopper: Locator;
    public descrition_ItemDetail: Locator;
    // public tag_ItemDetail: Locator;
    public viewAll_ItemDetail: Locator;
    public inStockLable_Detail: Locator;

    // ---------- การ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน ----------
    /*
    น่าจะใช้
    public title_ItemSameEvent: locator;
    public coverImg_ItemSameEvent: locator;
    public leble_ItemSameEvent: locator;
    public eventTt_ItemSameEvent: locator;
    public price_ItemSameEvent: locator;
    public loveBtn_ItemSameEvent: locator;
    */

    // ---------- Shopper Event Detail ----------
    public title_EventDetail: Locator;
    public coverImg_EventDetail: Locator;
    public description_EventDetail: Locator;
    public priceLabel_EventDetail: Locator;
    public viewCount_EventDetail: Locator;
    public dateStart_EventDetail: Locator;
    public shareBtn_EventDetail: Locator;
    public loveBtn_EventDetail: Locator;

    // ---------- Shopper การ์ดสินค้าที่เข้าร่วมอีเวนต์นั้น ๆ ----------
    /*
    public title_ItemOnEvent: Locator;
    public coverImg_ItemOnEvent: Locator;
    public realPrice_ItemOnEvent: Locator;
    public salePrice_ItemOnEvent: Locator;
    public purchaseBtn_ItemOnEvent: Locator;
    */

    // path link เวลากด ฝากหิ้วชิ้นนี้ = /application

    constructor(page: Page) {
        this.page = page;
        this.shopper_heading = page.getByRole('heading', { name: 'สินค้ารับหิ้ว', exact: true });

        // ---------- Shopper Highlight Banner ----------
        this.shopperHightlight = page.locator('.'); // class: swiper-wrapper => แต่ละอันเป็น class: swiper-slide
        this.indicator = page.getByRole('button', { name: 'Go to slide1' });  // มี 1-10 .SlideMulti__CustomPagination-sc-18f2845a-2 <span class="swiper-pagination-bullet" tabindex="0" role="button" aria-label="Go to slide 1"></span>
        this.leftArrow = page.locator('..SlideMulti__CustomNavigationButton-sc-18f2845a-1'); // right: auto, left: -20px
        this.rightArrow = page.locator('.SlideMulti__CustomNavigationButton-sc-18f2845a-1').first(); //right: -20px, left: auto
        // วันเริ่ม: ShopperPostHorizontalCard__DateCotent-sc-2e29571b-4
        // PriceContent lable: ShopperPostHorizontalCard__PriceContent-sc-2e29571b-5

        // this.blockMenuCategories = page.locator('.ProFilterCategories__BlockMenuCategories-sc-e0f955f4-0') //ProFilterCategories__BlockMenuCategories-sc-e0f955f4-0 deYHar
        this.shopperFilterBtn = {
            pro_fashion: page.getByRole('button', { name: 'ทั้งหมด' }), //.locator('#filter-shopper-post-all')
            pro_eat: page.getByRole('button', { name: 'รับหิ้วหน้างาน' }), //.locator('#filter-shopper-post-item')
            pro_travel: page.getByRole('button', { name: 'สินค้าในสต็อก' }), //.locator('#filter-shopper-post-stock')
        };
        this.individual_item = page.locator('.SelectCardDropdown__Item-sc-271849bf-3'); //<span>สินค้ารายชิ้น</span>
        this.event_items = page.locator('.SelectCardDropdown__Item-sc-271849bf-3'); //<span>สินค้ารายอีเวนต์</span>
        this.selectCardDeopdown = page.locator('.SelectCardDropdown__Wrapper-sc-271849bf-0');

        // ---------- Shopper Card Individual Item ----------
        this.itemShopperPostCard = page.locator('.ListItemShopperPost__ListPosts-sc-c96491c8-0');
        this.itemShopperPostCardEach = page.locator('.ListItemShopperPost__BlockArticle-sc-c96491c8-1');
        this.imgCover_ItemCard = page.locator('.ComponentLink__StyledLink-sc-86eeea75-0'); // ใช้เหมือนกันกับ title
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
        this.dateContent_EventCard = page.locator('.FixSizeShopperPostCard__DateContent-sc-bf72de59-4');
        this.proLabel_EventCard = page.locator('.FixSizeShopperPostCard__PriceContent-sc-bf72de59-5');

        // ---------- Shopper Individual Item Detail ----------
        this.title_ItemDetail = page.locator('.ShopperDetail__Title-sc-7a17d395-3');
        this.coverImg_ItemDetail = page.locator('.ShopperDetail__ImageBox-sc-7a17d395-0');
        this.price_ItemDetail = page.locator('.ShopperDetail__Price-sc-7a17d395-4');
        // this.percentDiscount = page.locator('.'); อาจจะไม่มี
        this.productType_ItemDetail = page.locator('.ShopperDetail__CategoryTypeBox-sc-7a17d395-5'); // มี Button type="button" ข้างใน
        this.purchaseBtn_ItemDetail = page.locator('.ShopperDetail__PurchaseButton-sc-7a17d395-9');
        this.loveBtn_ItemDetail = page.locator('.');
        this.shareBtn_ItemDetail_ = page.locator('.');
        this.shareOnFacebook = page.locator('.');
        this.shareOnLine = page.locator('.');
        this.shareOnX = page.locator('.');
        this.shareCopyLink = page.locator('.');
        this.owner_shopper = page.locator('.ShopperDetail__ShopperOwnerBox-sc-7a17d395-12');
        this.descrition_ItemDetail = page.locator('.ShopperDetail__PostDescription-sc-7a17d395-15');
        // this.tag_ItemDetail = page.locator('.');
        this.viewAll_ItemDetail = page.locator('.ItemList__ViewAllButton-sc-41041f1b-3');
        this.inStockLable_Detail = page.locator('.ShopperDetail__ContentPostTypeStock-sc-7a17d395-2');

        // ---------- การ์ดสินค้าที่อยู่ในอีเวนต์เดียวกัน ----------
        /*
        น่าจะใช้
        this.title_ItemSameEvent = page.locator('.');
        this.coverImg_ItemSameEvent = page.locator('.');
        this.leble_ItemSameEvent = page.locator('.');
        this.eventTt_ItemSameEvent = page.locator('.');
        this.price_ItemSameEvent = page.locator('.');
        this.loveBtn_ItemSameEvent = page.locator('.');
        */

        // ---------- Shopper Event Detail ----------
        this.title_EventDetail = page.locator('.PostDetail__Title-sc-b1e566b2-3');
        this.coverImg_EventDetail = page.locator('.PostDetail__CoverEventDetail-sc-b1e566b2-0');
        this.description_EventDetail = page.locator('.PostDetail__Descript-sc-b1e566b2-5');
        this.priceLabel_EventDetail = page.locator('.PostDetail__Price-sc-b1e566b2-6');
        this.viewCount_EventDetail = page.locator('.PostDetail__ViewTotal-sc-b1e566b2-0');
        this.dateStart_EventDetail = page.locator('.PostDetail__StartDate-sc-b1e566b2-0');
        this.shareBtn_EventDetail = page.locator('.');
        this.loveBtn_EventDetail = page.locator('.');

        // ---------- Shopper การ์ดสินค้าที่เข้าร่วมอีเวนต์นั้น ๆ ----------
        /*
        this.title_ItemOnEvent = page.locator('.');
        this.coverImg_ItemOnEvent = page.locator('.');
        this.price_ItemOnEvent = page.locator('.');
        this.loveBtn_ItemOnEvent = page.locator('.');
        this.purchaseBtn_ItemOnEvent = page.locator('.');
        */
    }

    async clickFilter_Event() {
        await this.selectCardDeopdown.click();
        await this.event_items.click();
    }
}

