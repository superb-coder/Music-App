import AuthUtilsInterface from './AuthUtilsInterface';
import { AsyncStorage } from 'react-native';
/**
 * Auth Utils
 */
export default class AuthUtils implements AuthUtilsInterface {
    /**
         * validate     
         */
    public validate() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('@Auth:isLoggedIn').then((isLoggedIn) => {
                if (isLoggedIn == "Yes" && isLoggedIn != null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        })
    }
}