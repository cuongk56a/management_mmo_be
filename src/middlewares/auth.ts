import httpStatus from 'http-status';
import passport from 'passport';
import ApiError from '../utils/core/ApiError';

const verifyCallback =
  (req: any, resolve: any, reject: any, requiredRights: any[]) => async (err: any, user: any, info: any) => {
    // console.log('verifyCallback', {
    //   err,
    //   user,
    //   info,
    // });
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    // req.userInfo = user;
    // console.log("sssss", user)
    // req.send({user})
    req.userId = user.userId;
    // req.organizationId = user.organizationId;
    req.roleId = user.roleId;
    // if (user.role != USER_ROLES.system && requiredRights.length) {
    //   const userRights: any = roleRights.get(user.role);
    //   const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight));
    //   if (!hasRequiredRights && req.params.userId !== user.id) {
    //     return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    //   }
    // }

    resolve();
  };

export const auth =
  (...requiredRights: any) =>
  async (req: any, res: any, next: any) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', {session: false}, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch(err => next(err));
  };
