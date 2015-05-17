$(document).ready(function(){
	start_game(get_board_data_on_page_load());
});

function start_game(start_conditions){
	var total_bombs = start_conditions['b'];
	var b_height = start_conditions['h'];
	var b_length = start_conditions['l'];
	var board = init_board;
}


function init_board(w, h, m) {
  var board = blank_board(w, h);
  var mine;
  var mine_top;
  var mine_bottom;
  var mine_left;
  var mine_right;
  for(var i =0;i<m;i++) {
    mine = unique_mine(board, w, h);
    board[mine[x]][mine[y]] = 'm'
    mine_top = (mine[y] == 0)
    mine_left = (mine[x] == 0)
    mine_right = (mine[x] == w-1)
    mine_bottom = (mine[y] == h-1)
    //incrementing upper left
    if(!mine_top and !mine_left and board[mine[x]-1][mine[y]-1] != 'm'){
      board[mine[x]-1][mine[y]-1] = board[mine[x]-1][mine[y]-1] + 1;
    }
    //incrementing above
    if(!mine_top and board[mine[x]][mine[y]-1] != 'm'){
      board[mine[x]][mine[y]-1] = board[mine[x]][mine[y]-1] + 1;
    }
    //incrementing upper right
    if(!mine_top and !mine_right and board[mine[x]+1][mine[y]-1] != 'm'){
      board[mine[x]+1][mine[y]-1] = board[mine[x]+1][mine[y]-1] + 1;
    }
    //incrementing right
    if(!mine_right and board[mine[x]+1][mine[y]] != 'm'){
      board[mine[x]+1][mine[y]] = board[mine[x]+1][mine[y]] + 1;
    }
    //incrementing bottom right
    if(!mine_bottom and !mine_right and board[mine[x]+1][mine[y]+1] != 'm'){
      board[mine[x]+1][mine[y]+1] = board[mine[x]+1][mine[y]+1] + 1;
    }
    //incrementing bellow
    if(!mine_bottom and board[mine[x]][mine[y]+1] != 'm'){
      board[mine[x]][mine[y]+1] = board[mine[x]][mine[y]+1] + 1;
    }
     //incrementing bottom left
    if(!mine_bottom and !mine_left and board[mine[x]-1][mine[y]+1] != 'm'){
      board[mine[x]-1][mine[y]+1] = board[mine[x]-1][mine[y]+1] + 1;
    }
    //incrementing left
    if(!mine_left and board[mine[x]-1][mine[y]] != 'm'){
      board[mine[x]-1][mine[y]] = board[mine[x]-1][mine[y]] + 1;
    }
  }
  return board
}
  
function unique_mine(board, w, h){
  var x = Math.floor((Math.random() * w) + 1);
  var y = Math.floor((Math.random() * h) + 1);
  
  if(board[x][y] != 'm'){
    return {x: x, y: y};
  } else {
    return unique_mine(board, w, h);
  }
}
    
function blank_board(w, h){
  //returns w by h board filled with 0's meaning 0 mines around this spot
  var board = []
  var column = []
  for(var i =0;i<h;i++) { column.push(0); }
  for(var i=0;i<w;i++) { board.push(column); }
  return board
}

function get_board_data_on_page_load(){
	var starting_bombs = parseInt(document.getElementById("mines").innerHTML);
	var b_height = document.getElementById(board-table).getElementsByTagName("tr").length;
	var b_length = document.getElementById(board-table).getElementsByTagName("tr")[0].getElementsByTagName("td").length;
	return {h:b_height,l:b_length,b:starting_bombs};
}

//Code to initialize the clock. Returns a function that will reset the clock.
function initialize_clock(){
	var counter = setInterval(increment_timer(), 1000);

	function increment_timer() {
		// init the count to 0
		var timer = 0;
	
		function secconds_to_display(s) {
			var display = '000';
			var check = Math.floor(s/1000);
			if(Math.floor(s/1000) > 0)
			{
				display = '';
			}
			else if(Math.floor(s/100) > 0)
			{
				display = '0';
			}
			else if(Math.floor(s/10) > 0)
			{
				display = '00';
			}
			display += s.toString();
			return display;
		};
	
		return function() {
			timer++;
			document.getElementById("clock").innerHTML = secconds_to_display(timer);
		};
	};
	
	return function() {
		clearInterval(counter);
		counter = setInterval(increment_timer(), 1000);
	};
};