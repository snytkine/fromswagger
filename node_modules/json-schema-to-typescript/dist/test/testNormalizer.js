"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var fs_1 = require("fs");
var lodash_1 = require("lodash");
var path_1 = require("path");
var normalizer_1 = require("../src/normalizer");
var reporter_1 = require("./reporter");
var normalizerDir = __dirname + '/../../test/normalizer';
function run() {
    fs_1.readdirSync(normalizerDir)
        .filter(function (_) { return /^.*\.json$/.test(_); })
        .map(function (_) { return path_1.join(normalizerDir, _); })
        .map(function (_) { return [_, require(_)]; })
        .forEach(function (_a) {
        var filename = _a[0], json = _a[1];
        var params = { filename: filename };
        ava_1.test(json.name, function (t) {
            return reporter_1.compare(t, json.name, lodash_1.template(toString(normalizer_1.normalize(json.in, filename)))(params), lodash_1.template(toString(json.out))(params));
        });
    });
}
exports.run = run;
function toString(json) {
    return JSON.stringify(json, null, 2);
}
//# sourceMappingURL=testNormalizer.js.map