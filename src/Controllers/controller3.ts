import { Controller, Path, POST, JsonResponse, AppResponse, Required, PathParam } from 'promiseoft'


@Controller
export default class {



    /**
    * Delete CEH User account
    **/
    @Path('/user/{assocId}/user.delete')
    @POST
    deleteUserByAssocId( @PathParam('assocId') @Required assocId: string): Promise<JsonResponse<any>> {


    }



}
