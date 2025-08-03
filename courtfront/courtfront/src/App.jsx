
import Home from './Components/Home/Home'
import Newcase from './Components/NewCases/Newcase'

import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Provider } from 'react-redux';
import Detailshow from './Components/Detailpage/detailpage'
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

import store from './store'

function App() {
  

  return (
    <Provider store={store}>
    <BrowserRouter>
     <ErrorBoundary>
    <Routes>
     
      <Route path='/'  element={<Home />} />
      <Route path='/newcase' element={<Newcase/>} />
      <Route path='/Details' element={<Detailshow/>}/>
     
    </Routes>
     </ErrorBoundary>
    </BrowserRouter>
     </Provider>  
   
  )
}

export default App
