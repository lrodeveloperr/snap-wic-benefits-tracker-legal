# App & Store Integration Map

Base URL after GitHub Pages is enabled:

`https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/`

## URLs to place inside the Android APK and iOS app

- Privacy Policy: `https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/privacy/`
- Terms of Use: `https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/terms/`
- Support / Contact: `https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/support/`
- Official Sources & Non-Affiliation: `https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/official-sources/`

Recommended in-app path: **Settings → Legal & Support**.

Add rows for Privacy Policy, Terms of Use, Support / Contact, Official Sources & Non-Affiliation, Privacy Choices, Report an Ad, and the existing Clear All Data control.

`Privacy Choices` must invoke the native Google UMP privacy-options flow when required/available; it should not merely open this website.

`Report an Ad` can open the support page or a prefilled email to `lrodeveloperr@gmail.com` with subject `SNAP & WIC Benefits Tracker - Report an Ad`.

## Store console URLs

Apple App Store Connect:
- Privacy Policy URL → `/privacy/`
- Support URL → `/support/`
- Privacy Choices URL (optional web explanation) → `/privacy/`. The native in-app control remains the operative Google UMP privacy-options entry point where required or available.

Google Play Console:
- Privacy Policy URL → `/privacy/`
- Developer website (optional but recommended) → base URL

## Google Play government-information disclosure

Include this visibly in the Play long description:

**Government information disclaimer**

SNAP & WIC Benefits Tracker is an independent budgeting and benefit-tracking app. It does not represent, operate on behalf of, or have an affiliation with any government or political entity. It does not connect to government benefit accounts or provide official benefit balances or eligibility determinations.

Official sources:
- USDA SNAP: https://www.fns.usda.gov/snap
- USDA WIC: https://www.fns.usda.gov/wic
- Puerto Rico PAN — ADSEF: https://serviciosenlinea.adsef.pr.gov/programas/programa-asistencia-nutricional-pan
- Puerto Rico WIC — Department of Health: https://www.salud.pr.gov/CMS/48

## Native implementation requirements before release

1. Do not send locally entered SNAP/PAN balances, WIC benefit records, transaction history, or shopping-budget values to AdMob as targeting parameters.
2. Implement UMP/privacy choices for applicable U.S. state privacy requirements.
3. On iOS, do not request App Tracking Transparency, do not access IDFA for personalized advertising, and keep advertising limited and non-personalized. Reassess the code, policy, and App Store disclosures before introducing any future tracking or personalized-advertising feature.
4. Include an in-app way to report inappropriate or age-inappropriate ads.
5. Use platform billing for Remove Ads; use the store-provided localized price and a restore mechanism where required.
6. Re-audit privacy disclosures if Firebase Analytics, Crashlytics, another ad mediation SDK, accounts, cloud sync, or a backend is added.

## Spanish / Puerto Rico URLs

- Política de Privacidad: `https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/es/privacidad/`
- Términos de Uso: `https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/es/terminos/`
- Soporte y Contacto: `https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/es/soporte/`
- Fuentes oficiales y no afiliación: `https://lrodeveloperr.github.io/snap-wic-benefits-tracker-legal/es/fuentes-oficiales/`
