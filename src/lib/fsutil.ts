/**
 * Created by snytkind on 5/7/17.
 */
/**
 * Created by snytkind on 5/4/17.
 */
const os = require('os');
const path = require('path');
const fs = require('fs');
const util = require('util');

export class Fsutil {

    basePath: string;

    constructor(base) {
        console.log("ENTERED constructor");
        this.basePath = base;
    }

    prepDirs(aDirs) {
        aDirs.forEach(v => {
            console.log(this.basePath + path.sep + v)
        })
    }


    createDir(dir) {
        let dirPath = path.join(this.basePath, dir);
        if (!fs.existsSync(dirPath)) {
            console.log("Directory does not exist ", dirPath);
            fs.mkdirSync(dirPath);

            //
            if (!fs.existsSync(dirPath)) {
                console.log("Failed to create directory: ", dirPath);
            }
            else {
                console.log("Directory created: ", dirPath);
            }
        } else {
            console.log("Directory already exists: ", dirPath);
        }
    }

    createDirs(aDirs) {

        aDirs.forEach(v => {
            this.createDir(v)
        })
    }


    createFileIfNotExists(path: string, content: string): boolean {
        if (fs.existsSync(path)) {
            console.error("File already exists at path=", path);
            return false
        } else {
            try {
                fs.writeFileSync(path, content);
            } catch (e) {
                console.error("Error creating file at path=", path, " Error: ", util.inspect(e));
                return false;
            }

            if (!fs.existsSync(path)) {
                console.error("Failed to create file at path=", path);
                return false
            }
        }

        return true;
    }
}

