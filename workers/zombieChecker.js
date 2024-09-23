self.onmessage = function(e) {
    const { zombies, plantRow } = e.data;
    const zombieExists = zombies.some(zombie => zombie.row === plantRow);
    self.postMessage(zombieExists);
  };