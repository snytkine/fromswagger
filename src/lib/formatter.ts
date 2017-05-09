/**
 * Created by snytkind on 5/8/17.
 */
import * as path from 'path';
import * as fs from 'fs';

import {processString, Options, Result} from "typescript-formatter";


export class Formatter {

    options: Options;

    constructor(private readonly basePath: string) {
        const tsconfigPath = path.join(basePath, 'tsconfig.json');
        console.log("In Formatter Constructor. Tsconfig path=",tsconfigPath);

        this.options = {
            dryRun: false,
            replace: true,
            verify: false,
            tsconfig: true,
            tslint: true,
            editorconfig: true,
            tsfmt: true,
            tsconfigFile: tsconfigPath,
            tslintFile: null,
            vscode: null,
            tsfmtFile: null
        }
    }


    formatAndSaveIfNotExist(relativePath: string, code: string): Promise<Result> {
        console.log("Entered formatAndSaveIfNotExist with relativePath=", relativePath);
        const fullPath = path.resolve(this.basePath, relativePath);
        console.log('in formateAndSaveIfNotExists working on file ', fullPath);
        if (fs.existsSync(fullPath)) {
            const e = `formateAndSaveIfNotExists Error::File Already Exists ${fullPath}`;
            console.error(e);
            return Promise.reject(e)
        } else {
            return processString(fullPath, code, this.options);
        }

    }
}