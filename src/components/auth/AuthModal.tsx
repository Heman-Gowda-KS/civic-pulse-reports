
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from "./AuthForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            {mode === 'signin' ? 'Welcome Back!' : 'Join the Community'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" value={mode} onValueChange={(value) => setMode(value as 'signin' | 'signup')} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="signin" className="w-1/2">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="w-1/2">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="mt-0">
            <AuthForm mode="signin" onSuccess={onSuccess} />
          </TabsContent>
          
          <TabsContent value="signup" className="mt-0">
            <AuthForm mode="signup" onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
