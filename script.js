var Game = function() {
	var player = this;
	var score = document.getElementById('score-board');
	this.scores = [];
                
	this.init = function() {
		vw = window.innerWidth;
		vh = window.innerHeight;

		player.canvas = document.getElementsByTagName('canvas')[0];
		player.ctx = player.canvas.getContext('2d');
		
		player.score_pos = player.scores.length;
		name = 'l';
		var name = prompt('Enter name: ');
		while (name == '' || name == null)
			var name = prompt('Enter name: ');
		player.canvas.style.display = 'block';
		player.scores.push(new Score(name));
		this.change_score(0);

		if (vw < 600) {
			score_board.style.left = '0px';
			toggle_score();
		}
		else {
			show.style.display = 'none';
			info.style.top = 30 + score_board.offsetHeight + 'px';
		}
		info.style.color = 'white';
		
		player.ongoing = false;
		player.game_over = false;
		player.speed = 0;
		
		body = document.getElementsByTagName('body')[0];
		body.addEventListener('keydown', player.move);
		body.addEventListener('keyup', player.move);
		body.addEventListener('touchstart', player.move);
		body.addEventListener('touchend', player.move);
		body.addEventListener('touchcancel', player.move);
		
		deg = 0;
		player.deg_jump = 1;
		
		orbit = new Circle(0.5 * vw, vh - 150, 100, 0, 'fff');
		wBall = new Circle(orbit.cx - orbit.rad, orbit.cy, 20, 180, 'f00');
		bBall = new Circle(orbit.cx + orbit.rad, orbit.cy, 20, 0, '00f');
		hurdles = [];
		powerups = [];
		powerup_names = ['horlicks', 'flight'];
		last_powerup = 0;
		painting = 0;
		kd = false;
	}
	this.change_score = function(ds) {
		player.scores[player.score_pos].score += ds;
		
		var val = player.scores[player.score_pos].score;
		var score_pos = player.score_pos;
		var val = player.scores[score_pos];
		for (var i=score_pos - 1; i>=0; i--) {
			if (player.scores[i].score < val.score) {
				player.scores[player.score_pos] = player.scores[i]; // [0]
				player.score_pos -= 1;
			}
			else {
				break;
			}
		}
		player.scores[player.score_pos] = val;
		
		var tbody = document.getElementsByTagName('tbody')[0];
		var trs = player.scores.slice(0, 5);
		tbody.innerHTML = '<tr><td>Name</td><td>Score</td></tr>';
		for (var tr=0; tr<trs.length; tr++)
			tbody.appendChild(make_score(trs[tr]));

		if (val % 5 == 0 && val > 0) {
			player.speed += 1;
			clearInterval(painting);
			clearInterval(hurdle_factory);
			player.ongoing = false;
			player.start();
		}
	}
	var make_score = function (el) {
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		td.textContent = el.name;
		tr.appendChild(td);
		var td = document.createElement('td');
		td.textContent = el.score;
		tr.appendChild(td);
		
		return tr;
	}
	this.move_left = function() {
		deg -= player.deg_jump;
		if (deg < 0)
			deg = 360;
	}
	this.move_right = function() {
		deg += player.deg_jump;
		if (deg > 360)
			deg = 0;
	}
	this.move = function(evt) {
		if (evt.type != 'keydown' && evt.type != 'keyup'){
			if (evt.type == 'touchstart') {
				var func = evt.touches[0].clientX < vw / 2 ? player.move_left : player.move_right
				try {clearInterval(touch);}
				catch{}
				touch = setInterval(function() {
					func();
					wBall.rotate();
					bBall.rotate();
				}, 5);
			}
			else {
				try {clearInterval(touch);}
				catch{}
				clearInterval(touch);
			}
		}
		else {
			if (evt.type == 'keydown') {
				if (evt.keyCode != 37 && evt.keyCode != 39)
					return;
				if (!kd) {
					kd = true;
					if (evt.keyCode == 37)
						var func = player.move_left;
					else if (evt.keyCode == 39)
						var func = player.move_right;
					mouse = setInterval(function() {
						func();
						wBall.rotate();
						bBall.rotate();
					}, 5);
				}
			}
			else {
				kd = false;
				try {clearInterval(mouse);}
				catch{}
			}
		}
	}
	this.draw = function() {
		player.painter = new Painter(player.canvas, player.ctx);
		player.painter.draw();
	}
	this.start = function() {
		if (player.ongoing)
			return;
		this.ongoing = true;
		player.painter.create_hurdles();
		player.painter.create_powerups();
		painting = setInterval(function() {
			player.painter.draw();
		}, 20 - player.speed);
	}
	this.stop = function() {
		this.ongoing = false;
		clearInterval(hurdle_factory);
		clearInterval(painting);
		try{clearInterval(touch);}
		catch{}
		try{clearInterval(mouse);}
		catch{}
		if (player.game_over) {
			player.canvas.style.display = 'none';
			var sure = confirm('Do you want to restart?');
			if (sure) {
				player.init();
				player.draw();
				player.start();
			}
			else
				toggle_state(0);
		}
		return;
	}
	this.resume = function() {
		if (player.game_over) {
			player.init();
			player.draw();
			player.start();
		}
		else if (!player.ongoing) {
			setTimeout(function() {
				pause.innerHTML = 'Pause';
				player.start();
			}, 3000);
			pause.innerHTML = 'Restart in 3s'
			setTimeout(function() {
				pause.innerHTML = 'Restart in 2s'
			}, 1000);
			setTimeout(function() {
				pause.innerHTML = 'Restart in 1s'
			}, 2000);
		}
	}
       
}



<<<<<<< HEAD
var Painter = function(canvas, ctx) {
	var player = this;
	canvas.height = vh;
	canvas.width = vw;
	var fill_rect = function(el) {
		ctx.beginPath();
		ctx.rect(el.x, el.y, el.width, el.height);
		ctx.fillStyle = el.color;
		ctx.closePath();
		ctx.fill();
	}

	var stroke_circle = function(el) {
		ctx.beginPath();
		ctx.arc(el.cx, el.cy, el.rad, 0, 2*Math.PI);
		ctx.strokeStyle = el.color;
		ctx.closePath();
		ctx.stroke();
	}

	var fill_circle = function(el) {
		ctx.beginPath();
		ctx.arc(el.cx, el.cy, el.rad, 0, 2*Math.PI);
		ctx.fillStyle = el.color;
		ctx.closePath();
		ctx.fill();
	}

	this.draw = function() {
		ctx.clearRect(0, 0, vw, vh);
		ctx.beginPath();
		ctx.rect(0, 0, vw, vh);
		ctx.fillStyle = '#eef442';
		ctx.fill();
		ctx.closePath();
		stroke_circle(orbit);
		fill_circle(wBall);
		fill_circle(bBall);
		for (var i=0; i<hurdles.length; i++) {
			ctx.beginPath();
			fill_rect(hurdles[i]);
			ctx.closePath();
			hurdles[i].move();
		}
		for (var i=0; i<powerups.length; i++) {
			ctx.beginPath();
			fill_circle(powerups[i]);
			ctx.closePath();
			powerups[i].move();
		}
	}

	this.create_hurdles = function() {
		hurdle_factory = setInterval(function() {
			var x = Math.random() * 200;
			var width = 80 + Math.random() * 40;
			hurdles.push(new Hurdle(x, width, '1c3a56', vw, vh));
		}, 1000 - game.speed * 200);
	}
	this.create_powerups = function() {
		powerup_factory = setInterval(function() {
			// last_powerup += 1;
			if (Math.random() < 0.05) {
				powerups.push(new PowerUp(powerup_names[Math.round(Math.random())]));
			}
		}, 1000);
	}
	this.clear = function() {
		ctx.clearRect(0, 0, vw, vh);
	}
=======


draw(ctx)
{
ctx.clearRect(0,0,1496,722);
ctx.fillStyle = '#f00' ;
ctx.beginPath();
ctx.arc(this.c_x1,this.c_y,10,0,2*Math.PI);
ctx.fill();

ctx.fillStyle = '#00f' ;
ctx.beginPath();
ctx.arc(this.c_x2,this.c_y,10,0,2*Math.PI);
ctx.fill();

ctx.fillStyle = '#fff' ;
ctx.beginPath();
ctx.arc(this.cent.x,this.cent.y,70,0,2*Math.PI);
ctx.stroke();
>>>>>>> 6711934473602291c3229e8ad3c08fc9230f80cf
}



var Circle = function(cx, cy, rad, offset, color) {
	var player = this;
	this.cx = cx;
	this.cy = cy;
	this.rad = rad;
	this.color = '#' + color;
	this.rotate = function() {
		player.cx = orbit.cx + orbit.rad * cos(offset + deg);
		player.cy = orbit.cy + orbit.rad * sin(offset + deg);
	}
}


var Score = function(name) {
	this.name = name;
	this.score = 0;
}


var PowerUp = function(name) {
	var player = this;
	this.cx = orbit.cx + (Math.random() - 0.5) * 2 * orbit.rad;
	this.cy = 0.1 * vh;
	this.rad = 20;
	var balls = [wBall, bBall];
	this.name = name;
	if (this.name == 'flight')
		this.color = 'yellow';
	else
		this.color = 'red';
	var dy = 0.01 * vh;

	this.move = function() {
		player.cy += dy;
		for (var i=0; i<2; i++) {
			if (player.check_y(balls[i])) {
				if (player.check_x(balls[i])) {
					if (player.name == 'flight')
						game.deg_jump = (game.deg_jump * 10 + 1) / 10;
					else
						balls[i].rad -= 1;

					player.remove();
					break;
				}
			}
		}
		if (player.cy > vh)
			player.remove();
	}

	this.check_y = function(ball) {
		var bar = ball.cy + ball.rad;
		return (player.cy - player.rad < bar && player.cy + player.rad > bar)
	}
	this.check_x = function(ball) {
		var bar = ball.cx - ball.rad;
		return ((player.cx - player.rad < bar && player.cx + player.rad > bar) || (player.cx - player.rad > bar && player.cx - player.rad < bar + 2 * ball.rad && player.cx + player.rad > bar))
	}
	this.remove = function() {
		powerups.splice(powerups.indexOf(player), 1);
	}

}


var Hurdle = function(x, width, color) {
	this.x = x + 0.5 * vw - 150;
	this.y = 0.1 * vh;
	this.width = width;
	this.height = 30;
	this.color = '#' + color;
	var dy = 0.01 * vh;
	var player = this;
	var balls = [wBall, bBall];
	this.move = function() {
		player.y += dy;
		for (var i=0; i<2; i++) {
			if (player.check_y(balls[i])) {
				if (player.check_x(balls[i])) {
					game.game_over = true;
					game.stop();
					break;
				}
			}
		}
		if (player.y > vh)
			player.remove();
	}
	this.remove = function() {
		hurdles.splice(hurdles.indexOf(player), 1);
		game.change_score(1);
	}
	this.check_y = function(ball) {
		var bar = ball.cy + ball.rad;
		return (player.y < bar && player.y + player.height > bar)
	}
	this.check_x = function(ball) {
		var bar = ball.cx - ball.rad;
		return ((player.x < bar && player.x + player.width > bar) || (player.x > bar && player.x < bar + 2 * ball.rad && player.x + player.width > bar))
	}
}



function to_rad(i) {
	return i * Math.PI / 180;
}

function sin(i) {
	return Math.sin(to_rad(i));
}

function cos(i) {
	return Math.cos(to_rad(i));
}



var pause = document.getElementById('pause');
pause.addEventListener('click', toggle_state);
var show = document.getElementById('show');
show.addEventListener('click', toggle_score);
var score_board = document.getElementById('score-board');
var info = document.getElementById('info');

function toggle_state(evt) {
	if (evt == 0) {
		pause.innerHTML = 'Restart';
		info.style.color = 'black';
		return;
	}
	if (game.ongoing) {
		game.stop();
		pause.innerHTML = 'Resume';
	}
	else {
		game.resume();
	}
}

function toggle_score() {
	if (score_board.style.left == '-1000px') {
		show.style.top = 25 + score_board.offsetHeight + 'px';
		show.innerHTML = 'Hide';
		score_board.style.left = '20px';
		info.style.top = 90 + score_board.offsetHeight + 'px';
	}
	else {
		show.style.top = '20px';
		score_board.style.left = '-1000px';
		show.innerHTML = 'Show';
		info.style.top = '85px';
	}
}



var game = new Game();
game.init();
game.draw();
game.start();
