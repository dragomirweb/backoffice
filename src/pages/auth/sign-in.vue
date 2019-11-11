<template>
<q-page padding class="flex flex-center">
    <q-card class="q-pa-xl row w-50">
        <q-card-section class="text-dark text-center q-pl-none w-100">
          <h4 class="text-center">Client Segregated Account</h4>
        </q-card-section>

        <q-form
          @submit.prevent="signIn()"
          class="q-gutter-md w-100"
        >
            <q-input
              filled
              v-model="form.email"
              label="Your email *"
              hint="Please enter your email"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-input
              class="q-mt-xl"
              filled
              type="password"
              v-model="form.password"
              label="Password *"
              lazy-rules
            />

            <div class="q-mt-xl flex items-center justify-center">
                <q-btn 
                  label="Log in" 
                  type="submit" 
                  size="medium"
                  color="primary" 
                />
            </div>
        </q-form>
    </q-card>
</q-page>
</template>

<script>
import { QSpinnerFacebook } from 'quasar'

export default {
  name: 'PageSignIn',
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    signIn () {
      let credentials = {
        email: this.form.email,
        password: this.form.password
      }
      this.$q.loading.show()

      this.$store.dispatch('auth/signIn', credentials)
        .then(user => {
          this.$q.loading.hide()
          this.$router.replace({
            name: 'dashboard'
          }).catch(() => {})
        })
        .catch(error => {
          this.$q.loading.hide()
          this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Invalid Login!'
          })
        })
    }
  }
}
</script>

<style lang="scss">
  .w-50 {
    width: 50%;
  }

  .w-100 {
    width: 100%;
  }
    
</style>
