<template>
  <q-page>
    <div class="q-pa-md">

    <q-breadcrumbs>
      <q-breadcrumbs-el label="Dashboard" />
      <q-breadcrumbs-el label="Management" />
      <q-breadcrumbs-el v-if="link === 'select'" label="Select account" />
      <q-breadcrumbs-el v-if="link === 'transactions'" label="Client transactions" />
      <q-breadcrumbs-el v-if="link === 'operations'" label="Client operations" />
    </q-breadcrumbs>

    <div v-if="selected !== null && selected !== undefined" class="q-pa-md">
      <div class="q-gutter-xs flex items-center">
        Client: 
        <q-chip removable @remove="clearUser()" color="secondary" text-color="white">
          <span class="text-weight-bold">{{selected.user.name}} &nbsp;</span> {{selected.user.email}}
        </q-chip>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col">
        <q-list>
        <q-btn-group spread>
          <!-- <q-btn 
            v-if="selected === null || selected === undefined"
            :active="link === 'select'"
            @click="link = 'select'"
            active-class="cursor-pointer active-submenu" 
            :class="link === 'select' ? 'active-submenu' : ''"
            color="red-6" 
            label="Select Account" 
            icon="group_add" 
          /> -->
          <q-btn 
            v-if="selected !== null && selected !== undefined"
            :active="link === 'operations'"
            @click="link = 'operations'"
            active-class="cursor-pointer active-submenu" 
            :class="link === 'operations' ? 'active-submenu' : ''"
            color="red-7" 
            label="Add Trade" 
            icon="trending_up" 
          />
          <q-btn 
            v-if="selected !== null && selected !== undefined"
            :active="link === 'transactions'"
            @click="link = 'transactions'"
            active-class="cursor-pointer active-submenu" 
            :class="link === 'transactions' ? 'active-submenu' : ''"
            color="red-8" 
            label="Close Trade" 
            icon="trending_down" 
          />
          <q-btn 
            v-if="selected !== null && selected !== undefined"
            :active="link === 'balance'"
            @click="link = 'balance'"
            active-class="cursor-pointer active-submenu" 
            :class="link === 'balance' ? 'active-submenu' : ''"
            color="red-7" 
            label="Add/Remove Balance"
            icon="attach_money"
          />
          <q-btn 
            v-if="selected !== null && selected !== undefined"
            :active="link === 'history'"
            @click="link = 'history'"
            active-class="cursor-pointer active-submenu" 
            :class="link === 'history' ? 'active-submenu' : ''"
            color="red-8" 
            label="Trade history"
            icon="history"
          />
        </q-btn-group>
        </q-list>
      </div>
    </div>
      
      <div v-if="link === 'select' && selected === null || selected === undefined" class="row q-mt-lg">
        <div class="col">
          <h4 class="q-ma-xs q-pl-md">Select account</h4>
          <users-table v-on:selected="setUser($event)"></users-table>
        </div>
      </div>

      <div v-if="link === 'operations'" class="row q-mt-lg">
        <div class="col">
          <add-transaction 
            :user-data="selected"
          >
          </add-transaction>
        </div>
      </div>

      <div v-if="link === 'balance'" class="row q-mt-lg">
        <div class="col">
          <add-balance
            :user-data="selected"
          >
          </add-balance>
        </div>
      </div>

      <div v-if="link === 'transactions'" class="row q-mt-lg">
        <div class="col">
          <open-trades :user-data="selected"></open-trades>
        </div>
      </div>

      <div v-if="link === 'history'" class="row q-mt-lg">
        <div class="col">
          <show-history :user-data="selected"></show-history>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import UsersTable from '../components/UsersTable'
import AddTransaction from '../components/AddTransaction'
import AddBalance from '../components/AddBalance'
import OpenTradesTable from '../components/showcase/OpenTradesTable'
import History from '../components/showcase/History'

export default {
  name: 'AccountManagment',
  components: {
    'users-table': UsersTable,
    'add-transaction': AddTransaction,
    'add-balance': AddBalance,
    'open-trades': OpenTradesTable,
    'show-history': History
  },

  data () {
    return {
      link: 'select',
      selected: null
    }
  },
  mounted () {
    // this.$db.collections("users").get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(`${doc.id} => ${doc.data()}`);
    //     });
    // });
   

  },
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin',
      isClient: 'auth/isClient'
    })
  },

  methods: {
    setUser(evt) {
      this.selected = evt
      this.link = 'operations'
    },
    clearUser() {
      this.selected = null
      this.link = 'select'
    } 

  }
}
</script>
