// import { useEffect, useState } from 'react';
import ChatBot from './components/chat/ChatBot';
import ReviewList from './components/reviews/ReviewList';
function App() {
  return (
    <div className="h-screen p-4 w-2xl mx-auto">
      {/* <ChatBot /> */}
      <ReviewList productId={2} />
    </div>
  );
}

export default App;
