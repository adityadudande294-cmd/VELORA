export interface Translation {
  en: string;
  hi: string;
  mr: string;
}

export interface ArrayTranslation {
  en: string[];
  hi: string[];
  mr: string[];
}

export interface TimelineEvent {
  year: string;
  title: Translation;
  details: Translation;
}

export interface QAPair {
  q: string[];
  a: Translation;
}

export interface StoryDetail {
  id: string;
  image: string;
  title: Translation;
  subtitle: Translation;
  category: string;
  duration: string;
  difficulty: string;
  era: string;
  factStatus: string;
  factLabel: "Historically Verified" | "Supported by Scientific Evidence" | "Partially Verified" | "Active Research" | "Historical Legend" | "Folklore";
  learningObjectives: Translation[];
  knowledgeLevel: "Beginner" | "Intermediate" | "Advanced";
  relatedTopics: string[];
  synopsis: Translation;
  timeline: TimelineEvent[];
  narrative: {
    en: {
      intro: string[];
      background?: string[];
      main?: string[];
      evidence?: string[];
      scientific?: string[];
      historical?: string[];
      legends?: string[];
      facts?: string[];
      takeaways?: string[];
      conclusion?: string[];
    };
    hi: {
      intro: string[];
      background?: string[];
      main?: string[];
      evidence?: string[];
      scientific?: string[];
      historical?: string[];
      legends?: string[];
      facts?: string[];
      takeaways?: string[];
      conclusion?: string[];
    };
    mr: {
      intro: string[];
      background?: string[];
      main?: string[];
      evidence?: string[];
      scientific?: string[];
      historical?: string[];
      legends?: string[];
      facts?: string[];
      takeaways?: string[];
      conclusion?: string[];
    };
  };
  explanations: {
    eli10: Translation;
    simple: Translation;
    detailed: Translation;
    academic: Translation;
    revision: Translation;
  };
  qa: QAPair[];
  references: string[];
  author?: string;
  status?: "draft" | "published";
}

export interface UserSettings {
  lang: "en" | "hi" | "mr";
  speed: number;
  streak: number;
  lastReadDate: string | null;
  history: string[];
  favoriteCategory: string;
}

export interface BookmarkData {
  bookmarkedIds: string[];
  highlights: Record<string, number[]>; // storyId -> sentenceIndices[]
  notes: Record<string, Record<number, string>>; // storyId -> { sentenceIndex -> noteText }
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  settings: UserSettings;
  bookmarks: BookmarkData;
  streak: number;
  achievements: string[];
}

export type AmbientTheme = "library" | "space" | "ancient" | "calm";
export type ReaderTheme = "dark" | "amoled" | "paper" | "sepia" | "contrast";
export type ExplanationMode = "normal" | "eli10" | "simple" | "detailed" | "academic" | "revision";

export type IntroStage =
  | "gate"
  | "ambient-dark"
  | "particles-fadein"
  | "energy-ring"
  | "logo-assemble"
  | "narration"
  | "logo-fade"
  | "prep-loading"
  | "welcome"
  | "library-transition"
  | "finished";
