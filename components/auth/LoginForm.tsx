import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginFormProps } from "@/types/auth";
import { useState } from "react";

export function LoginForm({ onSubmit, initialValue = "" }: LoginFormProps) {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Enter
      </Button>
    </form>
  );
}
