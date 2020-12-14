import ConnectionManager from '../../utils/ConnectionManager/ConnectionManager'

export interface ConnectionManagerContext {
  connectionManager: ConnectionManager
  isAuthorized: boolean
  authorizedService: string[]
}
