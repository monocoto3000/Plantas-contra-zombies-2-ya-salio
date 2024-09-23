class Plant {
    constructor(x, y, width, color, health) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.color = color;
        this.health = health;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.width);
    }

    takeDamage(damage) {
        this.health -= damage;
    }

    isDead() {
        return this.health <= 0;
    }
}
