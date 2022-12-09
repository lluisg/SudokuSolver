class Cell{

  constructor(_x, _y){
    // y rows, x cols
    this.x = _x;
    this.y = _y;
    this.id = this.x.toString()+this.y.toString();
    this.value = 0;
    if (typeof document !== "undefined") {
      this.value = parseInt(document.getElementById(this.id).value);
    }
    // this.value = parseInt(document.getElementById(this.id).value);
    this.solved = false;
    this.possibleSolution = new Array();
  }

  setPossibleSolutions(arr){
      this.possibleSolution = arr.slice();
  }
  getPossibleSolutions(){
      return this.possibleSolution;
  }

  setValue(v){
    this.value = v;
    // change value of the html element
    // do after the set is made
    document.getElementById( this.id ).value = this.value;
    document.getElementById( this.id ).setAttribute("style", "color: blue;");
    this.possibleSolution = new Array();
    this.solved = true;
  }
  getValue(){
    return this.value;
  }

  set solved(s){
    this._solved = s;
  }
  get solved(){
    return this._solved;
  }

  update(){
    this.value = parseInt(document.getElementById( this.id ).value);
    if(!Number.isNaN(this.value)){
      this.solved = true;
    }
  }

  reestartCell(){
    document.getElementById( this.id ).value = "";
    document.getElementById( this.id ).setAttribute("style", "color: black;");
    this.value = parseInt(document.getElementById(this.id).value);
    this.solved = false;
    this.setPossibleSolutions(new Array());
  }
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

class Board{

  constructor(){
    // this.table = document.getElementsByTagName("table");
    this.createCells();
  }

  createCells(){
    var cells = new Array(9);
    for (let i = 0; i < cells.length; i++) {
      cells[i] = new Array(9);
    }

    // rows (y)
    for(let i=0; i<9; i++){
      // columns (x)
      for(let j=0; j<9; j++){
        var cell = new Cell(j+1, i+1);
        cells[j][i] = cell;
      }
    }
    this.cells = cells;
    // console.log(this.cells);
  }

  updateTable(){
    for(let i=0; i<9; i++){
      // columns (x)
      for(let j=0; j<9; j++){
        this.cells[j][i].update();
      }
    }
  }

  possibleSolutionCell(j, i){
    // console.log('coordinate', j+1,i+1);

    var s = this.cells[j][i].solved;
    if(s == false){
      // where the possible values of the actual cell are saved
      var possibleValuesRow = new Array();
      var possibleValuesCol = new Array();
      var possibleValuesSq = new Array();
      var allPossibleValues = new Array();
      var uniquePossibleValues = new Array();

      // get all numbers in the same column
      for(let iaux=0; iaux<9; iaux++){
        var val = this.cells[j][iaux].getValue();
        if(!Number.isNaN(val)){
          possibleValuesCol.push(val);
        }
      }

      // get all numbers in the same row
      for(let jaux=0; jaux<9; jaux++){
        var val = this.cells[jaux][i].getValue();
        if(!Number.isNaN(val)){
          possibleValuesRow.push(val);
        }
      }

      // get all numbers in the same square
      // get the square where we are
      var squarex = Math.floor(j/3)
      var squarey = Math.floor(i/3)
      // check the values of all the same square
      for(let iaux=0; iaux<9; iaux++){
        for(let jaux=0; jaux<9; jaux++){
          if(Math.floor(jaux/3) == squarex && Math.floor(iaux/3) == squarey){
            var val = this.cells[jaux][iaux].getValue();
            if(!Number.isNaN(val)){
              possibleValuesSq.push(val);
            }
          }
        }
      }

      // concatenate all the possible values
      allPossibleValues = possibleValuesRow.concat(possibleValuesCol, possibleValuesSq);

      // check which numbers don't apper (the possible solutions)
      var possibilities = [1,2,3,4,5,6,7,8,9];
      for(let w=0; w<allPossibleValues.length; w++){
        let index = possibilities.indexOf(allPossibleValues[w]);
        if (index > -1) {
          possibilities.splice(index, 1);
        }
      }

      // update values that can be possible in the cell
      this.cells[j][i].setPossibleSolutions(possibilities);
    }
  }

  uniqueRow(j, i, actualPossible){
    // returns the unique possible solutions for that cell comparing to the cells the same row
    var possibleActual = actualPossible.slice();

    // remove the the solutions other cells on the same row have also
    for(let jaux=0; jaux<9; jaux++){
      if(jaux!=j){
        if(!Number.isNaN(this.cells[jaux][i].getPossibleSolutions()) && this.cells[jaux][i].getPossibleSolutions()!=undefined){
          var possibleRow = this.cells[jaux][i].getPossibleSolutions().slice();
          for(let w=0; w<possibleRow.length; w++){
            let index = possibleActual.indexOf(possibleRow[w]);
            if (index > -1) {
              possibleActual.splice(index, 1);
            }
          }
        }
      }
    }
    return possibleActual;
  }

  uniqueCol(j, i, actualPossible ){
    // returns the unique possible solutions for that cell comparing to the cells the same column
    var possibleActual = actualPossible.slice();

    for(let iaux=0; iaux<9; iaux++){
      if(iaux!=i){
        if(!Number.isNaN(this.cells[j][iaux].getPossibleSolutions()) && this.cells[j][iaux].getPossibleSolutions()!=undefined){
          var possibleCol = this.cells[j][iaux].getPossibleSolutions().slice();
          for(let w=0; w<possibleCol.length; w++){
            // extract the possible values that appear on other cells
            let index = possibleActual.indexOf(possibleCol[w]);
            if (index > -1) {
              possibleActual.splice(index, 1);
            }
          }
        }
      }
    }
    return possibleActual;
  }

  uniqueSquare(j, i, actualPossible){
    // returns the unique possible solutions for that cell comparing to the cells the same square
    var possibleActual = actualPossible.slice();

    // get the square where we are
    var squarex = Math.floor(j/3)
    var squarey = Math.floor(i/3)
    // get the possible solutions for the cells in the same square
    for(let iaux=0; iaux<9; iaux++){
      for(let jaux=0; jaux<9; jaux++){
        if(!(jaux==j && iaux==i)){
          if(Math.floor(jaux/3) == squarex && Math.floor(iaux/3) == squarey){
            if(!Number.isNaN(this.cells[jaux][iaux].getPossibleSolutions()) && this.cells[jaux][iaux].getPossibleSolutions()!=undefined){
              var possibleSq = this.cells[jaux][iaux].getPossibleSolutions().slice();
              for(let w=0; w<possibleSq.length; w++){
                let index = possibleActual.indexOf(possibleSq[w]);
                if (index > -1) {
                  possibleActual.splice(index, 1);
                }
              }
            }
          }
        }
      }
    }
    return possibleActual;
  }

  checkCell(j, i){
    // console.log('coordinate', j+1,i+1);

    if(this.cells[j][i].solved == true){
      return [true, false] //solved but it was already
    }else{

      var possibleActual = this.cells[j][i].getPossibleSolutions().slice();

      // if when updating, only one value has remained
      if(possibleActual.length == 1){
        // console.log('changedA', j, i, this.cells[j][i].getPossibleSolutions(), possibleActual);
        this.cells[j][i].setValue(possibleActual[0]);
        return [true, true];
      }

      var possR = this.uniqueRow(j, i, possibleActual).slice()
      // if there's only one number possible thorugh the rows, we assign it
      if(possR.length == 1){
        // console.log('changedR', j, i, this.cells[j][i].getPossibleSolutions(), possR);
        this.cells[j][i].setValue(possR[0]);
        return [true, true];
      }

      var possC = this.uniqueCol(j, i, possibleActual).slice()
      // if there's only one number possible thorugh the columns, we assign it
      if(possC.length == 1){
        // console.log('changedC', j, i, this.cells[j][i].getPossibleSolutions(), possC);
        this.cells[j][i].setValue(possC[0]);
        return [true, true];
      }

      var possS = this.uniqueSquare(j, i, possibleActual).slice()
      // if there's only one number possible thorugh the rows, we assign it
      if(possS.length == 1){
        // console.log('changedS', j, i, this.cells[j][i].getPossibleSolutions(), possS);
        this.cells[j][i].setValue(possS[0]);
        return [true, true];
      }
    }
  return [false, false];
  }

  clearBoard(){
    for(let i=0; i<9; i++){
      for(let j=0; j<9; j++){
        this.cells[j][i].reestartCell();
      }
    }
  }
}

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

var myboard;
var MAX_CYCLE = 80;

function createBoard(){
  myboard = new Board();
}

function solve(){
  myboard.updateTable();
  var cycle = 0, solvedAlready = 0; //limit of 300 cycles, to not do it infinitely

  // if there's some kind of error, solveSudoku will serve as the break checkpoint
  solveSudoku:
  while(solvedAlready!=81 && cycle<MAX_CYCLE){
    cycle=cycle+1;
    solvedAlready=0;

    // calculate the possible solutions for all the non-solved cells
    for(let y=0; y<9; y++){
      for(let x=0; x<9; x++){
        myboard.possibleSolutionCell(x,y);
      }
    }

    // if a non-solved cell is solved, findSolution will serve as the break checkpoint
    findSolution:
    for(let y=0; y<9; y++){
      for(let x=0; x<9; x++){
        // checked true if it's solved
        // solved true if it has changed, false if it was already solved or has not been solved
        var sol = myboard.checkCell(x,y);
        checked = sol[0]
        solved = sol[1];
        if(checked){
          // count the number of solved cells
          solvedAlready=solvedAlready+1;
        }
        if(solved && checked){
          // as we found a solution for a cell we stop the iteration and
          // update all the cells possible solutions, and search again
          break findSolution;
        }
      }
    }
  }
  console.log('solved!')
}

function solveStep(){
  // does the same as the solve function but solve one cell at a time
  solvedAlready = 0;
  myboard.updateTable();
  for(let y=0; y<9; y++){
    for(let x=0; x<9; x++){
      myboard.possibleSolutionCell(x,y);
    }
  }
  count:
  for(let y=0; y<9; y++){
    for(let x=0; x<9; x++){
      var sol = myboard.checkCell(x,y);
      checked = sol[0]
      solved = sol[1];
      if(solved && checked){
        break count;
      }else if(checked){
        solvedAlready = solvedAlready+1;
        if(solvedAlready==81){
          alert("The sudoku is already solved.");
        }
      }
      if(x==8 && y==8 && solved==false){
          alert("There have been some kind of error.\nCheck all the number are well placed")
      }
    }
  }
  console.log('solved!')
}


function clean(){
  console.log('Cleaning the board');
  myboard.clearBoard();
}

function load(){
  console.log('not implemented');
}

createBoard();
