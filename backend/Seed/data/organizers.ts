import { adminUserIds, organizerUserIds } from '../utils/ids';
import { daysFromNowAtUtc } from '../utils/helpers';

type OrganizerType = 'non_profit' | 'corporate' | 'individual' | 'government';
type OrganizerVerificationStatus = 'pending' | 'approved' | 'rejected';

export interface OrganizerProfileSeedRecord {
  user_id: string;
  organization_name: string;
  organization_type: OrganizerType;
  website_url: string | null;
  bio: string;
  tax_id_number: string;
  business_registration_number: string;
  social_linkedin: string | null;
  social_instagram: string | null;
  social_x: string | null;
  work_email: string;
  verification_status: OrganizerVerificationStatus;
  approved_by_admin_id: string | null;
  approved_at: Date | null;
  created_at: Date;
}

export const organizerProfiles: OrganizerProfileSeedRecord[] = [
  {
    user_id: organizerUserIds[0],
    organization_name: 'Addis Tech Collective',
    organization_type: 'corporate',
    website_url: 'https://addistechcollective.com',
    bio: 'Builds practical technology conferences and engineering workshops in Addis Ababa.',
    tax_id_number: 'TIN-ATC-1001',
    business_registration_number: 'BRN-ATC-2019-44',
    social_linkedin: 'https://linkedin.com/company/addis-tech-collective',
    social_instagram: 'https://instagram.com/addistechcollective',
    social_x: 'https://x.com/addistech',
    work_email: 'ops@addistechcollective.com',
    verification_status: 'approved',
    approved_by_admin_id: adminUserIds[0],
    approved_at: daysFromNowAtUtc(-120, 10, 0),
    created_at: daysFromNowAtUtc(-150, 9, 0)
  },
  {
    user_id: organizerUserIds[1],
    organization_name: 'Sheba Startup House',
    organization_type: 'corporate',
    website_url: 'https://shebastartuphouse.com',
    bio: 'Runs founder meetups, investor demo-days, and startup mentorship clinics.',
    tax_id_number: 'TIN-SSH-1002',
    business_registration_number: 'BRN-SSH-2020-09',
    social_linkedin: 'https://linkedin.com/company/sheba-startup-house',
    social_instagram: 'https://instagram.com/shebastartuphouse',
    social_x: 'https://x.com/shebahouse',
    work_email: 'hello@shebastartuphouse.com',
    verification_status: 'approved',
    approved_by_admin_id: adminUserIds[1],
    approved_at: daysFromNowAtUtc(-118, 14, 30),
    created_at: daysFromNowAtUtc(-148, 10, 0)
  },
  {
    user_id: organizerUserIds[2],
    organization_name: 'Hawassa Women in Business',
    organization_type: 'non_profit',
    website_url: 'https://hawassawib.org',
    bio: 'Supports women-led startups through forums, networking circles, and speaker series.',
    tax_id_number: 'TIN-HWB-1003',
    business_registration_number: 'BRN-HWB-2018-12',
    social_linkedin: 'https://linkedin.com/company/hawassa-wib',
    social_instagram: 'https://instagram.com/hawassawib',
    social_x: 'https://x.com/hawassawib',
    work_email: 'team@hawassawib.org',
    verification_status: 'approved',
    approved_by_admin_id: adminUserIds[2],
    approved_at: daysFromNowAtUtc(-116, 11, 45),
    created_at: daysFromNowAtUtc(-146, 11, 30)
  },
  {
    user_id: organizerUserIds[3],
    organization_name: 'Blue Nile Culture Works',
    organization_type: 'individual',
    website_url: 'https://bluenileculture.com',
    bio: 'Curates music, arts, and city culture experiences for regional audiences.',
    tax_id_number: 'TIN-BNC-1004',
    business_registration_number: 'BRN-BNC-2021-30',
    social_linkedin: 'https://linkedin.com/company/blue-nile-culture-works',
    social_instagram: 'https://instagram.com/bluenilecultureworks',
    social_x: 'https://x.com/bluenileculture',
    work_email: 'booking@bluenileculture.com',
    verification_status: 'approved',
    approved_by_admin_id: adminUserIds[0],
    approved_at: daysFromNowAtUtc(-114, 13, 10),
    created_at: daysFromNowAtUtc(-145, 8, 45)
  },
  {
    user_id: organizerUserIds[4],
    organization_name: 'Adama Growth Forum',
    organization_type: 'corporate',
    website_url: 'https://adamagrowthforum.com',
    bio: 'Hosts regional leadership and business networking events in Adama.',
    tax_id_number: 'TIN-AGF-1005',
    business_registration_number: 'BRN-AGF-2022-18',
    social_linkedin: 'https://linkedin.com/company/adama-growth-forum',
    social_instagram: 'https://instagram.com/adamagrowthforum',
    social_x: 'https://x.com/adamagrowthforum',
    work_email: 'events@adamagrowthforum.com',
    verification_status: 'approved',
    approved_by_admin_id: adminUserIds[1],
    approved_at: daysFromNowAtUtc(-112, 10, 35),
    created_at: daysFromNowAtUtc(-144, 10, 35)
  },
  {
    user_id: organizerUserIds[5],
    organization_name: 'Ethio Health Circle',
    organization_type: 'non_profit',
    website_url: 'https://ethiohealthcircle.org',
    bio: 'Coordinates health and public wellness summits with hospitals and startups.',
    tax_id_number: 'TIN-EHC-1006',
    business_registration_number: 'BRN-EHC-2019-52',
    social_linkedin: 'https://linkedin.com/company/ethio-health-circle',
    social_instagram: 'https://instagram.com/ethiohealthcircle',
    social_x: 'https://x.com/ethiohealthcircle',
    work_email: 'contact@ethiohealthcircle.org',
    verification_status: 'approved',
    approved_by_admin_id: adminUserIds[2],
    approved_at: daysFromNowAtUtc(-110, 15, 0),
    created_at: daysFromNowAtUtc(-143, 9, 0)
  },
  {
    user_id: organizerUserIds[6],
    organization_name: 'Rift Valley Events',
    organization_type: 'corporate',
    website_url: 'https://riftvalleyevents.com',
    bio: 'Designs event operations and sponsorship programs for large-format forums.',
    tax_id_number: 'TIN-RVE-1007',
    business_registration_number: 'BRN-RVE-2023-07',
    social_linkedin: 'https://linkedin.com/company/rift-valley-events',
    social_instagram: 'https://instagram.com/riftvalleyevents',
    social_x: 'https://x.com/riftvalleyevents',
    work_email: 'team@riftvalleyevents.com',
    verification_status: 'pending',
    approved_by_admin_id: null,
    approved_at: null,
    created_at: daysFromNowAtUtc(-20, 12, 0)
  },
  {
    user_id: organizerUserIds[7],
    organization_name: 'EduBridge Ethiopia',
    organization_type: 'non_profit',
    website_url: 'https://edubridgeethiopia.org',
    bio: 'Connects schools, mentors, and industry through practical learning events.',
    tax_id_number: 'TIN-EBE-1008',
    business_registration_number: 'BRN-EBE-2023-23',
    social_linkedin: 'https://linkedin.com/company/edubridge-ethiopia',
    social_instagram: 'https://instagram.com/edubridgeethiopia',
    social_x: 'https://x.com/edubridgeeth',
    work_email: 'info@edubridgeethiopia.org',
    verification_status: 'pending',
    approved_by_admin_id: null,
    approved_at: null,
    created_at: daysFromNowAtUtc(-18, 9, 50)
  },
  {
    user_id: organizerUserIds[8],
    organization_name: 'Addis Product Guild',
    organization_type: 'individual',
    website_url: 'https://addisproductguild.com',
    bio: 'Community-driven workshops for product managers and UX practitioners.',
    tax_id_number: 'TIN-APG-1009',
    business_registration_number: 'BRN-APG-2024-11',
    social_linkedin: 'https://linkedin.com/company/addis-product-guild',
    social_instagram: 'https://instagram.com/addisproductguild',
    social_x: 'https://x.com/addisproduct',
    work_email: 'hello@addisproductguild.com',
    verification_status: 'rejected',
    approved_by_admin_id: adminUserIds[0],
    approved_at: daysFromNowAtUtc(-10, 11, 20),
    created_at: daysFromNowAtUtc(-28, 9, 15)
  },
  {
    user_id: organizerUserIds[9],
    organization_name: 'Lakeview Festivals',
    organization_type: 'corporate',
    website_url: 'https://lakeviewfestivals.com',
    bio: 'Produces destination festivals and lifestyle gatherings in regional cities.',
    tax_id_number: 'TIN-LVF-1010',
    business_registration_number: 'BRN-LVF-2024-19',
    social_linkedin: 'https://linkedin.com/company/lakeview-festivals',
    social_instagram: 'https://instagram.com/lakeviewfestivals',
    social_x: 'https://x.com/lakeviewfests',
    work_email: 'operations@lakeviewfestivals.com',
    verification_status: 'rejected',
    approved_by_admin_id: adminUserIds[1],
    approved_at: daysFromNowAtUtc(-8, 16, 5),
    created_at: daysFromNowAtUtc(-24, 10, 10)
  }
];
