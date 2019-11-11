import axios from 'axios'
import { Cashify } from 'cashify'
import VueCurrencyFilter from 'vue-currency-filter'

export default ({ Vue, store }) => {
  // this will create the $orderBy object on the Vue instance
  // you will be able to access it with this.$orderBy or Vue.$orderBy
  axios.get('https://openexchangerates.org/api/latest.json?app_id=3157d3d55da74c6d99c6c191418bce8a')
    .then(function (response) {
    // handle success
      const rates = response.data.rates
      store.dispatch('state/setRates', response.data.rates)
      Vue.prototype.$cashify = new Cashify({ base: 'USD', rates })
    })
    .catch(function (error) {
    // handle error
      console.log(error)
    })

  Vue.use(require('vue-moment'))
  
  Vue.use(VueCurrencyFilter,
    {
      symbol: '$',
      thousandsSeparator: '.',
      fractionCount: 2,
      fractionSeparator: ',',
      symbolPosition: 'front',
      symbolSpacing: true
    })
}
