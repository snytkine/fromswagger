import { Controller, Path, POST, JsonResponse, AppResponse, Required, RequestBody, PathParam } from 'promiseoft'
import { CEHUser } from '../Models'

@Controller
export default class {



    /**
    * Update CEH user
    **/
    @Path('/user/{assocId}/user.change')
    @POST
    updateCEHUser( @RequestBody @Required body: any, @PathParam('assocId') @Required assocId: string): Promise<JsonResponse<CEHUser>> {


    }



}
