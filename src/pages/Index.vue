<template>
  <q-page>
    <div class="q-pa-md">
      <h4 class="q-ma-none">Dashboard</h4>
      <div class="row mt-80" v-if="isAdmin">
        <div class="col-2">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Clients</div>
            </q-card-section>

            <q-card-section>
              {{ clients.length }}
            </q-card-section>
          </q-card>
        </div>
    
      </div>
      <!-- <div class="row">
        <div class="col q-pa-md">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Transactions</div>
            </q-card-section>

            <q-card-section>
              33
            </q-card-section>
          </q-card>
        </div>
        <div class="col q-pa-md">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Net Equity</div>
            </q-card-section>

            <q-card-section>
              $0.00
            </q-card-section>
          </q-card>
        </div>
        <div class="col q-pa-md">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Balance</div>
            </q-card-section>

            <q-card-section>
              $0.00
            </q-card-section>
          </q-card>
        </div>
        <div class="col q-pa-md">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="text-h6">Unrealized P/L</div>
            </q-card-section>

            <q-card-section>
              $0.00
            </q-card-section>
          </q-card>
        </div>
      </div> -->
      <div class="row q-mt-lg" v-if="isClient">
        <div class="col-12">

          <q-markup-table flat>
            <thead class="bg-secondary">
              <tr>
                <th colspan="7">
                  <div class="row no-wrap items-center">
                    <div class="text-h4 text-white">Rates - Base USD</div>
                  </div>
                </th>
              </tr>
              <tr>
                <th class="text-white text-left">Rate</th>
                <th class="text-white text-left">Value</th>
              </tr>
            </thead>
            <tbody class="bg-grey-3">
              <tr v-for="(item, key) in rates" :key="key">
                <td class="text-left">{{key}}</td>
                <td class="text-left">{{item}}</td>
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
  name: 'PageIndex',
  data() {
    return {
      test: 30
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin',
      isClient: 'auth/isClient',
      user: 'auth/user',
      clients: 'state/GET_CLIENTS',
      rates: 'state/GET_RATES',
    }),
    created() {

    }
  }
}
</script>
<style lang="scss" scoped>
.mt-80 {
  margin-top: 80px;
}
</style>
