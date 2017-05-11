const INDEX:[string, string] = ["index.ts", `export {ISettings} from './settings.d'
`];

const IFACE:[string, string] = ["settings.d.ts", `export interface ISettings{
    MONGO_URI: string;
    PORT: number;
    LOG_LEVEL: string;
}
`];

const DIT:[string, string] = ["settings.DIT.ts", `import {Component, Environment} from 'promiseoft'
import {ISettings} from "./settings";

@Environment("DIT")
@Component("settings")
export default class settings implements ISettings{
    MONGO_URI="";
    PORT = 3090;
    LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'DEBUG';
}`];


const FIT:[string, string] = ["settings.FIT.ts", `import {Component, Environment} from 'promiseoft'
import {ISettings} from "./settings";

@Environment("FIT")
@Component("settings")
export default class settings implements ISettings{
    MONGO_URI="";
    PORT = 3090;
    LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'DEBUG';
}`];

const IPE:[string, string] = ["settings.IPE.ts", `import {Component, Environment} from 'promiseoft'
import {ISettings} from "./settings";

@Environment("IPE")
@Component("settings")
export default class settings implements ISettings{
    MONGO_URI="";
    PORT = 3090;
    LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'DEBUG';
}`];

const IAT:[string, string] = ["settings.IAT.ts", `import {Component, Environment} from 'promiseoft'
import {ISettings} from "./settings";

@Environment("IAT")
@Component("settings")
export default class settings implements ISettings{
    MONGO_URI="";
    PORT = 3090;
    LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'DEBUG';
}`];

const LOCAL:[string, string] = ["settings.LOCAL.ts", `import {Component, Environment} from 'promiseoft'
import {ISettings} from "./settings";

@Environment("LOCAL")
@Component("settings")
export default class settings implements ISettings{
    MONGO_URI="";
    PORT = 3090;
    LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'DEBUG';
}`];

const TEST:[string, string] = ["settings.TEST.ts", `import {Component, Environment} from 'promiseoft'
import {ISettings} from "./settings";

@Environment("TEST")
@Component("settings")
export default class settings implements ISettings{
    MONGO_URI="";
    PORT = 3090;
    LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'DEBUG';
}`];

const PRODUCTION:[string, string] = ["settings.PRODUCTION.ts", `import {Component, Environment} from 'promiseoft'
import {ISettings} from "./settings";

@Environment("PRODUCTION")
@Component("settings")
export default class settings implements ISettings{
    MONGO_URI="";
    PORT = 3090;
    LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'INFO';
}`];


const FileTemplates:[string,string][] = [INDEX, IFACE, DIT, FIT, IAT, IPE, LOCAL, PRODUCTION, TEST];
export {FileTemplates}