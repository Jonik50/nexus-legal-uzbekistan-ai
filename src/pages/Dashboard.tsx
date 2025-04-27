
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    });

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during logout");
    }
  };

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-darkPurple">Legal Nexus AI Dashboard</h1>
            <p className="text-neutral-gray">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-gray mb-4">Start by uploading your legal documents for analysis</p>
              <Button className="w-full">Upload Document</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-gray mb-4">AI-powered contract analysis</p>
              <Button className="w-full">Analyze Contract</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Legal Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-gray mb-4">Access to legal templates</p>
              <Button className="w-full">View Templates</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <p className="text-sm text-neutral-gray text-center">
            This is a simplified dashboard. More features will be implemented in future updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
