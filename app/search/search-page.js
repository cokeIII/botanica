var Observable = require("data/observable")
const httpModule = require("tns-core-modules/http")
var API_URL = "http://192.168.43.50:7777"
var serverImg = "https://rms.chontech.ac.th/server_botanica/plant/"
var pageData = new Observable.fromObject({
    trees: [],
    searchPhrase: "",
    sverPath: serverImg,
    countries : [],
  })


fetch(API_URL + "/getPlant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
}).then((r) => r.json()).then((response) => {
    pageData.trees = response.data
    response.data.forEach(element => {
        pageData.countries.push(element.plant_name)
    });
}).catch((e) => {
    console.log('***fetch error***')
});



let page
let myControl
exports.pageLoaded = function (args) {
    console.log("pageLoaded")
    page = args.object
    page.bindingContext = pageData
    myControl = page.getViewById("myControl")
    fetch(API_URL + "/getProperties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    }).then((r) => r.json()).then((response) => {
        
        pageData.trees.forEach(plantData => {
            plantData.properties = ""
            response.data.forEach(pro => {
                if(pro.plant_id == plantData.plant_id){
                    text = "\t\t"+pro.plant_part+" : "+pro.properties+"\n\t\tข้อควรระวัง :"+pro.caution+"\n\n"
                    plantData.properties+=text
                }
            });
        });  

        console.log(pageData.trees.properties)
    }).catch((e) => {
        console.log(e)
        console.log('***fetch error***')
    });
}

exports.serachData = function () {
    let val = myControl.selectedValue
    fetch(API_URL + "/searchData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sKey: val+'',
        })
    }).then((r) => r.json()).then((response) => {
        console.log(response.data)
        pageData.trees = response.data;
    }).catch((e) => {
        console.log('***fetch error***')
    });
}
exports.onItemTap = function (args) {
    const view = args.view;
    const page = view.page;
    const tappedItem = view.bindingContext;

    page.frame.navigate({
        moduleName: "search/search-item-detail/search-item-detail-page",
        context: tappedItem,
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
}

