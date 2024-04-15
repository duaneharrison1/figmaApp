// function pathLanguageDetector(services) {
//     const { pathname } = window.location;
//     const languageCode = pathname.split('/')[1];  // Extract language code from path

//     if (['en', 'fr'].includes(languageCode)) { // Check for supported languages
//         return languageCode;
//     }

//     return undefined; // Fallback to browser detection
// }

// i18n.services.languageDetector.addDetector(pathLanguageDetector);