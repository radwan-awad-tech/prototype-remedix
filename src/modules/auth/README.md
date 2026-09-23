# Authentication & User Self-Service Module

## Module Purpose
The Auth module handles user identity, session management, and role-based access control (RBAC). It also provides self-service features for users to manage their personal profiles and application preferences.

## Main Pages/Components
- **LoginPage**: Secure entry point for users to authenticate with the system.
- **ProfilePage**: Displays the current user's personal and professional information.
- **UserSettingsPage**: Allows users to manage their profile details, appearance (theme/language), security (password), and notification preferences.
- **AuthContext**: React Context provider that manages the global authentication state, user profile, and session tokens.
- **AccessDeniedPage**: Fallback view for users attempting to access restricted areas without proper permissions.

## Visible User Flows
1. **User Login**: User enters credentials, the system validates them (mock), and redirects the user to the dashboard upon success.
2. **Profile Review**: User views their own profile to verify personal and work-related details.
3. **Preference Management**: User updates application theme or language in the Settings page.
4. **Security Update**: User changes their password or manages security settings.
5. **Logout**: User chooses to sign out, clearing their session data and returning to the login page.

## Major Actions
- **Login/Logout**: Establish or terminate a user session.
- **Update Profile**: Modify personal contact information.
- **Change Theme/Language**: Toggle between available UI presets and languages (English/Arabic).
- **Change Password**: Update account security credentials.

## Current Mock/Scaffolded Behavior
- **Authentication**: Credentials are checked against a hardcoded list of mock users.
- **Tokens**: A simulated JWT is generated and stored in `localStorage`.
- **Persistence**: Session data is retrieved from `localStorage` on application initialization.
- **Settings**: Theme and language changes are applied globally via `SettingsContext` but are not persisted to a backend.

## Known Limitations
- Real backend validation of credentials and tokens is not implemented.
- Password reset and multi-factor authentication are currently placeholders.
- Profile and setting changes are not saved to a persistent database.

## Likely Future Backend/API Needs
- `POST /api/auth/login`: Authenticate user and return JWT.
- `POST /api/auth/logout`: Invalidate current session.
- `GET /api/auth/me`: Fetch current user profile based on token.
- `PUT /api/auth/profile`: Update user profile information.
- `PUT /api/auth/settings`: Save user preferences (theme, language, notifications).
- `POST /api/auth/change-password`: Securely update user password.
- `POST /api/auth/refresh`: Refresh JWT token.
- `POST /api/auth/reset-password`: Initiate password recovery flow.

