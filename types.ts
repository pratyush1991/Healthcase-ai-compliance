
export enum ComplianceStandard {
  FDA_MARKETING = 'FDA_MARKETING',
  HIPAA_PRIVACY = 'HIPAA_PRIVACY',
  FTC_ADVERTISING = 'FTC_ADVERTISING',
}

export enum Workflow {
  REVIEW = 'REVIEW',
  GENERATE = 'GENERATE',
  REVIEW_AND_GENERATE = 'REVIEW_AND_GENERATE',
}

export enum Region {
    USA = 'USA',
    EU = 'EU',
    JPAC = 'JPAC',
    MIDDLE_EAST = 'MIDDLE_EAST',
}

export type SeverityLevel = 'High' | 'Medium' | 'Low';

export interface ComplianceIssue {
  originalText: string;
  issue: string;
  explanation: string;
  suggestion: string;
  severity: SeverityLevel;
}

export interface ReviewResult {
  isCompliant: boolean;
  summary: string;
  issues: ComplianceIssue[];
}
