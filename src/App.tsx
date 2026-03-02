import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MasterLayout from './masterLayout/MasterLayout'
import Payment from './pages/Payment';

function App() {
  return (
    <BrowserRouter>
    <Routes >
      <Route path="/payment" element={<MasterLayout><Payment /></MasterLayout>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
