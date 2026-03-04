import "./rtl.css";

const pluginId = 'ar-pack';

const translationBaseKey = 'strapi-plugin-ar-pack';

const ensureRtl = () => {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  const lang = (html.getAttribute('lang') || '').toLowerCase();
  if (lang === 'ar' || lang.startsWith('ar-')) {
    html.setAttribute('dir', 'rtl');
  }
};

export default {
  register(app) {
    const hasOriginKey = (app) => {
      const hasArLocale = app.configurations.translations && app.configurations.translations.ar;
      if (!hasArLocale) return false;

      const hasOriginKeys = app.configurations.translations.ar[translationBaseKey];
      if (!hasOriginKeys) return false;

      return true;
    };

    // List view (Content Manager)
    app.registerHook('Admin/CM/pages/ListView/inject-column-in-table', (e) => {
      if (!hasOriginKey(app)) return e;

      if (e.displayedHeaders && e.displayedHeaders.length > 0) {
        e.displayedHeaders = e.displayedHeaders.map((displayHeader) => {
          const defaultLabel = displayHeader.label;
          const translated = app.configurations.translations.ar[translationBaseKey][defaultLabel];
          if (translated) {
            displayHeader.label = translated;
          }
          return displayHeader;
        });
      }
      return e;
    });

    // Edit view (Content Manager)
    app.registerHook('Admin/CM/pages/EditView/mutate-edit-view-layout', (e) => {
      const hasLayout = e.layout && e.layout.layout;
      if (!hasLayout) return e;
      if (!hasOriginKey(app)) return e;

      const { layout } = e.layout;

      const recursiveTranslate = (node) => {
        if (Array.isArray(node)) {
          node.forEach(recursiveTranslate);
          return;
        }
        if (!node || typeof node !== 'object') return;

        const defaultLabel = node.label;
        const translated = app.configurations.translations.ar[translationBaseKey][defaultLabel];
        if (translated) node.label = translated;

        // Some nodes contain nested layouts/children
        Object.values(node).forEach((v) => {
          if (Array.isArray(v) || (v && typeof v === 'object')) recursiveTranslate(v);
        });
      };

      recursiveTranslate(layout);
      return e;
    });
  },

  bootstrap() {
    ensureRtl();

    // If user changes UI language without full reload, keep RTL in sync
    if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
      const obs = new MutationObserver(() => ensureRtl());
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  },

  async registerTrads({ locales }) {
    if (!locales.some((locale) => locale === 'ar')) {
      return [];
    }

    const translations = await import('./translations/ar.json');
    const arMessages = translations.default;

    // Strapi expects the plugin name key to exist
    arMessages[`${pluginId}.plugin.name`] = 'Strapi إضافة العربية';

    return Promise.resolve([
      {
        data: arMessages,
        locale: 'ar',
      },
    ]);
  },
};
