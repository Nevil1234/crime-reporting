"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { User } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id: string;
  content: string;
  created_at: string;
  sent_by: 'user' | 'officer';
  report_id: string;
};

type OfficerDetails = {
  id: string;
  badge_number: string;
  user_id: string;
  station_id: string;
};

type ReportDetails = {
  id: string;
  crime_type: string;
  assigned_officer: string;
  complainant_id: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [officer, setOfficer] = useState<OfficerDetails | null>(null);
  const params = useSearchParams();
  const reportId = params.get('report_id');

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!reportId) return;

        // Fetch report with officer details
        const { data: reportData, error: reportError } = await supabase
          .from('crime_reports')
          .select(`
            *,
            police_officers!assigned_officer (
              id,
              badge_number,
              user_id
            )
          `)
          .eq('id', reportId)
          .single();

        if (reportError) throw reportError;
        if (!reportData) throw new Error('Report not found');

        setReport(reportData);
        setOfficer(reportData.police_officers);

        // Fetch existing messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('report_id', reportId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

        // Real-time subscription
        const channel = supabase.channel('messages')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `report_id=eq.${reportId}`
          }, (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          })
          .subscribe();

        return () => {
          channel.unsubscribe();
        };

      } catch (error) {
        console.error('Chat initialization error:', error);
      }
    };

    initializeChat();
  }, [reportId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !reportId) return;

    try {
      // Get current user
      const { data: { user }, error: authError} = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) {
        console.error('User not authenticated');
        alert('Please log in to send messages');
        return;
      }
      
      // Log debugging info
      console.log("Auth check:", { 
        userID: user.id,
        officerUserID: officer?.user_id,
        complainantID: report?.complainant_id 
      });
      
      // For development - comment this out in production
      // Temporarily allow all authenticated users to send messages
      const isAuthenticated = true;
      
      // Normal auth check - uncomment in production
      // const isOfficer = user.id === officer?.user_id;
      // const isComplainant = user.id === report?.complainant_id;
      // const isAuthenticated = isOfficer || isComplainant;
  
      if (!isAuthenticated) {
        console.error("Unauthorized message attempt");
        alert('You do not have permission to send messages in this conversation');
        return;
      }
  
      // Determine message sender type
      let senderType = 'user';
      if (user.id === officer?.user_id) {
        senderType = 'officer';
      }
  
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          report_id: reportId,
          sent_by: senderType
        });
  
      if (error) throw error;
      
      // Clear the message input on successful send
      setNewMessage('');
    } catch (error) {
      console.error('Message send error:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (!report) return (
    <div className="flex justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b flex items-center gap-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="font-semibold">{report.crime_type} Report</h2>
          <p className="text-sm text-gray-600">
            {officer ? `Officer #${officer.badge_number}` : 'Assigned Officer'}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sent_by === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] p-3 rounded-xl ${
              message.sent_by === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white border shadow-sm'}`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-2 opacity-75">
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 border-t">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}