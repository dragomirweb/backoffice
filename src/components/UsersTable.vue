<template>
  <div class="q-pa-md">
    <q-table
      title="Users"
      :data="clients"
      :columns="columns"
      :filter="filter"
      :row-key="row => row.user.email"
      selection="single"
      no-data-label="I didn't find any users for you"
      :selected.sync="selected"
      @update:selected="$emit('selected', selected[0])"
      :loading="loading"
    >
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UsersTable',
  data () {
    return {
      loading: false,
      filter: '',
      selected: [],
      columns: [
        {
          name: 'desc',
          required: false,
          label: 'Name',
          align: 'left',
          field: row => row.user.name !== undefined ? row.user.name : 'N/A',
          format: val => `${val}`,
          sortable: true
        },
        { 
          name: 'email', 
          align: 'left', 
          label: 'Email', 
          field: row => row.user.email !== undefined ? row.user.email : 'N/A', 
          sortable: true 
        },
        { 
          name: 'phone', 
          align: 'left', 
          label: 'Phone', 
          field: row => row.user.phone !== undefined ? row.user.phone : 'N/A', 
          sortable: true 
        },
        { 
          name: 'country', 
          align: 'left', 
          label: 'Country', 
          field: row => row.user.country !== undefined ? row.user.country : 'N/A', 
          sortable: true 
        },
        { 
          name: 'openTrades', 
          align: 'left', 
          label: 'Open Transactions', 
          field: row => row.openTrades.length, 
          sortable: true 
        },
        { 
          name: 'closedTrades', 
          align: 'right', 
          label: 'Closed Transactions', 
          field: row => row.closedTrades.length, 
          sortable: true 
        },
        { 
          name: 'balance', 
          align: 'right', 
          label: 'Balance', 
          field: row => row.balance !== undefined ? row.balance.toFixed(2)  : 0, 
          format: val => `$${val}`, 
          sortable: true }
      ],
      data: []
    }
  },
  created () {
    this.data = this.clients
  },
  computed: {
    ...mapGetters({
      'clients': 'state/GET_CLIENTS',
    })
    
  },
  methods: {
  }
}
</script>
