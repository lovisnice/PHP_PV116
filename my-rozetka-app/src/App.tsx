import './App.css'
import HomePage from "./components/home/HomePage.tsx";
import {Route, Routes} from "react-router-dom";
import NoMatchPage from "./components/404/NoMatchPage.tsx";
import CategoryCreatePage from "./components/categories/create/CategoryCreatePage.tsx";
import CategoryEditPage from "./components/categories/edit/CategoryEditPage.tsx";

const App = () => {
    return (
        <>
          <Routes>
            <Route path="/">
              <Route index element={<HomePage/>} />
              <Route path="*" element={<NoMatchPage />} />
              <Route path="categories/create" element={<CategoryCreatePage />} />
                <Route path="categories/edit/:id" element={<CategoryEditPage />} />
            </Route>
          </Routes>
        </>
    )
}

export default App
