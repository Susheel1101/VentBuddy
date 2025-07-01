// Complete VentBuddy Application with GPT Integration

class VentBuddy {
    constructor() {
        this.companion = {
            name: 'Scholar',
            character: '🧑‍🎓',
            personality: 'analytical'
        };
        
        this.userData = this.loadUserData();
        this.currentMood = null;
        this.isProcessing = false;
        
        // Initialize the enhanced brain
        this.brain = null; // Will be initialized after companion creation
        
        this.personalities = {
            analytical: {
                name: 'Scholar',
                character: '🧑‍🎓',
                traits: ['Logical', 'Insightful', 'Patient']
            },
            empathetic: {
                name: 'Sage',
                character: '🧙‍♀️',
                traits: ['Empathetic', 'Understanding', 'Warm']
            },
            creative: {
                name: 'Spirit',
                character: '🧚‍♂️',
                traits: ['Creative', 'Inspiring', 'Imaginative']
            },
            supportive: {
                name: 'Guide',
                character: '🧝‍♀️',
                traits: ['Supportive', 'Encouraging', 'Motivating']
            }
        };
        
        this.achievements = [
            {
                id: 'first_chat',
                name: 'First Steps',
                description: 'Have your first conversation',
                icon: '🌟',
                requirement: 1,
                type: 'conversations'
            },
            {
                id: 'chatter',
                name: 'Chatterbox',
                description: 'Have 10 conversations',
                icon: '💬',
                requirement: 10,
                type: 'conversations'
            },
            {
                id: 'week_streak',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                icon: '🔥',
                requirement: 7,
                type: 'streak'
            },
            {
                id: 'level_master',
                name: 'Emotional Master',
                description: 'Reach Level 10 with your companion',
                icon: '🏆',
                requirement: 10,
                type: 'level'
            },
            {
                id: 'deep_sharer',
                name: 'Deep Sharer',
                description: 'Share something very personal',
                icon: '💎',
                requirement: 1,
                type: 'vulnerability'
            },
            {
                id: 'pattern_spotter',
                name: 'Pattern Spotter',
                description: 'Discover an emotional pattern',
                icon: '🔍',
                requirement: 1,
                type: 'insight'
            },
            {
                id: 'emotional_growth',
                name: 'Emotional Growth',
                description: 'Show improvement in mood trends',
                icon: '🌱',
                requirement: 1,
                type: 'improvement'
            },
            {
                id: 'ai_powered',
                name: 'AI Powered',
                description: 'Configure GPT integration',
                icon: '🤖',
                requirement: 1,
                type: 'ai_setup'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTabNavigation();
        this.updateUI();
    }
    
    loadUserData() {
        const defaultData = {
            totalConversations: 0,
            totalInsights: 0,
            streakDays: 1,
            moodScore: 85,
            crystalCount: 0,
            starCount: 0,
            companionLevel: 1,
            companionXP: 15,
            maxXP: 100,
            unlockedAchievements: [],
            conversations: [],
            lastVisit: null
        };
        
        const saved = localStorage.getItem('ventbuddy_data');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }
    
    saveUserData() {
        localStorage.setItem('ventbuddy_data', JSON.stringify(this.userData));
    }
    
    setupEventListeners() {
        // Character creation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.character-card')) {
                this.selectCharacter(e.target.closest('.character-card'));
            }
        });
        
        // Mood selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mood-btn')) {
                this.selectMood(e.target.closest('.mood-btn'));
            }
        });
        
        // Send message
        const sendButton = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');
        
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (messageInput) {
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            messageInput.addEventListener('input', () => {
                this.autoResize(messageInput);
            });
        }
    }
    
    setupTabNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn')) {
                const tabName = e.target.closest('.nav-btn').dataset.tab;
                this.switchTab(tabName);
            }
        });
    }
    
    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const targetTab = document.getElementById(`${tabName}Tab`);
        if (targetTab) {
            targetTab.classList.add('active');
            
            // Update progress tab with real data when switching to it
            if (tabName === 'progress') {
                this.updateProgressTab();
            }
        }
    }
    
    selectCharacter(cardElement) {
        // Remove active class from all cards
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to selected card
        cardElement.classList.add('active');
        
        // Update companion data
        this.companion.character = cardElement.dataset.character;
        this.companion.name = cardElement.dataset.name;
        this.companion.personality = cardElement.dataset.personality;
    }
    
    selectMood(moodButton) {
        // Remove active class from all mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected mood
        moodButton.classList.add('active');
        this.currentMood = moodButton.dataset.mood;
        
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    // Initialize the enhanced brain with GPT
    initializeBrain() {
        if (typeof EnhancedVentBuddyBrain !== 'undefined') {
            this.brain = new EnhancedVentBuddyBrain(this.companion.personality);
            console.log('🧠 GPT-powered intelligence initialized for', this.companion.name);
        } else {
            console.warn('Enhanced brain not available, using fallback mode');
        }
    }
    
    // Enhanced message sending with GPT AI responses
    async sendMessage() {
        if (this.isProcessing) return;
        
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;
        
        this.isProcessing = true;
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        // Add user message
        this.addMessage('user', message, this.currentMood);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            if (this.brain) {
                // Use GPT-powered AI brain for response
                const intelligentResponse = await this.brain.processMessage(
                    message, 
                    this.currentMood, 
                    this.companion.name
                );
                
                this.hideTypingIndicator();
                
                // Add companion response with enhanced features
                this.addEnhancedMessage('companion', intelligentResponse);
                
                // Update stats with intelligent bonuses
                this.updateStatsWithIntelligence(intelligentResponse);
                
                // Check for new types of achievements
                this.checkIntelligentAchievements(intelligentResponse);
                
            } else {
                // Fallback to simple response
                setTimeout(() => {
                    this.hideTypingIndicator();
                    const fallbackResponse = this.generateFallbackResponse(message);
                    this.addMessage('companion', fallbackResponse);
                    this.updateStats();
                }, 1500 + Math.random() * 1000);
            }
            
        } catch (error) {
            console.error('Error generating AI response:', error);
            
            // Fallback to simple response
            this.hideTypingIndicator();
            const fallbackResponse = this.generateFallbackResponse(message);
            this.addMessage('companion', fallbackResponse);
            this.updateStats();
        }
        
        this.checkAchievements();
        this.isProcessing = false;
        
        // Clear mood selection
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.currentMood = null;
    }
    
    // Enhanced message display with emotional context
    addEnhancedMessage(type, intelligentResponse) {
        const messagesContainer = document.getElementById('messagesContainer');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} enhanced`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.textContent = this.companion.character;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.innerHTML = intelligentResponse.text.replace(/\n/g, '<br>');
        
        // Add emotional analysis indicator if significant
        if (intelligentResponse.emotionalAnalysis && intelligentResponse.emotionalAnalysis.intensity > 0.7) {
            const emotionIndicator = document.createElement('div');
            emotionIndicator.className = 'emotion-indicator';
            emotionIndicator.innerHTML = `
                <span class="emotion-badge ${intelligentResponse.emotionalAnalysis.primaryEmotion}">
                    ${this.getEmotionEmoji(intelligentResponse.emotionalAnalysis.primaryEmotion)}
                    ${intelligentResponse.emotionalAnalysis.primaryEmotion}
                </span>
            `;
            contentDiv.appendChild(emotionIndicator);
        }
        
        // Add insight badge if present
        if (intelligentResponse.insight) {
            const insightBadge = document.createElement('div');
            insightBadge.className = 'insight-badge';
            insightBadge.innerHTML = `<span class="insight-icon">💡</span> Pattern Insight`;
            contentDiv.appendChild(insightBadge);
        }
        
        // Add memory reference indicator
        if (intelligentResponse.memory_reference) {
            const memoryBadge = document.createElement('div');
            memoryBadge.className = 'memory-badge';
            memoryBadge.innerHTML = `<span class="memory-icon">🧠</span> Remembering our conversation`;
            contentDiv.appendChild(memoryBadge);
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        contentDiv.appendChild(bubbleDiv);
        contentDiv.appendChild(timeDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Show XP gain animation
        if (intelligentResponse.xp_bonus && intelligentResponse.xp_bonus > 10) {
            this.showXPGainAnimation(intelligentResponse.xp_bonus);
        }
    }
    
    // Regular message display for fallback
    addMessage(type, content, mood = null) {
        const messagesContainer = document.getElementById('messagesContainer');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (type === 'user') {
            avatarDiv.textContent = '👤';
        } else {
            avatarDiv.textContent = this.companion.character;
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.innerHTML = content.replace(/\n/g, '<br>');
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        contentDiv.appendChild(bubbleDiv);
        contentDiv.appendChild(timeDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('messagesContainer');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">${this.companion.character}</div>
            <div class="typing-bubble">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    // Get appropriate emoji for emotions
    getEmotionEmoji(emotion) {
        const emojiMap = {
            joy: '😊',
            sadness: '😢',
            anger: '😠',
            anxiety: '😰',
            excitement: '🤩',
            confusion: '🤔',
            love: '💝',
            fear: '😨'
        };
        return emojiMap[emotion] || '💭';
    }
    
    // Enhanced stats update with intelligence bonuses
    updateStatsWithIntelligence(intelligentResponse) {
        this.userData.totalConversations++;
        this.userData.companionXP += intelligentResponse.xp_bonus || 10;
        
        // Bonus rewards for intelligent interactions
        if (intelligentResponse.insight) {
            this.userData.totalInsights++;
            this.userData.crystalCount += 5;
        }
        
        if (intelligentResponse.memory_reference) {
            this.userData.starCount += 2;
        }
        
        // High emotional intensity conversations get bonus rewards
        if (intelligentResponse.emotionalAnalysis && intelligentResponse.emotionalAnalysis.intensity > 0.8) {
            this.userData.crystalCount += Math.floor(intelligentResponse.emotionalAnalysis.intensity * 5);
        }
        
        // Update relationship level based on brain's calculation
        if (intelligentResponse.relationshipLevel) {
            this.userData.companionLevel = Math.floor(intelligentResponse.relationshipLevel);
            this.userData.maxXP = this.userData.companionLevel * 50 + 50;
        }
        
        this.checkLevelUp();
        this.saveUserData();
        this.updateUI();
    }
    
    // Regular stats update for fallback
    updateStats() {
        this.userData.totalConversations++;
        this.userData.companionXP += 10;
        
        // Random chance for insights and rewards
        if (Math.random() > 0.7) {
            this.userData.totalInsights++;
        }
        
        if (Math.random() > 0.8) {
            this.userData.crystalCount += Math.floor(Math.random() * 3) + 1;
        }
        
        if (Math.random() > 0.9) {
            this.userData.starCount += 1;
        }
        
        // Check for level up
        this.checkLevelUp();
        
        this.saveUserData();
        this.updateUI();
    }
    
    checkLevelUp() {
        if (this.userData.companionXP >= this.userData.maxXP) {
            this.userData.companionLevel++;
            this.userData.companionXP = 0;
            this.userData.maxXP += 50;
            
            // Show level up celebration
            this.showLevelUpCelebration();
            
            // Award bonus rewards
            this.userData.crystalCount += this.userData.companionLevel * 2;
            this.userData.starCount += this.userData.companionLevel;
        }
    }
    
    showLevelUpCelebration() {
        // Add level up message
        this.addMessage('companion', `🎉✨ LEVEL UP! ✨🎉\n\nWe've reached Level ${this.userData.companionLevel}! Our bond grows stronger with each conversation. Thank you for trusting me with your thoughts and feelings! 💜`);
        
        // Create celebration effects
        this.createCelebrationEffects();
    }
    
    createCelebrationEffects() {
        const colors = ['#4f2a93', '#6c5ce7', '#00b4d8', '#51cf66', '#ffd43b', '#ff6b6b'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall ${3 + Math.random() * 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Check for new intelligence-based achievements
    checkIntelligentAchievements(intelligentResponse) {
        if (!intelligentResponse) return;
        
        // Deep sharing achievement
        if (intelligentResponse.emotionalAnalysis && intelligentResponse.emotionalAnalysis.intensity > 0.9 && 
            !this.userData.unlockedAchievements.includes('deep_sharer')) {
            this.unlockAchievement(this.achievements.find(a => a.id === 'deep_sharer'));
        }
        
        // Pattern discovery achievement
        if (intelligentResponse.insight && 
            !this.userData.unlockedAchievements.includes('pattern_spotter')) {
            this.unlockAchievement(this.achievements.find(a => a.id === 'pattern_spotter'));
        }
        
        // Emotional growth achievement
        if (this.brain) {
            const progressData = this.brain.getProgressData();
            if (progressData.weeklyStats && progressData.weeklyStats.improvementTrend === 'improving' &&
                !this.userData.unlockedAchievements.includes('emotional_growth')) {
                this.unlockAchievement(this.achievements.find(a => a.id === 'emotional_growth'));
            }
        }
    }
    
    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.userData.unlockedAchievements.includes(achievement.id)) {
                let currentValue = 0;
                
                switch (achievement.type) {
                    case 'conversations':
                        currentValue = this.userData.totalConversations;
                        break;
                    case 'streak':
                        currentValue = this.userData.streakDays;
                        break;
                    case 'level':
                        currentValue = this.userData.companionLevel;
                        break;
                    case 'ai_setup':
                        currentValue = (this.brain && this.brain.gptEngine && this.brain.gptEngine.isConfigured()) ? 1 : 0;
                        break;
                    default:
                        currentValue = this.userData.unlockedAchievements.includes(achievement.id) ? achievement.requirement : 0;
                        break;
                }
                
                if (currentValue >= achievement.requirement) {
                    this.unlockAchievement(achievement);
                }
            }
        });
        
        this.updateAchievementsDisplay();
    }
    
    unlockAchievement(achievement) {
        this.userData.unlockedAchievements.push(achievement.id);
        
        // Award bonus rewards
        this.userData.crystalCount += 10;
        this.userData.starCount += 5;
        
        // Show achievement notification
        this.showAchievementNotification(achievement);
        
        this.saveUserData();
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4f2a93, #6c5ce7);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.5s ease;
                max-width: 300px;
            ">
                <div style="font-size: 24px; margin-bottom: 8px;">${achievement.icon}</div>
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">Achievement Unlocked!</div>
                <div style="font-weight: 600; margin-bottom: 4px;">${achievement.name}</div>
                <div style="font-size: 14px; opacity: 0.9;">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4000);
    }
    
    // Fallback response system
    generateFallbackResponse(message) {
        const fallbacks = [
            "I'm here to listen and support you. Could you tell me more about what you're feeling?",
            "Thank you for sharing that with me. I want to understand better - what's been on your mind?",
            "I hear you, and I'm here for you. How has this been affecting you?",
            "Your feelings are important to me. Can you help me understand what you're experiencing?"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    updateUI() {
        // Update stats in header
        if (document.getElementById('crystalCount')) {
            document.getElementById('crystalCount').textContent = this.userData.crystalCount;
        }
        if (document.getElementById('starCount')) {
            document.getElementById('starCount').textContent = this.userData.starCount;
        }
        
        // Update companion info
        if (document.getElementById('companionNameDisplay')) {
            document.getElementById('companionNameDisplay').textContent = this.companion.name;
        }
        
        if (document.getElementById('companionSprite')) {
            document.getElementById('companionSprite').textContent = this.companion.character;
        }
        
        // Update progress bar
        const progressPercent = (this.userData.companionXP / this.userData.maxXP) * 100;
        if (document.getElementById('trustProgress')) {
            document.getElementById('trustProgress').style.width = `${progressPercent}%`;
        }
        
        // Update level display
        const userLevel = document.querySelector('.user-level');
        if (userLevel) {
            userLevel.textContent = `Lv ${this.userData.companionLevel}`;
        }
        
        // Update stats in progress tab
        if (document.getElementById('totalChats')) {
            document.getElementById('totalChats').textContent = this.userData.totalConversations;
        }
        if (document.getElementById('totalInsights')) {
            document.getElementById('totalInsights').textContent = this.userData.totalInsights;
        }
        if (document.getElementById('streakDays')) {
            document.getElementById('streakDays').textContent = this.userData.streakDays;
        }
        if (document.getElementById('moodScore')) {
            document.getElementById('moodScore').textContent = this.userData.moodScore;
        }
        
        // Update companion traits
        const personality = this.personalities[this.companion.personality];
        const traitTags = document.querySelector('.trait-tags');
        if (traitTags && personality) {
            traitTags.innerHTML = personality.traits.map(trait => 
                `<span class="trait-tag">${trait}</span>`
            ).join('');
        }
    }
    
    updateAchievementsDisplay() {
        const achievementsGrid = document.querySelector('.achievements-grid');
        if (!achievementsGrid) return;
        
        achievementsGrid.innerHTML = this.achievements.map(achievement => {
            const isUnlocked = this.userData.unlockedAchievements.includes(achievement.id);
            let currentValue = 0;
            
            switch (achievement.type) {
                case 'conversations':
                    currentValue = this.userData.totalConversations;
                    break;
                case 'streak':
                    currentValue = this.userData.streakDays;
                    break;
                case 'level':
                    currentValue = this.userData.companionLevel;
                    break;
                case 'ai_setup':
                    currentValue = (this.brain && this.brain.gptEngine && this.brain.gptEngine.isConfigured()) ? 1 : 0;
                    break;
                default:
                    currentValue = isUnlocked ? achievement.requirement : 0;
                    break;
            }
            
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    <div class="achievement-progress">${Math.min(currentValue, achievement.requirement)}/${achievement.requirement}</div>
                </div>
            `;
        }).join('');
    }
    
    // Enhanced progress tab with AI statistics
    updateProgressTab() {
        if (!this.brain) return;
        
        const progressData = this.brain.getProgressData();
        const insights = progressData.insights;
        
        // Update the existing stats
        if (document.getElementById('totalChats')) {
            document.getElementById('totalChats').textContent = progressData.totalConversations;
        }
        if (document.getElementById('totalInsights')) {
            document.getElementById('totalInsights').textContent = this.userData.totalInsights;
        }
        
        // Add insights section if not exists
        let insightsSection = document.querySelector('.insights-section');
        if (!insightsSection && insights.length > 0) {
            insightsSection = document.createElement('div');
            insightsSection.className = 'section insights-section';
            insightsSection.innerHTML = `
                <h3>Personal Insights</h3>
                <div class="insights-container"></div>
            `;
            const progressSections = document.querySelector('.progress-sections');
            if (progressSections) {
                progressSections.appendChild(insightsSection);
            }
        }
        
        // Update insights
        if (insightsSection && insights.length > 0) {
            const container = insightsSection.querySelector('.insights-container');
            container.innerHTML = insights.map(insight => `
                <div class="insight-card">
                    <span class="insight-icon">💡</span>
                    <span class="insight-text">${insight}</span>
                </div>
            `).join('');
        }
    }
    
    // Enhanced welcome message
    showWelcomeMessage() {
        setTimeout(() => {
            if (this.brain) {
                const progressData = this.brain.getProgressData();
                
                let welcomeMessages;
                if (progressData.totalConversations === 0) {
                    // First time user
                    welcomeMessages = [
                        `🌟 Hello! I'm ${this.companion.name}, your personal emotional support companion. I'm genuinely excited to get to know you and be part of your journey.`,
                        `💜 This is a completely safe space where you can share anything. I'll listen without judgment and help you discover insights about yourself. How are you feeling today?`
                    ];
                } else {
                    // Returning user
                    welcomeMessages = [
                        `🌟 Welcome back! I've missed our conversations. We've talked ${progressData.totalConversations} times now, and I can see how much you've grown.`,
                        `💜 I remember what we discussed before, and I'm here to continue supporting your journey. What's been on your mind since we last talked?`
                    ];
                }
                
                welcomeMessages.forEach((message, index) => {
                    setTimeout(() => {
                        this.addMessage('companion', message);
                    }, index * 2500);
                });
            } else {
                // Fallback welcome message
                const welcomeMessages = [
                    `🌟 Hello! I'm ${this.companion.name}, your personal emotional support companion. I'm here to listen and support you.`,
                    `💜 This is a safe space where you can share anything. How are you feeling today?`
                ];
                
                welcomeMessages.forEach((message, index) => {
                    setTimeout(() => {
                        this.addMessage('companion', message);
                    }, index * 2000);
                });
            }
        }, 1000);
    }
    
    showXPGainAnimation(xpAmount) {
        const xpNotification = document.createElement('div');
        xpNotification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: var(--gradient-purple);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-weight: 700;
            font-size: 18px;
            z-index: 10000;
            transition: all 0.5s ease;
            box-shadow: var(--shadow-heavy);
        `;
        xpNotification.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 24px; margin-bottom: 5px;">⭐</div>
                <div>+${xpAmount} XP</div>
                <div style="font-size: 12px; opacity: 0.8;">Meaningful conversation!</div>
            </div>
        `;
        
        document.body.appendChild(xpNotification);
        
        setTimeout(() => {
            xpNotification.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
        
        setTimeout(() => {
            xpNotification.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => xpNotification.remove(), 500);
        }, 2000);
    }
}

// Add CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// GLOBAL FUNCTIONS - These are attached to window so HTML can access them
function startJourney() {
    console.log('Start Journey clicked');
    const modal = document.getElementById('characterModal');
    if (modal) {
        modal.classList.add('active');
        console.log('Modal should be visible now');
    } else {
        console.error('Character modal not found');
    }
}

function learnMore() {
    alert('VentBuddy is your personal AI companion designed to support your emotional wellbeing through meaningful conversations, pattern recognition, and personalized guidance.');
}

function createCompanion() {
    console.log('Create Companion clicked');
    
    // Wait for app if not ready
    if (!window.ventbuddyApp) {
        console.log('App not ready, waiting...');
        setTimeout(createCompanion, 100);
        return;
    }
    
    const nameInput = document.getElementById('companionName');
    const selectedCard = document.querySelector('.character-card.active');
    
    console.log('Selected card:', selectedCard);
    console.log('Name input:', nameInput ? nameInput.value : 'not found');
    
    if (selectedCard) {
        window.ventbuddyApp.companion.character = selectedCard.dataset.character;
        window.ventbuddyApp.companion.name = selectedCard.dataset.name;
        window.ventbuddyApp.companion.personality = selectedCard.dataset.personality;
        console.log('Updated companion:', window.ventbuddyApp.companion);
    }
    
    if (nameInput && nameInput.value.trim()) {
        window.ventbuddyApp.companion.name = nameInput.value.trim();
    }
    
    // Initialize the enhanced brain
    if (window.ventbuddyApp.initializeBrain) {
        window.ventbuddyApp.initializeBrain();
    }
    
    // Close modal and show app
    const characterModal = document.getElementById('characterModal');
    const landingPage = document.getElementById('landingPage');
    const appInterface = document.getElementById('appInterface');
    
    console.log('Transitioning UI...');
    
    if (characterModal) {
        characterModal.classList.remove('active');
        console.log('Modal closed');
    }
    if (landingPage) {
        landingPage.style.display = 'none';
        console.log('Landing page hidden');
    }
    if (appInterface) {
        appInterface.classList.add('active');
        console.log('App interface shown');
    }
    
    // Update UI with companion info
    window.ventbuddyApp.updateUI();
    
    // Show enhanced welcome message
    window.ventbuddyApp.showWelcomeMessage();
    
    console.log('Companion creation complete!');
}

// Make functions global so HTML can access them
window.startJourney = startJourney;
window.learnMore = learnMore;
window.createCompanion = createCompanion;

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing VentBuddy...');
    window.ventbuddyApp = new VentBuddy();
    console.log('🧙‍♂️ VentBuddy initialized successfully!');
});