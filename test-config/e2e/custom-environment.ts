import { DriverContext, createDriverContext } from "./cda-testing-framework/dist/index";
import {WebDriver} from 'selenium-webdriver';
// my-custom-environment
const NodeEnvironment = require('jest-environment-node').TestEnvironment;
import {DriverManager} from '@oracle/oraclejet-webdriver';

export default class CustomEnvironment extends NodeEnvironment {
  testPath: any;
  _driverContext?: DriverContext;
  counter: number;
  constructor(config, context) {
    super(config);
    this.testPath = context.testPath;
  }

  async setup() {
    await super.setup();
    this.counter = 1;
    this.global.setDriver = async (driver)=>{   
        const driverContext =  await createDriverContext(driver);
        this.setDriverContext(driverContext);
        await this.getDriverContext()?.beforeTest(this.testPath, this.counter++);
        
        this.global.releaseDriver = async ()=>{
            
            await driverContext.releaseContext(true);
            //Allow driver to quit
            DriverManager.releaseDriver(driver);
            await new Promise(r=>setTimeout(r,1000));
        }
    }
  }

  private setDriverContext(driverContext: DriverContext) {
    this._driverContext = driverContext;
  }

  async handleTestEvent(event, state) {
    if(this.getDriverContext()){
      
      if(event.name === 'test_fn_start') {
        //await this.getDriverContext().beforeTest(event.test.parent.name, event.test.name);
      }
  
      if(event.name === 'test_done') {  
        //this.setDriverContext(null);
      }
  
      if(event.name === 'test_fn_success'){
        //await this.getDriverContext().releaseContext(true);
      }
      
      if(event.name === 'test_fn_failure'){
        //await this.getDriverContext().releaseContext(false);
      }

    }
   
  }

  private getDriverContext() {
    return this._driverContext;
  }
}