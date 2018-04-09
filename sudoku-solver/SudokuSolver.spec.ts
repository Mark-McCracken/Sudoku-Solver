import {SudokuSolver} from "./SudokuSolver";
import {Sudoku} from "./Sudoku";
import {SubGridDimensions} from "../models/SubGridDimensions";
import {SudokuGridArray, SudokuGridCells} from "../models/SudokuGrid";
import {standardCharacterSet, SudokuCharacterSet} from "../models/constants/sudoku-character-sets";
import {Cell} from "./Cell";
import {CellPosition} from "../models/CellInput";

describe(`sudokuSolver`, () => {
	let sudokuSolver: SudokuSolver;
	beforeEach(() => {
		sudokuSolver = new SudokuSolver();
	});

	describe(`runIterationCycles`, () => {
		beforeEach(() => {
			spyOn(console, 'log').and.stub();
			const sudoku = new Sudoku();
			const rawGrid: SudokuGridArray = [
				['1',  '2', '3', '4'],
				[null, '3', '4', '1'],
				['3', null, '1', '2'],
				['4', null, '2', null]
			];
			const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			sudokuSolver.sudoku = sudoku;
		});
		it(`should stop running if no process is made`, () => {
			spyOn(sudokuSolver, 'checkRowsForEntireRowFullButOne').and.stub();
			spyOn(sudokuSolver, 'checkColumnsForEntireColumnFullButOne').and.stub();
			spyOn(sudokuSolver, 'checkSubGridsForEntireSubGridFullButOne').and.stub();
			spyOn(sudokuSolver, 'removeImpossiblePossibilities').and.stub();
			spyOn(sudokuSolver, 'checkCellsForOnlyOneValuePossibility').and.stub();
			spyOn(sudokuSolver, 'checkCellsForNoAdjacentCellAbleToHoldPossibility').and.stub();
			spyOn(sudokuSolver, 'checkSubgridPossibleValuesConstrainedToSingleRowOrColumn').and.stub();
			spyOn(sudokuSolver, 'checkAdjacentSubgridRowsAndColumns').and.stub();

			sudokuSolver.runIterationCycles();

			expect(sudokuSolver.progressMade).toBe(false);

			expect(sudokuSolver.checkRowsForEntireRowFullButOne).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkColumnsForEntireColumnFullButOne).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkSubGridsForEntireSubGridFullButOne).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.removeImpossiblePossibilities).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkCellsForOnlyOneValuePossibility).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkCellsForNoAdjacentCellAbleToHoldPossibility).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRowOrColumn).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkAdjacentSubgridRowsAndColumns).toHaveBeenCalledTimes(1);
		});
		it(`should stop running if the sudoku is complete`, () => {
			spyOn(sudokuSolver, 'checkRowsForEntireRowFullButOne').and.stub();
			spyOn(sudokuSolver, 'checkColumnsForEntireColumnFullButOne').and.stub();
			spyOn(sudokuSolver, 'checkSubGridsForEntireSubGridFullButOne').and.stub();
			spyOn(sudokuSolver, 'removeImpossiblePossibilities').and.stub();
			spyOn(sudokuSolver, 'checkCellsForOnlyOneValuePossibility').and.stub();
			spyOn(sudokuSolver, 'checkCellsForNoAdjacentCellAbleToHoldPossibility').and.stub();
			spyOn(sudokuSolver, 'checkSubgridPossibleValuesConstrainedToSingleRowOrColumn').and.stub();
			spyOn(sudokuSolver, 'checkAdjacentSubgridRowsAndColumns').and.stub();

			spyOn(sudokuSolver.sudokuValidator, 'sudokuIsComplete').and.returnValue(true);

			sudokuSolver.runIterationCycles();

			expect(sudokuSolver.progressMade).toBe(false);

			expect(sudokuSolver.checkRowsForEntireRowFullButOne).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkColumnsForEntireColumnFullButOne).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkSubGridsForEntireSubGridFullButOne).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.removeImpossiblePossibilities).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkCellsForOnlyOneValuePossibility).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkCellsForNoAdjacentCellAbleToHoldPossibility).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRowOrColumn).toHaveBeenCalledTimes(1);
			expect(sudokuSolver.checkAdjacentSubgridRowsAndColumns).toHaveBeenCalledTimes(1);
		});

		it(`should continue running until no progress is made`, () => {
			let progressMadeCounter = 0;
			spyOn(sudokuSolver, 'checkRowsForEntireRowFullButOne').and.stub();
			spyOn(sudokuSolver, 'checkColumnsForEntireColumnFullButOne').and.stub();
			spyOn(sudokuSolver, 'checkSubGridsForEntireSubGridFullButOne').and.stub();
			spyOn(sudokuSolver, 'removeImpossiblePossibilities').and.stub();
			spyOn(sudokuSolver, 'checkCellsForOnlyOneValuePossibility').and.stub();
			spyOn(sudokuSolver, 'checkSubgridPossibleValuesConstrainedToSingleRowOrColumn').and.stub();
			spyOn(sudokuSolver, 'checkAdjacentSubgridRowsAndColumns').and.stub();
			spyOn(sudokuSolver, 'checkCellsForNoAdjacentCellAbleToHoldPossibility').and.callFake(() => {
				if (++progressMadeCounter < 3) {
					sudokuSolver.sudoku.flattenedCells.forEach(cell => {
						if (cell.filledIn) {
							cell.value = null;
						} else {
							cell.value = '1';
						}
					});
				}
			});

			spyOn(sudokuSolver.sudokuValidator, 'sudokuIsComplete').and.returnValue(false);
			sudokuSolver.runIterationCycles();


			expect(sudokuSolver.checkRowsForEntireRowFullButOne).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkColumnsForEntireColumnFullButOne).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkSubGridsForEntireSubGridFullButOne).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.removeImpossiblePossibilities).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkCellsForOnlyOneValuePossibility).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkCellsForNoAdjacentCellAbleToHoldPossibility).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRowOrColumn).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkAdjacentSubgridRowsAndColumns).toHaveBeenCalledTimes(3);
		});
		it(`should continue running until the sudoku is complete`, () => {
			let completedValue = false;
			spyOn(sudokuSolver.sudokuValidator, 'sudokuIsComplete').and.callFake(() => completedValue);
			let iterationCounter = 0;
			spyOn(sudokuSolver, 'checkRowsForEntireRowFullButOne').and.stub();
			spyOn(sudokuSolver, 'checkColumnsForEntireColumnFullButOne').and.stub();
			spyOn(sudokuSolver, 'checkSubGridsForEntireSubGridFullButOne').and.stub();
			spyOn(sudokuSolver, 'removeImpossiblePossibilities').and.stub();
			spyOn(sudokuSolver, 'checkCellsForOnlyOneValuePossibility').and.stub();
			spyOn(sudokuSolver, 'checkSubgridPossibleValuesConstrainedToSingleRowOrColumn').and.stub();
			spyOn(sudokuSolver, 'checkAdjacentSubgridRowsAndColumns').and.stub();
			spyOn(sudokuSolver, 'checkCellsForNoAdjacentCellAbleToHoldPossibility').and.callFake(() => {
				sudokuSolver.sudoku.flattenedCells.forEach(cell => {
					if (cell.filledIn) {
						cell.value = null;
					} else {
						cell.value = '1';
					}
				});
				if (++iterationCounter >= 3) {
					completedValue = true;
				}
			});

			sudokuSolver.runIterationCycles();

			expect(sudokuSolver.checkRowsForEntireRowFullButOne).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkColumnsForEntireColumnFullButOne).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkSubGridsForEntireSubGridFullButOne).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.removeImpossiblePossibilities).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkCellsForOnlyOneValuePossibility).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkCellsForNoAdjacentCellAbleToHoldPossibility).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRowOrColumn).toHaveBeenCalledTimes(3);
			expect(sudokuSolver.checkAdjacentSubgridRowsAndColumns).toHaveBeenCalledTimes(3);
		});
	});

	describe(`checkForSingleItemsMissingCombinations`, () => {
		beforeEach(() => {
			const sudoku = new Sudoku();
			const rawGrid: SudokuGridArray = [
				['1',  '2', '3', '4'],
				[null, '3', '4', '1'],
				['3', null, '1', '2'],
				['4', null, '2', null]
			];
			const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			sudokuSolver.sudoku = sudoku;
		});

		describe(`cellFindingFunctions`, () => {
			beforeEach(() => {
				spyOn(sudokuSolver, 'checkForSingleValueMissing').and.stub();
			});

			describe(`checkRowsForEntireRowFullButOne`, () => {
				it(`should call the checkForSingleMissing the correct number of times`, () => {
					sudokuSolver.checkRowsForEntireRowFullButOne();
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledTimes(4);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.gridCells[0]);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.gridCells[1]);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.gridCells[2]);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.gridCells[3]);
				});
			});

			describe(`checkColumnsForEntireColumnFullButOne`, () => {
				it(`should call the checkForSingleMissing the correct number of times`, () => {
					sudokuSolver.checkColumnsForEntireColumnFullButOne();
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledTimes(4);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.gridCellsTransposed[0]);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.gridCellsTransposed[1]);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.gridCellsTransposed[2]);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.gridCellsTransposed[3]);
				});
			});

			describe(`checkSubGridsForEntireSubGridFullButOne`, () => {
				it(`should call the checkForSingleMissing the correct number of times`, () => {
					sudokuSolver.checkSubGridsForEntireSubGridFullButOne();
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledTimes(4);
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.flattenedCells.filter(cell => cell.position.subGrid === 1));
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.flattenedCells.filter(cell => cell.position.subGrid === 2));
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.flattenedCells.filter(cell => cell.position.subGrid === 3));
					expect(sudokuSolver.checkForSingleValueMissing).toHaveBeenCalledWith(sudokuSolver.sudoku.flattenedCells.filter(cell => cell.position.subGrid === 4));
				});
			});
		});

		describe(`checkForSingleValueMissing`, () => {
			beforeEach(() => {
				spyOn(sudokuSolver.sudoku, 'setCellValue').and.stub();
			});

			it(`should not call sudoku.setVellValue if every cell is filled in`, () => {
				const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
				const position1: CellPosition = { row: 1, column: 1, subGrid: 7 };
				const value1 = '1';
				const position2: CellPosition = { row: 1, column: 2, subGrid: 3 };
				const value2 = '1';
				const position3: CellPosition = { row: 2, column: 4, subGrid: 1 };
				const value3 = '1';
				const position4: CellPosition = { row: 2, column: 5, subGrid: 8 };
				const value4 = '1';
				const cell1 = new Cell({position: position1, value: value1}, characters);
				const cell2 = new Cell({position: position2, value: value2}, characters);
				const cell3 = new Cell({position: position3, value: value3}, characters);
				const cell4 = new Cell({position: position4, value: value4}, characters);
				const cells = [cell1, cell2, cell3, cell4];
				sudokuSolver.checkForSingleValueMissing(cells);
				expect(sudokuSolver.sudoku.setCellValue).not.toHaveBeenCalled();
			});
			it(`should not call sudoku.setVellValue if more than one cell is not filled in`, () => {
				const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
				const position1: CellPosition = { row: 1, column: 1, subGrid: 7 };
				const value1 = null;
				const position2: CellPosition = { row: 1, column: 2, subGrid: 3 };
				const value2 = null;
				const position3: CellPosition = { row: 2, column: 4, subGrid: 1 };
				const value3 = '1';
				const position4: CellPosition = { row: 2, column: 5, subGrid: 8 };
				const value4 = '1';
				const cell1 = new Cell({position: position1, value: value1}, characters);
				const cell2 = new Cell({position: position2, value: value2}, characters);
				const cell3 = new Cell({position: position3, value: value3}, characters);
				const cell4 = new Cell({position: position4, value: value4}, characters);
				const cells = [cell1, cell2, cell3, cell4];
				sudokuSolver.checkForSingleValueMissing(cells);
				expect(sudokuSolver.sudoku.setCellValue).not.toHaveBeenCalled();
			});
			it(`should call sudoku.setVellValue if exactly one cell is not filled in`, () => {
				spyOn(Cell, 'filledIn').and.callThrough();
				spyOn(Cell, 'notFilledIn').and.callThrough();
				const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
				const position1: CellPosition = { row: 1, column: 1, subGrid: 7 };
				const value1 = null;
				const position2: CellPosition = { row: 1, column: 2, subGrid: 3 };
				const value2 = '2';
				const position3: CellPosition = { row: 2, column: 4, subGrid: 1 };
				const value3 = '3';
				const position4: CellPosition = { row: 2, column: 5, subGrid: 8 };
				const value4 = '4';
				const cell1 = new Cell({position: position1, value: value1}, characters);
				const cell2 = new Cell({position: position2, value: value2}, characters);
				const cell3 = new Cell({position: position3, value: value3}, characters);
				const cell4 = new Cell({position: position4, value: value4}, characters);
				const cells = [cell1, cell2, cell3, cell4];
				sudokuSolver.checkForSingleValueMissing(cells);
				const missingValue = characters.find(char => ![value2, value3, value4].includes(char));
				expect(cells.every(Cell.filledIn)).toBe(false);
				expect(cells.filter(Cell.notFilledIn).length).toBe(1);
				expect(sudokuSolver.sudoku.setCellValue).toHaveBeenCalledWith(position1, missingValue);
			});
		});
	});

	describe(`removeImpossiblePossibilities`, () => {
		it(`should remove the possibilities where there is an adjacent value`, () => {
			const sudoku = new Sudoku();
			const rawGrid: SudokuGridArray = [
				['1',  null, '4' , null],
				[null, null, null, '3' ],
				[null, null, null, null],
				[null, null, '2' , null]
			];
			const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			sudokuSolver.sudoku = sudoku;
			const r1c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 2);
			expect(r1c2.possibleValues).toEqual(sudokuSolver.sudoku.characters);
			const r1c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 4);
			expect(r1c4.possibleValues).toEqual(sudokuSolver.sudoku.characters);
			const r3c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 4);
			expect(r3c4.possibleValues).toEqual(sudokuSolver.sudoku.characters);
			sudokuSolver.removeImpossiblePossibilities();
			expect(r1c2.possibleValues).toEqual(['2', '3']);
			expect(r1c4.possibleValues).toEqual(['2']);
			expect(r3c4.possibleValues).toEqual(['1', '4']);
		});
	});

	describe(`checkCellsForOnlyOneValuePossibility`, () => {
		it(`should set any cells as the last remaining value if only one value remains in the possibleValuesList`, () => {
			const sudoku = new Sudoku();
			const rawGrid: SudokuGridArray = [
				['1',  null, '4' , null],
				[null, null, null, '3' ],
				[null, null, null, null],
				[null, null, '2' , null]
			];
			const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			sudokuSolver.sudoku = sudoku;
			const r1c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 2);
			r1c2.possibleValues = ['2'];
			spyOn(sudokuSolver.sudoku, 'setCellValue');
			sudokuSolver.checkCellsForOnlyOneValuePossibility();
			expect(sudokuSolver.sudoku.setCellValue).toHaveBeenCalledWith(r1c2.position, '2');
		});
	});

	describe(`checkCellsForNoAdjacentCellAbleToHoldPossibility`, () => {
		const rawGrid: SudokuGridArray = [
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null]
		];
		const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
		const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
		let sudoku: Sudoku;
		let r1c1, r1c2, r1c3, r1c4, r2c1, r3c1, r4c1, r2c2;
		beforeEach(() => {
			sudoku = new Sudoku();
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			sudokuSolver.sudoku = sudoku;
			r1c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 1);
			r1c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 2);
			r1c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 3);
			r1c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 4);
			r2c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 1);
			r3c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 1);
			r4c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 1);
			r2c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 2);
		});
		it(`should set any cells with the value if it's the only place that value can go in that row`, () => {
			expect(r1c1.possibleValues).toEqual(characters);
			r1c2.possibleValues = ['2', '3', '4'];
			r1c3.possibleValues = ['2', '3', '4'];
			r1c4.possibleValues = ['2', '3', '4'];
			r2c1.possibleValues = ['1', '2', '3', '4'];
			r3c1.possibleValues = ['2', '3', '4'];
			r4c1.possibleValues = ['2', '3', '4'];
			r2c2.possibleValues = ['1', '2', '3', '4'];

			spyOn(sudokuSolver.sudoku, 'setCellValue');
			sudokuSolver.checkCellsForNoAdjacentCellAbleToHoldPossibility();
			expect(sudokuSolver.sudoku.setCellValue).toHaveBeenCalledWith(r1c1.position, '1');
		});
		it(`should set any cells with the value if it's the only place that value can go in that cell`, () => {
			expect(r1c1.possibleValues).toEqual(characters);
			r1c2.possibleValues = ['2', '3', '4'];
			r1c3.possibleValues = ['2', '3', '4'];
			r1c4.possibleValues = ['1', '2', '3', '4'];
			r2c1.possibleValues = ['2', '3', '4'];
			r3c1.possibleValues = ['2', '3', '4'];
			r4c1.possibleValues = ['1', '2', '3', '4'];
			r2c2.possibleValues = ['2', '3', '4'];

			spyOn(sudokuSolver.sudoku, 'setCellValue');
			sudokuSolver.checkCellsForNoAdjacentCellAbleToHoldPossibility();
			expect(sudokuSolver.sudoku.setCellValue).toHaveBeenCalledWith(r1c1.position, '1');
		});
		it(`should set any cells with the value if it's the only place that value can go in that column`, () => {
			expect(r1c1.possibleValues).toEqual(characters);
			r1c2.possibleValues = ['2', '3', '4'];
			r1c3.possibleValues = ['2', '3', '4'];
			r1c4.possibleValues = ['1', '2', '3', '4'];
			r2c1.possibleValues = ['2', '3', '4'];
			r3c1.possibleValues = ['2', '3', '4'];
			r4c1.possibleValues = ['2', '3', '4'];
			r2c2.possibleValues = ['1', '2', '3', '4'];

			spyOn(sudokuSolver.sudoku, 'setCellValue');
			sudokuSolver.checkCellsForNoAdjacentCellAbleToHoldPossibility();
			expect(sudokuSolver.sudoku.setCellValue).toHaveBeenCalledWith(r1c1.position, '1');
		});
		it(`should not set any cells if the value could be in an adjacent cell`, () => {
			expect(r1c1.possibleValues).toEqual(characters);
			r1c2.possibleValues = ['2', '3', '4'];
			r1c3.possibleValues = ['2', '3', '4'];
			r1c4.possibleValues = ['1', '2', '3', '4'];
			r2c1.possibleValues = ['2', '3', '4'];
			r3c1.possibleValues = ['2', '3', '4'];
			r4c1.possibleValues = ['1', '2', '3', '4'];
			r2c2.possibleValues = ['1', '2', '3', '4'];

			spyOn(sudokuSolver.sudoku, 'setCellValue');
			sudokuSolver.checkCellsForNoAdjacentCellAbleToHoldPossibility();
			expect(sudokuSolver.sudoku.setCellValue).not.toHaveBeenCalled();
		});
	});

	describe(`checkSubgridPossibleValuesConstrainedToSingleRowOrColumn`, () => {
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
			sudokuSolver.sudoku = sudoku;
			r1c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 1);
			r1c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 2);
			r1c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 3);
			r1c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 4);
			r2c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 1);
			r2c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 2);
			r2c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 3);
			r2c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 4);
			r3c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 1);
			r3c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 2);
			r3c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 3);
			r3c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 4);
			r4c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 1);
			r4c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 2);
			r4c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 3);
			r4c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 4);
			subgrid1 = [r1c1, r1c2, r2c1, r2c2];
			subgrid2 = [r1c3, r1c4, r2c3, r2c4];
			subgrid3 = [r3c1, r3c2, r4c1, r4c2];
			subgrid4 = [r3c3, r3c4, r4c3, r4c4];
			subgrids = [subgrid1, subgrid2, subgrid3, subgrid4];
		});
		it(`should find all the subgrids and pass them to both the row and column functions`, () => {
			spyOn(sudokuSolver, 'checkSubgridPossibleValuesConstrainedToSingleRow').and.stub();
			spyOn(sudokuSolver, 'checkSubgridPossibleValuesConstrainedToSingleColumn').and.stub();
			sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRowOrColumn();
			expect(sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRow).toHaveBeenCalledTimes(4);
			expect(sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleColumn).toHaveBeenCalledTimes(4);
			subgrids.forEach(subgrid => {
				expect(sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRow).toHaveBeenCalledWith(subgrid);
				expect(sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleColumn).toHaveBeenCalledWith(subgrid);
			});
		});

		describe(`checkSubgridPossibleValuesConstrainedToSingleRow`, () => {
			it(`should call sudoku.setValueInRowOfSubGrid if the values can only lie in one row`, () => {
				spyOn(sudokuSolver.sudoku, 'setValueInRowOfSubGrid').and.stub();
				r1c1.possibleValues = ['1', '2', '3', '4'];
				r1c2.possibleValues = ['1', '2', '3', '4'];
				r2c1.possibleValues = ['2', '3', '4'];
				r2c2.possibleValues = ['2', '3', '4'];
				sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRow(subgrid1);
				expect(sudokuSolver.sudoku.setValueInRowOfSubGrid).toHaveBeenCalledWith(1, 1, '1');
			});
			it(`should not call sudoku.setValueInRowOfSubGrid if the values can lie in multiple rows`, () => {
				spyOn(sudokuSolver.sudoku, 'setValueInRowOfSubGrid').and.stub();
				r1c1.possibleValues = ['1', '2', '3', '4'];
				r1c2.possibleValues = ['1', '2', '3', '4'];
				r2c1.possibleValues = ['2', '3', '4'];
				r2c2.possibleValues = ['1', '2', '3', '4'];
				sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleRow(subgrid1);
				expect(sudokuSolver.sudoku.setValueInRowOfSubGrid).not.toHaveBeenCalled();
			});
		});

		describe(`checkSubgridPossibleValuesConstrainedToSingleColumn`, () => {
			it(`should call sudoku.setValueInColumnOfSubGrid if the values can only lie in one column`, () => {
				spyOn(sudokuSolver.sudoku, 'setValueInColumnOfSubGrid').and.stub();
				r1c1.possibleValues = ['1', '2', '3', '4'];
				r1c2.possibleValues = [     '2', '3', '4'];
				r2c1.possibleValues = ['1', '2', '3', '4'];
				r2c2.possibleValues = [     '2', '3', '4'];
				sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleColumn(subgrid1);
				expect(sudokuSolver.sudoku.setValueInColumnOfSubGrid).toHaveBeenCalledWith(1, 1, '1');
			});
			it(`should not call sudoku.setValueInColumnOfSubGrid if the values can lie in multiple columns`, () => {
				spyOn(sudokuSolver.sudoku, 'setValueInColumnOfSubGrid').and.stub();
				r1c1.possibleValues = ['1', '2', '3', '4'];
				r1c2.possibleValues = ['1', '2', '3', '4'];
				r2c1.possibleValues = ['2', '3', '4'];
				r2c2.possibleValues = ['1', '2', '3', '4'];
				sudokuSolver.checkSubgridPossibleValuesConstrainedToSingleColumn(subgrid1);
				expect(sudokuSolver.sudoku.setValueInColumnOfSubGrid).not.toHaveBeenCalled();
			});
		});

		describe(`findAllPossibleValuesRemaining`, () => {
			it(`should get a unique list of characters from a list of cells`, () => {
				r1c1.possibleValues = ['1', '2', '3', '4'];
				r1c2.possibleValues = ['1', '2', '3', '4'];
				r2c1.possibleValues = ['5'];
				r2c2.possibleValues = ['5', '6'];
				const actualOutput = sudokuSolver.getUniquePossibleValuesRemaining(subgrid1);
				const expectedOutput = ['1', '2', '3', '4', '5', '6'];
				expect(actualOutput).toEqual(expectedOutput);
			});
		});
	});

	describe(`checkSubgridRowsForSubgrid(Row|Column)ValueImpossibility`, () => {
		const rawGrid: SudokuGridArray = [
			[null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null],
			[null, null, null, null, null, null, null, null, null]
		];
		const subGridDimensions: SubGridDimensions = { width: 3, height: 3 };
		const characters: SudokuCharacterSet = standardCharacterSet;
		let sudoku: Sudoku;
		let r1c1, r1c2, r1c3, r1c4, r1c5, r1c6, r1c7, r1c8, r1c9,
				r2c1, r2c2, r2c3, r2c4, r2c5, r2c6, r2c7, r2c8, r2c9,
				r3c1, r3c2, r3c3, r3c4, r3c5, r3c6, r3c7, r3c8, r3c9,
				r4c1, r4c2, r4c3, r4c4, r4c5, r4c6, r4c7, r4c8, r4c9,
				r5c1, r5c2, r5c3, r5c4, r5c5, r5c6, r5c7, r5c8, r5c9,
				r6c1, r6c2, r6c3, r6c4, r6c5, r6c6, r6c7, r6c8, r6c9,
				r7c1, r7c2, r7c3, r7c4, r7c5, r7c6, r7c7, r7c8, r7c9,
				r8c1, r8c2, r8c3, r8c4, r8c5, r8c6, r8c7, r8c8, r8c9,
				r9c1, r9c2, r9c3, r9c4, r9c5, r9c6, r9c7, r9c8, r9c9;
		let subgrid1: Array<Cell>,
				subgrid2: Array<Cell>,
				subgrid3: Array<Cell>,
				subgrid4: Array<Cell>,
				subgrid5: Array<Cell>,
				subgrid6: Array<Cell>,
				subgrid7: Array<Cell>,
				subgrid8: Array<Cell>,
				subgrid9: Array<Cell>,
				subgrids: Array<Array<Cell>>;
		beforeEach(() => {
			sudoku = new Sudoku();
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			sudokuSolver.sudoku = sudoku;
			r1c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 1);
			r1c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 2);
			r1c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 3);
			r1c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 4);
			r1c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 5);
			r1c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 6);
			r1c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 7);
			r1c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 8);
			r1c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 1 && cell.position.column === 9);

			r2c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 1);
			r2c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 2);
			r2c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 3);
			r2c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 4);
			r2c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 5);
			r2c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 6);
			r2c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 7);
			r2c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 8);
			r2c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 2 && cell.position.column === 9);

			r3c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 1);
			r3c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 2);
			r3c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 3);
			r3c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 4);
			r3c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 5);
			r3c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 6);
			r3c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 7);
			r3c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 8);
			r3c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 3 && cell.position.column === 9);

			r4c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 1);
			r4c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 2);
			r4c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 3);
			r4c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 4);
			r4c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 5);
			r4c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 6);
			r4c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 7);
			r4c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 8);
			r4c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 4 && cell.position.column === 9);

			r5c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 1);
			r5c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 2);
			r5c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 3);
			r5c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 4);
			r5c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 5);
			r5c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 6);
			r5c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 7);
			r5c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 8);
			r5c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 5 && cell.position.column === 9);

			r6c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 1);
			r6c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 2);
			r6c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 3);
			r6c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 4);
			r6c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 5);
			r6c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 6);
			r6c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 7);
			r6c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 8);
			r6c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 6 && cell.position.column === 9);

			r7c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 1);
			r7c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 2);
			r7c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 3);
			r7c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 4);
			r7c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 5);
			r7c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 6);
			r7c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 7);
			r7c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 8);
			r7c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 7 && cell.position.column === 9);

			r8c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 1);
			r8c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 2);
			r8c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 3);
			r8c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 4);
			r8c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 5);
			r8c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 6);
			r8c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 7);
			r8c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 8);
			r8c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 8 && cell.position.column === 9);

			r9c1 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 1);
			r9c2 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 2);
			r9c3 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 3);
			r9c4 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 4);
			r9c5 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 5);
			r9c6 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 6);
			r9c7 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 7);
			r9c8 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 8);
			r9c9 = sudokuSolver.sudoku.flattenedCells.find(cell => cell.position.row === 9 && cell.position.column === 9);

			subgrid1 = [r1c1, r1c2, r1c3, r2c1, r2c2, r2c3, r3c1, r3c2, r3c3];
			subgrid2 = [r1c4, r1c5, r1c6, r2c4, r2c5, r2c6, r3c4, r3c5, r3c6];
			subgrid3 = [r1c7, r1c8, r1c9, r2c7, r2c8, r2c9, r3c7, r3c8, r3c9];

			subgrid4 = [r4c1, r4c2, r4c3, r5c1, r5c2, r5c3, r6c1, r6c2, r6c3];
			subgrid5 = [r4c4, r4c5, r4c6, r5c4, r5c5, r5c6, r6c4, r6c5, r6c6];
			subgrid6 = [r4c7, r4c8, r4c9, r5c7, r5c8, r5c9, r6c7, r6c8, r6c9];

			subgrid7 = [r7c1, r7c2, r7c3, r8c1, r8c2, r8c3, r9c1, r9c2, r9c3];
			subgrid8 = [r7c4, r7c5, r7c6, r8c4, r8c5, r8c6, r9c4, r9c5, r9c6];
			subgrid9 = [r7c7, r7c8, r7c9, r8c7, r8c8, r8c9, r9c7, r9c8, r9c9];

			subgrids = [subgrid1, subgrid2, subgrid3, subgrid4, subgrid5, subgrid6, subgrid7, subgrid8, subgrid9];
		});

		describe(`rows`, () => {
			it(`should call sudoku.setValueInRowOfSubGrid if the value can't be in a certain row of a certain subgrid`, () => {
				spyOn(sudokuSolver.sudoku, 'setValueInRowOfSubGrid').and.stub();
				const input: SudokuGridCells = [
					subgrid1, subgrid2, subgrid3
				];
				r3c1.possibleValues = standardCharacterSet.filter(i => i !== '1');
				r3c2.possibleValues = standardCharacterSet.filter(i => i !== '1');
				r3c3.possibleValues = standardCharacterSet.filter(i => i !== '1');

				r3c7.possibleValues = standardCharacterSet.filter(i => i !== '1');
				r3c8.possibleValues = standardCharacterSet.filter(i => i !== '1');
				r3c9.possibleValues = standardCharacterSet.filter(i => i !== '1');
				sudokuSolver.checkSubgridRowsForSubgridRowValueImpossibility(input);
				expect(sudokuSolver.sudoku.setValueInRowOfSubGrid).toHaveBeenCalledWith(2, 3, '1');
			});
		});
		describe(`columns`, () => {
			it(`should call sudoku.setValueInColumnOfSubGrid if the value can't be in a certain row of a certain subgrid`, () => {
				spyOn(sudokuSolver.sudoku, 'setValueInColumnOfSubGrid').and.stub();
				const input: SudokuGridCells = [
					subgrid1, subgrid4, subgrid7
				];
				r1c2.possibleValues = standardCharacterSet.filter(i => i !== '2');
				r2c2.possibleValues = standardCharacterSet.filter(i => i !== '2');
				r3c2.possibleValues = standardCharacterSet.filter(i => i !== '2');

				r7c2.possibleValues = standardCharacterSet.filter(i => i !== '2');
				r8c2.possibleValues = standardCharacterSet.filter(i => i !== '2');
				r9c2.possibleValues = standardCharacterSet.filter(i => i !== '2');
				sudokuSolver.checkSubgridColumnsForSubgridColumnValueImpossibility(input);
				expect(sudokuSolver.sudoku.setValueInColumnOfSubGrid).toHaveBeenCalledWith(4, 2, '2');
			});
		});
	});
});