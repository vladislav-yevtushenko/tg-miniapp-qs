import { useState } from "react";
import { AppLayout } from "components/layout/AppLayout";
import { ListingsView } from "features/listings/ListingsView";
import { useTelegramContext } from "providers/telegramContext";
import "./App.css";

const App = () => {
  const { isLoading, error } = useTelegramContext();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {isLoading && <p className="status-message">Connecting to Telegram…</p>}
      {!isLoading && error && (
        <p className="status-message status-message--error">{error}</p>
      )}
      {!isLoading && !error && <ListingsView searchQuery={searchQuery} />}
    </AppLayout>
  );
};

export default App;
