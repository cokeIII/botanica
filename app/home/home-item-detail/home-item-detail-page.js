let sverPath = "https://rms.chontech.ac.th/server_botanica/plant/"
exports.onNavigatingTo = function(args) {
    const page = args.object;
    args.context.sverPath =sverPath
    page.bindingContext = args.context;
}
exports.onBackButtonTap = function (args) {
    const view = args.object;
    const page = view.page;

    page.frame.goBack();
}