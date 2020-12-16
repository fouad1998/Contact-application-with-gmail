import React from 'react'
import { ConnectionManagerContext } from '../interfaces/context/ConnectionManager'

export const connectionManagerContext = React.createContext<Partial<ConnectionManagerContext>>({})
