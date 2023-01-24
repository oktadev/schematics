import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'

const app = createApp(App);

const config = {
  domain: '<%= issuer %>',
  clientId: '<%= clientId %>',
  authorizationParams: {
    redirect_uri: window.location.origin
  }
}

app.use(router)
  .use(createAuth0(config))
  .mount('#app')
