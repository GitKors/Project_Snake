class Snake {
	constructor(maxRows, maxColumns) {
	this.direction = 'right';
	this.body = [
		{ row: 1, column: 5 },
		{ row: 1, column: 4 },
		{ row: 1, column: 3 },
		{ row: 1, column: 2 },
		{ row: 1, column: 1 },
	];
	this.intervalId = undefined;
	this.maxRows = maxRows;
	this.maxColumns = maxColumns;

  }
  move() {
	if (!this.intervalId) {
		this.intervalId = setInterval(this._moveForward.bind(this), 100);
	} 
  }
  
  goUp() {
	if (this.direction === 'left' || this.direction === 'right') {
		this.direction = 'up';
	}  
  }
  
  goDown() {
	if (this.direction === 'left' || this.direction === 'right') {
		this.direction = 'down';
	}  
  }
  
  goLeft() {
	if (this.direction === 'up' || this.direction === 'down') {
		this.direction = 'left';
	}  
  }
  
  goRight() {
	if (this.direction === 'up' || this.direction === 'down') {
		this.direction = 'right';
	}  
  }
  
  _moveForward() {
	let head = this.body[0];
	switch (this.direction) {
		case 'up':
			this.body.unshift({
				row: ( (head.row - 1) + this.maxRows ) % this.maxRows,
				column: head.column,
			})
		break;
		case 'down':
			this.body.unshift({
				row: (head.row + 1) % this.maxRows,
				column: head.column,
			})
		break;
		case 'left':
			this.body.unshift({
				row: head.row,
				column: ( (head.column - 1) + this.maxColumns) % this.maxColumns,
			})
		break;
		case 'right':
			this.body.unshift({
				row: head.row,
				column: (head.column + 1) % this.maxColumns,
			});
		break;
	}
   this.previousTail = this.body.pop();  
  }
  
  grow() {
	if(this.previousTail) {
		this.body.push(this.previousTail);
		this.previousTail = undefined;
	}  
  }
  
  collidesWith(position) {
	return this.body.some(function (bodyPiece) {
		return bodyPiece.row === position.row && bodyPiece.column === position.column;
	});  
  }
  hasEatenItSelf() {
		return this.body.some(function (element, index, array) {
		return (element.row === array[0].row && element.column === array[0].column && index != 0);
	});  
  }

  hasEatenFood(food) {
		return this.body[0].row === food.row && this.body[0].column === food.column;
  };


  stop() {
	if ( this.intervalId ) {
		clearInterval(this.intervalId)
		this.intervalId = undefined;
	}  
  }
  
}

class Game {
	constructor(options) {
		this.snake = options.snake;
		this.food = undefined;
		this.rows = options.rows;
		this.columns = options.columns;
		this.ctx = options.ctx;
	}
	
	_drawBoard() {
		for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
			for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
				this.ctx.fillStyle = 'black';
				this.ctx.fillRect(columnIndex * 10, rowIndex * 10, 10, 10);
        
			}
		}
		if (this.food) {
			this._drawFood();
		}
	}
	
	_drawSnake() {
		this.snake.body.forEach(function (position, index) {
			this.ctx.fillStyle = 'green';
			this.ctx.fillRect(position.column * 10, position.row * 10, 8, 8);
		}.bind(this));
	}
	
	start() {
		this._assignControlsToKeys();
		this._generateFood();
		this.snake.move();
		this.intervalGame = window.requestAnimationFrame(this._update.bind(this));
	}
	
	_assignControlsToKeys() {
		document.onkeydown = function (e) {
			switch (e.keyCode) {
				case 38: //arrow up
					this.snake.goUp();
				break;
				case 40: //arror down
					this.snake.goDown();
				break;
				case 37: //arror left
					this.snake.goLeft();
				break;
				case 39: //arrow right
					this.snake.goRight();
				break; 
			}
		}.bind(this);
	}
	_generateFood() {
		 do {
			this.food = {
				row: Math.floor(Math.random() * this.rows),
				column: Math.floor(Math.random() * this.columns),
			};
		} while ( this.snake.collidesWith(this.food) );
	}
	
	_drawFood() {
		this.ctx.fillStyle = 'red';
		this.ctx.fillRect(this.food.column * 10, this.food.row * 10, 8, 8);
	}
	
	_update() {
		this._drawBoard();
		this._drawSnake();

		if ( this.snake.hasEatenFood(this.food) ) {
			this.snake.grow();
			this._generateFood();
			this._drawFood();
		}
		if ( this.snake.hasEatenItSelf() ) {
			this.snake.stop();
			this.stop();
			alert('Gameover');
		}
		this.intervalGame = window.requestAnimationFrame(this._update.bind(this));
	}
	
	stop() {
		if (this.intervalGame) {
			clearInterval(this.intervalGame)
			this.intervalGame = undefined;
		}
	}
	
}

let windowOnloadAdd = function (event) {
       if ( window.onload ){
          window.onload = window.onload + event;
       } else {
          window.onload = event;
       };
    };

    windowOnloadAdd(function() {
       let game;
	     let canvas = document.getElementById('snake');
       let ctx = canvas.getContext('2d');

       game = new Game({
        rows: canvas.width / 10,
        columns: canvas.height / 10,
        snake: new Snake(canvas.width / 10, canvas.height / 10),
        ctx: ctx,
      });

      game.start();
    });


