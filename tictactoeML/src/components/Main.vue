<script setup lang="ts">
import {defineComponent,reactive,ref} from 'vue'
import {NButton, NModal, NSpace, NSelect, useLoadingBar, useMessage} from 'naive-ui'
import * as tf from '@tensorflow/tfjs';

const model = tf.sequential();
model.add(tf.layers.dense({units: 9, inputShape: [9], activation: 'softmax'}));
model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam', metrics:['accuracy']});

//Board & Record Arrays
const endmessage = ref("You Tied with the Algorithm!")
const bvalues = ref([" "," "," "," "," "," "," "," "," "])
const modelValues = ref([[0,0,0,0,0,0,0,0,0]])
const prevModelValues = ref([[0,0,0,0,0,0,0,0,0]])
const trainedTimes = ref(0)
const predictionIndex = ref(0)

//Modals
const errorModal = ref(false)
const trainingModal = ref(false)

//Loading bar
const loadingBar = useLoadingBar()
const floatingMessage = useMessage()

//Preset Record Array Data - Iteration 1, Horizontal + Perpendicular
const iteration1Data = ref([
    //Mid
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],

    //Mid Left
    [0,0,0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0],

    //Mid Right
    [0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,1,0,0,0]
]);
const iteration1Labels = ref([
    //Init Mid
    [1,0,0,0,1,0,0,0,1],
    [0,0,1,0,1,0,1,0,0],
    [0,1,0,0,1,0,0,1,0],
    [0,0,0,1,1,1,0,0,0],

    //Init Mid Left
    [0,0,0,1,1,1,0,0,0],
    [1,0,0,1,0,0,1,0,0],

    //Init Mid Right
    [0,0,0,1,1,1,0,0,0],
    [0,0,1,0,0,1,0,0,1]
]);

//Preset Record Array Data - Iteration 2, Diagonal
const iteration2Data = ref([
    //Top Left
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],

    //Top Right
    [0,0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0],

    //Bottom Right
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],

    //Bottom Left
    [0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,0,0]
]);
const iteration2Labels = ref([
    //Init Top Left
    [1,0,0,1,0,0,1,0,0],
    [1,0,0,0,1,0,0,0,1],
    [1,1,1,0,0,0,0,0,0],

    //Init Top Right
    [0,0,1,0,0,1,0,0,1],
    [0,0,1,0,1,0,1,0,0],
    [1,1,1,0,0,0,0,0,0],

    //Init Bottom Right
    [0,0,1,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [0,0,0,0,0,0,1,1,1],

    //Init Bottom Left
    [1,0,0,1,0,0,1,0,0],
    [0,0,1,0,1,0,1,0,0],
    [0,0,0,0,0,0,1,1,1]
]);

//Preset Record Array Data - Iteration 3, Complementary Horizontal + Perpendicular
const iteration3Data = ref([
    //Mid
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],

    //Top Left
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],

    //Top Right
    [0,0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0],

    //Bottom Right
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],

    //Bottom Left
    [0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,0,0],

    //Mid Left
    [0,0,0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0],

    //Mid Right
    [0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,1,0,0,0]
]);
const iteration3Labels = ref([
    //Init Mid
    [1,0,0,0,1,0,0,0,1],
    [0,0,1,0,1,0,1,0,0],
    [0,1,0,0,1,0,0,1,0],
    [0,0,0,1,1,1,0,0,0],

    //Init Top Left
    [1,0,0,1,0,0,1,0,0],
    [1,0,0,0,1,0,0,0,1],
    [1,1,1,0,0,0,0,0,0],

    //Init Top Right
    [0,0,1,0,0,1,0,0,1],
    [0,0,1,0,1,0,1,0,0],
    [1,1,1,0,0,0,0,0,0],

    //Init Bottom Right
    [0,0,1,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [0,0,0,0,0,0,1,1,1],

    //Init Bottom Left
    [1,0,0,1,0,0,1,0,0],
    [0,0,1,0,1,0,1,0,0],
    [0,0,0,0,0,0,1,1,1],

    //Init Mid Left
    [0,0,0,1,1,1,0,0,0],
    [1,0,0,1,0,0,1,0,0],

    //Init Mid Right
    [0,0,0,1,1,1,0,0,0],
    [0,0,1,0,0,1,0,0,1]
]);

//Preset Record Array Data - Iteration 4, Complementary Diagonal
const iteration4Data = ref([
    //Mid
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],

    //Top Left
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0],

    //Top Right
    [0,0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0],

    //Bottom Right
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],

    //Bottom Left
    [0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,1,0,0],

    //Mid Left
    [0,0,0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0],

    //Mid Right
    [0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,1,0,0,0]
]);
const iteration4Labels = ref([
    //Init Mid
    [1,0,0,0,1,0,0,0,1],
    [0,0,1,0,1,0,1,0,0],
    [0,1,0,0,1,0,0,1,0],
    [0,0,0,1,1,1,0,0,0],

    //Init Top Left
    [1,0,0,1,0,0,1,0,0],
    [1,0,0,0,1,0,0,0,1],
    [1,1,1,0,0,0,0,0,0],

    //Init Top Right
    [0,0,1,0,0,1,0,0,1],
    [0,0,1,0,1,0,1,0,0],
    [1,1,1,0,0,0,0,0,0],

    //Init Bottom Right
    [0,0,1,0,0,1,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [0,0,0,0,0,0,1,1,1],

    //Init Bottom Left
    [1,0,0,1,0,0,1,0,0],
    [0,0,1,0,1,0,1,0,0],
    [0,0,0,0,0,0,1,1,1],

    //Init Mid Left
    [0,0,0,1,1,1,0,0,0],
    [1,0,0,1,0,0,1,0,0],

    //Init Mid Right
    [0,0,0,1,1,1,0,0,0],
    [0,0,1,0,0,1,0,0,1]
]);

//Preset Record Array Data - Iteration 5, Optimal Complementary Horizontal + Perpendicular
const iteration5Data = ref([

]);
const iteration5Labels = ref([

]);

//Preset Record Array Data - Iteration 6, Optimal Complementary Diagonal
const iteration6Data = ref([

]);
const iteration6Labels = ref([

]);


//Training Data Container
const trainingData = ref([]);
const labels = ref([]);
const iterations = ref('it1');
const iterationSelection = ref([
    {
        label:"Iteration 1",
        value:'it1'
    },
    {
        label:"Iteration 2",
        value:'it2'
    },
    {
        label:"Iteration 3",
        value:'it3'
    },
    {
        label:"Iteration 4",
        value:'it4'
    },
    {
        label:"Iteration 5",
        value:'it5'
    },
]);

function recordTrainingData(tmpArr){
    for(let i = 0; i < tmpArr.value.length; i++){
        //console.log(trainingData)
        trainingData.value.push(tmpArr.value[i])
    }
}
function recordLabelsData(tmpArr){
    for(let i = 0; i < tmpArr.value.length; i++){
        labels.value.push(tmpArr.value[i])
    }
}
function invertRecordData(recordArr){
    for (let i = 0; i < recordArr.value.length; i++){
        recordArr.value[i] = invertBoardArray(recordArr.value[i])
    }
    return recordArr.value
}


let tMV1 = ref([])
let tMV2 = ref([])
tMV1.value = invertRecordData(iteration1Data)
tMV2.value = invertRecordData(iteration1Labels)

function initialize(){
    recordTrainingData(tMV1)
    recordLabelsData(tMV2)
    trainModel()
}

function checkEndgame(){
    //Check for win
    //Check for tie
    //Check for loss
    var win = false
    var tie = false
    if (bvalues.value[0] == bvalues.value[1] && bvalues.value[1] == bvalues.value[2] && bvalues.value[0] != " "){
        //Check for first row
        if (bvalues.value[0] == "X"){
            win = true
        }
    }
    else if (bvalues.value[3] == bvalues.value[4] && bvalues.value[4] == bvalues.value[5] && bvalues.value[3] != " "){
        //Check for second row
        if (bvalues.value[3] == "X"){
            win = true
        }
    }
    else if (bvalues.value[6] == bvalues.value[7] && bvalues.value[7] == bvalues.value[8] && bvalues.value[6] != " "){
        //Check for third row
        if (bvalues.value[6] == "X"){
            win = true
        }
    }
    else if (bvalues.value[0] == bvalues.value[3] && bvalues.value[3] == bvalues.value[6] && bvalues.value[0] != " "){
        //check for first column
        if (bvalues.value[0] == "X"){
            win = true
        }
    }
    else if (bvalues.value[1] == bvalues.value[4] && bvalues.value[4] == bvalues.value[7] && bvalues.value[1] != " "){
        //check for second column
        if (bvalues.value[1] == "X"){
            win = true
        }
    }
    else if (bvalues.value[2] == bvalues.value[5] && bvalues.value[5] == bvalues.value[8] && bvalues.value[2] != " "){
        //check for third column
        if (bvalues.value[2] == "X"){
            win = true
        }
    }
    else if (bvalues.value[0] == bvalues.value[4] && bvalues.value[4] == bvalues.value[8] && bvalues.value[0] != " "){
        //check for positive diagonal
        if (bvalues.value[0] == "X") {
            win = true
        }
    }
    else if (bvalues.value[2] == bvalues.value[4] && bvalues.value[4] == bvalues.value[6] && bvalues.value[2] != " ") {
        //check for negative diagonal
        if (bvalues.value[2] == "X") {
            win = true
        }
    }
    else if (bvalues.value[0] != " " && bvalues.value[1] != " " && bvalues.value[2] != " " && bvalues.value[3] != " " && bvalues.value[4] != " " && bvalues.value[5] != " " && bvalues.value[6] != " " && bvalues.value[7] != " " && bvalues.value[8] != " "){
        win = false
        tie = true
    }else{
        return
    }
    if(tie){
        document.getElementById("endgame-msg")?.classList.add("tie-text")
        endmessage.value = "You Tied with the Algorithm!"
    }else if(win){
        document.getElementById("endgame-msg")?.classList.add("win-text")
        endmessage.value = "You Won!"
    }else{
        document.getElementById("endgame-msg")?.classList.add("lose-text")
        endmessage.value = "You Lost!"
    }
    document.getElementById("reset-game-button")?.classList.remove("hidden")
    document.getElementById("train-model-button")?.classList.remove("hidden")
    document.getElementById("ML-predict-button")?.classList.add("hidden")
    document.getElementById("endgame-msg")?.classList.remove("hidden")
    document.getElementById("main-container")?.classList.add("uninteractable")
}

function scanBoard(){
    let tmpArr = [0,0,0,0,0,0,0,0,0]
    for(let i = 0; i < 9; i++){
        if(bvalues.value[i] == "X"){
            tmpArr[i] = 1
        }else if(bvalues.value[i] == "O"){
            tmpArr[i] = 2
        }else{
            tmpArr[i] = 0
        }
    }
    return tmpArr
}
function invertBoardArray(tmpArr){
    for(let i = 0; i < 9; i++){
        if(tmpArr[i] == 1){
            tmpArr[i] = 2
        }else if(tmpArr[i] == 2){
            tmpArr[i] = 1
        }
    }
    return tmpArr
}
function turntable(index, reportError:boolean = true){
    if(bvalues.value[index] != " "){
        if(reportError) errorModal.value = true
        return false
    }
    prevModelValues.value = modelValues.value // Record board before change occurs
    bvalues.value[index] = isturn.value ? "X" : "O"
    modelValues.value.push(scanBoard()); //Record board after change occurs
    checkEndgame()
    isturn.value = !isturn.value

    //Pushing the normal board to training model
    recordTrainingData(prevModelValues)
    recordLabelsData(modelValues)

    //Pushing the inverted board to training model
    //recordTrainingData(invertRecordData(prevModelValues))
    //recordLabelsData(invertRecordData(modelValues))
    return true
}
function resetGame(){
    document.getElementById("endgame-msg")?.classList.add("hidden")
    for (let i = 0; i < bvalues.value.length; i++) {
        bvalues.value[i] = " "
    }
    for(let i = 0; i < modelValues.value.length; i++){
        modelValues.value.pop()
    }
    for(let i = 0; i < prevModelValues.value.length; i++){
        prevModelValues.value.pop()
    }

    document.getElementById("reset-game-button")?.classList.add("hidden")
    document.getElementById("train-model-button")?.classList.add("hidden")
    document.getElementById("ML-predict-button")?.classList.remove("hidden")
    document.getElementById("main-container")?.classList.remove("uninteractable")
    isturn.value = true
}
const isturn = ref(true)

async function trainModel(announceMessage: boolean = true) {
    let success = false
    loadingBar.start()
    if(announceMessage) {
        floatingMessage.info("Training Machine Learning Model...")
    }
    trainingModal.value = false
    document.getElementById("config-buttons")?.classList.add("uninteractable")
    console.log(trainingData.value)
    try {
        await model.fit(tf.tensor2d(trainingData.value), tf.tensor2d(labels.value), {epochs: 100}).then(() => {
            loadingBar.finish()
            if(announceMessage) {
                floatingMessage.success("Machine Learning Model Trained Successfully!")
                trainingModal.value = true
            }
            document.getElementById("config-buttons")?.classList.remove("uninteractable")
            success = true
        });
    } catch (e) {
        floatingMessage.error("Error while Training Machine Learning Model: " + e)
        success = false
    }
    trainedTimes.value = model.getWeights().length
    return success
}
const prediction = ref('')
const argDef = ref(-1)
function makePrediction() {
    //trainModel()
    if (!model) return;

    // Define the game board state
    const gameState = tf.tensor2d([scanBoard()]);

    // Use the model to predict the next move
    const output = model.predict(gameState);

    // Get the predicted move
    predictionIndex.value = output.argMax(-1).dataSync()[0];
    prediction.value = `(${Math.floor(predictionIndex.value / 3)}, ${predictionIndex.value % 3})`;
    console.log(prediction)
    let val = turntable(predictionIndex.value,false)
    let cnt = 0
    while (!val){
        console.log((predictionIndex.value + cnt) % 9)
        val = turntable((predictionIndex.value + cnt) % 9,false)
        cnt += 1
        if(cnt > 9){
            console.log("No more moves available")
            break
        }
    }
}
async function clearModelWeights() {
    while (true){
        try {
            await model.pop()
        } catch (error) {
            break
        }
    }
    trainedTimes.value = model.getWeights().length
}
trainedTimes.value = model.getWeights().length
</script>

<template>
    <NModal
            v-model:show="errorModal"
            :mask-closable="true"
            preset="dialog"
            title="Error"
            content="Cannot Execute Operation: Slot is already occupied."
        />
    <NModal
            v-model:show="trainingModal"
            :mask-closable="true"
            preset="dialog"
            title="Results"
            content="Model Training Complete!"
        />
    <NSpace vertical>
        <div class="middle-align">
            <h1>Tic Tac Toe</h1>
            <h3>Powered by Machine Learning</h3>
            <NSpace align="center" justify="center">
                <NSelect v-model:value="iterations" :options="iterationSelection" :consistent-menu-width="false"/>
                <NButton>Set Iteration</NButton>
            </NSpace>
            <br>
            <h4>You are: X</h4>
            <h4>Status: {{isturn ? "X's turn" : "O's turn"}}</h4>
            <h4 class="hidden" id="endgame-msg">{{endmessage}}</h4>
            <h4 id="trained-amount">Trained Times: {{trainedTimes}}; Prediction Index: {{predictionIndex}}</h4>
            <!--<h3 class="hidden warning" id="warning-msg">You cannot fill that spot! It is Occupied.</h3>-->
        </div>
        <main id="main-container">
            <input type="button" id="slot-button" class="slot-button" v-for="(text,index) in bvalues" :key="index" v-model="bvalues[index]" @click="turntable(index);"/>
        </main>
        <NSpace id="config-buttons">
            <NButton @click="resetGame" class="hidden" id="reset-game-button">Reset Game</NButton>
            <NButton @click="trainModel" class="hidden" id="train-model-button">Train Model</NButton>
            <NButton @click="initialize" class="" id="reset-game-button">Initialize Model</NButton>
            <NButton @click="makePrediction" class="" id="ML-predict-button">Make AI Prediction</NButton>
            <NButton @click="clearModelWeights" id="clear-model-button">Clear Model</NButton>
        </NSpace>
    </NSpace>
</template>

<style scoped>
main {
    margin: 10px 10px 10px 10px;
    display: grid;
    grid-template-columns: repeat(3, 50px);
    grid-template-rows: repeat(3, 50px);
    gap: 10px;
    justify-content: center;
}

input[type="button"] {
    margin: 0;
}
.uninteractable{
    pointer-events: none;
}
.warning{
    color: red;
    font-weight: bold;
}
.hidden{
    visibility: hidden;
    display: none;
}
.win-text{
    color: green;
    font-weight: bold;
}
.lose-text{
    color: red;
    font-weight: bold;
}
.tie-text{
    color: #ffb700;
    font-weight: bold;
}
.slot-button{
    font-size: 25px;
    font-weight: bold;
    animation: ease-in-out 0.15s;
    border-width: 0px;
    border-radius: 5px;
    transition: ease-in-out 0.15s;
    background-color: #e0e0e0;
}
.slot-button:hover{
    background-color: rgb(176, 239, 161);
    transition: ease-in-out 0.1s;
    border-width: 2px;
    border-color: rgb(53, 128, 36);
    transform: scale(1.1);
}
.slot-button:active{
    background-color: rgb(176, 239, 161);
    transition: ease-in-out 0.05s;
    transform: scale(0.95);
    border-width: 1px;
    border-color: rgb(53, 128, 36);
}
NButton{
    margin: 10px 10px 10px 10px;
}
.middle-align{
    text-align: center;
}
h1{
    font-size: 50px;
    font-weight: bold;
}
h3{
    font-size: 20px;
    font-weight: bold;
}
h4{
    font-size: 15px;
    font-weight: bold;
}
</style>