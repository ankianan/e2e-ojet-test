import ICollector from "../BaseCollector";
import LogInspector from "selenium-webdriver/bidi/logInspector";
import BaseCollector from "../BaseCollector";
import { writeFile } from "../../../util/writeFile";
export class LogCollector extends BaseCollector implements ICollector {
    collector: any;
    testParentName: string;
    testName: string;
    logs = [];
    async #startLogCollector() {
        const inspector = await LogInspector(this.driver);
        await inspector.onLog((log) =>{
            this.logs.push(this.formatLogs(log))
        });
        return inspector;
    }
    
    private formatLogs(log): any {
        return `${log.type}: [${log.level}] ${log.text}`;
    }

    async beforeTest(testParentName: string, testName: string) {
        await super.beforeTest(testParentName, testName);
        this.collector = await this.#startLogCollector()
    }
    
    async afterTest(passed: boolean) {
        await this.collector.close();
        if(!passed){
            const filePath = this.getFilePath('logs', '.log')
            const data = this.logs.join('\n');
            writeFile(filePath, data);
        }
    }
}