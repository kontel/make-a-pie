"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export function PieGrid() {
  const [pies, setPies] = useState([]);
  const [voterName, setVoterName] = useState("");

  useEffect(() => {
    fetchPies();
  }, []);

  const fetchPies = async () => {
    const response = await fetch('/api/pies');
    const data = await response.json();
    setPies(data);
  };

  const handleVote = async (pieId: number) => {
    if (!voterName) {
      alert("Please enter your name to vote!");
      return;
    }

    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pieId, voterName }),
    });

    if (response.ok) {
      fetchPies();
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter your name to vote"
        value={voterName}
        onChange={(e) => setVoterName(e.target.value)}
        className="max-w-xs"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pies.map((pie) => (
          <div key={pie.id} className="border rounded-lg p-4">
            <Image
              src={pie.imageUrl}
              alt={pie.name}
              width={300}
              height={300}
              className="rounded-lg"
            />
            <h3 className="text-lg font-semibold mt-2">{pie.name}</h3>
            <p className="text-sm text-gray-600">{pie.description}</p>
            <p className="text-sm text-gray-500 mt-1">Votes: {pie.votes.length}</p>
            <Button 
              onClick={() => handleVote(pie.id)}
              className="mt-2"
            >
              Vote
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 