<script setup lang="ts">
import Main from "@/components/Main.vue";
import { ref } from "vue";
import { NLoadingBarProvider, NSpace, NMessageProvider, NLayoutHeader, NMenu } from "naive-ui";
import Documentation from "@/components/Documentation.vue";

const pages = ref([
    {
        label: 'Game',
        key: 'game',
        disabled: false
    },
    {
        label: 'Documentation',
        key: 'docs',
        disabled: false
    }
])
const pageView = ref('game')

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
                  <NLayoutHeader bordered>
                      <NMenu mode="horizontal" :value="pageView" :options="pages" style="align-content: center; justify-items: center; display: flex;"/>
                  </NLayoutHeader>
                  <Main class="middle" v-if="pageView == 'game'"/>
                  <Documentation class="middle" v-else-if="pageView == 'docs'"/>
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
header {
    background-color: #f6f6f6;
    color: #fff;
    padding: 10px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}
n-menu{
    display: flex;
    justify-content: left;
    align-items: flex-start;
}
n-li{
    list-style-type: none;
    padding: 1px;
    margin: 5px;
}
n-li a{
    text-decoration: #4be831;
    color: #000000;
}
n-li a:hover{
    color: #8cce7e;
}
</style>
