import { appConfigs } from "../config/config";
import { genCode } from "../utils/core/genCode";
import { getRedisAsync, setRedisAsync, setExpireRedisAsync, clearRedisAsync } from "./index";

export const setRedisCode = async (email: string) => {
    const code = genCode(3)
    await setRedisAsync(email, code)
    await setExpireRedisAsync(email, appConfigs.jwt.verifyEmailExpirationMinutes * 60)
    return code
}

export const getRedisCode = async (email: string) => {
    let data: any = await getRedisAsync(email)
    return data
}

export const deleteRedisCode = async (email: string) => {
    await clearRedisAsync(email)
}