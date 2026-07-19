import type { PlacementDefinition } from '../core/types';

export class PlacementRegistry {
  private static placements = new Map<string, PlacementDefinition>();

  static register(placement: string, definition: PlacementDefinition): void {
    this.placements.set(placement, definition);
  }

  static registerBatch(definitions: Record<string, PlacementDefinition>): void {
    Object.entries(definitions).forEach(([placement, definition]) => {
      this.placements.set(placement, definition);
    });
  }

  static get(placement: string): PlacementDefinition | undefined {
    return this.placements.get(placement);
  }

  static getAll(): Map<string, PlacementDefinition> {
    return new Map(this.placements);
  }

  static validate(placement: string): boolean {
    return this.placements.has(placement);
  }

  static clear(): void {
    this.placements.clear();
  }
}
