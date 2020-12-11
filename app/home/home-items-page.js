var Observable = require("data/observable")
const httpModule = require("tns-core-modules/http")
var API_URL = "http://10.0.5.7:7777"
var serverImg = "https://rms.chontech.ac.th/server_botanica/plant/"
const labelModule = require("tns-core-modules/ui/label")
require("nativescript-dom")

var pageData = new Observable.fromObject({
    map:[],
})
fetch(API_URL + "/getMap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
}).then((r) => r.json()).then((response) => {
    pageData.map = response.data;
}).catch((e) => {
    console.log('***fetch error***')
});

function romoveMap() {
    mapR = page.getViewById("map")
    viewMap = mapR.getElementsByClassName('point')
    for(let i = 0;i<viewMap.length;i++){
        mapR.removeChild(viewMap[i])
    }
    txtMap = mapR.getElementsByClassName('txt-map')
    for(let i = 0;i<viewMap.length;i++){
        mapR.removeChild(txtMap[i])
    }

}

exports.pageLoaded = function (args) {
    console.log("pageLoaded")
    page = args.object
    page.bindingContext = pageData
    map = page.getViewById("map")
    romoveMap()
    if(Object.keys(pageData.map).length !== 0){
        console.log(pageData.map)
        
        pageData.map.forEach(element => {
            genPoint(element.x,element.y,element.uuid,element.name);
        });
    }
    // viewMap = map.getElementsByClassName('point')
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
    map.addChild(myLabel)
    map.addChild(myLabelText)
    console.log(map)
}