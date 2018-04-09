import {Sudoku} from "./Sudoku";
import {SubGridDimensions} from "../models/SubGridDimensions";
import {SudokuCharacterSet} from "../models/constants/sudoku-character-sets";
import {SudokuValidator} from "./SudokuValidator";

describe(`SudokuValidator`, () => {
	const sudokuValidator = new SudokuValidator();

	describe(`sudokuIsComplete`, () => {
		it(`should return true if all values are populated`, () => {
			const sudoku = new Sudoku();
			const rawGrid = [
				['1', '2', '3', '4'],
				['2', '3', '4', '1'],
				['3', '4', '1', '2'],
				['4', '1', '2', '3']
			];
			const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			expect(sudokuValidator.sudokuIsComplete(sudoku)).toBe(true);
		});
		it(`should return false if any value is not populated`, () => {
			const sudoku = new Sudoku();
			const rawGrid = [
				['1', '2', '3', '4'],
				['2', null, '4', '1'],
				['3', '4', '1', '2'],
				['4', '1', '2', '3']
			];
			const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			sudoku.initialiseSudoku(rawGrid, subGridDimensions, characters);
			expect(sudokuValidator.sudokuIsComplete(sudoku)).toBe(false);
		});
	});

	describe(`sudokuIsValid`, () => {
		it(`should return false if any cells in the same row/column/subGrid have the same value`, () => {
			const subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
			const characters: SudokuCharacterSet = ['1', '2', '3', '4'];
			const sudoku1 = new Sudoku();
			const rawGrid1 = [
				['1', '2', '2', '4'],
				['3', '4', '1', '2'],
				['2', '3', '4', '1'],
				['4', '1', '2', '3']
			];
			const sudoku2 = new Sudoku();
			const rawGrid2 = [
				['1', '2', '3', '4'],
				['3', '4', '1', '2'],
				['2', '3', '4', '1'],
				['4', '2', '2', '3']
			];
			const sudoku3 = new Sudoku();
			const rawGrid3 = [
				['1', '2', '3', '4'],
				['2', '4', '1', '2'],
				['2', '3', '4', '1'],
				['4', '1', '2', '3']
			];
			sudoku1.initialiseSudoku(rawGrid1, subGridDimensions, characters);
			sudoku2.initialiseSudoku(rawGrid2, subGridDimensions, characters);
			sudoku3.initialiseSudoku(rawGrid3, subGridDimensions, characters);
			expect(sudokuValidator.sudokuIsValid(sudoku1)).toBe(false);
			expect(sudokuValidator.sudokuIsValid(sudoku2)).toBe(false);
			expect(sudokuValidator.sudokuIsValid(sudoku3)).toBe(false);
		});
	});
});