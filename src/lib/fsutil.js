"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by snytkind on 5/7/17.
 */
/**
 * Created by snytkind on 5/4/17.
 */
var os = require('os');
var path = require('path');
var fs = require('fs');
var default_1 = (function () {
    function default_1(base) {
        console.log("ENTERED constructor");
        this.basePath = base;
    }
    default_1.prototype.prepDirs = function (aDirs) {
        var _this = this;
        aDirs.forEach(function (v) {
            console.log(_this.basePath + path.sep + v);
        });
    };
    default_1.prototype.createDir = function (dir) {
        var dirPath = this.basePath + path.sep + dir;
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
        }
        else {
            console.log("Directory already exists: ", dirPath);
        }
    };
    default_1.prototype.createDirs = function (aDirs) {
        var _this = this;
        aDirs.forEach(function (v) {
            _this.createDir(v);
        });
    };
    return default_1;
}());
exports.default = default_1;
