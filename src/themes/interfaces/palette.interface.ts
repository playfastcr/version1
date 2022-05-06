import { PaletteVariant } from './palette-variant.interface';

/* ––
 * –––– Interface declaration
 * –––––––––––––––––––––––––––––––––– */
export interface Palette {
  /* –– Properties
   * –––––––––––––––––––––––––––––––––– */
  type: string;
  primary: PaletteVariant;
  secondary: PaletteVariant;
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    hint: string;
  };
  action: {
    disabledBackground: string;
    disabled: string;
  };
}
