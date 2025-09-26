import { ComplianceStandard, Workflow, Region } from './types.ts';

export const COMPLIANCE_OPTIONS = [
  { id: ComplianceStandard.FDA_MARKETING, label: 'FDA Marketing & Promotion' },
  { id: ComplianceStandard.HIPAA_PRIVACY, label: 'HIPAA Privacy & Security' },
  { id: ComplianceStandard.FTC_ADVERTISING, label: 'FTC Advertising & Endorsements' },
];

export const WORKFLOW_OPTIONS = [
    { id: Workflow.REVIEW, label: 'Review Content' },
    { id: Workflow.GENERATE, label: 'Generate Content' },
    { id: Workflow.REVIEW_AND_GENERATE, label: 'Generate & Review' },
];

export const REGION_OPTIONS = [
    { id: Region.USA, label: 'United States (USA)' },
    { id: Region.EU, label: 'European Union (EU)' },
    { id: Region.JPAC, label: 'Japan & Asia-Pacific (JPAC)' },
    { id: Region.MIDDLE_EAST, label: 'Middle East' },
];

export const DEMO_CONTENT: Record<ComplianceStandard, string> = {
    [ComplianceStandard.FDA_MARKETING]: `Our new supplement, 'VitaBoost', is a miracle cure for diabetes and is guaranteed to reverse aging. It's FDA-approved to treat all major illnesses.`,
    [ComplianceStandard.HIPAA_PRIVACY]: `To get your test results, just email us your full name and date of birth. Our receptionist, Jane Doe, will email you the PDF. You can also see patient John Smith's latest update on our public blog.`,
    [ComplianceStandard.FTC_ADVERTISING]: `9 out of 10 doctors recommend our product, 'EnergyUp'. This study was funded by our company. Results are typical and everyone will lose 30 pounds in one week, guaranteed!`,
}