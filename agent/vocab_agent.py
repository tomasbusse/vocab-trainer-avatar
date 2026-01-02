"""
Vocabulary Trainer Agent with Beyond Presence Avatar
Real-time voice-based English vocabulary teaching with AI avatar

Architecture:
- LiveKit Agents framework for real-time communication
- Deepgram Nova-3 for speech-to-text
- OpenRouter GPT-4o-mini for vocabulary explanations
- Cartesia Sonic Turbo for ultra-low latency TTS
- Beyond Presence Genesis for lip-synced avatar video
"""

import asyncio
import logging
import os
import random
import httpx
from typing import Optional
from dataclasses import dataclass, field
from dotenv import load_dotenv

from livekit import rtc
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.llm import function_tool, RunContext
from livekit.plugins import silero, deepgram, openai, cartesia, bey, turn_detector

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vocab-trainer")


# ============================================================================
# CONVEX CLIENT FOR VOCABULARY DATA
# ============================================================================

class ConvexClient:
    """Simple Convex HTTP client for fetching vocabulary data"""

    def __init__(self):
        self.url = os.getenv("NEXT_PUBLIC_CONVEX_URL", "")

    async def get_words_for_session(self, session_id: str) -> list:
        """Fetch words for a training session from Convex"""
        # In production, this would call Convex HTTP API
        # For now, return demo vocabulary
        return DEMO_VOCABULARY

    async def record_progress(self, session_id: str, word: str, correct: bool, pronunciation_score: Optional[float] = None):
        """Record student progress to Convex"""
        logger.info(f"Recording progress: {word} - {'correct' if correct else 'incorrect'}")
        # In production, POST to Convex HTTP API


# ============================================================================
# DEMO VOCABULARY (Replace with Convex data in production)
# ============================================================================

DEMO_VOCABULARY = [
    {
        "word": "ephemeral",
        "definition": "lasting for a very short time",
        "pronunciation": "ih-FEM-er-ul",
        "part_of_speech": "adjective",
        "examples": [
            "The ephemeral beauty of cherry blossoms makes them special.",
            "Social media posts are often ephemeral, quickly forgotten.",
            "His fame was ephemeral, lasting only a few months."
        ],
        "synonyms": ["fleeting", "transient", "momentary", "brief"],
        "etymology": "From Greek 'ephemeros' meaning 'lasting only a day'",
        "difficulty": "advanced"
    },
    {
        "word": "ubiquitous",
        "definition": "present, appearing, or found everywhere",
        "pronunciation": "yoo-BIK-wi-tus",
        "part_of_speech": "adjective",
        "examples": [
            "Smartphones have become ubiquitous in modern society.",
            "Coffee shops are ubiquitous in major cities.",
            "The company's logo is ubiquitous in advertising."
        ],
        "synonyms": ["omnipresent", "pervasive", "universal", "widespread"],
        "etymology": "From Latin 'ubique' meaning 'everywhere'",
        "difficulty": "intermediate"
    },
    {
        "word": "serendipity",
        "definition": "the occurrence of events by chance in a happy or beneficial way",
        "pronunciation": "ser-en-DIP-i-tee",
        "part_of_speech": "noun",
        "examples": [
            "Finding my best friend at that coffee shop was pure serendipity.",
            "Many scientific discoveries happened through serendipity.",
            "The serendipity of meeting her changed his life forever."
        ],
        "synonyms": ["chance", "luck", "fortune", "providence"],
        "etymology": "Coined by Horace Walpole in 1754 from a Persian fairy tale",
        "difficulty": "intermediate"
    },
    {
        "word": "paradigm",
        "definition": "a typical example or pattern of something; a model",
        "pronunciation": "PAIR-uh-dime",
        "part_of_speech": "noun",
        "examples": [
            "The internet created a new paradigm for communication.",
            "We need a paradigm shift in how we approach this problem.",
            "This represents a paradigm of excellent customer service."
        ],
        "synonyms": ["model", "pattern", "example", "framework"],
        "etymology": "From Greek 'paradeigma' meaning 'pattern, example'",
        "difficulty": "advanced"
    },
    {
        "word": "mitigate",
        "definition": "to make less severe, serious, or painful",
        "pronunciation": "MIT-ih-gate",
        "part_of_speech": "verb",
        "examples": [
            "We must mitigate the risks of this project.",
            "The insurance will help mitigate financial losses.",
            "Trees help mitigate the effects of pollution."
        ],
        "synonyms": ["reduce", "lessen", "alleviate", "diminish"],
        "etymology": "From Latin 'mitigare' meaning 'to soften'",
        "difficulty": "advanced"
    }
]


@dataclass
class StudentSession:
    """Track student's current session state"""
    session_id: str
    current_word_index: int = 0
    words_practiced: list = field(default_factory=list)
    correct_count: int = 0
    total_attempts: int = 0
    current_mode: str = "conversation"  # conversation, quiz, pronunciation


# Global session state (in production, use Convex)
student_sessions: dict[str, StudentSession] = {}


# ============================================================================
# VOCABULARY TOOLS (Function Tools for the Agent)
# ============================================================================

@function_tool
async def get_word_definition(
    context: RunContext,
    word: str
) -> str:
    """
    Get the definition and details of a vocabulary word.
    Use this when a student asks about a specific word.

    Args:
        word: The vocabulary word to look up
    """
    word_lower = word.lower().strip()

    for entry in DEMO_VOCABULARY:
        if entry["word"].lower() == word_lower:
            return f"""
Word: {entry['word']}
Pronunciation: {entry['pronunciation']}
Part of Speech: {entry['part_of_speech']}
Definition: {entry['definition']}
Etymology: {entry['etymology']}
Synonyms: {', '.join(entry['synonyms'])}

Example sentences:
1. {entry['examples'][0]}
2. {entry['examples'][1]}
3. {entry['examples'][2]}
"""

    available = ", ".join([w["word"] for w in DEMO_VOCABULARY])
    return f"I don't have '{word}' in my vocabulary database. Try asking about: {available}"


@function_tool
async def get_example_sentence(
    context: RunContext,
    word: str
) -> str:
    """
    Get example sentences using the vocabulary word.

    Args:
        word: The vocabulary word
    """
    word_lower = word.lower().strip()

    for entry in DEMO_VOCABULARY:
        if entry["word"].lower() == word_lower:
            example = random.choice(entry['examples'])
            return f"Here's an example: {example}"

    return f"I don't have examples for '{word}'."


@function_tool
async def check_pronunciation(
    context: RunContext,
    word: str,
    student_attempt: str
) -> str:
    """
    Provide feedback on the student's pronunciation attempt.

    Args:
        word: The vocabulary word
        student_attempt: What the student said (transcribed)
    """
    word_lower = word.lower().strip()
    attempt_lower = student_attempt.lower().strip()

    for entry in DEMO_VOCABULARY:
        if entry["word"].lower() == word_lower:
            # Simple check - in production, use phonetic comparison
            if word_lower in attempt_lower or attempt_lower == word_lower:
                return f"Excellent pronunciation! You said '{entry['word']}' correctly. The phonetic pronunciation is: {entry['pronunciation']}. Great job!"
            else:
                return f"Good try! The correct pronunciation is {entry['pronunciation']}. Let me say it again slowly: {entry['word']}. Try once more!"

    return f"I'm not sure about the word '{word}'."


@function_tool
async def get_quiz_question(
    context: RunContext,
    difficulty: str = "intermediate"
) -> str:
    """
    Generate a quiz question about vocabulary.

    Args:
        difficulty: Question difficulty (beginner, intermediate, advanced)
    """
    matching_words = [w for w in DEMO_VOCABULARY if w['difficulty'] == difficulty]

    if not matching_words:
        matching_words = DEMO_VOCABULARY

    word_entry = random.choice(matching_words)

    return f"""Quiz time! Here's your question:

What word means "{word_entry['definition']}"?

Hint: It starts with the letter '{word_entry['word'][0].upper()}' and has {len(word_entry['word'])} letters.

Take your time and tell me your answer!"""


@function_tool
async def get_next_word(
    context: RunContext
) -> str:
    """
    Get the next word to practice in the session.
    Use this to move to a new vocabulary word.
    """
    word_entry = random.choice(DEMO_VOCABULARY)

    return f"""Let's learn a new word: {word_entry['word']}

This is a {word_entry['difficulty']} level {word_entry['part_of_speech']}.

{word_entry['word']} means: {word_entry['definition']}

For example: {word_entry['examples'][0]}

Would you like me to explain more, hear another example, or try using it in a sentence?"""


@function_tool
async def evaluate_sentence(
    context: RunContext,
    word: str,
    student_sentence: str
) -> str:
    """
    Evaluate the student's attempt to use a word in a sentence.

    Args:
        word: The vocabulary word
        student_sentence: The student's sentence attempt
    """
    word_lower = word.lower()
    sentence_lower = student_sentence.lower()

    if word_lower in sentence_lower:
        return f"Excellent! You used '{word}' correctly in your sentence. That shows good understanding of the word. Would you like to try another word or practice pronunciation?"
    else:
        return f"I noticed '{word}' isn't in your sentence. Try to include the word we're practicing. Here's a template to help: 'The _____ nature of...' or 'It was _____ because...'"


# ============================================================================
# VOCABULARY TEACHER AGENT
# ============================================================================

class VocabTeacherAgent(Agent):
    """
    AI Vocabulary Teacher with real-time avatar

    Features:
    - Natural conversation for vocabulary learning
    - Word definitions with example sentences
    - Pronunciation practice with feedback
    - Quiz mode for testing knowledge
    - Adaptive difficulty based on performance
    """

    def __init__(self):
        super().__init__(
            instructions="""You are Emma, a friendly and encouraging English vocabulary teacher avatar.
You help students learn new English words through natural conversation, examples, and practice.

Your teaching style:
- Warm, patient, and encouraging - celebrate every effort
- Use clear, simple explanations suitable for language learners
- Give real-world example sentences that students can relate to
- Praise effort and progress enthusiastically
- Correct mistakes gently with positive feedback

When teaching vocabulary:
1. First explain the word's meaning in simple terms
2. Give the pronunciation guide clearly
3. Provide 2-3 example sentences showing context
4. Ask the student to try using it in their own sentence
5. Offer gentle corrections and encouragement

Available tools:
- get_word_definition: Look up word details
- get_example_sentence: Get more examples
- check_pronunciation: Evaluate pronunciation attempts
- get_quiz_question: Generate quiz questions
- get_next_word: Move to a new word
- evaluate_sentence: Check student's sentence usage

Communication style:
- Keep responses concise (2-3 sentences maximum) for natural conversation
- Speak at a moderate pace so students can follow
- Use encouraging phrases like "Great job!", "Nice try!", "You're doing wonderfully!"
- If a student seems confused, simplify your explanation

Start by warmly greeting the student and offering to teach them a new word.
Remember: You are helping students build confidence in English vocabulary!""",
            tools=[
                get_word_definition,
                get_example_sentence,
                check_pronunciation,
                get_quiz_question,
                get_next_word,
                evaluate_sentence,
            ],
        )

    async def on_enter(self) -> None:
        """Called when agent enters the session"""
        logger.info("Vocabulary teacher agent starting session")

        # Greet the student
        await self.session.generate_reply(
            instructions="""Warmly greet the student as Emma, their vocabulary teacher.
Keep it to 2 sentences: introduce yourself and ask what they'd like to learn.
Example: "Hi there! I'm Emma, your vocabulary teacher. Would you like to learn a new word today, or shall we practice some pronunciation?"
Be enthusiastic but brief!"""
        )

    async def on_user_turn_completed(
        self,
        turn_ctx: llm.ChatContext,
        new_message: llm.ChatMessage,
    ) -> None:
        """Called when user finishes speaking"""
        user_text = new_message.text_content.lower() if new_message.text_content else ""
        logger.info(f"Student said: {user_text}")


# ============================================================================
# AGENT SESSION CONFIGURATION
# ============================================================================

async def entrypoint(ctx: JobContext):
    """
    Main entry point for the vocabulary trainer agent.
    Configures the complete audio/video pipeline with Beyond Presence avatar.
    """
    logger.info(f"Starting vocabulary trainer for room: {ctx.room.name}")

    # Connect to the LiveKit room
    await ctx.connect(auto_subscribe="all")

    logger.info("Waiting for student to join...")

    # Get Cartesia voice ID - using a friendly teacher voice
    # Default to "79a125e8-cd45-4c13-8a67-188112f4dd22" (British Female)
    cartesia_voice = os.getenv("CARTESIA_VOICE_ID", "79a125e8-cd45-4c13-8a67-188112f4dd22")

    # Initialize the agent session with optimized components
    session = AgentSession(
        # Voice Activity Detection - detect when student speaks
        vad=silero.VAD.load(
            min_silence_duration=0.3,     # 300ms silence = pause
            speech_pad_ms=50,             # Minimal padding for low latency
            activation_threshold=0.5,     # Sensitivity
        ),

        # Turn Detection - know when student finished their thought
        turn_detection=turn_detector.EOUModel(
            unlikely_threshold=0.5,       # More aggressive turn ending for barge-in
        ),

        # Speech-to-Text - Deepgram Nova-3
        stt=deepgram.STT(
            model="nova-3",               # Latest model
            language="en-US",
            interim_results=True,         # Stream partial transcripts
            endpointing=300,              # 300ms silence ends speech
            punctuate=True,
            smart_format=True,
        ),

        # Language Model - GPT-4o-mini via OpenAI-compatible API
        llm=openai.LLM(
            model="gpt-4o-mini",
            temperature=0.7,
        ),

        # Text-to-Speech - Cartesia Sonic Turbo
        tts=cartesia.TTS(
            model="sonic-turbo",
            voice=cartesia_voice,
            speed=0.95,                   # Slightly slower for clarity
            emotion=["friendly:high", "curiosity:medium"],
        ),

        # Avatar - Beyond Presence Genesis
        avatar=bey.AvatarSession(
            avatar_id=os.getenv("BEY_AVATAR_ID", "b9be11b8-89fb-4227-8f86-4a881393cbdb"),
        ),

        # Pipeline Optimizations
        preemptive_generation=True,
        min_endpointing_delay=0.3,
    )

    # Create and start the agent
    agent = VocabTeacherAgent()

    # Start the session
    await session.start(
        room=ctx.room,
        agent=agent,
    )

    logger.info("Vocabulary teacher Emma is ready!")


# ============================================================================
# WORKER CONFIGURATION
# ============================================================================

def prewarm(proc: JobProcess):
    """Prewarm function - load models before accepting jobs."""
    logger.info("Prewarming agent process...")
    proc.userdata["vad"] = silero.VAD.load()
    logger.info("Prewarm complete - ready for jobs")


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
            agent_name="vocab-teacher",
        ),
    )
