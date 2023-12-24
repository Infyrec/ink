import { Dimensions } from 'react-native';

const dimensions = Dimensions.get('screen');

const baseWidth = 375;
const baseHeight = 812;

export const wsize = (size) => (dimensions.width / baseWidth) * size;
export const hsize = (size) => (dimensions.height / baseHeight) * size;
export const fsize = (size) => size + (wsize(size) - size) * dimensions.scale