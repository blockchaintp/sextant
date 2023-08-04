import React from 'react'
import { styled } from '@mui/system'
import '@graphiql/react/dist/style.css'
import {
    GraphiQLProvider,
    QueryEditor,

 } from '@graphiql/react'
import { createGraphiQLFetcher } from '@graphiql/toolkit'

const Parent = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    '& > *': {
      flex: 1,
    },
  })

const fetcher = createGraphiQLFetcher({
  url: 'https://graphqlzero.almansi.me/api',
});

const MyGraphQLIDE: React.FC = () => {
  return (
    <GraphiQLProvider fetcher={fetcher}>
      <Parent className="graphiql-container">
        <QueryEditor />
      </Parent>
    </GraphiQLProvider>
  );
}

export default MyGraphQLIDE
