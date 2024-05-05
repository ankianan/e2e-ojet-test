import ICollector from '../BaseCollector';
import { writeFile } from '../../../util/writeFile';
import path from 'path';
import { WebDriver } from 'selenium-webdriver';
import { adapters } from "bidi-har-export";
import BaseCollector from '../BaseCollector';

export class HarCollector extends BaseCollector implements ICollector {
    collector: any;
    testParentName: string;
    testName: string;
    async beforeTest(testParentName: string, testName: string){
        await super.beforeTest(testParentName, testName);
        this.collector = await this.#startHardRecording()
    }
    async afterTest(passed: boolean) {
        const harExport = await this.collector.stopRecording();
        if(!passed){
            const data = JSON.stringify(harExport, null, "  ");
            const filePath = this.getFilePath('har', '.har');
            writeFile(filePath, data);
        }
    }
    async #startHardRecording() {
        const id = await getBrowsingContextId(this.driver);
        const harRecorder = new adapters.SeleniumBiDiHarRecorder({
            driver: this.driver,
            browsingContextIds: [id],
        });
        await harRecorder.startRecording();
    
        return harRecorder
    }
}

export async function getBrowsingContextId(driver: WebDriver) {
    return await driver.getWindowHandle();
}

