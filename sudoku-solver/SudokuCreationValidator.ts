import {SubGridDimensions} from "../models/SubGridDimensions";
import {SudokuCharacterSet} from "../models/constants/sudoku-character-sets";
import {SudokuGridArray} from "../models/SudokuGrid";

export class SudokuCreationValidator {
	checkInputs(grid: SudokuGridArray,
	            subGridDimensions: SubGridDimensions,
	            characters: SudokuCharacterSet) {
		this.checkRowsAreAllSameLength(grid);
		this.checkNumberOfRowsMatchesNumberOfColumns(grid);
		this.checkOnlyAcceptableCharactersAreUsed(grid, characters);
		this.checkCorrectNumberOfRowsUsed(grid, characters);
		this.checkCorrectNumberOfColumnsAreUsed(grid, characters);
		this.checkGridSizeIsCorrect(grid, subGridDimensions, characters);
		this.checkCharactersAreDistinct(characters);
	}

	checkRowsAreAllSameLength(grid: SudokuGridArray) {
		const firstRowLength = grid[0].length;
		if (grid.some(row => row.length !== firstRowLength)) {
			throw new Error(`Row Length Mismatch making new sudoku`);
		}
	}

	checkNumberOfRowsMatchesNumberOfColumns(grid: SudokuGridArray) {
		const firstRowLength = grid[0].length;
		if (grid.length !== firstRowLength) {
			throw new Error(`Number of rows and columns don't match`);
		}
	}

	checkOnlyAcceptableCharactersAreUsed(grid: SudokuGridArray,
	                                     characters: SudokuCharacterSet) {
		if (grid.some(row => row.some(cell => cell !== null && !characters.includes(cell)))) {
			throw new Error(`Bad Character used`);
		}
	}

	checkCorrectNumberOfRowsUsed(grid: SudokuGridArray,
	                             characters: SudokuCharacterSet) {
		if (grid.length !== characters.length) {
			throw new Error(`Mismatch in number of rows and acceptable characters`);
		}
	}

	checkCorrectNumberOfColumnsAreUsed(grid: SudokuGridArray,
	                                   characters: SudokuCharacterSet) {
		if (grid.some(row => row.length !== characters.length)) {
			throw new Error(`Number of Characters in row does not match length of acceptable characters`);
		}
	}

	checkGridSizeIsCorrect(grid: SudokuGridArray,
	                       subGridDimensions: SubGridDimensions,
	                       characters: SudokuCharacterSet) {
		this.checkSubGridFitsIntoRows(subGridDimensions, characters);
		this.checkSubGridFitsIntoColumns(subGridDimensions, characters);
		this.checkSubGridFitsIntoGrid(subGridDimensions, characters);
	}

	checkSubGridFitsIntoRows(subGridDimensions: SubGridDimensions,
	                         characters: SudokuCharacterSet) {
		if (!Number.isInteger(characters.length / subGridDimensions.height)) {
			throw new Error(`SubGrid does not fit into grid`);
		}
	}

	checkSubGridFitsIntoColumns(subGridDimensions: SubGridDimensions,
	                            characters: SudokuCharacterSet) {
		if (!Number.isInteger(characters.length / subGridDimensions.width)) {
			throw new Error(`SubGrid does not fit into grid`);
		}
	}

	checkSubGridFitsIntoGrid(subGridDimensions: SubGridDimensions,
	                         characters: SudokuCharacterSet) {
		if (subGridDimensions.width * subGridDimensions.height !== characters.length) {
			throw new Error(`Subgrid shape does not conform to character set length`);
		}
	}

	checkCharactersAreDistinct(characters: SudokuCharacterSet) {
		let checkedCharacters = [];
		characters.forEach(character => {
			if (checkedCharacters.includes(character)) {
				throw new Error(`Character Duplicated in Character List`);
			} else {
				checkedCharacters.push(character);
			}
		});
	}
}