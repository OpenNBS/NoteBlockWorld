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

const exclude = [
  'slate',
  'zinc',
  'gray',
  'stone',
  'lightBlue', // deprecated
  'warmGray', // deprecated
  'trueGray', // deprecated
  'coolGray', // deprecated
  'blueGray', // deprecated
];

const bgColorEntries = Object.keys(tailwindColors)
  .filter((colorName) => typeof tailwindColors[colorName] === 'object')
  .filter((colorName) => !exclude.includes(colorName))
  .map((colorName) => {
    const shades = tailwindColors[colorName] as Record<number, string>;
    if (typeof shades !== 'object') return;
    return [colorName, shades[900]]; //{ light: shades[50], dark: shades[900] }];
  });

export const bgColors = Object.fromEntries(bgColorEntries) as Record<
  string,
  Record<number, string>
>;
