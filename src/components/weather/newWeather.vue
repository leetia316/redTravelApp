<template>
  <div >
      <daily-weather
        v-for="(weather, index) in forecast"
        :key="index"
        :temperature="weather.temp.day"
        :icon="weather.weather[0].icon"
        :date="weather.dt">
      </daily-weather>
  </div>
</template>

<script>
  import axios from 'axios'
  const OWA_API_KEY = '29119e443f955042111e00b3070d4915';
  import DailyWeather from './components/DailyWeather'

  export default {
    name: 'app',
    components: {
      'daily-weather': DailyWeather,
    },

    data() {
      return {
        forecast: {},
        city: '',
        showAlert: false,
        alertMessage: ''
      }
    },

    beforeMount() {
      this.getUserLocation()
    },

    created() {
      EventBus.$on('changeCity', city => {
        this.city = city
        this.getWeatherData()
      })
    },

    methods: {
      async getWeatherData() {
        try {
          const response = await axios.get('http://api.openweathermap.org/data/2.5/forecast/daily', {
            params: {
              q: this.city,
              units: 'metric',
              appid: OWA_API_KEY
            }
          })
          this.forecast = response.data.list
          this.showAlert = false
          this.alertMessage = ''
        } catch (error) {
          this.forecast = {}
          this.showAlert = true
          this.alertMessage = "Couldn't get data for this city!"
        }
      },

      async getUserLocation() {
        try {
          const response = await axios.get("http://ipinfo.io", "jsonp")
          this.city = response.data.city
          this.getWeatherData()
        } catch (error) { }
      }
    }
  }
</script>

<style>
  section {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 200px);
    min-height: 400px;
  }

  footer {
    display: flex;
    height: 200px;
    background-color: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 767px) {
    footer {
      flex-wrap: wrap;
      height: auto;
    }
  }
</style>
