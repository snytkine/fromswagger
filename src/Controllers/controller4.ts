import { Controller, Path, POST, JsonResponse, AppResponse, Required, RequestBody, PathParam } from 'promiseoft'
import { CEHUser } from '../Models'

@Controller
export default class {



    /**
    * Add CEH User Role
    **/
    @Path('/user/{assocId}/role.add')
    @POST
    CEHUserRole( @RequestBody @Required role: any, @PathParam('assocId') @Required assocId: string): Promise<JsonResponse<CEHUser>> {


    }



}
