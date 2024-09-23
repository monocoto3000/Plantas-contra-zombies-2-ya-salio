class ClassicZombie extends Zombie {
    constructor(x, y, row) {
        super(x, y, 100, 130, 'gray', row); 
        this.speed = 0.7;
        this.health = 3; 
    }
}
