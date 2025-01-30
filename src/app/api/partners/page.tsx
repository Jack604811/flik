"use client";

import React from 'react'
import { RedocStandalone } from 'redoc';

function Page() {
  return (
    <div>
        <RedocStandalone specUrl='http://petstore.swagger.io/v2/swagger.json' 
            options={{
                nativeScrollbars: true,
                theme: { colors: { primary: { main: '#dd5522' } } },
            }} 
        />
    </div>
  )
}

export default Page