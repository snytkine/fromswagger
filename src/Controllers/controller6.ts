import { Controller, Path, POST, JsonResponse, AppResponse, Required, RequestBody } from 'promiseoft'
import { CEHUser } from '../Models'

@Controller
export default class {



    /**
    * Create new CEH User Object
    **/
    @Path('/user/user.add')
    @POST
    createUser( @RequestBody @Required body: any): Promise<JsonResponse<CEHUser>> {


    }



}
