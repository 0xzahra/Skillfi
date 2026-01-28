import { LanguageCode } from './types';

interface TranslationSet {
    [key: string]: string;
}

export const TRANSLATIONS: Record<string, TranslationSet> = {
    en: {
        // Auth
        auth_title: "Secure System Uplink",
        auth_reg_title: "Identity Creation Protocol",
        username: "Codename / Username",
        email: "Secure Link (Email)",
        password: "Password",
        login_btn: "Login", // Changed from Authenticate
        init_btn: "Initialize Account",
        switch_reg: "Create New Identity",
        switch_login: "Return to Login",
        forgot_pass: "Forgot Username or Email Address?", // Changed text
        reset_link: "Send Recovery Link",
        age: "Age",
        user_type: "User Classification",
        student: "Student",
        professional: "Professional",
        techie: "Techie",
        non_techie: "Non-Techie",
        qual: "Qualifications / Grade",
        
        // Sidebar
        menu: "Menu",
        dashboard: "Dashboard",
        tribes: "Tribes",
        career: "Career Path",
        finance: "Finance OS",
        relationships: "Relationships",
        rights: "Marriage Rights",
        duties: "Duties & Obligations",
        criteria: "Spouse Criteria",
        elite: "High Society",
        education: "Education",
        safety: "OpSec & Safety",
        support: "Live Support",
        history: "History",
        settings: "Settings",
        logout: "Logout",
        
        // Dashboard
        welcome: "Welcome back,",
        net_worth: "Tracked Net Worth",
        skill_vault: "Skill Vault",
        add_skill: "Add Skill",
        vault_btn: "Vault",
    },
    ha: { // Hausa
        auth_title: "Shiga Tsarin Tsaro",
        auth_reg_title: "Kirkiri Sabon Suna",
        username: "Sunan Rada / Username",
        email: "Imel (Email)",
        password: "Kalmar Sirri",
        login_btn: "Shiga",
        init_btn: "Kirkiri Akaunti",
        switch_reg: "Kirkiri Sabuwar Shaida",
        switch_login: "Koma zuwa Shiga",
        forgot_pass: "Manta Sunan Rada ko Imel?",
        reset_link: "Aiko da Linkin Gyara",
        age: "Shekaru",
        user_type: "Nau'in Mai Amfani",
        student: "Dalibi",
        professional: "Kwararre",
        techie: "Masaniyar Tech",
        non_techie: "Ba Masaniyar Tech Ba",
        qual: "Kwarewa / Aji",
        
        menu: "Menu",
        dashboard: "Dabur",
        tribes: "Kungiyoyi",
        career: "Hanyar Aiki",
        finance: "Kayan Kudi",
        relationships: "Dangantaka",
        rights: "Hakkin Aure",
        duties: "Ayyuka & Nauyi",
        criteria: "Sharuddan Zabi",
        elite: "Manyan Mutane",
        education: "Ilimi",
        safety: "Tsaro",
        support: "Taimako",
        history: "Tarihi",
        settings: "Saituna",
        logout: "Fita",
        
        welcome: "Barka da dawowa,",
        net_worth: "Jimlar Dukiyo",
        skill_vault: "Taskar Fasaha",
        add_skill: "Saka Fasaha",
        vault_btn: "Ajiye",
    },
    es: { // Spanish
        auth_title: "Enlace Seguro del Sistema",
        auth_reg_title: "Protocolo de Creación de Identidad",
        username: "Nombre de Usuario",
        email: "Correo Seguro",
        login_btn: "Iniciar Sesión",
        init_btn: "Inicializar Cuenta",
        switch_reg: "Crear Nueva Identidad",
        switch_login: "Volver al Inicio",
        forgot_pass: "¿Olvidaste Usuario o Correo?",
        reset_link: "Enviar Enlace",
        age: "Edad",
        user_type: "Clasificación",
        student: "Estudiante",
        professional: "Profesional",
        techie: "Tecnológico",
        non_techie: "No Tecnológico",
        qual: "Cualificaciones",
        
        menu: "Menú",
        dashboard: "Tablero",
        tribes: "Tribus",
        career: "Carrera",
        finance: "Finanzas",
        relationships: "Relaciones",
        rights: "Derechos Matrimoniales",
        duties: "Deberes",
        criteria: "Criterios",
        elite: "Alta Sociedad",
        education: "Educación",
        safety: "Seguridad",
        support: "Soporte",
        history: "Historial",
        settings: "Ajustes",
        logout: "Cerrar Sesión",
        
        welcome: "Bienvenido,",
        net_worth: "Patrimonio Neto",
        skill_vault: "Bóveda de Habilidades",
        add_skill: "Añadir Habilidad",
        vault_btn: "Guardar",
    },
};

export const t = (key: string, lang: LanguageCode): string => {
    // Check if translation exists for lang, else fallback to 'en'
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        return TRANSLATIONS[lang][key];
    }
    return TRANSLATIONS['en'][key] || key;
};