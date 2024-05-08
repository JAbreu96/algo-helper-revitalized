export interface Card {
  title: string
  createdDate: Date
}

export interface ListObject {
  title: string
  cards: Array<Card> | undefined
}
