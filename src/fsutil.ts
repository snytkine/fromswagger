/**
 * Created by snytkind on 5/7/17.
 */
/**
 * Created by snytkind on 5/4/17.
 */
const os = require('os');
const path = require('path');
const fs = require('fs');

export class Fsutil {

    basePath:string;

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
        let dirPath = this.basePath + path.sep + dir;
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
}

