<script setup lang="ts">
import {defineComponent,reactive,ref} from 'vue'
import {iterationData, iterationLabels} from "./data.ts";
import {NButton, NModal, NSpace, NSelect, NCard, NDivider, NInputNumber, NInputGroup, NSwitch, NInputGroupLabel, NCollapse, NCollapseItem, NInput, NTabs, NTabPane, useLoadingBar, useMessage} from 'naive-ui'
import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';
import axios from 'axios';
import {abs} from "@tensorflow/tfjs";

//Board & Record Arrays
const endmessage = ref("You Tied with the Algorithm!")
const bvalues = ref([" "," "," "," "," "," "," "," "," "])
const modelValues = ref([[0,0,0,0,0,0,0,0,0]])
const prevModelValues = ref([[0,0,0,0,0,0,0,0,0]])
const trainedTimes = ref(0)
const predictionIndex = ref(0)
const setEpochs = ref(100)
const batchSize = ref(32)
const learningRate = ref(0.01)

//Initialize Machine Learning Model
const model = tf.sequential();
model.add(tf.layers.dense({units: 9, inputShape: [9], activation: 'relu'}));
model.add(tf.layers.dense({units: 9, inputShape: [9], activation: 'softmax'}));
model.add(tf.layers.dense({units: 9, inputShape: [9], activation: 'elu'}));
model.add(tf.layers.dense({units: 9, inputShape: [9], activation: 'relu'}));
model.compile({loss: 'categoricalCrossentropy', optimizer: tf.train.adamax(learningRate.value), metrics:['accuracy']});

//Modals
const errorModal = ref(false)
const trainingModal = ref(false)
const showModal = ref(false)

//Contents
const applyIterationButton = ref(true)// true = enabled, false = disabled; These values are inverted on input at the template section.
const iterationSelectBar = ref(true)
const mainContent = ref(false)
const matchFinished = ref(false)

//Loading bar
const loadingBar = useLoadingBar()
const floatingMessage = useMessage()

function getRoundRobinIndex(){
    let index = 0
    if (indexRotation.value == false) {
        index = 0
        indexRotation.value = true
    } else {
        index = 1
        indexRotation.value = false
    }
    return index
}

//Training Data Container
const indexRotation = ref(false)
const trainingData = ref([]);
const labels = ref([]);
const iterations = ref(1);
const iterationSelection = ref([
    {
        label:"Model Iteration 1 (\"Vincent\" Epoch 1)",
        value:1
    },
    {
        label:"Model Iteration 2 (\"Da Vinci\" Epoch 2)",
        value:2
    },
    {
        label:"Model Iteration 3 (\"Xander\" Epoch 3)",
        value:3
    },
    {
        label:"Model Iteration 4 (\"Atomic\" Epoch 4)",
        value:4
    },
    {
        label:"Model Iteration 5 (\"Watson\" Epoch 5)",
        value:5
    },
    {
        label:"Model Iteration 6 (\"Bohr\" Epoch 6)",
        value:6
    },
    {
        label:"Model Iteration 7 (\"Schrödinger\" Epoch 7)",
        value:7
    }
]);
const correctionMethod = ref(1)
const correctionMethodSelect = ref([
    {
        label:"Accumulation", //Accumulative Index Selection Method
        value:1
    },
    {
        label:"Recursion", //Recursive Index Selection Method
        value:5
    },
    {
        label:"Round Robin", //Rotational Index Selection Method
        value:6
    },
    {
        label:"Russian Roulette", //Random Selection Selection Method
        value:7
    },
    {
        label:"Assimilation", //Assimilate all boardValues into 1
        value:2
    },
    {
        label:"Reverse Assimilation", //Assimilate all boardValues into 2
        value:3
    },
    {
        label:"Aversion", //Inverse all boardValues from 1 to 2 and 2 to 1
        value:4
    }
]);
const correctionThreshold = ref(10)
const autoTrainCount = ref(100)
const autoTrainEnabled = ref(false)

async function applyIteration(){
    iterationSelectBar.value = false;
    applyIterationButton.value = false;
    for (let i = 0; i < iterations.value; i++) {
        //console.log(iterationData.value[i])
        for (let j = 0; j < iterationData.value[i].length; j++) {
            //console.log(iterationData.value[i][j])
            recordTrainingData(iterationData.value[i][j])
            //recordTrainingData(invertRecordData(iterationData.value[i][j]))
        }
        for (let j = 0; j < iterationLabels.value[i].length; j++) {
            recordLabelsData(iterationLabels.value[i][j])
            //recordLabelsData(invertRecordData(iterationLabels.value[i][j]))
        }
    }
    let tempFlag:boolean = false
    try{
        iterationSelectBar.value = false;
        applyIterationButton.value = false;
        floatingMessage.info("Synchronizing Iteration Data...")
        tempFlag = await trainModel(false)
    }catch (e) {
        iterationSelectBar.value = true;
        applyIterationButton.value = true;
        floatingMessage.error("An Unexpected Error occurred returning the message: " + e)
        return false
    }
    if(tempFlag) {
        floatingMessage.success("Synchronized Iteration Data Successfully!")
        mainContent.value = true;
        matchFinished.value = false;
        if(autoTrainEnabled.value){
            console.log("Using Auto Train")
            autoTrainData()
        }
        return true
    }else{
        iterationSelectBar.value = true;
        applyIterationButton.value = true;
        floatingMessage.error("Unable to synchronize Iteration Data.")
        mainContent.value=false;
        return false
    }
}
function returnToSelection(){
    iterationSelectBar.value = true;
    applyIterationButton.value = true;
    //floatingMessage.error("Unable to synchronize Iteration Data.")
    mainContent.value = false;
    clearTrainingData()
    clearLabelsData()
    resetGame()
}

function recordTrainingData(tmpArr){
    trainingData.value.push(tmpArr)
}
function recordLabelsData(tmpArr){
    labels.value.push(tmpArr)
}
function clearTrainingData(){
    trainingData.value = []
}
function clearLabelsData(){
    labels.value = []
}
function invertRecordData(recordArr){
    let tempArr = recordArr
    for (let i = 0; i < tempArr.length; i++){
        tempArr[i] = invertBoardArray(tempArr[i])
    }
    return tempArr
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
    matchFinished.value = true
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
    for(let i = 0; i < tmpArr.length; i++){
        if(tmpArr[i] == 1){
            tmpArr[i] = 2
        }else if(tmpArr[i] == 2){
            tmpArr[i] = 1
        }
    }
    return tmpArr
}
function assimilateDataArray(assimilateRef:number, tmpArr){
    for(let i = 0; i < tmpArr.length; i++){
        if(tmpArr[i] != 0){
            tmpArr[i] = assimilateRef
        }
    }
    return tmpArr
}
function assimilateBoardArray(referenceIndex:number){
    let tmpArr = scanBoard()
    for(let i = 0; i < tmpArr.length; i++){
        if(tmpArr[i] != 0){
            tmpArr[i] = referenceIndex
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
    return true
}
/*
function writeModel(){
    showModal.value = true
    let it7Data = JSON.parse(fs.readFileSync('data.json','utf-8'));
    it7Data.push({
        "trainingData": prevModelValues.value,
        "labelsData": modelValues.value
    })
    axios.post("/path/to/data.json",it7Data)
        .then(response =>{
            console.log(response)
        })
        .catch(error =>{
            console.log(error)
        })
    fs.writeFileSync('data.json',JSON.stringify(it7Data))
}

function readModel(){
    let it7Data;
    axios.get("/path/to/data.json")
        .then(response =>{
            it7Data = JSON.parse(response.data);
            for(let i = 0; i < it7Data.length; i++){
                for(let j = 0; j < it7Data[i].trainingData.length; j++){
                    iterationData.value[6].push(it7Data[i].trainingData[j])
                    iterationLabels.value[6].push(it7Data[i].labelsData[j])
                }
            }
        })
        .catch(error =>{
            console.log(error)
        })
    return it7Data
}
readModel()
*/
function resetGame(){
    for (let i = 0; i < bvalues.value.length; i++) {
        bvalues.value[i] = " "
    }
    for(let i = 0; i < modelValues.value.length; i++){
        modelValues.value.pop()
    }
    for(let i = 0; i < prevModelValues.value.length; i++){
        prevModelValues.value.pop()
    }
    matchFinished.value = false
    document.getElementById("main-container")?.classList.remove("uninteractable")
    isturn.value = true
}
const isturn = ref(true)

async function trainModel(announceMessage: boolean = true) {
    let success = false
    loadingBar.start()
    model.compile({loss: 'categoricalCrossentropy', optimizer: tf.train.adamax(learningRate.value), metrics:['accuracy']});
    if(announceMessage) {
        floatingMessage.info("Training Machine Learning Model...")
    }
    trainingModal.value = false
    document.getElementById("config-buttons")?.classList.add("uninteractable")
    console.log(trainingData.value)
    try {
        await model.fit(tf.tensor2d(trainingData.value), tf.tensor2d(labels.value), {epochs: setEpochs.value, batchSize: batchSize.value}).then(() => {
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
const genrateRandomNumber = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makePrediction() {
    function generatePredictionIndex(reCorrect:boolean = false) {
        // Define the game board state
        let gameState;
        //correctionMethod.value = 2
        if (correctionMethod.value == 1 && !reCorrect) {
            gameState = tf.tensor2d([scanBoard()]);
        } else {
            if(reCorrect){
                if (correctionMethod.value == 2) {
                    gameState = tf.tensor2d([assimilateBoardArray(1)]);
                } else if (correctionMethod.value == 3) {
                    gameState = tf.tensor2d([assimilateBoardArray(2)]);
                } else if (correctionMethod.value == 4) {
                    gameState = tf.tensor2d([invertBoardArray(scanBoard())]);
                }
            } else {
                gameState = tf.tensor2d([scanBoard()]);
            }
        }
        // Use the model to predict the next move
        let outputTensor = model.predict(gameState) as tf.Tensor;
        let outputArray = Array.from(outputTensor.dataSync());
        predictionIndex.value = outputArray.indexOf(Math.max(...outputArray));

        prediction.value = `(${Math.floor(predictionIndex.value / 3)}, ${predictionIndex.value % 3})`;
        console.log(prediction)
    }
    if (!model) return;

    generatePredictionIndex()
    let val = turntable(predictionIndex.value,false)
    let cnt = 0
    while (!val){
        if(correctionMethod.value == 1) {
            //console.log((predictionIndex.value + cnt) % 9)
            val = turntable((predictionIndex.value + cnt) % 9, false)
        }else if(correctionMethod.value == 5) {
            //console.log((predictionIndex.value + cnt) % 9)
            val = turntable(abs(predictionIndex.value - cnt) % 9, false)
        }else if(correctionMethod.value == 6){
            for(let i = 0; i < 2; i++){
                val = turntable(abs(predictionIndex.value + cnt * getRoundRobinIndex()) % 9, false)
            }
            val = turntable((predictionIndex.value + cnt) % 9, false)
        }else if (correctionMethod.value == 7){
            val = turntable(abs(predictionIndex.value + genrateRandomNumber(-cnt, cnt)) % 9, false)
        }else{
            generatePredictionIndex(true)
            //console.log((predictionIndex.value + cnt) % 9)
            val = turntable((predictionIndex.value + cnt) % 9, false)
        }

        cnt += 1
        if(cnt > correctionThreshold.value){
            console.log("No more moves available")
            break
        }
    }
}

trainedTimes.value = model.getWeights().length

function autoTrainData(){
    let tempMValues = ref([]), tempPValues = ref([]);
    for (let cnt = 0; cnt < autoTrainCount.value;cnt++){
        while(matchFinished.value == false) {
            makePrediction()
        }
        for(let i = 0; i < modelValues.value.length;i++){
            tempMValues.value.push(modelValues.value[i])
        }
        for(let i = 0; i < prevModelValues.value.length;i++){
            tempPValues.value.push(prevModelValues.value[i])
        }
        resetGame()
        console.log("Match Finished")
    }
    for(let i = 0; i < tempMValues.value.length; i++){
        modelValues.value.push(tempMValues.value[i])
        prevModelValues.value.push(tempPValues.value[i])
    }
    showModal.value = true;
    returnToSelection()
}
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
    <NModal
            v-model:show="showModal"
            :mask-closable="true"
            preset="dialog"
            title="Current Model"
    >
        <p>Training Data:</p>
        <p>{{modelValues}}</p>
        <p>Labels:</p>
        <p>{{prevModelValues}}</p>
    </NModal>
    <NSpace vertical class="middle-align">

        <!--Title Space-->
        <div class="middle-align">
            <h1>Tic Tac Toe</h1>
            <h3>Powered by Machine Learning</h3>
        </div>
        <NDivider/>
        <!--Selection Space-->
        <NCard title="Preset Options" class="middle-align" v-if="mainContent === false" size="medium" style="width: 650px;">
            <p>Iteration Model</p>
            <NSelect :disabled="!iterationSelectBar" v-model:value="iterations" :options="iterationSelection" :consistent-menu-width="false"/>
            <br>
            <NInputGroup>
                <NInputNumber
                    :disabled="!iterationSelectBar"
                    v-model:value="setEpochs"
                    placeholder="Epochs"
                    :min="100"
                    :max="5000"
                />
                <NInputGroupLabel>Epochs</NInputGroupLabel>
                <NInputNumber
                    :disabled="!iterationSelectBar"
                    v-model:value="batchSize"
                    placeholder="Batch Size"
                    :min="24"
                    :max="256"
                />
                <NInputGroupLabel>Batch Size</NInputGroupLabel>
                <NInputNumber
                    :disabled="!iterationSelectBar"
                    v-model:value="learningRate"
                    placeholder="Learning Rate"
                    :precision="2"
                    :min="0.01"
                    :max="1"
                />
                <NInputGroupLabel>Learning Rate</NInputGroupLabel>
            </NInputGroup>
            <p>Model Correction</p>
            <NInputGroup>
                <NSelect :disabled="!iterationSelectBar" v-model:value="correctionMethod" :options="correctionMethodSelect" :consistent-menu-width="false"/>
                <NInputGroupLabel>Method</NInputGroupLabel>
                <NInputNumber
                    :disabled="!iterationSelectBar"
                    v-model:value="correctionThreshold"
                    placeholder="Correction Threshold"
                    :min="10"
                    :max="50"
                    :style="{ width: '20%'}"
                />
                <NInputGroupLabel>Trials</NInputGroupLabel>
            </NInputGroup>
            <br>
            <br>
            <NSwitch v-model:value="autoTrainEnabled">
                <template #checked>
                    Automatic Training Enabled
                </template>
                <template #unchecked>
                    Automatic Training Disabled
                </template>
            </NSwitch>
            <br>
            <p v-show="autoTrainEnabled">Training Count</p>
            <NInputNumber
                v-show="autoTrainEnabled"
                :disabled="!iterationSelectBar"
                v-model:value="autoTrainCount"
                placeholder="Train Counts"
                :min="50"
                :max="500"
            />
            <br>
            <NButton class="middle-align" style="margin-right: 5px;" type="primary" :disabled="!applyIterationButton" @click="applyIteration">Train Iteration</NButton>
        </NCard>

        <!--Main Space-->
        <NSpace id="mainContent" vertical v-else>
            <NSpace id="config-buttons">
                <NButton type="primary" @click="resetGame" id="reset-game-button" v-show="matchFinished">Reset Game</NButton>
                <NButton type="primary" @click="trainModel" id="train-model-button" v-show="matchFinished">Train Model</NButton>
                <!--<NButton @click="initialize" class="" id="reset-game-button">Initialize Model</NButton>-->
                <NButton type="primary" @click="makePrediction" id="ML-predict-button" v-show="!matchFinished">Make AI Prediction</NButton>
                <!--<NButton @click="clearModelWeights" id="clear-model-button">Clear Model</NButton>-->

                <NButton type="primary" @click="returnToSelection" id="return-to-selection-button">Switch Model</NButton>
            </NSpace>
            <NSpace vertical>
                <h4>You are: X</h4>
                <h4>Status: {{isturn ? "X's turn" : "O's turn"}}</h4>
                <h4 class="" id="endgame-msg" v-show="matchFinished">{{endmessage}}</h4>
                <h4 id="trained-amount">Trained Times: {{trainedTimes}}; Prediction Index: {{predictionIndex}}</h4>
            </NSpace>
            <main id="main-container">
                <input type="button" id="slot-button" class="slot-button" v-for="(text,index) in bvalues" :key="index" v-model="bvalues[index]" @click="turntable(index);"/>
            </main>
            <NSpace>
                <NCollapse>
                    <NCollapseItem title="Training Model Data" name="1">
                        <p>{{modelValues}}</p>
                    </NCollapseItem>
                    <NCollapseItem title="Labels Model Data" name="2">
                        <p>{{prevModelValues}}</p>
                    </NCollapseItem>
                </NCollapse>
            </NSpace>
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
NSwitch{
    margin: 10px 10px 10px 10px;
}
.widened-card{
    padding: 0px 50px 10px 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    justify-items: center;
}
.widened-tabs{
    width: 150%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    justify-items: center;
}
.middle-align{
    text-align: center;
}
h1{
    font-size: 50px;
    font-weight: bold;
    margin-bottom: 0px;
}
h3{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 0px;
}
h4{
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 0px;
}
p{
    font-size: 15px;
    margin-bottom: 3px;
    margin-top: 20px;
}
</style>