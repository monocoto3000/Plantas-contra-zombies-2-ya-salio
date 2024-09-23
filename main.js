const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const backgroundImage = new Image();
    backgroundImage.src = 'images/bg.jpg'; 
    backgroundImage.onload = function() {
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    };

let sunPoints = 50;
let frameCount = 0;
let plants = [];
let zombies = [];
let projectiles = [];
let selectedPlant = null;

const gridRows = 5;
const gridCols = 9;
const cellWidth = canvas.width / gridCols;
const cellHeight = canvas.height / gridRows;

const occupiedCells = Array.from({ length: gridRows }, () => Array(gridCols).fill(false));

const plantSound = new Audio('audio/Plant.ogg');

document.getElementById('restartButton').addEventListener('click', restartGame);

function restartGame() {
    sunPoints = 50;
    frameCount = 0;
    plants = [];
    zombies = [];
    projectiles = [];
    selectedPlant = null;
    occupiedCells.forEach(row => row.fill(false)); 

    document.getElementById('restartButton').style.display = 'none';

    gameLoop();
}

function drawGrid() {
    context.strokeStyle = "rgba(204, 204, 204, 0)"; 
    for (let i = 0; i <= gridCols; i++) {
        context.beginPath();
        context.moveTo(i * cellWidth, 0);
        context.lineTo(i * cellWidth, canvas.height);
        context.stroke();
    }
    for (let j = 0; j <= gridRows; j++) {
        context.beginPath();
        context.moveTo(0, j * cellHeight);
        context.lineTo(canvas.width, j * cellHeight);
        context.stroke();
    }
}

const zombieGeneratorWorker = new Worker('./workers/zombieGenerator.js');

zombieGeneratorWorker.onmessage = function(e) {
    const zombieData = e.data;
    if (zombieData) {
      if (zombieData.type === 'ClassicZombie') {
        zombies.push(new ClassicZombie(zombieData.x, zombieData.y, zombieData.row));
      } else if (zombieData.type === 'BucketZombie') {
        zombies.push(new BucketZombie(zombieData.x, zombieData.y, zombieData.row));
      }
    }
  };

function gameLoop() {
    frameCount++;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    drawGrid(); 

    zombieGeneratorWorker.postMessage({
        frameCount: frameCount,
        gridRows: gridRows,
        canvasWidth: canvas.width,
        cellHeight: cellHeight
    });

    zombies.forEach(zombie => {
        zombie.draw(context);
      });

      
    plants.forEach(plant => {
        plant.draw(context);
        if (plant instanceof Peashooter || plant instanceof DoublePeashooter) {
            plant.shoot(zombies); 
        }
    });

    let gameOver = false; 

    zombies.forEach((zombie, zIndex) => {
        zombie.draw(context);
        zombie.move();        
        if (zombie.x <= 0) {
            gameOver = true;
        }

        plants.forEach(plant => {
            if (zombie.isContact(plant)) {
                if (!zombie.isAttacking) {
                    zombie.attackPlant(plant, plants, occupiedCells); 
                }
            }
        });

        projectiles.forEach((projectile, pIndex) => {
            if (zombie.isHit(projectile)) {
                zombie.health -= projectile.damage;
                projectiles.splice(pIndex, 1); 
                if (zombie.health <= 0) {
                    clearInterval(zombie.attackInterval);
                    zombies.splice(zIndex, 1);  
                }
            }
        });
    });
    
    if (gameOver) {
        context.fillStyle = 'black';
        context.font = '60px sans-serif';
        context.fillText('Ni modillo', canvas.width / 2 - 100, canvas.height / 2);
        document.getElementById('restartButton').style.display = 'block';
        return;
    }

    projectiles.forEach((projectile, index) => {
        projectile.move();
        projectile.draw(context);
        if (projectile.x > canvas.width) {
            projectiles.splice(index, 1);
        }
    });

    updateSunPointsDisplay();

    requestAnimationFrame(gameLoop);
}

function updateSunPointsDisplay() {
    document.getElementById('sunPoints').innerText = sunPoints;
}

function placePlant(type, x, y, row, col) {
    let plantWidth = 100;
    let plantHeight = 100; 

    let centeredX = col * cellWidth + (cellWidth - plantWidth) / 2;
    let centeredY = row * cellHeight + (cellHeight - plantHeight) / 2;

    if (type === 'Peashooter' && sunPoints >= 100 && !occupiedCells[row][col]) {
        plants.push(new Peashooter(centeredX, centeredY, row, col));
        sunPoints -= 100;
        occupiedCells[row][col] = true; 
    } else if (type === 'Sunflower' && sunPoints >= 50 && !occupiedCells[row][col]) {
        plants.push(new Sunflower(centeredX, centeredY, row, col));
        sunPoints -= 50;
        occupiedCells[row][col] = true; 
    } else if (type === 'DoublePeashooter' && sunPoints >= 200 && !occupiedCells[row][col]) {
        plants.push(new DoublePeashooter(centeredX, centeredY, row, col));
        sunPoints -= 200;
        occupiedCells[row][col] = true; 
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (selectedPlant) {
        placePlant(selectedPlant, col * cellWidth, row * cellHeight, row, col);
        plantSound.play()
    }
});

document.getElementById('Sunflower').addEventListener('click', () => {
    selectedPlant = 'Sunflower';
});

document.getElementById('Peashooter').addEventListener('click', () => {
    selectedPlant = 'Peashooter';
});

document.getElementById('DoublePeashooter').addEventListener('click', () => {
    selectedPlant = 'DoublePeashooter';
});

gameLoop();
