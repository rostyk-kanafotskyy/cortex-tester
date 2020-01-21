import * as React from 'react';
import * as cortex from '@elasticpath/cortex-client';

export const ClientContext = React.createContext<cortex.IClient | undefined>(undefined);
export const ClientProvider = ClientContext.Provider;
export const ClientConsumer = ClientContext.Consumer;
