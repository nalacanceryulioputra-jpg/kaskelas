import { ClassInfo, GradeType, MajorType } from '../types';

export interface ClassOption {
  id: string;
  grade: GradeType;
  major: MajorType;
  section: string;
}

export const CLASS_OPTIONS: ClassOption[] = [
  { id: 'tkj-10-1', grade: '10', major: 'TKJ', section: '1' },
  { id: 'tkj-11-1', grade: '11', major: 'TKJ', section: '1' },
  { id: 'tkr-10-1', grade: '10', major: 'TKR', section: '1' },
  { id: 'tkr-10-2', grade: '10', major: 'TKR', section: '2' },
  { id: 'tkr-11-1', grade: '11', major: 'TKR', section: '1' },
  { id: 'tkr-11-2', grade: '11', major: 'TKR', section: '2' },
  { id: 'akuntansi-10-1', grade: '10', major: 'Akuntansi', section: '1' },
  { id: 'akuntansi-11-1', grade: '11', major: 'Akuntansi', section: '1' },
  { id: 'rpl-11-1', grade: '11', major: 'RPL', section: '1' },
];

export const getClassLabel = (classOption: ClassOption): string => {
  const romanGrade = classOption.grade === '10' ? 'X' : 'XI';
  return `${romanGrade} ${classOption.major} ${classOption.section}`;
};

export const createClassInfo = (
  classOption: ClassOption,
  defaults: ClassInfo,
): ClassInfo => ({
  ...defaults,
  grade: classOption.grade,
  major: classOption.major,
  section: classOption.section,
});

export const isClassId = (classId: string | undefined): classId is string =>
  Boolean(classId && CLASS_OPTIONS.some((classOption) => classOption.id === classId));
