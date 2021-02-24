import { Color } from "./Card";
import { GeneratorSlot, State } from "./GeneratorSlot";
import { Player } from "./Players";

/* An interface usefull for the Cleaning card

  It contains - the index of a virus in the current player's base
              - an array of player to which it is possible to give the virus
              - an array of array of index of player's base slot to which it
                  is possible to give the virus
*/
export interface SearchForClean {
  srcSlotInd: number;
  target: Player[];
  dstSlotInd: number[][];
}

/* Search every virus cleanable

   Create an array of CleaningSystem typed var
   
   It contains - the index of a virus in the current player's base
               - an array of player to which it is possible to give the virus
               - an array of array of index of player's base slot to which it
                  is possible to give the virus

   return the so called array, which can be empty
*/
export function searchVirusToClean(players: Player[], currentPlayer: number) {
  let i: number;
  let j: number;
  let w: number;
  const virusToClean: SearchForClean[] = [];
  let candidate: SearchForClean;
  let slot: GeneratorSlot;
  let baseInd: number;
  let doable: boolean;
  let possibleSlot: number[];

  for (i = 0; i < players[currentPlayer].base.length; i++) {
    slot = players[currentPlayer].base[i];
    if (slot.state === State.Virused) {
      j = (currentPlayer + 1) % players.length;
      candidate = { srcSlotInd: i, target: [], dstSlotInd: [[]] };
      for (j; j !== currentPlayer; j = (j + 1) % players.length) {
        doable = false;
        possibleSlot = [];
        if (slot.cards[1].color === Color.Joker) {
          for (w = 0; w !== players[j].base.length; j++) {
            if (players[j].base[w].state === State.Generator) {
              doable = true;
              possibleSlot.push(w);
            }
          }
        } else {
          baseInd = players[j].getBase(Color.Joker);
          if (players[j].base[baseInd].state === State.Generator) {
            doable = true;
            possibleSlot.push(baseInd);
          }

          baseInd = players[j].getBase(slot.cards[1].color);
          if (players[j].base[baseInd].state === State.Generator) {
            doable = true;
            possibleSlot.push(baseInd);
          }
        }
        if (doable) {
          candidate.target.push(players[j]);
          candidate.dstSlotInd.push(possibleSlot);
        }
      }
      if (candidate.target.length > 0) {
        virusToClean.push(candidate);
      }
    }
  }
  return virusToClean;
}

/* Suppr every candidate for cleaning based on a clean

   Every candidate relying on a baseslot that is being
   used by the clean given is being supressed.
*/
export function supprVirusToClean(
  toClean: SearchForClean[],
  target: Player,
  slotSrc: number,
  slotDst: number
) {
  let i: number;
  let j: number;
  let idx: number;
  for (i = 0; i < toClean.length; i++) {
    if (toClean[i].srcSlotInd === slotSrc) {
      toClean.slice(i, 1);
    } else {
      for (j = 0; j < toClean[i].target.length; j++) {
        if (toClean[i].target[j] === target) {
          idx = toClean[i].dstSlotInd[j].indexOf(slotDst);
          if (idx !== -1) {
            toClean[i].dstSlotInd[j].slice(idx, 1);
          }
        }
      }
    }
  }
}
