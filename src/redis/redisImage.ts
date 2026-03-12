import { appConfigs } from "../config/config";
import { attachmentService } from "../modules/attachment/attachment.service";
import { getRedisAsync, setRedisAsync, setExpireRedisAsync } from "./index";

export const setRedisImage = async (fileName: string) => {
    const image = await attachmentService.getOne({ originalName: fileName })
    await setRedisAsync(fileName, image?.path || fileName);
    await setExpireRedisAsync(fileName, appConfigs.jwt.dayAfterSetImage * 60 * 60 * 24)
    return image?.path
}

export const getRedisImage = async (fileName: string) => {
    let data: any = await getRedisAsync(fileName)
    if (!data) {
        data = setRedisImage(fileName)
    }
    return data
}