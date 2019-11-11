<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar class="bg-secondary">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Client Segregated Account
        </q-toolbar-title>
        <q-space />
          <!-- <q-btn flat round dense icon="search" class="q-mr-xs" /> -->
            <q-btn flat round dense icon="more_vert">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item 
                  v-if="isAdmin" 
                  clickable 
                  v-close-popup
                >
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click.native="signOut()" v-close-popup>
                  <q-item-section>Sign Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      elevated
      content-class="bg-grey-2"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
        <q-list>
          <q-item 
            to="/" 
            exact
            clickable
            v-ripple
            :active="link === 'dahboard'"
            @click="link = 'dahboard'"
            active-class="active-link"
          >
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              Dashboard
            </q-item-section>
          </q-item>

          <q-item 
            to="management" 
            v-if="isAdmin"
            exact
            clickable
            v-ripple
            :active="link === 'management'"
            @click="link = 'management'"
            active-class="active-link"
          >
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>

            <q-item-section>
              Management
            </q-item-section>
          </q-item>

          <q-item 
            to="account-management" 
            v-if="isAdmin"
            exact
            clickable
            v-ripple
            :active="link === 'account-management'"
            @click="link = 'account-management'"
            active-class="active-link"
          >
            <q-item-section avatar>
              <q-icon name="account_box" />
            </q-item-section>

            <q-item-section>
              Account Management
            </q-item-section>
          </q-item>

          <q-item 
            v-if="isClient"
            to="transactions" 
            exact
            clickable
            v-ripple
            :active="link === 'transactions'"
            @click="link = 'transactions'"
            active-class="active-link"
          >
            <q-item-section avatar>
              <q-icon name="insert_chart" />
            </q-item-section>

            <q-item-section>
              Transactions
            </q-item-section>
          </q-item>

          <q-item 
            v-if="isClient"
            to="deposits" 
            exact
            clickable
            v-ripple
            :active="link === 'deposits'"
            @click="link = 'deposits'"
            active-class="active-link"
          >
            <q-item-section avatar>
              <q-icon name="attach_money" />
            </q-item-section>

            <q-item-section>
              Deposits
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top bg-profile" src="" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-xs ">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div v-if="user && user !== null" class="color-secondary text-weight-bold">{{ user.displayName }}</div>
          <div v-if="user && user.email !== null" class="q-mt-xs"><span class="text-weight-bold">Email: </span>{{ user.email }}</div>
          <div v-if="isClient && client !== null"><span class="text-weight-bold">Balance: </span>{{client.balance | currency}}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  name: 'Default',

  data () {
    return {
      bg: 'assets/bg.png',
      leftDrawerOpen: true,
      link: 'dashboard'
    }
  },
  created () {
    
  },
  mounted () {

  },
  computed: {
    ...mapGetters({
      isAdmin: 'auth/isAdmin',
      isClient: 'auth/isClient',
      user: 'auth/user',
      client: 'state/GET_CLIENT',
    })
  },
  updated() {
  },
  methods: {
    signOut () {
      this.$store.dispatch('auth/signOut')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/quasar.variables';

.bg-profile {
  background-image: url(~assets/bg2.jpg);
  background-size: cover;
  background-repeat: no-repeat;
}
.active-link {
  color: white;
  background: darken($secondary, 18%);
}
</style>
