"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";

export function AddPieDialog({ open, onOpenChange }) {
  const [pieData, setPieData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const handleSubmit = async () => {
    const response = await fetch('/api/pies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pieData),
    });
    
    if (response.ok) {
      onOpenChange(false);
      // Reset form and refresh data
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register a New Pie</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Pie Name"
            value={pieData.name}
            onChange={(e) => setPieData({...pieData, name: e.target.value})}
          />
          <Textarea 
            placeholder="Description"
            value={pieData.description}
            onChange={(e) => setPieData({...pieData, description: e.target.value})}
          />
          <UploadButton
            endpoint="pieImage"
            onClientUploadComplete={(res) => {
              setPieData({...pieData, imageUrl: res[0].url});
            }}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 