export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Vector2;
  velocity: Vector2;
}

export interface Robot extends Entity {
  // specific robot properties can go here later
}