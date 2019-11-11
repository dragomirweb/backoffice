<template>
  <div style="width: 80%;margin-bottom: 150px;margin-top: 50px;">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-form
        @submit="onSubmit"
        @reset="resetForm"
        ref="createAccount"
        class="q-gutter-md bg-grey-1 q-px-lg q-pt-lg q-pb-lg"
      >

        <q-input
          dense
          stack-label
          type="email"
          v-model="form.email"
          label="E-mail *"
          lazy-rules
          :rules="[ 
            val => val !== null && val !== '' || 'Email is invalid',
            val => tests.email.test(val) || 'email invalid'
          ]"
        />

        <div>
          <q-btn label="Delete account" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </transition>
    <q-inner-loading :showing="visible">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
export default {
  name: 'DeleteUserForm',
  props: ['userData'],
  data () {
    return {
      visible: false,
      form: {
        email: null
      },

      tests: {
        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        number: /^[0-9]+(-[0-9]+)+$/
      }
    }
  },
  methods: {

  onSubmit () {
    const deleteUser = this.$functions.httpsCallable('deleteUser')
    this.visible = true
    
    deleteUser(this.form)
    .then(result => {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: `User ${this.form.email} was deleted`
      })
      
    }).then(r => {
      // this.$db.collection("cities").doc("DC").delete().then(function() {
      //     console.log("Document successfully deleted!");
      // }).catch(function(error) {
      //     console.error("Error removing document: ", error);
      // });

      this.resetForm()
      this.visible = false
    }).catch(err => {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: err
      })
    })
    

  },

    resetForm () {
      Object.keys(this.form).forEach(e => this.form[e] = null);
    }

  }
}
</script>
