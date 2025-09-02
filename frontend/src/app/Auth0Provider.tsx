'use client';

import React from 'react';
import { Auth0Provider as SDKAuth0Provider } from '@auth0/nextjs-auth0';

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  return <SDKAuth0Provider>{children}</SDKAuth0Provider>;
}
