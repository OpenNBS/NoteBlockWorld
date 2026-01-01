/* 
Obtains the background colors from the Tailwind CSS color palette
and creates a dictionary with the light and dark shades of each color.

Full list of colors is available at:
https://tailwindcss.com/docs/customizing-colors
*/
import colors from './tailwindColors';

export const BG_COLORS = {
  red: {
    key: 'red',
    name: 'Red',
    light: colors.red[400],
    dark: colors.red[900],
  },
  orange: {
    key: 'orange',
    name: 'Orange',
    light: colors.orange[400],
    dark: colors.orange[900],
  },
  amber: {
    key: 'amber',
    name: 'Amber',
    light: colors.amber[400],
    dark: colors.amber[900],
  },
  yellow: {
    key: 'yellow',
    name: 'Yellow',
    light: colors.yellow[400],
    dark: colors.yellow[900],
  },
  lime: {
    key: 'lime',
    name: 'Lime',
    light: colors.lime[400],
    dark: colors.lime[900],
  },
  green: {
    key: 'green',
    name: 'Green',
    light: colors.green[400],
    dark: colors.green[900],
  },
  emerald: {
    key: 'emerald',
    name: 'Emerald',
    light: colors.emerald[400],
    dark: colors.emerald[900],
  },
  teal: {
    key: 'teal',
    name: 'Teal',
    light: colors.teal[400],
    dark: colors.teal[900],
  },
  cyan: {
    key: 'cyan',
    name: 'Cyan',
    light: colors.cyan[400],
    dark: colors.cyan[900],
  },
  sky: {
    key: 'sky',
    name: 'Sky',
    light: colors.sky[400],
    dark: colors.sky[900],
  },
  blue: {
    key: 'blue',
    name: 'Blue',
    light: colors.blue[400],
    dark: colors.blue[900],
  },
  indigo: {
    key: 'indigo',
    name: 'Indigo',
    light: colors.indigo[400],
    dark: colors.indigo[900],
  },
  violet: {
    key: 'violet',
    name: 'Violet',
    light: colors.violet[400],
    dark: colors.violet[900],
  },
  purple: {
    key: 'purple',
    name: 'Purple',
    light: colors.purple[400],
    dark: colors.purple[900],
  },
  fuchsia: {
    key: 'fuchsia',
    name: 'Fuchsia',
    light: colors.fuchsia[400],
    dark: colors.fuchsia[900],
  },
  pink: {
    key: 'pink',
    name: 'Pink',
    light: colors.pink[400],
    dark: colors.pink[900],
  },
  rose: {
    key: 'rose',
    name: 'Rose',
    light: colors.rose[400],
    dark: colors.rose[900],
  },
  gray: {
    key: 'gray',
    name: 'Gray',
    light: colors.zinc[200],
    dark: colors.zinc[800],
  },
} as const;

export const bgColorsArray = Object.values(BG_COLORS);
