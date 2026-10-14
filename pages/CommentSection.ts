/*
POM: Comment Section
Owner: Film
*/

import { Page, Locator } from '@playwright/test';

export class CommentSection {
    private page: Page;

    // ---------- Comment Section ----------
    // เปลี่ยนใช้ locator ให้น้อยลง = มันชื่อคล้ายกัน จะได้ไม่ hard code
    public layout_Comment: Locator;
    public blockSentComment: Locator;
    public blockComment: Locator;
    public blockSentCommentReply: Locator;
    public textField_Comment: Locator;
    public submitCommentButton: Locator;
    public textField_ReplyComment: Locator;
    public submitReplyCommentButton: Locator;
    public replyComment_bth: Locator;
    public hideComment_bth: Locator;
    public existingComment: Locator;
    public commentAuthor: Locator;
    public commentDate: Locator;

    public existingReplyComment: Locator;
    public replyCommentAuthor: Locator;
    public replyCommentText: Locator;
    public replyCommentDate: Locator;
    public textField_ReplyComment_promotion: Locator;
    public profileUsername: Locator;
    // public blockComment_mobile: Locator;


    public layout_Comment_mobile: Locator;
    public blockSentComment_mobile: Locator;
    public blockComment_mobile: Locator;
    public blockSentCommentReply_mobile: Locator;

    public textField_Comment_mobile: Locator;
    public submitCommentButton_mobile: Locator;

    public textField_ReplyComment_mobile: Locator;
    public submitReplyCommentButton_mobile: Locator;

    public replyComment_bth_mobile: Locator;
    public hideComment_bth_mobile: Locator;

    public existingComment_mobile: Locator;
    public commentAuthor_mobile: Locator;
    public commentDate_mobile: Locator;

    // ---------- Reply Comment ----------

    public existingReplyComment_mobile: Locator;
    public replyCommentAuthor_mobile: Locator;
    public replyCommentText_mobile: Locator;
    public replyCommentDate_mobile: Locator;

    public textField_ReplyComment_promotion_mobile: Locator;

    // ---------- Profile Header (Mobile) ----------

    public profileUsername_mobile: Locator;


    constructor(page: Page) {
        this.page = page;
        // ---------- Comment Section ----------
        this.layout_Comment = page.locator('.BlockSendComment__BlockSendCommentLayout-sc-d6705f8b-0'); //.ensIGq >> กล่องพิมพ์ส่ง Comment (อันบน)
        this.blockSentComment = page.locator('.SendComment__BlockSendComment-sc-cbc590b3-0');
        this.blockComment = page.locator('.BlockComment__BlockComments-sc-86b7d0e5-0'); //BlockComment__BlockComments-sc-86b7d0e5-0 cOIDBs >> กล่อง comment ทั้งหมด
        this.textField_Comment = page.getByRole('textbox', { name: 'เขียนความคิดเห็น' }).first(); //กล่องพิมพ์คอมเมนต์
        this.submitCommentButton = page.getByRole('button', { name: 'ส่ง' }); //ปุ่มส่งคอมเมนต์

        // this.textBoxReplyComment = page.getByRole('textbox', { name: 'เขียนความคิดเห็น' }).nth(1); //กล่องพิมพ์ ตอบกลับ คอมเมนต์ SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0
        // this.submitReplyCommentButton = page.getByRole('button', { name: 'ส่ง' }).nth(1); //ปุ่มส่ง ตอบกลับ คอมเมนต์
        this.replyComment_bth = page.getByRole('button', { name: 'ตอบกลับ' }).first(); //ปุ่ม ตอบกลับ เพื่อดู คอมเมนต์ที่ตอบกลับทั้งหมด[class*="CommentComponents__ButtonReply"] 'button', { name: 'ตอบกลับ' }).first()
        this.hideComment_bth = page.getByRole('button', { name: 'ซ่อน' }); //ปุ่ม ซ่อน เพื่อซ่อน คอมเมนต์ที่ตอบกลับทั้งหมด
        this.existingComment = page.locator('[class*="CommentComponents__BlockComment"]'); // comment ที่มีอยู่ก่อนหน้าแล้ว CommentComponents__BlockComment-sc-34e5e5de-0
        this.commentAuthor = this.existingComment.first().locator('[class*="CommentComponents__AvatarDisplayName"]'); // ชื่อผู้คอมเมนต์ในแต่ละการ์ด
        this.commentDate = this.existingComment.first().locator('[class*="CommentComponents__DateText"]'); // เวลาที่แสดงในแต่ละการ์ด

        // ---------- Reply Comment ----------

        // กล่อง Reply ทั้งหมดภายในคอมเมนต์หลัก
        this.blockSentCommentReply = page.locator('[class*="CommentComponents__BlockSendCommentReply"]'); //'.CommentComponents__BlockSendCommentReply-sc-34e5e5de-3
        this.existingReplyComment = page.locator('[class*="ReplyCommentComponent__BlockCommentReply-sc-"]'); // รายการ Reply แต่ละรายการ
        this.replyCommentAuthor = page.locator('[class*="ReplyCommentComponent__AvatarReplyDisplayName"]'); // ชื่อผู้ตอบกลับ
        this.replyCommentText = page.locator('[class*="ReplyCommentComponent__CommentReplyText"]');// ข้อความตอบกลับ
        this.replyCommentDate = page.locator('[class*="ReplyCommentComponent__DateTextReply"]');   // เวลาของ Reply
        // กล่องสำหรับพิมพ์ Reply
        this.textField_ReplyComment = page.locator('[class*="SendCommentReply__BlockSendCommentReplyTextarea"]'); // this.textField_ReplyComment = page.locator('.SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0').first(); //กล่องพิมพ์ ตอบกลับ คอมเมนต์ SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0
        this.submitReplyCommentButton = page.locator('[class*="SendCommentReply__ButtonSummitSendComment"]'); // ปุ่มส่ง Reply
        this.textField_ReplyComment_promotion = page.locator('[class*="SendCommentReply__BlockSendCommentReply"]');
        // ---------- Profile Header (Mobile) ----------
        this.profileUsername = page.locator('[class*="VerticalNav__NavHeaderProfile-sc-"] > div');
        this.blockComment_mobile = page.locator('[class*="BlockComment__BlockComments"]');

        // ---------- Mobile ----------

        this.layout_Comment_mobile = page.locator('[class*="BlockSendComment__BlockSendCommentLayout"]');
        this.blockSentComment_mobile = page.locator('[class*="SendComment__BlockSendComment-sc-"]');
        this.blockComment_mobile = page.locator('[class*="BlockComment__BlockComments"]');
        this.textField_Comment_mobile = this.layout_Comment_mobile.getByPlaceholder('เขียนความคิดเห็น...');
        this.submitCommentButton_mobile = this.blockSentComment_mobile.getByRole('button', { name: 'ส่ง', exact: true, });
        // ปุ่มตอบกลับ / ซ่อนความคิดเห็น
        this.replyComment_bth_mobile = this.blockComment_mobile.locator('div[role="button"][class*="CommentComponents__ButtonReply"]');
        this.hideComment_bth_mobile = this.replyComment_bth_mobile.filter({ hasText: 'ซ่อน', });
        // รายการความคิดเห็นหลัก
        this.existingComment_mobile = this.blockComment_mobile.locator('[class*="CommentComponents__BlockComment-sc-"]');
        this.commentAuthor_mobile = this.existingComment_mobile.locator('[class*="CommentComponents__AvatarDisplayName"]');
        this.commentDate_mobile = this.existingComment_mobile.locator('[class*="CommentComponents__DateText"]');

        // ---------- Reply Comment ----------

        this.blockSentCommentReply_mobile = this.blockComment_mobile.locator('[class*="CommentComponents__BlockSendCommentReply"]');
        this.existingReplyComment_mobile = this.blockSentCommentReply_mobile.locator('[class*="ReplyCommentComponent__BlockCommentReply-sc-"]');
        this.replyCommentAuthor_mobile = this.existingReplyComment_mobile.locator('[class*="ReplyCommentComponent__AvatarReplyDisplayName"]');
        this.replyCommentText_mobile = this.existingReplyComment_mobile.locator('[class*="ReplyCommentComponent__CommentReplyText"]');
        this.replyCommentDate_mobile = this.existingReplyComment_mobile.locator('[class*="ReplyCommentComponent__DateTextReply"]');

        // กล่องพิมพ์ตอบกลับ
        this.textField_ReplyComment_mobile = this.blockSentCommentReply_mobile.getByPlaceholder('เขียนความคิดเห็น...');
        this.submitReplyCommentButton_mobile = this.blockSentCommentReply_mobile.getByRole('button', { name: 'ส่ง', exact: true, });
        this.textField_ReplyComment_promotion_mobile = page.locator('[class*="SendCommentReply__BlockSendCommentReply"]');

        // ---------- Profile Header (Mobile) ----------
        this.profileUsername_mobile = page.locator('[class*="VerticalNav__NavHeaderProfile-sc-"] > div');
    }

    // ---------- Page Actions ----------

    async sentComment_mobile() {
        await this.textField_Comment_mobile.fill('testcomment-auto');
        await this.submitCommentButton_mobile.click();
    }

    async sentReplyComment_mobile() {
        await this.replyComment_bth_mobile.first().click();
        await this.textField_ReplyComment_mobile.fill('testryplycomment-auto');
        await this.submitReplyCommentButton_mobile.click();
    }

    async sentComment() {
        const testComment = 'testcomment-auto';
        await this.textField_Comment.click();
        await this.textField_Comment.fill(testComment);
        await this.submitCommentButton.click();
    }

    async sentReplyComment() {
        const testComment = 'testryplycomment-auto';
        await this.replyComment_bth.click();
        await this.textField_ReplyComment.click();
        await this.textField_ReplyComment.fill(testComment);
        await this.submitReplyCommentButton.click();
    }

    async clickReplyComment() {
        await this.replyComment_bth.click();
        await this.textField_ReplyComment.click();
    }

}