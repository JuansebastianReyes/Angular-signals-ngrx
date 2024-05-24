import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { CardsService } from "../services/cards.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop"
import { pipe, switchMap, tap } from "rxjs";

export interface Card {
  id: string;
  name: string;
  type: string;
}

interface CardStatus {
  cards: Card[],
  state: 'Loading' | 'Loaded' | 'Error',
  filter: { query:string, page:number }
}

const intialState: CardStatus= {
  cards: [],
  state: "Loading",
  filter: {
    query: "",
    page: 1
  }
}

export const CardStore = signalStore(
  { providedIn: 'root'},
  withState(intialState),
  withComputed(({cards})=>({
    cardList: computed(()=> cards()),
    cardsCount: computed(()=> cards().length),
    spellCards: computed(()=> cards().filter((card)=> card.type === 'Spell Card').length),
  })),
  withMethods((store, cardService = inject(CardsService)) => ({
    loadPage: rxMethod<number>(
      pipe(
        tap(() => patchState( store, { state: 'Loading'})),
        switchMap((page) => {
          return cardService.loadCards(page).pipe(
            tap((cards)=>{
              patchState( store, { cards, state: 'Loaded'})
            })
          )
        })
      )
    )
  }))
)
