// 游戏常量
const GRID_SIZE = 20;
const TILE_SIZE = 20;
let score = 0;

// 游戏状态
let snake = [{
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
}];
let food = {x: 5, y: 5};
let direction = getSafeInitialDirection(snake[0]);
let gameSpeed = 500;
let gameOver = false;

// 获取游戏板元素
const gameBoard = document.getElementById('game-board');

// 初始化游戏
function initGame() {
    // 重置得分
    score = 0;
    document.getElementById('score-board').textContent = `得分: ${score}`;

    // 添加键盘事件监听
    gameBoard.innerHTML = "";
    document.addEventListener('keydown', changeDirection);
    // 显示提示信息
    const startPrompt = document.createElement('div');
    startPrompt.id = 'start-prompt';
    startPrompt.textContent = '请点击按钮开始游戏';
    const startButton = document.createElement('button');
    startButton.textContent = '开始游戏';
    startButton.style.position = 'absolute';
    startButton.style.top = '60%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';
    startButton.style.padding = '10px 20px';
    startButton.style.fontSize = '18px';
    startButton.style.cursor = 'pointer';
    startButton.addEventListener('click', () => {
         snake = [{
             x: Math.floor(Math.random() * GRID_SIZE),
             y: Math.floor(Math.random() * GRID_SIZE)
         }];
         placeFood();
         direction = getSafeInitialDirection(snake[0]);
         gameSpeed = 500;
         gameOver = false;
        if (startPrompt) {
            startPrompt.remove();
        }
        startButton.remove();
        gameLoop();
    });
    gameBoard.appendChild(startButton);

    // 创建游戏板格子
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const tile = document.createElement('div');
        gameBoard.appendChild(tile);
    }
    
    // 初始化蛇和食物
    drawSnake();
    placeFood();
    

}

// 改变方向
function changeDirection(e) {
    const keyLog = document.getElementById('key-log');
    keyLog.textContent = `按键: ${e.key}`;
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = {x: 0, y: -1};
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = {x: -1, y: 0};
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = {x: 1, y: 0};
            break;
    }
}

// 游戏主循环
function gameLoop() {
    if (gameOver) return;
    
    setTimeout(() => {
        update();
        draw();
        gameLoop();
    }, gameSpeed);
}

// 更新游戏状态
function update() {
    // 计算新的蛇头位置
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // 检查碰撞
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        if (gameOver) {
            alert(`游戏结束！最终得分: ${score}`);
            document.getElementById('score-board').textContent = `得分: ${score}`;
            initGame();
            return;
        }
        return;
    }
    
    // 移动蛇
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 5;
        document.getElementById('score-board').textContent = `得分: ${score}`;
        placeFood();
    } else {
        snake.pop();
    }
}

// 绘制游戏
function draw() {
    // 清除所有格子
    gameBoard.querySelectorAll('div').forEach(tile => {
        tile.className = '';
    });
    
    // 绘制蛇
    snake.forEach(segment => {
        const tile = gameBoard.children[segment.y * GRID_SIZE + segment.x];
        tile.classList.add('snake');
    });
    
    // 绘制食物
    const foodTile = gameBoard.children[food.y * GRID_SIZE + food.x];
    foodTile.classList.add('food');
}

// 放置食物
function placeFood() {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    // 确保食物不会出现在蛇身上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    }
}

function getSafeInitialDirection(head) {
    const safeDirections = [];
    
    // 检查水平边界
    if (head.x === 0) {
        safeDirections.push({x: 1, y: 0});
    } else if (head.x === GRID_SIZE - 1) {
        safeDirections.push({x: -1, y: 0});
    } else {
        safeDirections.push({x: 1, y: 0}, {x: -1, y: 0});
    }
    
    // 检查垂直边界
    if (head.y === 0) {
        safeDirections.push({x: 0, y: 1});
    } else if (head.y === GRID_SIZE - 1) {
        safeDirections.push({x: 0, y: -1});
    } else {
        safeDirections.push({x: 0, y: 1}, {x: 0, y: -1});
    }
    
    // 随机选择安全方向
    return safeDirections[Math.floor(Math.random() * safeDirections.length)];
}

// 启动游戏
initGame();