import { Tool } from '../types';
import {
  ShieldCheck,
  MessageSquare,
  Image,
  FileText,
  Code,
  Languages,
  Wrench,
  Sparkles,
  Smile,
  Tags,
  LayoutDashboard,
  Bot,
  Rss,
  Folder
} from 'lucide-react';

import KeyVerifier from '../pages/KeyVerifier';
import AdminPanel from '../pages/AdminPanel';
import Dashboard from '../pages/Dashboard';
import PromptPlayground from '../pages/PromptPlayground';
import ChatInterface from '../pages/ChatInterface';
import ImageGenerator from '../pages/ImageGenerator';
import TextSummarizer from '../pages/TextSummarizer';
import JsonGenerator from '../pages/JsonGenerator';
import Translator from '../pages/Translator';
import CodeGenerator from '../pages/CodeGenerator';
import ContentRewriter from '../pages/ContentRewriter';
import SentimentAnalysis from '../pages/SentimentAnalysis';
import KeywordExtractor from '../pages/KeywordExtractor';
import BlogIndex from '../pages/BlogIndex';
import FileManager from '../components/FileManager'; // Note: Using component directly as a page


export const tools: Tool[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    component: Dashboard,
    description: 'Welcome to the AI Framework.',
  },
  {
    id: 'blog',
    name: 'Blog',
    icon: Rss,
    component: BlogIndex,
    description: 'Read our latest articles and updates.',
  },
  {
    id: 'key-verifier',
    name: 'API Key Verifier',
    icon: ShieldCheck,
    component: KeyVerifier,
    description: 'Validate API keys for various AI services.',
  },
  {
    id: 'prompt-playground',
    name: 'Prompt Playground',
    icon: Bot,
    component: PromptPlayground,
    description: 'Experiment with different text prompts.',
  },
  {
    id: 'chat-interface',
    name: 'Chat Interface',
    icon: MessageSquare,
    component: ChatInterface,
    description: 'Have a conversation with an AI model.',
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    icon: Image,
    component: ImageGenerator,
    description: 'Create images from text descriptions.',
  },
  {
    id: 'text-summarizer',
    name: 'Text Summarizer',
    icon: FileText,
    component: TextSummarizer,
    description: 'Summarize long blocks of text.',
  },
  {
    id: 'json-generator',
    name: 'JSON Generator',
    icon: Code,
    component: JsonGenerator,
    description: 'Generate JSON objects from natural language.',
  },
  {
    id: 'translator',
    name: 'Language Translator',
    icon: Languages,
    component: Translator,
    description: 'Translate text between languages.',
  },
  {
    id: 'code-generator',
    name: 'Code Generator',
    icon: Code,
    component: CodeGenerator,
    description: 'Generate code in various languages.',
  },
  {
    id: 'content-rewriter',
    name: 'Content Rewriter',
    icon: Sparkles,
    component: ContentRewriter,
    description: 'Paraphrase and rewrite your content.',
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    icon: Smile,
    component: SentimentAnalysis,
    description: 'Analyze the sentiment of a piece of text.',
  },
  {
    id: 'keyword-extractor',
    name: 'Keyword Extractor',
    icon: Tags,
    component: KeywordExtractor,
    description: 'Extract key terms from your text.',
  },
  {
    id: 'admin',
    name: 'Admin Panel',
    icon: Wrench,
    component: AdminPanel,
    description: 'Manage site settings and providers.',
  },
];