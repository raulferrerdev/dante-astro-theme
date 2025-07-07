import type { CookieConsentConfig } from 'vanilla-cookieconsent';

// Extend the Window interface to include the dataLayer object
declare global {
    interface Window {
        dataLayer: Record<string, any>[];
        gtag: (...args: any[]) => void;
    }
}

export const config: CookieConsentConfig = {
    guiOptions: {
        consentModal: {
            layout: 'box inline',
            position: 'bottom left',
        },
        preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
            flipButtons: false,
        },
    },
    categories: {
        necessary: {
            readOnly: true,
        },
        functionality: {},
        analytics: {
            services: {
                ga4: {
                    label:
                        '<a href="https://marketingplatform.google.com/about/analytics/terms/us/" target="_blank">Google Analytics 4</a>',
                    onAccept: () => {
                        console.log('ga4 accepted');
                        window.gtag("consent", "update", {
                            ad_storage: "granted",
                            ad_user_data: "granted",
                            ad_personalization: "granted",
                            analytics_storage: "granted",
                        });
                    },
                    onReject: () => {
                        console.log('ga4 rejected');
                    },
                    cookies: [
                        {
                            name: /^_ga/,
                        },
                    ],
                },

            },
        },
    },
    language: {
        default: 'en',
        autoDetect: 'browser',
        translations: {
            en: {
                consentModal: {
                    title: "We use cookies to improve your experience",
                    description:
                        'We use cookies to personalize content and ads, to provide social media features and to analyze our traffic. You can choose which categories of cookies you consent to. You can change or withdraw your consent at any time.',
                    acceptAllBtn: 'Accept all cookies',
                    acceptNecessaryBtn: 'Only necessary',
                    showPreferencesBtn: 'Customize preferences',
                    footer:
                        '<a href="/privacy-policy" target="_blank">Privacy Policy</a>\n<a href="/terms-of-service" target="_blank">Terms of Service</a>',
                },
                preferencesModal: {
                    title: 'Your Cookie Preferences',
                    acceptAllBtn: 'Accept all cookies',
                    acceptNecessaryBtn: 'Only necessary',
                    savePreferencesBtn: 'Save my preferences',
                    closeIconLabel: 'Close',
                    serviceCounterLabel: 'Service|Services',
                    sections: [
                        {
                            title: 'How we use cookies',
                            description:
                                'Cookies are small text files stored on your device to help the site function, analyze performance, and offer a personalized experience. You can choose to allow or reject different types of cookies.',
                        },
                        {
                            title: 'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
                            description:
                                'These cookies are essential for the website to function properly. They ensure basic features like page navigation and access to secure areas of the site. Without these cookies, the website cannot function correctly.',
                            linkedCategory: 'necessary',
                        },
                        {
                            title: 'Functionality Cookies',
                            description:
                                'Functionality cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personalized features.',
                            linkedCategory: 'functionality',
                        },
                        {
                            title: 'Analytics Cookies',
                            description:
                                'Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This allows us to improve the user experience.',
                            linkedCategory: 'analytics',
                        },
                        {
                            title: 'More information',
                            description:
                                'For more details about how we use cookies and how you can manage your preferences, please <a class="cc__link" href="/contact">contact us</a>.',
                        },
                    ],
                },
            },
        },
    },
};
