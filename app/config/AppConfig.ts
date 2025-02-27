import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getAPIURL() {
    let apiURL = '';
    // Get the environment from Expo Constants
    const environment = Constants.expoConfig?.extra?.environment || process.env.NODE_ENV;

    console.log('Current environment:', environment);

    if (__DEV__) {
        // Development environment
        apiURL = Platform.select({
            ios: "https://localhost:7088",
            android: "https://tamilcommunityapi.thirdeyeinfotech.com",
            default: "https://tamilcommunityapi.thirdeyeinfotech.com"
        });
    } else {
        // Production environment
        apiURL = "https://tamilcommunityapi.thirdeyeinfotech.com";
        
    }

    return apiURL;
}

export const AppConfig = {
    APIURL: getAPIURL(),
    // Add other configuration constants here
    APP_NAME: "Tamil Community Portal",
    API_TIMEOUT: 30000, // 30 seconds
    IMAGE_BASE_URL: `${getAPIURL()}/uploads`,
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        DEFAULT_PAGE_NUMBER: 1
    },
    STORAGE_KEYS: {
        AUTH_TOKEN: 'auth_token',
        USER_DATA: 'user_data',
        LANGUAGE: 'selected_language'
    },
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'ta'],
    FILE_UPLOAD: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg']
    }
};

// You can also add type definitions for configuration
export type AppConfigType = typeof AppConfig;

// Export individual constants if needed
export const {
    APIURL,
    APP_NAME,
    API_TIMEOUT,
    IMAGE_BASE_URL,
    PAGINATION,
    STORAGE_KEYS,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    FILE_UPLOAD
} = AppConfig;

export default AppConfig;