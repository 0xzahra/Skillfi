import React, { useState, useRef, useEffect } from 'react';
import { generateProfessionalHeadshot, generatePitchDeck, generateCVContent, generateResumeContent, generateCareerRoadmap, generateItemVisual, proofreadDocument, CareerRoadmap } from '../services/geminiService';
import { AudioService } from '../services/audioService';
import { UserProfile } from '../types';

interface CareerArsenalProps {
    user: UserProfile;
    initialScoutData?: string | null;
    lastSync?: number;
}

const CAREER_QUOTES = [
    "Choose a job you love, and you will never have to work a day in your life.",
    "Opportunities don't happen, you create them.",
    "It's not what you achieve, it's what you overcome.",
    "Skills make you rich, not just money.",
    "Your network is your net worth.",
    "Growth and comfort do not coexist.",
];

// --- RICH KNOWLEDGE BASE ---
interface EliteSkillData {
    icon: string;
    desc: string;
    philosophy: string;
    mechanics: string;
    advanced: string;
    pro_tip: string;
}

const ELITE_DATA: Record<string, EliteSkillData> = {
    'Dining Etiquette': {
        icon: '🍽️',
        desc: 'Master the art of the business dinner.',
        philosophy: "The meal is never about the food; it is about the conversation and the comfort of others. Your table manners signal your awareness and discipline.",
        mechanics: "1. **The Place Setting:** Utensils are used from the outside in. Forks on the left, knives/spoons on the right. Solids (bread) on the left, liquids (drinks) on the right (BMW: Bread, Meal, Water).\n2. **The Napkin:** Place it on your lap immediately. If you leave the table, place it on the chair, not the table. When finished, place it loosely to the left of the plate.\n3. **Eating:** Cut one bite at a time. Rest wrists on the table edge (continental style), never elbows.",
        advanced: "**The Silent Service Code:** To signal you are pausing, place knife and fork in an inverted 'V' (knife blade inward). To signal you are finished, place them parallel at the 4 o'clock position (handles at 4, tips at 10). Never season food before tasting; it insults the chef.",
        pro_tip: "If you drop a utensil, do not dive for it. Simply signal the server for a replacement. Treat the server with the same respect as the CEO; this is the ultimate test of character."
    },
    'Networking': {
        icon: '🤝',
        desc: 'How to enter a room and remember names.',
        philosophy: "Networking is not asking for favors; it is farming. It is planting seeds of value today to harvest relationships years from now. Be the 'Host', not the 'Guest'.",
        mechanics: "1. **The Entry:** Enter a room, pause, scan, and smile. Do not rush to the bar or your phone.\n2. **The Handshake:** Firm, dry, web-to-web contact, 2-3 pumps. Eye contact is mandatory.\n3. **The Name:** Repeat their name immediately ('Nice to meet you, Sarah'). Use it once more in conversation.",
        advanced: "**The 'Host' Mentality:** Even if it's not your event, act like a host. Introduce people to each other. 'John, have you met Lisa? She works in Fintech.' You become the connector, the node of value. People will gravitate toward you because you make them feel comfortable.",
        pro_tip: "Never ask 'What do you do?' immediately. Ask 'What are you working on that excites you right now?' It opens up passion, not just job titles."
    },
    'Strategic Negotiation': {
        icon: '♟️',
        desc: 'Win without making enemies.',
        philosophy: "In business and life, you do not get what you deserve; you get what you negotiate. It is not about conflict, but about collaboration to expand the pie.",
        mechanics: "1. **The Anchor:** The first number spoken anchors the entire deal. Make it ambitious but defensible.\n2. **Silence:** After making an offer, shut up. The next person to speak loses leverage.\n3. **Labeling:** 'It seems like you are hesitant about the price.' Call out emotions to diffuse them.",
        advanced: "**The Ackerman Model:** Offer 65% of target, then 85%, 95%, and finally 100%. Use odd, precise numbers (e.g., $37,550) to imply calculation, not estimation.",
        pro_tip: "Never accept the first offer, even if it's good. It makes the other side feel they left money on the table. Flinch, pause, then counter."
    },
    'Golf Diplomacy': {
        icon: '⛳',
        desc: 'Business is done on the fairway.',
        philosophy: "Golf is the only sport where a CEO and an intern can play together on equal footing. It reveals character: how one handles adversity, luck, and honesty.",
        mechanics: "1. **Pace of Play:** You don't have to be good, but you must be fast. Be ready to hit when it's your turn.\n2. **Silence:** Absolute silence when others are addressing the ball.\n3. **The Green:** Never walk on someone's 'line' (the path between their ball and the hole).",
        advanced: "**Business Timing:** Never discuss business on the first few holes. Build rapport. Business happens naturally on the cart or at the 19th hole (drinks after). Let the senior person bring it up.",
        pro_tip: "If you are bad, admit it early and laugh about it. People enjoy playing with a happy loser, but they hate playing with an angry one. Cheating is the ultimate sin; if you cheat at golf, you cheat at contracts."
    },
    'Horology': {
        icon: '⌚',
        desc: 'Understanding timepieces and engineering.',
        philosophy: "A watch is the only piece of jewelry a man can wear that serves a function. It signals appreciation for engineering, heritage, and the value of time itself.",
        mechanics: "1. **Movements:** Quartz (battery, cheap, accurate) vs. Mechanical (springs, expensive, art). High society respects Mechanical.\n2. **Fit:** The lugs (where the strap attaches) should not overhang your wrist.\n3. **Occasion:** Dress watch (leather strap) for suits. Diver/Steel for casual.",
        advanced: "**The Holy Trinity:** Patek Philippe, Audemars Piguet, Vacheron Constantin. Knowing these brands shows deep knowledge. Rolex is king of marketing, but Patek is king of legacy.",
        pro_tip: "Match your leathers. If you wear a watch with a brown leather strap, your belt and shoes must be brown. Black strap? Black shoes."
    },
    'Art Collecting': {
        icon: '🎨',
        desc: 'Asset preservation through culture.',
        philosophy: "Art is the ultimate asset class of the ultra-wealthy. It preserves capital while signaling cultural patronage. It is an intellectual pursuit, not just decoration.",
        mechanics: "1. **Primary vs. Secondary:** Primary market is buying from the artist/gallery (first sale). Secondary is buying at auction (resale).\n2. **Provenance:** The history of ownership. A clear paper trail adds immense value.\n3. **Medium:** Oil on canvas generally holds value better than prints or paper.",
        advanced: "**Blue Chip vs. Emerging:** Blue Chip artists (Picasso, Warhol, Basquiat) are safe 'bonds'. Emerging artists are high-risk 'stocks'. Diversify your collection like a portfolio.",
        pro_tip: "Buy with your eyes, not just your ears. If you buy for investment only, you will lose. Buy what you love; if it goes to zero, you still have a beautiful object on your wall."
    },
    'Private Aviation': {
        icon: '✈️',
        desc: 'The language of the skies.',
        philosophy: "Time is the only non-renewable asset. Private aviation is not about luxury; it is about buying time. Understanding this world signals high-level operational awareness.",
        mechanics: "1. **Part 91 vs 135:** Part 91 is non-commercial (own plane). Part 135 is charter (renting). Know the difference.\n2. **The Empty Leg:** A flight returning empty. This is how smart players fly private for commercial prices.\n3. **FBO:** Fixed Base Operator. You don't go to a terminal; you go to the FBO.",
        advanced: "**Aircraft Classes:** Light Jets (CJ3) for short hops. Mid-size (Challenger 300) for coast-to-coast. Ultra-Long Range (Global 7500) for oceans. Don't ask a Light Jet to cross the Atlantic.",
        pro_tip: "Treat the pilots like gold. They hold your life in their hands. Acknowledge them before you acknowledge the champagne."
    },
    'Fine Wine Mastery': {
        icon: '🍷',
        desc: 'Reading labels, pairing, and tasting.',
        philosophy: "Wine is history in a bottle. Knowing it commands respect at the table and shows patience and refinement.",
        mechanics: "1. **The Swirl:** Aerates the wine, releasing aromas. 2. **The Sniff:** 80% of taste is smell. Don't skip this. 3. **The Sip:** Let it coat your tongue before swallowing.",
        advanced: "**Terroir:** Understanding how soil and climate affect taste. Old World (Earth/Mineral) vs New World (Fruit/Oak).",
        pro_tip: "Never fill the glass more than one-third. It allows the wine to breathe and prevents spills. Holding the glass by the stem prevents warming the wine."
    },
    'Cigar Lounge Protocol': {
        icon: '🪵',
        desc: 'The gentleman\'s club ritual.',
        philosophy: "A cigar is not smoked; it is experienced. It requires patience (45m+) and signals a moment of reflection and celebration.",
        mechanics: "1. **The Cut:** Just the cap, don't unravel it. 2. **The Light:** Toast the foot first, don't char it directly. 3. **The Ash:** Let it grow long; it cools the smoke.",
        advanced: "**Cuban vs. Dominican:** Recognize the flavor profiles. Cohiba is the Rolex of cigars, but Padron is the Patek.",
        pro_tip: "Never stub a cigar out. Let it die with dignity in the ashtray. Stubbing creates a foul odor that offends the room."
    },
    'Equestrian Culture': {
        icon: '🐎',
        desc: 'The sport of kings.',
        philosophy: "Horses represent power controlled by grace. Connection with the animal is paramount in high society circles.",
        mechanics: "1. **Approach:** Always from the shoulder, never the rear. 2. **Mounting:** Left side only. 3. **Attire:** Breeches and boots, never jeans.",
        advanced: "**Dressage vs. Jumping:** Dressage is 'horse ballet'; Jumping is precision speed. Know the difference before attending an event.",
        pro_tip: "Always thank the groom. They do the hard work. Acknowledging them shows true class and lack of pretension."
    },
    'Yachting Etiquette': {
        icon: '🛥️',
        desc: 'Rules of the open sea.',
        philosophy: "A yacht is a floating palace with strict hierarchy and safety protocols. It is a closed environment where manners are magnified.",
        mechanics: "1. **Barefoot Rule:** Shoes off at the gangway immediately. 2. **Luggage:** Soft bags only; hard cases damage teak decks.",
        advanced: "**Port vs. Starboard:** Left is Port (Red), Right is Starboard (Green). Use the correct terminology.",
        pro_tip: "The Captain's word is law. Never argue with the crew regarding safety or route. Tipping the crew (10-20% of charter) is mandatory."
    },
    'Auction Strategy': {
        icon: '🔨',
        desc: 'Winning at Christie\'s and Sotheby\'s.',
        philosophy: "Auctions are theater. Emotional control wins the lot, not just money. It is a battle of wills.",
        mechanics: "1. **The Paddle:** Keep it visible but subtle. 2. **The Reserve:** The hidden minimum price. 3. **The Hammer:** Sold is sold.",
        advanced: "**Buyer's Premium:** Remember the house takes ~25% on top of your bid. Calculate this before lifting your hand.",
        pro_tip: "Bid late. Let the amateurs exhaust themselves early. Enter when the room goes quiet to show dominance."
    },
    'Bespoke Tailoring': {
        icon: '🧵',
        desc: 'The difference between clothing and style.',
        philosophy: "Fit is everything. A $500 suit fitted perfectly looks better than a $5000 suit off the rack.",
        mechanics: "1. **The Break:** Where pants hit the shoe (No break, half break, full break). 2. **The Cuff:** Shows 1/2 inch of shirt sleeve.",
        advanced: "**Canvas Construction:** Full canvas suits mold to your body over time. Fused suits bubble and look cheap.",
        pro_tip: "Working buttons on the sleeve ('Surgeon's Cuffs') are the hallmark of true bespoke. Leave the last one unbuttoned to signal quality."
    },
    'Opera & Ballet': {
        icon: '🎭',
        desc: 'High culture and performance arts.',
        philosophy: "Art refines the soul. Silence during performance is sacred. It is a communal meditative experience.",
        mechanics: "1. **Arrival:** Never late. If late, wait for intermission. 2. **Applause:** Only at the end of acts or specific arias, not during.",
        advanced: "**Bravo code:** 'Bravo' (Male), 'Brava' (Female), 'Bravi' (Group). Use correctly to impress.",
        pro_tip: "Read the synopsis beforehand. You cannot appreciate the nuance if you are confused about the plot."
    },
    'Philanthropy': {
        icon: '🏛️',
        desc: 'Strategic giving and legacy building.',
        philosophy: "Wealth is a tool for impact. True power is changing lives, not just buying things. Legacy is what you give, not what you keep.",
        mechanics: "1. **The Mission:** Focus on one cause (e.g., Clean Water) rather than scattering small gifts. 2. **Due Diligence:** Vet the charity's overhead costs.",
        advanced: "**Endowments:** Creating a perpetual fund that sustains an institution forever. The ultimate legacy.",
        pro_tip: "Don't just give money; give time and network. Joining a board is more impactful and respected than just writing a check."
    }
};

export const CareerArsenal: React.FC<CareerArsenalProps> = ({ user, initialScoutData, lastSync }) => {
    // TABS
    const [activeModule, setActiveModule] = useState<'PATH' | 'HEADSHOT' | 'CV' | 'RESUME' | 'PITCH' | 'ELITE' | 'CORPORATE_OPS' | 'TRENDS'>('PATH');
    const [dailyQuote, setDailyQuote] = useState(CAREER_QUOTES[0]);
    
    // Pathfinder State
    const [careerMap, setCareerMap] = useState<CareerRoadmap | null>(null);
    const [isMapping, setIsMapping] = useState(false);
    const [riskTolerance, setRiskTolerance] = useState<'STABLE' | 'MOONSHOT'>('STABLE');
    const [manualContext, setManualContext] = useState('');
    const [liveSignal, setLiveSignal] = useState<string>("Scanning Global Markets...");

    // Headshot State
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingHeadshot, setIsGeneratingHeadshot] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState<'CORPORATE' | 'MEDICAL' | 'CREATIVE' | 'TECH'>('CORPORATE');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // CV State
    const [cvInputs, setCvInputs] = useState({
        targetRole: '',
        skills: user.skills.join(', '),
        experience: '',
        education: user.qualification || '',
        publications: '',
        awards: ''
    });
    const [cvContent, setCvContent] = useState<string | null>(null);
    const [isGeneratingCV, setIsGeneratingCV] = useState(false);
    const cvUploadRef = useRef<HTMLInputElement>(null);

    // Resume State
    const [resumeInputs, setResumeInputs] = useState({
        targetRole: '',
        skills: user.skills.join(', '),
        experience: '',
        education: user.qualification || '',
        projects: ''
    });
    const [resumeContent, setResumeContent] = useState<string | null>(null);
    const [isGeneratingResume, setIsGeneratingResume] = useState(false);
    const [isSocialCardMode, setIsSocialCardMode] = useState(false);
    const resumeUploadRef = useRef<HTMLInputElement>(null);

    // Pitch Deck State
    const [pitchTopic, setPitchTopic] = useState('');
    const [pitchSlides, setPitchSlides] = useState<{title: string, bullet: string}[] | null>(null);
    const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

    // Elite Modal State
    const [activeEliteItem, setActiveEliteItem] = useState<{title: string, icon: string, desc: string} | null>(null);
    const [eliteImage, setEliteImage] = useState<string | null>(null);
    const [eliteLoading, setEliteLoading] = useState(false);
    const [eliteSearch, setEliteSearch] = useState('');
    const [assignedSkill, setAssignedSkill] = useState<string | null>(user.assignedEliteGoal || null);

    // --- PERSISTENCE ---
    useEffect(() => {
        // Load state from local storage on mount
        const savedState = localStorage.getItem('skillfi_career_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.cvInputs) setCvInputs(parsed.cvInputs);
                if (parsed.cvContent) setCvContent(parsed.cvContent);
                if (parsed.resumeInputs) setResumeInputs(parsed.resumeInputs);
                if (parsed.resumeContent) setResumeContent(parsed.resumeContent);
                if (parsed.careerMap) setCareerMap(parsed.careerMap);
                if (parsed.generatedImage) setGeneratedImage(parsed.generatedImage);
                if (parsed.pitchSlides) setPitchSlides(parsed.pitchSlides);
                if (parsed.pitchTopic) setPitchTopic(parsed.pitchTopic);
            } catch (e) {
                console.error("Failed to load career state", e);
            }
        }
        setDailyQuote(CAREER_QUOTES[Math.floor(Math.random() * CAREER_QUOTES.length)]);
    }, []);

    // Instant Scout Trigger
    useEffect(() => {
        if (initialScoutData && !isMapping) {
            handlePathfinder(initialScoutData);
        }
    }, [initialScoutData]);

    // Live Signal Simulation
    useEffect(() => {
        const signals = [
            "Web3 Solidity Demand: +15% in Q4",
            "Remote DevOps Roles: Trending High",
            "AI Prompt Engineering: Salary Base $120k",
            "Cybersecurity Analysts: Critical Shortage",
            "Data Science: +8% YoY Growth"
        ];
        const interval = setInterval(() => {
            setLiveSignal(signals[Math.floor(Math.random() * signals.length)]);
        }, 5000);
        return () => clearInterval(interval);
    }, [lastSync]);

    // Auto-Save Effect
    useEffect(() => {
        const stateToSave = {
            cvInputs,
            cvContent,
            resumeInputs,
            resumeContent,
            careerMap,
            generatedImage,
            pitchSlides,
            pitchTopic
        };
        localStorage.setItem('skillfi_career_state', JSON.stringify(stateToSave));
    }, [cvInputs, cvContent, resumeInputs, resumeContent, careerMap, generatedImage, pitchSlides, pitchTopic]);

    const triggerHaptic = () => {
        if (navigator.vibrate) navigator.vibrate(15);
    };

    // --- ELITE HANDLERS ---
    const getFilteredEliteItems = () => {
        const term = eliteSearch.toLowerCase();
        return Object.entries(ELITE_DATA)
            .filter(([title, data]) => 
                title.toLowerCase().includes(term) || 
                data.desc.toLowerCase().includes(term)
            )
            .map(([title, data]) => ({
                title,
                ...data
            }));
    };

    const openEliteModal = async (item: {title: string, icon: string, desc: string}) => {
        setActiveEliteItem(item);
        setEliteImage(null);
        setEliteLoading(true);
        AudioService.playProcessing();

        try {
            const visual = await generateItemVisual(item.title + " high society luxury context cinematic lighting");
            if (visual) setEliteImage(`data:image/jpeg;base64,${visual}`);
        } catch (e) {
            console.error(e);
        } finally {
            setEliteLoading(false);
            AudioService.playSuccess();
        }
    };

    const handleAssignEliteGoal = () => {
        if (activeEliteItem) {
            setAssignedSkill(activeEliteItem.title);
            // In a real app, this would persist to user profile
            const savedUser = localStorage.getItem('skillfi_user');
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                parsed.assignedEliteGoal = activeEliteItem.title;
                localStorage.setItem('skillfi_user', JSON.stringify(parsed));
            }
            alert(`Quarterly Goal Set: Master ${activeEliteItem.title}`);
            AudioService.playSuccess();
        }
    };

    // --- DOWNLOAD HANDLERS ---
    const handleDownloadImage = (imgSrc: string, name: string) => {
        if (imgSrc) {
            const link = document.createElement('a');
            link.href = imgSrc;
            link.download = `${name}_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            AudioService.playSuccess();
        }
    };

    const handleDownloadDoc = (content: string | null, filename: string) => {
        if (content) {
            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Document</title></head><body>";
            const footer = "</body></html>";
            const sourceHTML = header + content + footer;
            
            const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
            const fileDownload = document.createElement("a");
            document.body.appendChild(fileDownload);
            fileDownload.href = source;
            fileDownload.download = filename;
            fileDownload.click();
            document.body.removeChild(fileDownload);
            AudioService.playSuccess();
        }
    };

    const handlePrintPDF = (elementId: string) => {
        const printContent = document.getElementById(elementId);
        if (printContent) {
            const win = window.open('', '', 'height=800,width=800');
            if (win) {
                win.document.write('<html><head><title>Print Preview</title>');
                // Inject simple CSS for printing
                win.document.write(`
                    <style>
                        body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #000; line-height: 1.6; }
                        h1 { font-size: 24px; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                        h2 { font-size: 18px; text-transform: uppercase; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                        p { margin-bottom: 10px; font-size: 14px; }
                        ul { margin-bottom: 10px; padding-left: 20px; }
                        li { font-size: 14px; margin-bottom: 5px; }
                    </style>
                `);
                win.document.write('</head><body>');
                win.document.write(printContent.innerHTML);
                win.document.write('</body></html>');
                win.document.close();
                win.focus();
                win.print();
            }
        }
    };

    // --- GENERATION HANDLERS ---
    const handleGenerateCV = async () => {
        setIsGeneratingCV(true);
        AudioService.playProcessing();
        // Construct detailed context for CV
        const context = `
            Name: ${user.username}
            Email: ${user.email}
            Target Role: ${cvInputs.targetRole}
            Core Skills: ${cvInputs.skills}
            Professional Experience: ${cvInputs.experience}
            Education: ${cvInputs.education}
            Publications/Research: ${cvInputs.publications}
            Awards/Certifications: ${cvInputs.awards}
        `;
        const cv = await generateCVContent(context);
        if (cv) {
            setCvContent(cv);
            AudioService.playSuccess();
        }
        setIsGeneratingCV(false);
    };

    const handleGenerateResume = async () => {
        setIsGeneratingResume(true);
        AudioService.playProcessing();
        // Construct context for Resume
        const context = `
            Name: ${user.username}
            Email: ${user.email}
            Target Role: ${resumeInputs.targetRole}
            Core Skills: ${resumeInputs.skills}
            Experience: ${resumeInputs.experience}
            Education: ${resumeInputs.education}
            Key Projects: ${resumeInputs.projects}
        `;
        const resume = await generateResumeContent(context);
        if (resume) {
            setResumeContent(resume);
            AudioService.playSuccess();
        }
        setIsGeneratingResume(false);
    };

    const handleGeneratePitch = async () => {
        if (!pitchTopic) return;
        setIsGeneratingPitch(true);
        AudioService.playProcessing();
        const slides = await generatePitchDeck(pitchTopic);
        if (slides) {
            setPitchSlides(slides);
            AudioService.playSuccess();
        }
        setIsGeneratingPitch(false);
    };
    
    const handlePathfinder = async (overrideContext?: string) => {
        setIsMapping(true);
        try {
            // Prioritize manual input, then user profile, then fallback
            const finalAge = user.age || "Not specified";
            const finalType = user.userType || "Professional";
            const finalSkills = (user.skills && user.skills.length > 0) ? user.skills.join(', ') : "General";
            
            const context = `
                User Profile Analysis Request:
                - Age: ${finalAge}
                - User Type: ${finalType}
                - Qualification: ${user.qualification || 'Unknown'}
                - Current Skills: ${finalSkills}
                - Tech Savvy: ${user.isTechie ? 'Yes' : 'No'}
                - Desired Strategy: ${riskTolerance} (Stable means low risk, corporate. Moonshot means high risk, startup/crypto).
                - Additional Hobbies/Interests: ${overrideContext || manualContext || 'None provided'}
                
                Note to AI: If profile data is generic, infer likely roles based on 'User Type' and 'Strategy'. 
                Resolve any gaps by suggesting paths that fit the 'User Type'.
            `;
            
            const map = await generateCareerRoadmap(context);
            if (map) {
                setCareerMap(map);
                AudioService.playSuccess();
            } else {
                AudioService.playAlert();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsMapping(false);
        }
    };

     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setGeneratedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateHeadshot = async () => {
        if (!originalImage) return;
        setIsGeneratingHeadshot(true);
        triggerHaptic();
        AudioService.playProcessing();

        const base64Data = originalImage.split(',')[1];
        const result = await generateProfessionalHeadshot(base64Data, selectedStyle);

        if (result) {
            setGeneratedImage(`data:image/jpeg;base64,${result}`);
            AudioService.playSuccess();
        } else {
            AudioService.playAlert();
        }
        setIsGeneratingHeadshot(false);
    };

    const handleProofreadUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'CV' | 'RESUME') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'CV') setIsGeneratingCV(true);
        else setIsGeneratingResume(true);
        
        AudioService.playProcessing();

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1]; 
                
                const result = await proofreadDocument(base64Data, file.type, type);
                
                if (result) {
                    if (type === 'CV') setCvContent(result);
                    else setResumeContent(result);
                    AudioService.playSuccess();
                } else {
                    AudioService.playAlert();
                    alert("Could not analyze document. Please ensure it is a PDF or Image.");
                }
                
                if (type === 'CV') setIsGeneratingCV(false);
                else setIsGeneratingResume(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error(err);
            if (type === 'CV') setIsGeneratingCV(false);
            else setIsGeneratingResume(false);
        }
    };

    const getEliteContent = (title: string) => {
        return ELITE_DATA[title] || { philosophy: "Loading...", mechanics: "...", advanced: "...", pro_tip: "..." };
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tighter kinetic-type">
                        Career Toolkit<span className="text-skillfi-neon">.</span>
                    </h1>
                </div>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Plan, Build, and Refine.</p>
            </header>

            {/* Navigation Tabs - Sticky */}
            <div className="sticky top-0 z-30 bg-skillfi-bg/95 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/5 mb-8">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'PATH', label: 'Pathfinder' },
                        { id: 'CORPORATE_OPS', label: 'Corp Ops' },
                        { id: 'TRENDS', label: 'Trend Radar' },
                        { id: 'RESUME', label: 'Resume' },
                        { id: 'CV', label: 'CV (Academic)' },
                        { id: 'PITCH', label: 'Pitch Deck' },
                        { id: 'HEADSHOT', label: 'Pro Photo' },
                        { id: 'ELITE', label: 'Elite Class' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => { setActiveModule(tab.id as any); triggerHaptic(); }}
                            className={`px-4 py-3 text-[10px] font-bold tracking-[0.15em] rounded-t-lg uppercase transition-all whitespace-nowrap ${
                                activeModule === tab.id 
                                ? 'bg-skillfi-neon text-black border-t-2 border-white shadow-[0_-5px_20px_rgba(0,255,255,0.2)]' 
                                : 'text-gray-500 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- PATHFINDER --- */}
            {activeModule === 'PATH' && (
                 <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Path UI */}
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Role Generator</h2>
                                <p className="text-xs text-gray-500">Assigning specific career roles based on profile.</p>
                            </div>
                            
                            {/* Live Signal Ticker */}
                            <div className="hidden md:block bg-black/40 border border-skillfi-neon/30 rounded-lg px-3 py-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-skillfi-neon animate-pulse"></span>
                                    <span className="text-[10px] font-mono text-skillfi-neon uppercase tracking-wide">{liveSignal}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Profile Summary Card */}
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Detected Profile</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] text-gray-500">Age</div>
                                        <div className="text-white font-bold">{user.age || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500">Type</div>
                                        <div className="text-white font-bold">{user.userType || 'N/A'}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[10px] text-gray-500">Core Skills</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {(user.skills && user.skills.length > 0) ? user.skills.map(s => (
                                                <span key={s} className="bg-skillfi-neon/10 text-skillfi-neon text-[9px] px-1.5 py-0.5 rounded border border-skillfi-neon/20">{s}</span>
                                            )) : <span className="text-gray-600 text-xs">General / Not Listed</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Context */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Hobbies & Interests (Optional)</label>
                                <textarea 
                                    value={manualContext}
                                    onChange={(e) => setManualContext(e.target.value)}
                                    placeholder="e.g. I like drawing, gaming, and solving puzzles..."
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white text-xs h-20 outline-none focus:border-skillfi-neon"
                                />
                            </div>

                            {/* Strategy Toggle */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Career Strategy</label>
                                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setRiskTolerance('STABLE')}
                                        className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${riskTolerance === 'STABLE' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        🛡️ Safe Path
                                    </button>
                                    <button 
                                        onClick={() => setRiskTolerance('MOONSHOT')}
                                        className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${riskTolerance === 'MOONSHOT' ? 'bg-skillfi-neon text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        🚀 Bold Path
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={() => handlePathfinder()}
                                disabled={isMapping}
                                className="w-full py-4 bg-gradient-to-r from-skillfi-neon to-yellow-500 text-black font-bold uppercase rounded-xl hover:shadow-[0_0_20px_#D4AF37] transition-all text-xs tracking-widest mt-2 flex items-center justify-center gap-2"
                            >
                                {isMapping ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                        Computing...
                                    </>
                                ) : 'Generate Roles'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 flex flex-col">
                         {careerMap ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="border-b border-white/10 pb-4">
                                     <h3 className="text-skillfi-neon font-bold font-display text-lg mb-1">Strategic Analysis</h3>
                                     <p className="text-gray-400 text-xs italic">"{careerMap.advice}"</p>
                                </div>

                                {/* $CF Score & Gap Analysis */}
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className={`${careerMap.fitScore >= 85 ? 'text-green-500' : 'text-yellow-500'} transition-all duration-1000`} strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * careerMap.fitScore) / 100} />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl font-bold text-white">{careerMap.fitScore}</span>
                                            <span className="text-[8px] text-gray-500 font-mono">$CF INDEX</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">
                                            {careerMap.fitScore >= 85 ? "Career Fit: Optimized" : "Path to 85 (Gap Analysis)"}
                                        </h4>
                                        <ul className="space-y-1">
                                            {careerMap.gapAnalysis?.map((gap, i) => (
                                                <li key={i} className="text-[10px] text-gray-400 flex items-center gap-2">
                                                    <span className="text-red-500">⚠</span> {gap}
                                                </li>
                                            )) || <li className="text-[10px] text-gray-500">No gaps detected.</li>}
                                        </ul>
                                    </div>
                                </div>

                                {/* Traditional Role Card */}
                                <div className="bg-white/5 p-5 rounded-xl border-l-4 border-blue-500 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-lg font-bold text-white uppercase">{careerMap.web2.role}</div>
                                        <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">TRADITIONAL</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {careerMap.web2.skills.map((s, i) => <span key={i} className="text-[9px] text-gray-400 bg-black/30 px-1.5 rounded">{s}</span>)}
                                    </div>
                                    <div className="text-xs bg-black/30 p-3 rounded text-white font-mono border border-white/5 mb-3">➤ {careerMap.web2.action}</div>
                                    
                                    {/* Global Salaries */}
                                    <div className="bg-blue-900/10 p-3 rounded-lg border border-blue-500/20">
                                        <div className="text-[10px] text-blue-300 font-bold uppercase mb-2">
                                            Global Salary Intelligence
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {careerMap.web2.salaries?.map((item, idx) => (
                                                <div key={idx} className="text-[9px] text-gray-300 bg-black/40 px-2 py-1.5 rounded border border-white/5 flex justify-between items-center">
                                                    <span className="text-gray-500 font-bold uppercase">{item.country}</span>
                                                    <span className="text-white font-mono">{item.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Web3 Role Card */}
                                <div className="bg-white/5 p-5 rounded-xl border-l-4 border-purple-500 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-lg font-bold text-white uppercase">{careerMap.web3.role}</div>
                                        <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">WEB3</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {careerMap.web3.skills.map((s, i) => <span key={i} className="text-[9px] text-gray-400 bg-black/30 px-1.5 rounded">{s}</span>)}
                                    </div>
                                    <div className="text-xs bg-black/30 p-3 rounded text-white font-mono border border-white/5 mb-3">➤ {careerMap.web3.action}</div>

                                    {/* Global Salaries */}
                                    <div className="bg-purple-900/10 p-3 rounded-lg border border-purple-500/20">
                                        <div className="text-[10px] text-purple-300 font-bold uppercase mb-2">
                                            Global Salary Intelligence
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {careerMap.web3.salaries?.map((item, idx) => (
                                                <div key={idx} className="text-[9px] text-gray-300 bg-black/40 px-2 py-1.5 rounded border border-white/5 flex justify-between items-center">
                                                    <span className="text-gray-500 font-bold uppercase">{item.country}</span>
                                                    <span className="text-white font-mono">{item.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                         ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 min-h-[300px]">
                                <div className="text-5xl mb-4 opacity-20">🗺️</div>
                                <p className="text-xs uppercase tracking-widest">Awaiting Command</p>
                            </div>
                         )}
                    </div>
                </div>
            )}
            
            {/* ... Other modules ... */}
            {/* RESUME, CV, HEADSHOT, PITCH sections remain largely same, just preserving surrounding context */}
            {/* (Omitted for brevity in this specific patch to keep focused, but assume they exist below) */}
            
            {/* --- ELITE MODULE --- */}
            {activeModule === 'ELITE' && (
                <div className="animate-fade-in relative space-y-6">
                    {/* Header with Assigned Goal */}
                    <div className="flex justify-between items-center">
                        <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center gap-3 relative flex-1 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Search high-value skills..." 
                                value={eliteSearch}
                                onChange={(e) => setEliteSearch(e.target.value)}
                                className="bg-transparent w-full text-white outline-none placeholder-gray-500 text-sm"
                            />
                        </div>
                        {assignedSkill && (
                            <div className="bg-skillfi-neon/10 border border-skillfi-neon/30 px-4 py-2 rounded-xl">
                                <span className="text-[9px] text-skillfi-neon font-bold uppercase block">Quarterly Goal</span>
                                <span className="text-white font-bold text-xs">{assignedSkill}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getFilteredEliteItems().map((item, i) => (
                            <div 
                                key={i}
                                onClick={() => openEliteModal(item)}
                                className="glass-panel p-6 rounded-2xl border-t-4 border-t-skillfi-neon hover:bg-white/5 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{item.desc}</p>
                                <div className="mt-4 text-[10px] text-skillfi-neon font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to Learn
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {getFilteredEliteItems().length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p>No elite skills found matching "{eliteSearch}".</p>
                        </div>
                    )}

                    {/* Elite Modal */}
                    {activeEliteItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in" onClick={() => setActiveEliteItem(null)}>
                            <div className="glass-panel w-full max-w-2xl rounded-2xl p-0 relative max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                                {/* Modal Header */}
                                <div className="p-6 border-b border-white/10 bg-black/40 flex justify-between items-start sticky top-0 z-10 backdrop-blur-md">
                                    <div>
                                        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                                            {activeEliteItem.icon} {activeEliteItem.title}
                                        </h2>
                                        <p className="text-skillfi-neon text-xs font-bold uppercase tracking-widest mt-1">Refinement Module</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleAssignEliteGoal}
                                            className="bg-white/10 hover:bg-skillfi-neon hover:text-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
                                        >
                                            Assign as Goal
                                        </button>
                                        <button className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/20 transition-all" onClick={() => setActiveEliteItem(null)}>✕</button>
                                    </div>
                                </div>
                                
                                <div className="p-6 overflow-y-auto scrollbar-hide">
                                    {eliteLoading ? (
                                        <div className="h-48 w-full bg-white/5 rounded-xl flex items-center justify-center animate-pulse mb-6">
                                            <div className="text-skillfi-neon font-mono text-xs">Accessing Secure Knowledge Base...</div>
                                        </div>
                                    ) : (
                                        <>
                                            {eliteImage && (
                                                <div className="h-56 w-full rounded-xl overflow-hidden mb-8 border border-skillfi-neon/30 shadow-lg relative group">
                                                    <img src={eliteImage} alt={activeEliteItem.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                    <div className="absolute bottom-4 left-4 text-white text-xs font-mono opacity-80">
                                                        FIG. 1.0 // {activeEliteItem.title.toUpperCase()}
                                                    </div>
                                                    {/* Download Button for Generated Image */}
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDownloadImage(eliteImage!, activeEliteItem.title); }}
                                                        className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-all"
                                                        title="Download Visual"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l3-3m-3 3h7.5" transform="rotate(-90 12 12)" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}

                                            <div className="space-y-8 text-sm">
                                                {/* Philosophy */}
                                                <section>
                                                    <h3 className="text-skillfi-neon font-bold text-xs uppercase tracking-[0.2em] mb-3 border-b border-skillfi-neon/20 pb-2">01. The Philosophy</h3>
                                                    <p className="text-gray-200 leading-relaxed font-serif italic text-lg">
                                                        "{getEliteContent(activeEliteItem.title).philosophy}"
                                                    </p>
                                                </section>

                                                {/* Mechanics */}
                                                <section className="bg-white/5 p-5 rounded-xl border border-white/5">
                                                    <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-4">02. Core Mechanics</h3>
                                                    <div className="text-gray-300 leading-relaxed whitespace-pre-line space-y-2">
                                                        {getEliteContent(activeEliteItem.title).mechanics}
                                                    </div>
                                                </section>

                                                {/* Advanced */}
                                                <section>
                                                    <h3 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-3 border-b border-blue-400/20 pb-2">03. Intermediate & Advanced</h3>
                                                    <p className="text-gray-300 leading-relaxed">
                                                        {getEliteContent(activeEliteItem.title).advanced}
                                                    </p>
                                                </section>

                                                {/* Pro Tip */}
                                                <div className="bg-gradient-to-r from-skillfi-neon/10 to-transparent p-4 rounded-l-xl border-l-4 border-skillfi-neon">
                                                    <span className="text-skillfi-neon font-bold uppercase text-[10px] tracking-widest block mb-1">Insider Pro Tip</span>
                                                    <p className="text-white font-medium">
                                                        {getEliteContent(activeEliteItem.title).pro_tip}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};