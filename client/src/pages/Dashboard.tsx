import { List } from 'components/Dashboard/List'
import { useState } from 'react'
import { ListObject, Card } from 'types/project_types'

interface DashboardProps {
  lists: Map<string, ListObject>
}

export const Dashboard: React.FC<DashboardProps> = function (
  props: DashboardProps
): JSX.Element {
  const [lists, updateLists] = useState(props.lists)

  const addACardToList = function (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    key: string
  ) {
    //Update state
    const card: Card = {
      title: 'New Card'
    }

    //Grab Specific Card List and make copy
    if (lists.get(key)) {
      const mutatedList = lists?.get(key)?.cards?.slice()
      //Push a new card to new list
      mutatedList?.push(card)
      const newMap = new Map(lists)

      //Add new List to specific card
      if (newMap.get(key)) {
        newMap.get(key)!.cards = mutatedList
      }

      updateLists(newMap)
      //TODO: Implement a Post Request to DB
    }
  }

  return (
    <div>
      {new Array(...lists.keys()).map((key) => {
        const list: ListObject | undefined = lists.get(key)

        return (
          <List
            mapKey={key}
            key={key}
            listTitle={list?.title}
            addCardHandler={addACardToList}
          >
            {list?.cards?.map((list, idx) => {
              return <p key={list.title + ' ' + idx}>Algorithm Title</p>
            })}
          </List>
        )
      })}
    </div>
  )
}
