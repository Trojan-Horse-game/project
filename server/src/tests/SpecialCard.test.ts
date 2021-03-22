import { GeneratorCard } from "../gamelogic/GeneratorCard";
import { State } from "../gamelogic/GeneratorSlot";
import { VirusCard } from "../gamelogic/VirusCard";
import { Action } from "../gamelogic/Action";
import { Color } from "../gamelogic/Card";
import { FirewallCard } from "../gamelogic/FirewallCard";
import { Game } from "../gamelogic/Game";
import { Player, Species } from "../gamelogic/Players";
import { SpecialCard } from "../gamelogic/SpecialCard";

let game: Game;

beforeEach(() => {
  game = new Game();
  game.addPlayer(new Player("one", Species.Totox));
  game.addPlayer(new Player("two", Species.Hutex));
  game.init();
  game.currentPlayerIdx = 0;
});

test("Nuclear Distraction", () => {
  const card = new SpecialCard(Color.Air);
  const action = new Action(card, 0);
  game.currentPlayer.hand[0] = card;
  game.currentPlayer.hand[1] = new FirewallCard(Color.Energy);

  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(FirewallCard);
  expect(game.players[1].hand.length).toBe(0);
  expect(game.deck.length).toBe(66);

  game.endTurn();

  expect(game.currentPlayerIdx).toBe(0);
  expect(game.players[1].hand.length).toBe(3);
  expect(game.deck.length).toBe(62);
});

test("ID Theft", () => {
  const card = new SpecialCard(Color.Water);
  const action = new Action(card, 0);
  action.addTarget(1);

  game.currentPlayer.hand[0] = card;
  game.currentPlayer.hand[1] = new FirewallCard(Color.Energy);

  const indSlot1 = game.currentPlayer.getBase(Color.Air);
  let slot = game.currentPlayer.base[indSlot1];
  slot.addGenerator(new GeneratorCard(Color.Air));

  const indSlot2 = game.players[1].getBase(Color.Water);
  slot = game.players[1].base[indSlot2];
  slot.addGenerator(new GeneratorCard(Color.Water));
  slot.addVirus(new VirusCard(Color.Water));

  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(FirewallCard);

  expect(game.currentPlayer.base[indSlot1].state).toBe(State.Empty);
  expect(game.currentPlayer.base[indSlot1].cards.length).toBe(0);

  expect(game.currentPlayer.base[indSlot2].state).toBe(State.Virused);
  expect(game.currentPlayer.base[indSlot2].cards.length).toBe(2);

  expect(game.players[1].base[indSlot1].state).toBe(State.Generator);
  expect(game.players[1].base[indSlot1].cards.length).toBe(1);

  expect(game.players[1].base[indSlot2].state).toBe(State.Empty);
  expect(game.players[1].base[indSlot2].cards.length).toBe(0);
  expect(game.deck.length).toBe(63);
});

test("System Cleaning", () => {
  const card = new SpecialCard(Color.Joker);
  const action = new Action(card, 0);

  game.currentPlayer.hand[0] = card;
  game.currentPlayer.hand[1] = new FirewallCard(Color.Water);

  const indSlot1 = game.currentPlayer.getBase(Color.Air);
  let slot = game.currentPlayer.base[indSlot1];
  slot.addGenerator(new GeneratorCard(Color.Air));
  slot.addVirus(new VirusCard(Color.Air));

  const indSlot2 = game.players[1].getBase(Color.Water);
  slot = game.players[1].base[indSlot2];
  slot.addGenerator(new GeneratorCard(Color.Water));

  action.addTarget(1);
  action.addSlotTarget(indSlot1);
  action.addSlotTarget(indSlot2);

  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(FirewallCard);

  expect(game.currentPlayer.base[indSlot1].state).toBe(State.Generator);
  expect(game.currentPlayer.base[indSlot1].cards.length).toBe(1);

  expect(game.players[1].base[indSlot2].state).toBe(State.Virused);
  expect(game.players[1].base[indSlot2].cards.length).toBe(2);
  expect(game.deck.length).toBe(63);
});

test("Loan", () => {
  const card = new SpecialCard(Color.Radiation);
  const action = new Action(card, 0);

  game.currentPlayer.hand[0] = card;
  game.currentPlayer.hand[1] = new FirewallCard(Color.Water);

  const indSlot1 = game.currentPlayer.getBase(Color.Water);

  const indSlot2 = game.players[1].getBase(Color.Water);
  const slot = game.players[1].base[indSlot2];
  slot.addGenerator(new GeneratorCard(Color.Water));
  slot.addFireWall(new FirewallCard(Color.Water));

  action.addTarget(1);
  action.addSlotTarget(indSlot2);

  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(FirewallCard);

  expect(game.currentPlayer.base[indSlot1].state).toBe(State.Protected);
  expect(game.currentPlayer.base[indSlot1].cards.length).toBe(2);

  expect(game.players[1].base[indSlot2].state).toBe(State.Empty);
  expect(game.players[1].base[indSlot2].cards.length).toBe(0);
  expect(game.deck.length).toBe(63);
});

test("Exchange", () => {
  const card = new SpecialCard(Color.Energy);
  const action = new Action(card, 0);

  game.currentPlayer.hand[0] = card;
  game.currentPlayer.hand[1] = new FirewallCard(Color.Water);

  const indSlot1 = game.currentPlayer.getBase(Color.Air);
  let slot = game.currentPlayer.base[indSlot1];
  slot.addGenerator(new GeneratorCard(Color.Air));
  slot.addVirus(new VirusCard(Color.Air));

  const indSlot2 = game.players[1].getBase(Color.Water);
  slot = game.players[1].base[indSlot2];
  slot.addGenerator(new GeneratorCard(Color.Water));
  slot.addFireWall(new FirewallCard(Color.Water));

  action.addTarget(game.currentPlayerIdx);
  action.addSlotTarget(indSlot1);

  action.addTarget(1);
  action.addSlotTarget(indSlot2);

  card.action(game, action);

  expect(game.currentPlayer.hand[0]).toBeInstanceOf(FirewallCard);

  expect(game.currentPlayer.base[indSlot1].state).toBe(State.Empty);
  expect(game.currentPlayer.base[indSlot1].cards.length).toBe(0);

  expect(game.currentPlayer.base[indSlot2].state).toBe(State.Protected);
  expect(game.currentPlayer.base[indSlot2].cards.length).toBe(2);

  expect(game.players[1].base[indSlot1].state).toBe(State.Virused);
  expect(game.players[1].base[indSlot1].cards.length).toBe(2);

  expect(game.players[1].base[indSlot2].state).toBe(State.Empty);
  expect(game.players[1].base[indSlot2].cards.length).toBe(0);

  expect(game.deck.length).toBe(63);
});
