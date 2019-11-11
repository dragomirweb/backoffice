<template>
  <q-page>

      
    <div class="q-pa-md">

      <q-breadcrumbs>
        <q-breadcrumbs-el label="Dashboard" />
        <q-breadcrumbs-el label="Account Managment" />
        <q-breadcrumbs-el v-if="link === 'createAccount'" label="Create Account" />
        <q-breadcrumbs-el v-if="link === 'deleteAccount'" label="Delete Account" />
        <q-breadcrumbs-el v-if="link === 'editAccount'" label="Edit Account" />
      </q-breadcrumbs>

      <div class="row q-mt-md">
        <div class="col">
          <q-list>
          <q-btn-group spread>
            <q-btn 
              :active="link === 'createAccount'"
              @click="link = 'createAccount'"
              active-class="cursor-pointer active-submenu" 
              :class="link === 'createAccount' ? 'active-submenu' : ''"
              color="red-6" 
              label="Create Account" 
              icon="group_add" 
            />
            <q-btn 
              :active="link === 'editAccount'"
              @click="link = 'editAccount'"
              active-class="active-submenu"
              :class="link === 'editAccount' ? 'active-submenu' : ''"
              color="red-7" 
              label="Edit Account" 
              icon="edit" 
            />
            <q-btn 
              :active="link === 'deleteAccount'"
              @click="link = 'deleteAccount'"
              active-class="active-submenu" 
              color="red-6"
              :class="link === 'deleteAccount' ? 'active-submenu' : ''"
              label="Delete Account" 
              icon="remove_circle_outline" 
            />
          </q-btn-group>
          </q-list>
        </div>
      </div>

      <div class="row q-mt-xs" v-if="link === 'editAccount'">
        <div class="col q-pa-lg column items-center">
          <h6>Edit account</h6>
          <user-form type="edit"></user-form>
        </div>
      </div>
      <div class="row q-mt-xs" v-if="link === 'createAccount'">
        <div class="col q-pa-lg column items-center">
          <h6>Create account</h6>
          <user-form type="create"></user-form>
        </div>
      </div>
      <div class="row q-mt-xs" v-if="link === 'deleteAccount'">
        <div class="col q-pa-lg column items-center">
          <h6>Delete account</h6>
          <delete-user-form></delete-user-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import UserForm from '../components/UserForm.vue'
import DeleteUserForm from '../components/DeleteUserForm.vue'

export default {
  name: 'AccountManagment',
  components: {
    'user-form': UserForm,
    'delete-user-form': DeleteUserForm
  },

  data () {
    return {
      link: 'createAccount',
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

  methods: {

    onSubmit () {
      const createUser = this.$functions.httpsCallable('createUser')
      const addAdminRole = this.$functions.httpsCallable('addAdminRole')
      const addClientRole = this.$functions.httpsCallable('addClientRole')

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
        this.resetForm()
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: `User ${this.form.email} was created with the role of ${this.form.role}`
        })
      }).catch(err => {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: err
        })
      })

      // Object.keys(this.form).forEach(e => {
      //   if(this.form[e] === null) {
      //     this.$q.notify({
      //       color: 'red-5',
      //       textColor: 'white',
      //       icon: 'warning',
      //       message: `${e.toUpperCase()} is invalid`
      //     })
      //   } 
      // });
      // if (this.accept !== true) {
      //   this.$q.notify({
      //     color: 'red-5',
      //     textColor: 'white',
      //     icon: 'warning',
      //     message: 'You need to accept the license and terms first'
      //   })
      // }
      // else {
      //   this.$q.notify({
      //     color: 'green-4',
      //     textColor: 'white',
      //     icon: 'cloud_done',
      //     message: 'Submitted'
      //   })
      // }
    },

    resetForm () {
      Object.keys(this.form).forEach(e => this.form[e] = null);
    }

  }
}
</script>
