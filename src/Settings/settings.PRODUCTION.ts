import {Component, Environment} from 'promiseoft'
import {ISettings} from "./settings";

@Environment("PRODUCTION")
@Component("settings")
export default class settings implements ISettings{
    MONGO_URI="";
    PORT = 3090;
    LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'INFO';
}