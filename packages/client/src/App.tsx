import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Test } from './components/Test';
function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
    return () => {};
  }, []);

  return (
    <div>
      <div className="bg-rose-300 p-5 text-2xl text-center m-10 rounded-lg animate-bounce">
        <p>{message}</p>
        <Button>Click me</Button>
      </div>
      <div className="flex justify-center">
        <Test />
      </div>
    </div>
  );
}

export default App;
