
let squares = document.getElementsByClassName("box");
let miniSquares = document.getElementsByClassName("miniBox");
let modal = document.getElementById('myModal');
let restart = document.getElementById("restart")
let modalRestart = document.getElementById("modalRestart")
restart.innerHTML += "Restart"
modalRestart.innerHTML += "Try Again"
let scorePoint = 0;
let gameOver = false;
let miniX = 1;
let miniY = 0;
let x = 3;
let y = 0;
let newX = 0;
let newY = 0;
let row = 17;
let col = 10;
let logicBoard = [];
let rowFullnessVector = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let nextElem = RandomElement();
let nextColor = RandomColor();
let element = RandomElement();
let color = RandomColor();
let firsttime = false;
const deltaT = 500;


function createDeck(numberOfDivs, containerType, className)
{
	let container = document.getElementById(containerType);
	for (let i = 0; i < numberOfDivs; i++)
	{
		let newDiv = "<div class = \'"+ className +"\'/>"
		container.innerHTML += newDiv;
	}
}


createDeck(170, "container", "box"); //creating 190 divs (empty squares of tetris)
createDeck(20, "miniContainer", "miniBox"); 


//makeing 2dimensinal array , from array of dives.
function intoMatrix(array, sizeofSubarray) 
{
	var matrix = [], i, k;

	for (i = 0, k = -1; i < array.length; i++) 
	{
		if (i % sizeofSubarray === 0) 
		{
			k++;
			matrix[k] = [];
		}

		matrix[k].push(array[i]);
	}

	return matrix;
}

let Board = intoMatrix(squares, 10); //Board  is 2 dimensional matrix now.
let miniBoard = intoMatrix(miniSquares, 5); 
let emptyBox = Board[0][0] 

// createing logic board , which consists of "0"s.	
function initLogicBoard() 
{
	for(let y = 0; y < row; y++)
	{
		tempArr = [];
		for(let x = 0; x < col; x++)
		{   
			tempArr.push(0);
		}	
		logicBoard.push(tempArr)	
	}
}


function drawSquare(x, y, color, board)  
{
	if(y < board.length && x < board[0].length)  //check if x and y are inrange of board length
	{
		board[y][x].style.background = color;
	}
} 

//drawing random elems with random colors on board.
function drawElemOnBoard(activeElem, color, board, x, y)
{
	for(let r = 0; r < activeElem.length; r++)
	{
		for(let c=0; c < activeElem[r].length; c++)
		{
			if(activeElem[r][c] === 1)
			{
				drawSquare(x + c, y + r, color, board);
			}	
		}
	}
}

//cheks, if there is no any crash with walls or other elems, moves down the element. 
function moveDown()
{
	if(!crashChecker(0, 1, element))
	{ 
		if(!firsttime)
		{
			drawElemOnBoard(element, color, Board, x, y);
			firsttime = true;
		}
		else
		{
			drawElemOnBoard(element, "black", Board, x, y);
			y++;
			drawElemOnBoard(element, color, Board, x, y);
		}
	}

	else 
	{  
		firsttime = false;
		lock(element , color);
		nextElemCreation();
	}
}

//if there is nor crash , moves left , clicking  <-
function moveLeft()
{		
	if(!crashChecker(-1, 0, element))
	{
		drawElemOnBoard(element, "black", Board, x, y);
		x--;
		drawElemOnBoard(element, color, Board, x, y);
	}
}


// moves the element right , while clicking ->
function moveRight()
{
	if(!crashChecker(1, 0, element))
	{	
		drawElemOnBoard(element, "black", Board, x, y);
		x++;
		drawElemOnBoard(element, color, Board, x, y);
	}
}

//rotates the element 90 degrees in clockwise direction
function rotateRight(oldElem)
{ 
	let activeElem = JSON.parse(JSON.stringify( oldElem ));
	activeElem.reverse();
	for (let i = 0; i < activeElem.length; i++) 
	{
		for (let j = 0; j < i; j++)
		{	
			[ activeElem[i][j] , activeElem[j][i] ] = [ activeElem[j][i] , activeElem[i][j] ];
		}
	}
	let step = 0;

	if(crashChecker(0, 0, activeElem))
	{
		if(x > col/2)
		{
			//right wall
			step = -1;
		}
		else
		{
			//left wall 
			step = 1;
		}
	}
	if(!crashChecker(step, 0, activeElem))
	{	
		drawElemOnBoard(element, "black", Board, x, y);
		x += step;
		element = activeElem;
		drawElemOnBoard(element, color, Board, x, y);
	}
}

//rotates the element 90 degrees in anti-clockwise direction
function rotateLeft(oldElem)
{ 
	let activeElem = JSON.parse(JSON.stringify( oldElem ));

	for(let i = 0; i < activeElem.length; i++)
	{
		for(let j = 0; j < activeElem[i].length/2; j++ )
		{
			[ activeElem[i][j] , activeElem[i][activeElem.length-1-j] ] = [ activeElem[i][activeElem.length-1-j] , activeElem[i][j]];
		}
	}
	for(let i = 0; i < activeElem.length; i++)
	{
		for(let j = i; j < activeElem[i].length; j++ )
		{
			[ activeElem[i][j] , activeElem[j][i] ] = [ activeElem[j][i] , activeElem[i][j]];
		}
	}
	let step = 0;

	if(crashChecker(0, 0, activeElem))
	{
		if(x > col/2)
		{
			//right wall
			step = -1;
		}
		else
		{
			//left wall 
			step = 1;
		}
	}
	if(!crashChecker(step, 0, activeElem))
	{	
		drawElemOnBoard(element, "black", Board, x, y);
		x += step;
		element = activeElem;
		drawElemOnBoard(element, color, Board, x, y);
	}
}

//creates the next elem
function nextElemCreation()
{
	color = nextColor;
	element = nextElem;
	drawElemOnBoard(nextElem, "black", miniBoard, miniX, miniY);
	nextElem = RandomElement();
	nextColor = RandomColor();
	drawElemOnBoard(nextElem, nextColor, miniBoard, miniX, miniY);
	x = 3;
	y = 0;	
}

// openes modal
function gamedOver() 
{
	modal.style.display = "block";
}

//checks if the element crashed with walls or floor ,or with other element
function crashChecker(x1, y1, activeElem)
{
	for(let r = 0; r < activeElem.length; r++)
	{
		for(let c = 0; c < activeElem.length; c++)
		{
			if(activeElem[r][c] === 0 )
			{	
				continue;
			}
			newX = x + c + x1;
			newY = y + r + y1;

			if(newX < 0 || newX >= col || newY >= row)
			{
				return true;
			}
			if(newY < 0)
			{
				continue;
			}
			if(logicBoard[newY][newX] !== 0 )
			{		
				return true;
			}						
		}
	}
	return false;		
}

//locks the element , or stops the game , when there is game over.
function lock(activeElem, colore)
{
	for(let r = 0; r < activeElem.length; r++)
	{
		for(let c = 0; c < activeElem.length; c++)
		{
			if(activeElem[r][c] === 0)
			{	
				continue;
			}
			if(y + r <= 0)
			{
				gameOver = true;
				clearInterval(drop);
				gamedOver();			
			}

			Board[y+r][x+c].style.background = colore;
			logicBoard[y+r][x+c] = 1;
			rowFullnessVector[y+r]++;
		}
	}
	rowFullnessVector = checkForRowDeletion(rowFullnessVector);
}

//cheks , if there is row which is fully.
function checkForRowDeletion(arr)
{ 
	for(let i = 0 ; i < arr.length; i++)
	{
		if(arr[i]>=col)
		{  
			Board = removeTheRowView(i)
			logicBoard = removeTheRow(i, logicBoard, 0)
			for(let k = i-1; k >= 0; k--)
			{
				arr[k+1] = arr[k]
			}
			arr[0] = 0;
			updateScore();
		}
	}
	return arr;
}


function updateScore()
{
	addScore();
	printScore();
}


function printScore()
{
   document.getElementById("score1").innerHTML = "Your Score is: " + scorePoint;
}


function addScore()
{
	scorePoint += 10;
}

//removes the row from view Board. 
function removeTheRowView(index)
{ 
	for(let y = index - 1; y >= 0; y--)
	{
		for(let x = 0; x < col; x++)
		{
			Board[y+1][x].style.background = Board[y][x].style.background
		}
	}
	for(let x = 0; x < col; x++)
	{
		Board[0][x].style.background = "black";
	}
	return Board;
}

//removes the row from logic Board.
function removeTheRow(index,board,emptyEl)
{ 
	for(let y = index - 1; y >= 0; y--)
	{
		for(let x = 0; x < col; x++)
		{
			board[y+1][x] = board[y][x]
		}
	}
	for(let x = 0; x < col; x++)
	{
		board[0][x] = emptyEl;
	}
	return board;
}


//Controles the Pieces 
document.addEventListener("keydown", Control);
function Control(event)
{
	if(event.keyCode === 39)
	{
		moveRight();
	}
	else if(event.keyCode === 37)
	{
		moveLeft();
	}
	else if(event.keyCode === 38)
	{
		rotateRight(element);
	}
	else if(event.keyCode === 40)
	{
		rotateLeft(element);
	}
	else if(event.keyCode === 32)
	{
		moveDown();
	}	
}

//creates random elements
function RandomElement()
{
	let Z =  [[1,1,0],
	[0,1,1],
	[0,0,0]];

	let T =  [[1,1,1],
	[0,1,0],
	[0,0,0]];

	let L =  [[1,0,0],
	[1,0,0],
	[1,1,0]];

	let I =  [[1,1,1,1],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0]];

	let O =  [[1,1],
	[1,1], 
	];
	let J =  [[0,1,0],
	[0,1,0],
	[1,1,0]];

	let S =  [[0,1,1],
	[1,1,0],
	[0,0,0]]                  

	let elements = [Z,T,L,O,I,J,S];
	let element = elements[Math.floor(Math.random()*elements.length)];
	return element;
}

//creates random colores
function RandomColor()
{
	let ColoreArr = ["#ECF0F1","#D0D3D4","#EB984E","#95A5A6","#E67E22"]
	let color = ColoreArr[Math.floor(Math.random()*ColoreArr.length)];
	return color;
}

//****Code section***//

initLogicBoard(); 
printScore();
drawElemOnBoard(element, color, Board, x, y)
drawElemOnBoard(nextElem , nextColor, miniBoard, miniX, miniY)

if(!gameOver)
{
	drop = setInterval(moveDown, deltaT)
}



