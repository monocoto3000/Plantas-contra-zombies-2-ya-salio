class Pea {
    constructor(x, y, speed, damage) {
        this.x = x;
        this.y = y;
        this.speed = speed; 
        this.damage = damage; 
    }

    move() {
        this.x += this.speed; 
    }

    draw(context) {
        context.fillStyle = "green"; 
        context.beginPath();
        context.arc(this.x, this.y, 5, 0, Math.PI * 2);
        context.fill();
    }
}
