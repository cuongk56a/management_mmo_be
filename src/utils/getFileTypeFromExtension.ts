import {FILE_TYPES} from '../types/entity';
import {ImageExtensions, VideoExtensions} from '../types/fileTypes';

function get_url_extension(fileId: any) {
  return fileId.split(/[#?]/)[0].split('.').pop().trim().toLowerCase();
}

export const getFileTypeFromExtension = (fileName: any) => {
  const extension = get_url_extension(fileName);
  if (ImageExtensions.indexOf(extension) > -1) {
    return FILE_TYPES.IMAGE;
  } else if (VideoExtensions.indexOf(extension) > -1) {
    return FILE_TYPES.VIDEO;
  } else {
    return FILE_TYPES.DOCUMENT;
  }
};

export const getThumbnailFromExtension = (fileName: any) => {
  const extension = get_url_extension(fileName);
  if (VideoExtensions.indexOf(extension) > -1) {
    return fileName.replace(/(([.*])\w+)(?!.*\1)/g, '.png');
  }
};
