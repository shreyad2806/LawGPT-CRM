"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://your-domain.com/webhook-test/capture-lead",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      toast({
        title: "Success",
        description: "Lead submitted successfully",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-foreground mb-2">
            LawGPT CRM
          </h1>
          <p className="text-sm text-muted-foreground">
            Internal lead capture testing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Smith"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-card border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-card border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-sm">
              Company
            </Label>
            <Input
              id="company"
              name="company"
              placeholder="Acme Inc."
              value={formData.company}
              onChange={handleChange}
              required
              className="bg-card border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Optional notes..."
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="bg-card border-border resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Lead"
            )}
          </Button>
        </form>
      </div>
      <Toaster />
    </main>
  );
}
