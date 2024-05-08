export interface Card {
  title: string
}

export interface ListObject {
  title: string
  cards: Array<Card> | undefined
}
