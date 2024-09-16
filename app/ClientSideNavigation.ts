'use client';

import React, { useEffect, ReactElement } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ClientSideNavigationProps {
  children: ReactElement;
  uid: string;
}

const ClientSideNavigation: React.FC<ClientSideNavigationProps> = ({ children, uid }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (!currentTab) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('tab', 'home');
      router.replace(`/comet/${uid}?${newSearchParams.toString()}`);
    }
  }, [searchParams, router, uid]);

  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', value);
    router.replace(`/comet/${uid}?${newSearchParams.toString()}`);
  };

  return React.cloneElement(children, { onValueChange: handleTabChange });
};

export default ClientSideNavigation;