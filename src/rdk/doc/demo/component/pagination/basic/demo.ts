import { Component } from "@angular/core";

@Component({
  templateUrl: 'demo.html'
})
export class PaginationBasicDemoComponent {
    public getCurrentPage(message:any){
        console.log("switch message is: "+message);
    }
    public getPageSize(message:any){
        console.log("switch message is: "+message);
    }
}
