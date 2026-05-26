import type { CSSProperties } from 'react';
import type { TemplateId } from '@/types/cv.types';
import { cn } from '@/utils/cv.utils';
import styles from './TemplateThumbnail.module.css';

interface TemplateThumbnailProps {
  templateId: TemplateId;
  active: boolean;
  primaryColor: string;
}

export function TemplateThumbnail({ templateId, active, primaryColor }: TemplateThumbnailProps) {
  const thumbStyle = { '--thumb-primary': primaryColor } as CSSProperties;

  return (
    <div
      className={cn(styles.thumbnail, active && styles.active)}
      style={thumbStyle}
      aria-hidden
    >
      {templateId === 'classic' && <ClassicThumb />}
      {templateId === 'modern' && <ModernThumb />}
      {templateId === 'minimal' && <MinimalThumb />}
      {templateId === 'creative' && <CreativeThumb />}
      {templateId === 'executive' && <ExecutiveThumb />}
      {templateId === 'elegant' && <ElegantThumb />}
      {templateId === 'tech' && <TechThumb />}
      {templateId === 'academic' && <AcademicThumb />}
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
