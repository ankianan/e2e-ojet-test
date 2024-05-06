import path$1 from 'path';
import { adapters } from 'bidi-har-export';
import { ScreenshotManager } from '@oracle/oraclejet-webdriver';
import { mkdir } from 'fs/promises';

class BaseCollector {
    driver;
    baseName;
    testDir;
    constructor(driver) {
        this.driver = driver;
    }
    testPath;
    counter;
    collector;
    afterTest(passed) {
        throw new Error("Method not implemented.");
    }
    async beforeTest(testPath, counter) {
        this.testPath = testPath;
        this.baseName = `${this.getBaseName(testPath)}`;
        this.testDir = `${path$1.dirname(testPath)}`;
        this.counter = counter;
    }
    getBaseName(testPath) {
        return path$1.basename(testPath, '.ts');
    }
    getFilePath(filename, extention) {
        const reportsPath = this.getReportsPath();
        return `${reportsPath}/${filename}${this.counter}${extention}`;
    }
    getReportsPath() {
        return `${this.testDir}/__reports__/${this.baseName}`;
    }
}

require('node:fs');
const fspromise = require('node:fs/promises');
const path = require('node:path');

async function writeFile(filePath, data) {
    const dirpath = path.dirname(filePath);
    await fspromise.mkdir(dirpath, { recursive: true });
    await fspromise.writeFile(path.resolve(filePath), data);
}

async function appendFile(filePath, data) {
    const dirpath = path.dirname(filePath);
    await fspromise.mkdir(dirpath, { recursive: true });
    await fspromise.appendFile(path.resolve(filePath), data);
}

const LogInspector = require("selenium-webdriver/bidi/logInspector");
class LogCollector extends BaseCollector {
    constructor(driver) {
        super(driver);
        this.collector = LogInspector(driver);
    }
    formatLog(log) {
        return `${log.type}: [${log.level}] ${log.text}\n`;
    }
    async beforeTest(testPath, counter) {
        await super.beforeTest(testPath, counter);
        const logInspector = await this.collector;
        await logInspector.onLog(log => {
            //Don't buffer, write directly to file
            appendFile(this.getFilePath('test', '.log'), this.formatLog(log));
        });
    }
    async afterTest(passed) {
        const logInspector = await this.collector;
        await logInspector.close();
    }
}

class HarCollector extends BaseCollector {
    constructor(driver) {
        super(driver);
        this.collector = this.#startHardRecording();
    }
    async beforeTest(testPath, counter) {
        await super.beforeTest(testPath, counter);
        await this.collector;
    }
    async afterTest(passed) {
        const harRecorder = await this.collector;
        const harExport = await harRecorder.stopRecording();
        const data = JSON.stringify(harExport, null, "  ");
        const filePath = this.getFilePath('test', '.har');
        await writeFile(filePath, data);
    }
    async #startHardRecording() {
        const id = await getBrowsingContextId(this.driver);
        const harRecorder = new adapters.SeleniumBiDiHarRecorder({
            driver: this.driver,
            browsingContextIds: [id],
        });
        await harRecorder.startRecording();
        return harRecorder;
    }
}
async function getBrowsingContextId(driver) {
    return await driver.getWindowHandle();
}

class ScreenshotCollector extends BaseCollector {
    constructor(driver) {
        super(driver);
        this.collector = null;
    }
    async #takeAndSaveScreenShot() {
        if (this.testPath && this.counter) {
            return this.collector.takeAndSaveScreenShot(this.driver, "image");
        }
    }
    async beforeTest(testPath, counter) {
        await super.beforeTest(testPath, counter);
        await mkdir(this.getReportsPath(), { recursive: true });
        const scm = this.collector = ScreenshotManager.create(this.getReportsPath());
        scm.beforeTest('', `test${counter}`);
    }
    async afterTest(passed) {
        await this.#takeAndSaveScreenShot();
    }
}

class Collectors {
    driver;
    logCollector;
    harCollector;
    screenshotCollector;
    constructor(context) {
        this.driver = context.driver;
        this.logCollector = new LogCollector(this.driver);
        this.harCollector = new HarCollector(this.driver);
        this.screenshotCollector = new ScreenshotCollector(this.driver);
    }
    async releaseCollectors(passed) {
        await this.logCollector.afterTest(passed);
        await this.harCollector.afterTest(passed);
        await this.screenshotCollector.afterTest(passed);
    }
    async beforeTest(testPath, counter) {
        await this.logCollector.beforeTest(testPath, counter);
        await this.harCollector.beforeTest(testPath, counter);
        await this.screenshotCollector.beforeTest(testPath, counter);
    }
}
class DriverContext {
    driver;
    logCollector;
    harCollector;
    screenshotCollector;
    isReleased = false;
    collectors;
    constructor(driver) {
        this.driver = driver;
        this.collectors = new Collectors(this);
    }
    async beforeTest(testPath, counter) {
        await this.collectors.beforeTest(testPath, counter);
    }
    async releaseContext(passed) {
        await this.collectors.releaseCollectors(passed);
        this.isReleased = true;
    }
}
async function createDriverContext(driver) {
    return new DriverContext(driver);
}

export { DriverContext, createDriverContext };
