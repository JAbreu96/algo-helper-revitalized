export interface Card {
  title: string
  children: Array<object>
}

export interface ListObject {
  title: string
  cards: Array<Card>
}
