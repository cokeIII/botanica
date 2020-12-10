var Observable = require("data/observable")
const httpModule = require("tns-core-modules/http")
var API_URL = "http://10.0.5.7:7777"
var serverImg = "https://rms.chontech.ac.th/server_botanica/plant/"
var pageData = new Observable.fromObject({
  trees: [],
  searchPhrase: "",
  bgColor: true,
  sverPath: serverImg,
})
let page;
exports.pageLoaded = function (args) {
    console.log("pageLoaded")
    page = args.object
    page.bindingContext = pageData
    fetch(API_URL + "/getPlant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    }).then((r) => r.json()).then((response) => {
        console.log(response.data)
        pageData.trees = response.data;
    }).catch((e) => {
        console.log('***fetch error***')
    });

}

exports.onSearchSubmit = function () {

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

