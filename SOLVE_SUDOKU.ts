import {standardCharacterSet, twelveGridNumericCharacterSet,twoByTwoCharacterSet} from "./models/constants/sudoku-character-sets";
import {SudokuSolver} from "./sudoku-solver/SudokuSolver";
import {SudokuGridArray} from "./models/SudokuGrid";

const sudokuInput1: SudokuGridArray = [
	['1' , null, null, null],
	[null, null, '3' , null],
	[null, '2' , null, null],
	[null, null, null, '4' ]
];

const sudokuInput2: SudokuGridArray = [
	[null, '4',  null, null, null, null, null, '9',  '7' ],
	[null, '7',  null, null, '3',  '9',  null, null, null],
	[null, null, '2',  '1',  null, '7',  null, null, null],
	[null, '8',  null, null, '2',  null, null, '6',  '3' ],
	[null, null, null, null, null, null, null, null, null],
	['3',  '5',  null, null, '4',  null, null, '8',  null],
	[null, null, null, '8',  null, '4',  '1',  null, null],
	[null, null, null, '6',  '1',  null, null, '7',  null],
	['8',  '2',  null, null, null, null, null, '4',  null]
];


const sudokuInput3: SudokuGridArray = [
	[null, null, '11', null,    null, null, null, null,     null, '1' , null, null],
	[null, '6' , null, null,    '7' , '10', '11', null,     null, '5' , '3' , null],
	['4',  '3' , null, '12',    '9' , null, null, '6' ,     null, null, null, '10'],

	[null, null, null, null,    '3' , '12', null, '7' ,     null, '8' , null, null],
	[null, null, '8' , '4' ,    null, null, null, null,     '3' , '12', '7' , null],
	[null, '12', null, null,    null, '6' , '9' , null,     '1' , null, '10', null],

	[null, '9' , null, '11',    null, '8' , '4' , null,     null, null, '12', null],
	[null, '8' , '4' , '5' ,    null, null, null, null,     '10', '2' , null, null],
	[null, null, '3' , null,    '2' , null, '5' , '9' ,     null, null, null, null],

	['8' , null, null, null,    '11', null, null, '3' ,     '7' , null, '4' , '5' ],
	[null, '5' , '10', null,    null, '7' , '12', '1' ,     null, null, '8' , null],
	[null, null, '9' , null,    null, null, null, null,     null, '10', null, null],
];

const sudokuSolver1: SudokuSolver = new SudokuSolver();
sudokuSolver1.solveSodoku(sudokuInput1, {width: 2, height: 2}, twoByTwoCharacterSet);

const sudokuSolver2: SudokuSolver = new SudokuSolver();
sudokuSolver2.solveSodoku(sudokuInput2, {width: 3, height: 3}, standardCharacterSet);

const sudokuSolver3: SudokuSolver = new SudokuSolver();
sudokuSolver3.solveSodoku(sudokuInput3, {width: 4, height: 3}, twelveGridNumericCharacterSet);


/**
 *
 * empty 4
 const sudokuInput1: SudokuGridArray = [
	 [null, null,   null, null],
	 [null, null,   null, null],

	 [null, null,   null, null],
	 [null, null,   null, null]
 ];
 *
 * empty 9
 const sukokuInput2: SudokuGridArray = [
	 [null, null, null,   null, null, null,   null, null, null],
	 [null, null, null,   null, null, null,   null, null, null],
	 [null, null, null,   null, null, null,   null, null, null],

	 [null, null, null,   null, null, null,   null, null, null],
	 [null, null, null,   null, null, null,   null, null, null],
	 [null, null, null,   null, null, null,   null, null, null],

	 [null, null, null,   null, null, null,   null, null, null],
	 [null, null, null,   null, null, null,   null, null, null],
	 [null, null, null,   null, null, null,   null, null, null]
 ]
 *
 * empty 12
 const sudokuInput3: SudokuGridArray = [
	 [null, null, null, null,    null, null, null, null,     null, null, null, null],
	 [null, null, null, null,    null, null, null, null,     null, null, null, null],
	 [null, null, null, null,    null, null, null, null,     null, null, null, null],


	 [null, null, null, null,    null, null, null, null,     null, null, null, null],
	 [null, null, null, null,    null, null, null, null,     null, null, null, null],
	 [null, null, null, null,    null, null, null, null,     null, null, null, null],


	 [null, null, null, null,    null, null, null, null,     null, null, null, null],
	 [null, null, null, null,    null, null, null, null,     null, null, null, null],
	 [null, null, null, null,    null, null, null, null,     null, null, null, null],


	 [null, null, null, null,    null, null, null, null,     null, null, null, null],
	 [null, null, null, null,    null, null, null, null,     null, null, null, null],
	 [null, null, null, null,    null, null, null, null,     null, null, null, null]
 ]
 *
 * */