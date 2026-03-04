# strapi-plugin-ar-pack

Arabic (RTL) language pack plugin for the Strapi Admin panel (Strapi v5).

## Install

```bash
# npm
npm i strapi-plugin-ar-pack

# or yarn
yarn add strapi-plugin-ar-pack
```

Then rebuild the admin:

```bash
npm run build && npm run develop
# or
yarn build && yarn develop
```

## Notes

- This plugin registers Arabic (`ar`) translations and applies `dir="rtl"` automatically when the Admin UI language is Arabic.
- It also attempts to translate Content Manager List/Edit view labels via Strapi Admin hooks (same technique as the Japanese pack).
