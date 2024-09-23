class DoublePeashooter extends Plant {
    constructor(x, y, row, col) {
        super(x, y, 100, 'darkgreen');
        this.shootRate = 100; 
        this.damage = 2;
        this.speed = 5;
        this.health = 7;
        this.row = row; 
        this.col = col;
        this.worker = new Worker('./workers/zombieChecker.js');
        this.zombieExists = false;

        this.worker.onmessage = (e) => {
            this.zombieExists = e.data;
        };
    }

    theresZombies(zombies) {
        this.worker.postMessage({ zombies, plantRow: this.row });
        return this.zombieExists;
    }

    shoot(zombies) {
        this.theresZombies(zombies);
        if (this.zombieExists && frameCount % this.shootRate === 0) {
            projectiles.push(new Pea(this.x + this.width, this.y + this.width / 4, this.speed, this.damage));
        }
    }
}