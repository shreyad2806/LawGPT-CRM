import React, { useState, useEffect } from "react";
import { Drawer } from "../shared/Drawer";
import { Followup, generateReply, completeFollowup, updateFollowup, getCoachingPanel, CoachingResponse } from "@/lib/api/followups";
import { getLeadMemory, LeadMemoryResponse } from "@/lib/api/memory";

interface FollowupDrawerProps {
  followup: Followup | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function FollowupDrawer({ followup, isOpen, onClose, onRefresh }: FollowupDrawerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  
  const [coachingData, setCoachingData] = useState<CoachingResponse | null>(null);
  const [isLoadingCoaching, setIsLoadingCoaching] = useState(false);
  
  const [leadMemory, setLeadMemory] = useState<LeadMemoryResponse | null>(null);
  const [isLoadingMemory, setIsLoadingMemory] = useState(false);

  useEffect(() => {

    if (followup) {

        setEditedMessage(
            followup.generated_reply ?? ""
        );

    }

}, [followup]);

  // Sync state when followup changes
  useEffect(() => {
    if (followup && isOpen) {
      setEditedMessage(followup.generated_reply || "");
      setManualNotes(followup.manual_notes || "");
      
      // Fetch Coaching Panel
      const fetchCoaching = async () => {
        setIsLoadingCoaching(true);
        try {
          const data = await getCoachingPanel(followup.id);
          setCoachingData(data);
        } catch (error) {
          console.error("Failed to load coaching data", error);
        } finally {
          setIsLoadingCoaching(false);
        }
      };
      
      // Fetch Lead Memory
      const fetchMemory = async () => {
        setIsLoadingMemory(true);
        try {
          const data = await getLeadMemory(Number(followup.lead_id));
          setLeadMemory(data);
        } catch (error) {
          console.error("Failed to load memory data", error);
        } finally {
          setIsLoadingMemory(false);
        }
      };
      
      fetchCoaching();
      fetchMemory();
    } else {
      setCoachingData(null);
      setLeadMemory(null);
    }
  }, [followup, isOpen]);

  if (!followup) return null;

  const handleGenerateReply = async () => {

    try {

        setIsGenerating(true);

        const res = await generateReply(followup.id);
        console.log("Generate Reply Response:", res);
        if (!res?.followup) {
          console.error("Invalid response:", res);
          return;
        }
        setEditedMessage(
          res.followup.generated_reply ?? ""
        );
        
        onRefresh();

    } catch (err) {

        console.error(err);

    } finally {

        setIsGenerating(false);

    }

};

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeFollowup(followup.id);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to complete followup", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateFollowup(followup.id, {
        generated_reply: editedMessage,
        manual_notes: manualNotes,
      });
      onRefresh();
    } catch (error) {
      console.error("Failed to save followup", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="AI SDR Followup Workspace">
      <div className="p-5 space-y-6">
        {/* Lead Profile */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{followup.lead_name}</h3>
              <p className="text-sm text-gray-400">{followup.role} at <span className="text-white">{followup.company}</span></p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              followup.priority === 'Critical' ? 'bg-red-500/20 text-red-400 animate-pulse' :
              followup.priority === 'High' ? 'bg-amber-500/20 text-amber-400' :
              followup.priority === 'Medium' ? 'bg-blue-500/20 text-blue-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {followup.priority} Priority
            </div>
          </div>
        </div>

        {/* Lead Intelligence */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Lead Intelligence
          </h4>
          
          <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl space-y-3">
            {isLoadingMemory ? (
              <div className="text-sm text-gray-400 animate-pulse">Loading intelligence...</div>
            ) : leadMemory?.summary ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-xs text-blue-400/70 uppercase">Buying Intent</span>
                    <span className="text-sm text-white">{leadMemory.summary.buying_intent || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-blue-400/70 uppercase">Urgency</span>
                    <span className="text-sm text-white">{leadMemory.summary.urgency || "Unknown"}</span>
                  </div>
                </div>
                
                {leadMemory.summary.pain_point && (
                  <div>
                    <span className="block text-xs text-blue-400/70 uppercase mb-1">Pain Point</span>
                    <p className="text-sm text-gray-300">{leadMemory.summary.pain_point}</p>
                  </div>
                )}
                
                {leadMemory.summary.objection && (
                  <div>
                    <span className="block text-xs text-blue-400/70 uppercase mb-1">Objection</span>
                    <p className="text-sm text-amber-300/80">{leadMemory.summary.objection}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {leadMemory.summary.decision_maker && (
                    <div>
                      <span className="block text-xs text-blue-400/70 uppercase">Decision Maker</span>
                      <span className="text-sm text-white">{leadMemory.summary.decision_maker}</span>
                    </div>
                  )}
                  {leadMemory.summary.budget && (
                    <div>
                      <span className="block text-xs text-blue-400/70 uppercase">Budget</span>
                      <span className="text-sm text-white">{leadMemory.summary.budget}</span>
                    </div>
                  )}
                </div>

                {leadMemory.summary.preferred_communication && (
                  <div>
                    <span className="block text-xs text-blue-400/70 uppercase">Preferred Communication</span>
                    <span className="text-sm text-white">{leadMemory.summary.preferred_communication}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {leadMemory.summary.last_action && (
                    <div>
                      <span className="block text-xs text-blue-400/70 uppercase">Last Action</span>
                      <span className="text-sm text-gray-300">{leadMemory.summary.last_action}</span>
                    </div>
                  )}
                  {leadMemory.summary.next_action && (
                    <div>
                      <span className="block text-xs text-blue-400/70 uppercase">Next Action</span>
                      <span className="text-sm text-green-300">{leadMemory.summary.next_action}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 text-center py-2">No intelligence data available yet. Generate a reply to build memory.</div>
            )}
          </div>
        </div>

        {/* AI Coaching Panel */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            AI Coaching Panel
          </h4>
          
          <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl space-y-4">
            {isLoadingCoaching ? (
              <div className="text-sm text-gray-400 animate-pulse">Generating SDR insights...</div>
            ) : coachingData ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs text-purple-400/70 uppercase">Buying Intent</span>
                    <span className="text-sm text-white">{coachingData.coaching.buying_intent}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-purple-400/70 uppercase">Urgency</span>
                    <span className="text-sm text-white">{coachingData.coaching.urgency}</span>
                  </div>
                </div>
                
                <div>
                  <span className="block text-xs text-purple-400/70 uppercase mb-1">Pain Point</span>
                  <p className="text-sm text-gray-300">{coachingData.coaching.pain_point}</p>
                </div>
                
                <div>
                  <span className="block text-xs text-purple-400/70 uppercase mb-1">Objection Prediction</span>
                  <p className="text-sm text-amber-300/80">{coachingData.coaching.objection_prediction}</p>
                </div>

                <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500/30">
                  <span className="block text-xs text-purple-300 font-semibold mb-1">Recommended Strategy</span>
                  <p className="text-sm text-white">{coachingData.coaching.recommended_strategy}</p>
                  <div className="mt-2 text-xs text-purple-200">
                    <span className="font-semibold">Next Objective:</span> {coachingData.coaching.next_objective}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-400">Failed to load coaching data.</div>
            )}
          </div>
        </div>

        {/* Conversation Memory */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Conversation Memory</h4>
          <div className="bg-black/40 border border-white/5 p-3 rounded-xl max-h-48 overflow-y-auto space-y-3">
            {isLoadingCoaching ? (
              <div className="text-sm text-gray-500">Loading history...</div>
            ) : coachingData?.conversation_memory && coachingData.conversation_memory.length > 0 ? (
              coachingData.conversation_memory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender.toLowerCase() === 'agent' || msg.sender.toLowerCase() === 'ai' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-500 mb-1">{msg.sender} • {new Date(msg.timestamp).toLocaleDateString()}</span>
                  <div className={`text-sm p-2 rounded-lg ${msg.sender.toLowerCase() === 'agent' || msg.sender.toLowerCase() === 'ai' ? 'bg-blue-500/20 text-blue-100' : 'bg-white/10 text-gray-300'}`}>
                    {msg.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">No prior conversation history recorded.</div>
            )}
          </div>
        </div>

        {/* Generated Reply Editor */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold text-white">Generated Reply</h4>
            <button 
              onClick={handleGenerateReply}
              disabled={isGenerating}
              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Draft"}
            </button>
          </div>
          <textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="AI generated message will appear here..."
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/10 flex gap-3 pb-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-medium transition-colors"
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handleComplete}
            disabled={isCompleting || followup.status === "Completed"}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition-colors"
          >
            {isCompleting ? "Completing..." : followup.status === "Completed" ? "Completed" : "Mark Complete"}
          </button>
        </div>
      </div>
    </Drawer>
  );
}
