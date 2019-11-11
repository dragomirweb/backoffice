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
        ref="accountCreateForm"
        class="q-gutter-md bg-grey-1 q-px-lg q-pt-lg q-pb-lg"
      >
        <q-input
          dense
          ref="input"
          v-model="form.name"
          label="Name and Last Name *"
          lazy-rules 
          stack-label
          :rules="[ 
            val => val !== null && val !== '' || 'Name is required',
            val => val.length >= 3 || 'Please use more than 3 characters'
          ]"
        />

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

        <q-input 
          v-model="form.password" 
          filled 
          :type="isPwd ? 'password' : 'text'" 
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          dense
          stack-label
          type="tel"
          label="Phone number *"
          v-model="form.phone"
          lazy-rules
          :rules="[ 
            val => val !== null || 'Phone number is invalid'
          ]"
        />

        <q-input
          dense
          stack-label
          type="text"
          v-model="form.address"
          label="Address *"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || 'Please enter an address' ]"
        />

        <q-input
          dense
          stack-label
          type="text"
          v-model="form.city"
          label="City *"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || 'Please fill in the city' ]"
        />

        <q-input
          dense
          stack-label
          type="text"
          v-model="form.state"
          label="State *"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || 'State is required' ]"
        />

        <q-input
          dense
          stack-label
          type="text"
          v-model="form.zip"
          label="Zip code *"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || 'Zip code is required' ]"
        />

        <q-input
          dense
          stack-label
          type="text"
          v-model="form.country"
          label="Country *"
          lazy-rules
          :rules="[ val => val !== null && val !== '' || 'Country is required' ]"
        />

        <q-select 
          v-model="form.role" 
          :options="userRole" 
          label="User role" 
          :rules="[ val => val !== '' || 'Role is required' ]"
        />

        <div>
          <q-btn :label="type === 'create' ? 'Create account' : 'Update account'" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </transition>
    <q-inner-loading :showing="spinnerVisible">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
export default {
  name: 'UserForm',
  props: ['type'],
  
  data () {
    return {
      spinnerVisible: false,
      isPwd: true,
      form: {
        name: null,
        email: null,
        password: null,
        phone: null,
        address: null,
        city: null,
        state: null,
        zip: null,
        country: null,
        role: null
      },
      userRole: [
        'Client', 'Admin'
      ],
      tests: {
        email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        number: /^[0-9]+(-[0-9]+)+$/
      }
    }
  },
  created () {
//     console.log(this.$db.collection("users").doc('test').set({
//     name: "Los Angeles",
//     state: "CA",
//     country: "USA"
// }))
  },
  methods: {

  onSubmit () {
    const createUser = this.$functions.httpsCallable('createUser')
    const addAdminRole = this.$functions.httpsCallable('addAdminRole')
    const addClientRole = this.$functions.httpsCallable('addClientRole')
    const updateUser = this.$functions.httpsCallable('updateUser')

    this.spinnerVisible = true
    
    if(this.type === 'create') {
      createUser(this.form).then(data => {
      let role = this.form.role === 'Admin' ? true : false;

      if(role) {
        addAdminRole({ email: this.form.email }).then(result => {
          // update the UI if necessary
          // console.log(result)
        })
      } else {
        addClientRole({ email: this.form.email }).then(result => {
          // update the UI if necessary
          // console.log(result)
        })
      }
    })
    .then(result => {
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: `User ${this.form.email} was created with the role of ${this.form.role}`
      })
      
    }).then(r => {
      this.resetForm()
      this.spinnerVisible = false
    }).catch(err => {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: err
      })
    })
    } else if (this.type === 'edit') {

      updateUser(this.form).then(data => {
      let role = this.form.role === 'Admin' ? true : false;

      if(role) {
        addAdminRole({ email: this.form.email }).then(result => {
          // update the UI if necessary
          // console.log(result)
        })
      } else {
        addClientRole({ email: this.form.email }).then(result => {
          // update the UI if necessary
          // console.log(result)
        })
      }
    })
    .then(result => {
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: `User ${this.form.email} was edited !`
      })
    }).then(r => {
      this.resetForm()
      this.spinnerVisible = false
    }).catch(err => {
      this.$q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: err
      })
    })
    }

  },

    resetForm () {
      Object.keys(this.form).forEach(e => this.form[e] = null);
      this.$refs.accountCreateForm.resetValidation()
    }

  }
}
</script>
