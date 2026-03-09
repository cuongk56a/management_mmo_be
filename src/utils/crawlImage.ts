const axios = require('axios');
const fs = require('fs').promises;
const createReadStream = require('fs').createReadStream;
const path = require('path');
const FormData = require('form-data');

function getFileNameFromUrl(url: any) {
  return url.split('/').pop().split('?')[0];
}

export const crawlImage = async (imageUrl: string) => {
  // const IMAGE_URL = `https://file.vttool.online/v1/attachment/image/${IMAGE_NAME}`;
  const TEMP_FILE_PATH = path.join(__dirname, `resources/${Date.now()}-${getFileNameFromUrl(imageUrl)}`); // Đường dẫn tạm thời để lưu ảnh

  const downloadImage = async () => {
    const response = await axios.get(imageUrl, {responseType: 'arraybuffer'});
    await fs.writeFile(TEMP_FILE_PATH, response.data);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('files', createReadStream(TEMP_FILE_PATH));

    const uri = `https://file.vttool.online/v1/attachment`;

    const imageRes = await axios.post(uri, formData);

    return imageRes.data[0].filename; // Trả về filename của ảnh
  };

  const cleanup = async () => {
    await fs.unlink(TEMP_FILE_PATH); // Xóa ảnh đã tải xuống
  };

  await downloadImage();
  const imageId = await uploadImage();
  //console.log('Image uploaded with ID:', imageId);
  await cleanup();
  return imageId;
};
