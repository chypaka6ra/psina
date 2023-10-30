/** @decorator */

const [
  { widgetStyles,
    widgetEmptyStateTemplate,
    WidgetWithInstrument,
    widgetDefaultHeaderTemplate,
    widgetUnsupportedInstrumentTemplate,
    widgetStackSelectorTemplate
  },
  { html,
    css,
    when,
    attr,
    Updates },
  { WIDGET_TYPES, TRADER_DATUM },
  { normalize, spacing },
  {bodyFont,
    fontSizeWidget,
    paletteBlack,
    paletteGrayBase,
    paletteGrayDark1,
    paletteGrayDark2,
    paletteGrayLight1,
    paletteGrayLight2,
    paletteGrayLight3,
    paletteGreenDark1,
    paletteGreenLight2,
    paletteRedDark1,
    paletteRedLight3,
    paletteWhite,
    darken,
    themeConditional,
    toColorComponents}
] = await Promise.all([
  import(`${ppp.rootUrl}/elements/widget.js`),
  import(`${ppp.rootUrl}/vendor/fast-element.min.js`),
  import(`${ppp.rootUrl}/lib/const.js`),
  import(`${ppp.rootUrl}/design/styles.js`),
  import(`${ppp.rootUrl}/design/design-tokens.js`),
  import(`${ppp.rootUrl}/elements/button.js`),
  import(`${ppp.rootUrl}/elements/query-select.js`),
  import(`${ppp.rootUrl}/elements/text-field.js`),
  import(`${ppp.rootUrl}/elements/widget-controls.js`)
]);



export const TabletWidgetTemplate = html`
  <template>
    <div class="widget-root">
      ${widgetDefaultHeaderTemplate()}
      <div class="widget-body">
        ${widgetStackSelectorTemplate()}
        ${when(
  (x) => !x.instrument?.symbol,
  html`${html.partial(
    widgetEmptyStateTemplate('Выберите инструмент.')
  )}`
)}
        ${widgetUnsupportedInstrumentTemplate()}
        <div
          class="table-holder"
          ?hidden="${(x) =>
  !x.instrument?.symbol ||
  (x.instrument && x.instrumentTrader && x.unsupportedInstrument)}"
        >
          <div class="table-holder-inner">
            <div class="toolbar"></div>
            <div class="table"></div>
          </div>
        </div>
        <ppp-widget-notifications-area></ppp-widget-notifications-area>
      </div>
      <ppp-widget-resize-controls></ppp-widget-resize-controls>
    </div>
  </template>
`;

export const TableWidgetStyles = css`
  ${normalize()}
  ${widgetStyles()}
  ${spacing()}
`;

export class TableWidget extends WidgetWithInstrument {


  // Ready to receive realtime updates
  @attr({ mode: 'boolean' })
  ready;



  css(dt) {
    const value = dt.$value;

    if (typeof value === 'object') return value.createCSS();

    return value;
  }

  async connectedCallback() {
    this.ready = false;

    super.connectedCallback();

    if (!this.document.tableTrader) {
      return this.notificationsArea.error({
        text: 'Отсутствует трейдер котировок.',
        keep: true
      });
    }

    if (!this.document.tradesTrader) {
      return this.notificationsArea.error({
        text: 'Отсутствует трейдер ленты сделок.',
        keep: true
      });
    }
  }


  async disconnectedCallback() {
    if (this.tableTrader) {
      await this.tableTrader.unsubscribeFields?.({
        source: this,
        fieldDatumPairs: {
          traderEvent: TRADER_DATUM.TRADER
        }
      });
    }

    if (this.tradesTrader) {
      await this.tradesTrader.unsubscribeFields?.({
        source: this,
        fieldDatumPairs: {
          print: TRADER_DATUM.MARKET_PRINT
        }
      });
    }

    super.disconnectedCallback();
  }

  resizeTable() {
    Updates.enqueue(() => {
      if (this.table) {
        const { width, height } = getComputedStyle(this);

        if (this.stackSelector.hasAttribute('hidden')) {
          this.table.resize(parseInt(width) - 2, parseInt(height) - 32);
        } else {
          this.table.resize(
            parseInt(width) - 2,
            parseInt(height) -
            32 -
            parseInt(getComputedStyle(this.stackSelector).height)
          );
        }
      }
    });
  }

  onResize({ width, height }) {
    this.resizeTable();
  }

  restack() {
    super.restack();
    this.resizeTable();
  }

  async submit() {
    return {
      $set: {
        tradesTraderId: this.container.tradesTraderId.value
      }
    };
  }
}

export async function widgetDefinition() {
  return {
    type: WIDGET_TYPES.FRAME,
    collection: 'PPP',
    title: html`Индексы`,
    description: html`Виджет
      <span class="positive">Таблица</span> отображает отросшие акции от закрытия.`,
    customElement: TableWidget.compose({
      template: TabletWidgetTemplate,
      styles: TableWidgetStyles
    }).define(),
    defaultWidth: 600,
    minHeight: 120,
    minWidth: 140,
    settings: html`
      <div class="widget-settings-section">
        <div class="widget-settings-label-group">
          <h5>Индексы</h5>
          <p class="description">
            Индексы в рельном времени.
          </p>
        </div>
        <div class="control-line flex-start">
          <ppp-button
            appearance="default"
            @click="${() => window.open('?page=trader', '_blank').focus()}"
          >
            +
          </ppp-button>
        </div>
      </div>
    `
  };
}
