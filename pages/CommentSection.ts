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


    constructor(page: Page) {
        this.page = page;
        // ---------- Comment Section ----------
        this.layout_Comment = page.locator('.BlockSendComment__BlockSendCommentLayout-sc-d6705f8b-0'); //.ensIGq >> กล่องพิมพ์ส่ง Comment (อันบน)
        this.blockSentComment = page.locator('.SendComment__BlockSendComment-sc-cbc590b3-0');
        this.blockComment = page.locator('.BlockComment__BlockComments-sc-86b7d0e5-0'); //BlockComment__BlockComments-sc-86b7d0e5-0 cOIDBs >> กล่อง comment ทั้งหมด
        this.blockSentCommentReply = page.locator('.CommentComponents__BlockSendCommentReply-sc-34e5e5de-3'); //comment ที่แต่ละคน reply ก่อนหน้า
        this.textField_Comment = page.getByRole('textbox', { name: 'เขียนความคิดเห็น' }).first(); //กล่องพิมพ์คอมเมนต์
        this.submitCommentButton = page.getByRole('button', { name: 'ส่ง' }); //ปุ่มส่งคอมเมนต์
        this.textField_ReplyComment = page.locator('.SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0').first(); //กล่องพิมพ์ ตอบกลับ คอมเมนต์ SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0
        // this.textBoxReplyComment = page.getByRole('textbox', { name: 'เขียนความคิดเห็น' }).nth(1); //กล่องพิมพ์ ตอบกลับ คอมเมนต์ SendCommentReply__BlockSendCommentReply-sc-e1a06e34-0
        this.submitReplyCommentButton = page.getByRole('button', { name: 'ส่ง' }).nth(1); //ปุ่มส่ง ตอบกลับ คอมเมนต์
        this.replyComment_bth = page.getByRole('button', { name: 'ตอบกลับ' }).first(); //ปุ่ม ตอบกลับ เพื่อดู คอมเมนต์ที่ตอบกลับทั้งหมด[class*="CommentComponents__ButtonReply"] 'button', { name: 'ตอบกลับ' }).first()
        this.hideComment_bth = page.getByRole('button', { name: 'ซ่อน' }); //ปุ่ม ซ่อน เพื่อซ่อน คอมเมนต์ที่ตอบกลับทั้งหมด
        this.existingComment = page.locator('.CommentComponents__BlockComment-sc-34e5e5de-0'); // comment ที่มีอยู่ก่อนหน้าแล้ว
    }

    async sentComment(element: Locator) {
        const testComment = `test-${Date.now()}`;
        await element.first().click();
        await this.textField_Comment.click();
        await this.textField_Comment.fill(testComment);
        await this.submitCommentButton.click();
    }

    async sentReplyComment(element: Locator) {
        const testComment = `test-${Date.now()}`;
        await element.first().click();
        await this.textField_ReplyComment.click();
        await this.textField_ReplyComment.fill(testComment);
        await this.submitReplyCommentButton.click();
    }
}