import { appConfigs } from "../config/config";
import { productService } from "../modules/product/product/product.service";
import { getRedisAsync, setRedisAsync, clearRedisAsync } from "./index";

export const setRedisImage  = async(company: string) => {
    const product = await productService.getOne({targetId: company})
    await setRedisAsync(company, product || []);
    await clearRedisAsync(company, appConfigs.jwt.verifyEmailExpirationMinutes*60)
    return product
}

export const getRedisImage = async(company: string) => {
    let data:any = await getRedisAsync(company)
    if(!data){
       data = setRedisImage(company)
    }
    return data
}