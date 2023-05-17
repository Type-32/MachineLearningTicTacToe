<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import Main from "@/components/Main.vue";
import { NLoadingBarProvider, NSpace, NMessageProvider } from "naive-ui";
</script>

<template>
    <!--
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>
  -->

  <main>
      <n-space>
          <n-loading-bar-provider>
              <n-message-provider>
                  <Main class="middle"/>
              </n-message-provider>
          </n-loading-bar-provider>
      </n-space>
  </main>
</template>

<style scoped>
Main{
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    align-self: center;
}
</style>
