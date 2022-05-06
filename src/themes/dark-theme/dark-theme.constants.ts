import { TypographyOptions } from '@mui/material/styles/createTypography';

import { colorDictionary } from '../constants';
import { Palette } from '../interfaces';

/* ––
 * –––– Constants definition
 * –––––––––––––––––––––––––––––––––– */
/* –– Colors
 * –––––––––––––––––––––––––––––––––– */
export const palette: Palette = {
  type: 'dark',
  primary: {
    light: colorDictionary.fountain.fountainLightBlue,
    main: colorDictionary.fountain.fountainBlue,
    dark: colorDictionary.fountain.fountainDarkBlue,
    contrastText: colorDictionary.black.blackContrast,
  },
  secondary: {
    light: colorDictionary.purple.purpleLightHeart,
    main: colorDictionary.purple.purpleHeart,
    dark: colorDictionary.purple.purpleDarkHeart,
    contrastText: colorDictionary.white.whiteContrast,
  },
  background: {
    default: '#171C27',
    paper: '',
  },
  text: {
    primary: colorDictionary.white.white,
    secondary: '',
    disabled: '',
    hint: colorDictionary.error.error,
  },
  action: {
    disabledBackground: colorDictionary.action.disabledBackground,
    disabled: colorDictionary.action.disabledText,
  },
};

/* –– Typography
 * –––––––––––––––––––––––––––––––––– */
export const typography: TypographyOptions = {
  h1: {
    fontFamily: 'MontserratBold',
    fontSize: '96px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: '112px',
    letterSpacing: '-1.5px',
  },
  h2: {
    fontFamily: 'MontserratMedium',
    fontSize: '60px',
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: '120%',
    letterSpacing: '-0.5px',
  },
  h3: {
    fontFamily: 'MontserratRegular',
    fontSize: '48px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: '116.7%',
    letterSpacing: '0px',
  },
  h4: {
    fontFamily: 'MontserratRegular',
    fontSize: '34px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: '123.5%',
    letterSpacing: '0.25px',
  },
  h5: {
    fontFamily: 'MontserratRegular',
    fontSize: '24px',
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: '133.4%',
    letterSpacing: '0px',
  },
  h6: {
    fontFamily: 'MontserratMedium',
    fontSize: '20px',
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: '160%',
    letterSpacing: '0.15px',
  },
  subtitle1: {
    fontFamily: 'MontserratRegular',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: '175%',
    letterSpacing: '0.15px',
  },
  subtitle2: {
    fontFamily: 'MontserratMedium',
    fontSize: '14px',
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: '157%',
    letterSpacing: '0.1px',
  },
  body1: {
    fontFamily: 'MontserratRegular',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: '150%',
    letterSpacing: '0.15px',
  },
  body2: {
    fontFamily: 'MontserratRegular',
    fontSize: '14px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: '143%',
    letterSpacing: '0.15px',
  },
  button: {
    fontFamily: 'MontserratMedium',
    fontSize: '15px',
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: '26px',
    letterSpacing: '0.46px',
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: 'MontserratRegular',
    fontSize: '12px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: '166%',
    letterSpacing: '0.4px',
  },
  overline: {
    fontFamily: 'MontserratRegular',
    fontSize: '12px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: '266%',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
};
