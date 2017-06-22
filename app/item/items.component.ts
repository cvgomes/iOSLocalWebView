import { Component, OnInit }    from "@angular/core";
import { Page }                 from "ui/page";
import { WebView }              from "ui/web-view";
import { WebViewInterface }     from "nativescript-webview-interface";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {

    public webView:WebView;
    public wvi:WebViewInterface;

    constructor(private page: Page) { }

    ngOnInit(): void {
        this.initWebView();
    }

    public initWebView(){
        this.webView = <WebView>this.page.getViewById("webView");
        this.wvi = new WebViewInterface(this.webView, "~/webviews/map/map.html");
        
        //initializes map as soon as webview is ready
        this.webView.on('loadFinished', this.onWebviewLoaded.bind(this));
        
    }

        /**
     * Actions to be taken when Webview is loaded
     * Center the map
     */
    public onWebviewLoaded(args){
        console.log(args.error);
    }
}
