import { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { store } from '../redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

interface RenderOptions {
  children: ReactNode
}

export function renderWithProviders({ children }: RenderOptions) {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
}
