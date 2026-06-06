"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createEngagementLog } from "@/lib/api/engagementLogs";

interface AddEngagementModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function AddEngagementModal({ open, onClose, onSaved }: AddEngagementModalProps) {
  const [source, setSource] = useState("Comment");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const sourceOptions = [
    { value: "Comment", label: "Comment" },
    { value: "Message", label: "Message" },
    { value: "Email", label: "Email" },
    { value: "Referral", label: "Referral" },
    { value: "Manual", label: "Manual" },
    { value: "Other", label: "Other" },
  ];

  // Debug: log source state changes
  React.useEffect(() => {
    console.log("Source state:", source);
  }, [source]);

  const handleSourceChange = (value: string) => {
    console.log("Selected source:", value);
    setSource(value);
  };

  const handleSave = async () => {
    // Debug: log current source before save
    console.log("Saving with source:", source);
    
    // Validation: At least one of Message or Screenshot must exist
    if (!message.trim() && !screenshot) {
      alert("Please provide a message or upload a screenshot");
      return;
    }

    setSaving(true);
    try {
      const data: any = {
        source: source,
      };

      // Add optional fields if provided
      if (name) data.person_name = name;
      if (company) data.company = company;
      if (role) data.role = role;
      if (message) data.message = message;
      if (postUrl) data.post_url = post_url;

      // Convert screenshot to base64 if provided
      if (screenshot) {
        const base64 = await fileToBase64(screenshot);
        data.screenshot_data = base64;
      }

      console.log("Saving engagement:", data);
      const result = await createEngagementLog(data);
      console.log("Save result:", result);
      
      // Show success toast
      if (result && result.lead) {
        alert("Engagement analyzed and lead created");
      } else {
        alert("Engagement saved successfully");
      }
      
      onSaved();
      handleClose();
    } catch (error: any) {
      console.error("Failed to save engagement:", error);
      // Handle vision extraction errors specifically
      if (error.message && error.message.includes("Could not extract information from screenshot")) {
        alert(error.message);
      } else if (error.message && error.message.includes("Vision extraction encountered an error")) {
        alert(error.message);
      } else {
        alert("Failed to save engagement: " + (error.message || "Unknown error"));
      }
    } finally {
      setSaving(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleClose = () => {
    setSource("Comment");
    setName("");
    setCompany("");
    setRole("");
    setMessage("");
    setPostUrl("");
    setScreenshot(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} title="Add Engagement" maxWidth="max-w-6xl w-[90vw]">
      <div className="space-y-6">
        {/* Source */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Source *
          </label>
          <Select
            variant="default"
            value={source}
            onChange={handleSourceChange}
            options={sourceOptions}
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#1F2937] rounded-md px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter person's name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#1F2937] rounded-md px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-[#1F2937] rounded-md px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter role/title"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full bg-[#0A0A0F] border border-[#1F2937] rounded-md px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-blue-500 resize-vertical"
            placeholder="Paste the engagement message here"
          />
        </div>

        {/* Post URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Post URL
          </label>
          <input
            type="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            className="w-full bg-[#0A0A0F] border border-[#1F2937] rounded-md px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
            placeholder="https://linkedin.com/posts/..."
          />
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Screenshot Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            className="w-full bg-[#0A0A0F] border border-[#1F2937] rounded-md px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Engagement"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default AddEngagementModal;
