import ojwd, {DriverManager} from '@oracle/oraclejet-webdriver';
import { appendFile, writeFile } from 'fs/promises';
import { WebDriver } from 'selenium-webdriver';
import LogInspector from "selenium-webdriver/bidi/logInspector";
import { getBrowsingContextId } from './driverContext/helpers/collector/harCollector/HarCollector';


const JEST_TIMEOUT = 30000;
jest.setTimeout(JEST_TIMEOUT);





