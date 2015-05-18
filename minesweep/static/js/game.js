$(document).ready(function(){
	start_game(get_board_data_on_page_load());
});

function start_game(start_conditions){
	//initializing vars
	var total_mines = start_conditions['b'];
	var b_height = start_conditions['h'];
	var b_length = start_conditions['l'];
	var board = init_board(b_length, b_height, total_mines);
	//storing a list of bombs that were planted for later reference
	var bombs = board['bombs'];
	board = board['board'];
	var game_over = false;
	var game_won = false;
	var flags = 0;
	
	//the function to stop the clock is set to false until the clock starts
	var stop_clock = false;
	
	//just using one of the images to get the path to assets
	var face = $("#face");
	var path_for_image_src = face.prop('src');
	var path_substring_length = path_for_image_src.lastIndexOf('/') + 1;
	path_for_image_src = path_for_image_src.substring(0,path_substring_length);
	
	//initializing the listners
	$(".board-unit").mousedown( function(e){ click_unit(e); } );
	$(".board-unit").mouseup( function(e){ off_click_unit(e); } );
	document.getElementById('board-table').addEventListener('contextmenu', function(e){ e.preventDefault(); return false;}, false);
	$(this).mouseup( function(e){restore_happy_face_if_event_outside_board(e)} );
	face.click( function(e){ face_reset_function(); } );
	
	function face_reset_function() {
		if(stop_clock){ stop_clock(); }
		reset_board();
		document.getElementById("mines").innerHTML = (total_mines).toString();
		document.getElementById("clock").innerHTML = "0000";
		start_game(start_conditions);
	};
	
	function restore_happy_face_if_event_outside_board(e){
		if (!curser_on_board(e)) {
			face.attr("src",  path_for_image_src + 'faces_smile.png');
		}
	};
	
	//mousedown on a square
	function click_unit(e){
		if(e.button == 0 && $(e.target).hasClass('covered'))
		{
			face.attr("src",  path_for_image_src + 'faces_scared.png');
		}
	};
	
	//mouseup on a square
	function off_click_unit(e) {
		
		var unit = $(e.target);
		var flag_click = (e.button == 2 || e.button == 1);
		
		if(stop_clock == false) {
			//first click start the clock and get stop clock function
			stop_clock = initialize_clock();
		}
		
		//only execute code if we are clicking a covered square
		//or if we are right-clicking a flagged square to undo-it
		//this prevents users from accidentally tripping mines they've flagged
		if (unit.hasClass('covered') || (flag_click && unit.hasClass("flagged")))
		{
			if (flag_click) 
			{
				if(unit.hasClass('covered'))
				{
					unit.removeClass('covered');
					unit.addClass('flagged');
					flags++;
				}
				else
				{
					//If we right click and it's not covered the function will only fire
					//if the square is flagged to unflag it
					unit.removeClass('flagged');
					unit.addClass('covered');
					flags--;
				}
				document.getElementById("mines").innerHTML = (total_mines - flags).toString();
			}
			else
			{
				var params = unit.attr('id').split("-");
				var x = parseInt(params[0]);
				var y = parseInt(params[1]);
				var uncovered_hash = {};
				uncovered_hash[unit.attr('id')] = true;
				uncover_single_square(x,y,uncovered_hash);
				check_for_win();
			}
		}
		
		if(game_over)
		{
			//document.getElementById("face").className = "dead";
			face.attr("src",  path_for_image_src + 'faces_dead.png');
			stop_clock();
			//set to false for when reset button is pressed after game close
			stop_clock = false;
			deactivate_board();
			make_loser_board();
		}
		else if(game_won)
		{
			//document.getElementById("face").className = "cool";
			face.attr("src",  path_for_image_src + 'faces_cool.png');
			stop_clock();
			//set to false for when reset button is pressed after game close
			stop_clock = false;
			deactivate_board()
		}
		else
		{
			//document.getElementById("face").className = "happy";
			face.attr("src",  path_for_image_src + 'faces_smile.png');
		}
		return;
	};
	
	//Used to uncover the value of a square.
	//If we are going to be uncovering squares in a chain from an untouched square
	//then we will use the explored_hash to pass through squares already explored;
	function uncover_single_square(x, y, explored_hash) {
		var symbol = x.toString() + "-" + y.toString();
		var element = $("#" + symbol);
		var value_at = board[x][y];
		switch(value_at) {
			case 0:
				element.removeClass('covered');
				element.addClass('uncovered');
				explore(x,y,explored_hash);
			case 1:
				element.removeClass('covered');
				element.addClass('adj-1');
				break;
			case 2:
				element.removeClass('covered');
				element.addClass('adj-2');
				break;
			case 3:
				element.removeClass('covered');
				element.addClass('adj-3');
				break;
			case 4:
				element.removeClass('covered');
				element.addClass('adj-4');
				break;
			case 5:
				element.removeClass('covered');
				element.addClass('adj-5');
				break;
			case 6:
				element.removeClass('covered');
				element.addClass('adj-6');
				break;
			case 7:
				element.removeClass('covered');
				element.addClass('adj-7');
				break;
			case 8:
				element.removeClass('covered');
				element.addClass('adj-8');
				break;
		}
	};
	
	function explore(x_start,y_start,explored) {
		var explore_now = [];
		var x;
		var y;
		square_at_top = (y_start == 0);
		square_left_edge = (x_start == 0);
		square_right_edge = (x_start == b_length-1);
		square_at_bottom = (y_start == b_height-1);
		
		//add upper left
		if(!square_at_top && !square_left_edge){
		  if_unexplored_add_to_do(x_start-1, y_start-1);
		}
		//add above
		if(!square_at_top && board[x_start][y_start-1] != 'm'){
		  if_unexplored_add_to_do(x_start, y_start-1);
		}
		//add upper right
		if(!square_at_top && !square_right_edge && board[x_start+1][y_start-1] != 'm'){
		  if_unexplored_add_to_do(x_start+1, y_start-1);
		}
		//add right
		if(!square_right_edge && board[x_start+1][y_start] != 'm'){
		  if_unexplored_add_to_do(x_start+1, y_start);
		}
		//add bottom right
		if(!square_at_bottom && !square_right_edge && board[x_start+1][y_start+1] != 'm'){
		  if_unexplored_add_to_do(x_start+1, y_start+1);
		}
		//add bellow
		if(!square_at_bottom && board[x_start][y_start+1] != 'm'){
		  if_unexplored_add_to_do(x_start, y_start+1);
		}
		 //add bottom left
		if(!square_at_bottom && !square_left_edge && board[x_start-1][y_start+1] != 'm'){
		  if_unexplored_add_to_do(x_start-1, y_start+1);
		}
		//add left
		if(!square_left_edge && board[x_start-1][y_start] != 'm'){
		  board[x_start-1][y_start] = board[x_start-1][y_start] + 1;if_unexplored_add_to_do(x_start-1, y_start-1);
		}
		
		var length_to_explore = explore_now.length;
		for(var i=0;i<length_to_explore;i++)
		{
			uncover_single_square(explore_now[i].x,explore_now[i].y,explored);
		}
		
		function if_unexplored_add_to_do(x,y) {
			var symbol = x.toString() + "-" + y.toString();
			var element = $("#" + symbol);
			if(!element.hasClass('covered'))
			{
				explored[symbol] = true
			}
			if(!(symbol in explored))
			{
				explore_now.push({x:x,y:y});
				explored[symbol] = true;
			}
		};
	}
	
	function deactivate_board() {
		$(".board-unit").off('mousedown');
  		$(".board-unit").off('mouseup');
	}
	
	function check_for_win() {
		for(var x=0;x<b_length;x++)
		{
			for(var y=0;y<b_height;y++)
			{
				square = $("#" + x + "-" + y);
				if(square.hasClass("covered") && board[x][y] != "m")
				{
					return false;
				}
				if(square.hasClass("flagged") && board[x][y] != "m")
				{
					return false;
				}
			}
		}
		game_won = true;
	}
	
	function make_loser_board() {
		var mine;
		for(var i=0;i<total_mines;i++)
		{
			mine = $("#" + mines[i][x] + "-" + mines[i][y]);
			if(mine.hasClass('covered'))
			{
				mine.removeClass('covered');
				mine.addClass('bomb-uncovered');
			}
		}
	};
	
	function reset_board() {
		$(".board-unit").attr( "class", "board-unit covered" );
	};
};

function init_board(w, h, m) {
  var board = blank_board(w, h);
  var mine;
  var mine_top;
  var mine_bottom;
  var mine_left;
  var mine_right;
  var mines = [];
  for(var i =0;i<m;i++) {
    mine = unique_mine(board, w, h);
    mines.push(unique_mine);
    board[mine['x']][mine['y']] = 'm';
    mine_top = (mine['y'] == 0);
    mine_left = (mine['x'] == 0);
    mine_right = (mine['x'] == w-1);
    mine_bottom = (mine['y'] == h-1);
    //incrementing upper left
    if(!mine_top && !mine_left && board[mine['x']-1][mine['y']-1] != 'm'){
      board[mine['x']-1][mine['y']-1] = board[mine['x']-1][mine['y']-1] + 1;
    }
    //incrementing above
    if(!mine_top && board[mine['x']][mine['y']-1] != 'm'){
      board[mine['x']][mine['y']-1] = board[mine['x']][mine['y']-1] + 1;
    }
    //incrementing upper right
    if(!mine_top && !mine_right && board[mine['x']+1][mine['y']-1] != 'm'){
      board[mine['x']+1][mine['y']-1] = board[mine['x']+1][mine['y']-1] + 1;
    }
    //incrementing right
    if(!mine_right && board[mine['x']+1][mine['y']] != 'm'){
      board[mine['x']+1][mine['y']] = board[mine['x']+1][mine['y']] + 1;
    }
    //incrementing bottom right
    if(!mine_bottom && !mine_right && board[mine['x']+1][mine['y']+1] != 'm'){
      board[mine['x']+1][mine['y']+1] = board[mine['x']+1][mine['y']+1] + 1;
    }
    //incrementing bellow
    if(!mine_bottom && board[mine['x']][mine['y']+1] != 'm'){
      board[mine['x']][mine['y']+1] = board[mine['x']][mine['y']+1] + 1;
    }
     //incrementing bottom left
    if(!mine_bottom && !mine_left && board[mine['x']-1][mine['y']+1] != 'm'){
      board[mine['x']-1][mine['y']+1] = board[mine['x']-1][mine['y']+1] + 1;
    }
    //incrementing left
    if(!mine_left && board[mine['x']-1][mine['y']] != 'm'){
      board[mine['x']-1][mine['y']] = board[mine['x']-1][mine['y']] + 1;
    }
  }
  return {board:board, mines:mines};
};
  
function unique_mine(board, w, h){
  var x = Math.floor((Math.random() * w));
  var y = Math.floor((Math.random() * h));
  var unique;
  if(board[x][y] != 'm'){
    unique = {x: x, y: y};
  } else {
    unique = unique_mine(board, w, h);
  }
  return unique;
};
    
function blank_board(w, h){
  //returns w by h board filled with 0's meaning 0 mines around this spot
  var board = Array(w);
  for(var i=0;i<w;i++) { 
    board[i] = Array(h);
    for(var j =0;j<h;j++) { board[i][j] = 0; } 
  }
  return board;
};

function get_board_data_on_page_load(){
	var starting_bombs = parseInt(document.getElementById("mines").innerHTML);
	var b_height = document.getElementById('board-table').getElementsByTagName("tr").length;
	var b_length = document.getElementById('board-table').getElementsByTagName("tr")[0].getElementsByTagName("td").length;
	return {h:b_height,l:b_length,b:starting_bombs};
};

function curser_on_board(e){
	var board_table = $("#board-table");
	var board_at = board_table.offset();
	var board_height = board_table.height();
	var board_width = board_table.width();
	var x_coor = e.clientX;
	var y_coor = e.clientY;
	if(board_at.left < x_coor && x_coor < (board_at.left + board_width) && 
	  board_at.top < y_coor && y_coor < (board_at.top + board_height))
	{
		return true;
	}
	else
	{
		return false
	}
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
	};
};