import { DriverContext, createDriverContext } from "./driverContext/DriverContext";
import {WebDriver} from 'selenium-webdriver';
// my-custom-environment
import NodeEnvironment = require('jest-environment-node');

export default class CustomEnvironment extends NodeEnvironment.TestEnvironment {
  testPath: any;
  private _driverContext: DriverContext | undefined;
  //@ts-ignore
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
  }

  async setup() {
    await super.setup();
    this.global.setDriver = async (driver:WebDriver)=>{
      const driverContext =  await createDriverContext(driver);
      this.setDriverContext(driverContext);
    }
    this.global.getDriver = ()=>{
      return this.getDriverContext()?.driver;
    }
  }

  private setDriverContext(driverContext: DriverContext) {
    this._driverContext = driverContext;
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }

  async handleTestEvent(event, state) {
    if(this.getDriverContext()){
      
      if(event.name === 'test_fn_start') {
        await this.getDriverContext()?.beforeTest(event.test.parent.name, event.test.name);
      }
  
      if(event.name === 'test_done') {  
        //this.setDriverContext(null);
      }
  
      if(event.name === 'test_fn_success'){
        await this.getDriverContext()?.releaseContext(true);
      }
      
      if(event.name === 'test_fn_failure'){
        await this.getDriverContext()?.releaseContext(false);
      }

    }
   
  }

  private getDriverContext() {
    return this._driverContext;
  }
}