class BucketZombie extends Zombie {
    constructor(x, y, row) {
        super(x, y, 100, 130, 'red', row); 
        this.speed = 0.6;
        this.health = 5; 
        this.row = row; 
    }
}
