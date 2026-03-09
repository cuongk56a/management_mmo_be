/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (object: any, keys: string[]) => {
  return keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      if (key == 'search' || key == 'sort') {
        if (!!object[key] && key == 'search') {
          obj['$text'] = {$search: object[key]};
        }
        if (!!object[key] && key == 'sort') {
          obj = parseSortParam(object[key])
        }
      } else {
        obj[key] = object[key];
      }
    }
    return obj;
  }, {});
};

/**
 * Parse the sort parameter to a MongoDB sort object
 * @param {string} sortParam
 * @returns {Object}
 */
const parseSortParam = (sortParam: string) => {
  const sortObject: any = {};
  const processedFields = new Set<string>();

  const fields = sortParam.split(',').reverse();

  fields.forEach(field => {
    const isDescending = field.startsWith('-');
    const fieldName = isDescending ? field.substring(1) : field;

    if (!processedFields.has(fieldName)) {
      sortObject[fieldName] = isDescending ? -1 : 1;
      processedFields.add(fieldName);
    }
  });

  return sortObject;
};
