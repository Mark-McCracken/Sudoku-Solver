/**
 * Created by mark.mccracken on 15/04/2017.
 */
function sudoku(puzzle) {
    console.time('solve Soduko');
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let currentState = [...puzzle];
    const complete = () => {
        return currentState.reduce((prev, row) => {
            if (prev === false)
                return false;
            return !row.some(item => item === 0);
        }, true);
    };
    //check if there are any rows with 8/9 numbers filled in
    const checkRows = () => {
        let tempState = [...currentState];
        currentState = tempState.reduce((prev, curr, index) => {
            let row = prev[index];
            if (row.reduce((prev, curr) => prev + curr, 0) === 45)
                return prev;
            if (row.filter(item => item === 0).length == 1) {
                let zeroIndex = row.indexOf(0);
                let value = 45 - row.reduce((prev, curr) => prev + curr, 0);
                row[zeroIndex] = value;
                prev[index] = row;
                return prev;
            }
            return prev;
        }, tempState);
    };
    //check if there are any columns wth 8/9 numbers filled in
    const checkColumns = () => {
        let tempState = [...currentState];
        let columns = numbers.map((number, i) => i)
            .map(i => {
            return numbers.map((number, index) => {
                return tempState[index][i];
            });
        });
        columns = columns.map(column => {
            if (column.reduce((prev, curr) => prev + curr, 0) == 45)
                return column;
            if (column.filter(item => item === 0).length == 1) {
                let zeroIndex = column.indexOf(0);
                let value = 45 - column.reduce((prev, curr) => prev + curr, 0);
                column[zeroIndex] = value;
                return column;
            }
            return column;
        });
        currentState = numbers.map((number, i) => i).map(i => numbers.map((number, index) => columns[index][i]));
    };
    //check if there are any boxes wth 8/9 numbers filled in
    const checkBoxes = () => {
        let tempState = [...currentState];
        let threeItems = [null, null, null];
        let searchLocations = [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6], [6, 0], [6, 3], [6, 6]];
        let boxes = searchLocations.map(coOrds => {
            let boxMap = threeItems.map((x, i) => i).map((index, idx) => threeItems.map((x, i) => [index + coOrds[0], i + coOrds[1]]));
            let result = boxMap.map((boxArray) => {
                return boxArray.map((boxItem) => {
                    return tempState[boxItem[0]][boxItem[1]];
                });
            });
            return result;
        });
        boxes = boxes.map((box, boxIndex) => {
            let boxTotal = box.reduce((prev, boxRow) => prev + boxRow.reduce((prev, curr) => prev + curr, 0), 0);
            let flatBox = [...box[0], ...box[1], ...box[2]];
            if (boxTotal === 45)
                return box;
            if (flatBox.filter(item => item === 0).length == 1) {
                let value = 45 - boxTotal;
                let zeroIndex = flatBox.indexOf(0);
                let newCoOrds = [Math.floor(zeroIndex / 3), zeroIndex % 3];
                let boxCoOrds = [Math.floor(boxIndex / 3), boxIndex % 3];
                let newLocation = [boxCoOrds[0] * 3 + newCoOrds[0], boxCoOrds[1] * 3 + newCoOrds[1]];
                tempState[newLocation[0]][newLocation[1]] = value;
            }
            return box;
        });
        currentState = tempState;
    };
    ;
    //check each square for each number, if it's the only number that can go in that square
    const checkNumbers = () => {
        //after the first 3 functions got complicated, used an object for storing state instead
        let tempState = {};
        currentState.forEach((row, idx) => {
            tempState[idx + 1] = {};
            currentState[idx].forEach((item, i) => {
                tempState[idx + 1][i + 1] = item;
            });
        });
        //convert back to 2D array.
        const getCurrentState = (state) => {
            return Object.keys(state).map(rowKey => Object.keys(state[rowKey]).map(item => {
                return state[rowKey][item];
            }));
        };
        const getRow = (num) => {
            return Object.keys(tempState[num]).map(i => tempState[num][i]);
        };
        const getCol = (num) => {
            return Object.keys(tempState[num]).map(i => tempState[i][num]);
        };
        const getBox = (num) => {
            let rowNum = (Math.ceil(num / 3) - 1) * 3 + 1;
            let intermediary = num % 3;
            let colNum = ((intermediary ? intermediary : 3) - 1) * 3 + 1;
            return [
                tempState[rowNum][colNum], tempState[rowNum][colNum + 1], tempState[rowNum][colNum + 2],
                tempState[rowNum + 1][colNum], tempState[rowNum + 1][colNum + 1], tempState[rowNum + 1][colNum + 2],
                tempState[rowNum + 2][colNum], tempState[rowNum + 2][colNum + 1], tempState[rowNum + 2][colNum + 2]
            ];
        };
        const getFirstCoOrdOfBoxNum = (num) => {
            switch (num) {
                case 1: return [1, 1];
                case 2: return [1, 4];
                case 3: return [1, 7];
                case 4: return [4, 1];
                case 5: return [4, 4];
                case 6: return [4, 7];
                case 7: return [7, 1];
                case 8: return [7, 4];
                case 9: return [7, 7];
            }
        };
        const getBoxNum = (row, col) => {
            return (Math.floor((row - 1) / 3) * 3) + Math.ceil(col / 3);
        };
        Object.keys(tempState).forEach(rowKey => {
            Object.keys(tempState[rowKey]).forEach(colKey => {
                // Loop over all rows and columns
                // if it's already got a number in it, stop & go to next empty box.
                if (tempState[rowKey][colKey] !== 0)
                    return;
                let possibleNumbers = [...numbers];
                // check every number one by one, to see if it can go in that box.
                numbers.forEach(num => {
                    // if the box already has that number in it, then filter that number from the list of possibilities
                    if (getBox(getBoxNum(rowKey, colKey)).includes(num)) {
                        possibleNumbers = possibleNumbers.filter(item => item != num);
                        return;
                    }
                    // if the column already has that number in it, then filter that number from the list of possibilities
                    if (getCol(Number(colKey)).includes(num)) {
                        possibleNumbers = possibleNumbers.filter(n => n !== num);
                        return;
                    }
                    // if the row already has that number in it, then filter that number from the list of possibilities
                    if (getRow(Number(rowKey)).includes(num)) {
                        possibleNumbers = possibleNumbers.filter(n => n !== num);
                        return;
                    }
                    // check if a given coOrdinate is empty
                    const coOrdEmpty = (row, col) => {
                        return getRow(row)[col - 1] == 0;
                    };
                    // be able to check if the other available co-ordinates to see if those could contain the number
                    // may or may not call it later
                    const checkOtherCoOrds = (row, col) => {
                        //get all the coOrdinates
                        let allCoOrds = numbers.map(n1 => numbers.map(n2 => [n1, n2]));
                        allCoOrds = allCoOrds
                            .reduce((prev, curr) => [...prev, ...curr], [])
                            .filter(item => {
                            //filter out the current box, as we're considering that one
                            if ((item[0] == row) && (item[1] == col)) {
                                return false;
                            }
                            //leave only things that are in the same box
                            //could refactor to use getBoxNum
                            if (Math.ceil(item[0] / 3) == Math.ceil(row / 3)
                                && Math.ceil(item[1] / 3) == Math.ceil(col / 3)) {
                                return true;
                            }
                            return false;
                        })
                            .filter(item => coOrdEmpty(item[0], item[1]));
                        // will call the below function with the above remaining CoOrds, once it's finished being defined.
                        // May have wanted to call recursively.
                        const checkRemaining = (remainingCoOrds) => {
                            // check the remaining co-ordinated
                            remainingCoOrds.forEach(coOrd => {
                                if (getRow(coOrd[0]).includes(num) || getCol(coOrd[1]).includes(num)) {
                                    // if any coOrd has the number in it's row or column, then the number can't be in that coOrd.
                                    remainingCoOrds = remainingCoOrds.filter(item => {
                                        return (item != coOrd);
                                    });
                                }
                            });
                            // be able to easily find the adjacent boxes
                            const getRowSiblingBoxes = (boxNum) => {
                                switch (boxNum) {
                                    case 1: return [2, 3];
                                    case 2: return [1, 3];
                                    case 3: return [1, 2];
                                    case 4: return [5, 6];
                                    case 5: return [4, 6];
                                    case 6: return [4, 5];
                                    case 7: return [8, 9];
                                    case 8: return [7, 9];
                                    case 9: return [7, 8];
                                }
                            };
                            const getColSiblingBoxes = (boxNum) => {
                                switch (boxNum) {
                                    case 1: return [4, 7];
                                    case 2: return [5, 8];
                                    case 3: return [6, 9];
                                    case 4: return [1, 7];
                                    case 5: return [2, 8];
                                    case 6: return [3, 9];
                                    case 7: return [1, 4];
                                    case 8: return [2, 5];
                                    case 9: return [3, 6];
                                }
                            };
                            remainingCoOrds.forEach(coOrd => {
                                getRowSiblingBoxes(getBoxNum(coOrd[0], coOrd[1])).forEach(boxNum => {
                                    // get the values in the box
                                    let boxValues = getBox(boxNum);
                                    // filter the values to only look at the rows in the adjacent box that are not the current row.
                                    switch (coOrd[0]) {
                                        case 1:
                                        case 4:
                                        case 7:
                                            boxValues = boxValues.filter((val, idx) => [3, 4, 5, 6, 7, 8].includes(idx));
                                            break;
                                        case 2:
                                        case 5:
                                        case 8:
                                            boxValues = boxValues.filter((val, idx) => [0, 1, 2, 6, 7, 8].includes(idx));
                                            break;
                                        case 3:
                                        case 6:
                                        case 9:
                                            boxValues = boxValues.filter((val, idx) => [0, 1, 2, 3, 4, 5].includes(idx));
                                            break;
                                    }
                                    // if the number isn't in the adjacent box and all of the other rows in that box items are filled,
                                    // then the number must be in the only remaining row,
                                    // that is, the same row as the currently investigating coOrd is in.
                                    // can't be that coOrd then.
                                    if (!(getBox(boxNum).includes(num)) && boxValues.every(val => val != 0)) {
                                        remainingCoOrds = remainingCoOrds.filter(item => {
                                            return (item != coOrd);
                                        });
                                    }
                                });
                                //repeat for columns.
                                getColSiblingBoxes(getBoxNum(coOrd[0], coOrd[1])).forEach(boxNum => {
                                    let boxValues = getBox(boxNum);
                                    switch (coOrd[1]) {
                                        case 1:
                                        case 4:
                                        case 7:
                                            boxValues = boxValues.filter((val, idx) => [1, 2, 4, 5, 7, 8].includes(idx));
                                            break;
                                        case 2:
                                        case 5:
                                        case 8:
                                            boxValues = boxValues.filter((val, idx) => [0, 2, 3, 5, 6, 8].includes(idx));
                                            break;
                                        case 3:
                                        case 6:
                                        case 9:
                                            boxValues = boxValues.filter((val, idx) => [0, 1, 3, 4, 6, 7].includes(idx));
                                            break;
                                    }
                                    if (!(getBox(boxNum).includes(num)) && boxValues.every(val => val != 0)) {
                                        remainingCoOrds = remainingCoOrds.filter(item => {
                                            return (item != coOrd);
                                        });
                                    }
                                });
                            });
                            // check if adjacent boxes can only contain the number in a certain row, or certain column later
                            remainingCoOrds.forEach(coOrd => {
                                getRowSiblingBoxes(getBoxNum(coOrd[0], coOrd[1])).forEach(boxNum => {
                                    let boxValues = getBox(boxNum);
                                    // find all indexes in box where value is zero.
                                    let zeroIndexes = boxValues.reduce((prev, curr, index) => {
                                        if (curr === 0) {
                                            return [...prev, index];
                                        }
                                        return prev;
                                    }, []);
                                    // get first CoOrd in that box.
                                    let startingPoint = getFirstCoOrdOfBoxNum(boxNum);
                                    // convert all indexes into coOrds
                                    let zeroCoOrds = zeroIndexes.reduce((prev, curr) => {
                                        let boxRow = Math.floor(curr / 3);
                                        let boxCol = curr % 3;
                                        return [...prev, [startingPoint[0] + boxRow, startingPoint[1] + boxCol]];
                                    }, []);
                                    // if the box doesn't have that number
                                    if (!(getBox(boxNum).includes(num))) {
                                        //check every empty coOrd
                                        zeroCoOrds.forEach(emptyCoOrd => {
                                            // if that coOrd has the number in it's row or column,
                                            // then it can't be in this empty CoOrd.
                                            if (getCol(emptyCoOrd[1]).includes(num) || getRow(emptyCoOrd[0]).includes(num)) {
                                                zeroCoOrds = zeroCoOrds.filter(item => {
                                                    return (item != emptyCoOrd);
                                                });
                                            }
                                        });
                                        // if all of the empty boxes that could contain the number
                                        // are on the same row as the currently investigated coOrd,
                                        // then the currently investigating CoOrd can't contain the number
                                        if (zeroCoOrds.every(zCoOrd => zCoOrd[0] === coOrd[0])) {
                                            remainingCoOrds = remainingCoOrds.filter(item => {
                                                return (item != coOrd);
                                            });
                                        }
                                    }
                                });
                            });
                            // repeat above, for columns.
                            remainingCoOrds.forEach(coOrd => {
                                getColSiblingBoxes(getBoxNum(coOrd[0], coOrd[1])).forEach(boxNum => {
                                    let boxValues = getBox(boxNum);
                                    let zeroIndexes = boxValues.reduce((prev, curr, index) => {
                                        if (curr === 0) {
                                            return [...prev, index];
                                        }
                                        return prev;
                                    }, []);
                                    let startingPoint = getFirstCoOrdOfBoxNum(boxNum);
                                    let zeroCoOrds = zeroIndexes.reduce((prev, curr) => {
                                        let boxRow = Math.floor(curr / 3);
                                        let boxCol = curr % 3;
                                        return [...prev, [startingPoint[0] + boxRow, startingPoint[1] + boxCol]];
                                    }, []);
                                    if (!(getBox(boxNum).includes(num))) {
                                        zeroCoOrds.forEach(emptyCoOrd => {
                                            if (getCol(emptyCoOrd[1]).includes(num) || getRow(emptyCoOrd[0]).includes(num)) {
                                                zeroCoOrds = zeroCoOrds.filter(item => {
                                                    return (item != emptyCoOrd);
                                                });
                                            }
                                        });
                                        if (zeroCoOrds.every(zCoOrd => zCoOrd[1] === coOrd[1])) {
                                            remainingCoOrds = remainingCoOrds.filter(item => {
                                                return (item != coOrd);
                                            });
                                        }
                                    }
                                });
                            });
                            // if no other co-ordinated can contain that number, put that number there.
                            if (remainingCoOrds.length == 0) {
                                tempState[rowKey][colKey] = num;
                            }
                        };
                        checkRemaining(allCoOrds);
                        if (allCoOrds.length === 0) {
                            tempState[rowKey][colKey] = num;
                        }
                    };
                    // if the number isn't in the current coOrd's box, row or column, the check the other co-ordinates;
                    if (!(getRow(rowKey).includes(num)) && !(getCol(colKey).includes(num)) && !(getBox(getBoxNum(rowKey, colKey)).includes(num))) {
                        checkOtherCoOrds(rowKey, colKey);
                    }
                });
                // if only one number left that can go in that box, put it in the box.
                if (possibleNumbers.length == 1) {
                    tempState[rowKey][colKey] = possibleNumbers[0];
                }
            });
        });
        // implement the changes made from checking numbers.
        currentState = getCurrentState(tempState);
    };
    // loop over the different methods for finding the solution until it's complete.
    while (!complete()) {
        checkRows();
        checkColumns();
        checkBoxes();
        checkNumbers();
    }
    console.log(currentState);
    console.timeEnd('solve Soduko');
    return currentState;
}
let currentSudoku = [
    [0, 4, 0, 0, 0, 0, 0, 9, 7],
    [0, 7, 0, 0, 3, 9, 0, 0, 0],
    [0, 0, 2, 1, 0, 7, 0, 0, 0],
    [0, 8, 0, 0, 2, 0, 0, 6, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 5, 0, 0, 4, 0, 0, 8, 0],
    [0, 0, 0, 8, 0, 4, 1, 0, 0],
    [0, 0, 0, 6, 1, 0, 0, 7, 0],
    [8, 2, 0, 0, 0, 0, 0, 4, 0]
];
sudoku(currentSudoku);
/// blank one
// let currentState = [
//     [0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0]]; 
