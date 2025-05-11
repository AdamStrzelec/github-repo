import { QueryClient, QueryClientProvider } from "react-query";
import { SearchUsers } from "./components/SearchUsers";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchUsers />
    </QueryClientProvider>
  );
}

export default App;
