<template>
<div>
    <div class="row q-mt-xs">
        <div class="col-12 q-pa-xs">

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
                        <th class="text-white text-left">User</th>
                        <th class="text-white text-left">Current balance</th>
                        <th class="text-white text-left">Added balance</th>
                    </tr>
                </thead>
                <tbody class="bg-grey-3">
                    <tr>
                        <td class="text-left">{{ userData.user.email }}</td>
                        <td class="text-left">{{ userData.balance | currency }}</td>
                        <td class="text-left">{{addBalance.type === 'Add' ? '' : '-'}}{{ addBalance.balance | currency }}</td>
                    </tr>
                </tbody>
            </q-markup-table>
        </div>
    </div>
    <div>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" ref="addBalance">
            <div class="row">
                <div class="col-2 q-pa-xs">
                    <q-select label="Currency" filled v-model="addBalance.type" :options="types" @input="updateBalance" :rules="[
                  val => val !== null && val !== '' || 'Type of operation is required',
                ]" />
                </div>

                <div class="col-10 q-pa-xs">
                    <q-input filled type="number" step=any v-model="addBalance.balance" label="Amount *" lazy-rules :rules="[ val => val && val.length > 0 || 'Number must be grater then 0' ]" />
                </div>
            </div>

            <div>
                <q-btn label="Submit" type="submit" color="primary" />
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
        </q-form>
    </div>
</div>
</template>

<script>
export default {
    name: 'AddBalance',
    props: ['userData'],
    data() {
        return {
            addBalance: {
                type: null,
                balance: null
            },
            types: [
                'Add',
                'Remove'
            ]
        }
    },
    computed: {
    },
    methods: {
        onSubmit() {
          let type = this.addBalance.type === 'Add' ? true : false;
          const db = this.$db.collection('users').doc(this.userData.id)
          const oldBalance = parseInt(this.userData.balance)
          const newBalance = parseInt(this.addBalance.balance)
          // .update({ balance: balance });
          if (type && this.addBalance.balance !== null) {
            db.update({ balance: parseInt(oldBalance + newBalance) }).then(r => {
                this.userData.balance = parseInt(oldBalance + newBalance) 
                this.addBalance.type = null
                this.addBalance.balance = null
                this.$refs.addBalance.resetValidation()
            })
            this.$db.runTransaction(transaction => {
                // This code may get re-run multiple times if there are conflicts.
            return transaction.get(db).then(doc => {
                const dbTrades = doc.data().deposits;
                
                dbTrades.push({
                    date: new Date(),
                    deposit: newBalance
                })
                
                transaction.update(db, { deposits: dbTrades });
            });
            }).catch(function (error) {
            console.log(error)
            });

          } else {
            db.update({ balance: parseInt(oldBalance - newBalance) }).then(r => {
                this.userData.balance = parseInt(oldBalance + newBalance) 
                this.addBalance.type = null
                this.addBalance.balance = null
                this.$refs.addBalance.resetValidation()
            });

            this.$db.runTransaction(transaction => {
                // This code may get re-run multiple times if there are conflicts.
            return transaction.get(db).then(doc => {
                const dbTrades = doc.data().withdraws;
                
                dbTrades.push({
                    date: new Date(),
                    withdraw: newBalance
                })
                
                transaction.update(db, { withdraws: dbTrades });
            });
            }).catch(function (error) {
            console.log(error)
            });
          }
        },
        onReset() {
            this.$refs.addBalance.resetValidation()
            this.addBalance.type = null
            this.addBalance.balance = null
        },
        updateBalance() {

        }
    }
}
</script>
