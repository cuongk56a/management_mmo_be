import {faker} from '@faker-js/faker';
import {TABLE_USER} from '../modules/user/user.configs';
import { getRandomInt } from '../utils/RamdomString';
import {UserModel} from '../modules/user/user.model';
import {fakeImages} from './images/images';
import { OrganizationModel } from '../modules/organization/organization.model';
// import { BrandModel } from '../modules/brand/brand.model';
// import { CategoryModel } from '../modules/category/category.model';
// import { ProductModel } from '../modules/product/product/product.model';
// import { UnitModel } from '../modules/product/unit/unit.model';

const companyId = '652de593d0bcb141c425c2c9';
const adminCId = '6611a315fd097185cd665704';
const adminTId = '652fe549427be99351822536';
const brandId = '643f7d47132d00ffe0ec7d5a';
const categoryId = '642ee729fce32ca0f1063f2c';
const unitId = '63f6c9c699a2dd615fd22688';

const clean = async () => {
  await Promise.all([
    OrganizationModel.deleteMany(),
    UserModel.deleteMany(),
    // CategoryModel.deleteMany(),
    // BrandModel.deleteMany(),
    // UnitModel.deleteMany(),
    // ProductModel.deleteMany(),
  ]);
};

const fake = async () => {
  const fakeOrg = async () => {
    await OrganizationModel.create({
      _id: companyId,
      CODE: 'FSOFT',
      name: 'FIT Shop',
      hotline: '096131906',
      thumbnail: fakeImages.compImg,
      description: faker.lorem.words(30),
      createdById: adminCId,
    });
  };

  const fakeAdmin = async () => {
    await UserModel.insertMany([
      {
        _id: adminCId,
        CODE: 'CUONGNV01',
        fullName: 'Admin Cường',
        description: faker.lorem.words(30),
        phone: '0967131906',
        hashedPassword: '$2a$10$wKtYXjxy8oFGsNa3TiP6d./0vq0K0WiSl826Mxn42r7OiYQFxgiw.',//123123
        email: 'laclac10921@gmail.com',
        isAdmin: true
      },
      {
        _id: adminTId,
        CODE: 'TANNV3201',
        fullName: 'Admin Tân',
        description: faker.lorem.words(30),
        phone: '0386653766',
        hashedPassword: '$2a$10$wKtYXjxy8oFGsNa3TiP6d./0vq0K0WiSl826Mxn42r7OiYQFxgiw.',//123123
        email: 'tannv.3201@gmail.com',
        isAdmin: true
      }
    ])
  }
  // const fakeBrand = async () => {
  //   await BrandModel.create({
  //     _id: brandId,
  //     targetId: companyId,
  //     targetOnModel: 'tctool_organization',
  //     name: 'Bánh Tráng Trộn',
  //     logo: fakeImages.productImg,
  //     description: faker.lorem.words(30),
  //     createdById: adminCId
  //   });
  // };
  // const fakeCategory = async () => {
  //   await CategoryModel.create({
  //     _id: categoryId,
  //     name: 'Bánh Tráng Trộn',
  //     thumbnail: fakeImages.productImg,
  //     parentId: undefined,
  //     description: faker.lorem.words(30),
  //     isHome: true,
  //     isActive: true,
  //     createdById: adminCId
  //   });
  // };

  // const fakeUnit = async () => {
  //   await UnitModel.create({
  //     _id: unitId,
  //     name: 'Túi',
  //     description: 'Túi bao bóng',
  //     isActive: 'true'
  //   });
  // };

  // const fakeProduct = async () => {
  //   await ProductModel.insertMany([
  //     {
  //       targetId: companyId,
  //       targetOnModel: 'tctool_organization',
  //       name: 'Bánh Tráng Trộn 1',
  //       thumbnail: fakeImages.productImg,
  //       attachments: [fakeImages.productImg],
  //       description: faker.lorem.words(30),
  //       categoryId: categoryId,
  //       brandId: brandId,
  //       capitalPrice: 10000,
  //       salePrice: 15000,
  //       price: 20000,
  //       quantity: 2,
  //       weight: 100,
  //       unitId: unitId,
  //       isActive: true,
  //       createdById: adminCId
  //     },
  //     {
  //       targetId: companyId,
  //       targetOnModel: 'tctool_organization',
  //       name: 'Bánh Tráng Trộn 2',
  //       thumbnail: fakeImages.productImg,
  //       attachments: [fakeImages.productImg],
  //       description: faker.lorem.words(30),
  //       categoryId: categoryId,
  //       brandId: brandId,
  //       capitalPrice: 12000,
  //       salePrice: 17000,
  //       price: 23000,
  //       quantity: 5,
  //       weight: 100,
  //       unitId: unitId,
  //       isActive: true,
  //       createdById: adminCId,
  //     },
  //   ])
  // };

  // const [org, admin, teachers, studients] = await Promise.all([fakeOrg(),fakeAdmin(), fakeBrand(), fakeCategory(), fakeUnit(), fakeProduct()]);
  await fakeOrg();
  await fakeAdmin();
};

export const fakeData = async () => {
  await clean();

  await fake();
};
