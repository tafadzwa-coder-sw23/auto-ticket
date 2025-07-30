import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_URL = "http://localhost:8000/classify_ticket"; // Adjust if backend runs elsewhere

const TicketClassifier = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<null | { department: string; confidence: number }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description }),
      });
      if (!response.ok) throw new Error("Failed to classify ticket");
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-lg">
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Support Ticket Classifier</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                  placeholder="Enter ticket subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  placeholder="Describe your issue"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Classifying..." : "Classify Ticket"}
              </Button>
            </form>
            {result && (
              <div className="mt-6 p-4 rounded bg-green-50 border border-green-200 text-green-900">
                <div><strong>Predicted Department:</strong> {result.department}</div>
                <div><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</div>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 rounded bg-red-50 border border-red-200 text-red-900">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketClassifier;
