import ReactDOM from "react-dom/client";
import App from "./app";
import { ResultProvider } from "./context/result_context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ResultProvider>
        <App />
    </ResultProvider>
);
