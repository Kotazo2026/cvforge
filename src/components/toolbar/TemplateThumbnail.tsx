import type { CSSProperties, ReactNode } from 'react';
import type { TemplateId } from '@/types/cv.types';
import { cn } from '@/utils/cv.utils';
import styles from './TemplateThumbnail.module.css';

interface TemplateThumbnailProps {
  templateId: TemplateId;
  active: boolean;
  primaryColor: string;
}

type ThumbRenderer = () => ReactNode;

const THUMBS: Record<TemplateId, ThumbRenderer> = {
  classic: ClassicThumb,
  modern: ModernThumb,
  minimal: MinimalThumb,
  creative: CreativeThumb,
  executive: ExecutiveThumb,
  elegant: ElegantThumb,
  tech: TechThumb,
  academic: AcademicThumb,
  nova: NovaThumb,
  slate: SlateThumb,
  coral: CoralThumb,
  obsidian: ObsidianThumb,
  sage: SageThumb,
  ivory: IvoryThumb,
  prism: PrismThumb,
  loft: LoftThumb,
  atlas: AtlasThumb,
  ember: EmberThumb,
  frost: FrostThumb,
  dusk: DuskThumb,
};

export function TemplateThumbnail({ templateId, active, primaryColor }: TemplateThumbnailProps) {
  const thumbStyle = { '--thumb-primary': primaryColor } as CSSProperties;
  const Thumb = THUMBS[templateId] ?? ClassicThumb;

  return (
    <div
      className={cn(styles.thumbnail, active && styles.active)}
      style={thumbStyle}
      aria-hidden
    >
      <Thumb />
    </div>
  );
}

function ClassicThumb() {
  return (
    <div className={styles.classic}>
      <div className={styles.classicSidebar} />
      <div className={styles.classicMain}>
        <div className={styles.classicLineAccent} />
        <div className={styles.classicLine} />
        <div className={styles.classicLine} />
      </div>
    </div>
  );
}

function ModernThumb() {
  return (
    <div className={styles.modern}>
      <div className={styles.modernHeader} />
      <div className={styles.modernBody}>
        <div className={styles.modernCol}>
          <div className={styles.classicLineAccent} />
          <div className={styles.classicLine} />
        </div>
        <div className={styles.modernCol}>
          <div className={styles.classicLineAccent} />
          <div className={styles.classicLine} />
        </div>
      </div>
    </div>
  );
}

function MinimalThumb() {
  return (
    <div className={styles.minimal}>
      <div className={styles.minimalTitle} />
      <div className={styles.minimalSub} />
      <div className={styles.minimalRule} />
      <div className={styles.minimalAccent} />
      <div className={styles.classicLine} />
    </div>
  );
}

function CreativeThumb() {
  return (
    <div className={styles.creative}>
      <div className={styles.creativeHeader} />
      <div className={styles.creativeBody}>
        <div className={styles.creativeTimeline}>
          <div className={styles.creativeDot} />
          <div className={styles.classicLine} style={{ flex: 1 }} />
        </div>
        <div className={styles.classicLineAccent} style={{ width: '80%' }} />
      </div>
    </div>
  );
}

function ExecutiveThumb() {
  return (
    <div className={styles.executive}>
      <div className={styles.executiveTitle} />
      <div className={styles.executiveBar} />
      <div className={styles.executiveBlock} />
      <div className={styles.executiveBlock} />
      <div className={styles.executiveBlock} style={{ width: '90%' }} />
    </div>
  );
}

function ElegantThumb() {
  return (
    <div className={styles.elegant}>
      <div className={styles.elegantTitle} />
      <div className={styles.elegantSub} />
      <div className={styles.elegantOrnament} />
      <div className={styles.classicLineAccent} style={{ width: '50%', margin: '0 auto' }} />
      <div className={styles.classicLine} />
    </div>
  );
}

function TechThumb() {
  return (
    <div className={styles.tech}>
      <div className={styles.techSidebar}>
        <div className={styles.techDot} />
        <div className={styles.techLine} />
      </div>
      <div className={styles.techMain}>
        <div className={styles.classicLineAccent} />
        <div className={styles.classicLine} />
        <div className={styles.classicLine} style={{ width: '85%' }} />
      </div>
    </div>
  );
}

function AcademicThumb() {
  return (
    <div className={styles.academic}>
      <div className={styles.academicHeader}>
        <div className={styles.academicTitle} />
        <div className={styles.academicContact} />
      </div>
      <div className={styles.academicRule} />
      <div className={styles.classicLineAccent} />
      <div className={styles.classicLine} />
    </div>
  );
}

function NovaThumb() {
  return (
    <div className={styles.nova}>
      <div className={styles.novaHero} />
      <div className={styles.novaBody}>
        <div className={styles.classicLineAccent} />
        <div className={styles.classicLine} />
      </div>
    </div>
  );
}

function SlateThumb() {
  return (
    <div className={styles.slate}>
      <div className={styles.slateBar} />
      <div className={styles.classicLine} />
      <div className={styles.classicLine} style={{ width: '80%' }} />
    </div>
  );
}

function CoralThumb() {
  return (
    <div className={styles.coral}>
      <div className={styles.coralSide} />
      <div className={styles.coralMain}>
        <div className={styles.classicLineAccent} />
        <div className={styles.classicLine} />
      </div>
    </div>
  );
}

function ObsidianThumb() {
  return (
    <div className={styles.obsidian}>
      <div className={styles.obsidianSide} />
      <div className={styles.obsidianMain}>
        <div className={styles.classicLine} />
        <div className={styles.classicLineAccent} />
      </div>
    </div>
  );
}

function SageThumb() {
  return (
    <div className={styles.sage}>
      <div className={styles.sageCard}>
        <div className={styles.classicLineAccent} />
        <div className={styles.classicLine} />
      </div>
    </div>
  );
}

function IvoryThumb() {
  return (
    <div className={styles.ivory}>
      <div className={styles.ivoryTitle} />
      <div className={styles.ivoryRule} />
      <div className={styles.classicLine} />
    </div>
  );
}

function PrismThumb() {
  return (
    <div className={styles.prism}>
      <div className={styles.prismShape} />
      <div className={styles.classicLineAccent} />
    </div>
  );
}

function LoftThumb() {
  return (
    <div className={styles.loft}>
      <div className={styles.loftBar} />
      <div className={styles.loftTitle} />
      <div className={styles.classicLine} />
    </div>
  );
}

function AtlasThumb() {
  return (
    <div className={styles.atlas}>
      <div className={styles.atlasGrid} />
      <div className={styles.classicLineAccent} />
      <div className={styles.classicLine} />
    </div>
  );
}

function EmberThumb() {
  return (
    <div className={styles.ember}>
      <div className={styles.emberBanner} />
      <div className={styles.classicLine} />
    </div>
  );
}

function FrostThumb() {
  return (
    <div className={styles.frost}>
      <div className={styles.frostHeader}>
        <div className={styles.frostDot} />
        <div className={styles.classicLine} style={{ flex: 1 }} />
      </div>
      <div className={styles.classicLine} style={{ borderStyle: 'dashed' }} />
    </div>
  );
}

function DuskThumb() {
  return (
    <div className={styles.dusk}>
      <div className={styles.duskSide} />
      <div className={styles.duskMain}>
        <div className={styles.classicLineAccent} />
        <div className={styles.classicLine} />
      </div>
    </div>
  );
}
