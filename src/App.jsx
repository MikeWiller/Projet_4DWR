import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import loadingImage from '../images/loading.png';


function App() {
  const [endpoint, setEndpoint] = useState('last');
  const [container, setContainer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [modeText, setModeText] = useState('Mode Sombre');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setModeText(newTheme === 'light' ? 'Mode Sombre' : 'Mode Clair');
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      setModeText(storedTheme === 'light' ? 'Mode Sombre' : 'Mode Clair');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  

  const fetch = async () => {
    if (endpoint.trim() !== '') {
      setIsLoading(true);

      try {
        const options = {
          method: 'GET',
          url: 'https://online-movie-database.p.rapidapi.com/auto-complete',
          params: { q: endpoint },
          headers: {
            'X-RapidAPI-Key': '0000876df5msh6748a2bdb0d8565p1ac3a5jsn7111e8051ad5',
            'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com',
          },
        };
        const response = await axios.request(options);
        setContainer(response.data.d);
        console.log(response.data.d);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    } else {
      setContainer([]);
    }
  };

  const mount = useRef(true);
  useEffect(() => {
    if (mount.current === true) {
      fetch();
    }
    mount.current = false;
  }, []);

  const onChangeHandler = (e) => {
    setEndpoint(e.target.value);
    fetch();
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-blue min-h-screen flex flex-col">
      <header className="text-center py-10">
        <h1 className="text-orange-500 font-bold text-5xl md:text-7xl">Bibliothèque de Films & Series</h1>
      </header>
      <div className="container mx-auto px-4 mb-8">
        <form onSubmit={submitHandler} className="mb-8">
          <div className="flex items-center justify-center" >
            <input
              type="search"
              placeholder="Entrez le nom du film ou de la série"
              onChange={onChangeHandler}
              className="bg-white rounded-md p-4 w-full md:w-96 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
            />
            <button
              type="submit"
              onClick={fetch}
              className="bg-orange-500 rounded-md ml-4 py-3 px-6 text-white font-semibold transition duration-300 ease-in-out hover:bg-orange-600 focus:outline-none focus:bg-orange-600 transform hover:scale-105" style={{ color: theme === 'dark' ? 'black' : 'white' }} 
            >
              Rechercher
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center col-span-4">
              <img
                src= {loadingImage}
                alt="Loading"
                className="h-16 w-16 animate-spin"
              />
            </div>
          ) : (
            container.map((value) => (
              <div
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                key={value.id}
              >
                {'i' in value ? (
                  <img
                  src={value.i.imageUrl}
                  alt={value.l}
                  className="w-full h-64 object-cover rounded-t-lg transition duration-300 ease-in-out transform hover:scale-105"
                  />
              ) : (
                <div className="h-64 bg-gray-300"  />
              )}
              <div className="p-4 ">
                <p className="text-xl text-black font-bold mb-2" style={{ color: theme === 'dark' ? 'black' : '#983b00' }}>{value.l}</p>
                <p className="text-orange-300 font-bold">Type: {value.qid}</p>
                <p className="text-gray-500 font-bold">Rang IMDB: {value.rank}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    <footer className="bg-orange-500 py-4 text-center text-gray-300 mt-auto rounded-md">
        <div className="flex items-center justify-between px-6 ">
          <p className="text-sm font-bold text-white" style={{ color: theme === 'dark' ? 'black' : 'white' }}>Projet 4DWR</p>
          <p className="text-sm font-bold text-white" style={{ color: theme === 'dark' ? 'black' : 'white' }}>   |   Conçu par Temfack Michael & Ghomssi Grace   |   </p>
          <p className="text-sm font-bold text-white" style={{ color: theme === 'dark' ? 'black' : 'white' }}>Ecole-IT 2023, Campus d'Orléans</p>
        </div>
      </footer>

      <button
        className="fixed top-5 right-5 p-2 rounded-md text-white focus:outline-none bg-orange-500  hover:bg-orange-700" 
        onClick={toggleTheme}
      >
        {modeText}
      </button>
  </div>
);
}

export default App;
