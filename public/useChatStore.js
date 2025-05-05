export function useChatStore() {
    const getInitialHistory = () => {
      if (typeof window !== 'undefined') {
        try {
          return JSON.parse(localStorage.getItem("galactusHistory") ?? "[]");
        } catch (e) {
          console.error("Failed to parse local chat history:", e);
          return [];
        }
      }
      return [];
    };
  
    let history = getInitialHistory();
  
    const setHistory = (newHistory) => {
      history = newHistory;
      localStorage.setItem("galactusHistory", JSON.stringify(newHistory));
    };
  
    return { history, setHistory };
  }