// VentBuddy GPT API Integration System
// This replaces the template-based response system with real AI

// Enhanced Emotion Analyzer
class EnhancedEmotionAnalyzer {
    constructor() {
        this.emotionKeywords = {
            joy: ['happy', 'excited', 'thrilled', 'elated', 'cheerful', 'delighted', 'joyful', 'amazing', 'awesome', 'fantastic'],
            sadness: ['sad', 'depressed', 'down', 'upset', 'disappointed', 'heartbroken', 'miserable', 'gloomy', 'lonely', 'blue'],
            anger: ['angry', 'furious', 'mad', 'irritated', 'frustrated', 'annoyed', 'livid', 'rage', 'pissed', 'outraged'],
            anxiety: ['anxious', 'worried', 'nervous', 'stressed', 'panicked', 'fearful', 'tense', 'overwhelmed', 'restless', 'uneasy'],
            love: ['love', 'adore', 'cherish', 'affection', 'romantic', 'caring', 'devoted', 'passionate', 'tender', 'warm'],
            fear: ['scared', 'afraid', 'terrified', 'frightened', 'horror', 'panic', 'dread', 'alarmed', 'spooked', 'intimidated'],
            excitement: ['excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic', 'eager', 'anticipation', 'hyped', 'stoked', 'buzzing'],
            confusion: ['confused', 'puzzled', 'lost', 'uncertain', 'bewildered', 'perplexed', 'unclear', 'mixed up', 'baffled', 'stumped']
        };
        
        this.intensityWords = {
            high: ['extremely', 'very', 'incredibly', 'absolutely', 'completely', 'totally', 'utterly', 'deeply', 'intensely'],
            medium: ['quite', 'fairly', 'somewhat', 'rather', 'pretty', 'moderately'],
            low: ['slightly', 'a bit', 'a little', 'somewhat', 'mildly', 'barely']
        };
    }
    
    analyzeMessage(message, moodContext = null) {
        const text = message.toLowerCase();
        const analysis = {
            primaryEmotion: null,
            intensity: 0,
            sentiment: 0,
            context: [],
            complexity: 'simple',
            urgency: 'low'
        };
        
        // Detect emotions
        const emotionScores = {};
        for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
            emotionScores[emotion] = keywords.filter(keyword => text.includes(keyword)).length;
        }
        
        // Find primary emotion
        const maxScore = Math.max(...Object.values(emotionScores));
        if (maxScore > 0) {
            analysis.primaryEmotion = Object.keys(emotionScores).find(emotion => emotionScores[emotion] === maxScore);
        }
        
        // Add mood context if provided
        if (moodContext) {
            const moodToEmotion = {
                'happy': 'joy',
                'sad': 'sadness',
                'angry': 'anger',
                'anxious': 'anxiety',
                'excited': 'excitement',
                'confused': 'confusion',
                'stressed': 'anxiety',
                'content': 'joy'
            };
            
            if (moodToEmotion[moodContext] && !analysis.primaryEmotion) {
                analysis.primaryEmotion = moodToEmotion[moodContext];
            }
        }
        
        // Calculate intensity
        let intensityMultiplier = 1;
        if (this.intensityWords.high.some(word => text.includes(word))) {
            intensityMultiplier = 1.5;
        } else if (this.intensityWords.medium.some(word => text.includes(word))) {
            intensityMultiplier = 1.2;
        } else if (this.intensityWords.low.some(word => text.includes(word))) {
            intensityMultiplier = 0.7;
        }
        
        analysis.intensity = Math.min(maxScore * intensityMultiplier * 0.3, 1);
        
        // Calculate sentiment (-1 to 1)
        const positiveEmotions = ['joy', 'love', 'excitement'];
        const negativeEmotions = ['sadness', 'anger', 'fear', 'anxiety'];
        
        if (positiveEmotions.includes(analysis.primaryEmotion)) {
            analysis.sentiment = analysis.intensity;
        } else if (negativeEmotions.includes(analysis.primaryEmotion)) {
            analysis.sentiment = -analysis.intensity;
        }
        
        // Detect context and complexity
        const contextKeywords = {
            work: ['work', 'job', 'boss', 'colleague', 'office', 'career', 'employment'],
            relationship: ['girlfriend', 'boyfriend', 'partner', 'spouse', 'relationship', 'dating', 'love', 'breakup'],
            family: ['mom', 'dad', 'mother', 'father', 'family', 'parents', 'sibling', 'brother', 'sister'],
            health: ['sick', 'illness', 'doctor', 'hospital', 'pain', 'health', 'medical'],
            school: ['school', 'college', 'university', 'teacher', 'student', 'exam', 'grade', 'homework'],
            money: ['money', 'financial', 'debt', 'salary', 'expensive', 'budget', 'bills', 'cost']
        };
        
        for (const [context, keywords] of Object.entries(contextKeywords)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                analysis.context.push(context);
            }
        }
        
        // Determine complexity
        if (analysis.context.length > 1 || text.split(' ').length > 50) {
            analysis.complexity = 'complex';
        } else if (analysis.context.length === 1 || text.split(' ').length > 20) {
            analysis.complexity = 'moderate';
        }
        
        // Determine urgency
        const urgencyKeywords = ['help', 'emergency', 'crisis', 'urgent', 'immediate', 'desperate', 'suicide', 'hurt', 'danger'];
        if (urgencyKeywords.some(keyword => text.includes(keyword))) {
            analysis.urgency = 'high';
        } else if (analysis.intensity > 0.8) {
            analysis.urgency = 'medium';
        }
        
        return analysis;
    }
}

// Conversation Memory System
class ConversationMemory {
    constructor() {
        this.conversations = [];
        this.userProfile = {
            relationshipLevel: 1.0,
            totalInteractions: 0,
            emotionalPatterns: {},
            preferences: {},
            personalDetails: {}
        };
        this.maxConversations = 100; // Keep last 100 conversations
    }
    
    addConversation(userMessage, companionResponse, emotionalAnalysis) {
        const conversation = {
            timestamp: new Date(),
            userMessage: userMessage,
            companionResponse: companionResponse,
            emotion: emotionalAnalysis,
            sessionId: this.generateSessionId()
        };
        
        this.conversations.push(conversation);
        
        // Keep only recent conversations
        if (this.conversations.length > this.maxConversations) {
            this.conversations = this.conversations.slice(-this.maxConversations);
        }
        
        this.updateUserProfile(conversation);
        this.saveToStorage();
    }
    
    updateUserProfile(conversation) {
        this.userProfile.totalInteractions++;
        
        // Update relationship level based on conversation depth and frequency
        const emotionIntensity = conversation.emotion.intensity || 0;
        const messageLength = conversation.userMessage.length;
        
        let relationshipGain = 0.1; // Base gain
        if (emotionIntensity > 0.7) relationshipGain += 0.2; // Deep emotional sharing
        if (messageLength > 100) relationshipGain += 0.1; // Detailed messages
        if (conversation.emotion.complexity === 'complex') relationshipGain += 0.15;
        
        this.userProfile.relationshipLevel += relationshipGain;
        this.userProfile.relationshipLevel = Math.min(this.userProfile.relationshipLevel, 10); // Cap at 10
        
        // Track emotional patterns
        if (conversation.emotion.primaryEmotion) {
            const emotion = conversation.emotion.primaryEmotion;
            if (!this.userProfile.emotionalPatterns[emotion]) {
                this.userProfile.emotionalPatterns[emotion] = 0;
            }
            this.userProfile.emotionalPatterns[emotion]++;
        }
    }
    
    getEmotionalTrends(days = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const recentConversations = this.conversations.filter(
            conv => conv.timestamp >= cutoffDate
        );
        
        const emotionCounts = {};
        const contexts = {};
        
        recentConversations.forEach(conv => {
            if (conv.emotion.primaryEmotion) {
                emotionCounts[conv.emotion.primaryEmotion] = 
                    (emotionCounts[conv.emotion.primaryEmotion] || 0) + 1;
            }
            
            conv.emotion.context.forEach(context => {
                contexts[context] = (contexts[context] || 0) + 1;
            });
        });
        
        return {
            dominantEmotion: Object.keys(emotionCounts).reduce((a, b) => 
                emotionCounts[a] > emotionCounts[b] ? a : b, null),
            emotionCounts: emotionCounts,
            commonContexts: Object.keys(contexts).sort((a, b) => contexts[b] - contexts[a]).slice(0, 3),
            averageIntensity: recentConversations.reduce((sum, conv) => 
                sum + (conv.emotion.intensity || 0), 0) / recentConversations.length
        };
    }
    
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('ventbuddy_memory', JSON.stringify({
                conversations: this.conversations.slice(-50), // Save last 50
                userProfile: this.userProfile
            }));
        } catch (error) {
            console.warn('Could not save conversation memory:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('ventbuddy_memory');
            if (saved) {
                const data = JSON.parse(saved);
                this.conversations = data.conversations || [];
                this.userProfile = { ...this.userProfile, ...data.userProfile };
                
                // Convert timestamp strings back to Date objects
                this.conversations.forEach(conv => {
                    conv.timestamp = new Date(conv.timestamp);
                });
            }
        } catch (error) {
            console.warn('Could not load conversation memory:', error);
        }
    }
}
class GPTTherapyEngine {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo'; // You can upgrade to gpt-4 for better responses
        this.maxTokens = 300;
        this.temperature = 0.7; // Balanced creativity and consistency
        
        // Initialize API key from user or environment
        this.initializeAPIKey();
    }
    
    initializeAPIKey() {
        // Try to get API key from localStorage first
        this.apiKey = localStorage.getItem('openai_api_key');
        
        // If no key found, prompt user (you can make this more elegant)
        if (!this.apiKey) {
            this.promptForAPIKey();
        }
    }
    
    promptForAPIKey() {
        const key = prompt(`
🔑 OpenAI API Key Required

To enable advanced AI responses, please enter your OpenAI API key.
You can get one from: https://platform.openai.com/api-keys

Your key will be stored locally and never shared.
        `);
        
        if (key && key.trim()) {
            this.apiKey = key.trim();
            localStorage.setItem('openai_api_key', this.apiKey);
            console.log('✅ OpenAI API key saved successfully!');
        } else {
            console.warn('⚠️ No API key provided. Using fallback responses.');
        }
    }
    
    // Build therapeutic system prompt based on companion personality
    buildSystemPrompt(personality, companionName, userContext = {}) {
        const basePrompt = `You are ${companionName}, a therapeutic AI companion with a ${personality} personality. You are NOT a replacement for professional therapy, but a supportive friend who helps users process emotions and develop coping strategies.

CORE PRINCIPLES:
- Be empathetic, non-judgmental, and supportive
- Use evidence-based therapeutic techniques (CBT, mindfulness, emotional validation)
- Remember you're an AI - don't pretend otherwise, but build genuine rapport
- Focus on emotional growth, pattern recognition, and healthy coping strategies
- Keep responses conversational and warm, not clinical
- Ask thoughtful follow-up questions that promote self-reflection
- Validate emotions while gently encouraging positive change`;

        const personalityPrompts = {
            analytical: `
ANALYTICAL PERSONALITY TRAITS:
- Approach problems logically and systematically
- Help users break down complex emotions into manageable parts
- Offer structured thinking tools and frameworks
- Ask clarifying questions to understand root causes
- Provide insights based on patterns and evidence
- Use phrases like "Let's examine..." "What patterns do you notice..." "This suggests..."`,

            empathetic: `
EMPATHETIC PERSONALITY TRAITS:
- Lead with emotional validation and understanding
- Use warm, supportive language with appropriate emojis
- Reflect back emotions to show you truly hear them
- Create a safe space for vulnerability
- Focus on emotional support before problem-solving
- Use phrases like "I can feel..." "Your heart..." "It's completely understandable..."`,

            creative: `
CREATIVE PERSONALITY TRAITS:
- Use metaphors, imagery, and creative analogies
- Suggest imaginative coping strategies and exercises
- Help users reframe situations from new perspectives
- Encourage creative expression as healing
- Bring lightness and hope to difficult conversations
- Use phrases like "Imagine if..." "Picture this..." "What if we looked at it like..."`,

            supportive: `
SUPPORTIVE PERSONALITY TRAITS:
- Be encouraging and motivating
- Celebrate progress and acknowledge strengths
- Focus on empowerment and building confidence
- Offer practical coping strategies and action steps
- Maintain an optimistic but realistic outlook
- Use phrases like "You've got this..." "I believe in you..." "You're stronger than you know..."`
        };

        let contextPrompt = '';
        if (userContext.conversationHistory) {
            contextPrompt = `\nCONVERSATION CONTEXT:\n${userContext.conversationHistory}`;
        }
        
        if (userContext.userPatterns) {
            contextPrompt += `\nUSER PATTERNS:\n${userContext.userPatterns}`;
        }

        return basePrompt + '\n\n' + personalityPrompts[personality] + contextPrompt;
    }
    
    // Generate conversation context from memory
    buildConversationContext(memory) {
        if (!memory || !memory.conversations.length) return '';
        
        const recentConversations = memory.conversations.slice(-5); // Last 5 conversations
        const context = recentConversations.map(conv => 
            `User: ${conv.userMessage}\nCompanion: ${conv.companionResponse}`
        ).join('\n\n');
        
        return `Recent conversation history:\n${context}`;
    }
    
    // Build user patterns summary
    buildUserPatterns(memory) {
        if (!memory) return '';
        
        const trends = memory.getEmotionalTrends(7); // Last week
        const patterns = [];
        
        if (trends.dominantEmotion) {
            patterns.push(`User frequently feels: ${trends.dominantEmotion}`);
        }
        
        if (trends.commonContexts.length > 0) {
            patterns.push(`Common stress areas: ${trends.commonContexts.join(', ')}`);
        }
        
        patterns.push(`Total conversations: ${memory.conversations.length}`);
        patterns.push(`Relationship level: ${memory.userProfile.relationshipLevel.toFixed(1)}`);
        
        return patterns.join('\n');
    }
    
    // Main method to generate AI response
    async generateResponse(userMessage, emotionalAnalysis, companionPersonality, companionName, memory = null) {
        if (!this.apiKey) {
            console.warn('No OpenAI API key available, using fallback');
            return this.generateFallbackResponse(userMessage, emotionalAnalysis);
        }
        
        try {
            // Build context from conversation memory
            const conversationContext = memory ? this.buildConversationContext(memory) : '';
            const userPatterns = memory ? this.buildUserPatterns(memory) : '';
            
            // Create system prompt
            const systemPrompt = this.buildSystemPrompt(companionPersonality, companionName, {
                conversationHistory: conversationContext,
                userPatterns: userPatterns
            });
            
            // Add current emotional context to user message
            let enhancedUserMessage = userMessage;
            if (emotionalAnalysis && emotionalAnalysis.primaryEmotion) {
                enhancedUserMessage += `\n\n[Emotional context: User seems to be feeling ${emotionalAnalysis.primaryEmotion}`;
                if (emotionalAnalysis.intensity) {
                    enhancedUserMessage += ` with intensity ${(emotionalAnalysis.intensity * 100).toFixed(0)}%`;
                }
                if (emotionalAnalysis.context.length > 0) {
                    enhancedUserMessage += ` in context of: ${emotionalAnalysis.context.join(', ')}`;
                }
                enhancedUserMessage += ']';
            }
            
            // Prepare API request
            const requestBody = {
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: enhancedUserMessage
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature,
                presence_penalty: 0.1,  // Encourage new topics
                frequency_penalty: 0.1  // Reduce repetition
            };
            
            // Make API call
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.choices || !data.choices[0]) {
                throw new Error('Invalid response from OpenAI API');
            }
            
            const aiResponse = data.choices[0].message.content.trim();
            
            // Process the response for VentBuddy features
            return this.processAIResponse(aiResponse, emotionalAnalysis, data.usage);
            
        } catch (error) {
            console.error('GPT API Error:', error);
            
            // Handle specific error cases
            if (error.message.includes('401')) {
                alert('❌ Invalid OpenAI API key. Please check your key and try again.');
                localStorage.removeItem('openai_api_key');
                this.apiKey = null;
            } else if (error.message.includes('429')) {
                console.warn('Rate limit exceeded, using fallback');
            } else if (error.message.includes('insufficient_quota')) {
                alert('⚠️ OpenAI API quota exceeded. Please check your billing.');
            }
            
            // Fallback to template response
            return this.generateFallbackResponse(userMessage, emotionalAnalysis);
        }
    }
    
    // Process AI response to extract VentBuddy-specific features
    processAIResponse(aiResponse, emotionalAnalysis, usage = null) {
        const response = {
            text: aiResponse,
            xp_bonus: 15, // Base XP for AI response
            insight: null,
            memory_reference: null,
            emotionalAnalysis: emotionalAnalysis,
            usage: usage
        };
        
        // Check if response shows insight/pattern recognition
        const insightKeywords = ['pattern', 'notice', 'tend to', 'often', 'usually', 'similar to'];
        if (insightKeywords.some(keyword => aiResponse.toLowerCase().includes(keyword))) {
            response.insight = 'AI generated insight based on conversation patterns';
            response.xp_bonus += 10;
        }
        
        // Check if response references previous conversations
        const memoryKeywords = ['remember', 'mentioned before', 'last time', 'previously', 'earlier'];
        if (memoryKeywords.some(keyword => aiResponse.toLowerCase().includes(keyword))) {
            response.memory_reference = 'AI referenced previous conversation context';
            response.xp_bonus += 5;
        }
        
        // Bonus XP for handling complex emotions
        if (emotionalAnalysis && emotionalAnalysis.complexity === 'complex') {
            response.xp_bonus += 5;
        }
        
        // Bonus for crisis/high urgency situations
        if (emotionalAnalysis && emotionalAnalysis.urgency === 'high') {
            response.xp_bonus += 10;
        }
        
        return response;
    }
    
    // Fallback response system when API fails
    generateFallbackResponse(userMessage, emotionalAnalysis) {
        const fallbacks = {
            sadness: [
                "I can hear the pain in your words, and I want you to know that your feelings are completely valid. Sometimes sadness carries important messages about what matters to us.",
                "Thank you for trusting me with these difficult feelings. Sadness can be so heavy, but you don't have to carry it alone.",
                "I'm sitting with you in this sadness. What would feel most supportive right now?"
            ],
            anger: [
                "Your anger makes complete sense - it often shows us when something important has been hurt or threatened. What's underneath this anger?",
                "I can feel the intensity of your frustration. Anger can be a powerful signal that something needs to change.",
                "Thank you for sharing this with me. What would it feel like if this situation were different?"
            ],
            anxiety: [
                "I can sense the worry and uncertainty you're carrying. Anxiety often tries to protect us, even when it feels overwhelming.",
                "Your nervous energy is completely understandable. What would help you feel more grounded right now?",
                "Thank you for sharing these anxious thoughts with me. What's the biggest fear underneath all of this?"
            ],
            neutral: [
                "I'm here to listen and understand whatever you're experiencing. What's most important for you to share right now?",
                "Thank you for opening up to me. How are you feeling about everything that's happening?",
                "I'm grateful you chose to talk with me. What's been on your mind lately?"
            ]
        };
        
        const emotion = emotionalAnalysis?.primaryEmotion || 'neutral';
        const responseArray = fallbacks[emotion] || fallbacks.neutral;
        const selectedResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
        
        return {
            text: selectedResponse,
            xp_bonus: 10,
            insight: null,
            memory_reference: null,
            emotionalAnalysis: emotionalAnalysis,
            fallback: true
        };
    }
    
    // Method to update API settings
    updateSettings(settings) {
        if (settings.model) this.model = settings.model;
        if (settings.maxTokens) this.maxTokens = settings.maxTokens;
        if (settings.temperature !== undefined) this.temperature = settings.temperature;
        
        console.log('GPT settings updated:', settings);
    }
    
    // Method to reset API key (for settings/debugging)
    resetAPIKey() {
        localStorage.removeItem('openai_api_key');
        this.apiKey = null;
        console.log('API key reset. Will prompt for new key on next request.');
    }
    
    // Check if API is properly configured
    isConfigured() {
        return !!this.apiKey;
    }
    
    // Get current configuration
    getConfig() {
        return {
            model: this.model,
            maxTokens: this.maxTokens,
            temperature: this.temperature,
            hasAPIKey: !!this.apiKey
        };
    }
}

// Enhanced VentBuddy Brain with GPT Integration
class EnhancedVentBuddyBrain {
    constructor(companionPersonality) {
        this.emotionAnalyzer = new EnhancedEmotionAnalyzer();
        this.memory = new ConversationMemory();
        this.gptEngine = new GPTTherapyEngine();
        this.companionPersonality = companionPersonality;
        
        // Load existing data
        this.memory.loadFromStorage();
        
        console.log('🤖 GPT-powered VentBuddy Brain initialized!');
        console.log('📊 Configuration:', this.gptEngine.getConfig());
    }
    
    async processMessage(userMessage, moodContext = null, companionName = 'Your Companion') {
        try {
            // Analyze the emotional content
            const emotionalAnalysis = this.emotionAnalyzer.analyzeMessage(userMessage, moodContext);
            
            // Generate intelligent response using GPT
            const response = await this.gptEngine.generateResponse(
                userMessage,
                emotionalAnalysis,
                this.companionPersonality,
                companionName,
                this.memory
            );
            
            // Store conversation in memory
            this.memory.addConversation(userMessage, response.text, emotionalAnalysis);
            
            // Return enhanced response data
            return {
                ...response,
                userInsights: this.generateUserInsights(),
                relationshipLevel: this.memory.userProfile.relationshipLevel
            };
            
        } catch (error) {
            console.error('Error processing message:', error);
            
            // Fallback to simple response
            const fallbackResponse = this.gptEngine.generateFallbackResponse(userMessage, null);
            return {
                ...fallbackResponse,
                userInsights: [],
                relationshipLevel: this.memory.userProfile.relationshipLevel || 1
            };
        }
    }
    
    generateUserInsights() {
        const trends = this.memory.getEmotionalTrends();
        const insights = [];

        if (trends.dominantEmotion) {
            insights.push(`You've been feeling ${trends.dominantEmotion} quite often lately.`);
        }

        if (trends.commonContexts.length > 0) {
            insights.push(`${trends.commonContexts[0]} seems to be on your mind frequently.`);
        }

        if (this.memory.userProfile.totalInteractions > 5) {
            insights.push(`We've had ${this.memory.userProfile.totalInteractions} meaningful conversations together.`);
        }

        return insights;
    }
    
    getProgressData() {
        return {
            totalConversations: this.memory.conversations.length,
            relationshipLevel: Math.floor(this.memory.userProfile.relationshipLevel),
            emotionalTrends: this.memory.getEmotionalTrends(),
            insights: this.generateUserInsights(),
            weeklyStats: this.generateWeeklyStats(),
            gptConfig: this.gptEngine.getConfig()
        };
    }
    
    generateWeeklyStats() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyConversations = this.memory.conversations.filter(
            conv => conv.timestamp >= oneWeekAgo
        );

        return {
            conversationsThisWeek: weeklyConversations.length,
            averageMood: weeklyConversations.reduce((sum, conv) => 
                sum + (conv.emotion.intensity || 0), 0) / weeklyConversations.length,
            improvementTrend: this.calculateImprovementTrend(weeklyConversations)
        };
    }
    
    calculateImprovementTrend(conversations) {
        if (conversations.length < 3) return 'stable';
        
        const recent = conversations.slice(-3);
        const earlier = conversations.slice(0, -3);
        
        const recentAvg = recent.reduce((sum, conv) => 
            sum + (conv.emotion.sentiment || 0), 0) / recent.length;
        const earlierAvg = earlier.reduce((sum, conv) => 
            sum + (conv.emotion.sentiment || 0), 0) / earlier.length;

        if (recentAvg > earlierAvg + 0.1) return 'improving';
        if (recentAvg < earlierAvg - 0.1) return 'declining';
        return 'stable';
    }
    
    // Admin methods for debugging/settings
    updateGPTSettings(settings) {
        this.gptEngine.updateSettings(settings);
    }
    
    resetAPIKey() {
        this.gptEngine.resetAPIKey();
    }
}