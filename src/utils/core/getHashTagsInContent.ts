export const getHashTagsContent = (value: string) => {
  console.info("value", value)
  const testReg = /(#(?:[^\x00-\x7F]|\w)+)/g;

  return value.match(testReg)
}