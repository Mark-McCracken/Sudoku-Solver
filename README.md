# Sudoku Solver

A little over a year ago, I created a more primitive solution of this problem. (See initial commit)

But my solution had several problems:
- Only worked for 9x9 Sudokus.
- Code was not very easy to read through.
- Code was very very very difficult to debug or alter.

The more I developed it, the more difficult it became to get closer to the solution.
More and more time was being spent reading what I'd already written, trying to understand it. 

As part of my aim to consider myself a Senior Software Engineer, I've been reading a lot about clean code,
and practicing what I've been reading about.
A lot of the advice and learnings can be picked up from the book [Clean Code](https://www.amazon.co.uk/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882). This project represents the culmination of the start of these learnings.

A few of the main principles worth noting throughout this project are:
- Use of TDD by writing tests first, then writing minimum required code to make test pass
- Variables and functions should be obviously named, should not need comments anywhere
- Functions should be short, ideally 10 lines and below
- Use of typescript to reduce type-based errors
- Use of ES6 classes to organise code more logically

This all came together very nicely, at approximately an extra 150 lines of code, it provides to following benefits: 
- The speed of development remained high throughout
- The code worked first time as soon as it was complete!
- Provides input validation
- Works for any valid sudoku grid size and shape
- More advanced algorithm for solving
- Fewer iterations required to solve
- Faster solution time
- State of progress for unsolvable sudoku, rather than infinite loop

You can solve your own Sudoku my adding the values to the file [SOLVE_SUDOKU.ts](./SOLVE_SUDOKU.ts)

Any questions or comments? Let me know -> [markmccracken91@me.com](markmccracken91@me.com)

My original readme and inspiration below.

<br/>
<hr/>
<br/>


<br/>
<hr/>
<br/>

### original inspiration for the problem

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