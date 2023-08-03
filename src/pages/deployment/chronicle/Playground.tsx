import React from 'react'
import { styled } from '@mui/system'
import { GraphiQL } from 'graphiql'
import type { Fetcher } from '@graphiql/toolkit'
import 'graphiql/graphiql.min.css'
import 'codemirror/theme/elegant.css'

const fetcher: Fetcher = async graphQLParams => {
  const data = await fetch(
    'https://swapi-graphql.netlify.app/.netlify/functions/index',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQLParams),
      credentials: 'same-origin',
    },
  )
  return data.json().catch(() => data.text())
}

const FlexParent = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    '& > *': {
      flex: 1,
    },
  })

const MyGraphQLIDE: React.FC = () => {
    return (
        <FlexParent>
            <GraphiQL editorTheme="elegant" fetcher={fetcher} />
        </FlexParent>
    )
}

export default MyGraphQLIDE
