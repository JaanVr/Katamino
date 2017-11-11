function fillsquare(x, y, color)
{
    context.fillStyle = color;
    context.fillRect(p+x*squaresize+1, p+y*squaresize+1, squaresize-1, squaresize-1);
}

function drawBoard()
{
    for (var x = 0; x <= bw; x += squaresize) 
    {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }
    for (var x = 0; x <= bh; x += squaresize)
    {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }
    context.strokeStyle = "black";
    context.stroke();

    for (var y = 0; y < board.length; y++)
    {
        for (var x = 0; x < board[y].length; x++)
        {
            if (board[y][x] == 0)
            {                
                fillsquare(x, y, 'white');
            }
            else if (board[y][x][0] == 1)
            {                
                fillsquare(x, y, 'red');
            }
            else if (board[y][x][0] == 2)
            {                
                fillsquare(x, y, 'brown');
            }              
        }
    }
}

function select(e) 
{
    for (var y = 0; y < board.length; y++)
    {
        for (var x = 0; x < board[y].length; x++)
        {
            if(e.layerX > p+x*squaresize && e.layerX < p+x*squaresize+squaresize)
            {
                selected_x = x;
            }
            if(e.layerY > p+y*squaresize && e.layerY < p+y*squaresize+squaresize)
            {
                selected_y = y;
            }                 
        }
    }
    selected_coordinates = [selected_x, selected_y]
}

function add_piece_to_board(piece, x_offset, y_offset, color)
{
    for (var y = 0; y < piece.length; y++)
    {
        for (var x = 0; x < piece[y].length; x++)
        {
            if (piece[y][x] == 1)
            {
                new_x = x + x_offset;
                new_y = y + y_offset;

                //edge detection
                if (new_x < 0 || new_y < 0 || new_x >= xsize || new_y >= ysize)
                {
                    return 1
                }

                //collision detection. if detected, dont draw                
                if (board[y + y_offset][x + x_offset] != 0)
                {
                    return 1
                }
            }            
        }
    }

    for (var y = 0; y < piece.length; y++)
    {
        for (var x = 0; x < piece[y].length; x++)
        {
            if (piece[y][x] == 1)
            {
                board[y + y_offset][x + x_offset] = [color,piece,x_offset,y_offset]                
            }            
        }
    }
}

function remove_a_piece_from_board(x,y)
{
    piece = board[y][x][1]
    x_offset = board[y][x][2]
    y_offset = board[y][x][3]

    for (var y = 0; y < piece.length; y++)
    {
        for (var x = 0; x < piece[y].length; x++)
        {
            if (piece[y][x] == 1)
            {
                board[y + y_offset][x + x_offset] = 0                
            }            
        }
    }
}

function copy_board(board1, board2)
{
    for (var y = 0; y < ysize; y++)
    {
        for (var x = 0; x < xsize; x++)
        {
            if (board2[y][x] == 0)
            {
                board1[y][x] = board2[y][x]
            }
            else
            {
                board1[y][x] = [board2[y][x][0], board2[y][x][1], board2[y][x][2], board2[y][x][3]]
            }
            
        }
    }
}

function drawpiece(piece, x, y, color)
{
    collision = add_piece_to_board(piece, x, y, color);
    if (collision)
    {
        //return to previous state
        copy_board(board, old_board);
    }
    else
    {
        //update state
        copy_board(old_board, board);
    }
    drawBoard();
}

function removepiece(location)
{
    if (board[location[1]][location[0]] != 0)
    {
        remove_a_piece_from_board(location[0], location[1]);
        drawBoard();
    }
}

function movepiece(location, direction)
{
    if (board[location[1]][location[0]] != 0)
    {
        color = board[location[1]][location[0]][0]
        piece = board[location[1]][location[0]][1]
        x_offset = board[location[1]][location[0]][2]
        y_offset = board[location[1]][location[0]][3]
        old_location = [location[0], location[1]]
        remove_a_piece_from_board(location[0], location[1]);
    
        if (direction == "down")
        {
            y_offset += 1;
            location[1] += 1;
        }
        else if (direction == "up")
        {
            y_offset -= 1;
            location[1] -= 1;
        }
        else if (direction == "left")
        {
            x_offset -= 1;
            location[0] -= 1;
        }
        else if (direction == "right")
        {
            x_offset += 1;
            location[0] += 1;
        }

        collision = add_piece_to_board(piece, x_offset, y_offset, color);
        if (collision)
        {
            //return to previous state
            copy_board(board, old_board);
            location[0] = old_location[0];
            location[1] = old_location[1];
        }
        else
        {
            //update state
            copy_board(old_board, board);
        }
        drawBoard();
    }
}

function doKeyDown(e) 
{
    console.log( e.keyCode );
    //console.log(selected_coordinates);
    if (selected_coordinates != 0)
    {
        if (e.keyCode == 83)
        {
            movepiece(selected_coordinates, "down");
        }
        else if (e.keyCode == 87)
        {
            movepiece(selected_coordinates, "up");
        }
        else if (e.keyCode == 68)
        {
            movepiece(selected_coordinates, "right");            
        }
        else if (e.keyCode == 65)
        {
            movepiece(selected_coordinates, "left");            
        }
        else if (e.keyCode == 46)
        {
            removepiece(selected_coordinates);
        }
    }
}

var xsize = 5
var ysize = 12
var squaresize = 80
var bw = xsize * squaresize;
var bh = ysize * squaresize;
var p = 10;
var board = [];
var old_board = [];
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var selected_coordinates = 0

var piece1 = 
[[1,0],
 [1,0],
 [1,1],
 [1,0]];

var piece2 = 
[[0,1],
 [0,1],
 [1,1],
 [0,1]];

var piece3 = 
[[1,0],
 [1,1],
 [1,0],
 [1,0]];

var piece4 = 
[[0,1],
 [1,1],
 [0,1],
 [0,1]];

var piece5 = 
[[1,1,1,1],
 [0,0,1,0]];

var piece6 = 
[[1,1,1,1],
 [0,1,0,0]];

var piece7 = 
[[0,0,1,0],
 [1,1,1,1]];

var piece8 = 
[[0,1,0,0],
 [1,1,1,1]];

var piece9 = 
[[0,1,0],
 [1,1,1],
 [0,1,0]];

canvas.addEventListener("click", select, false);
window.addEventListener("keydown", doKeyDown, true);

//initalize gameboard
for (var y = 0; y < ysize; y++)
{
    board[y] = [xsize];
    old_board[y] = [xsize];
    for (var x = 0; x < xsize; x++)
    {
        board[y][x] = 0;
        old_board[y][x] = 0;
    }
}

drawpiece(piece3, 0, 0, 2);
drawpiece(piece9, 0, 4, 1);