/* ==========================================================================
   BILINGUAL SWITCH & AUTO-SPEECH NARRATOR ENGINE
   ========================================================================== */

let currentLang = 'km';
const synth = window.speechSynthesis;
let isSpeaking = false;

// Language Switching Engine
function switchLanguage(lang) {
    currentLang = lang;
    
    // Toggle active state on header buttons
    document.getElementById('btn-km').classList.toggle('active', lang === 'km');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
    
    // Translate all elements with data-km and data-en
    const elements = document.querySelectorAll('[data-km][data-en]');
    elements.forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // If already speaking, restart speech in new language
    if (synth.speaking) {
        stopSpeech();
        speakAnnouncement();
    }
}

// Compile Announcement Text for Speech Output
function getFullAnnouncementText() {
    const isKm = currentLang === 'km';
    
    if (isKm) {
        return `សេចក្តីប្រកាសតែងតាំងថ្នាក់ដឹកនាំ និងបច្ចេកវិទ្យាហូឡូក្រាម Casino 1។
        យោងតាមការសម្រេចចិត្តដោយគណៈគ្រប់គ្រងកាស៊ីណូ និងទទួលបានការអនុម័តផ្លូវការដោយ លោក ហួ និង លោក B។
        លោក សេងឆាត ត្រូវបានតែងតាំងជានាយកនៅ កាស៊ីណូ ១ និង កាស៊ីណូ ២។
        លោក ហួកាំង ថារ៉ា ទទួលបន្ទុកជាប្រធានផ្នែកសាយប័រ និងប្រធានសន្តិសុខបច្ចេកវិទ្យា។
        លោក ម៉ែន ត្រូវបានតែងតាំងជា CEO។
        លោក ដូ ត្រូវបានតែងតាំងជា CEO។
        លោក ដំ ត្រូវបានតែងតាំងជា CEO។
        អ្នកនាង ឡូយ គីមមួយ ត្រូវបានតែងតាំងជា លេខា និង ប្រធានផ្នែកសេវាកម្មអតិថិជន។
        ត្រៀមខ្លួនសម្រាប់ Casino 1 ជាមួយបច្ចេកវិទ្យាហូឡូក្រាម ដោយមិនចាំបាច់ប្រើប្រាស់វ៉ែនតា VR ឡើយ។`;
    } else {
        return `Executive Appointments and Casino 1 Hologram Technology Announcement.
        Pursuant to the board of management decision and approved by Mr. Houa and Mr. B.
        Mr. Seng Chhat has been appointed as Director of Casino 1 and Casino 2.
        Mr. Huokaing Thara is in charge as Head of Cybersecurity and Chief of Technology Security.
        Mr. Men has been appointed as CEO.
        Mr. Do has been appointed as CEO.
        Mr. Dom has been appointed as CEO.
        Ms. Loy Kimmoy has been appointed as Secretary and Head of Customer Service.
        Get ready for Casino 1 featuring futuristic Hologram Technology without VR glasses.`;
    }
}

// Speech Synthesis Controller
function speakAnnouncement() {
    if (!('speechSynthesis' in window)) {
        alert('Text-to-speech is not supported in this browser.');
        return;
    }

    const text = getFullAnnouncementText();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = currentLang === 'km' ? 'km-KH' : 'en-US';
    utterance.rate = 0.9; // Smooth cadence

    // Fetch matching voice profile if available
    const voices = synth.getVoices();
    const voiceMatch = voices.find(v => v.lang.startsWith(currentLang));
    if (voiceMatch) {
        utterance.voice = voiceMatch;
    }

    utterance.onend = () => {
        isSpeaking = false;
        updateSpeechButtonUI();
    };

    utterance.onerror = () => {
        isSpeaking = false;
        updateSpeechButtonUI();
    };

    synth.speak(utterance);
    isSpeaking = true;
    updateSpeechButtonUI();
}

function stopSpeech() {
    if (synth) {
        synth.cancel();
        isSpeaking = false;
        updateSpeechButtonUI();
    }
}

function toggleSpeech() {
    if (isSpeaking) {
        stopSpeech();
    } else {
        speakAnnouncement();
    }
}

function updateSpeechButtonUI() {
    const btn = document.getElementById('btn-read');
    if (isSpeaking) {
        btn.textContent = '⏹ Stop Voice';
        btn.style.borderColor = '#ff3366';
        btn.style.color = '#ff3366';
    } else {
        btn.textContent = '🔊 Read Announcement';
        btn.style.borderColor = 'var(--neon-cyan)';
        btn.style.color = 'var(--neon-cyan)';
    }
}

// Auto-trigger Speech Synthesis on Page Load
window.addEventListener('DOMContentLoaded', () => {
    // Populate voice registry for mobile/Chrome
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => synth.getVoices();
    }

    // Auto-read announcement after brief user interaction delay
    setTimeout(() => {
        speakAnnouncement();
    }, 1200);
});
