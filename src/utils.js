import { futoshikiMass } from './HelpTests';

class Api {
    static checkSolution = (array, sizeArr, arrSign) => {
        const arrIdeal = Array.from({length: sizeArr}, (_, i) => i + 1);
        let i = 0;
        while (i < sizeArr) {
            if (array[i].concat().sort().toString() !== arrIdeal.toString()) {
                return false;
            }
            i++;
        }
        i = 0;
        while (i < sizeArr) {
            const arrColumn = [];
            for (let j = 0; j < sizeArr; j++) {
                arrColumn.push(array[j][i]);
            }
            if (arrColumn.concat().sort().toString() !== arrIdeal.toString()) {
                return false;
            }
            i++;
        }
        i = 0;
        while (i < arrSign.length) {
            if (array[arrSign[i][0].x][arrSign[i][0].y] < array[arrSign[i][1].x][arrSign[i][1].y]) {
                return false;
            }
            i++;
        }
        return true;
    }

    static assumptionSolution(futoshikiArr, sizeArr, arrSign, randomComplexityCount) {
        let minLenght = sizeArr + 1;
        let minI = -1;
        let minJ = -1;
        for (let i = 0; i < futoshikiArr.length; i++) {
            for (let j = 0; j < futoshikiArr.length; j++) {
                if (typeof futoshikiArr[i][j] !== 'number' && futoshikiArr[i][j].length < minLenght) {
                    minLenght = futoshikiArr[i][j].length;
                    minI = i;
                    minJ = j;
                    if (minLenght === 2) break;
                }
            }
            if (minLenght === 2) break;
        }
        let foundSolutionCount = 0;
        let solutionFutoshiki = false;
        for (let k = 0; k < minLenght; k++) {
            const arrFindSolution = futoshikiArr.map(x => [...x]);
            arrFindSolution[minI][minJ] = arrFindSolution[minI][minJ][k];
            const solution = Api.findSolution(arrFindSolution, sizeArr, arrSign, randomComplexityCount);
            if (solution !== false) {
                foundSolutionCount ++;
                if (foundSolutionCount > 1) { 
                    return false;
                }
                solutionFutoshiki = solution;
            }
        }
        return solutionFutoshiki;
    }

    static yesNull(futoshikiArr) {
        for (let i = 0; i < futoshikiArr.length; i++) {
            for (let j = 0; j < futoshikiArr.length; j++) {
                if (typeof futoshikiArr[i][j] !== 'number') {
                    return true;
                }
            }
        }
        return false;
    }

    static findSolution(array, sizeArr, arrSign, randomComplexityCount) {
        const arrFindSolution = array.map(x => [...x]);
        const arrIdeal = Array.from({length: sizeArr}, (_, i) => i + 1);
        let isCycled = false;
        while (Api.yesNull(arrFindSolution) && !isCycled) {
            const currentArr = JSON.stringify(arrFindSolution);
            for (let i = 0; i < sizeArr; i++) {
                for (let j = 0; j < sizeArr; j++) {
                    if (typeof arrFindSolution[i][j] === 'number') {
                        Api.uniquenessChoice(arrFindSolution, sizeArr, i, j)
                        continue;
                    }
                    if (arrFindSolution[i][j] === null){ arrFindSolution[i][j] = arrIdeal;
                    }
                    for (let k = 0; k < sizeArr; k++) {
                        if (typeof arrFindSolution[i][k] === 'number') {
                            arrFindSolution[i][j] = arrFindSolution[i][j].filter((number) => number !== arrFindSolution[i][k]);
                            if (arrFindSolution[i][j].length === 1) {
                                arrFindSolution[i][j] = arrFindSolution[i][j][0];
                                break;
                            }
                        }
                    }
                    if (typeof arrFindSolution[i][j] === 'number') {
                        Api.uniquenessChoice(arrFindSolution, sizeArr, i, j)
                        continue;
                    }
                    for (let k = 0; k < sizeArr; k++) {
                        if (typeof arrFindSolution[k][j] === 'number') {
                            arrFindSolution[i][j] = arrFindSolution[i][j].filter((number) => number !== arrFindSolution[k][j]);
                            if (arrFindSolution[i][j].length === 1) {
                                arrFindSolution[i][j] = arrFindSolution[i][j][0];
                                break;
                            }
                        }
                    }
                    if (typeof arrFindSolution[i][j] === 'number') {
                        Api.uniquenessChoice(arrFindSolution, sizeArr, i, j)
                        continue;
                    }
                    for (let k = 0; k < arrSign.length; k++) {
                        if (arrSign[k][0].x === i && arrSign[k][0].y === j) {
                            let smallNumber = arrFindSolution[arrSign[k][1].x][arrSign[k][1].y] || 0;
                            if (typeof smallNumber !== 'number') {
                                smallNumber = Math.min(...smallNumber);
                            }
                            arrFindSolution[i][j] = arrFindSolution[i][j].filter((number) => number > smallNumber);
                            if (arrFindSolution[i][j].length === 1) {
                                arrFindSolution[i][j] = arrFindSolution[i][j][0]; break;
                            }
                        }
                        if (arrSign[k][1].x === i && arrSign[k][1].y === j) {
                            let bigNumber = arrFindSolution[arrSign[k][0].x][arrSign[k][0].y] || sizeArr;
                            if (typeof bigNumber !== 'number') {
                                bigNumber = Math.max(...bigNumber);
                            }
                            arrFindSolution[i][j] = arrFindSolution[i][j].filter((number) => number < bigNumber);
                                if (arrFindSolution[i][j].length === 1) {
                                    arrFindSolution[i][j] = arrFindSolution[i][j][0];
                                break;
                            }
                        }
                    }
                    Api.uniquenessChoice(arrFindSolution, sizeArr, i, j)
                }
            }
            isCycled = JSON.stringify(arrFindSolution) === currentArr;    
        }
        if (isCycled){ 
            if (randomComplexityCount.complexityCount <= randomComplexityCount.currentcomplexityCount) {
                return false;
            }
            randomComplexityCount.currentcomplexityCount++;
            return Api.assumptionSolution(arrFindSolution, sizeArr, arrSign, randomComplexityCount);
        }
        if (JSON.stringify(arrFindSolution).indexOf('[]') !== -1 || !Api.checkSolution(arrFindSolution, sizeArr, arrSign)) return false;
        return arrFindSolution;
    }

    static uniquenessChoice(arrFindSolution, sizeArr, i, j) {
        if (j === sizeArr - 1) {
            for (let findNumber = 1; findNumber < sizeArr + 1; findNumber++) {
                const re = new RegExp(findNumber.toString(), 'g');
                if ((arrFindSolution[i].toString().match(re) || []).length === 1) {
                    for (let k = 0; k < sizeArr; k++) {
                        if (typeof arrFindSolution[i][k] !== 'number' && arrFindSolution[i][k].indexOf(findNumber) !== -1) {
                            arrFindSolution[i][k] = findNumber;break;
                        }
                    }
                }
            }
        }
        if (i === sizeArr - 1) {
            const arrColumn = [];
            for (let k = 0; k < sizeArr; k++) {
                arrColumn.push(arrFindSolution[k][j]);
            }
            for (let findNumber = 1; findNumber < sizeArr + 1; findNumber++) {
                const re = new RegExp(findNumber.toString(), 'g');
                if ((arrColumn.toString().match(re) || []).length === 1) {
                    for (let k = 0; k < sizeArr; k++) {
                        if (typeof arrColumn[k] !== 'number' && arrColumn[k].indexOf(findNumber)!== -1) {
                            arrFindSolution[k][j] = findNumber;break;
                        }
                    }
                }
                
            }
        }
    }

    static comparisonTime(param) {
        const start = Date.now();
        Api.findSolution(...param);
        const end = Date.now();
        return end - start;
    }

    static comparison() {
        const mass = [];
        const futoshikiMassObject = futoshikiMass

        for(let i = 0 ; i < 30; i++) {
            console.log(i)
            mass.push(Api.comparisonTime(futoshikiMassObject[i]));
        }
        console.log(mass)
        const sum = mass.reduce(function (acc, curr) {
            return acc + curr;
        }, 0);
        console.log(sum)
    }
    
    static randomCondition = {
        4: [5, 7],
        5: [8, 11],
        6: [13, 17],
        7: [21, 27],
        8: [30, 35],
        9: [42, 47],
        10: [50, 58],
        11: [58, 64],
        13: [82, 90],
        16: [135, 140],
        20: [190, 210]
    }

    static generateLatinSquare(n) {
        let square = Array.from({ length: n }, () => Array(n).fill(null));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                square[i][j] = (i + j) % n + 1;
            }
        }
        for (let i = n - 1; i > 0 ; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = square[i];
            square[i] = square[j];
            square[j]= temp;
        }
        for (let i = n - 1; i > 0 ; i--) {
            let j = Math.floor(Math.random() * i);
            for (let k = 0; k < n; k++) {
                let temp = square[k][i];
                square[k][i] = square[k][j];
                square[k][j] = temp;
            }
        }
        return square;
    }

    static shufflingItems(array) {
        const n = array.length;
        for (let i = n - 1; i >= 0 ; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = array[i];
            array[i] = array[j];
            array[j]= temp;
        }
        return array;
    }

    static generateInequalities(futoshikiArray, sizeFutoshikiArr,  inequalitiesCount) {
        const inequalities = [];
        for (let i = 0; i < inequalitiesCount; i++) {
            const row = Math.floor(Math.random() * sizeFutoshikiArr);
            const column = Math.floor(Math.random() * sizeFutoshikiArr);
            let flag = true;
            const arrConditions = [[row - 1, column], [row + 1, column], [row, column + 1], [row, column - 1]];
            while (flag && arrConditions.length !== 0) {
                const hintRandom = Math.floor(Math.random() * arrConditions.length);
                const hint = arrConditions[hintRandom];
                if (hint[0] > -1 && hint[0] < sizeFutoshikiArr && hint[1] > -1 && hint[1] < sizeFutoshikiArr) {
                    inequalities.push(futoshikiArray[hint[0]][hint[1]] > futoshikiArray[row][column] 
                        ? [ {x: hint[0], y: hint[1]}, { x: row, y: column}] 
                        : [ {x: row, y: column}, {x: hint[0], y: hint[1]} ]
                    );
                    flag = false;
                } else {
                    arrConditions.splice(hintRandom, 1);
                }
            }
        }
        const getUniqueInequalities = (inequalitiesArray: number[][]) => {
            return inequalitiesArray.reduce(
                (res, cur) =>
                    res.find((find) => JSON.stringify(find) === JSON.stringify(cur))
                        ? res
                        : [...res, cur],
                []);
        };
        return getUniqueInequalities(inequalities);
    }

    static removeNumbers(futoshikiArrayFirst, sizeFutoshikiArr, removeCount, arrSign, levelComplexity) {
        let removeValCount = removeCount;
        const futoshikiArray = futoshikiArrayFirst.map(x => [...x]);
        for (let i = 0; i < arrSign.length; i++) {
            let j = Math.floor(Math.random() * 2);
            if (futoshikiArray[arrSign[i][j].x][arrSign[i][j].y] !== null) {
                futoshikiArray[arrSign[i][j].x][arrSign[i][j].y] = null;
                removeValCount--;
            } else {
                j = j === 0 ? 1 : 0;
                if (futoshikiArray[arrSign[i][j].x][arrSign[i][j].y] !== null) {
                    futoshikiArray[arrSign[i][j].x][arrSign[i][j].y] = null;
                    removeValCount--;
                }
            }
        }
        let countMass = removeValCount * 2;
        let randomComplexityCount = {
            complexityCount: levelComplexity,
            currentcomplexityCount: 0,
        };
        if (levelComplexity === 1) {
            randomComplexityCount.complexityCount = Math.floor(Math.random() * 2 + 2);
        }
        if (levelComplexity === 2) {
            randomComplexityCount.complexityCount = Math.floor(Math.random() * (10 - 8) + 8);
        }
        while ((removeValCount !== 0 ||
             randomComplexityCount.currentcomplexityCount < randomComplexityCount.complexityCount &&
             randomComplexityCount.currentcomplexityCount !== 0) && countMass !== 0) {
            const row = Math.floor(Math.random() * sizeFutoshikiArr);
            const col = Math.floor(Math.random() * sizeFutoshikiArr);

            if (futoshikiArray[row][col] !== null) {
                const cell = futoshikiArray[row][col]
                futoshikiArray[row][col] = null;
                removeValCount--;
                countMass--;
                const goldMiddle = sizeFutoshikiArr * sizeFutoshikiArr / 2
                if (removeCount > goldMiddle && removeValCount < goldMiddle) {
                    const currentCount = randomComplexityCount.currentcomplexityCount;
                    if (!Api.findSolution(futoshikiArray, sizeFutoshikiArr, arrSign, randomComplexityCount)) {
                        futoshikiArray[row][col] = cell;
                        randomComplexityCount.currentcomplexityCount = currentCount;
                        removeValCount++;
                    }
                }
            }
        }
        return futoshikiArray;
    }

    static generateFutoshiki(sizeFutoshikiArr, levelComplexity) {
        const square = Api.generateLatinSquare(sizeFutoshikiArr);
        const minCount = Api.randomCondition[sizeFutoshikiArr][0];
        const maxCount = Api.randomCondition[sizeFutoshikiArr][1];
        const randomHelpCount = Math.floor(Math.random() * (maxCount - minCount) + minCount);
        const minRandomInequalitiesCount = Math.floor(sizeFutoshikiArr / 3 * (sizeFutoshikiArr - 4) + 1);
        let randomInequalitiesCount = Math.floor(Math.random() * (randomHelpCount - minRandomInequalitiesCount) + minRandomInequalitiesCount);
        const inequalities = Api.generateInequalities(square, sizeFutoshikiArr, randomInequalitiesCount);
        randomInequalitiesCount = inequalities.length;
        const randomRemoveCount = sizeFutoshikiArr * sizeFutoshikiArr - (randomHelpCount - randomInequalitiesCount);
        const futoshiki = Api.removeNumbers(square, sizeFutoshikiArr, randomRemoveCount, inequalities, levelComplexity);
        return [futoshiki, inequalities, square];
    }

    static checkErrorInput(futoshikiArray, arrSign, row, column, valueInput) {
        for (let i = 0; i < futoshikiArray.length; i++) {
            if (i != column && futoshikiArray[row][i] === valueInput) {
                return [row, i];
            }
            if (i != row && futoshikiArray[i][column] === valueInput) {
                return [i, column];
            }
        }
        for (let k = 0; k < arrSign.length; k++) {
            if (arrSign[k][0].x == row && arrSign[k][0].y == column) {
                let smallNumber = futoshikiArray[arrSign[k][1].x][arrSign[k][1].y] || 1;
                if (valueInput <= smallNumber) {
                    return row > arrSign[k][1].x || column > arrSign[k][1].y ?
                        `[${arrSign[k][1].x}][${arrSign[k][1].y}][${row}][${column}]` :
                    
                    `[${row}][${column}][${arrSign[k][1].x}][${arrSign[k][1].y}]`;
                }
            }
            if (arrSign[k][1].x == row && arrSign[k][1].y == column) {
                let bigNumber = futoshikiArray[arrSign[k][0].x][arrSign[k][0].y] || futoshikiArray.length;
                if (valueInput >= bigNumber) {
                    return row > arrSign[k][0].x || column > arrSign[k][0].y ?
                    `[${arrSign[k][0].x}][${arrSign[k][0].y}][${row}][${column}]`:
                    `[${row}][${column}][${arrSign[k][0].x}][${arrSign[k][0].y}]`;
                }
            }
        }
        return false;
    }
}

export default Api;