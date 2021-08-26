/* eslint-disable no-shadow */
import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import settings from 'settings'
import selectors from 'store/selectors'
import taekionActions from 'store/modules/taekion'
import routerActions from 'store/modules/router'
import userActions from 'store/modules/user'

const extractFolderTree = ({
  id,
  explorerDirectories,
}) => {
  return (explorerDirectories[id] || [])
    .filter(entry => entry.isDirectory)
    .map(entry => {
      return Object.assign({}, entry, {
        children: extractFolderTree({
          id: entry.inodeid,
          explorerDirectories,
        })
      })
    })
}

const useFileExplorer = () => {
  const dispatch = useDispatch()

  const [ explorerNodesExpanded, setExplorerNodesExpanded ] = useState({})
  
  const accessToken = useSelector(selectors.user.accessToken)
  const params = useSelector(selectors.router.params)
  const volumes = useSelector(selectors.taekion.volumes)
  const snapshots = useSelector(selectors.taekion.snapshots)
  const explorerNodes = useSelector(selectors.taekion.explorerNodes)
  const explorerDirectories = useSelector(selectors.taekion.explorerDirectories)
  const explorerNodesLoading = useSelector(selectors.taekion.explorerNodesLoading)
  
  // MEMO
  const volume = useMemo(() => {
    let returnVolume = volumes[0]
    if(params.volume) {
      const idVolume = volumes.find(v => v.uuid == params.volume)
      returnVolume = idVolume || returnVolume
    }
    return returnVolume
  }, [
    volumes,
    params.volume,
  ])

  const snapshot = useMemo(() => {
    if(!params.snapshot) return null
    return snapshots.find(s => s.block == params.snapshot)
  }, [
    snapshots,
    params.snapshot,
  ])

  const folderTree = useMemo(() => {
    return extractFolderTree({
      id: 'root',
      explorerDirectories,
    })
  }, [
    explorerDirectories,
  ])

  // CALLBACK

  const onUpdateRoute = useCallback((newParams) => {
    dispatch(routerActions.navigateTo('deployment_settings.taekionExplorer', Object.assign({}, params, newParams)))
  }, [
    params,
  ])

  const onChangeVolume = useCallback((id) => {
    setExplorerNodesExpanded({})
    dispatch(taekionActions.resetExplorer())
    onUpdateRoute({
      volume: id,
      inode: 'root',
    })
  }, [
    onUpdateRoute,
  ])

  const onChangeSnapshot = useCallback((id) => {
    onUpdateRoute({
      snapshot: id == 'head' ? '' : id,
      inode: 'root',
    })
  }, [
    onUpdateRoute,
  ])

  const clickFolderTree = useCallback((id) => {
    let value = true
    if(id == params.inode) value = explorerNodesExpanded[id] ? false : true
    setExplorerNodesExpanded(Object.assign({}, explorerNodesExpanded, {
      [id]: value,
    }))
    onUpdateRoute({
      inode: id,
    })
  }, [
    explorerNodesExpanded,
    onUpdateRoute,
    params,
  ])

  const openFolder = useCallback((id) => {
    setExplorerNodesExpanded(Object.assign({}, explorerNodesExpanded, {
      [id]: true,
    }))
    onUpdateRoute({
      inode: id,
    })
  }, [
    explorerNodesExpanded,
    onUpdateRoute,
  ])

  const openFile = useCallback((file_inode, download_filename) => {
    const url = `${settings.api}/clusters/${params.cluster}/deployments/${params.id}/taekion/explorer/${volume.uuid}/dir/${params.inode}/file/${file_inode}?download_filename=${download_filename || ''}&token=${accessToken}&snapshot=${params.snapshot}`
    window.open(url)
  }, [
    volume,
    params,
    accessToken,
  ])

  // EFFECT

  useEffect(() => {
    if(!volume) return
    // keep the 'root' inode consistent so once the results
    // load we stash them against the 'root' key not the actual root uuid
    const inode = params.inode == volume.root ?
      'root' :
      params.inode
    dispatch(taekionActions.explorerListDirectory({
      cluster: params.cluster,
      deployment: params.id,
      volume: volume.uuid,
      snapshot: params.snapshot,
      inode,
    }))
  }, [
    volume,
    params.snapshot,
    params.inode,
  ])

  useEffect(() => {
    if(!volume) return
    dispatch(taekionActions.listSnapshots({
      cluster: params.cluster,
      deployment: params.id,
      volume: volume.uuid,
    }))
  }, [
    volume,
  ])

  useEffect(() => {
    dispatch(userActions.getAccessToken())
  }, [])

  return {
    volume_id: params.volume,
    snapshot_id: params.snapshot,
    inode_id: params.inode,
    volumes,
    volume,
    snapshots,
    snapshot,
    explorerNodes,
    explorerDirectories,
    folderTree,
    expanded: explorerNodesExpanded,
    loading: explorerNodesLoading,
    onChangeVolume,
    onChangeSnapshot,
    openFolder,
    openFile,
    clickFolderTree,
  }

}


export default useFileExplorer
