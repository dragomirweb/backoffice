<template>
    <div class="" focus style="">

    <div class="row q-mt-xs">
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
            <tr v-if="addUser.currency !== null && addUser.currency !== undefined">
              <td class="text-left">{{ addUser.date | moment("DD MMM YYYY h:mm") }}</td>
              <td class="text-right">{{ addUser.ticket }}</td>
              <td class="text-right">{{ addUser.currency }}/USD</td>
              <td class="text-right">{{ addUser.leverage | currency}}</td>
              <td class="text-right"><span class="text-weight-bolder">B</span> {{ this.$cashify.convert(1, {from: addUser.currency, to: 'USD'}).toFixed(5) }}</td>
              <td class="text-right">+$0.00</td>
              <td class="text-right"><span class="text-weight-bolder">S</span> {{ this.$cashify.convert(1, {from: addUser.currency, to: 'USD'}).toFixed(5) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="text-h6 q-ml-xs q-mt-lg">Add trade</div>  
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          ref="addUserForm"
        >
          <div class="row">
            <div class="col q-pa-xs">
              <q-select
                label="Currency"
                filled
                ref="currencySelect"
                v-model="addUser.currency"
                :options="rates"
                @input="updateRates"
                :rules="[
                  val => val !== null && val !== '' || 'Currency is required',
                ]"
              />
            </div>

            <div class="col q-pa-xs">
              <q-input
                filled
                type="number"
                step=any
                v-model="addUser.leverage"
                label="Leverage *"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Leverage is required' ]"
              />
            </div>

            <div class="col q-pa-xs">
              <q-input
                filled
                step=any
                type="number"
                v-model="addUser.bsPrice"
                label="Buy/Sell Price *"
                lazy-rules
                :rules="[
                  val => val && val.length > 0 || 'B/S Price is required',
                ]"
              />
            </div>
          </div>

          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { uid } from 'quasar'

export default {
  name: 'AddTransaction',
  props: ['userData'],
  data () {
    return {
      addUser: {
        date: new Date,
        currency: null,
        leverage: null,
        ticket: null,
        bsPrice: null
      },
      rates: [
        'EUR',
        'AUD',
        'GBP',
        'NZD',
        'XAU',
        'XAG'
      ]
    }
  },
  computed: {
    ...mapGetters({
      getRates: 'state/GET_RATES'
    })
  },
  methods: {
    onSubmit () {
      // this.$db.collection('users').doc(this.userData.id).child("openTrades").push(this.addUser);

      const trade = this.addUser;
      const userRef = this.$db.collection("users").doc(this.userData.id);

      this.$db.runTransaction(transaction => {
          // This code may get re-run multiple times if there are conflicts.
        return transaction.get(userRef).then(doc => {
            if (!doc.data().openTrades) {
                transaction.set({
                    openTrades: [trade]
                });
            } else {
                const openTrades = doc.data().openTrades;
                openTrades.push(trade);
                transaction.update(userRef, { openTrades: openTrades });
            }
        });
      }).then(r => {
        this.userData.openTrades.push(trade)
        this.$router.go(this.$router.currentRoute)
        
      }).catch(function (error) {
        console.log(error)
      });
      
      
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted'
      })
    },

    onReset () {
      this.$refs.addUserForm.resetValidation()
    },

    updateRates(val) {
      this.addUser.bsPrice = this.$cashify.convert(1, {from: val, to: 'USD'}).toFixed(5)
      this.addUser.ticket = uid()
    }

  }
}
</script>
