import {Sudoku} from "./Sudoku";
import {SudokuGridArray} from "../models/SudokuGrid";
import {SudokuCharacterSet} from "../models/constants/sudoku-character-sets";
import {CellInput} from "../models/CellInput";
import {Cell} from "./Cell";
import {SubGridDimensions} from "../models/SubGridDimensions";

describe(`Sudoku`, () => {
	let sudoku: Sudoku;
	beforeEach(() => {
		sudoku = new Sudoku();
	});

	describe(`transposeArray`, () => {
		it(`should return the array transposed`, () => {
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.gridSize = 4;
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.characters = characters;
			const makeCell = (row, column, subGrid, value) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value
				};
				return new Cell(cellInput, characters);
			};

			sudoku.gridCells = [
				[makeCell(1, 1, 1, '1'),  makeCell(1, 2, 1, '2'),  makeCell(1, 3, 2, '3'),  makeCell(1, 4, 2, '4')],
				[makeCell(2, 1, 1, null), makeCell(2, 2, 1, '3'),  makeCell(2, 3, 2, '4'),  makeCell(2, 4, 2, '1')],
				[makeCell(3, 1, 3, '3'),  makeCell(3, 2, 3, null), makeCell(3, 3, 4, '1'),  makeCell(3, 4, 4, '2')],
				[makeCell(4, 1, 3, '4'),  makeCell(4, 2, 3, null), makeCell(4, 3, 4, '2'),  makeCell(4, 4, 4, null)]
			];
			const expectedTranspose: Array<Array<Cell>> = [
				[makeCell(1, 1, 1, '1'), makeCell(2, 1, 1, null), makeCell(3, 1, 3, '3'),  makeCell(4, 1, 3, '4')],
				[makeCell(1, 2, 1, '2'), makeCell(2, 2, 1, '3'),  makeCell(3, 2, 3, null), makeCell(4, 2, 3, null)],
				[makeCell(1, 3, 2, '3'), makeCell(2, 3, 2, '4'),  makeCell(3, 3, 4, '1'),  makeCell(4, 3, 4, '2')],
				[makeCell(1, 4, 2, '4'), makeCell(2, 4, 2, '1'),  makeCell(3, 4, 4, '2'),  makeCell(4, 4, 4, null)]
			];
			expect(sudoku.gridCellsTransposed).toEqual(expectedTranspose);
		})
	});

	describe(`subgridWidthsWithinGrid`, () => {
		it(`should return the correct value`, () => {
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.gridSize = 4;
			expect(sudoku.subgridWidthsWithinGrid).toEqual(2);

			sudoku.subGridDimensions = { width: 3, height: 3 };
			sudoku.gridSize = 9;
			expect(sudoku.subgridWidthsWithinGrid).toEqual(3);

			sudoku.subGridDimensions = { width: 2, height: 4 };
			sudoku.gridSize = 8;
			expect(sudoku.subgridWidthsWithinGrid).toEqual(4);

			sudoku.subGridDimensions = { width: 3, height: 4 };
			sudoku.gridSize = 12;
			expect(sudoku.subgridWidthsWithinGrid).toEqual(4);
		});
	});
	describe(`subgridHeightsWithinGrid`, () => {
		it(`should return the correct value`, () => {
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.gridSize = 4;
			expect(sudoku.subgridHeightsWithinGrid).toEqual(2);

			sudoku.subGridDimensions = { width: 3, height: 3 };
			sudoku.gridSize = 9;
			expect(sudoku.subgridHeightsWithinGrid).toEqual(3);

			sudoku.subGridDimensions = { width: 2, height: 4 };
			sudoku.gridSize = 8;
			expect(sudoku.subgridHeightsWithinGrid).toEqual(2);

			sudoku.subGridDimensions = { width: 3, height: 4 };
			sudoku.gridSize = 12;
			expect(sudoku.subgridHeightsWithinGrid).toEqual(3);
		});
	});

	describe(`setGrid`, () => {
		it(`should set the grid property as an array of arrays of cells`, () => {
			const grid: SudokuGridArray = [
				['1',  '2', '3', '4'],
				[null, '3', '4', '1'],
				['3', null, '1', '2'],
				['4', null, '2', null]
			];
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.gridSize = 4;
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.characters = characters;

			const makeCell = (row, column, subGrid, value) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value
				};
				return new Cell(cellInput, characters);
			};
			const expectedGrid: Array<Array<Cell>> = [
				[makeCell(1, 1, 1, '1'),  makeCell(1, 2, 1, '2'),  makeCell(1, 3, 2, '3'),  makeCell(1, 4, 2, '4')],
				[makeCell(2, 1, 1, null), makeCell(2, 2, 1, '3'),  makeCell(2, 3, 2, '4'),  makeCell(2, 4, 2, '1')],
				[makeCell(3, 1, 3, '3'),  makeCell(3, 2, 3, null), makeCell(3, 3, 4, '1'),  makeCell(3, 4, 4, '2')],
				[makeCell(4, 1, 3, '4'),  makeCell(4, 2, 3, null), makeCell(4, 3, 4, '2'),  makeCell(4, 4, 4, null)]
			];
			sudoku.setGrid(grid);
			expect(sudoku.gridCells).toEqual(expectedGrid);
		});
	});

	describe(`flattenedCells`, () => {
		it(`should return the array of cells flattened`, () => {
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.gridSize = 4;
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.characters = characters;

			const makeCell = (row, column, subGrid, value) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value
				};
				return new Cell(cellInput, characters);
			};
			sudoku.gridCells = [
				[makeCell(1, 1, 1, '1'),  makeCell(1, 2, 1, '2'),  makeCell(1, 3, 2, '3'),  makeCell(1, 4, 2, '4')],
				[makeCell(2, 1, 1, null), makeCell(2, 2, 1, '3'),  makeCell(2, 3, 2, '4'),  makeCell(2, 4, 2, '1')],
				[makeCell(3, 1, 3, '3'),  makeCell(3, 2, 3, null), makeCell(3, 3, 4, '1'),  makeCell(3, 4, 4, '2')],
				[makeCell(4, 1, 3, '4'),  makeCell(4, 2, 3, null), makeCell(4, 3, 4, '2'),  makeCell(4, 4, 4, null)]
			];
			const expectedFlattenedCells = [
				makeCell(1, 1, 1, '1'),  makeCell(1, 2, 1, '2'),  makeCell(1, 3, 2, '3'),  makeCell(1, 4, 2, '4'),
				makeCell(2, 1, 1, null), makeCell(2, 2, 1, '3'),  makeCell(2, 3, 2, '4'),  makeCell(2, 4, 2, '1'),
				makeCell(3, 1, 3, '3'),  makeCell(3, 2, 3, null), makeCell(3, 3, 4, '1'),  makeCell(3, 4, 4, '2'),
				makeCell(4, 1, 3, '4'),  makeCell(4, 2, 3, null), makeCell(4, 3, 4, '2'),  makeCell(4, 4, 4, null)
			];
			expect(sudoku.flattenedCells).toEqual(expectedFlattenedCells);
		});
	});

	describe(`get rawGrid`, () => {
		it(`should return the expected grid`, () => {
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.gridSize = 4;
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.characters = characters;

			const makeCell = (row, column, subGrid, value) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value
				};
				return new Cell(cellInput, characters);
			};
			sudoku.gridCells = [
				[makeCell(1, 1, 1, '1'),  makeCell(1, 2, 1, '2'),  makeCell(1, 3, 2, '3'),  makeCell(1, 4, 2, '4')],
				[makeCell(2, 1, 1, null), makeCell(2, 2, 1, '3'),  makeCell(2, 3, 2, '4'),  makeCell(2, 4, 2, '1')],
				[makeCell(3, 1, 3, '3'),  makeCell(3, 2, 3, null), makeCell(3, 3, 4, '1'),  makeCell(3, 4, 4, '2')],
				[makeCell(4, 1, 3, '4'),  makeCell(4, 2, 3, null), makeCell(4, 3, 4, '2'),  makeCell(4, 4, 4, null)]
			];
			const expectedRawGrid: SudokuGridArray = [
				['1',  '2', '3', '4'],
				[null, '3', '4', '1'],
				['3', null, '1', '2'],
				['4', null, '2', null]
			];
			expect(sudoku.rawGrid).toEqual(expectedRawGrid);
		});
	});

	describe(`calculateSubGridNumber`, () => {
		it(`should correctly calculate the subGridNumber`, () => {
			sudoku.subGridDimensions = { width: 3, height: 3 };
			sudoku.gridSize = 9;
			expect(sudoku.calculateSubGridNumber(1, 1)).toBe(1);
			expect(sudoku.calculateSubGridNumber(1, 3)).toBe(1);
			expect(sudoku.calculateSubGridNumber(3, 1)).toBe(1);
			expect(sudoku.calculateSubGridNumber(3, 3)).toBe(1);

			expect(sudoku.calculateSubGridNumber(1, 4)).toBe(2);
			expect(sudoku.calculateSubGridNumber(1, 6)).toBe(2);
			expect(sudoku.calculateSubGridNumber(3, 4)).toBe(2);
			expect(sudoku.calculateSubGridNumber(3, 6)).toBe(2);

			expect(sudoku.calculateSubGridNumber(1, 7)).toBe(3);
			expect(sudoku.calculateSubGridNumber(1, 9)).toBe(3);
			expect(sudoku.calculateSubGridNumber(3, 7)).toBe(3);
			expect(sudoku.calculateSubGridNumber(3, 9)).toBe(3);

			expect(sudoku.calculateSubGridNumber(4, 1)).toBe(4);
			expect(sudoku.calculateSubGridNumber(4, 3)).toBe(4);
			expect(sudoku.calculateSubGridNumber(6, 1)).toBe(4);
			expect(sudoku.calculateSubGridNumber(6, 3)).toBe(4);

			expect(sudoku.calculateSubGridNumber(4, 4)).toBe(5);
			expect(sudoku.calculateSubGridNumber(4, 6)).toBe(5);
			expect(sudoku.calculateSubGridNumber(6, 4)).toBe(5);
			expect(sudoku.calculateSubGridNumber(6, 6)).toBe(5);

			expect(sudoku.calculateSubGridNumber(4, 7)).toBe(6);
			expect(sudoku.calculateSubGridNumber(4, 9)).toBe(6);
			expect(sudoku.calculateSubGridNumber(6, 7)).toBe(6);
			expect(sudoku.calculateSubGridNumber(6, 9)).toBe(6);

			expect(sudoku.calculateSubGridNumber(7, 1)).toBe(7);
			expect(sudoku.calculateSubGridNumber(7, 3)).toBe(7);
			expect(sudoku.calculateSubGridNumber(9, 1)).toBe(7);
			expect(sudoku.calculateSubGridNumber(9, 3)).toBe(7);

			expect(sudoku.calculateSubGridNumber(7, 4)).toBe(8);
			expect(sudoku.calculateSubGridNumber(7, 6)).toBe(8);
			expect(sudoku.calculateSubGridNumber(9, 4)).toBe(8);
			expect(sudoku.calculateSubGridNumber(9, 6)).toBe(8);

			expect(sudoku.calculateSubGridNumber(7, 7)).toBe(9);
			expect(sudoku.calculateSubGridNumber(7, 9)).toBe(9);
			expect(sudoku.calculateSubGridNumber(9, 7)).toBe(9);
			expect(sudoku.calculateSubGridNumber(9, 9)).toBe(9);

			sudoku.subGridDimensions = { width: 2, height: 4 };
			sudoku.gridSize = 8;
			expect(sudoku.calculateSubGridNumber(5, 5)).toBe(7);
		});
	});

	describe(`get adjacent cells`, () => {
		let characters: SudokuCharacterSet;
		let makeCell;
		beforeEach(() => {
			characters = ['1', '2', '3', '4'];
			sudoku.gridSize = 4;
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.characters = characters;

			makeCell = (row, column, subGrid, value) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value
				};
				return new Cell(cellInput, characters);
			};
			sudoku.gridCells = [
				[makeCell(1, 1, 1, '1'),  makeCell(1, 2, 1, '2'),  makeCell(1, 3, 2, '3'),  makeCell(1, 4, 2, '4')],
				[makeCell(2, 1, 1, null), makeCell(2, 2, 1, '3'),  makeCell(2, 3, 2, '4'),  makeCell(2, 4, 2, '1')],
				[makeCell(3, 1, 3, '3'),  makeCell(3, 2, 3, null), makeCell(3, 3, 4, '1'),  makeCell(3, 4, 4, '2')],
				[makeCell(4, 1, 3, '4'),  makeCell(4, 2, 3, null), makeCell(4, 3, 4, '2'),  makeCell(4, 4, 4, null)]
			];
		});

		describe(`getAdjacentCellsInRow`, () => {
			it(`should get only the other cells in the relevant subgrid`, () => {
				const actualOutput = sudoku.getAdjacentCellsInRow({row: 1, column: 1, subGrid: 1});
				const expectedOutput = [makeCell(1, 2, 1, '2'),  makeCell(1, 3, 2, '3'),  makeCell(1, 4, 2, '4')];
				expect(actualOutput).toEqual(expectedOutput);
			});
		});
		describe(`getAdjacentCellsInColumn`, () => {
			it(`should get only the other cells in the relevant column`, () => {
				const actualOutput = sudoku.getAdjacentCellsInColumn({row: 3, column: 1, subGrid: 3});
				const expectedOutput = [makeCell(1, 1, 1, '1'), makeCell(2, 1, 1, null), makeCell(4, 1, 3, '4')];
				expect(actualOutput).toEqual(expectedOutput);
			});
		});
		describe(`getAdjacentCellsInSubGrid`, () => {
			it(`should get only the other cells in the relevant subgrid`, () => {
				const actualOutput = sudoku.getAdjacentCellsInSubGrid({row: 3, column: 3, subGrid: 4});
				const expectedOutput = [makeCell(3, 4, 4, '2'), makeCell(4, 3, 4, '2'), makeCell(4, 4, 4, null)];
				expect(actualOutput).toEqual(expectedOutput);
			});
		});
	});

	describe(`setCellValue`, () => {
		let characters: SudokuCharacterSet;
		let makeNullCell;
		beforeEach(() => {
			characters = ['1', '2', '3', '4'];
			sudoku.gridSize = 4;
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.characters = characters;

			makeNullCell = (row, column, subGrid) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value: null
				};
				return new Cell(cellInput, characters);
			};
			sudoku.gridCells = [
				[makeNullCell(1, 1, 1), makeNullCell(1, 2, 1), makeNullCell(1, 3, 2), makeNullCell(1, 4, 2)],
				[makeNullCell(2, 1, 1), makeNullCell(2, 2, 1), makeNullCell(2, 3, 2), makeNullCell(2, 4, 2)],
				[makeNullCell(3, 1, 3), makeNullCell(3, 2, 3), makeNullCell(3, 3, 4), makeNullCell(3, 4, 4)],
				[makeNullCell(4, 1, 3), makeNullCell(4, 2, 3), makeNullCell(4, 3, 4), makeNullCell(4, 4, 4)]
			];
		});

		it(`should set the value of the cell and remove the value from all adjacent cell's possibilities`, () => {
			const remainingCharacters = ['2', '3', '4'];
			const makeAdjustedCell = (row, column, subGrid, value) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value
				};
				const cell = new Cell(cellInput, characters);
				cell.possibleValues = remainingCharacters;
				return cell;
			};
			sudoku.gridCells.forEach(row => {
				row.forEach(cell => {
					expect(cell.possibleValues).toEqual(characters);
				})
			});
			sudoku.setCellValue({row: 1, column: 2, subGrid: 1}, '1');
			expect(sudoku.gridCells[0][0]).toEqual(makeAdjustedCell(1, 1, 1, null));
			expect(sudoku.gridCells[0][2]).toEqual(makeAdjustedCell(1, 3, 2, null));
			expect(sudoku.gridCells[0][3]).toEqual(makeAdjustedCell(1, 4, 2, null));

			expect(sudoku.gridCells[1][1]).toEqual(makeAdjustedCell(2, 2, 1, null));
			expect(sudoku.gridCells[2][1]).toEqual(makeAdjustedCell(3, 2, 3, null));
			expect(sudoku.gridCells[3][1]).toEqual(makeAdjustedCell(4, 2, 3, null));

			expect(sudoku.gridCells[1][0]).toEqual(makeAdjustedCell(2, 1, 1, null));

			const adjustedCell = new Cell({position: {row: 1, column: 2, subGrid: 1}, value: '1'}, characters);
			expect(sudoku.gridCells[0][1]).toEqual(adjustedCell);
		});
	});

	describe(`getRowAdjacentSubGridNumbers`, () => {
		it(`should return an array of the adjacent subgrid numbers`, () => {
			sudoku.subGridDimensions = { width: 3, height: 3 };
			sudoku.gridSize = 9;
			expect(sudoku.getRowAdjacentSubGridNumbers(1)).toEqual([2,3]);
			expect(sudoku.getRowAdjacentSubGridNumbers(2)).toEqual([1,3]);
			expect(sudoku.getRowAdjacentSubGridNumbers(3)).toEqual([1,2]);
			expect(sudoku.getRowAdjacentSubGridNumbers(4)).toEqual([5,6]);
			expect(sudoku.getRowAdjacentSubGridNumbers(5)).toEqual([4,6]);
			expect(sudoku.getRowAdjacentSubGridNumbers(6)).toEqual([4,5]);
			expect(sudoku.getRowAdjacentSubGridNumbers(7)).toEqual([8,9]);
			expect(sudoku.getRowAdjacentSubGridNumbers(8)).toEqual([7,9]);
			expect(sudoku.getRowAdjacentSubGridNumbers(9)).toEqual([7,8]);


			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.gridSize = 4;
			expect(sudoku.getRowAdjacentSubGridNumbers(1)).toEqual([2]);
			expect(sudoku.getRowAdjacentSubGridNumbers(2)).toEqual([1]);
			expect(sudoku.getRowAdjacentSubGridNumbers(3)).toEqual([4]);
			expect(sudoku.getRowAdjacentSubGridNumbers(4)).toEqual([3]);
		});
	});

	describe(`getColumnAdjacentSubGridNumbers`, () => {
		it(`should return an array of the adjacent subgrid numbers`, () => {
			sudoku.subGridDimensions = { width: 3, height: 3 };
			sudoku.gridSize = 9;
			expect(sudoku.getColumnAdjacentSubGridNumbers(1)).toEqual([4,7]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(2)).toEqual([5,8]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(3)).toEqual([6,9]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(4)).toEqual([1,7]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(5)).toEqual([2,8]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(6)).toEqual([3,9]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(7)).toEqual([1,4]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(8)).toEqual([2,5]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(9)).toEqual([3,6]);


			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.gridSize = 4;
			expect(sudoku.getColumnAdjacentSubGridNumbers(1)).toEqual([3]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(2)).toEqual([4]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(3)).toEqual([1]);
			expect(sudoku.getColumnAdjacentSubGridNumbers(4)).toEqual([2]);
		});
	});

	describe(`setValueInRowOfSubGrid`, () => {
		it(`should remove the value from possible values of same row in row-adjacent sub grids`, () => {
			const characters = ['1', '2', '3', '4'];
			const makeNullCell = (row, column, subGrid) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value: null
				};
				return new Cell(cellInput, characters);
			};
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.gridSize = 4;
			sudoku.gridCells = [
				[makeNullCell(1, 1, 1), makeNullCell(1, 2, 1), makeNullCell(1, 3, 2), makeNullCell(1, 4, 2)],
				[makeNullCell(2, 1, 1), makeNullCell(2, 2, 1), makeNullCell(2, 3, 2), makeNullCell(2, 4, 2)],
				[makeNullCell(3, 1, 3), makeNullCell(3, 2, 3), makeNullCell(3, 3, 4), makeNullCell(3, 4, 4)],
				[makeNullCell(4, 1, 3), makeNullCell(4, 2, 3), makeNullCell(4, 3, 4), makeNullCell(4, 4, 4)]
			];
			let adjacentSubGridRow: Array<Cell> = [sudoku.gridCells[0][2], sudoku.gridCells[0][3]];
			adjacentSubGridRow.forEach(cell => expect(cell.possibleValues).toEqual(characters));
			sudoku.setValueInRowOfSubGrid(1, 1, '1');
			const remainingCharacters = characters.filter(char => char !== '1');
			adjacentSubGridRow.forEach(cell => expect(cell.possibleValues).toEqual(remainingCharacters));
		});
	});

	describe(`setValueInColumnOfSubGrid`, () => {
		it(`should remove the value from possible values of same row in column-adjacent sub grids`, () => {
			const characters = ['1', '2', '3', '4'];
			const makeNullCell = (row, column, subGrid) => {
				const cellInput: CellInput = {
					position: { row, column, subGrid},
					value: null
				};
				return new Cell(cellInput, characters);
			};
			sudoku.subGridDimensions = { width: 2, height: 2 };
			sudoku.gridSize = 4;
			sudoku.gridCells = [
				[makeNullCell(1, 1, 1), makeNullCell(1, 2, 1), makeNullCell(1, 3, 2), makeNullCell(1, 4, 2)],
				[makeNullCell(2, 1, 1), makeNullCell(2, 2, 1), makeNullCell(2, 3, 2), makeNullCell(2, 4, 2)],
				[makeNullCell(3, 1, 3), makeNullCell(3, 2, 3), makeNullCell(3, 3, 4), makeNullCell(3, 4, 4)],
				[makeNullCell(4, 1, 3), makeNullCell(4, 2, 3), makeNullCell(4, 3, 4), makeNullCell(4, 4, 4)]
			];
			let adjacentSubGridColumn: Array<Cell> = [sudoku.gridCells[2][0], sudoku.gridCells[3][0]];
			adjacentSubGridColumn.forEach(cell => expect(cell.possibleValues).toEqual(characters));
			sudoku.setValueInColumnOfSubGrid(1, 1, '1');
			const remainingCharacters = characters.filter(char => char !== '1');
			adjacentSubGridColumn.forEach(cell => expect(cell.possibleValues).toEqual(remainingCharacters));
		});
	});

	describe(`calculateSubGrids`, () => {
		const rawGrid: SudokuGridArray = [
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null]
		];
		const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
		const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
		let sudoku: Sudoku;
		let r1c1, r1c2, r1c3, r1c4,
				r2c1, r2c2, r2c3, r2c4,
				r3c1, r3c2, r3c3, r3c4,
				r4c1, r4c2, r4c3, r4c4;
		let subgrid1: Array<Cell>,
			subgrid2: Array<Cell>,
			subgrid3: Array<Cell>,
			subgrid4: Array<Cell>,
			subgrids: Array<Array<Cell>>;
		beforeEach(() => {
			sudoku = new Sudoku();
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			r1c1 = sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 1);
			r1c2 = sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 2);
			r1c3 = sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 3);
			r1c4 = sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 4);
			r2c1 = sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 1);
			r2c2 = sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 2);
			r2c3 = sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 3);
			r2c4 = sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 4);
			r3c1 = sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 1);
			r3c2 = sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 2);
			r3c3 = sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 3);
			r3c4 = sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 4);
			r4c1 = sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 1);
			r4c2 = sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 2);
			r4c3 = sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 3);
			r4c4 = sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 4);
			subgrid1 = [r1c1, r1c2, r2c1, r2c2];
			subgrid2 = [r1c3, r1c4, r2c3, r2c4];
			subgrid3 = [r3c1, r3c2, r4c1, r4c2];
			subgrid4 = [r3c3, r3c4, r4c3, r4c4];
			subgrids = [subgrid1, subgrid2, subgrid3, subgrid4];
		});

		describe(`calculateSubgrids`, () => {
			it(`should calculate the correct subgrids`, () => {
				sudoku.calculateSubGrids();
				expect(sudoku.subGrids).toEqual(subgrids.map((subgrid, idx) => ({subgridNumber: idx+1, cells: subgrid})));
			});
		});

		describe(`calculateSubgridRowSets`, () => {
			it(`should return the correct subgrid rows`, () => {
				sudoku.calculateSubGridRowSets();
				const actualOutput = sudoku.subGridRowSets;
				const expectedOutput = [
					[subgrid1, subgrid2],
					[subgrid3, subgrid4]
				];
				expect(actualOutput).toEqual(expectedOutput);
			});
		});
		describe(`calculateSubgridColumnSets`, () => {
			it(`should return the correct subgrid columns`, () => {
				sudoku.calculateSubGridColumnSets();
				const actualOutput = sudoku.subGridColumnSets;
				const expectedOutput = [
					[subgrid1, subgrid3],
					[subgrid2, subgrid4]
				];
				expect(actualOutput).toEqual(expectedOutput);
			});
		});
	});


});