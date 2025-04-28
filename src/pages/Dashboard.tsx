
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/auth");
        return;
      }
      
      setUser(data.session.user);
      fetchDocuments();
    });

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    // Subscribe to real-time updates for documents
    const channel = supabase
      .channel('document_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setDocuments(current =>
              current.map(doc =>
                doc.id === (payload.new as any).id ? { ...doc, ...(payload.new as any) } : doc
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setDocuments(current => [...current, payload.new as any]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during logout");
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-gray">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-white to-neutral-100">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-neutral-darkPurple">Documents Dashboard</h1>
            {user && (
              <p className="text-sm text-neutral-gray">Welcome back, {user?.email}</p>
            )}
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-gray mb-4">Upload your legal documents for AI analysis</p>
              <DocumentUpload />
            </CardContent>
          </Card>
          
          {/* Documents Table */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
            <DocumentTable documents={documents} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
