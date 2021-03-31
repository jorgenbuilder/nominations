import { useEffect, useState } from 'react';
import { db } from './firebase';

const App:React.FC = () => {

  const [test, setTest] = useState<any>(null);
  
  useEffect(() => {
    db.collection('test').doc('test').get()
    .then(setTest);
  }, []);

  console.log(test);
  return (
    <>
      Hello.
    </>
  )
}

export default App;
