import {Sudoku} from "./Sudoku";
import {SudokuGridArray, SudokuGridCells} from "../models/SudokuGrid";
import {SubGridDimensions} from "../models/SubGridDimensions";
import {SudokuCharacterSet} from "../models/constants/sudoku-character-sets";
import {SudokuValidator} from "./SudokuValidator";
import {Cell} from "./Cell";
const cTable = require('console.table');

export class SudokuSolver {
	sudokuValidator = new SudokuValidator();
	sudoku: Sudoku;
	progressMade: boolean = false;
	iterationNumber = 0;

	solveSodoku(rawGrid: SudokuGridArray,
	            subGridDimensions: SubGridDimensions,
	            characters: SudokuCharacterSet) {
		this.sudoku = new Sudoku();
		this.sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
		console.log(`solving sudoku:`);
		console.log(this.sudoku.rawGrid.map(row => row.map(cell => cell || ' ')));
		console.time(`Solve Sudoku`);

		this.runIterationCycles();
		const completed: boolean = this.sudokuValidator.sudokuIsComplete(this.sudoku);
		console.timeEnd(`Solve Sudoku`);

		console.log(`Iterations Taken: ${this.iterationNumber}`);
		console.log(completed ? `Successfuly completed sudoku. Result:` : `Could not complete sudoku. Best Progress:`);
		console.log(this.sudoku.rawGrid.map(row => row.map(cell => cell || ' ')));
		if (!completed) console['table'](this.sudoku.flattenedCells.map(cell => ({row: cell.position.row, column: cell.position.column, subGrid: cell.position.subGrid, value: cell.value, possibleValues: cell.possibleValues})));
	}

	runIterationCycles() {
		do {
			const startPoint = JSON.stringify(this.sudoku.gridCells);
			this.runIterationCycle();
			const endPoint = JSON.stringify(this.sudoku.gridCells);
			this.progressMade = startPoint !== endPoint;
		} while (!(!this.progressMade || this.sudokuValidator.sudokuIsComplete(this.sudoku)));
	}

	private runIterationCycle() {
		this.checkRowsForEntireRowFullButOne();
		this.checkColumnsForEntireColumnFullButOne();
		this.checkSubGridsForEntireSubGridFullButOne();
		this.removeImpossiblePossibilities();
		this.checkCellsForOnlyOneValuePossibility();
		this.checkCellsForNoAdjacentCellAbleToHoldPossibility();
		this.checkSubgridPossibleValuesConstrainedToSingleRowOrColumn();
		this.checkAdjacentSubgridRowsAndColumns();
		this.iterationNumber++;
	}

	checkRowsForEntireRowFullButOne() {
		this.sudoku.gridCells.forEach(row => this.checkForSingleValueMissing(row));
	}
	checkColumnsForEntireColumnFullButOne() {
		this.sudoku.gridCellsTransposed.forEach(column => this.checkForSingleValueMissing(column))
	}
	checkSubGridsForEntireSubGridFullButOne() {
		for (let i = 1; i <= this.sudoku.gridSize; i++) {
			const cells = this.sudoku.flattenedCells.filter(cell => cell.position.subGrid === i);
			this.checkForSingleValueMissing(cells);
		}
	}
	checkForSingleValueMissing(cells: Array<Cell>) {
		if (cells.every(Cell.filledIn)) return;
		if (cells.filter(Cell.notFilledIn).length > 1) return;
		const characters: string[] = this.sudoku.characters;
		const usedValues: string[] = cells.filter(Cell.filledIn).map(cell => cell.value);
		const unusedCharacter = characters.find(char => !usedValues.includes(char));
		const unfilledCell = cells.find(Cell.notFilledIn);
		this.sudoku.setCellValue(unfilledCell.position, unusedCharacter);
	}

	removeImpossiblePossibilities() {
		this.sudoku.flattenedCells.filter(Cell.notFilledIn).forEach(cell => {
			const adjacentCellsFilledIn = this.sudoku.getAllAdjacentCells(cell.position).filter(Cell.filledIn);
			adjacentCellsFilledIn.filter(adjCell => cell.possibleValues.includes(adjCell.value))
														.forEach(adjCell => cell.removeValueFromPossibleValues(adjCell.value));
		});
	}

	checkCellsForOnlyOneValuePossibility() {
		this.sudoku.flattenedCells.filter(Cell.notFilledIn).forEach(cell => {
			if (cell.possibleValues.length === 1) {
				this.sudoku.setCellValue(cell.position, cell.possibleValues[0]);
			}
		});
	}

	checkCellsForNoAdjacentCellAbleToHoldPossibility() {
		this.sudoku.flattenedCells.filter(Cell.notFilledIn).forEach(cell => {
			for (let possibleValue of cell.possibleValues) {
				if (this.adjacentCellsCantContainValue(cell, possibleValue)) {
					this.sudoku.setCellValue(cell.position, possibleValue);
					break;
				}
			}
		});
	}
	private adjacentCellsCantContainValue(cell, possibleValue): boolean {
		const adjacentUnfilledCellsInRow = this.sudoku.getAdjacentCellsInRow(cell.position).filter(Cell.notFilledIn);
		const adjacentUnfilledCellsInColumn = this.sudoku.getAdjacentCellsInColumn(cell.position).filter(Cell.notFilledIn);
		const adjacentUnfilledCellsInSubGrid = this.sudoku.getAdjacentCellsInSubGrid(cell.position).filter(Cell.notFilledIn);
		const adjacentRowCellsCantContainValue = adjacentUnfilledCellsInRow.every(adjCell => !adjCell.possibleValues.includes(possibleValue));
		const adjacentColumnCellsCantContainValue = adjacentUnfilledCellsInColumn.every(adjCell => !adjCell.possibleValues.includes(possibleValue));
		const adjacentSubgridCellsCantContainValue = adjacentUnfilledCellsInSubGrid.every(adjCell => !adjCell.possibleValues.includes(possibleValue));
		return adjacentRowCellsCantContainValue || adjacentColumnCellsCantContainValue || adjacentSubgridCellsCantContainValue;
	}

	// iterate over each subGrid.
	// if all positions that can contain a given number can only fit in one column or row of that subgrid,
	// then filter adjacent subgrids in the same column or row, for the same column/row, to remove that number from the possible values;
	checkSubgridPossibleValuesConstrainedToSingleRowOrColumn() {
		for (let i = 1; i <= this.sudoku.gridSize; i++) {
			const gridCells = this.sudoku.flattenedCells.filter(cell => cell.position.subGrid === i);
			this.checkSubgridPossibleValuesConstrainedToSingleRow(gridCells);
			this.checkSubgridPossibleValuesConstrainedToSingleColumn(gridCells);
		}
	}

	checkSubgridPossibleValuesConstrainedToSingleRow(gridCells: Cell[]) {
		const remainingPossibleValues: string[] = this.getUniquePossibleValuesRemaining(gridCells);
		const unfilledCells = gridCells.filter(Cell.notFilledIn);
		remainingPossibleValues.forEach(value => {
			const allowableCells = unfilledCells.filter(cell => cell.possibleValues.includes(value));
			if (!allowableCells.length) return;
			const firstAllowableCellRow = allowableCells[0].position.row;
			if (allowableCells.every(allowableCell => allowableCell.position.row === firstAllowableCellRow)) {
				this.sudoku.setValueInRowOfSubGrid(gridCells[0].position.subGrid, firstAllowableCellRow, value);
			}
		});
	}

	checkSubgridPossibleValuesConstrainedToSingleColumn(gridCells: Cell[]) {
		const remainingPossibleValues: string[] = this.getUniquePossibleValuesRemaining(gridCells);
		const unfilledCells = gridCells.filter(Cell.notFilledIn);
		remainingPossibleValues.forEach(value => {
			const allowableCells = unfilledCells.filter(cell => cell.possibleValues.includes(value));
			if (!allowableCells.length) return;
			const firstAllowableCellColumn = allowableCells[0].position.column;
			if (allowableCells.every(allowableCell => allowableCell.position.column === firstAllowableCellColumn)) {
				this.sudoku.setValueInColumnOfSubGrid(gridCells[0].position.subGrid, firstAllowableCellColumn, value);
			}
		});
	}

	getUniquePossibleValuesRemaining(cells: Cell[]): string[] {
		const set: Set<string> = new Set<string>([]);
		cells.filter(Cell.notFilledIn).forEach(cell => {
			cell.possibleValues.forEach(possibleValue => set.add(possibleValue));
		});
		return Array.from(set);
	}

	checkAdjacentSubgridRowsAndColumns() {
		this.sudoku.subGridRowSets.forEach(subgridRow => this.checkSubgridRowsForSubgridRowValueImpossibility(subgridRow));
		this.sudoku.subGridColumnSets.forEach(subgridColumn => this.checkSubgridColumnsForSubgridColumnValueImpossibility(subgridColumn));
	}

	checkSubgridRowsForSubgridRowValueImpossibility(subgridRow: SudokuGridCells) {
		const subgridNumbers: number[] = subgridRow.map(subgrid => subgrid[0].position.subGrid);
		const remainingPossibleValues: string[] = this.getUniquePossibleValuesRemaining(subgridRow.reduce((prev, curr) => [...prev, ...curr], []));
		remainingPossibleValues.forEach(value => {
			const possibleRowNumbers = Array.from(new Set(subgridRow.reduce((prev, curr) => [...prev, ...curr], []).map(cell => cell.position.row)));
			const possibleRowSolutions: {subgrid: number, rowNumbers: number[]}[] = this.calculatePossibleRowSolutions(possibleRowNumbers, subgridRow, value);
			const gridsWithCorrectNumberOfRows = possibleRowSolutions.filter(solution => solution.rowNumbers.length === (this.sudoku.subGridDimensions.height - 1));
			this.checkToSetValueInRowOfSubGrid(gridsWithCorrectNumberOfRows, subgridNumbers, possibleRowNumbers, value);
		});
	}
	private calculatePossibleRowSolutions(possibleRowNumbers, subgridRow, value): {subgrid: number, rowNumbers: number[]}[] {
		const possibleRowSolutions: {subgrid: number, rowNumbers: number[]}[] = [];
		subgridRow.forEach(subgrid => {
			const unfilledCellsInSubgrid = subgrid.filter(Cell.notFilledIn);
			const rowNumbers = possibleRowNumbers.filter(rowNum => unfilledCellsInSubgrid.filter(cell => cell.position.row === rowNum).some(cell => cell.possibleValues.includes(value)));
			possibleRowSolutions.push({subgrid: subgrid[0].position.subGrid, rowNumbers: rowNumbers});
		});
		return possibleRowSolutions;
	}
	private checkToSetValueInRowOfSubGrid(gridsWithCorrectNumberOfRows, subgridNumbers, possibleRowNumbers, value) {
		const numberOfGridsThatHaveCorrectNumberOfRows = gridsWithCorrectNumberOfRows.length;
		if (numberOfGridsThatHaveCorrectNumberOfRows !== (this.sudoku.subgridWidthsWithinGrid - 1)) return;
		if (!gridsWithCorrectNumberOfRows.length) return;
		if (gridsWithCorrectNumberOfRows.every(grid => JSON.stringify(grid.rowNumbers) === JSON.stringify(gridsWithCorrectNumberOfRows[0].rowNumbers))) {
			const remainingSubgrid = subgridNumbers.find(subgridNumber => !gridsWithCorrectNumberOfRows.map(grid => grid.subgrid).includes(subgridNumber));
			const remainingRow = possibleRowNumbers.find(rowNumber => !gridsWithCorrectNumberOfRows[0].rowNumbers.includes(rowNumber));
			this.sudoku.setValueInRowOfSubGrid(remainingSubgrid, remainingRow, value);
		}
	}

	checkSubgridColumnsForSubgridColumnValueImpossibility(subgridColumn: SudokuGridCells) {
		const subgridNumbers: number[] = subgridColumn.map(subgrid => subgrid[0].position.subGrid);
		const remainingPossibleValues: string[] = this.getUniquePossibleValuesRemaining(subgridColumn.reduce((prev, curr) => [...prev, ...curr], []));
		remainingPossibleValues.forEach(value => {
			const possibleColumnNumbers = Array.from(new Set(subgridColumn.reduce((prev, curr) => [...prev, ...curr], []).map(cell => cell.position.column)));
			const possibleColumnSolutions: {subgrid: number, columnNumbers: number[]}[] = this.calculatePossibleColumnSolutions(possibleColumnNumbers, subgridColumn, value);
			const gridsWithCorrectNumberOfColumns = possibleColumnSolutions.filter(solution => solution.columnNumbers.length === (this.sudoku.subGridDimensions.width - 1));
			this.checkToSetValueInColumnOfSubGrid(gridsWithCorrectNumberOfColumns, subgridNumbers, possibleColumnNumbers, value);
		});
	}
	private calculatePossibleColumnSolutions(possibleColumnNumbers, subgridColumn, value): {subgrid: number, columnNumbers: number[]}[] {
		const possibleColumnSolutions: {subgrid: number, columnNumbers: number[]}[] = [];
		subgridColumn.forEach(subgrid => {
			const unfilledCellsInSubgrid = subgrid.filter(Cell.notFilledIn);
			const columnNumbers = possibleColumnNumbers.filter(colNum => unfilledCellsInSubgrid.filter(cell => cell.position.column === colNum).some(cell => cell.possibleValues.includes(value)));
			possibleColumnSolutions.push({subgrid: subgrid[0].position.subGrid, columnNumbers: columnNumbers});
		});
		return possibleColumnSolutions;
	}
	private checkToSetValueInColumnOfSubGrid(gridsWithCorrectNumberOfColumns, subgridNumbers, possibleColumnNumbers, value) {
		const numberOfGridsThatHaveCorrectNumberOfColumns = gridsWithCorrectNumberOfColumns.length;
		if (numberOfGridsThatHaveCorrectNumberOfColumns !== (this.sudoku.subgridWidthsWithinGrid - 1)) return;
		if (!gridsWithCorrectNumberOfColumns.length) return;
		if (gridsWithCorrectNumberOfColumns.every(grid => JSON.stringify(grid.columnNumbers) === JSON.stringify(gridsWithCorrectNumberOfColumns[0].columnNumbers))) {
			const remainingSubgrid = subgridNumbers.find(subgridNumber => !gridsWithCorrectNumberOfColumns.map(grid => grid.subgrid).includes(subgridNumber));
			const remainingColumn = possibleColumnNumbers.find(columnNumber => !gridsWithCorrectNumberOfColumns[0].columnNumbers.includes(columnNumber));
			this.sudoku.setValueInColumnOfSubGrid(remainingSubgrid, remainingColumn, value);
		}
	}

}