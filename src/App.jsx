import React from 'react'
import { BrowserRouter } from 'react-router';

import AddCompany from './Components/AddCompany/AddCompany'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <AddCompany />
      </BrowserRouter>
    </div>
  )
}

export default App