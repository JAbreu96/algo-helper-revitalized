import { ListItem } from 'components/Dashboard/ListItem'
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
    const listItem: Card = {
      title: 'New Card'
    }

    //Grab Specific Card List and make copy
    if (lists.get(key)) {
      const mutatedList = lists?.get(key)?.cards?.slice()
      //Push a new card to new list
      mutatedList?.push(listItem)
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
    <main className="dashboard">
      {new Array(...lists.keys()).map((key) => {
        const list: ListObject | undefined = lists.get(key)

        return (
          <List
            mapKey={key}
            key={key}
            listTitle={list?.title}
            addCardHandler={addACardToList}
          >
            {list?.cards?.map((item, idx) => {
              return (
                <ListItem key={list.title + ' ' + idx} title={item.title} />
              )
            })}
          </List>
        )
      })}
    </main>
  )
}
