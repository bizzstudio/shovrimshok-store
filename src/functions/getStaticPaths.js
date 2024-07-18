// pages/[page].js או כל דף דינמי אחר
export async function getStaticPaths() {
    const paths = [];

    const locales = ['en', 'de', 'he'];
    const pages = ['404', 'about-us', 'contact-us', 'failed', 'faq', 'offer', 'privacy-policy', 'success', 'terms-and-conditions', 'user/change-password', 'user/my-orders', 'user/recent-order'];

    locales.forEach((locale) => {
        pages.forEach((page) => {
            paths.push({ params: { page }, locale });
        });
    });

    return {
        paths,
        fallback: 'blocking', // אפשרות נוספת היא fallback: true
    };
}
