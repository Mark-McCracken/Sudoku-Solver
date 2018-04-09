import {SudokuCharacterSet} from "../models/constants/sudoku-character-sets";
import {SubGridDimensions} from "../models/SubGridDimensions";
import {SudokuGridArray, SudokuGridCells} from "../models/SudokuGrid";
import {SudokuCreationValidator} from "./SudokuCreationValidator";
import {CellInput, CellPosition} from "../models/CellInput";
import {Cell} from "./Cell";

export class Sudoku {
	creationValidator = new SudokuCreationValidator();

	gridCells: SudokuGridCells;
	get gridCellsTransposed(): SudokuGridCells {
		return this.gridCells[0].map((col, i) => this.gridCells.map(row => row[i]));
	}

	characters: SudokuCharacterSet;
	gridSize: number;

	subGridDimensions: SubGridDimensions;
	get subgridWidthsWithinGrid(): number { return this.gridSize / this.subGridDimensions.width; }
	get subgridHeightsWithinGrid(): number { return this.gridSize / this.subGridDimensions.height; }

	subGrids: Array<{subgridNumber: number, cells: Array<Cell>}>;
	subGridRowSets: Array<SudokuGridCells>;
	subGridColumnSets: Array<SudokuGridCells>;

	get rawGrid(): SudokuGridArray {
		return this.gridCells.map(row => {
			return row.map(cell => cell.value);
		});
	}
	get flattenedCells(): Array<Cell> {
		return this.gridCells.reduce((acc, val) => acc.concat(val), []);
	}

	initialiseSudoku(rawGrid: SudokuGridArray,
	                 subGridDimensions: SubGridDimensions,
	                 characters: SudokuCharacterSet) {
		this.subGridDimensions = subGridDimensions;
		this.characters = characters;
		this.creationValidator.checkInputs(rawGrid, subGridDimensions, characters);
		this.gridSize = rawGrid.length;
		this.setGrid(rawGrid);
		this.calculateSubGrids();
		this.calculateSubGridRowSets();
		this.calculateSubGridColumnSets();
	}

	setGrid(rawGrid: SudokuGridArray) {
		this.gridCells = rawGrid.map((row, rowIndex) => {
			return row.map((value, columnIndex) => {
				const row = rowIndex+1;
				const column = columnIndex+1;
				const subGrid = this.calculateSubGridNumber(row, column);
				const position: CellPosition = { row, column, subGrid };
				const cellInput: CellInput = { position, value };
				return new Cell(cellInput, this.characters);
			});
		});
	}

	calculateSubGridNumber(rowNumber: number, columnNumber: number): number {
		const subGridRow = Math.ceil(rowNumber / this.subGridDimensions.height);
		const subGridColumn = Math.ceil(columnNumber / this.subGridDimensions.width);
		const gridWidthInSubGridWidths = this.gridSize / this.subGridDimensions.width;
		return (subGridRow - 1) * gridWidthInSubGridWidths + subGridColumn;
	}

	getAllAdjacentCells(position: CellPosition): Array<Cell> {
		return this.flattenedCells.filter(cell => cell.position.row === position.row ||
																												cell.position.column === position.column ||
																												cell.position.subGrid === position.subGrid)
															.filter(cell => !this.cellsIsInPosition(cell, position));
	}

	getAdjacentCellsInRow(position: CellPosition): Array<Cell> {
		return this.flattenedCells.filter(cell => cell.position.row === position.row)
															.filter(cell => !this.cellsIsInPosition(cell, position));
	}
	getAdjacentCellsInColumn(position: CellPosition): Array<Cell> {
		return this.flattenedCells.filter(cell => cell.position.column === position.column)
															.filter(cell => !this.cellsIsInPosition(cell, position));
	}
	getAdjacentCellsInSubGrid(position: CellPosition): Array<Cell> {
		return this.flattenedCells.filter(cell => cell.position.subGrid === position.subGrid)
															.filter(cell => !this.cellsIsInPosition(cell, position));
	}

	cellsIsInPosition(cell: Cell, position: CellPosition) {
		return cell.position.column === position.column &&
						cell.position.row === position.row &&
						cell.position.subGrid === position.subGrid;
	}

	setCellValue(position: CellPosition, value: string) {
		const cell = this.gridCells[position.row-1][position.column-1];
		cell.value = value;
		delete cell.possibleValues;
		const adjacentCells = this.getAllAdjacentCells(position).filter(Cell.notFilledIn);
		adjacentCells.forEach(adjacentCell => {
			adjacentCell.possibleValues = adjacentCell.possibleValues.filter(character => character !== value);
		});
	}

	getRowAdjacentSubGridNumbers(subgrid: number): number[] {
		const rowAdjacentGridNumbers: number[] = [];
		const subGridWidthsPerGrid: number = this.gridSize / this.subGridDimensions.width;
		const subgridRow: number = Math.ceil(subgrid / subGridWidthsPerGrid);
		for (let i = 1; i<=this.gridSize; i++) {
			const potentialSubGridRow: number = Math.ceil(i / subGridWidthsPerGrid);
			if ((subgridRow === potentialSubGridRow) && (i !== subgrid)) {
				rowAdjacentGridNumbers.push(i);
			}
		}
		return rowAdjacentGridNumbers;
	}
	getColumnAdjacentSubGridNumbers(subgrid: number): number[] {
		const columnAdjacentGridNumbers: number[] = [];
		const subGridWidthsPerGrid: number = this.gridSize / this.subGridDimensions.height;
		const subgridColumn: number = subgrid % subGridWidthsPerGrid;
		for (let i = 1; i<=this.gridSize; i++) {
			const potentialSubGridColumn: number = i % subGridWidthsPerGrid;
			if ((subgridColumn === potentialSubGridColumn) && (i !== subgrid)) {
				columnAdjacentGridNumbers.push(i);
			}
		}
		return columnAdjacentGridNumbers;
	}

	setValueInRowOfSubGrid(subgrid: number, row: number, value: string) {
		const rowAdjacentSubGrids = this.getRowAdjacentSubGridNumbers(subgrid);
		const adjacentRowCellsNotInSameSubgrid: Cell[] = this.flattenedCells.filter(cell => {
			return rowAdjacentSubGrids.includes(cell.position.subGrid) && cell.position.row === row;
		});
		adjacentRowCellsNotInSameSubgrid.forEach(cell => cell.removeValueFromPossibleValues(value));
	}
	setValueInColumnOfSubGrid(subgrid: number, column: number, value: string) {
		const columnAdjacentSubGrids = this.getColumnAdjacentSubGridNumbers(subgrid);
		const adjacentColumnCellsNotInSameSubgrid: Cell[] = this.flattenedCells.filter(cell => {
			return columnAdjacentSubGrids.includes(cell.position.subGrid) && cell.position.column === column;
		});
		adjacentColumnCellsNotInSameSubgrid.forEach(cell => cell.removeValueFromPossibleValues(value));
	}

	calculateSubGrids() {
		let subgrids: Array<{subgridNumber: number, cells: Array<Cell>}> = [];
		for (let i = 1; i <= this.gridSize; i++) {
			subgrids.push({subgridNumber: i, cells: this.flattenedCells.filter(cell => cell.position.subGrid === i)});
		}
		this.subGrids = subgrids;
	}

	calculateSubGridRowSets() {
		const subGridIndexesOfSubGridRows = this.calculateSubGridIndexesOfSubGridRows();
		const subGridRowSets = subGridIndexesOfSubGridRows.map((array: number[]) => {
				return array.map(num => {
											return this.subGrids.find(subgrid => subgrid.subgridNumber === num)
										})
										.map(subgrid => subgrid.cells);
		});
		this.subGridRowSets = subGridRowSets;
	}
	private calculateSubGridIndexesOfSubGridRows() {
		const subGridIndexesOfSubGridRows = new Set();
		this.subGrids.forEach(subGrid => {
			const subGridNumber = subGrid.subgridNumber;
			const adjacentSubGridRows = this.getRowAdjacentSubGridNumbers(subGridNumber);
			subGridIndexesOfSubGridRows.add(JSON.stringify([subGridNumber, ...adjacentSubGridRows].sort()));
		});
		return Array.from(subGridIndexesOfSubGridRows).map(rowIndexes => JSON.parse(rowIndexes));
	}

	calculateSubGridColumnSets() {
		const subgridIndexesOfSubgridColumns = this.calculateSubGridIndexesOfSubGridColumns();
		const subgridColumnSets = subgridIndexesOfSubgridColumns.map((array: number[]) => {
				return array.map(num => {
											return this.subGrids.find(subgrid => subgrid.subgridNumber === num)
										})
										.map(subgrid => subgrid.cells);
		});
		this.subGridColumnSets = subgridColumnSets;
	}
	private calculateSubGridIndexesOfSubGridColumns() {
		const subgridIndexesOfSubgridColumns = new Set();
		this.subGrids.forEach(subgrid => {
			const subgridNumber = subgrid.subgridNumber;
			const adjacentSubgridColumns = this.getColumnAdjacentSubGridNumbers(subgridNumber);
			subgridIndexesOfSubgridColumns.add(JSON.stringify([subgridNumber, ...adjacentSubgridColumns].sort()));
		});
		return Array.from(subgridIndexesOfSubgridColumns).map(columnIndexes => JSON.parse(columnIndexes));
	}

}