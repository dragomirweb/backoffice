<template>
  <q-page>
    <div class="q-pa-md">

      <q-breadcrumbs>
        <q-breadcrumbs-el label="Dashboard" />
        <q-breadcrumbs-el label="Transactions" />
      </q-breadcrumbs>
      <h4 class="q-ma-xs text-center">Transactions</h4>

      <div class="row q-mt-xs q-mt-lg" v-if="client &&  client !== null && client !== undefined">
        <div class="col q-pa-xs" v-if="client.openTrades.length > 0">

          <q-markup-table flat>
            <thead class="bg-secondary">
              <tr>
                <th colspan="7">
                  <div class="row no-wrap items-center">
                    <div class="text-h4 text-white">Open Transactions</div>
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-white text-left">Date Opened</th>
                <th class="text-white text-right">Ticket #</th>
                <th class="text-white text-right">Currency</th>
                <th class="text-white text-right">Leveraged Amount</th>
                <th class="text-white text-right">B/S Price</th>
                <th class="text-white text-right">Unrealized P/L</th>
                <th class="text-white text-right">Current Rate</th>
              </tr>
            </thead>
            <tbody class="bg-grey-3">
              <tr v-for="(open, key) in client.openTrades" :key="key">
                <td class="text-left">{{ open.date.toDate() | moment("DD MMM YYYY h:mm") }}</td>
                <td class="text-right">{{ open.ticket }}</td>
                <td class="text-right">{{ open.currency }}/USD</td>
                <td class="text-right">{{ open.leverage | currency}}</td>
                <td class="text-right"><span class="text-weight-bolder">B</span> {{ open.bsPrice }}</td>
                <td class="text-right">{{ calcBs(open.leverage, open.bsPrice, open.currency).toFixed(2) | currency }}</td>
                <td class="text-right"><span class="text-weight-bolder">S</span> {{ getCurrency(open.currency) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

      </div>
      <div class="row">
        <div class="col q-pa-xs">

          <q-markup-table flat>
            <thead class="bg-secondary">
              <tr>
                <th colspan="7">
                  <div class="row no-wrap items-center">
                    <div class="text-h4 text-white">Closed Transactions</div>
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-white text-left">Date Opened</th>
                <th class="text-white text-right">Ticket #</th>
                <th class="text-white text-right">Currency</th>
                <th class="text-white text-right">Leveraged Amount</th>
                <th class="text-white text-right">B/S Price</th>
                <th class="text-white text-right">Realized P/L</th>
                <th class="text-white text-right">Current Rate</th>
              </tr>
            </thead>
            <tbody class="bg-grey-3">
              <tr v-for="(closed, key) in client.closedTrades" :key="key">
                <td class="text-left">{{ closed.date.toDate() | moment("DD MMM YYYY h:mm") }}</td>
                <td class="text-right">{{ closed.ticket }}</td>
                <td class="text-right">{{ closed.currency }}/USD</td>
                <td class="text-right">{{ closed.leverage | currency}}</td>
                <td class="text-right"><span class="text-weight-bolder">B</span> {{ closed.bsPrice }}</td>
                <td class="text-right">{{ closed.profitLoss.toFixed(2) | currency }}</td>
                <td class="text-right"><span class="text-weight-bolder">S</span> {{ closed.closedRate }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountManagment',

  data () {
    return {
    }
  },
  created() {
  },
  computed: {
    ...mapGetters({
      client: 'state/GET_CLIENT',
      rates: 'state/GET_RATES'
    })
  },
  methods: {
    calcBs(leverage, bsPrice, currency) {
      let newCurrency = this.$cashify.convert(1, {from: currency, to: 'USD'}).toFixed(5)
      let pip = newCurrency - bsPrice
      return leverage * pip * (1 - 0 / 100)
    },
    getCurrency(currency) {
      return this.$cashify.convert(1, {from: currency, to: 'USD'}).toFixed(5)
    }
  }
}
</script>
