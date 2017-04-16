I've recently discovered the joys of [codewars](https://www.codewars.com/dashboard)

I came across the following challenge to be able to solve an easy sudoku

> Write a function that will solve a 9x9 Sudoku puzzle. The function will take one argument consisting of the 2D puzzle array, with the value 0 representing an unknown square.

> The Sudokus tested against your function will be "easy" (i.e. determinable; there will be no need to assume and test possibilities on unknowns) and can be solved with a brute-force approach.

However I like Sudokus, and I wanted to push the algorithm to replicate exactly what I do mentally when trying to solve a sodoku, which I figured could then solve any sudoku I can solve. This essentially means removing the second paragraph from the requirements.

>Note: this will not check that the sudoku input is valid, and will create an infinite loop if the sudoku cannot be solved.

It checks all the rows to see if there are any rows with just one missing number, and repeats this for each column and box.

It then loops over every empty space, and checks every number, to try and find the right number for that square.


This code makes use of Array.prototype.includes(), so be aware that you'll need support for that, which only became available with ES2016, not 2015.

Code was initially created in typescript, but the typings actually provided little value on such a heavily number based program, so I removed it.

Sudokus are typically solved in less than half a second :)

Let me know if you have any thoughts.