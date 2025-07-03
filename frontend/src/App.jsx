import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Contexts } from "./context/user.context.jsx";
const App = () => {
  return (
    <Contexts.UserProvider >
      <AppRoutes />
    </Contexts.UserProvider>
  );
};

export default App;
