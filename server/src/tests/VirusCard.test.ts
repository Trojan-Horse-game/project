import { FirewallCard } from "../gamelogic/FirewallCard";
import { Action } from "../gamelogic/Action";
import { Card, Color } from "../gamelogic/Card";
import { Game } from "../gamelogic/Game";
import { GeneratorCard } from "../gamelogic/GeneratorCard";
import { GeneratorSlot, State } from "../gamelogic/GeneratorSlot";
import { Player, Species } from "../gamelogic/Players";
import { VirusCard } from "../gamelogic/VirusCard";

let game: Game;
let action: Action;
let card: Card;
let targetSlot: GeneratorSlot;

beforeEach(() => {
  game = new Game();
  game.addPlayer(new Player("one", Species.Totox));
  game.addPlayer(new Player("two", Species.Hutex));
  game.init();
  game.currentPlayerIdx = 0;

  card = new VirusCard(Color.Air);
  action = new Action(card, 0);
  game.currentPlayer.hand[0] = card;
  game.currentPlayer.hand[1] = new FirewallCard(Color.Energy);

  const targetSlotInd = game.currentPlayer.getBase(Color.Air);
  targetSlot = game.currentPlayer.base[targetSlotInd];
  targetSlot.addGenerator(new GeneratorCard(Color.Air));
  action.addSlotTarget(targetSlotInd);
  action.addTarget(game.currentPlayerIdx);
});

test("Attaque sur un générateur sain", () => {
  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(FirewallCard);
  expect(targetSlot.state).toBe(State.Virused);
  expect(targetSlot.cards.length).toBe(2);
  expect(targetSlot.cards[1]).toBeInstanceOf(VirusCard);
  expect(game.deck.length).toBe(62);
});

test("Attaque sur un générateur protégé", () => {
  targetSlot.addFireWall(new FirewallCard(Color.Air));
  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(FirewallCard);
  expect(targetSlot.state).toBe(State.Generator);
  expect(targetSlot.cards.length).toBe(1);
  expect(game.deck.length).toBe(64);
});

test("Attaque sur un générateur contaminé", () => {
  targetSlot.addVirus(new VirusCard(Color.Joker));
  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(FirewallCard);
  expect(targetSlot.state).toBe(State.Empty);
  expect(targetSlot.cards.length).toBe(0);
  expect(game.deck.length).toBe(65);
});
