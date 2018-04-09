import {CellInput, CellPosition} from "../models/CellInput";
import {SudokuCharacterSet} from "../models/constants/sudoku-character-sets";

export class Cell {
	position: CellPosition;
	value: string|null;
	get filledIn(): boolean { return this.value !== null };
	possibleValues: string[];

	constructor(cell: CellInput, characters: SudokuCharacterSet) {
		this.position = cell.position;
		this.value = cell.value;
		if (cell.value === null) this.possibleValues = characters;
	}

	removeValueFromPossibleValues(value: string) {
		if (this.possibleValues) {
			this.possibleValues = this.possibleValues.filter(possibleValue => value !== possibleValue);
		}
	}

	static filledIn(cell: Cell): boolean {
		return cell.filledIn;
	}

	static notFilledIn(cell: Cell): boolean {
		return !cell.filledIn;
	}

}