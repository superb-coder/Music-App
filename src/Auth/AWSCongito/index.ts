import AuthInterface from '../AuthInterface';
import {Auth} from 'aws-amplify';

/**
 * AWSCognito
 */
export default class AWSCognito implements AuthInterface {
/**
     * get current user session
     */
    public getCurrentUser() {
        return new Promise((resolve, reject) => {
            Auth.currentSession().then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(null);
            })
        })
    }
/**
     * get current authenticated user
     */
    public isLogged() {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser().then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(null);
            })
        })
    }
    /**
     * signUp
     * @param p.username username user
     * @param p.password password user
     */
    public async signUp(username: string, password: string, attributes?: any) {
        return new Promise((resolve, reject) => {
            Auth.signUp(username, password, attributes).then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(e);
            })
        })
    }
    /**
     * confirmSignUp
     * @param p.username username user
     * @param p.code verification code
     * @param p.options confirm Optional. { forceAliasCreation: true } Force user confirmation irrespective of existing alias. By default set to True. { forceAliasCreation: true }
     */
    public confirmSignUp(username: string, code: string) {
        return new Promise((resolve, reject) => {
            Auth.confirmSignUp(username, code).then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(e);
            })
        });
    }
    /**
     * resendSignUp
     * @param p.username account usenrame    
     */
    public async resendSignUp(p: { username: string }) {
        return new Promise((resolve, reject) => {
            Auth.resendSignUp(p.username).then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(e);
            })
        });
    }
    /**
     * signIn
     * @param p.email email user
     * @param p.password password user
     */
    public async signIn(email: string, password: string) {
        return new Promise((resolve, reject) => {
            Auth.signIn(email, password).then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(e);
            })
        });
    }
    /**
     * @param p.user current user object
     * @param p.code verification code for verification of account
     * @param p.meta meta information additionnals for aws account user
     */
    public async confirmSignIn(user: any, code: string, mfaType?: 'SMS_MFA' | 'SOFTWARE_TOKEN_MFA') {
        return new Promise((resolve, reject) => {
            Auth.confirmSignIn(user, code, 'SMS_MFA').then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(e);
            })
        });
    }
    /**
     * @param p.user current user object
     * @param p.newPassword new password user for resetting
     * @param p.meta meta information additionnals for aws account user
     */
    public async completeNewPassword(p: { user: any, newPassword: string, meta?: { [key: string]: any }, mfaType?: 'SMS_MFA' | 'SOFTWARE_TOKEN_MFA' }) {
        return new Promise((resolve, reject) => {
            Auth.completeNewPassword(p.user, p.newPassword, p.mfaType).then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(e);
            })
        });
    }
    /**
     * Sign out current login
     */
    public signOut() {
        Auth.signOut();
    };
    /**
     * @param p.username account usenrame    
     */
    public async forgotPassword(p: { username: string }) {
        return new Promise((resolve, reject) => {
            Auth.forgotPassword(p.username).then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(e);
            })
        });
    }
/**
     * @param p.username username of account
     * @param p.code verification code for verification of account
     * @param p.newPassword new password to set for account
     */
    public async forgotPasswordSubmit(p: { username: string, code: string, newPassword: string }) {
        return new Promise((resolve, reject) => {
            Auth.forgotPasswordSubmit(p.username, p.code, p.newPassword).then((data) => {
                resolve(data);
            }).catch((e) => {
                resolve(e);
            })
        });
    }
}