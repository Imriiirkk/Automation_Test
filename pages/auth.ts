import { Page, Locator } from '@playwright/test';

/**
 * POM: Authentication (Login / Signup / Logout)
 * Owner: NUBT
 */
export class AuthComponent {
    private page: Page;

    public loginButton_desktop: Locator;
    public loginButton_mobile: Locator;

    public loginModalCloseButton: Locator;
    public loginModalLogo: Locator;
    public loginSocialLoginSection: Locator;
    public loginModalGoogleLogin: Locator;
    public loginModalFacebookLogin: Locator;
    public loginModalEmailButton: Locator;
    public loginModalSignupButton: Locator;

    public loginEmailForm: Locator;
    private loginEmailInput: Locator;
    private loginPasswordInput: Locator;
    public loginSubmitButton: Locator;

    public loginSuccessDialog: Locator;
    public loginErrorText: Locator;
    public loginErrorOkButton: Locator;

    public signupForm: Locator;
    private signupEmailInput: Locator;
    private signupPasswordInput: Locator;
    private signupConfirmPasswordInput: Locator;
    private signupSubmitButton: Locator;

    private signupErrorText: Locator;

    private userNameDisplay: Locator;
    public username: Locator;

    public logoutLink: Locator;
    public logout_desktop: Locator;

    constructor(page: Page) {
        this.page = page;

        this.loginButton_desktop = page.getByRole('button', { name: 'เข้าสู่ระบบ หรือ สมัครสมาชิก' });
        this.loginButton_mobile = page.locator('div').filter({ hasText: 'เข้าสู่ระบบ / สมัครสมาชิก' }).last();

        this.loginModalCloseButton = page.locator('[class*="LoginTemplate__ButtonCloseModal"]');
        this.loginModalLogo = page.locator('[class*="LoginTemplate__PunproLogo"]');
        this.loginSocialLoginSection = page.locator('[class*="LoginTemplate__LoginSection"]');
        this.loginModalGoogleLogin = this.loginSocialLoginSection.getByRole('button', { name: /google/i });
        this.loginModalFacebookLogin = this.loginSocialLoginSection.getByRole('button', { name: /facebook/i });
        this.loginModalEmailButton = page.getByRole('button', { name: 'เข้าสู่ระบบด้วยอีเมล', exact: true });
        this.loginModalSignupButton = page.getByRole('button', { name: 'สมัครสมาชิก', exact: true });

        this.loginEmailForm = page.locator('[class*="LoginEmailForm__BlockEmailLogin"]');
        this.loginEmailInput = page.getByRole('textbox', { name: 'email', exact: true });
        this.loginPasswordInput = page.getByRole('textbox', { name: 'password', exact: true });
        this.loginSubmitButton = page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true });

        this.loginSuccessDialog = page.getByRole('dialog', { name: 'เข้าสู่ระบบสำเร็จ', exact: true });
        this.loginErrorText = page.getByText('× Firebase: Error (auth/');
        this.loginErrorOkButton = page.getByRole('button', { name: 'OK', exact: true });

        this.signupForm = page.locator('[class*="RegisterForm__BlockEmailLogin"]');
        this.signupEmailInput = page.getByRole('textbox', { name: 'email', exact: true });
        this.signupPasswordInput = page.getByPlaceholder('รหัสผ่าน', { exact: true });
        this.signupConfirmPasswordInput = page.getByPlaceholder('รหัสผ่านอีกครั้ง', { exact: true });
        this.signupSubmitButton = page.getByRole('button', { name: 'สมัครสมาชิก', exact: true });

        this.signupErrorText = page.getByRole('dialog', { name: 'โปรดกรอกข้อมูลให้ครบถ้วน' });

        this.userNameDisplay = page.locator('[class*="UserMenu__UserName"]');
        this.username = page.locator('[class*="NavbarTop__BlockUsername"]');

        this.logoutLink = page.getByRole('link', { name: 'ออกจากระบบ', exact: true });
        this.logout_desktop = page.getByRole('link', { name: 'ออกจากระบบ' }).last();
    }

    async closeLoginModal() {
        await this.loginModalCloseButton.click();
    }

    async loginWithGoogle() {
        await this.loginModalGoogleLogin.click();
        await this.page.waitForTimeout(2000);
    }

    async loginWithFacebook() {
        await this.loginModalFacebookLogin.click();
        await this.page.waitForTimeout(2000);
    }

    async clickLoginWithEmail() {
        await this.loginModalEmailButton.click();
    }

    async clickLoginSubmit() {
        await this.loginSubmitButton.click();
    }

    async loginWithEmail(email: string, password: string) {
        await this.loginModalEmailButton.click();
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
        await this.clickLoginSubmit();
    }

    async dismissLoginError() {
        if (await this.loginErrorText.isVisible().catch(() => false)) {
            await this.loginErrorOkButton.click();
            await this.loginErrorText.waitFor({ state: 'hidden' });
        }
    }

    async clickSignupWithEmail() {
        await this.loginModalSignupButton.click();
    }

    async signupWithEmail(email: string, password: string, confirmpassword: string) {
        await this.loginModalSignupButton.click();
        await this.signupEmailInput.fill(email);
        await this.signupPasswordInput.fill(password);
        await this.signupConfirmPasswordInput.fill(confirmpassword);
        await this.signupSubmitButton.click();
    }

    async logout() {
        await this.logoutLink.click();
    }

    async logoutInDesktop() {
        await this.logout_desktop.click();
    }
}