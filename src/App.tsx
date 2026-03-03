import React, { useState, useMemo, useCallback } from 'react';
import { Search, Gamepad2, ArrowLeft, Maximize2, Play, Info, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

interface Game {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  description: string;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [key, setKey] = useState(0);

  const filteredGames = useMemo(() => {
    return (gamesData as Game[]).filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handlePlay = (game: Game) => {
    setSelectedGame(game);
    setKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReload = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setSelectedGame(null)}
          >
            <div className="p-2 bg-emerald-500 rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Unblocked<span className="text-emerald-500">Games</span>
            </h1>
          </div>

          {!selectedGame && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          )}

          {selectedGame && (
            <button
              onClick={() => setSelectedGame(null)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{selectedGame.title}</h2>
                  <p className="text-zinc-400 mt-1">{selectedGame.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReload}
                    className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"
                    title="Reload Game"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative h-[90vh] w-full glass rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  key={key}
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; pointer-lock; gamepad"
                  title={selectedGame.title}
                  scrolling="no"
                  id="518929564"
                  allowtransparency="true"
                  frameBorder="0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 glass p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <Info className="w-5 h-5" />
                    <h3 className="font-semibold">How to Play</h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Most games use standard keyboard controls (Arrow keys or WASD) and Mouse. 
                    If the game doesn't respond, click inside the game window to focus it.
                  </p>
                </div>
                <div className="glass p-6 rounded-2xl space-y-4">
                  <h3 className="font-semibold">Game Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Platform</span>
                      <span>Web Browser</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Category</span>
                      <span>Unblocked</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold">Featured Games</h2>
                <p className="text-zinc-500">Hand-picked favorites for you to enjoy.</p>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative glass rounded-2xl overflow-hidden game-card-hover flex flex-col"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handlePlay(game)}
                            className="bg-emerald-500 text-black p-4 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300"
                          >
                            <Play className="w-6 h-6 fill-current" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">
                          {game.title}
                        </h3>
                        <p className="text-zinc-500 text-sm line-clamp-2 mt-1">
                          {game.description}
                        </p>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                            Free to Play
                          </span>
                          <button
                            onClick={() => handlePlay(game)}
                            className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                          >
                            PLAY NOW
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 glass rounded-3xl">
                  <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-zinc-700" />
                  </div>
                  <h3 className="text-xl font-bold">No games found</h3>
                  <p className="text-zinc-500 mt-2">Try searching for something else.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">Unblocked Games Hub</span>
          </div>
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Unblocked Games. All games are property of their respective owners.
          </p>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
