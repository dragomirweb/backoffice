<template>
  <q-page>
    <div class="q-pa-md">

      <q-breadcrumbs>
        <q-breadcrumbs-el label="Dashboard" />
        <q-breadcrumbs-el label="Deposits" />
      </q-breadcrumbs>
      <h4 class="q-ma-xs text-center">Deposits</h4>
      <div class="row q-mt-lg" v-if="client && client !== null && client !== undefined">
        <div class="col q-pa-xs">

          <q-markup-table flat>
            <thead class="bg-secondary">
              <tr>
                <th colspan="7">
                  <div class="row no-wrap items-center">
                    <div class="text-h4 text-white">Deposits</div>
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-white text-left">Date</th>
                <th class="text-white text-right">Amount</th>
              </tr>
            </thead>

            <tbody class="bg-grey-3" v-if="client.deposits">
             <tr v-if="client.deposits.length === 0">
                <td class="text-left">N/A</td>
                <td class="text-right">N/A</td>
              </tr>
              <tr v-for="(item, key) in client.deposits" :key="key">
                <td class="text-left">{{ item.date.toDate() | moment("DD MMM YYYY h:mm") }}</td>
                <td class="text-right">{{ item.deposit | currency }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div class="col q-pa-xs" >

          <q-markup-table flat>
            <thead class="bg-secondary">
              <tr>
                <th colspan="7">
                  <div class="row no-wrap items-center">
                    <div class="text-h4 text-white">Withdraws</div>
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-white text-left">Date</th>
                <th class="text-white text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="bg-grey-3" v-if="client.withdraws">
             <tr v-if="client.withdraws.length === 0">
                <td class="text-left">N/A</td>
                <td class="text-right">N/A</td>
              </tr>
              <tr v-for="(item, key) in client.withdraws" :key="key">
                <td class="text-left">{{ item.date.toDate() | moment("DD MMM YYYY h:mm") }}</td>
                <td class="text-right">{{ item.withdraw | currency }}</td>
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
      test: 30

    }
  },
  computed: {
    ...mapGetters({
      client: 'state/GET_CLIENT'
    })
  },

  methods: {

  }
}
</script>
