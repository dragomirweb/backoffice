<template>
  <div>
    <q-dialog @hide="submitTrade" v-model="submitModal" persistent>
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <q-avatar icon="notification_important" color="primary" text-color="white" />
          <div class="q-ml-sm w-100 q-mb-lg text-center">You are about to close selected trades.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Confirm" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row">
      <div class="col-12">
        <q-table
          title="Users"
          :data="data.openTrades"
          :columns="columns"
          :visible-columns="[ 'ticket', 'date', 'currency',  'leverage', 'bsPrice', 'unrealized', 'currentPrice']"
          :filter="filter"
          :row-key="row => row.ticket"
          selection="multiple"
          no-data-label="I didn't find any open trades for you"
          :selected.sync="selected"
          :loading="loading"
        >
          <template v-slot:top-left v-if="selected.length !== 0 && data.length !== 0">
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

    <div class="row q-mb-xs q-mt-lg" v-if="selected.length !== 0">
      <div class="col-12">
        <q-markup-table flat>
          <thead class="bg-secondary">
            <tr>
              <th colspan="7">
                <div class="row no-wrap items-center">
                  <div class="text-h4 text-white">Preview</div>
                </div>
              </th>
            </tr>
            <tr>
              <th class="text-white text-left">Ticket #</th>
              <th class="text-white text-right">Date Opened</th>
              <th class="text-white text-right">Currency</th>
              <th class="text-white text-right">Leveraged Amount</th>
              <th class="text-white text-right">B/S Price</th>
              <th class="text-white text-right">Unrealized P/L</th>
              <th class="text-white text-right">Current Rate</th>
            </tr>
          </thead>
          <tbody class="bg-grey-3">
            <tr v-for="(trade, key) in selected" :key="key">
              <td class="text-left">{{ trade.ticket }}</td>
              <td class="text-right">{{ trade.date.toDate() | moment("DD MMM YYYY h:mm") }}</td>
              <td class="text-right">{{ trade.currency }}/USD</td>
              <td class="text-right">{{ trade.leverage | currency}}</td>
              <td class="text-right"><span class="text-weight-bolder">B</span> {{ trade.bsPrice }}</td>
              <td class="text-right"><span class="text-weight-bolder">B</span> {{ calcBs(trade.leverage, trade.bsPrice, trade.currency) | currency }}</td>
              <td class="text-right"><span class="text-weight-bolder">B</span> {{ currentRate(trade.currency) }}</td>
              
              <!-- <td class="text-left">{{ addUser.date | moment("DD MMM YYYY h:mm") }}</td>
              <td class="text-right">{{ addUser.ticket }}</td>
              <td class="text-right">{{ addUser.currency }}/USD</td>
              <td class="text-right">{{ addUser.leverage | currency}}</td>
              <td class="text-right"><span class="text-weight-bolder">B</span> {{ this.$cashify.convert(1, {from: addUser.currency, to: 'USD'}).toFixed(5) }}</td>
              <td class="text-right">+$0.00</td>
              <td class="text-right"><span class="text-weight-bolder">S</span> {{ this.$cashify.convert(1, {from: addUser.currency, to: 'USD'}).toFixed(5) }}</td> -->
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import currencyFormatter from 'currency-formatter'
import { mapGetters } from 'vuex'

export default {
  name: 'OpenTradesTable',
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
          field: row => row.bsPrice !== undefined ? currencyFormatter.format(this.calcBs(row.leverage, row.bsPrice, row.currency), { code: 'USD' }) : 'N/A',
          sortable: true 
        },
        { 
          name: 'currentPrice', 
          align: 'right', 
          label: 'Current Rate', 
          field: row => row.bsPrice !== undefined ? this.currentRate(row.currency) : 'N/A',
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
    ...mapGetters({
      getRates: 'state/GET_RATES'
    }),

  },
  methods: {
    calcBs(leverage, bsPrice, currency) {
      let newCurrency = this.$cashify.convert(1, {from: currency, to: 'USD'}).toFixed(5)
      let pip = newCurrency - bsPrice
      return leverage * pip * (1 - 0 / 100)
    },
    currentRate(currency) {
      return this.$cashify.convert(1, {from: currency, to: 'USD'}).toFixed(5)
    },
    submitTrade(evt) {
      if(evt.target.innerText === 'Confirm') {
        let closedTrades = [];
        const trades = closedTrades;
        const userRef = this.$db.collection("users").doc(this.userData.id);
        let newBalance = this.userData.balance
        console.log(newBalance)
        this.selected.forEach(item => {
          let itemSelected = {}
          let profit = this.calcBs(item.leverage, item.bsPrice, item.currency)

          itemSelected.ticket = item.ticket
          itemSelected.date = item.date
          itemSelected.currency = item.currency
          itemSelected.leverage = item.leverage
          itemSelected.bsPrice = item.bsPrice
          itemSelected.profitLoss = profit
          itemSelected.closedRate = this.currentRate(item.currency)
          closedTrades.push(itemSelected)
          
          
          if( Math.sign(parseInt(profit)) == -1 ) {
            newBalance += profit
          } else {
            newBalance += profit
          }

          this.userData.openTrades = this.userData.openTrades.filter(trade => {
            return !item.ticket.includes(trade.ticket)
          })
          this.userData.closedTrades.push(itemSelected)

          setTimeout(() => {
            userRef.update({
              openTrades: this.userData.openTrades.filter(trade => !item.ticket.includes(trade.ticket))
            })
            .catch(function(error) {
                console.error("Error removing document: ", error);
            });
          }, 50);
        })

        userRef.update({
            balance: newBalance
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

        this.$db.runTransaction(transaction => {
            // This code may get re-run multiple times if there are conflicts.
          return transaction.get(userRef).then(doc => {
            const dbTrades = doc.data().closedTrades;
            
            closedTrades.forEach(tr => {
              dbTrades.push(tr)
            })
            
            transaction.update(userRef, { closedTrades: dbTrades });
          });
        }).then(r => {
          this.$router.go(this.$router.currentRoute)
        }).catch(function (error) {
          console.log(error)
        });
      
      this.selected = []

      }
    }
  }
}
</script>
