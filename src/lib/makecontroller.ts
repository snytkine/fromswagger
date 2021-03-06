/**
 * Created by snytkind on 5/9/17.
 */
import {IControllerDetails, IMethodDetails, SwaggerObject} from './interfaces'
import {Formatter} from './formatter';
import {
  makeController,
  parsePathItem,
  parsePathElement,
  groupMethodDetailsByController,
  adjustComprollerPaths
} from './makemethod';
const path = require('path');
const util = require('util');

const clone = require('clone');

const CONTROLLER_DIR = "src/Controllers";

export class CreateControllers {

  private swagger_: SwaggerObject;
  private oFmt: Formatter;

  constructor(private readonly basePath: string) {
    const swagger = require(path.join(basePath, 'swagger.json'));
    this.swagger_ = clone(swagger);
    this.oFmt = new Formatter(basePath);

    (Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");
  }


  saveController(ctrlInfo: IControllerDetails, ctrlName: string): Promise<boolean> {
    const fileName = (ctrlName + ".ts").toLocaleLowerCase();
    const filePath = path.join(CONTROLLER_DIR, fileName);

    const ctrl = makeController(ctrlInfo);

    return this.oFmt.formatAndSaveIfNotExist(filePath, ctrl).then(res => {

      if (res.error) {
        console.error("Failed to format and save controller: ", ctrlName, ' Error: ', util.inspect(res.error));
        throw new Error(res.message);
        //return false;
      }

      //console.log("Saved controller ", ctrlName, ' path: ', res.dest);
      return true;

    })

  }


  parsePaths(): Array<IMethodDetails> {

    console.log("Entered parsePaths");

    let res: Array<IMethodDetails> = [];

    if (this.swagger_.hasOwnProperty('paths')) {
      let i = 1;
      for (let path in this.swagger_.paths) {
        //console.log("Inside next loop of createControllers");
        let fname: string;
        if (this.swagger_.paths.hasOwnProperty(path)) {
          let x: Array<IMethodDetails> = parsePathElement(path, this.swagger_.paths[path], i++);
          //console.log("~~~~~ GOT X: ", JSON.stringify(x));
          res = res.concat(x);

        }

      }

    }

    return res;

  }


  prepareControllers(): Array<IControllerDetails> {


    let aDetails = this.parsePaths();
    return adjustComprollerPaths(groupMethodDetailsByController(aDetails));
  }


  /*async *createControllers(): AsyncIterableIterator<boolean> {

   if (this.swagger_.hasOwnProperty('paths')) {
   let i = 1;
   for (let path in this.swagger_.paths) {
   //console.log("Inside next loop of createControllers");
   let fname: string;
   if (this.swagger_.paths.hasOwnProperty(path)) {
   let x = parsePathItem(path, this.swagger_.paths[path]);
   if (x.controllerName) {
   fname = x.controllerName.toLocaleLowerCase();
   } else {
   fname = `controller${i++}`;
   }

   yield this.saveController(x, fname).catch(e => {
   console.log("saveController Error for ctrl name: " + fname + " Error: " + e);
   return false;
   });


   }
   }
   }

   }*/

  async *createControllers(): AsyncIterableIterator<boolean> {

    let aCtrls = this.prepareControllers();
    for (const ctrl of aCtrls) {
      //console.log("Inside next loop of createControllers");
      let fname: string = ctrl.controllerName;

      yield this.saveController(ctrl, fname).catch(e => {
        console.log("saveController Error for ctrl name: " + fname + " Error: " + e);
        return false;
      });
    }

  }
}
