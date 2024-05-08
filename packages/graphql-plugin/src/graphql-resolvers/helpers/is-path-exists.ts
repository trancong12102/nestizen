import { stat } from 'fs-extra';

export const isPathExists = async (path: string) => {
  try {
    await stat(path);
    return true;
  } catch (_) {
    return false;
  }
};
