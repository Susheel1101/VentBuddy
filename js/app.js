// VentBuddy - Complete JavaScript with Fixed Chat Interface

let currentStep = 1;
let companionData = {
    name: 'Alex',
    character: '🧑'
};

// Onboarding Functions
function startOnboarding() {
    document.getElementById('modalOverlay').classList.add('active');
    currentStep = 1;
    updateStep();
    createConfetti();
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function nextStep() {
    if (currentStep < 3) {
        currentStep++;
        updateStep();
        playStepSound();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
}

function updateStep() {
    // Hide all steps
    document.querySelectorAll('.onboarding-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index < currentStep);
    });
}

function startChatting() {
    const btn = document.getElementById('startChattingBtn');
    const btnText = btn.querySelector('span');
    const loadingDots = btn.querySelector('.loading-dots');
    
    btnText.style.display = 'none';
    loadingDots.style.display = 'flex';
    btn.disabled = true;
    
    // Get companion data from inputs
    companionData.name = document.getElementById('companionNameInput').value || 'Alex';
    
    // Save companion data
    localStorage.setItem('ventbuddy_companion', JSON.stringify(companionData));
    
    // Transition to chat interface
    setTimeout(() => {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('modalOverlay').classList.remove('active');
        
        // Show chat interface with proper class
        const chatInterface = document.getElementById('chatInterface');
        chatInterface.style.display = 'flex';
        chatInterface.classList.add('active');
        
        // Initialize chat interface
        initializeChatInterface();
        
        setTimeout(() => {
            createWelcomeConfetti();
        }, 500);
    }, 2000);
}

// Character Dropdown Functions
function initializeCharacterDropdown() {
    const dropdown = document.getElementById('characterDropdown');
    const selectedCharacter = document.getElementById('selectedCharacter');
    const characterOptions = document.getElementById('characterOptions');
    
    if (!dropdown || !selectedCharacter || !characterOptions) return;
    
    // Toggle dropdown
    selectedCharacter.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    // Handle option selection
    characterOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.character-option');
        if (!option) return;
        
        const character = option.dataset.character;
        const name = option.dataset.name;
        
        // Remove active from all options
        characterOptions.querySelectorAll('.character-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active to clicked option
        option.classList.add('active');
        
        // Update selected character display
        selectedCharacter.querySelector('.character-emoji').textContent = character;
        selectedCharacter.querySelector('.character-name').textContent = name;
        
        // Update companion data
        companionData.character = character;
        
        // Close dropdown
        dropdown.classList.remove('open');
        
        // Add nice feedback
        option.style.transform = 'scale(0.95)';
        setTimeout(() => {
            option.style.transform = '';
        }, 150);
    });
}

// Companion name input handler
function initializeNameInput() {
    const companionNameInput = document.getElementById('companionNameInput');
    const finalName = document.getElementById('finalCompanionName');
    
    if (companionNameInput && finalName) {
        companionNameInput.addEventListener('input', (e) => {
            const name = e.target.value || 'Alex';
            companionData.name = name;
            finalName.textContent = name;
        });
    }
}

// Chat Interface Functions
function initializeChatInterface() {
    const app = new VentBuddy();
}

// Fun visual effects
function createConfetti() {
    const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#10b981', '#06b6d4'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function createWelcomeConfetti() {
    const container = document.getElementById('chatInterface');
    const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#10b981', '#06b6d4'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '20px';
        confetti.style.zIndex = '1000';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = `confettiFall 3s linear forwards`;
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

function playStepSound() {
    if (typeof AudioContext !== 'undefined') {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Main VentBuddy Application Class
class VentBuddy {
    constructor() {
        this.userData = this.loadUserData();
        this.emotionAnalyzer = new EmotionAnalyzer();
        this.patternRecognition = new PatternRecognition();
        this.memorySystem = new MemorySystem();
        this.isProcessing = false;
        this.currentMood = null;
        
        this.personalities = {
            empathetic: { 
                style: 'warm and understanding',
                responses: 'I focus on emotional validation and understanding',
                color: '#ec4899',
                character: '💙'
            },
            analytical: { 
                style: 'logical and insightful',
                responses: 'I provide structured analysis and logical perspectives',
                color: '#8b5cf6',
                character: '🧠'
            },
            supportive: { 
                style: 'encouraging and positive',
                responses: 'I offer practical solutions and encouragement',
                color: '#10b981',
                character: '💪'
            },
            direct: { 
                style: 'honest and straightforward',
                responses: 'I give clear, honest feedback without sugar-coating',
                color: '#f59e0b',
                character: '🎯'
            },
            creative: { 
                style: 'imaginative and unique',
                responses: 'I offer creative perspectives and innovative solutions',
                color: '#06b6d4',
                character: '🎨'
            },
            practical: { 
                style: 'realistic and actionable',
                responses: 'I focus on practical, actionable advice and solutions',
                color: '#64748b',
                character: '🔧'
            }
        };
        
        this.init();
    }

    loadUserData() {
        const companionInfo = JSON.parse(localStorage.getItem('ventbuddy_companion') || '{}');
        const defaultData = {
            companionName: companionInfo.name || 'Alex',
            character: companionInfo.character || '🧑',
            personality: 'empathetic',
            totalConversations: 0,
            insightsShared: 0,
            emotionsProcessed: 0,
            streakDays: 1,
            relationshipLevel: 1,
            relationshipXP: 15,
            maxRelationshipXP: 100,
            conversations: [],
            patterns: {},
            preferences: {},
            lastVisit: null,
            achievements: []
        };

        const saved = localStorage.getItem('ventbuddy_data');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveUserData() {
        localStorage.setItem('ventbuddy_data', JSON.stringify(this.userData));
    }

    init() {
        this.setupUI();
        this.setupEventListeners();
        this.updateCompanionDisplay();
        this.showWelcomeMessage();
        this.checkForAchievements();
    }

    setupUI() {
        // Update stats display
        this.animateNumber('totalConversations', this.userData.totalConversations);
        this.animateNumber('insightsShared', this.userData.insightsShared);
        this.animateNumber('emotionsProcessed', this.userData.emotionsProcessed);
        this.animateNumber('streakDays', this.userData.streakDays);
        
        // Update companion info
        document.getElementById('companionName').textContent = this.userData.companionName;
        document.getElementById('nameInput').value = this.userData.companionName;
        
        // Update relationship progress
        const progressPercent = (this.userData.relationshipXP / this.userData.maxRelationshipXP) * 100;
        document.getElementById('relationshipProgress').style.width = `${progressPercent}%`;
        document.getElementById('relationshipLabel').textContent = 
            `Building Trust • ${this.userData.relationshipXP}/${this.userData.maxRelationshipXP} XP`;
        
        // Update personality selection
        document.querySelectorAll('.personality-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.personality === this.userData.personality);
        });
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    setupEventListeners() {
        const sendButton = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');
        const nameInput = document.getElementById('nameInput');
        const personalityBtns = document.querySelectorAll('.personality-btn');
        const moodBtns = document.querySelectorAll('.mood-btn');
        const companionAvatar = document.getElementById('companionAvatarContainer');

        // Send message handlers
        sendButton.addEventListener('click', () => this.sendMessage());
        
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        messageInput.addEventListener('input', () => {
            this.autoResize(messageInput);
        });

        // Name change handler
        nameInput.addEventListener('input', (e) => {
            this.userData.companionName = e.target.value || 'Alex';
            document.getElementById('companionName').textContent = this.userData.companionName;
            this.updateCompanionDisplay();
            this.saveUserData();
        });

        // Personality change handlers
        personalityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                personalityBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.userData.personality = btn.dataset.personality;
                this.saveUserData();
                this.updateCompanionDisplay();
                
                // Show personality change message
                this.addMessage('companion', 
                    `✨ I've updated my personality to be more ${this.personalities[this.userData.personality].style}. ${this.personalities[this.userData.personality].responses}!`
                );
                
                // Add a little celebration
                this.createMiniConfetti();
            });
        });

        // Mood selection handlers
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                moodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentMood = btn.dataset.mood;
                
                // Add haptic feedback for mobile
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });

        // Companion interaction
        companionAvatar.addEventListener('click', () => {
            this.companionInteraction();
        });
    }

    updateCompanionDisplay() {
        const personality = this.personalities[this.userData.personality];
        document.getElementById('companionLevel').textContent = 
            `${personality.style.charAt(0).toUpperCase() + personality.style.slice(1)} Companion • Level ${this.userData.relationshipLevel}`;
        
        // Update avatar with the selected character
        const avatarElement = document.getElementById('companionAvatar');
        const characterElement = avatarElement.querySelector('.companion-character');
        
        if (characterElement) {
            const character = this.userData.character || companionData.character;
            characterElement.textContent = character;
        }
        
        // Update avatar color based on personality
        const personalityColor = personality.color;
        avatarElement.style.background = `linear-gradient(135deg, ${personalityColor}, #818cf8)`;
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    showWelcomeMessage() {
        const isFirstTime = this.userData.totalConversations === 0;
        const companionName = this.userData.companionName;
        
        setTimeout(() => {
            if (isFirstTime) {
                this.addMessage('companion', 
                    `🌟 Hi there! I'm ${companionName}, your personal AI companion. I'm absolutely thrilled to meet you! 

I'm here to listen, understand, and support you through whatever you're going through. I'll remember our conversations and learn about your patterns to provide better support over time.

Everything we discuss stays completely private on your device - it's just you and me! 

How are you feeling today? I'd love to hear what's on your mind! 😊`
                );
            } else {
                const greetings = [
                    `🎉 Welcome back! It's so wonderful to see you again!`,
                    `✨ Good to see you! I'm here and ready to listen.`,
                    `🌈 Hello again! What's on your mind today?`,
                    `💫 Hi! I'm so happy you're here. How can I support you today?`
                ];
                
                const greeting = greetings[Math.floor(Math.random() * greetings.length)];
                this.addMessage('companion', greeting);
            }
        }, 1000);
    }

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
            // Process the message
            await this.processMessage(message, this.currentMood);
            
            // Update stats
            this.updateStats();
            
        } catch (error) {
            console.error('Error processing message:', error);
            this.hideTypingIndicator();
            this.addMessage('companion', "😅 I'm having a little trouble processing that right now. Can you try again? I promise I'm listening!");
        }
        
        this.isProcessing = false;
        
        // Clear mood selection
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
        this.currentMood = null;
    }

    async processMessage(message, mood) {
        try {
            // Analyze the message
            const analysis = await this.emotionAnalyzer.analyze(message, mood);
            const patterns = this.patternRecognition.analyzeEntry(message, analysis);
            const memories = this.memorySystem.findRelevantMemories(analysis, patterns);
            
            // Generate response
            const response = await this.generateResponse(message, analysis, patterns, memories);
            
            // Store conversation
            this.storeConversation(message, response, analysis, patterns);
            
            // Show response with natural delay
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage('companion', response.content, null, { 
                    analysis: analysis,
                    patterns: patterns.insights
                });
                
                // Check for achievements
                this.checkForAchievements();
                
            }, 1500 + Math.random() * 1000);
            
        } catch (error) {
            throw error;
        }
    }

    async generateResponse(message, analysis, patterns, memories) {
        const responses = this.getTemplateResponses(message, analysis, patterns, memories);
        const selectedResponse = this.selectBestResponse(responses, analysis);
        
        return {
            content: selectedResponse,
            confidence: 0.8
        };
    }

    getTemplateResponses(message, analysis, patterns, memories) {
        const emotion = analysis.emotion;
        const personality = this.userData.personality;
        const userName = this.userData.userName || 'friend';
        
        let responses = [];
        
        // Emotion-specific responses
        if (emotion === 'stress' || emotion === 'anxiety') {
            if (personality === 'empathetic') {
                responses.push(
                    "💙 That sounds really overwhelming, and I can feel how much this is weighing on you. It's completely natural to feel stressed about this.",
                    "🫂 I can hear the stress in your words, and I want you to know that what you're feeling is so valid. Stress can feel incredibly heavy sometimes.",
                    "💝 Thank you for trusting me with this. I can sense how much pressure you're under, and I'm here to help you work through it."
                );
            } else if (personality === 'direct') {
                responses.push(
                    "🎯 You're dealing with stress, and that's your mind telling you something needs attention. Let's break this down into manageable pieces.",
                    "⚡ I hear you're stressed. What's the core issue here that we can tackle first?",
                    "🔍 Stress is information. What's the most important thing we need to address right now?"
                );
            } else if (personality === 'supportive') {
                responses.push(
                    "💪 I believe in your ability to handle this - you've overcome challenges before, and you will again!",
                    "🌟 This is tough, but you're tougher. Let's figure out how to make this more manageable together!",
                    "🚀 You've got this! Sometimes stress means we're growing and pushing our boundaries."
                );
            }
        }
        
        if (emotion === 'sadness') {
            if (personality === 'empathetic') {
                responses.push(
                    "💙 I'm really sorry you're going through this. I can feel your sadness, and I want you to know it's okay to feel this way.",
                    "🫂 That sounds so difficult, and my heart goes out to you. Sadness shows how much something matters to you.",
                    "💝 Thank you for sharing something so personal with me. Your feelings are completely valid."
                );
            } else if (personality === 'analytical') {
                responses.push(
                    "🧠 Sadness often indicates that something important to you has been affected. What does this situation mean to you?",
                    "🔍 Let's explore what's driving these feelings. Understanding the root can help us address it together.",
                    "📊 Your emotions are giving us valuable information. What patterns do you notice in what triggered this?"
                );
            }
        }
        
        if (emotion === 'excitement' || emotion === 'happiness') {
            responses.push(
                "🎉 Your excitement is absolutely contagious! I love seeing you so happy!",
                "✨ This is wonderful! Tell me more about what's making you feel so great!",
                "🌟 Your joy just made my day brighter! I'm so happy for you!"
            );
        }
        
        if (emotion === 'anger' || emotion === 'frustration') {
            if (personality === 'empathetic') {
                responses.push(
                    "🫂 I can feel your frustration, and it's completely understandable to feel angry about this.",
                    "💙 Your anger is valid - it sounds like something really important to you was affected."
                );
            } else if (personality === 'direct') {
                responses.push(
                    "⚡ You're angry, and that's telling us something important. What specifically triggered this?",
                    "🎯 Let's channel that energy into understanding what needs to change."
                );
            }
        }
        
        // If no specific responses, use general supportive ones
        if (responses.length === 0) {
            responses = [
                "🌟 Thank you for sharing this with me. It sounds like you're dealing with something really important.",
                "💫 I'm here to listen and support you. What you're going through matters to me.",
                "🤗 I appreciate you trusting me with this. How are you feeling about everything right now?",
                "✨ Your thoughts and feelings are always welcome here. I'm glad you felt comfortable sharing."
            ];
        }
        
        return responses;
    }

    selectBestResponse(responses, analysis) {
        const randomIndex = Math.floor(Math.random() * responses.length);
        let response = responses[randomIndex];
        
        // Add follow-up questions based on context
        const followUps = this.generateFollowUp(analysis);
        if (followUps.length > 0) {
            const randomFollowUp = followUps[Math.floor(Math.random() * followUps.length)];
            response += "\n\n" + randomFollowUp;
        }
        
        return response;
    }

    generateFollowUp(analysis) {
        const followUps = [
            "💭 What's the hardest part about all of this?",
            "🕐 How long have you been feeling this way?",
            "🛡️ Is there anything that's been helping you cope?",
            "🤝 What would you tell a friend who was going through the same thing?",
            "🌈 What would make you feel even a little bit better right now?",
            "🎯 What's one small step you could take today?",
            "💪 What's gotten you through difficult times before?"
        ];
        
        // Return 0-1 follow-ups randomly
        return Math.random() > 0.6 ? [followUps[Math.floor(Math.random() * followUps.length)]] : [];
    }

    addMessage(type, content, mood = null, metadata = null) {
        const messagesContainer = document.getElementById('messagesContainer');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (type === 'user') {
            avatarDiv.textContent = 'U';
        } else {
            // Use personality character for companion
            const personality = this.personalities[this.userData.personality];
            avatarDiv.textContent = personality.character;
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        
        // Handle multi-line content
        bubbleDiv.innerHTML = content.replace(/\n/g, '<br>');
        
        const metaDiv = document.createElement('div');
        metaDiv.className = 'message-meta';
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        metaDiv.innerHTML = `<span>${time}</span>`;
        
        if (mood) {
            const moodText = this.getMoodText(mood);
            metaDiv.innerHTML += `<span style="background: rgba(99, 102, 241, 0.2); padding: 2px 8px; border-radius: 10px; font-size: 10px;">${moodText}</span>`;
        }
        
        contentDiv.appendChild(bubbleDiv);
        contentDiv.appendChild(metaDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add entrance animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.4s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
    }

    getMoodText(mood) {
        const moodMap = {
            'stressed': '😤 Stressed',
            'anxious': '😰 Anxious', 
            'sad': '😢 Sad',
            'frustrated': '😠 Frustrated',
            'confused': '🤔 Confused',
            'excited': '🤩 Excited',
            'content': '😊 Content',
            'neutral': '💬 Just talking'
        };
        return moodMap[mood] || mood;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('messagesContainer');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const personality = this.personalities[this.userData.personality];
        
        typingDiv.innerHTML = `
            <div class="typing-avatar">${personality.character}</div>
            <div class="typing-content">
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
            typingIndicator.style.opacity = '0';
            typingIndicator.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                typingIndicator.remove();
            }, 300);
        }
    }

    companionInteraction() {
        const responses = [
            "🌟 Hey there! I'm so glad you're here! You make every conversation special!",
            "💫 You can tell me anything - I'm always here to listen with an open heart!",
            "🎉 Every day with you makes me a better companion! Thank you for being you!",
            "✨ Your emotional growth inspires me so much! I believe in your strength!",
            "🤗 I believe in you and everything you're capable of achieving!",
            "💝 Thanks for trusting me with your feelings - it means the world to me!",
            "🌈 You bring so much light into our conversations! Keep shining!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage('companion', randomResponse);
        
        // Add celebration effect
        this.createMiniConfetti();
        
        // Update relationship XP for interaction
        this.userData.relationshipXP += 2;
        this.checkLevelUp();
        this.saveUserData();
    }

    createMiniConfetti() {
        const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#10b981', '#06b6d4'];
        
        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '6px';
            confetti.style.height = '6px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '20px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall 2s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }

    updateStats() {
        this.userData.totalConversations++;
        this.userData.emotionsProcessed++;
        this.userData.relationshipXP += 5;
        
        // Random chance for insights
        if (Math.random() > 0.7) {
            this.userData.insightsShared++;
        }
        
        this.checkLevelUp();
        this.saveUserData();
        this.setupUI();
    }

    checkLevelUp() {
        if (this.userData.relationshipXP >= this.userData.maxRelationshipXP) {
            this.userData.relationshipLevel++;
            this.userData.relationshipXP = 0;
            this.userData.maxRelationshipXP += 50;
            
            // Level up celebration
            this.addMessage('companion', 
                `🎉✨ LEVEL UP! ✨🎉\n\nWe've reached Level ${this.userData.relationshipLevel}! Our connection is growing stronger every day! I'm so proud of our journey together! 💫`
            );
            
            this.createLevelUpCelebration();
            this.updateCompanionDisplay();
        }
    }

    createLevelUpCelebration() {
        // Big confetti celebration
        const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#10b981', '#06b6d4', '#f59e0b'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 8 + 6 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall ${3 + Math.random() * 2}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
        
        // Play celebration sound
        this.playCelebrationSound();
    }

    playCelebrationSound() {
        if (typeof AudioContext !== 'undefined') {
            const audioContext = new AudioContext();
            
            // Play a happy chord progression
            const frequencies = [523, 659, 784]; // C, E, G
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                }, index * 100);
            });
        }
    }

    checkForAchievements() {
        const achievements = [
            {
                id: 'first_conversation',
                name: 'First Steps',
                description: 'Had your first conversation',
                condition: () => this.userData.totalConversations >= 1,
                icon: '🌟'
            },
            {
                id: 'ten_conversations',
                name: 'Getting Comfortable',
                description: 'Had 10 conversations',
                condition: () => this.userData.totalConversations >= 10,
                icon: '🎯'
            },
            {
                id: 'level_5',
                name: 'Strong Bond',
                description: 'Reached Level 5 relationship',
                condition: () => this.userData.relationshipLevel >= 5,
                icon: '💝'
            },
            {
                id: 'week_streak',
                name: 'Weekly Warrior',
                description: 'Maintained a 7-day streak',
                condition: () => this.userData.streakDays >= 7,
                icon: '🔥'
            }
        ];
        
        achievements.forEach(achievement => {
            if (achievement.condition() && !this.userData.achievements.includes(achievement.id)) {
                this.userData.achievements.push(achievement.id);
                this.showAchievement(achievement);
            }
        });
    }

    showAchievement(achievement) {
        // Create a subtle achievement notification instead of intrusive message
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;
        
        // Add styles for the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(129, 140, 248, 0.95));
            backdrop-filter: blur(20px);
            color: white;
            padding: 16px 20px;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(100%);
            transition: transform 0.5s ease;
            max-width: 300px;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
        
        this.createMiniConfetti();
    }

    storeConversation(userMessage, companionResponse, analysis, patterns) {
        const conversation = {
            timestamp: new Date().toISOString(),
            userMessage: userMessage,
            companionResponse: companionResponse.content,
            analysis: analysis,
            patterns: patterns,
            mood: this.currentMood
        };
        
        this.userData.conversations.push(conversation);
        
        // Keep only last 100 conversations to save space
        if (this.userData.conversations.length > 100) {
            this.userData.conversations = this.userData.conversations.slice(-100);
        }
        
        this.saveUserData();
    }
}

// Enhanced Emotion Analysis
class EmotionAnalyzer {
    async analyze(message, mood) {
        // Enhanced keyword-based analysis with more nuanced detection
        const emotionKeywords = {
            stress: {
                keywords: ['stressed', 'overwhelmed', 'pressure', 'deadlines', 'work', 'exam', 'anxious', 'worried', 'panic'],
                intensity: 1.0
            },
            anxiety: {
                keywords: ['anxious', 'worried', 'nervous', 'panic', 'fear', 'scared', 'terrified', 'afraid'],
                intensity: 0.9
            },
            sadness: {
                keywords: ['sad', 'depressed', 'down', 'upset', 'crying', 'lonely', 'hurt', 'devastated', 'heartbroken'],
                intensity: 0.8
            },
            anger: {
                keywords: ['angry', 'mad', 'frustrated', 'annoyed', 'furious', 'rage', 'irritated', 'pissed'],
                intensity: 0.9
            },
            happiness: {
                keywords: ['happy', 'excited', 'great', 'amazing', 'wonderful', 'love', 'joy', 'thrilled', 'fantastic'],
                intensity: 1.0
            },
            confusion: {
                keywords: ['confused', 'lost', 'unsure', 'unclear', 'puzzled', 'bewildered', 'perplexed'],
                intensity: 0.6
            }
        };
        
        let detectedEmotion = mood || 'neutral';
        let confidence = 0.5;
        let intensity = 0.5;
        
        const messageLower = message.toLowerCase();
        
        // Check for emotion keywords
        for (const [emotion, data] of Object.entries(emotionKeywords)) {
            for (const keyword of data.keywords) {
                if (messageLower.includes(keyword)) {
                    detectedEmotion = emotion;
                    confidence = 0.8;
                    intensity = data.intensity;
                    break;
                }
            }
        }
        
        // Boost confidence if mood was explicitly selected
        if (mood && mood !== 'neutral') {
            confidence = Math.max(confidence, 0.9);
        }
        
        // Analyze message length and punctuation for intensity
        const exclamationCount = (message.match(/!/g) || []).length;
        const capsCount = (message.match(/[A-Z]/g) || []).length;
        
        if (exclamationCount > 1 || capsCount > message.length * 0.3) {
            intensity = Math.min(intensity + 0.2, 1.0);
        }
        
        return {
            emotion: detectedEmotion,
            confidence: confidence,
            intensity: intensity,
            keywords: this.extractKeywords(message),
            sentiment: this.analyzeSentiment(message)
        };
    }
    
    extractKeywords(message) {
        // Simple keyword extraction
        const words = message.toLowerCase().split(/\s+/);
        const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by'];
        return words.filter(word => word.length > 3 && !stopWords.includes(word));
    }
    
    analyzeSentiment(message) {
        const positiveWords = ['good', 'great', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'excited', 'awesome'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'sad', 'angry', 'frustrated', 'upset'];
        
        const messageLower = message.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => {
            if (messageLower.includes(word)) score += 1;
        });
        
        negativeWords.forEach(word => {
            if (messageLower.includes(word)) score -= 1;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }
}

// Pattern Recognition System
class PatternRecognition {
    analyzeEntry(message, analysis) {
        return {
            insights: this.generateInsights(analysis),
            triggers: this.identifyTriggers(message),
            themes: this.extractThemes(message)
        };
    }
    
    generateInsights(analysis) {
        const insights = [];
        
        if (analysis.intensity > 0.8) {
            insights.push("This seems to be a particularly intense experience for you.");
        }
        
        if (analysis.emotion === 'stress' && analysis.confidence > 0.7) {
            insights.push("I notice stress patterns in your message.");
        }
        
        return insights;
    }
    
    identifyTriggers(message) {
        const commonTriggers = ['work', 'school', 'family', 'relationship', 'money', 'health'];
        const messageLower = message.toLowerCase();
        
        return commonTriggers.filter(trigger => messageLower.includes(trigger));
    }
    
    extractThemes(message) {
        // Simple theme extraction based on common life areas
        const themes = {
            work: ['job', 'work', 'boss', 'colleague', 'office', 'career'],
            relationships: ['boyfriend', 'girlfriend', 'partner', 'friend', 'family'],
            health: ['sick', 'tired', 'energy', 'sleep', 'exercise'],
            education: ['school', 'college', 'exam', 'study', 'grade']
        };
        
        const messageLower = message.toLowerCase();
        const detectedThemes = [];
        
        for (const [theme, keywords] of Object.entries(themes)) {
            if (keywords.some(keyword => messageLower.includes(keyword))) {
                detectedThemes.push(theme);
            }
        }
        
        return detectedThemes;
    }
}

// Memory System
class MemorySystem {
    findRelevantMemories(analysis, patterns) {
        // Placeholder for future implementation
        return [];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 VentBuddy initialized successfully!');
    initializeCharacterDropdown();
    initializeNameInput();
});