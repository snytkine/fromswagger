import { Controller, Path, GET, JsonResponse, AppResponse, Required, PathParam, QueryParam } from 'promiseoft'
import { CEHUser } from '../Models'

@Controller
export default class User {



    /**
    * Get CEH User Object by ADP id
    **/
    @Path('/user/{assocId}')
    @GET
    getUserByAid( @PathParam('assocId') @Required assocId: string, @QueryParam('$select') $select: string = "email,username"): Promise<JsonResponse<CEHUser>> {


    }



}
