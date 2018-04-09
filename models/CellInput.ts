export interface CellPosition {
	row: number;
	column: number;
	subGrid: number;
}

export interface CellInput {
	position: CellPosition;
	value: string;
}
