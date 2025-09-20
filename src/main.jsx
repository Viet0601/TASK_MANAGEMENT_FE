import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store.jsx";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <App />
            <Toaster position="top-center" reverseOrder={false} duration={1500} />
          </AppProvider>
        </QueryClientProvider>
      </Provider>
    </PersistGate>
  </BrowserRouter>
);
