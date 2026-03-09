import crypto from 'crypto';

export const genCode = function (amount: number) {
  return crypto.randomBytes(amount).toString('hex').toUpperCase();
};

export const genCODE = async function (isModel: any) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let CODE = '';

  // Lặp lại quá trình sinh code cho đến khi có một code duy nhất
  while (true) {
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      CODE += characters[randomIndex];
    }

    // Kiểm tra xem code đã tồn tại trong cơ sở dữ liệu chưa
    const existingDocument = await isModel.findOne({CODE});
    if (!existingDocument) {
      return CODE; // Nếu không tồn tại, trả về code mới
    }

    // Nếu tồn tại, đặt lại code và lặp lại quá trình sinh
    CODE = '';
  }
}