/* eslint-disable no-shadow */
import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import selectors from 'store/selectors'
import taekionActions from 'store/modules/taekion'
import routerActions from 'store/modules/router'

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
  
  const params = useSelector(selectors.router.params)
  const volumes = useSelector(selectors.taekion.volumes)
  const explorerNodes = useSelector(selectors.taekion.explorerNodes)
  const explorerDirectories = useSelector(selectors.taekion.explorerDirectories)
  const explorerNodesLoading = useSelector(selectors.taekion.explorerNodesLoading)
  
  
  // MEMO

  const volume = useMemo(() => {
    let volume = volumes[0]
    if(params.volume) {
      const idVolume = volumes.find(v => v.uuid == params.volume)
      volume = idVolume || volume
    }
    return volume
  }, [
    volumes,
    params.volume,
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

  const clickFolderTree = useCallback((id) => {
    const value = explorerNodesExpanded[id] ? false : true
    setExplorerNodesExpanded(Object.assign({}, explorerNodesExpanded, {
      [id]: value,
    }))
    onUpdateRoute({
      inode: id,
    })
  }, [
    explorerNodesExpanded,
    onUpdateRoute,
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
      inode,
    }))
  }, [
    volume,
    params.inode,
  ])

  return {
    volume_id: params.volume,
    inode_id: params.inode,
    volumes,
    volume,
    explorerNodes,
    explorerDirectories,
    folderTree,
    expanded: explorerNodesExpanded,
    loading: explorerNodesLoading,
    onChangeVolume,
    clickFolderTree,
  }

}


export default useFileExplorer
