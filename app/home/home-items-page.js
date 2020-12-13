var Observable = require("data/observable")
const httpModule = require("tns-core-modules/http")
var API_URL = "http://10.0.5.7:7777"
var serverImg = "https://rms.chontech.ac.th/server_botanica/plant/"
const labelModule = require("tns-core-modules/ui/label")
var bluetooth = require("nativescript-bluetooth")
const appSettings = require("application-settings")
require("nativescript-dom")

var pageData = new Observable.fromObject({
    map:[],
    mapData:{},
    findPlant:[],
})
let oldUUID = "";
const arrayToObject = (array) =>
array.reduce((obj, item) => {
    obj[item.uuid] = item
    return obj
}, {})

fetch(API_URL + "/getMap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
}).then((r) => r.json()).then((response) => {
    console.log(response.data)
    pageData.map = response.data
    appSettings.setString("maps", JSON.stringify(response.data))
    pageData.mapData = arrayToObject(JSON.Stringify(response.data))
}).catch((e) => {
    console.log('***fetch error***')
});

function romoveMap() {
    let mapR = page.getViewById("map")
    viewMap = mapR.getElementsByClassName('point')
    for(let i = 0;i<viewMap.length;i++){
        mapR.removeChild(viewMap[i])
    }
    txtMap = mapR.getElementsByClassName('txt-map')
    for(let i = 0;i<viewMap.length;i++){
        mapR.removeChild(txtMap[i])
    }

}
let map
let page
let findPlant
exports.pageLoaded = function (args) {
    console.log("pageLoaded")
    page = args.object
    page.bindingContext = pageData
    map = page.getViewById("map")
    findPlant = page.getViewById("findPlant")
    if(appSettings.getString("maps")){
        arrMaps = JSON.parse(appSettings.getString("maps"))
        pageData.map = arrMaps
        pageData.mapData = arrayToObject(arrMaps)
    }
    romoveMap()
    if(Object.keys(pageData.map).length !== 0){
        console.log(pageData.map)
        
        pageData.map.forEach(element => {
            genPoint(element.x,element.y,element.uuid,element.name);
        });
    }

    bluetooth.enable().then(
        function(enabled) {
            console.log("enable")
            bluetooth.startScanning({
                serviceUUIDs: [],
                seconds: 5,
                onDiscovered: function (peripheral) {
                    console.log("Periperhal found with UUID: " + peripheral.UUID)
                    checkPoint(peripheral.UUID,peripheral.RSSI,pageData.map)
                },
                skipPermissionCheck: false,
            }).then(function() {
                console.log("scanning complete")
                console.log(pageData.findPlant)
            }, function (err) {
                console.log("error while scanning: " + err)
            })
        }
    )   
}
function checkPoint(UUID,RSSI,maps){
    if(Object.keys(pageData.mapData).length !== 0){
        let youHere = page.getViewById(UUID) 
        if(pageData.mapData[UUID] !== undefined) {
            if(oldUUID){
                youHere = page.getViewById(oldUUID)
                youHere.backgroundColor = "red"
            }
            youHere = page.getViewById(UUID)
            oldUUID = UUID
            youHere.backgroundColor = "green"
            console.log(pageData.mapData[UUID])
            pageData.findPlant.push(pageData.mapData[UUID])
        } else {

        }
    }
}
function genPoint(x,y,id,name){
    let myLabel = new labelModule.Label()
    let myLabelText = new labelModule.Label()

    myLabel.className = "point"
    myLabel.id = id
    myLabel.marginTop = ""+y-5+"%"
    myLabel.marginLeft = ""+x+"%"
    myLabel.style.zIndex="-1"
    myLabelText.text = name
    myLabelText.class = "txt-map"
    myLabelText.marginLeft = ""+x+"%"
    myLabelText.marginTop = ""+(y-5)+"%"
    myLabelText.style.zIndex="-1"
    map.addChild(myLabel)
    map.addChild(myLabelText)
    console.log(map)
}
exports.closeDlg = function (args) {
    findPlant.style.visibility = 'collapsed'
}