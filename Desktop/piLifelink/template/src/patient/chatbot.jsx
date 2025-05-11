import { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "chatbase-script";
    script.setAttribute("chatbotId", "Fz72Z9ZznIxZ9Q-v7CZaq"); 
    script.setAttribute("domain", "www.chatbase.co");
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); 
    };
  }, []);

  return (
    <div>
      <h2>Bienvenue chez Dalanda</h2>
      <iframe
        src="https://www.chatbase.co/dashboard/anis-ben-mehrezs-team/chatbot/Fz72Z9ZznIxZ9Q-v7CZaq" 
        width="100%"
        height="500px"
        frameBorder="0"
        title="Chatbot"
      />
    </div>
  );
};

export default Chatbot;