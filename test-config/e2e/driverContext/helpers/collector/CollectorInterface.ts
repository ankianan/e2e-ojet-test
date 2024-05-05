
export default interface ICollector{
    testParentName: string;
    testName: string
    collector: any;
    beforeTest(testParentName:string, testName: string): Promise<void>;
    afterTest(passed: boolean): Promise<void>;
    getFilePath(bucket: string, extention: string): string
}
