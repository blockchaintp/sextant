/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {
  AppBar,
  Tabs,
  Tab,
} from '@mui/material'

import { getPages } from '../../utils/deployment_settings_page'

interface DeploymentSettingsProps {
  cluster: string
  id: string
  deployment_type: string
  deployment_version: string
  features: string[]
  route: {
    name: string
    path: string
  }
  onViewPage: (cluster: string, id: string, deployment_type: string, deployment_version: string, page: string, params: any) => void
  children: string
}

const DeploymentSettings: React.FC<DeploymentSettingsProps> = ({
  cluster,
  id,
  deployment_type,
  deployment_version,
  features,
  route,
  onViewPage,
  children,
}) => {

  const pages: {
    id: string
    title: string
    params?: { volume: string, inode: string }
  }[] = getPages(features)

  const pageName = route.name.split('.')[1]

  if (pages.length === 0) {
    return (
      <div>
        <AppBar position="static" color="default" />
      </div>
    )
  }

  let currentIndex = pages.findIndex((p) => p.id === pageName)

  if (currentIndex < 0) currentIndex = 0

  return (
    <div className={classnames('deployment-settings-root')}>
      <AppBar position="static" color="default">
        <Tabs
          value={currentIndex}
          onChange={(ev, value) => {
            const nextPage = pages[value]
            onViewPage(cluster, id, deployment_type, deployment_version, nextPage.id, nextPage.params || {})
          }}
          indicatorColor="primary"
          textColor="primary"
        >
          {
            pages.map((page, i) => (
              <Tab label={page.title} key={page.id} />
            ))
          }
        </Tabs>
      </AppBar>
      {children}
    </div>
  )
}

export default DeploymentSettings
