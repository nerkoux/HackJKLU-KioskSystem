"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function VideoConsultation() {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const startConsultation = () => {
    setIsActive(true);
    setMessages([
      { 
        text: "Hello! I'm your AI Career Consultant. How can I help you with your career decisions today?", 
        isUser: false 
      }
    ]);
  };
  
  const endConsultation = () => {
    setIsActive(false);
    setMessages([]);
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { text: inputValue, isUser: true }];
    setMessages(newMessages);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      let response = "";
      
      if (inputValue.toLowerCase().includes("career") || inputValue.toLowerCase().includes("job")) {
        response = "Based on your personality type, you might excel in careers that allow you to use your natural strengths. Would you like me to suggest some specific career paths?";
      } else if (inputValue.toLowerCase().includes("skill") || inputValue.toLowerCase().includes("learn")) {
        response = "Developing skills that align with your personality type can help you succeed. Consider focusing on both technical skills relevant to your field and soft skills that complement your natural tendencies.";
      } else if (inputValue.toLowerCase().includes("interview") || inputValue.toLowerCase().includes("resume")) {
        response = "When preparing for interviews or creating your resume, highlight experiences that showcase your natural strengths. Would you like some specific tips based on your personality type?";
      } else if (inputValue.toLowerCase().includes("education") || inputValue.toLowerCase().includes("course")) {
        response = "Continuing education is important for career growth. I can recommend courses or educational paths that would be particularly beneficial for someone with your personality type.";
      } else {
        response = "That's an interesting question. To provide the most helpful guidance, I'd like to know more about your specific career interests and goals. Could you share more details?";
      }
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      {!isActive ? (
        <div className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">AI Video Consultation</h3>
          <p className="text-slate-300 mb-6">
            Get personalized career advice through an interactive consultation with our AI career expert.
          </p>
          <Button variant="gradient" onClick={startConsultation}>
            Start Consultation
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-[500px]">
          <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="font-medium">AI Career Consultant</span>
            </div>
            <Button variant="ghost" size="sm" onClick={endConsultation}>
              End Consultation
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-blue-600 ml-auto' 
                      : 'bg-slate-700 mr-auto'
                  }`}
                >
                  {message.text}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-700 bg-slate-800">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question here..."
                className="flex-1 p-2 rounded-l bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
              />
              <Button 
                variant="gradient" 
                className="rounded-l-none"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}