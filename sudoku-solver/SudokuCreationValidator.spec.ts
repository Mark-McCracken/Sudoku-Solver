import {SudokuGridArray} from "../models/SudokuGrid";
import {SubGridDimensions} from "../models/SubGridDimensions";
import {standardCharacterSet, SudokuCharacterSet} from "../models/constants/sudoku-character-sets";
import {SudokuCreationValidator} from "./SudokuCreationValidator";

describe(`SudokuCreationValidator`, () => {
	const legalGrid: SudokuGridArray = [
		['1', '2', '3', '4'],
		['2', '3', '4', '1'],
		['3', '4', '1', '2'],
		['4', '1', '2', null]
	];
	const legalSubgridDimensions: SubGridDimensions = { width: 2, height: 2 };
	const legalCharacters: SudokuCharacterSet = ['1', '2', '3', '4'];
	const legalSudoku: SudokuCreationValidator = new SudokuCreationValidator();

	describe(`checkInputs`, () => {
		describe(`checkRowsAreAllSameLength`, () => {
			it(`should throw an error if all rows are not the same length`, () => {
				spyOn(legalSudoku, 'checkRowsAreAllSameLength').and.callThrough();
				let grid: SudokuGridArray = [
					['1', '2', '3', '4'],
					['2', '3', '4', '1'],
					['3', '4', '1', '2'],
					['4', '1', '2', '3', '5']
				];
				expect(() => legalSudoku.checkRowsAreAllSameLength(grid)).toThrow();
			});
		});
		describe(`checkNumberOfRowsMatchesNumberOfColumns`, () => {
			it(`should throw an error if the number of rows and columns don't match`, () => {
				spyOn(legalSudoku, 'checkNumberOfRowsMatchesNumberOfColumns').and.callThrough();
				let grid1: SudokuGridArray = [
					['1', '2', '3', '4'],
					['2', '3', '4', '1'],
					['3', '4', '1', '2']
				];
				expect(() => legalSudoku.checkNumberOfRowsMatchesNumberOfColumns(grid1)).toThrow();

				let grid2: SudokuGridArray = [
					['1', '2', '3', '4'],
					['2', '3', '4', '1'],
					['3', '4', '1', '2'],
					['3', '4', '1', '2'],
					['3', '4', '1', '2']
				];
				expect(() => legalSudoku.checkNumberOfRowsMatchesNumberOfColumns(grid2)).toThrow();
			});
		});
		describe(`checkOnlyAcceptableCharactersAreUsed`, () => {
			it(`should throw an error if a character is used that is not specified in the character list`, () => {
				spyOn(legalSudoku, 'checkOnlyAcceptableCharactersAreUsed').and.callThrough();
				let grid: SudokuGridArray = [
					['5', '2', '3', '4'],
					['2', '3', '4', '1'],
					['3', '4', '1', '2'],
					['3', '4', '1', '2']
				];
				let characters: SudokuCharacterSet = ['1', '2', '3', '4'];
				expect(() => legalSudoku.checkOnlyAcceptableCharactersAreUsed(grid, characters)).toThrow();
			});
			it(`should not throw an error if null is used`, () => {
				spyOn(legalSudoku, 'checkOnlyAcceptableCharactersAreUsed').and.callThrough();
				let grid: SudokuGridArray = [
					[null, '2', '3', '4'],
					['2', '3', '4', '1'],
					['3', '4', '1', '2'],
					['3', '4', '1', '2']
				];
				let characters: SudokuCharacterSet = ['1', '2', '3', '4'];
				expect(() => legalSudoku.checkOnlyAcceptableCharactersAreUsed(grid, characters)).not.toThrow();
			});
		});
		describe(`checkCorrectNumberOfRowsUsed`, () => {
			it(`should throw an error if the number of rows does not match the length of acceptable characters`, () => {
				spyOn(legalSudoku, 'checkCorrectNumberOfRowsUsed').and.callThrough();
				let grid: SudokuGridArray = [
					['1', '2', '3', '4'],
					['2', '3', '4', '1'],
					['3', '4', '1', '2'],
					['4', '1', '2', '3']
				];
				let characters: SudokuCharacterSet = ['1', '2', '3', '4', '5'];
				expect(() => legalSudoku.checkCorrectNumberOfRowsUsed(grid, characters)).toThrow();
			});
		});
		describe(`checkCorrectNumberOfColumnsAreUsed`, () => {
			it(`should throw an error if the number of columns does not match the length of acceptable characters`, () => {
				spyOn(legalSudoku, 'checkCorrectNumberOfColumnsAreUsed').and.callThrough();
				let grid: SudokuGridArray = [
					['1', '2', '3', '4', null],
					['2', '3', '4', '1', '5'],
					['3', '4', '1', '2', '5'],
					['4', '3', '2', '1', '5'],
					['4', '3', '2', '1']
				];
				let characters: SudokuCharacterSet = ['1', '2', '3', '4', '5'];
				expect(() => legalSudoku.checkCorrectNumberOfColumnsAreUsed(grid, characters)).toThrow();
			});
		});
		describe(`checkGridSizeIsCorrect`, () => {
			describe(`checkSubGridFitsIntoRows`, () => {
				it(`should throw an error if the subgrid width does not evenly divide row length`, () => {
					spyOn(legalSudoku, 'checkSubGridFitsIntoRows').and.callThrough();
					let subGridDimensions: SubGridDimensions = { width: 2, height: 3 };
					let characters: SudokuCharacterSet = ['1', '2', '3', '4'];
					expect(() => legalSudoku.checkSubGridFitsIntoRows(subGridDimensions, characters)).toThrow();
				});
				it(`should not throw an error if the subgrid fits nicely`, () => {
					spyOn(legalSudoku, 'checkSubGridFitsIntoRows').and.callThrough();
					let subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
					let characters: SudokuCharacterSet = ['1', '2', '3', '4'];
					expect(() => legalSudoku.checkSubGridFitsIntoRows(subGridDimensions, characters)).not.toThrow();
				});
			});
			describe(`checkSubGridFitsIntoColumns`, () => {
				it(`should throw an error if the subgrid height does not evenly divide row length`, () => {
					spyOn(legalSudoku, 'checkSubGridFitsIntoColumns').and.callThrough();
					let subGridDimensions: SubGridDimensions = { width: 3, height: 2 };
					let characters: SudokuCharacterSet = ['1', '2', '3', '4'];
					expect(() => legalSudoku.checkSubGridFitsIntoColumns(subGridDimensions, characters)).toThrow();
				});
				it(`should not throw an error if the subgrid fits nicely`, () => {
					spyOn(legalSudoku, 'checkSubGridFitsIntoColumns').and.callThrough();
					let subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
					let characters: SudokuCharacterSet = ['1', '2', '3', '4'];
					expect(() => legalSudoku.checkSubGridFitsIntoColumns(subGridDimensions, characters)).not.toThrow();
				});
			});
			describe(`checkSubGridFitsIntoGrid`, () => {
				it(`should throw an error if the total items in the subgrid does not match the character set length`, () => {
					spyOn(legalSudoku, 'checkSubGridFitsIntoGrid').and.callThrough();
					let subGridDimensions: SubGridDimensions = { width: 2, height: 2 };
					let characters: SudokuCharacterSet = ['1', '2', '3', '4', '5'];
					expect(() => legalSudoku.checkSubGridFitsIntoGrid(subGridDimensions, characters)).toThrow();
				});
			});
		});
		describe(`checkCharactersAreDistinct`, () => {
			it(`should throw an error if any character is used twice`, () => {
				spyOn(legalSudoku, 'checkCharactersAreDistinct').and.callThrough();
				const characterSet: SudokuCharacterSet = ['1', '1', '2', '3'];
				expect(() => legalSudoku.checkCharactersAreDistinct(characterSet)).toThrow();
			});
			it(`should not throw an error if using an existing character set`, () => {
				spyOn(legalSudoku, 'checkCharactersAreDistinct').and.callThrough();
				expect(() => legalSudoku.checkCharactersAreDistinct(standardCharacterSet)).not.toThrow();
			});
		});
	});
});