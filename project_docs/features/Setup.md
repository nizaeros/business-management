User Types and Roles
✅ The main user types are:

Admin (Super admin who can invite users)
Internal Users (Business staff)
External Users (Client staff)
✅ Roles within user types:

Internal Users: Manager, Staff, etc.
External Users: Client-specific roles (to be defined later)
Access permissions will be defined later.
Business Structure
✅ A business can have multiple branches/locations.
✅ Each business will have its own divisions, tracked as Divisions.
✅ Internal users will be associated with specific divisions.

✅ Businesses Table (businesses)

Column	Description
id	Unique business identifier (UUID)
name	Business name
registered_name	Official registered name (optional)
business_code	Unique code assigned to the business
logo_url	URL for the business logo
city, state, country	Business location information
address_line1, address_line2	Address details
slug	Unique identifier for URL-friendly reference
created_at, created_by	Timestamp & user who created the record
updated_at, updated_by	Timestamp & user who last updated the record
✅ This table will manage internal businesses, and each business can have multiple branches/locations.

Client Management
✅ Clients can have multiple locations/branches.
✅ Clients can have multiple points of contact (users).
✅ Clients will need different permission levels for their users in the future (not now).

✅ Clients Table (clients)

Column	Description
id	Unique client identifier (UUID)
name, registered_name	Client's business name & official name
short_code	Unique short code
address_line1, address_line2, city, state, country, pin_code	Client address details
gstin	Tax ID (if applicable)
industry_id, entity_type_id, parent_organization_id	Classification & parent organization references
logo_url	Client’s logo
is_active	Active status flag (default: true)
created_at, created_by, updated_at, updated_by	Timestamps & record management
slug	Unique URL-friendly identifier
User Invitation Flow
✅ Invited users should receive an email with a setup link.
✅ There will be no time limit for the invitation.
✅ Admins should be able to resend invitations.

Authentication Requirements
✅ Passwords must be alphanumeric.
✅ MFA (Multi-Factor Authentication) is not required.
✅ Session timeouts will not be implemented.

Dashboard Access
✅ Internal Dashboard Features:

Business Management
Client Management
User Management (Internal & External)
✅ Client Dashboard Features:

Service Agreement
Client Users Management
✅ Activity Logging will be implemented later.

Database Structure & Tables
✅ Users Table (auth.users & public.users)

auth.users (Supabase authentication)
public.users (Extended user details)
✅ Business Users Table (business_users)

Maps internal staff to business units
Internal staff can be associated with multiple businesses
✅ Client Users Table (client_users)

Column	Description
id	Unique identifier (UUID)
client_id	References the clients table
profile_id	References the public.users table (external user profile)
created_at, created_by, updated_at, updated_by	Record management timestamps
✅ External users can be associated with multiple clients.