import './rtl.css'

const pluginId = 'ar-pack'
const translationBaseKey = 'strapi-plugin-ar-pack'

/**
* Detect current admin locale and apply RTL if Arabic
 */
const applyRtlIfArabic = (app) => {
  try {
    const state = app?.store?.getState?.()
    const locale =
      state?.admin_app?.language?.locale ||
      document?.documentElement?.lang ||
      ''

    const isArabic = locale.toLowerCase().startsWith('ar')

    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  } catch (e) {
    // ignore
  }
}

/**
 * Check if our translation namespace exists
 */
const hasOriginKey = (app) => {
  const translations = app?.configurations?.translations
  const hasArLocale = translations?.ar

  if (!hasArLocale) {
    return false
  }

  const hasOriginKeys = translations.ar[translationBaseKey]
  if (!hasOriginKeys) {
    return false
  }

  return true
}

export default {
  register(app) {
    applyRtlIfArabic(app)

    /**
     * List View (table headers)
     */
    app.registerHook('Admin/CM/pages/ListView/inject-column-in-table', (e) => {
      if (!hasOriginKey(app)) {
        return e
      }

      if (Array.isArray(e.displayedHeaders)) {
        e.displayedHeaders = e.displayedHeaders.map((displayHeader) => {
          const defaultLabel = displayHeader?.label

          if (
            defaultLabel &&
            app.configurations.translations.ar?.[translationBaseKey]?.[defaultLabel]
          ) {
            displayHeader.label =
              app.configurations.translations.ar[translationBaseKey][defaultLabel]
          }

          return displayHeader
        })
      }

      return e
    })

    /**
     * Edit View (field labels)
     */
    app.registerHook('Admin/CM/pages/EditView/mutate-edit-view-layout', (e) => {
      if (!e?.layout?.layout) {
        return e
      }

      if (!hasOriginKey(app)) {
        return e
      }

      const { layout } = e.layout

      const recursiveTranslate = (node) => {
        if (Array.isArray(node)) {
          node.forEach(recursiveTranslate)
          return
        }

        const defaultLabel = node?.label

        if (
          defaultLabel &&
          app.configurations.translations.ar?.[translationBaseKey]?.[defaultLabel]
        ) {
          node.label =
            app.configurations.translations.ar[translationBaseKey][defaultLabel]
        }

        if (node?.children) {
          recursiveTranslate(node.children)
        }
      }

      recursiveTranslate(layout)

      return e
    })
  },

  bootstrap(app) {
    applyRtlIfArabic(app)
  },

  async registerTrads({ locales }) {
    if (!locales.includes('ar')) {
      return []
    }

    const translations = await import('./translations/ar.json')
    const arMessages = translations.default

    arMessages[`${pluginId}.plugin.name`] = 'إضافة اللغة العربية لـ Strapi'

    return [
      {
        data: arMessages,
        locale: 'ar',
      },
    ]
  },
}