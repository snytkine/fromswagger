import { Controller, Path, GET, JsonResponse, AppResponse } from 'promiseoft'
import { CEHUser } from '../Models'

@Controller
export default class {



    /**
    * Get CEH User Object by ADP id.
    **/
    @Path('/user/self/info')
    @GET
    doGET(): Promise<JsonResponse<CEHUser>> {


    }



}
