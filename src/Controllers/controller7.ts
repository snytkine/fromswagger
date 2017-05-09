import { Controller, Path, GET, JsonResponse, AppResponse, QueryParam } from 'promiseoft'
import { CEHUsers } from '../Models'

@Controller
export default class {



    /**
    * Get multiple CEH Users
    **/
    @Path('/users')
    @GET
    getUsers( @QueryParam('$select') $select: string, @QueryParam('$top') $top: number, @QueryParam('$skip') $skip: number, @QueryParam('$orderby') $orderby: string, @QueryParam('$filter') $filter: string): Promise<JsonResponse<CEHUsers>> {


    }



}
