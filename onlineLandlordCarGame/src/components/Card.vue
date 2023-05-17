<template>
    <button class="card" id="card" @click="toggleSelection">
        <div class="card-body">
          <h5 class="card-title">{{title}}</h5>
          <!--<n-button>Number 1</n-button>-->
          <h5 class="card-tail">{{title}}</h5>
        </div>
    </button>
</template>

<style scoped>
.card{
    padding: 10px;
    background-color: #efefef;
    border-radius: 10px;
    border-width: 0px;
    margin: 5px 5px 5px 5px;
    height: 180px;
    width: 120px;
    transition: ease-in-out 0.1s;
}
.card-title{
    transform: translate(-40px, -40px);
    font-size: 30px;
}
.card-tail{
    transform: translate(40px, 40px) rotate(180deg);
    text-anchor: end;
    font-size: 30px;
}
.card:hover{
    background-color: #c7eabf;
    transition: ease-in-out 0.1s;
    transform: translate(0px, -5px);
}
.selected{
    background-color: #c7eabf;
    transition: ease-in-out 0.1s;
    transform: translate(0px, -15px);
}
.selected:hover{
    background-color: #aac9a3;
    transition: ease-in-out 0.1s;
    transform: translate(0px, -10px);
}
</style>
<script setup lang="ts">
import { defineComponent, ref, reactive } from 'vue'
const title = ref("1")
const toggled = ref(false)
function changeTitle(cont: String){
    title.value = cont
}
function toggleSelection(){
    toggled.value = !toggled.value
    if (toggled)
        document.getElementById("card")?.classList.add("selected")
    else
        //alert("Boi")
        document.getElementById("card")?.classList.remove("selected")
}
const props = defineComponent({
    props: {
        title: {
            type: String,
            required: true
        },
        changeTitle: {
            type: Function,
            required: true
        }
    }
})
</script>