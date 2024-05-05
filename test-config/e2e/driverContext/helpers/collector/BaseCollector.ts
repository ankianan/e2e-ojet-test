import ICollector from "./CollectorInterface";
import {WebDriver} from 'selenium-webdriver';
export default class BaseCollector implements ICollector {
    driver: WebDriver;
    constructor(driver:WebDriver){
        this.driver  = driver;
    }
    testParentName: string;
    testName: string;
    collector: any;
    afterTest(passed: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async beforeTest(testParentName: string, testName: string) {
        this.testParentName = testParentName;
        this.testName = testName;
    }
    static getRootLocation(){
        return "e2e/reports"
    }
    getFilePath(bucket: string, extention: string): string {
        return `${BaseCollector.getRootLocation()}/${bucket}/${this.testParentName}/${this.testName}.${extention}`;
    }
}