<script setup lang="ts">
import {ref} from 'vue'
// @ts-ignore
import {iterationData, iterationLabels} from "@/components/data.ts";
import {NButton, NModal, NSpace, NSelect, NCard, NDivider, NInputNumber, NInputGroup, NSwitch, NInputGroupLabel, NCollapse, NCollapseItem, useLoadingBar, useMessage} from 'naive-ui'
import * as tf from '@tensorflow/tfjs';

const flipX = (arr: any) => {
    // console.log([arr.slice(6), arr.slice(3, 6), arr.slice(0, 3)].flat())
    // let tempArr:Array<number>, stmp = [arr.slice(6), arr.slice(3, 6), arr.slice(0, 3)].flat(), num = 0;
    // for(let i = 0; i < 3; i++){
    //     for(let j = 0; j < 3; j++){
    //         tempArr.push(stmp[i][j])
    //     }
    // }
    return [arr.slice(6), arr.slice(3, 6), arr.slice(0, 3)].flat();
};
const flipY = (arr: any) => flipX(arr.slice().reverse());

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
model.add(tf.layers.dense({units: 64, inputShape: [9], activation: 'relu'}));
model.add(tf.layers.dense({units: 64, activation: 'relu'}));
model.add(tf.layers.dense({units: 9, activation: 'softmax'}));
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

//Training Data Container
const trainingData = ref<number[][]>([]);
const labels = ref<number[][]>([]);
const iterations = ref(1);
const iterationSelection = ref([
    {
        label:"Prefab Model IT 1 (\"Vincent\" Unit 1)",
        value:1
    },
    {
        label:"Prefab Model IT 2 (\"Da Vinci\" Unit 2)",
        value:2
    },
    {
        label:"Prefab Model IT 3 (\"Schrödinger\" Unit 3)",
        value:3
    }
]);
const recognitionMethod = ref(1)
const recogMethodSelection = ref([
    {
        label:"Optimization", //Default: Choosing next to be most-probable tensor array element
        value:1
    },
    {
        label:"Degradation", //Inversed Default: Choosing next to be least-probable tensor array element
        value:2
    },
    {
        label:"Primary Elimination", //Clears all 2s into 0s
        value:3
    },
    {
        label:"Secondary Elimination", //Clears all 1s into 0s
        value:4
    },
    {
        label:"Assimilation", //Assimilate all boardValues into 1
        value:5
    },
    {
        label:"Reverse Assimilation", //Assimilate all boardValues into 2
        value:6
    },
    {
        label:"Aversion", //Invert all boardValues from 1 to 2 and 2 to 1
        value:7
    }
]);
const correctionThreshold = ref(10)
const autoTrainCount = ref(10)
const autoTrainEnabled = ref(false)

async function applyIteration(){
    //tf.disposeVariables()
    iterationSelectBar.value = false;
    applyIterationButton.value = false;
    for (let i = 0; i < iterations.value; i++) {
        //console.log(iterationData.value[i])
        for (let j = 0; j < iterationData.value[i].length; j++) {
            //console.log(iterationData.value[i][j])
            //console.log(flipX(iterationData.value[i][j]))

            recordTrainingData(iterationData.value[i][j])
            recordTrainingData(flipX(iterationData.value[i][j]))
            recordTrainingData(flipY(iterationData.value[i][j]))
            recordTrainingData(flipX(flipY(iterationData.value[i][j])))
            //recordTrainingData(invertRecordData(iterationData.value[i][j]))
        }
        for (let j = 0; j < iterationLabels.value[i].length; j++) {
            //console.log(iterationLabels.value[i][j])
            recordLabelsData(iterationLabels.value[i][j])
            recordLabelsData(flipX(iterationLabels.value[i][j]))
            recordLabelsData(flipY(iterationLabels.value[i][j]))
            recordLabelsData(flipX(flipY(iterationLabels.value[i][j])))
            //recordLabelsData(invertRecordData(iterationLabels.value[i][j]))
        }
    }
    //model.compile({loss: 'categoricalCrossentropy', optimizer: tf.train.adam(learningRate.value), metrics:['accuracy']});
    let tempFlag:boolean = false
    showModal.value = true
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

function recordTrainingData(tmpArr: number[]){
    trainingData.value.push(tmpArr)
}
function recordLabelsData(tmpArr: number[]){
    labels.value.push(tmpArr)
}
function clearTrainingData(){
    trainingData.value = []
}
function clearLabelsData(){
    labels.value = []
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
function invertBoardArray(tmpArr: number[]){
    for(let i = 0; i < tmpArr.length; i++){
        if(tmpArr[i] == 1){
            tmpArr[i] = 2
        }else if(tmpArr[i] == 2){
            tmpArr[i] = 1
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
function turntable(index: number, reportError: boolean = true){
    if(bvalues.value[index] != " "){
        if(reportError) errorModal.value = true
        return false
    }
    prevModelValues.value = modelValues.value // Record board before change occurs
    bvalues.value[index] = isturn.value ? "X" : "O"
    let tempEmpty = [0,0,0,0,0,0,0,0,0]
    tempEmpty[index] = isturn.value ? 1 : 2
    modelValues.value.push(tempEmpty); //Record board after change occurs
    checkEndgame()
    isturn.value = !isturn.value
    return true
}
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
function eliminateBoardElement(element: number){
    let tmpArr = scanBoard()
    for(let i = 0; i < tmpArr.length; i++){
        if(tmpArr[i] == element){
            tmpArr[i] = 0
        }
    }
    return tmpArr
}
const isturn = ref(true)

async function trainModel(announceMessage: boolean = true) {
    let success = false
    loadingBar.start()
    //model.compile({loss: 'categoricalCrossentropy', optimizer: tf.train.adamax(learningRate.value), metrics:['accuracy']});
    if(announceMessage) {
        floatingMessage.info("Training Machine Learning Model...")
    }
    trainingModal.value = false
    document.getElementById("config-buttons")?.classList.add("uninteractable")
    console.log(tf.tensor2d(trainingData.value))
    try {
        await model.fit(tf.tensor2d(trainingData.value), tf.tensor2d(labels.value), {epochs: setEpochs.value, batchSize: batchSize.value, shuffle:true}).then(() => {
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
async function makePrediction() {
    let move, moves: any;
    async function generatePredictionIndex(reCorrect: boolean = true) {
        // Define the game board state
        let gameState;
        //correctionMethod.value = 8
        gameState = tf.tensor([scanBoard()]);
        if (recognitionMethod.value == 3) {
            gameState = tf.tensor([eliminateBoardElement(2)]);
        } else if (recognitionMethod.value == 4) {
            gameState = tf.tensor([eliminateBoardElement(1)]);
        } else if (recognitionMethod.value == 5) {
            gameState = tf.tensor([assimilateBoardArray(1)]);
        } else if (recognitionMethod.value == 6) {
            gameState = tf.tensor([assimilateBoardArray(2)]);
        } else if (recognitionMethod.value == 7) {
            gameState = tf.tensor([invertBoardArray(scanBoard())]);
        }
        // Use the model to predict the next move
        // @ts-ignore
        let outputTensor = await model.predict(gameState).flatten();
        move = recognitionMethod.value == 1 ? await outputTensor.argMax().data()[0] : recognitionMethod.value == 2 ? await outputTensor.argMin().data()[0] : await outputTensor.argMax().data()[0];
        moves = await outputTensor.data();
        let outputArray = Array.from(outputTensor.dataSync());
        console.log(move)
        console.log(moves)
        console.log(outputArray)

        outputTensor.dispose()
        //prediction.value = `(${Math.floor(move / 3)}, ${move % 3})`;
        //console.log(prediction)
    }
    if (!model) return;
    loadingBar.start()
    await generatePredictionIndex()
    let cnt = 0
    while (true){
        let val = turntable(move,false)
        if(val){
            break
        }
        try {
            moves[move] = 0;
        } catch {
            if(cnt > correctionThreshold.value){
                console.log("No more moves available")
                break
            }
        }
        move = moves.indexOf(recognitionMethod.value == 1 ? Math.max(...moves) : recognitionMethod.value == 2 ? Math.min(...moves) : Math.max(...moves));
        cnt += 1
        if(cnt > correctionThreshold.value){
            console.log("No more moves available")
            break
        }
    }
    loadingBar.finish()
}

trainedTimes.value = model.getWeights().length

async function autoTrainData(){
    let tempMValues = ref<number[][]>([]), tempPValues = ref<number[][]>([]);
    for (let cnt = 0; cnt < autoTrainCount.value; cnt++){
        while(matchFinished.value == false) {
            await makePrediction()
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
    await trainDataAfterGame()
    showModal.value = true;
    returnToSelection()
}
async function trainDataAfterGame(){
    for(let i = 0; i < modelValues.value.length;i++){
        recordLabelsData(modelValues.value[i])
        recordLabelsData(flipX(modelValues.value[i]))
        recordLabelsData(flipY(modelValues.value[i]))
        recordLabelsData(flipX(flipY(modelValues.value[i])))
    }
    for(let i = 0; i < prevModelValues.value.length;i++){
        recordTrainingData(prevModelValues.value[i])
        recordTrainingData(flipX(prevModelValues.value[i]))
        recordTrainingData(flipY(prevModelValues.value[i]))
        recordTrainingData(flipX(flipY(prevModelValues.value[i])))
    }
    await trainModel()
    resetGame()
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
        <p>{{tf.tensor2d(trainingData)}}</p>
        <p>Labels:</p>
        <p>{{tf.tensor2d(labels)}}</p>
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
                <NSelect :disabled="!iterationSelectBar" v-model:value="recognitionMethod" :options="recogMethodSelection" :consistent-menu-width="false"/>
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
                <NButton type="primary" @click="trainDataAfterGame" id="train-model-button" v-show="matchFinished">Train Model</NButton>
                <!--<NButton @click="initialize" class="" id="reset-game-button">Initialize Model</NButton>-->
                <NButton type="primary" @click="makePrediction" id="ML-predict-button" v-show="!matchFinished">Make AI Prediction</NButton>
                <!--<NButton @click="clearModelWeights" id="clear-model-button">Clear Model</NButton>-->

                <NButton type="primary" @click="returnToSelection" id="return-to-selection-button">Switch Model</NButton>
            </NSpace>
            <NSpace vertical>
                <h4>You are: O</h4>
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
.slot-button{
    font-size: 25px;
    font-weight: bold;
    animation: ease-in-out 0.15s;
    border-width: 0;
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
.middle-align{
    text-align: center;
}
h1{
    font-size: 50px;
    font-weight: bold;
    margin-bottom: 0;
}
h3{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 0;
}
h4{
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 0;
}
p{
    font-size: 15px;
    margin-bottom: 3px;
    margin-top: 20px;
}
</style>
<!--FrontEnd Code-->
