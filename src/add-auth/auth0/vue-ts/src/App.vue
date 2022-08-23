<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <template v-if="isAuthenticated"> |
      <!-- router links that require authentication -->
    </template>
  </nav>
  <button v-if="isAuthenticated" v-on:click="logout" id="logout">Logout</button>
  <button v-else v-on:click="login" id="login">Login</button>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

export default defineComponent({
  name: 'app',
  setup() {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    return {
      login: () => {
        loginWithRedirect();
      },
      logout() {
        logout({ returnTo: window.location.origin });
      },
      isAuthenticated
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
