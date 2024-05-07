import { DriverContext, createDriverContext } from "./cda-testing-framework/dist/index";
import {WebDriver} from 'selenium-webdriver';
// my-custom-environment
const NodeEnvironment = require('jest-environment-node').TestEnvironment;
import {DriverManager} from '@oracle/oraclejet-webdriver';
import path from "path";
import { rm } from "fs/promises";

export default class CustomEnvironment extends NodeEnvironment {
  testPath: any;
  _driverContext?: DriverContext;
  counter: number;
  constructor(config, context) {
    super(config);
    this.testPath = context.testPath;
    this.global.testEnvironmentOptions = config.projectConfig.testEnvironmentOptions;
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
        //By this time remote must be ready
        try {
          this.removeReportsForPassedTests(event);
        } catch (error) {
          console.log(error);
        }
      }
  
      if(event.name === 'test_fn_success'){
        //await this.getDriverContext().releaseContext(true);
        
      }
      
      if(event.name === 'test_fn_failure'){
        //await this.getDriverContext().releaseContext(false);
      }

    }
   
  }

  private async removeReportsForPassedTests(event: any) {
    if (event.test.errors.length === 0) {
      const testIndex = event.test.parent.children.indexOf(event.test);
      const testDir = path.dirname(this.testPath);
      const basename = path.basename(this.testPath, '.ts');
      const harReportPath = `${testDir}/__reports__/${basename}/test${testIndex + 1}.har`;
      await rm(harReportPath);
      const logReportPath = `${testDir}/__reports__/${basename}/test${testIndex + 1}.log`;
      await rm(logReportPath);
      const screenshotsReportPath = `${testDir}/__reports__/${basename}/screenshots/test${testIndex + 1}`;
      await rm(screenshotsReportPath, {
        recursive: true
      });
    }
  }

  private getDriverContext() {
    return this._driverContext;
  }
}