const dataLocation = require('./dataLocation.json');
const dvhcn = require('./dvhcvn.json');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa schema cho collection "locations"
const locationSchema = new Schema({
  name: String,
  locationType: String,
  prefix: String,
  parentId: Schema.Types.ObjectId,
});

const LOCATION_TYPE = {
  PROVINCE: 'PROVINCE',
  DISTRICT: 'DISTRICT',
  WARD: 'WARD',
};

const LocationModel = mongoose.model('tctool_locations', locationSchema);

mongoose.connect('url', {}).then(() => {
  location();
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

async function location() {
  try {
    await Promise.all(
      dvhcn.data.map(async(province) => {
        const provinceItem = await LocationModel.create({
          name: province.name,
          locationType: LOCATION_TYPE.PROVINCE,
          prefix: province.type
        });
        await Promise.all(
          province.level2s.map(async(district) => {
            const districtItem = await LocationModel.create({
              name: district.name,
              locationType: LOCATION_TYPE.DISTRICT,
              parentId: provinceItem.id,
              prefix: district.type
            });
            await Promise.all(
              district.level3s.map(async(ward) => {
                await LocationModel.create({
                  name: ward.name,
                  locationType: LOCATION_TYPE.WARD,
                  prefix: ward.type,
                  parentId: districtItem.id,
                });
              })
            )
          })
        )
      })
    )
    console.log('Locations created successfully.');
  } catch (error) {
    console.error('Error creating locations:', error);
  }
}
