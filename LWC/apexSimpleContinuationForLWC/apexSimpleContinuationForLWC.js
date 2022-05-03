import { LightningElement,track } from 'lwc';
import startContinuation from '@salesforce/apexContinuation/ContinuationController.startConinuation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ApexSimpleContinuationForLWC extends LightningElement {
  @track result;
  @track isLoading = false;
  @track repeattimes = 10;
  @track latency = 1000;
  @track waittime = 1500;
  @track count;
  @track resultlabel;
  @track  dataList = [];
  @track  MSG_NODATA = "";
  @track hasData;

  connectedCallback() {
    this.resultlabel = "receievd response payload";
    this.hasData = true;
  }
  
  handleFormInput1Change() {
    this.repeattimes = event.target.value;
  }

  handleFormInput2Change() {
    this.latency = event.target.value;
  }

  handleFormInput3Change() {
    this.waittime = event.target.value;
  }

  async requestProcess() {
    this.dataList = [];
    console.log("@repeat times : " + this.repeattimes);
    let times =parseInt(this.repeattimes, 10);

    for(this.count= 0; this.count< times; this.count++) {
      this.resultlabel = "Long running callout waiting.......";
        this.isLoading = true;
        let counter = this.count + 1;

        console.log("@resultlabel : " + this.resultlabel);

        let random;
        let max = 9;
        random = Math.floor(Math.random() * max) //Finds number between 0 - max

        startContinuation({
          counter : random,
          latency : this.latency
        })
        .then(result => {
              this.resultlabel = "This is the reponse of No. " + counter.toString()+ " request";
              this.hasData = true;
              this.result = result;
              this.isLoading = false;
              const obj = JSON.parse(this.result);
              obj.no = counter;
              this.dataList.push(obj);
        })
        .catch(error => {
            this.hasData = false;
            this.MSG_NODATA = error.body.message;
            this.displayErrorToast(error.body.message);
            this.isLoading = false;

        });

        await new Promise(resolve => setTimeout(resolve, this.waittime));
    }


  }


  displayErrorToast(message) {
    const evt = new ShowToastEvent({
      message: message,
      variant: 'error'
    });
    this.dispatchEvent(evt);
  }
}