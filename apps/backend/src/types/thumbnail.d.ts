/*
 * Type Definitions for '@nbw/thumbnail/node' Module
 *
 * PURPOSE:
 * This declaration file explicitly declares type definitions for the '@nbw/thumbnail/node'
 * module. While the '@nbw/thumbnail' package exports both Node.js and browser-specific
 * implementations via the modern 'exports' field in package.json, the backend's
 * moduleResolution is set to 'node' (= node10, required for CommonJS module system compatibility),
 * which does not understand the 'exports' field. This file bridges that gap.
 *
 * BACKGROUND:
 * The @nbw/thumbnail package uses conditional exports to provide different entry points
 * for Node.js and browser environments. Modern module resolution (e.g., 'bundler', 'node16+')
 * understands this, but the 'node' resolver does not, causing import resolution issues like
 * 'Cannot find module '@nbw/thumbnail' or its corresponding type declarations.'
 *
 * MAINTENANCE NOTE:
 * If the @nbw/thumbnail package's exports change or if new functions/interfaces are added,
 * this file must be updated to reflect those changes. Sync the DrawParams interface and
 * exported functions with the actual implementation in packages/thumbnail/src/node/.
 *
 * ALTERNATIVES:
 * // TODO: Update backend's moduleResolution to 'bundler', 'node16' or 'nodenext'
 */

declare module '@nbw/thumbnail/node' {
  interface DrawParams {
    notes: unknown;
    startTick: number;
    startLayer: number;
    zoomLevel: number;
    backgroundColor: string;
    imgWidth: number;
    imgHeight: number;
  }

  export function drawToImage(params: DrawParams): Promise<Buffer>;
  export function drawNotesOffscreen(params: DrawParams): Promise<unknown>;
}
