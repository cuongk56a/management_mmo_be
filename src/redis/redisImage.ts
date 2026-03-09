import { appConfigs } from "../config/config";
import { imageService } from "../modules/attachment/attachment.service";
import { getRedisAsync, setRedisAsync, clearRedisAsync } from "./index";

export const setRedisImage  = async(fileName: string) => {
    const image = await imageService.getOne({originalName: fileName})
    await setRedisAsync(fileName, image?.path || fileName);
    await clearRedisAsync(fileName, appConfigs.jwt.dayAfterSetImage*60*60*24)
    return image?.path
}

export const getRedisImage = async(fileName: string) => {
    let data:any = await getRedisAsync(fileName)
    if(!data){
       data = setRedisImage(fileName)
    }
    return data
}