# Institution User Management Feature

## Overview
This feature allows administrators to:
1. Mass assign users to institutions
2. View users assigned to each institution
3. Display institution statistics on the dashboard including unassigned users

## New API Endpoints

### 1. Assign Users to Institution
- **Endpoint**: `/api/institution/assignUsers`
- **Method**: POST/PUT
- **Body**:
  ```json
  {
    "userIds": ["user_id_1", "user_id_2"],
    "institutionId": "institution_id"
  }
  ```
- **Response**:
  ```json
  {
    "isError": false,
    "message": "Users assigned to institution successfully",
    "modifiedCount": 2
  }
  ```

### 2. Fetch Institution Users
- **Endpoint**: `/api/institution/fetchInstitutionUsers`
- **Method**: GET/POST
- **Query Params** (GET): `institutionId`, `limit`, `skip`
- **Body** (POST):
  ```json
  {
    "institutionId": "institution_id",
    "limit": 10,
    "skip": 0
  }
  ```
- **Response**:
  ```json
  {
    "isError": false,
    "users": [...]
  }
  ```

## Database Changes

### Users Collection
- Added `institution_id` field (ObjectId) - already exists
- Users now include institution information in aggregation queries

### Stats Enhancement
The stats endpoint now returns:
- `institutions`: Total number of institutions
- `verified_institutions`: Number of verified institutions
- `unassigned_users`: Number of users without an institution

## Frontend Components

### 1. UsersListView Enhancement
- Added "Assign to Institution" button
- Shows institution name in user table
- Modal for bulk assignment to institution
- Filters verified institutions for assignment

### 2. InstitutionUsersView (New)
- Component to display all users assigned to an institution
- Paginated list with load more functionality
- Shows user details: name, email, phone, role

### 3. InstitutionsListView Enhancement
- Added "View Users" button for each institution
- Modal to display users assigned to institution
- Verification filter: All, Pending, Verified

### 4. Dashboard Enhancement
- Shows total institutions count
- Shows verified institutions count
- Shows unassigned users count

## User Workflow

### Admin Assigns Users to Institution
1. Navigate to Users page
2. Select one or more users using checkboxes
3. Click "Assign to Institution" button
4. Select an institution from dropdown (only verified institutions shown)
5. Click "Assign"
6. Users are now associated with the selected institution

### Admin Views Institution Users
1. Navigate to Institutions page
2. Click "View Users" button on any institution row
3. Modal opens showing all users assigned to that institution
4. Users can be paginated with "Load More" button

### Dashboard Statistics
The admin dashboard now displays:
- Total Institutions card
- Verified Institutions card
- Unassigned Users card (users without institution)

## Technical Implementation

### Hook Updates
- `useUser`: Added `assignUsersToInstitution` function
- `useInstitution`: Already has necessary functions

### Type Updates
- `I_UserFields`: Added `institution_id` and `institutionName` fields
- `I_RawUserFields`: Added `institution_id` and `institutionName` fields
- `I_PublicInstitution`: Added `is_verified` field

### API Link Updates
- `ASSIGN_USERS_TO_INSTITUTION`: '/api/institution/assignUsers'
- `FETCH_INSTITUTION_USERS`: '/api/institution/fetchInstitutionUsers'

## Benefits
1. **Better Organization**: Users are now properly organized by institution
2. **Easy Bulk Operations**: Admins can assign multiple users at once
3. **Visibility**: Easy to see which users belong to which institution
4. **Analytics**: Dashboard shows institution-related statistics
5. **Tracking**: Identify users who haven't been assigned to any institution
