import MainContent from '@/components/main-content'
import React from 'react'

type Props = {
    children?: React.ReactNode;
};
export default function Layout({children}: Props) {
  return (
    <MainContent basePath='/api/admin/auth'>
        {children}
    </MainContent>
  )
}
