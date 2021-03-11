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

  card = new FirewallCard(Color.Air);
  action = new Action(card, 0);
  game.currentPlayer.hand[0] = card;
  game.currentPlayer.hand[1] = new VirusCard(Color.Energy);

  const targetSlotInd = game.currentPlayer.getBase(Color.Air);
  targetSlot = game.currentPlayer.base[targetSlotInd];
  targetSlot.addGenerator(new GeneratorCard(Color.Air));
  action.addSlotTarget(targetSlotInd);
});

test("Pose d'un parefeu sur un générateur sain", () => {
  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(VirusCard);
  expect(targetSlot.state).toBe(State.Protected);
  expect(targetSlot.cards.length).toBe(2);
  expect(targetSlot.cards[1]).toBeInstanceOf(FirewallCard);
  expect(game.deck.length).toBe(62);
});

test("Pose d'un parefeu sur un générateur protégé", () => {
  targetSlot.addFireWall(new FirewallCard(Color.Air));
  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(VirusCard);
  expect(targetSlot.state).toBe(State.Immunized);
  expect(targetSlot.cards.length).toBe(3);
  expect(targetSlot.cards[2]).toBeInstanceOf(FirewallCard);
  expect(game.deck.length).toBe(62);
});

test("Pose d'un parefeu sur un générateur contaminé", () => {
  targetSlot.addVirus(new VirusCard(Color.Joker));
  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(VirusCard);
  expect(targetSlot.state).toBe(State.Generator);
  expect(targetSlot.cards.length).toBe(1);
  expect(game.deck.length).toBe(64);
});
