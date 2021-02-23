import { Action } from "../gamelogic/Action";
import { Color } from "../gamelogic/Card";
import { Game } from "../gamelogic/Game";
import { GeneratorCard } from "../gamelogic/GeneratorCard";
import { Player, Species } from "../gamelogic/Players";
import { VirusCard } from "../gamelogic/VirusCard";
let game: Game;
beforeAll(() => {
  game = new Game();
  game.addPlayer(new Player("one", Species.Totox));
  game.addPlayer(new Player("two", Species.Hutex));
  game.init();
  game.currentPlayerIdx = 0;
});

describe("checkActionGenerator", () => {
  let action: Action;
  const color = Color.Air;
  const indx = 0;
  let error: string;

  beforeEach(() => {
    const card = new GeneratorCard(color);
    action = new Action(card, indx);
  });

  test("Sans générateur en main à l'index indiqué", () => {
    game.currentPlayer.hand[indx] = new VirusCard(Color.Joker);
    error = "You don't have a generator there ?!";
    expect(() => game.checkActionGenerator(action)).toThrow(error);
  });

  test("Générateur en main mais de la mauvaise couleur", () => {
    game.currentPlayer.hand[indx] = new GeneratorCard(Color.Joker);
    error = "Your generator isn't of the right color ?!";
    expect(() => game.checkActionGenerator(action)).toThrow(error);
  });

  test("Générateur en main mais déjà posé", () => {
    game.currentPlayer.hand[indx] = new GeneratorCard(Color.Air);

    const slotIndx = game.currentPlayer.getBase(Color.Air);
    const slot = game.currentPlayer.base[slotIndx];

    slot.addGenerator(new GeneratorCard(Color.Air));

    error = "The generator is already placed in your base !";
    expect(() => game.checkActionGenerator(action)).toThrow(error);

    game.currentPlayer.discardBase(slotIndx);
  });

  test("Générateur valide à poser", () => {
    game.currentPlayer.hand[indx] = new GeneratorCard(Color.Air);
    expect(game.checkActionGenerator(action));
  });
});
