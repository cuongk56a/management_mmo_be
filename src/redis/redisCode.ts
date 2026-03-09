import { appConfigs } from "../config/config";
import { userService } from "../modules/user/user.service";
import { genCode } from "../utils/core/genCode";
import { getRedisAsync, setRedisAsync, clearRedisAsync } from "./index";

export const setRedisCode  = async(email: string) => {
    const code = genCode(4)
    await setRedisAsync(email, code)
    await clearRedisAsync(email, appConfigs.jwt.verifyEmailExpirationMinutes*60)
    return code
}

export const getRedisCode = async(email: string) => {
    let data:any = await getRedisAsync(email)
    if(!data){
       data = setRedisCode(email)
    }
    return data
}