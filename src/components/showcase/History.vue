<template>
  <div>
    <div class="row">
      <div class="col-12">
        <q-table
          title="Trade history"
          :data="data.closedTrades"
          :columns="columns"
          :visible-columns="[ 'ticket', 'date', 'currency',  'leverage', 'bsPrice', 'unrealized', 'currentPrice']"
          :filter="filter"
          :row-key="row => row.ticket"
          no-data-label="I didn't find any open trades for you"
          :loading="loading"
        >
          <template v-slot:top-left v-if="selected.length !== 0">
            <q-btn claass="q-mb-xs" color="secondary" icon-right="send" @click="submitModal = true" label="Close selected trades" />
          </template>
          <template v-slot:top-right>
            <q-input dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import currencyFormatter from 'currency-formatter'

export default {
  name: 'History',
  props: ['userData'],
  data () {
    return {
      submitModal: false,
      loading: false,
      filter: '',
      selected: [],
      columns: [
        {
          name: 'ticket',
          required: false,
          label: 'Ticket#',
          align: 'left',
          field: row => row.ticket !== undefined ? row.ticket : 'N/A',
          format: val => `${val}`,
          sortable: true
        },
        { 
          name: 'date', 
          align: 'left', 
          label: 'Date', 
          field: row => row.date.seconds !== undefined ? moment(row.date.toDate()).format("DD MMM YYYY h:mm") : 'N/A',
          sortable: true 
        },
        { 
          name: 'currency', 
          align: 'right', 
          label: 'Currency', 
          field: row => row.currency !== undefined ? `${row.currency}/USD` : 'N/A',
          sortable: true 
        },
        { 
          name: 'leverage', 
          align: 'right', 
          label: 'Leverage', 
          field: row => row.leverage !== undefined ? currencyFormatter.format(row.leverage, { code: 'USD' }) : 'N/A',
          sortable: true ,
          visible: false
        },
        { 
          name: 'bsPrice', 
          align: 'right', 
          label: 'B/S Price', 
          field: row => row.bsPrice !== undefined ? row.bsPrice : 'N/A',
          sortable: true 
        },
        { 
          name: 'unrealized', 
          align: 'right', 
          label: 'Unrealized P/L', 
          field: row => row.profitLoss !== undefined ? currencyFormatter.format(row.profitLoss, { code: 'USD' }) : 'N/A',
          sortable: true 
        },
        { 
          name: 'currentPrice', 
          align: 'right', 
          label: 'Closed Rate', 
          field: row => row.closedRate !== undefined ? row.closedRate : 'N/A',
          sortable: true 
        }
      ],
      data: []
    }
  },
  created () {
    this.data = this.userData
  },
  computed: {

  },
  methods: {
  
  }
}
</script>
