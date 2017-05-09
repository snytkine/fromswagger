import { Controller, Path, POST, JsonResponse, AppResponse, Required, RequestBody, PathParam } from 'promiseoft'
import { CEHUser } from '../Models'

@Controller
export default class {



    /**
    * Remove CEH User Role
    **/
    @Path('/user/{assocId}/role.delete')
    @POST
    doPOST( @RequestBody @Required role: any, @PathParam('assocId') @Required assocId: string): Promise<JsonResponse<CEHUser>> {


    }



}
