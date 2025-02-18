import { claudeMonet } from '../characters/ClaudeMonet';

class GameState {
  constructor() {
    this.characters = new Map();
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;
    
    // Add Claude Monet to the game and initialize him
    claudeMonet.position = [5, 0, 5]; // Starting position
    this.addCharacter('claudeMonet', claudeMonet);
    claudeMonet.initialize(); // Start the action loop
    
    this.isInitialized = true;
  }

  addCharacter(id, character) {
    this.characters.set(id, character);
  }

  getCharacter(id) {
    return this.characters.get(id);
  }

  getAllCharacters() {
    return Array.from(this.characters.values());
  }

  update(delta) {
    // Update all characters
    this.characters.forEach(character => {
      if (character.update) {
        character.update(delta);
      }
    });
  }
}

// Create a single instance to be used throughout the application
export const gameState = new GameState(); 