var Observable = require("data/observable")
const httpModule = require("tns-core-modules/http")
var API_URL = "http://192.168.43.50:7777"
var serverImg = "https://rms.chontech.ac.th/server_botanica/plant/"
var BarcodeScanner = require("@la-corp/la-barcodescanner-lib-aar").BarcodeScanner;
var barcodescanner = new BarcodeScanner();
var pageData = new Observable.fromObject({
    trees: [],
})

let page

exports.pageLoaded = function(args) {
    page = args.object
    page.bindingContext = pageData
}

exports.scanData = function() {
    var count = 0;
    barcodescanner.scan({
        formats: "QR_CODE",
        // this callback will be invoked for every unique scan in realtime!
        continuousScanCallback: function(result) {
            count++;
            console.log(result.format + ": " + result.text + " (count: " + count + ")");
            fetch(API_URL + "/searchPlantId", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sKey: result.text + '',
                })
            }).then((r) => r.json()).then((response) => {
                pageData.trees = response.data[0];
                console.log(pageData.trees)
                barcodescanner.stop();
            }).catch((e) => {
                console.log('***fetch error***')
            });

        },
        closeCallback: function() {
            page.frame.navigate({
                moduleName: "qr/qr-item-detail/qr-item-detail-page",
                context: pageData.trees,
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
            console.log("Scanner closed");
        }, // invoked when the scanner was closed
        reportDuplicates: false // which is the default
    }).then(
        function() {
            console.log("We're now reporting scan results in 'continuousScanCallback'");
        },
        function(error) {
            console.log("No scan: " + error);
        }
    );
}
exports.onItemTap = function(args) {
    const view = args.view;
    const page = view.page;
    const tappedItem = view.bindingContext;


}