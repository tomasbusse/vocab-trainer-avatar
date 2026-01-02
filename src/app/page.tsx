"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  MessageCircle,
  BookOpen,
  Mic,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Users,
  Trophy,
} from "lucide-react";

export default function HomePage() {
  const [isCreating, setIsCreating] = useState(false);

  const handleStartDemo = async () => {
    // Generate a demo session token and redirect
    const demoToken = "demo-" + Math.random().toString(36).substring(2, 10);
    window.location.href = `/train/${demoToken}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[hsl(152,60%,98%)]">
      {/* Header */}
      <header className="px-4 py-4 md:px-8">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[hsl(152,60%,35%)] flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VocabTrainer</span>
          </div>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="success" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Learning
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Learn English Vocabulary
            <br />
            <span className="text-[hsl(152,60%,35%)]">with an AI Avatar</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Practice with Emma, your personal AI vocabulary teacher. Get real-time
            feedback on pronunciation, learn words in context, and track your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleStartDemo}
              isLoading={isCreating}
              className="text-lg px-8"
            >
              Try Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Create Trainer
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12 md:py-20 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            4 Ways to Practice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Conversation Mode */}
            <Card variant="interactive" className="text-center">
              <CardContent>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[hsl(152,60%,95%)] flex items-center justify-center mb-4">
                  <MessageCircle className="w-7 h-7 text-[hsl(152,60%,35%)]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Conversation
                </h3>
                <p className="text-sm text-gray-500">
                  Chat naturally with Emma about vocabulary. Ask questions and learn in context.
                </p>
              </CardContent>
            </Card>

            {/* Flashcard Mode */}
            <Card variant="interactive" className="text-center">
              <CardContent>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[hsl(152,60%,95%)] flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-[hsl(152,60%,35%)]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Flashcards
                </h3>
                <p className="text-sm text-gray-500">
                  Quick word review with swipe-based cards. Build vocabulary fast.
                </p>
              </CardContent>
            </Card>

            {/* Quiz Mode */}
            <Card variant="interactive" className="text-center">
              <CardContent>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[hsl(152,60%,95%)] flex items-center justify-center mb-4">
                  <HelpCircle className="w-7 h-7 text-[hsl(152,60%,35%)]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quiz
                </h3>
                <p className="text-sm text-gray-500">
                  Test your knowledge with multiple choice and fill-in-the-blank challenges.
                </p>
              </CardContent>
            </Card>

            {/* Pronunciation Mode */}
            <Card variant="interactive" className="text-center">
              <CardContent>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[hsl(152,60%,95%)] flex items-center justify-center mb-4">
                  <Mic className="w-7 h-7 text-[hsl(152,60%,35%)]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pronunciation
                </h3>
                <p className="text-sm text-gray-500">
                  Practice speaking with real-time pronunciation scoring and feedback.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-12 md:py-20 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Why VocabTrainer Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[hsl(152,60%,35%)]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Individual Links
              </h3>
              <p className="text-gray-500">
                Create unique training links for each student. Track their progress individually.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-[hsl(152,60%,35%)]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Adaptive Learning
              </h3>
              <p className="text-gray-500">
                Difficulty adjusts based on performance. Focus on words that need more practice.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[hsl(152,60%,90%)] flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-[hsl(152,60%,35%)]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Avatar Teacher
              </h3>
              <p className="text-gray-500">
                Emma responds naturally with voice and video. Like having a real tutor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 md:py-20 md:px-8 bg-[hsl(152,60%,35%)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to improve your vocabulary?
          </h2>
          <p className="text-[hsl(152,60%,90%)] mb-8">
            Start learning with Emma today. No sign-up required for the demo.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleStartDemo}
            className="text-lg px-8 !bg-white !text-[hsl(152,60%,35%)] hover:!bg-gray-100"
          >
            Start Free Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[hsl(152,60%,35%)] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">VocabTrainer</span>
          </div>
          <p className="text-sm">
            Powered by AI. Built for learners.
          </p>
        </div>
      </footer>
    </div>
  );
}
