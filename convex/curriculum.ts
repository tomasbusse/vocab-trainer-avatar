import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Seed initial curriculum data
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("curriculum").first();
    if (existing) return { message: "Already seeded" };

    // Beginner Daily Vocabulary
    await ctx.db.insert("curriculum", {
      name: "Essential Daily Words",
      description: "Common words for everyday conversations",
      level: "beginner",
      category: "daily",
      wordCount: 5,
      isActive: true,
      createdAt: Date.now(),
      words: [
        {
          word: "accomplish",
          definition: "to succeed in doing or completing something",
          pronunciation: "uh-KOM-plish",
          partOfSpeech: "verb",
          examples: [
            "She accomplished her goal of running a marathon.",
            "What do you hope to accomplish today?",
            "With hard work, you can accomplish anything.",
          ],
          synonyms: ["achieve", "complete", "fulfill", "attain"],
          etymology: "From Latin 'accomplere' - to fill up, complete",
        },
        {
          word: "essential",
          definition: "absolutely necessary; extremely important",
          pronunciation: "ih-SEN-shuhl",
          partOfSpeech: "adjective",
          examples: [
            "Water is essential for life.",
            "Good communication is essential in any relationship.",
            "These are the essential items for the trip.",
          ],
          synonyms: ["necessary", "vital", "crucial", "fundamental"],
          etymology: "From Latin 'essentia' - being, essence",
        },
        {
          word: "frequent",
          definition: "happening or occurring often",
          pronunciation: "FREE-kwuhnt",
          partOfSpeech: "adjective",
          examples: [
            "Frequent exercise is good for your health.",
            "We have frequent meetings on Mondays.",
            "She is a frequent visitor to the library.",
          ],
          synonyms: ["regular", "common", "repeated", "recurrent"],
          etymology: "From Latin 'frequens' - crowded, repeated",
        },
        {
          word: "improve",
          definition: "to make or become better",
          pronunciation: "im-PROOV",
          partOfSpeech: "verb",
          examples: [
            "Practice will help improve your skills.",
            "The weather is expected to improve tomorrow.",
            "We need to improve our customer service.",
          ],
          synonyms: ["enhance", "develop", "upgrade", "advance"],
          etymology: "From Latin 'in' + 'probus' - into profit",
        },
        {
          word: "obvious",
          definition: "easily seen, recognized, or understood; clear",
          pronunciation: "OB-vee-uhs",
          partOfSpeech: "adjective",
          examples: [
            "The answer was obvious once I thought about it.",
            "It's obvious that she loves her job.",
            "He made some obvious mistakes in his essay.",
          ],
          synonyms: ["clear", "evident", "apparent", "plain"],
          etymology: "From Latin 'obvius' - in the way, presenting itself",
        },
      ],
    });

    // Intermediate Academic Vocabulary
    await ctx.db.insert("curriculum", {
      name: "Academic Excellence",
      description: "Words commonly used in academic settings and formal writing",
      level: "intermediate",
      category: "academic",
      wordCount: 5,
      isActive: true,
      createdAt: Date.now(),
      words: [
        {
          word: "analyze",
          definition: "to examine something in detail to understand it better",
          pronunciation: "AN-uh-lize",
          partOfSpeech: "verb",
          examples: [
            "Scientists analyze data to find patterns.",
            "Let's analyze the results of the experiment.",
            "The report analyzes market trends over five years.",
          ],
          synonyms: ["examine", "study", "investigate", "evaluate"],
          etymology: "From Greek 'analyein' - to break up, loosen",
        },
        {
          word: "comprehensive",
          definition: "including all or nearly all elements; complete and thorough",
          pronunciation: "kom-prih-HEN-siv",
          partOfSpeech: "adjective",
          examples: [
            "The book provides a comprehensive guide to cooking.",
            "Students must pass a comprehensive exam.",
            "We need a comprehensive plan for the project.",
          ],
          synonyms: ["complete", "thorough", "exhaustive", "extensive"],
          etymology: "From Latin 'comprehendere' - to grasp, understand",
        },
        {
          word: "hypothesis",
          definition: "a proposed explanation made on limited evidence as a starting point",
          pronunciation: "hy-POTH-uh-sis",
          partOfSpeech: "noun",
          examples: [
            "The scientist tested her hypothesis through experiments.",
            "Our hypothesis was proven correct.",
            "You need to form a hypothesis before conducting research.",
          ],
          synonyms: ["theory", "assumption", "proposition", "conjecture"],
          etymology: "From Greek 'hypothesis' - foundation, supposition",
        },
        {
          word: "significant",
          definition: "important or large enough to be noticed or have an effect",
          pronunciation: "sig-NIF-ih-kuhnt",
          partOfSpeech: "adjective",
          examples: [
            "There was a significant increase in sales.",
            "This is a significant achievement for our team.",
            "The data shows significant differences between groups.",
          ],
          synonyms: ["important", "notable", "meaningful", "substantial"],
          etymology: "From Latin 'significare' - to signify",
        },
        {
          word: "synthesize",
          definition: "to combine different ideas, elements, or things into a coherent whole",
          pronunciation: "SIN-thuh-size",
          partOfSpeech: "verb",
          examples: [
            "The essay synthesizes research from multiple sources.",
            "Plants synthesize glucose from sunlight.",
            "We need to synthesize all the feedback into a report.",
          ],
          synonyms: ["combine", "integrate", "merge", "unify"],
          etymology: "From Greek 'synthesis' - composition, putting together",
        },
      ],
    });

    // Advanced Business Vocabulary
    await ctx.db.insert("curriculum", {
      name: "Business Professional",
      description: "Sophisticated vocabulary for business and professional settings",
      level: "advanced",
      category: "business",
      wordCount: 5,
      isActive: true,
      createdAt: Date.now(),
      words: [
        {
          word: "paradigm",
          definition: "a typical example or pattern of something; a model",
          pronunciation: "PAIR-uh-dime",
          partOfSpeech: "noun",
          examples: [
            "The internet created a new paradigm for communication.",
            "We need a paradigm shift in how we approach this problem.",
            "This represents a paradigm of excellent customer service.",
          ],
          synonyms: ["model", "pattern", "example", "framework"],
          etymology: "From Greek 'paradeigma' - pattern, example",
        },
        {
          word: "leverage",
          definition: "to use something to maximum advantage",
          pronunciation: "LEV-er-ij",
          partOfSpeech: "verb",
          examples: [
            "We need to leverage our expertise in this market.",
            "The company leveraged technology to reduce costs.",
            "She leveraged her connections to get the interview.",
          ],
          synonyms: ["utilize", "exploit", "capitalize on", "harness"],
          etymology: "From Old French 'levier' - to raise",
        },
        {
          word: "synergy",
          definition: "the interaction of elements that produces a combined effect greater than the sum of their parts",
          pronunciation: "SIN-er-jee",
          partOfSpeech: "noun",
          examples: [
            "The merger created synergy between the two companies.",
            "There's great synergy in this team.",
            "We're looking for synergy between departments.",
          ],
          synonyms: ["collaboration", "cooperation", "teamwork", "harmony"],
          etymology: "From Greek 'synergia' - working together",
        },
        {
          word: "mitigate",
          definition: "to make less severe, serious, or painful",
          pronunciation: "MIT-ih-gate",
          partOfSpeech: "verb",
          examples: [
            "We must mitigate the risks of this project.",
            "The insurance will help mitigate financial losses.",
            "Trees help mitigate the effects of pollution.",
          ],
          synonyms: ["reduce", "lessen", "alleviate", "diminish"],
          etymology: "From Latin 'mitigare' - to soften",
        },
        {
          word: "unprecedented",
          definition: "never done or known before",
          pronunciation: "un-PRES-ih-den-tid",
          partOfSpeech: "adjective",
          examples: [
            "The company achieved unprecedented growth.",
            "We face unprecedented challenges in this era.",
            "This is an unprecedented situation requiring new solutions.",
          ],
          synonyms: ["unparalleled", "unmatched", "unique", "extraordinary"],
          etymology: "From Latin 'un-' (not) + 'praecedere' (to precede)",
        },
      ],
    });

    return { message: "Curriculum seeded successfully" };
  },
});

// Get all curriculum by level
export const getByLevel = query({
  args: { level: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("curriculum")
      .withIndex("by_level", (q) => q.eq("level", args.level))
      .collect();
  },
});

// Get curriculum by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("curriculum")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get all active curriculum
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const curriculum = await ctx.db.query("curriculum").collect();
    return curriculum.filter((c) => c.isActive);
  },
});

// Copy curriculum to a trainer's word list
export const copyToTrainer = mutation({
  args: {
    curriculumId: v.id("curriculum"),
    trainerId: v.id("trainers"),
  },
  handler: async (ctx, args) => {
    const curriculum = await ctx.db.get(args.curriculumId);
    if (!curriculum) throw new Error("Curriculum not found");

    return await ctx.db.insert("wordLists", {
      trainerId: args.trainerId,
      name: curriculum.name,
      category: curriculum.category,
      difficulty: curriculum.level,
      words: curriculum.words,
      isPrebuilt: true,
      createdAt: Date.now(),
    });
  },
});
