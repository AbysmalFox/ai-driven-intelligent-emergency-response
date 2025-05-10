/**
 * First Aid Instructions Module
 * Provides emergency first aid instructions for different types of emergencies
 */

class FirstAidInstructions {
    constructor() {
        this.currentEmergencyType = null;
        this.currentInstructionIndex = 0;
        this.instructionsContainer = null;
        this.cprTimerRunning = false;
        this.cprCount = 0;
        this.cprStartTime = null;
        this.cprRate = 0;
        this.cprBeatInterval = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.instructionsContainer = document.getElementById('first-aid-instructions');
            if (document.getElementById('first-aid-section')) {
                this.loadEmergencyTypes();
            }
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Navigation to first aid section
            if (e.target.closest('.nav-item[data-section="first-aid-section"]')) {
                setTimeout(() => this.loadEmergencyTypes(), 100);
            }
            
            // Emergency type selection
            const emergencyTypeBtn = e.target.closest('.emergency-type-btn');
            if (emergencyTypeBtn) {
                this.showInstructions(emergencyTypeBtn.dataset.type);
            }
            
            // Back button
            if (e.target.closest('#back-to-types-btn')) {
                this.showEmergencyTypes();
            }
            
            // Instruction navigation
            if (e.target.closest('#prev-instruction-btn')) {
                this.navigateInstructions('prev');
            } else if (e.target.closest('#next-instruction-btn')) {
                this.navigateInstructions('next');
            }
            
            // CPR timer controls
            if (e.target.closest('#start-cpr-timer')) {
                this.startCPRTimer();
            } else if (e.target.closest('#stop-cpr-timer')) {
                this.stopCPRTimer();
            } else if (e.target.closest('#reset-cpr-timer')) {
                this.resetCPRTimer();
            }
            
            // CPR beat counter
            if (e.target.closest('.cpr-beat-btn')) {
                this.incrementCPRCount();
            }
        });
    }

    loadEmergencyTypes() {
        const firstAidSection = document.getElementById('first-aid-section');
        if (!firstAidSection) return;
        if (firstAidSection.querySelector('.emergency-types-grid')) return;

        const emergencyTypesGrid = document.createElement('div');
        emergencyTypesGrid.className = 'emergency-types-grid';
        emergencyTypesGrid.id = 'emergency-types-grid';


        emergencyTypesGrid.innerHTML = `
            <div class="section-header">
               <h2 style="color: white;"><i class="fas fa-first-aid"></i> First Aid Instructions</h2>
                <p>Select an emergency type to view first aid instructions</p>
            </div>
            
            </div>

            <div class="emergency-types">
                <button class="emergency-type-btn" data-type="cardiac">
                    <div class="type-icon cardiac-icon"><i class="fas fa-heartbeat"></i></div>
                    <div class="type-name">Cardiac Emergency</div>
                </button>
                <button class="emergency-type-btn" data-type="choking">
                    <div class="type-icon choking-icon"><i class="fas fa-lungs"></i></div>
                    <div class="type-name">Choking</div>
                </button>
                <button class="emergency-type-btn" data-type="bleeding">
                    <div class="type-icon bleeding-icon"><i class="fas fa-tint"></i></div>
                    <div class="type-name">Severe Bleeding</div>
                </button>
                <button class="emergency-type-btn" data-type="burns">
                    <div class="type-icon burns-icon"><i class="fas fa-fire"></i></div>
                    <div class="type-name">Burns</div>
                </button>
                <button class="emergency-type-btn" data-type="fracture">
                    <div class="type-icon fracture-icon"><i class="fas fa-bone"></i></div>
                    <div class="type-name">Fractures</div>
                </button>
                <button class="emergency-type-btn" data-type="stroke">
                    <div class="type-icon stroke-icon"><i class="fas fa-brain"></i></div>
                    <div class="type-name">Stroke</div>
                </button>
                <button class="emergency-type-btn" data-type="poisoning">
                    <div class="type-icon poisoning-icon"><i class="fas fa-skull-crossbones"></i></div>
                    <div class="type-name">Poisoning</div>
                </button>
                <button class="emergency-type-btn" data-type="seizure">
                    <div class="type-icon seizure-icon"><i class="fas fa-bolt"></i></div>
                    <div class="type-name">Seizure</div>
                </button>
                <button class="emergency-type-btn" data-type="heatstroke">
                    <div class="type-icon heatstroke-icon"><i class="fas fa-temperature-high"></i></div>
                    <div class="type-name">Heatstroke</div>
                </button>
                <button class="emergency-type-btn" data-type="allergic">
                    <div class="type-icon allergic-icon"><i class="fas fa-allergies"></i></div>
                    <div class="type-name">Allergic Reaction</div>
                </button>
            </div>
        `;


        const instructionsContainer = document.createElement('div');
        instructionsContainer.className = 'first-aid-instructions';
        instructionsContainer.id = 'first-aid-instructions';
        instructionsContainer.style.display = 'none';

        firstAidSection.innerHTML = '';
        firstAidSection.appendChild(emergencyTypesGrid);
        firstAidSection.appendChild(instructionsContainer);

        this.instructionsContainer = instructionsContainer;
    }

    showInstructions(emergencyType) {
        if (!this.instructionsContainer) return;
        
        this.currentEmergencyType = emergencyType;
        this.currentInstructionIndex = 0;
        
        const instructions = this.getInstructions(emergencyType);
        const emergencyTypesGrid = document.getElementById('emergency-types-grid');
        
        if (emergencyTypesGrid) {
            emergencyTypesGrid.style.display = 'none';
        }
        
        this.instructionsContainer.style.display = 'block';
        const typeInfo = this.getEmergencyTypeInfo(emergencyType);
        
        this.instructionsContainer.innerHTML = `
            <div class="instructions-header ${emergencyType}-header">
                <button id="back-to-types-btn" class="back-btn" style="
                    color: white;
                    font-size: 30px;
                    padding: 10px;
                    background-color: #007bff;  /* Your desired background color */
                    border-radius: 80%;
                    width: 50px;
                    height: 50px;
                    margin-right: 50px;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="header-content">
                    <h2><i class="${typeInfo.icon}"></i> ${typeInfo.name}</h2>
                    <p>Follow these steps in order</p>
                </div>
            </div>
            
            <div class="instructions-content">
                <div class="instruction-step">
                    <div class="step-number">Step ${this.currentInstructionIndex + 1} of ${instructions.length}</div>
                    <div class="step-content">
                        <h3>${instructions[this.currentInstructionIndex].title}</h3>
                        <div class="step-description">
                            ${instructions[this.currentInstructionIndex].description}
                        </div>

                        ${instructions[this.currentInstructionIndex].note ? 
                            `<div class="step-note">
                                <i class="fas fa-info-circle"></i> ${instructions[this.currentInstructionIndex].note}
                            </div>` : ''}
                    </div>
                </div>
                
                ${emergencyType === 'cardiac' ? this.getCPRTimerHTML() : ''}
                
                <div class="instruction-navigation">
                    <button id="prev-instruction-btn" class="nav-btn" ${this.currentInstructionIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Previous
                    </button>
                    <button id="next-instruction-btn" class="nav-btn" ${this.currentInstructionIndex === instructions.length - 1 ? 'disabled' : ''}>
                        Next <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                
                <div class="emergency-call-reminder">
                    <i class="fas fa-phone-alt"></i>
                    <div class="reminder-text">
                        <strong>Remember:</strong> Always call emergency services (911) first in a serious emergency.
                    </div>
                </div>
            </div>
        `;
    }

    navigateInstructions(direction) {
        if (!this.currentEmergencyType) return;
        
        const instructions = this.getInstructions(this.currentEmergencyType);
        
        if (direction === 'next' && this.currentInstructionIndex < instructions.length - 1) {
            this.currentInstructionIndex++;
        } else if (direction === 'prev' && this.currentInstructionIndex > 0) {
            this.currentInstructionIndex--;
        } else {
            return;
        }
        
        const stepNumber = this.instructionsContainer.querySelector('.step-number');
        const stepTitle = this.instructionsContainer.querySelector('.step-content h3');
        const stepDescription = this.instructionsContainer.querySelector('.step-description');
        const prevBtn = this.instructionsContainer.querySelector('#prev-instruction-btn');
        const nextBtn = this.instructionsContainer.querySelector('#next-instruction-btn');
        
        if (stepNumber) {
            stepNumber.textContent = `Step ${this.currentInstructionIndex + 1} of ${instructions.length}`;
        }
        
        if (stepTitle) {
            stepTitle.textContent = instructions[this.currentInstructionIndex].title;
        }
        
        if (stepDescription) {
            stepDescription.innerHTML = instructions[this.currentInstructionIndex].description;
        }
        
        this.updateStepMedia(instructions[this.currentInstructionIndex]);
        
        if (prevBtn) {
            prevBtn.disabled = this.currentInstructionIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentInstructionIndex === instructions.length - 1;
        }
    }

    updateStepMedia(instruction) {
        const stepContent = this.instructionsContainer.querySelector('.step-content');
        let stepNote = this.instructionsContainer.querySelector('.step-note');
        
        // Handle note
        if (instruction.note) {
            if (stepNote) {
                stepNote.innerHTML = `<i class="fas fa-info-circle"></i> ${instruction.note}`;
            } else {
                stepNote = document.createElement('div');
                stepNote.className = 'step-note';
                stepNote.innerHTML = `<i class="fas fa-info-circle"></i> ${instruction.note}`;
                stepContent.appendChild(stepNote);
            }
        } else if (stepNote) {
            stepNote.remove();
        }
    }

    showEmergencyTypes() {
        const emergencyTypesGrid = document.getElementById('emergency-types-grid');
        if (emergencyTypesGrid) {
            emergencyTypesGrid.style.display = 'block';
        }
        
        if (this.instructionsContainer) {
            this.instructionsContainer.style.display = 'none';
        }
        
        this.currentEmergencyType = null;
        this.currentInstructionIndex = 0;
        this.stopCPRTimer();
    }

    getCPRTimerHTML() {
        return `
            <div class="cpr-timer-container">
                <h3><i class="fas fa-stopwatch"></i> CPR Compression Timer</h3>
                <p>Use this timer to maintain the correct compression rate (100-120 compressions per minute)</p>
                
                <div class="cpr-timer">
                    <div class="timer-display">
                        <div class="timer-count">0</div>
                        <div class="timer-label">compressions</div>
                    </div>
                    <div class="timer-rate">
                        <div class="rate-value">0</div>
                        <div class="rate-label">per minute</div>
                    </div>
                </div>
                
                <div class="timer-controls">
                    <button id="start-cpr-timer" class="timer-btn start-btn">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <button id="stop-cpr-timer" class="timer-btn stop-btn" disabled>
                        <i class="fas fa-pause"></i> Pause
                    </button>
                    <button id="reset-cpr-timer" class="timer-btn reset-btn" disabled>
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </div>
                
                <div class="cpr-beat-container">
                    <button class="cpr-beat-btn">
                        <i class="fas fa-hand-point-down"></i> Tap for each compression
                    </button>
                </div>
            </div>
        `;
    }

    startCPRTimer() {
        if (!this.cprCount) this.cprCount = 0;
        if (!this.cprStartTime) this.cprStartTime = Date.now();
        if (!this.cprRate) this.cprRate = 0;
        
        const startBtn = document.getElementById('start-cpr-timer');
        const stopBtn = document.getElementById('stop-cpr-timer');
        const resetBtn = document.getElementById('reset-cpr-timer');
        
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        if (resetBtn) resetBtn.disabled = false;
        
        this.cprTimerRunning = true;
        this.updateCPRTimer();
        this.startCPRBeat();
    }

    updateCPRTimer() {
        if (!this.cprTimerRunning) return;
        
        const elapsedTime = (Date.now() - this.cprStartTime) / 60000;
        
        if (elapsedTime > 0) {
            this.cprRate = Math.round(this.cprCount / elapsedTime);
        }
        
        const countDisplay = document.querySelector('.timer-count');
        const rateDisplay = document.querySelector('.rate-value');
        
        if (countDisplay) countDisplay.textContent = this.cprCount;
        if (rateDisplay) rateDisplay.textContent = this.cprRate;
        
        requestAnimationFrame(() => this.updateCPRTimer());
    }

    startCPRBeat() {
        // Visual metronome for CPR pace
        const idealRate = 110; // Target rate (middle of 100-120 range)
        const beatInterval = 60000 / idealRate; // Time between beats in ms
        
        this.cprBeatInterval = setInterval(() => {
            const beatBtn = document.querySelector('.cpr-beat-btn');
            if (beatBtn) {
                beatBtn.classList.add('pulse');
                setTimeout(() => {
                    beatBtn.classList.remove('pulse');
                }, 100);
            }
        }, beatInterval);
    }

    stopCPRTimer() {
        this.cprTimerRunning = false;
        
        const startBtn = document.getElementById('start-cpr-timer');
        const stopBtn = document.getElementById('stop-cpr-timer');
        
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        
        if (this.cprBeatInterval) {
            clearInterval(this.cprBeatInterval);
            this.cprBeatInterval = null;
        }
    }

    resetCPRTimer() {
        this.stopCPRTimer();
        this.cprCount = 0;
        this.cprStartTime = null;
        this.cprRate = 0;
        
        const countDisplay = document.querySelector('.timer-count');
        const rateDisplay = document.querySelector('.rate-value');
        const resetBtn = document.getElementById('reset-cpr-timer');
        
        if (countDisplay) countDisplay.textContent = '0';
        if (rateDisplay) rateDisplay.textContent = '0';
        if (resetBtn) resetBtn.disabled = true;
    }

    incrementCPRCount() {
        if (!this.cprTimerRunning) return;
        
        this.cprCount++;
        const countDisplay = document.querySelector('.timer-count');
        if (countDisplay) {
            countDisplay.textContent = this.cprCount;
        }
    }

    getEmergencyTypeInfo(type) {
        const types = {
            cardiac: { name: 'Cardiac Emergency', icon: 'fas fa-heartbeat' },
            choking: { name: 'Choking', icon: 'fas fa-lungs' },
            bleeding: { name: 'Severe Bleeding', icon: 'fas fa-tint' },
            burns: { name: 'Burns', icon: 'fas fa-fire' },
            fracture: { name: 'Fractures', icon: 'fas fa-bone' },
            stroke: { name: 'Stroke', icon: 'fas fa-brain' },
            poisoning: { name: 'Poisoning', icon: 'fas fa-skull-crossbones' },
            seizure: { name: 'Seizure', icon: 'fas fa-bolt' },
            heatstroke: { name: 'Heatstroke', icon: 'fas fa-temperature-high' },
            allergic: { name: 'Allergic Reaction', icon: 'fas fa-allergies' },
            drowning: { name: 'Drowning', icon: 'fas fa-water' },
            snakebite: { name: 'Snake Bite', icon: 'fas fa-syringe' }
        };
        
        return types[type] || { name: 'Emergency', icon: 'fas fa-first-aid' };
    }

    getInstructions(type) {
        // Instructions database
        const instructionsDB = {
            cardiac: [
                {
                    title: 'Check Responsiveness',
                    description: 'Tap the person and shout "Are you OK?" If there is no response, the person is unconscious.',
                    note: 'If the person responds, keep them still and call for help.'
                },
                {
                    title: 'Call Emergency Services (911)',
                    description: 'Ask someone to call 911 immediately. If you\'re alone, call 911 yourself.'
                },
                {
                    title: 'Check Breathing',
                    description: 'Look, listen, and feel for breathing for no more than 10 seconds. If the person is not breathing or only gasping, begin CPR.'
                },
                {
                    title: 'Begin Chest Compressions',
                    description: '<ol><li>Place the person on their back on a firm surface.</li><li>Kneel beside them.</li><li>Place the heel of one hand on the center of the chest (lower half of sternum).</li><li>Place your other hand on top of the first.</li><li>Keep your elbows straight and position your shoulders directly above your hands.</li></ol>'
                },
                {
                    title: 'Perform CPR',
                    description: '<ol><li>Push hard and fast: Compress the chest at least 2 inches deep at a rate of 100-120 compressions per minute.</li><li>Allow the chest to completely recoil after each compression.</li><li>Minimize interruptions in compressions.</li></ol>',
                    note: 'Use the CPR timer below to help maintain the correct pace.'
                },
                {
                    title: 'Use AED if Available',
                    description: '<ol><li>As soon as an AED (Automated External Defibrillator) is available, turn it on.</li><li>Follow the voice/visual prompts.</li><li>Attach the pads to the person\'s bare chest as shown in the AED diagram.</li><li>Make sure no one is touching the person when the AED is analyzing.</li></ol>',
                    note: 'If the AED advises a shock, make sure no one is touching the person and press the shock button.'
                },
                {
                    title: 'Continue CPR',
                    description: 'Resume CPR immediately after the shock is delivered or if no shock is advised. Continue until emergency services arrive or the person shows signs of life.'
                }
            ],
            choking: [
                {
                    title: 'Identify Choking',
                    description: 'Signs of choking include:<ul><li>Inability to talk</li><li>Difficulty breathing or noisy breathing</li><li>Inability to cough forcefully</li><li>Skin, lips, or nails turning blue or dusky</li><li>Loss of consciousness</li></ul>',
                    note: 'If the person can cough forcefully, encourage them to continue coughing.'
                },
                {
                    title: 'Give 5 Back Blows',
                    description: '<ol><li>Stand behind the person and slightly to one side.</li><li>Support their chest with one hand and lean them forward.</li><li>Give 5 sharp blows between the shoulder blades with the heel of your hand.</li></ol>'
                },
                {
                    title: 'Give 5 Abdominal Thrusts (Heimlich Maneuver)',
                    description: '<ol><li>Stand behind the person and wrap your arms around their waist.</li><li>Make a fist with one hand and place it just above the person\'s navel.</li><li>Grasp your fist with your other hand.</li><li>Press hard into the abdomen with a quick, upward thrust.</li><li>Repeat 5 times.</li></ol>',
                    note: 'For pregnant women or obese persons, give chest thrusts instead of abdominal thrusts.'
                },
                {
                    title: 'Alternate Between 5 Back Blows and 5 Abdominal Thrusts',
                    description: 'Continue this cycle until:<ul><li>The object is forced out</li><li>The person begins to breathe or cough</li><li>The person becomes unconscious</li></ul>'
                },
                {
                    title: 'If the Person Becomes Unconscious',
                    description: '<ol><li>Carefully lower them to the ground.</li><li>Call 911 if not already done.</li><li>Begin CPR, starting with chest compressions.</li><li>Each time you open the airway to give rescue breaths, look in the mouth for the object. If you see it, remove it.</li></ol>'
                }
            ],
            bleeding: [
                {
                    title: 'Ensure Safety',
                    description: 'Make sure the scene is safe. Wear gloves if available to protect yourself from bloodborne pathogens.',
                    note: 'If gloves aren\'t available, use multiple layers of clean cloth, plastic bags, or have the victim apply pressure themselves if possible.'
                },
                {
                    title: 'Apply Direct Pressure',
                    description: '<ol><li>Remove any obvious debris or dirt from the wound.</li><li>Apply firm, steady pressure directly on the wound using a clean cloth, gauze pad, or clothing.</li><li>Maintain pressure for at least 15 minutes.</li></ol>'
                },
                {
                    title: 'Elevate the Wound',
                    description: 'If possible, elevate the wounded area above the level of the heart to help reduce blood flow to the area.'
                },
                {
                    title: 'Apply a Pressure Bandage',
                    description: '<ol><li>Once bleeding slows, apply a pressure bandage by wrapping the wound firmly.</li><li>The bandage should be tight enough to maintain pressure but not so tight that it cuts off circulation.</li></ol>',
                    note: 'Check for pulse below the bandage. If you cannot feel a pulse, loosen the bandage slightly.'
                },
                {
                    title: 'Use a Tourniquet (Last Resort)',
                    description: 'For life-threatening limb bleeding that cannot be controlled with direct pressure:<ol><li>Place the tourniquet 2-3 inches above the wound (not on a joint).</li><li>Pull the strap tight.</li><li>Twist the rod until bleeding stops.</li><li>Secure the rod and note the time applied.</li></ol>',
                    note: 'Only use a tourniquet for severe, life-threatening bleeding that cannot be controlled by other means.'
                },
                {
                    title: 'Monitor and Seek Medical Help',
                    description: '<ul><li>Call 911 for severe bleeding.</li><li>Monitor for signs of shock: pale skin, rapid breathing, confusion.</li><li>Keep the person warm and calm.</li><li>Do not remove bandages to check the wound - add more if blood soaks through.</li></ul>'
                }
            ],
            burns: [
                {
                    title: 'Ensure Safety',
                    description: 'Remove the person from the source of the burn. For electrical burns, make sure the power source is off before touching the person.',
                    note: 'For chemical burns, brush off dry chemicals first, then rinse with cool running water.'
                },
                {
                    title: 'Assess Burn Severity',
                    description: '<ul><li><strong>First-degree:</strong> Red, painful, dry (like a sunburn)</li><li><strong>Second-degree:</strong> Blisters, very painful, swelling</li><li><strong>Third-degree:</strong> White or charred, may be painless due to nerve damage</li></ul>',
                    note: 'Call 911 immediately for third-degree burns, burns covering large areas, or burns on the face, hands, feet, genitals, or major joints.'
                },
                {
                    title: 'Cool the Burn',
                    description: '<ol><li>Run cool (not cold) water over the burn for 10-15 minutes.</li><li>Do not use ice, as it can cause further damage.</li><li>Do not apply butter, oil, or ointments to the burn.</li></ol>'
                },
                {
                    title: 'Cover the Burn',
                    description: '<ol><li>Cover the burn with a sterile, non-stick bandage or clean cloth.</li><li>Wrap loosely to avoid putting pressure on the burned skin.</li><li>Do not break blisters as this increases risk of infection.</li></ol>'
                },
                {
                    title: 'Manage Pain',
                    description: 'Take over-the-counter pain relievers such as ibuprofen (Advil, Motrin) or acetaminophen (Tylenol) if needed.',
                    note: 'For minor burns, aloe vera gel can help soothe the skin after cooling.'
                },
                {
                    title: 'Seek Medical Attention',
                    description: 'Get medical help if:<ul><li>The burn is larger than 3 inches in diameter</li><li>The burn involves the face, hands, feet, genitals, or major joints</li><li>The burn appears to be deep (third-degree)</li><li>The person shows signs of shock</li><li>The burn was caused by chemicals, electricity, or an explosion</li></ul>'
                }
            ],
            fracture: [
                {
                    title: 'Recognize Fracture Signs',
                    description: 'Look for:<ul><li>Pain that intensifies with movement</li><li>Swelling and bruising</li><li>Deformity or abnormal position</li><li>Inability to bear weight or use the injured area</li><li>Grinding sensation (crepitus)</li></ul>'
                },
                {
                    title: 'Call for Help',
                    description: 'Call 911 for serious fractures, especially if:<ul><li>The bone has broken through the skin (open fracture)</li><li>The fracture involves the head, neck, or spine</li><li>The person cannot move or has lost sensation</li><li>There is heavy bleeding</li></ul>'
                },
                {
                    title: 'Immobilize the Injury',
                    description: '<ol><li>Do not try to realign the bone or push a bone that\'s sticking out back in.</li><li>If possible, immobilize the area using a splint.</li><li>Pad the splint with soft material to prevent additional pain.</li><li>Extend the splint beyond the joints above and below the fracture.</li></ol>',
                    note: 'For improvised splints, use rigid materials like boards, rolled magazines, or cardboard.'
                },
                {
                    title: 'Apply Ice',
                    description: 'Apply ice packs wrapped in a towel to the area to reduce swelling and pain. Apply for 20 minutes at a time.',
                    note: 'Never apply ice directly to the skin.'
                },
                {
                    title: 'Elevate the Injury',
                    description: 'If possible, elevate the injured area above the level of the heart to reduce swelling.'
                },
                {
                    title: 'Monitor for Shock',
                    description: 'Watch for signs of shock:<ul><li>Pale, clammy skin</li><li>Rapid, shallow breathing</li><li>Weakness or fainting</li><li>Rapid pulse</li><li>Confusion</li></ul>',
                    note: 'If shock is suspected, have the person lie flat, elevate the legs if possible, and keep them warm with a blanket.'
                }
            ],
            stroke: [
                {
                    title: 'Recognize Stroke Signs - FAST',
                    description: '<ul><li><strong>F</strong> - Face Drooping: Ask the person to smile. Does one side of the face droop?</li><li><strong>A</strong> - Arm Weakness: Ask the person to raise both arms. Does one arm drift downward?</li><li><strong>S</strong> - Speech Difficulty: Ask the person to repeat a simple phrase. Is their speech slurred or strange?</li><li><strong>T</strong> - Time to Call 911: If you observe any of these signs, call 911 immediately.</li></ul>',
                    note: 'Note the time when symptoms first appeared. This information is critical for treatment decisions.'
                },
                {
                    title: 'Call 911 Immediately',
                    description: 'Stroke is a medical emergency. Call 911 right away, even if symptoms seem to improve.',
                    note: 'Specifically mention that you suspect a stroke so emergency services can prepare appropriate care.'
                },
                {
                    title: 'Check Vital Signs',
                    description: 'Monitor the person\'s breathing and pulse. Be prepared to perform CPR if necessary.'
                },
                {
                    title: 'Position the Person',
                    description: 'Help the person lie down with their head slightly elevated and turned to the side. This can help prevent choking if they vomit.'
                },
                {
                    title: 'Do NOT Give Medication',
                    description: 'Do not give the person any medication, food, or drinks. They may have difficulty swallowing and could choke.',
                    note: 'This includes aspirin, which is given for heart attacks but not for strokes without medical supervision.'
                },
                {
                    title: 'Reassure the Person',
                    description: 'Keep the person calm and reassured while waiting for emergency services. Stroke can be frightening for the victim.'
                }
            ],
            poisoning: [
                {
                    title: 'Ensure Safety',
                    description: 'Make sure the area is safe and you won\'t be exposed to the poison. Remove the person from any source of poison if possible.',
                    note: 'For chemical exposures, be careful not to contaminate yourself.'
                },
                {
                    title: 'Call Poison Control',
                    description: 'Call the Poison Control Center at 1-800-222-1222 immediately. Be ready to provide:<ul><li>The person\'s age and weight</li><li>Any known medical conditions</li><li>The substance involved (have container if possible)</li><li>Time of exposure</li><li>Current symptoms</li></ul>'
                },
                {
                    title: 'Follow Poison Control Instructions',
                    description: 'Follow the instructions given by Poison Control exactly. Do not induce vomiting or give anything by mouth unless specifically instructed to do so.'
                },
                {
                    title: 'Monitor Vital Signs',
                    description: 'Monitor the person\'s breathing, pulse, and level of consciousness. Be prepared to perform CPR if needed.'
                },
                {
                    title: 'Collect Information for Medical Personnel',
                    description: 'Collect the poison container, any vomited material, or other evidence to help medical personnel identify the poison.'
                }
            ],
            seizure: [
                {
                    title: 'Ensure Safety',
                    description: '<ol><li>Help the person to the ground if they\'re not already there.</li><li>Clear the area of furniture or other objects that could cause injury.</li><li>Place something soft under their head if possible.</li></ol>',
                    note: 'Do NOT restrain the person or put anything in their mouth.'
                },
                {
                    title: 'Time the Seizure',
                    description: 'Note when the seizure starts and how long it lasts. Call 911 if:<ul><li>The seizure lasts longer than 5 minutes</li><li>The person doesn\'t wake up after the seizure ends</li><li>The person has another seizure shortly after the first</li><li>The person is injured during the seizure</li><li>The person has never had a seizure before</li><li>The person is pregnant or has diabetes</li></ul>'
                },
                {
                    title: 'Position the Person',
                    description: 'Once the seizure stops, roll the person onto their side (recovery position) to help prevent choking if they vomit.'
                },
                {
                    title: 'Provide Comfort and Reassurance',
                    description: 'Stay with the person until they are fully conscious and aware of their surroundings. Speak calmly and reassuringly.'
                },
                {
                    title: 'Document What Happened',
                    description: 'Make note of:<ul><li>How the person acted before the seizure</li><li>What body parts were involved</li><li>Type of movements or behaviors during the seizure</li><li>How long it lasted</li><li>How the person acted after the seizure</li></ul>'
                }
            ],
            heatstroke: [
                {
                    title: 'Call 911',
                    description: 'Heatstroke is a life-threatening emergency. Call 911 immediately.',
                    note: 'Signs of heatstroke include: high body temperature (103°F or higher), hot, red, dry or damp skin, fast, strong pulse, headache, dizziness, nausea, confusion, and loss of consciousness.'
                },
                {
                    title: 'Move to a Cool Place',
                    description: 'Move the person to a cooler environment, preferably air-conditioned. If outdoors, move to a shady area.'
                },
                {
                    title: 'Cool the Body',
                    description: '<ol><li>Remove excess clothing.</li><li>Cool the person using whatever methods available: place in a cool bath, spray with cool water, apply cold wet towels to the body, especially to the head, neck, armpits, and groin.</li><li>Fan air over the person while wetting their skin.</li></ol>'
                },
                {
                    title: 'Monitor Body Temperature',
                    description: 'If possible, check the person\'s temperature. Continue cooling efforts until body temperature drops to 101-102°F (38.3-38.9°C).'
                },
                {
                    title: 'Hydrate if Conscious',
                    description: 'If the person is conscious and able to swallow, give cool water or a sports drink to sip. Do not give fluids if the person is unconscious.'
                }
            ],
            allergic: [
                {
                    title: 'Identify Severe Allergic Reaction (Anaphylaxis)',
                    description: 'Look for:<ul><li>Skin reactions: hives, itching, flushed or pale skin</li><li>Swelling of the face, lips, tongue, or throat</li><li>Difficulty breathing or wheezing</li><li>Rapid, weak pulse</li><li>Nausea, vomiting, or diarrhea</li><li>Dizziness or fainting</li></ul>',
                    note: 'Anaphylaxis is life-threatening and requires immediate emergency treatment.'
                },
                {
                    title: 'Use Epinephrine Auto-Injector if Available',
                    description: 'If the person has a prescribed epinephrine auto-injector (like an EpiPen):<ol><li>Remove the safety cap.</li><li>Hold the auto-injector firmly against the outer thigh, through clothing if necessary.</li><li>Hold in place for 3-10 seconds (follow device instructions).</li></ol>',
                    note: 'The injection can be given through thin clothing if necessary. Always follow the specific instructions for the device.'
                },
                {
                    title: 'Call 911',
                    description: 'Call 911 immediately, even if symptoms improve after using epinephrine. The person needs medical monitoring.',
                    note: 'Mention that it\'s an allergic reaction and whether epinephrine was administered.'
                },
                {
                    title: 'Help with Positioning',
                    description: '<ul><li>If the person is having trouble breathing, help them sit up.</li><li>If they are dizzy or feeling faint, help them lie flat with legs elevated.</li><li>If vomiting or having trouble breathing while lying down, help them lie on their side.</li></ul>'
                },
                {
                    title: 'Give a Second Dose if Available',
                    description: 'If symptoms don\'t improve or worsen after 5-15 minutes and a second auto-injector is available, give a second injection.',
                    note: 'Always follow emergency dispatcher instructions while waiting for help to arrive.'
                },
                {
                    title: 'Monitor Vital Signs',
                    description: 'Monitor the person\'s breathing and pulse. Be prepared to perform CPR if necessary.'
                }
            ],
            drowning: [
                {
                    title: 'Ensure Safety',
                    description: 'Before attempting a rescue, ensure your own safety:<ul><li>If possible, reach out with an object the person can grab</li><li>Throw a flotation device if available</li><li>Only enter the water if you are trained in water rescue</li></ul>',
                    note: 'Remember: "Reach, throw, row, go" - only enter the water as a last resort.'
                },
                {
                    title: 'Call 911',
                    description: 'Call 911 immediately or ask someone else to call while you begin rescue efforts.'
                },
                {
                    title: 'Remove from Water',
                    description: 'Get the person out of the water as quickly and safely as possible. Support their head and neck if a spinal injury is suspected.'
                },
                {
                    title: 'Check for Responsiveness',
                    description: 'Check if the person is conscious by tapping them and shouting "Are you okay?"'
                },
                {
                    title: 'Begin CPR if Needed',
                    description: 'If the person is not breathing:<ol><li>Place them on their back on a firm surface</li><li>Begin CPR immediately, starting with chest compressions</li><li>Continue until help arrives or the person begins breathing</li></ol>',
                    note: 'Do not waste time trying to remove water from the lungs first.'
                },
                {
                    title: 'Recovery Position',
                    description: 'If the person is breathing, place them in the recovery position (on their side with the head tilted back) to prevent choking if they vomit.'
                },
                {
                    title: 'Keep Warm',
                    description: 'Remove wet clothing if possible and cover with dry blankets to prevent hypothermia.'
                }
            ],
            snakebite: [
                {
                    title: 'Ensure Safety',
                    description: 'Move the person away from the snake. Do not attempt to catch or kill the snake.',
                    note: 'Try to remember the snake\'s appearance for identification, but prioritize the victim\'s care.'
                },
                {
                    title: 'Call 911',
                    description: 'Call emergency services immediately. All snakebites should be treated as medical emergencies.'
                },
                {
                    title: 'Keep the Person Calm and Still',
                    description: 'Have the person lie down with the bite site below the level of the heart. Keep them as still as possible to slow the spread of venom.',
                    note: 'Reassure the person as anxiety can increase heart rate and speed venom circulation.'
                },
                {
                    title: 'Remove Constricting Items',
                    description: 'Remove rings, watches, bracelets, shoes, or tight clothing near the bite site before swelling begins.'
                },
                {
                    title: 'Clean the Wound',
                    description: 'Gently wash the bite with soap and water if available. Cover with a clean, dry bandage.',
                    note: 'Do not scrub or apply pressure to the wound.'
                },
                {
                    title: 'DO NOT Do These Things',
                    description: '<ul><li>Do not cut the bite or attempt to suck out the venom</li><li>Do not apply a tourniquet or ice</li><li>Do not give the person alcohol or medications</li><li>Do not apply electric shock</li><li>Do not attempt to capture the snake</li></ul>',
                    note: 'Many traditional snakebite remedies can cause more harm than good.'
                },
                {
                    title: 'Monitor for Symptoms',
                    description: 'Watch for:<ul><li>Severe pain and swelling around the bite</li><li>Redness or discoloration</li><li>Difficulty breathing</li><li>Blurred vision</li><li>Nausea and vomiting</li><li>Numbness or tingling</li><li>Increased sweating</li><li>Weakness or dizziness</li></ul>'
                }
            ]
        };
        
        return instructionsDB[type] || [];
    }
}

// Initialize the first aid instructions module
const firstAidInstructions = new FirstAidInstructions();
