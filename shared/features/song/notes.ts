import { Song } from '@encode42/nbs.js';
import { Quadtree, Rectangle } from '@timohausmann/quadtree-ts';

import { Note } from './types';

type TreeNode = Rectangle<Note>;

export { Rectangle } from '@timohausmann/quadtree-ts';

export class NoteQuadTree {
  private quadtree: Quadtree<TreeNode>;

  public width = 0;
  public height = 0;

  constructor(song: Song) {
    const width = song.length;
    const height = song.layers.total;

    this.quadtree = new Quadtree({ width, height });

    for (const [layerId, layer] of song.layers.get.entries()) {
      for (const [tick, note] of layer.notes) {
        const treeItem = new Rectangle({
          x: tick,
          y: layerId,
          width: 1,
          height: 1,
          data: { ...note, tick: tick, layer: layerId },
        });

        this.quadtree.insert(treeItem);

        if (tick > this.width) this.width = tick;
        if (layerId > this.height) this.height = layerId;
      }
    }
  }

  public getNotesInRect({
    x1,
    y1,
    x2,
    y2,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }): Note[] {
    const rect = new Rectangle({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });

    return this.quadtree
      .retrieve(rect)
      .flatMap((node) => {
        return node.data ? [node.data] : [];
      })
      .filter(
        (note) =>
          note.tick >= x1 &&
          note.tick <= x2 &&
          note.layer >= y1 &&
          note.layer <= y2,
      );
  }
}
