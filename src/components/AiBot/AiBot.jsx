import { useState } from 'react';

export function AiBot() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // AI implementation will go here
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-6">AI Study Assistant</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Enter a topic to study</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800"
              placeholder="e.g., JavaScript Promises"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
          >
            {isLoading ? 'Generating Questions...' : 'Generate Study Questions'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AiBot; 