class Zombie {
    constructor(x, y, width, height, color, row) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color; 
        this.row = row;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        if (!this.isAttacking) {
            this.x -= this.speed;
        }
    }
    attackPlant(plant, plants, occupiedCells) {
        console.log(plants);
        this.isAttacking = true;
        this.attackInterval = setInterval(() => {
            plant.takeDamage(1); 
            if (plant.isDead()) {
                const index = plants.indexOf(plant);
                if (index > -1) {
                    plants.splice(index, 1);  
                    occupiedCells[plant.row][plant.col] = false;
                }
                this.isAttacking = false;  
                clearInterval(this.attackInterval);  
            }
        }, 1000);  
    }
    

    isContact(plant) {
        return (
            this.x < plant.x + plant.width &&
            this.x + this.width > plant.x &&
            this.y < plant.y + plant.width && 
            this.y + this.height > plant.y
        );
    }

    isHit(projectile) {
        return (
            projectile.x > this.x &&
            projectile.x < this.x + this.width &&
            projectile.y > this.y &&
            projectile.y < this.y + this.width
        );
    }
}
