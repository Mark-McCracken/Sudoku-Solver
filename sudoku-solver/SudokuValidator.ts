import {Sudoku} from "./Sudoku";
import {Cell} from "./Cell";

export class SudokuValidator {
	sudokuIsComplete(sudoku: Sudoku): boolean {
		return sudoku.flattenedCells.every(Cell.filledIn);
	}

	sudokuIsValid(sudoku: Sudoku): boolean {
		const noValueOverlap = sudoku.flattenedCells.filter(Cell.filledIn)
													.every(cell => {
			const adjacentCells = sudoku.getAllAdjacentCells(cell.position).filter(Cell.filledIn);
			return adjacentCells.every(adjacentCell => adjacentCell.value !== cell.value);
		});
		const legitamiteValuesUsed = sudoku.flattenedCells.every(cell => {
			if (cell.filledIn) {
				return sudoku.characters.includes(cell.value)
			} else {
				return cell.possibleValues.every(possibleValue => sudoku.characters.includes(possibleValue));
			}
		});
		return (noValueOverlap && legitamiteValuesUsed);
	}
}