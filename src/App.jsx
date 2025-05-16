import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AppRoutes from './routes/AppRoutes'
import colors from './theme/color'
import { ConfigProvider } from 'antd'


function App() {
  return (
    <ConfigProvider 
    theme={{
        token: {
          colorPrimary: colors.primary,
          colorTextBase: colors.text,
          colorBgBase: colors.background,
        },
      }}>
      <AppRoutes/>
    </ConfigProvider>
  );
}

export default App;
