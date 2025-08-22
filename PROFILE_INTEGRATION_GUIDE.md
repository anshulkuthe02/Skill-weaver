# Profile Details Integration Guide

This guide explains how to set up and use the Profile Details integration with Supabase for the SkillWeave application.

## 🚀 Quick Setup

### Step 1: Create the Profile Details Table

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Run the SQL script from `create_profile_details_table.sql`

```sql
-- The script will create:
-- ✅ Profile Details table with all necessary columns
-- ✅ Indexes for performance
-- ✅ Row Level Security (RLS) policies
-- ✅ Automatic timestamp updates
-- ✅ Unique constraint on user_id
```

### Step 2: Verify Table Creation

After running the script, check:
- Table `Profile Details` exists in your Supabase database
- RLS policies are enabled
- Indexes are created
- Triggers are active

### Step 3: Test the Integration

1. Start your application:
   ```bash
   npm run dev
   ```

2. Navigate to `/profile` (requires authentication)
3. Try creating/editing your profile
4. Check the database to see the data being saved

## 📊 Database Schema

### Profile Details Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `user_id` | UUID | Foreign key to auth.users |
| `first_name` | TEXT | User's first name |
| `last_name` | TEXT | User's last name |
| `email` | TEXT | User's email address |
| `title` | TEXT | Professional title |
| `bio` | TEXT | User biography |
| `location` | TEXT | User location |
| `phone` | TEXT | Phone number |
| `website` | TEXT | Personal website URL |
| `github` | TEXT | GitHub username |
| `linkedin` | TEXT | LinkedIn username |
| `avatar_url` | TEXT | Profile picture URL |
| `skills` | TEXT[] | Array of skills |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### Security Features

- **Row Level Security (RLS)**: Users can only access their own profile data
- **Unique Constraint**: One profile per user
- **Foreign Key**: Links to Supabase auth.users table
- **Automatic Timestamps**: Created/updated timestamps managed automatically

## 🔧 Frontend Integration

### Services Layer

- **`profileService.ts`**: Handles all CRUD operations for profiles
- **`AuthContext.tsx`**: Provides user authentication state
- **`Profile.tsx`**: Main profile management component

### Key Features

1. **Auto-creation**: Profile created automatically on first visit
2. **Real-time Updates**: Changes saved immediately to Supabase
3. **Skills Management**: Add/remove skills with interactive UI
4. **Form Validation**: Proper error handling and user feedback
5. **Loading States**: Visual feedback during operations

### Profile Component Features

- ✅ Personal information management
- ✅ Social links (website, GitHub, LinkedIn)
- ✅ Skills management with add/remove functionality
- ✅ Avatar display with upload placeholder
- ✅ Real-time saving with loading indicators
- ✅ Error handling with toast notifications

## 🔒 Authentication Flow

### User Journey

1. **Login/Signup**: User authenticates with Supabase Auth
2. **Unique ID Assignment**: Supabase generates unique user ID automatically
3. **Profile Creation**: Profile created with user_id reference
4. **Data Access**: RLS ensures users only see their own data

### Security Implementation

```typescript
// Example: Profile service with RLS
const { data, error } = await supabase
  .from('Profile Details')
  .select('*')
  .eq('user_id', userId)  // RLS ensures this filters to current user
  .single();
```

## 📝 Usage Examples

### Create Profile

```typescript
const newProfile = await profileService.createProfile({
  user_id: user.id,
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  title: "Full Stack Developer",
  bio: "Passionate developer...",
  skills: ["React", "Node.js", "TypeScript"]
});
```

### Update Profile

```typescript
const updatedProfile = await profileService.updateProfile(userId, {
  title: "Senior Developer",
  location: "San Francisco, CA"
});
```

### Add Skills

```typescript
const updatedProfile = await profileService.updateSkills(userId, [
  ...existingSkills,
  "Next.js",
  "Python"
]);
```

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check that policies are correctly applied
   - Verify user_id matches auth.uid()

2. **Table Not Found**
   - Run the SQL script in Supabase SQL Editor
   - Check table name matches exactly: `"Profile Details"`
   - Verify permissions are granted

3. **Skills Array Issues**
   - PostgreSQL TEXT[] arrays require proper formatting
   - Empty arrays should be `ARRAY[]::TEXT[]`
   - Use PostgreSQL array functions for complex operations

4. **Authentication Issues**
   - Verify Supabase environment variables
   - Check AuthProvider wraps the app
   - Ensure user is logged in before accessing profile

### Error Messages

| Error | Solution |
|-------|----------|
| "Failed to fetch profile" | Check RLS policies and user authentication |
| "Table doesn't exist" | Run the table creation script |
| "Permission denied" | Verify RLS policies and user permissions |
| "Unique constraint violation" | User already has a profile, use update instead |

## 🔄 Data Flow

1. **Component Mount**: Profile page loads
2. **Check Authentication**: Verify user is logged in
3. **Fetch Profile**: Load existing profile or create new one
4. **Display Data**: Show profile information in form
5. **Edit Mode**: Enable editing with form validation
6. **Save Changes**: Update database with new information
7. **Feedback**: Show success/error messages to user

## 🚀 Advanced Features

### Future Enhancements

1. **Avatar Upload**: Integration with Supabase Storage
2. **Profile Sharing**: Public profile URLs
3. **Export Data**: PDF/JSON profile export
4. **Activity Logging**: Track profile view/edit history
5. **Bulk Operations**: Import/export multiple profiles

### Performance Optimizations

1. **Caching**: Client-side profile caching
2. **Pagination**: For large skill lists
3. **Debouncing**: Reduce API calls during typing
4. **Optimistic Updates**: Immediate UI feedback

## 📚 Resources

- [Supabase Documentation](https://docs.supabase.com)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Arrays](https://www.postgresql.org/docs/current/arrays.html)
- [React Hook Form](https://react-hook-form.com) (for future form enhancements)

## ✅ Verification Checklist

- [ ] Supabase project created and configured
- [ ] Environment variables set up correctly
- [ ] Profile Details table created with RLS
- [ ] Authentication working in the app
- [ ] Profile page accessible at `/profile`
- [ ] Profile creation/update working
- [ ] Skills add/remove functionality working
- [ ] Error handling and loading states working
- [ ] Data persisting in Supabase database

Your Profile Details integration is now complete and ready for production use! 🎉
