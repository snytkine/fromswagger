#!/usr/bin/env node

let path = process.cwd();
import {Fsutil} from './fsutil';
console.log("PATH: ", path);
console.log("CP1");

let o = new Fsutil(path);
console.log("CP2");
let aDirs = ["Controllers", "Models"];
o.prepDirs(aDirs);
o.createDirs(aDirs);
console.log("CLI FINISHED");

