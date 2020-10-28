/**
 * Follow documentation https://aws-amplify.github.io/docs/js/authentication#sign-in
 */
export default interface AuthInterface {
    /**
         * When signup with user name and password,
         * you will either be asked to pass some challenges like code verification
         * after getting signed up.
         */
    signUp: (
        username: string,
        password: string,
    ) => false | object;
    /** Confirm signup asks after doing signup */
    confirmSignUp: (username: string, code: string) => false | object;
    /** Resend verification code to username after signup */
    resendSignUp: (p: { username: string }) => false | object;
    /** get current user session object */
    getCurrentUser: () => false | object;
    /** get current authenticated user object */
    isLogged: () => false | object;
    /**
         * When signing in with user name and password,
         * you will either sign in directly or be asked to pass some challenges
         * before getting authenticated.
         */
    signIn: (email: string, password: string) => false | object;
    /**
         * If MFA is enabled, sign-in should be confirmed with the confirmation code
         */
    confirmSignIn: (
        user: any,
        code: string,
        mfaType?: 'SMS_MFA' | 'SOFTWARE_TOKEN_MFA'
    ) => false | object;
    /**
         * You need to get the new password and required attributes from the UI inputs
         * and then trigger the following function with a button click
         * For example, the email and phone_number are required attributes
         */
    completeNewPassword: (p: {
        user: any,
        newPassword: string,
        meta?: { [key: string]: any },
        mfaType?: 'SMS_MFA' | 'SOFTWARE_TOKEN_MFA'
    }) => false | object;
    /**
         * logout function
         * follow https:
         */
    signOut: () => void;
    /**
         * forgot Password
         */
    forgotPassword: (p: { username: string }) => false | object;
    /**
         * forgot password submit
         */
    forgotPasswordSubmit: (p: {
        username: string,
        code: string,
        newPassword: string,
    }) => false | object;
}