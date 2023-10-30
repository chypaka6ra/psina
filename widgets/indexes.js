/** @decorator */

const [
  {   widgetStyles,
    widgetEmptyStateTemplate,
    WidgetWithInstrument,
    widgetDefaultHeaderTemplate,
    widgetWithInstrumentBodyTemplate,
    widgetStackSelectorTemplate
  },
  {   html,
    css,
    when,
    ref,
    repeat,
    observable,
  Observable},
  { WIDGET_TYPES, TRADER_DATUM, TRADER_CAPS},
  { priceCurrencySymbol,
    formatQuantity,
    formatDate,
    formatPriceWithoutCurrency },
  {ellipsis, normalize},
  {  buy,
    fontSizeWidget,
    paletteBlack,
    paletteGrayBase,
    paletteGrayDark1,
    paletteGrayDark4,
    paletteGrayLight1,
    paletteGrayLight2,
    paletteWhite,
    sell,
    themeConditional,
    toColorComponents,
    lighten,
    lineHeightWidget},
  {Tmpl},
  { AsyncFunction },
  { invalidate, validate, ValidationError }
] = await Promise.all([
  import(`${ppp.rootUrl}/elements/widget.js`),
  import(`${ppp.rootUrl}/vendor/fast-element.min.js`),
  import(`${ppp.rootUrl}/lib/const.js`),
  import(`${ppp.rootUrl}/lib/intl.js'`),
  import(`${ppp.rootUrl}/design/styles.js`),
  import(`${ppp.rootUrl}/design/design-tokens.js`),
  import(`${ppp.rootUrl}/lib/tmpl.js`),
  import(`${ppp.rootUrl}/vendor/fast-utilities.js`),
  import(`${ppp.rootUrl}/lib/ppp-errors.js`),
  import(`${ppp.rootUrl}/elements/button.js`),
  import(`${ppp.rootUrl}/elements/query-select.js`),
  import(`${ppp.rootUrl}/elements/snippet.js`),
  import(`${ppp.rootUrl}/elements/text-field.js`),
  import(`${ppp.rootUrl}/elements/widget-controls.js`)
]);


export const listWidgetTemplate = html`
  <template>
    <div class="widget-root">
      ${widgetDefaultHeaderTemplate()}
      <div class="widget-body">
        ${widgetStackSelectorTemplate()}
        ${widgetWithInstrumentBodyTemplate(html` <div></div> `)}
        <ppp-widget-notifications-area></ppp-widget-notifications-area>
      </div>
      <ppp-widget-resize-controls></ppp-widget-resize-controls>
    </div>
  </template>
`;

export const listWidgetStyles = css`
  ${normalize()}
  ${widgetStyles()}
`;

export class ListWidget extends WidgetWithInstrument {
  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
  }

  async validate() {}

  async submit() {
    return {
      $set: {}
    };
  }
}

export async function widgetDefinition() {
  return {
    type: WIDGET_TYPES.LIST,
    collection: 'PPP',
    title: html`Индексы`,
    description: html`<span class="positive">Таблица индексов</span> отображает
    текущие значения индексов.`,
    customElement: ListWidget.compose({
      template: listWidgetTemplate,
      styles: listWidgetStyles
    }).define(),
    minWidth: 275,
    minHeight: 120,
    defaultWidth: 620
  };
}
