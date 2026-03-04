# Strapi Arabic Translation Plug-in (ar)

This plugin translates Strapi's Admin Panel into **Arabic** and enables **RTL** when the admin language is Arabic.

> Note: Some strings may still appear in English if Strapi does not wire a translation key for that UI element.
> Enterprise (EE) features are not covered.

## Supported Strapi versions

- Strapi v4: supported
- Strapi v5: supported

## Install

```bash
npm install strapi-plugin-ar-pack
# or
yarn add strapi-plugin-ar-pack
```

## Setup

### Step 1) Enable i18n and this plugin

```js
// config/plugins.js
module.exports = ({ env }) => ({
  i18n: true,
  "strapi-plugin-ar-pack": {
    enabled: true,
  },
});
```

### Step 2) Enable Arabic in the Admin Panel

```js
// src/admin/app.js
export default {
  config: {
    locales: ["ar"],
  },
  bootstrap(app) {},
};
```

### Step 3) Select Arabic in the Admin UI

Log in to the Strapi Admin Panel, open your user preferences, and switch the interface language to **Arabic**.

When Arabic is active, the plugin sets `dir="rtl"` on the page.

## Development tooling

See `develop/README.md` for:
- extracting missing keys vs. upstream Strapi (`make compare`)
- merging machine translations with existing translations (`make merge`)


## Versioning (Strapi v4 vs v5)

This package follows a Strapi-major aligned versioning scheme:

- **v1.x.x** → Strapi **v4**
- **v2.x.x** → Strapi **v5**

So Strapi v4 users should install `^1.0.0`, and Strapi v5 users should install `^2.0.0`.

See `develop/README.md` for how to pull upstream translations and prepare each release line.
