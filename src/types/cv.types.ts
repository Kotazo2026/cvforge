// Sections disponibles
export type SectionType =
  | 'header' // Nom, titre, contact, photo — TOUJOURS présente, non supprimable
  | 'summary' // Profil / À propos
  | 'experience' // Expériences professionnelles
  | 'education' // Formation
  | 'skills' // Compétences (tags avec niveau optionnel)
  | 'languages' // Langues
  | 'certifications' // Certifications
  | 'projects' // Projets
  | 'references' // Références
  | 'custom'; // Section personnalisée (titre libre)

// Structure d'une entrée dans une section liste
export interface CVEntry {
  id: string; // uuid
  title: string; // Intitulé principal
  subtitle?: string; // Entreprise / École
  location?: string;
  startDate?: string; // YYYY-MM
  endDate?: string; // YYYY-MM ou ""
  current?: boolean; // "Poste actuel"
  description?: string; // Texte riche (markdown simple)
  tags?: string[]; // Pour skills/certifications
  level?: number; // 1-5 pour langues et compétences
}

// Une section complète
export interface CVSection {
  id: string;
  type: SectionType;
  title: string; // Titre affiché (modifiable)
  visible: boolean;
  entries: CVEntry[];
}

// En-tête du CV (section spéciale)
export interface CVHeader {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  mobility?: string;
  drivingLicense?: string;
  website?: string;
  linkedin?: string;
  photo?: string; // base64
  summary?: string;
}

/** Panneaux de la barre latérale gauche (shell v2). */
export type EditorSidebarPanel = 'templates' | 'info' | 'layout' | 'sections' | 'ai';

/** Langue du document CV (affichage / traduction future). */
export type CVDocumentLanguage = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt';

/** Mode d’aperçu central (Bloc 14 étendra Mobile / LinkedIn). */
export type PreviewViewMode = 'cv' | 'mobile' | 'linkedin';

// Templates disponibles
export type TemplateId =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'creative'
  | 'executive'
  | 'elegant'
  | 'tech'
  | 'academic'
  | 'nova'
  | 'slate'
  | 'coral'
  | 'obsidian'
  | 'sage'
  | 'ivory'
  | 'prism'
  | 'loft'
  | 'atlas'
  | 'ember'
  | 'frost'
  | 'dusk';

// Couleurs primaires du template
export interface CVColors {
  primary: string; // hex
  secondary: string; // hex
  text: string; // hex
  background: string; // hex
}

export type CVFontFamily =
  | 'inter'
  | 'lato'
  | 'raleway'
  | 'merriweather'
  | 'roboto-slab'
  | 'dm-sans'
  | 'playfair'
  | 'source-serif';

export type CVFontStyle = 'normal' | 'bold' | 'italic';

export type CVDateFormat = 'default' | 'mm-yyyy' | 'month-yyyy' | 'yyyy';

export interface CVLayoutColors {
  name: string;
  jobTitle: string;
  sectionTitleSidebar: string;
  sectionTitleMain: string;
  organization: string;
  skillBar: string;
  sidebarBackground: string;
}

export interface CVLayoutTypography {
  bodyFont: CVFontFamily;
  bodyStyle: CVFontStyle;
  titleFont: CVFontFamily;
  bodySizePx: number;
  nameSizePx: number;
  sectionTitleSizePx: number;
}

export interface CVLayoutSpacing {
  blockGapPx: number;
  paddingVerticalPx: number;
  paddingHorizontalPx: number;
}

/** Options avancées de mise en page (Bloc 12+). */
export interface CVLayoutOptions {
  colors: CVLayoutColors;
  typography: CVLayoutTypography;
  spacing: CVLayoutSpacing;
  roundedPhoto: boolean;
  showTimeline: boolean;
  nameUppercase: boolean;
  summaryJustified: boolean;
  dateFormat: CVDateFormat;
}

// Document CV complet
export interface CVDocument {
  id: string;
  title: string; // "Mon CV" (nom du fichier)
  header: CVHeader;
  sections: CVSection[]; // ordonnées par drag & drop
  templateId: TemplateId;
  colors: CVColors;
  layout: CVLayoutOptions;
  fontSize: 'small' | 'medium' | 'large';
  createdAt: string;
  updatedAt: string;
}

// Store Zustand
export interface CVStore {
  document: CVDocument;
  selectedSectionId: string | null;
  isDirty: boolean;

  // Actions
  updateHeader: (header: Partial<CVHeader>) => void;
  updateSection: (id: string, data: Partial<CVSection>) => void;
  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  addEntry: (sectionId: string) => void;
  updateEntry: (sectionId: string, entryId: string, data: Partial<CVEntry>) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
  reorderEntries: (sectionId: string, activeId: string, overId: string) => void;
  setTemplate: (id: TemplateId) => void;
  setColors: (colors: Partial<CVColors>) => void;
  setLayout: (layout: {
    colors?: Partial<CVLayoutColors>;
    typography?: Partial<CVLayoutTypography>;
    spacing?: Partial<CVLayoutSpacing>;
    roundedPhoto?: boolean;
    showTimeline?: boolean;
    nameUppercase?: boolean;
    summaryJustified?: boolean;
    dateFormat?: CVDateFormat;
  }) => void;
  setFontSize: (size: CVDocument['fontSize']) => void;
  setDocumentTitle: (title: string) => void;
  toggleSectionVisibility: (id: string) => void;
  selectSection: (id: string | null) => void;
  resetDocument: () => void;
}
