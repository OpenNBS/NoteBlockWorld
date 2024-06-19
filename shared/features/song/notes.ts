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

  public getNotesInRect(rect: Rectangle): Note[] {
    return this.quadtree.retrieve(rect).flatMap((node) => {
      return node.data ? [node.data] : [];
    });
  }
}
