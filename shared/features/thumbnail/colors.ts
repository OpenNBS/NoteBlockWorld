/* 

Obtains the background colors from the Tailwind CSS color palette
and creates a dictionary with the light and dark shades of each color.

Importing from 'tailwindcss/colors' returns undefined in the backend,
somehow due to commonjs/esm?
So we have to import directly the public colors file instead, which
there are no types for.

It's also possible to reference the default theme from JavaScript,
as shown in the link below:
https://tailwindcss.com/docs/configuration#referencing-in-java-script
Similar idea at:
https://github.com/tailwindlabs/tailwindcss/discussions/11127#discussioncomment-9162723
However, again in the backend, we also have a problem with 'resolveConfig
is not a function'.
This may come down to Tailwind being a browser-only library, and not meant
to be used in the backend.

Full list of colors is available at:
https://tailwindcss.com/docs/customizing-colors

*/

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tailwindColors from 'tailwindcss/lib/public/colors';

const colors = tailwindColors as Record<string, Record<number, string>>;

export const bgColors = [
  {
    key: 'red',
    name: 'Red',
    light: colors.red[400],
    dark: colors.red[900],
  },
  {
    key: 'orange',
    name: 'Orange',
    light: colors.orange[400],
    dark: colors.orange[900],
  },
  {
    key: 'amber',
    name: 'Amber',
    light: colors.amber[400],
    dark: colors.amber[900],
  },
  {
    key: 'yellow',
    name: 'Yellow',
    light: colors.yellow[400],
    dark: colors.yellow[900],
  },
  {
    key: 'lime',
    name: 'Lime',
    light: colors.lime[400],
    dark: colors.lime[900],
  },
  {
    key: 'green',
    name: 'Green',
    light: colors.green[400],
    dark: colors.green[900],
  },
  {
    key: 'emerald',
    name: 'Emerald',
    light: colors.emerald[400],
    dark: colors.emerald[900],
  },
  {
    key: 'teal',
    name: 'Teal',
    light: colors.teal[400],
    dark: colors.teal[900],
  },
  {
    key: 'cyan',
    name: 'Cyan',
    light: colors.cyan[400],
    dark: colors.cyan[900],
  },
  {
    key: 'sky',
    name: 'Sky',
    light: colors.sky[400],
    dark: colors.sky[900],
  },
  {
    key: 'blue',
    name: 'Blue',
    light: colors.blue[400],
    dark: colors.blue[900],
  },
  {
    key: 'indigo',
    name: 'Indigo',
    light: colors.indigo[400],
    dark: colors.indigo[900],
  },
  {
    key: 'violet',
    name: 'Violet',
    light: colors.violet[400],
    dark: colors.violet[900],
  },
  {
    key: 'purple',
    name: 'Purple',
    light: colors.purple[400],
    dark: colors.purple[900],
  },
  {
    key: 'fuchsia',
    name: 'Fuchsia',
    light: colors.fuchsia[400],
    dark: colors.fuchsia[900],
  },
  {
    key: 'pink',
    name: 'Pink',
    light: colors.pink[400],
    dark: colors.pink[900],
  },
  {
    key: 'rose',
    name: 'Rose',
    light: colors.rose[400],
    dark: colors.rose[900],
  },
  {
    key: 'slate',
    name: 'slate',
    light: colors.slate[400],
    dark: colors.slate[900],
  },
  {
    key: 'gray',
    name: 'Gray',
    light: colors.gray[400],
    dark: colors.gray[900],
  },
  {
    key: 'zinc',
    name: 'Zinc',
    light: colors.zinc[400],
    dark: colors.zinc[900],
  },
  {
    key: 'neutral',
    name: 'Neutral',
    light: colors.neutral[400],
    dark: colors.neutral[900],
  },
  {
    key: 'stone',
    name: 'Stone',
    light: colors.stone[400],
    dark: colors.stone[900],
  },
] as const;
