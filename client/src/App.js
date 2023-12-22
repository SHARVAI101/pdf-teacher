import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Upload from "./Pages/Upload";
import Learn from "./Pages/Learn";



const Layout = () =>{
  return (
    <>
      {/* <Navbar/> */}
      <Outlet/>
      {/* <Footer/> */}
    </>
  )
}

const LayoutWithNavbar = () =>{
  return (
    <>
      <Navbar/>
      <Outlet/>
      {/* <Footer/> */}
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/dashboard",
        element:(
          <LayoutWithNavbar>
            <Dashboard/>
          </LayoutWithNavbar>
        )
      },
      {
        path:"/upload",
        element:(
          <LayoutWithNavbar>
            <Upload/>
          </LayoutWithNavbar>
        )
      },
      {
        path:"/learn",
        element:(
          <LayoutWithNavbar>
            <Learn/>
          </LayoutWithNavbar>
        )
      }
    ]
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);

function App() {
  return (
    <div>
      <div>
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}

export default App;