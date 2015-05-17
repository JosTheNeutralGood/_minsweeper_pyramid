$(document).ready(function(){
	//var reset_test = setInterval(reset_clock, 8000);
	var starting_bombs = parseInt(document.getElementById("mines").innerHTML);
	
	self = this;
	var reset_clock = initialize_clock(self);
});

//Code to initialize the clock. Returns a function that will reset the clock.
function initialize_clock(self){
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