import { Action } from "../gamelogic/Action";
import { Color } from "../gamelogic/Card";
import { Game } from "../gamelogic/Game";
import { GeneratorCard } from "../gamelogic/GeneratorCard";
import { State } from "../gamelogic/GeneratorSlot";
import { Player, Species } from "../gamelogic/Players";
import { VirusCard } from "../gamelogic/VirusCard";

test("Vérifier l'action des cartes générateurs", () => {
  const game = new Game();
  game.addPlayer(new Player("one", Species.Totox));
  game.addPlayer(new Player("two", Species.Hutex));
  game.init();
  game.currentPlayerIdx = 0;

  const card = new GeneratorCard(Color.Air);
  const action = new Action(card, 0);
  game.currentPlayer.hand[0] = card;
  game.currentPlayer.hand[1] = new VirusCard(Color.Energy);

  card.action(game, action);
  expect(game.currentPlayer.hand[0]).toBeInstanceOf(VirusCard);

  const generatorInd = game.currentPlayer.getBase(Color.Air);
  const generator = game.currentPlayer.base[generatorInd];
  expect(generator.state).toBe(State.Generator);
  expect(generator.cards.length).toBe(1);
  expect(generator.cards[0]).toBeInstanceOf(GeneratorCard);
  expect(game.deck.length).toBe(62);
});
