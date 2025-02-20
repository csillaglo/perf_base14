/*
  # Improve Bulk User Upload

  1. New Functions
    - `validate_email(email text)`: Validates email format
    - `process_bulk_upload(users jsonb)`: Processes bulk user upload
  
  2. Changes
    - Add helper functions for bulk upload validation and processing
    - Add proper error handling and validation
*/

-- Create email validation function
CREATE OR REPLACE FUNCTION validate_email(email text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Create function to process bulk user upload
CREATE OR REPLACE FUNCTION process_bulk_upload(users jsonb)
RETURNS TABLE (
  email text,
  status text,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_data jsonb;
  new_user_id uuid;
  manager_id uuid;
  org_id uuid;
BEGIN
  -- Get organization ID of the current user
  SELECT organization_id INTO org_id
  FROM profiles
  WHERE id = auth.uid();

  -- Process each user
  FOR user_data IN SELECT * FROM jsonb_array_elements(users)
  LOOP
    -- Validate required fields
    IF user_data->>'email' IS NULL THEN
      RETURN QUERY SELECT 
        user_data->>'email',
        'error'::text,
        'Email is required'::text;
      CONTINUE;
    END IF;

    -- Validate email format
    IF NOT validate_email(user_data->>'email') THEN
      RETURN QUERY SELECT 
        user_data->>'email',
        'error'::text,
        'Invalid email format'::text;
      CONTINUE;
    END IF;

    -- Check if email already exists
    IF EXISTS (
      SELECT 1 FROM auth.users
      WHERE email = user_data->>'email'
    ) THEN
      RETURN QUERY SELECT 
        user_data->>'email',
        'error'::text,
        'Email already exists'::text;
      CONTINUE;
    END IF;

    -- Validate role
    IF user_data->>'role' IS NOT NULL AND 
       user_data->>'role' NOT IN ('employee', 'manager', 'hr_admin', 'company_admin') THEN
      RETURN QUERY SELECT 
        user_data->>'email',
        'error'::text,
        'Invalid role. Must be one of: employee, manager, hr_admin, company_admin'::text;
      CONTINUE;
    END IF;

    -- If manager_email is provided, validate it exists and is a manager
    IF user_data->>'manager_email' IS NOT NULL THEN
      SELECT p.id INTO manager_id
      FROM profiles p
      JOIN auth.users u ON u.id = p.id
      WHERE u.email = user_data->>'manager_email'
      AND p.role = 'manager'
      AND p.organization_id = org_id;

      IF manager_id IS NULL THEN
        RETURN QUERY SELECT 
          user_data->>'email',
          'error'::text,
          'Manager email not found or user is not a manager'::text;
        CONTINUE;
      END IF;
    END IF;

    -- Create the user
    BEGIN
      -- Generate temporary password
      new_user_id := gen_random_uuid();
      
      -- Insert into auth.users
      INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        role,
        aud,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data
      ) VALUES (
        new_user_id,
        user_data->>'email',
        crypt(gen_random_uuid()::text, gen_salt('bf')),
        now(),
        'authenticated',
        'authenticated',
        now(),
        now(),
        jsonb_build_object(
          'provider', 'email',
          'providers', array['email']
        ),
        jsonb_build_object(
          'full_name', user_data->>'full_name'
        )
      );

      -- Insert into profiles
      INSERT INTO profiles (
        id,
        full_name,
        role,
        department,
        job_level,
        job_name,
        organization_id,
        manager_id,
        created_at,
        updated_at
      ) VALUES (
        new_user_id,
        user_data->>'full_name',
        COALESCE(user_data->>'role', 'employee')::user_role,
        user_data->>'department',
        user_data->>'job_level',
        user_data->>'job_name',
        org_id,
        manager_id,
        now(),
        now()
      );

      -- Send password reset email
      PERFORM auth.send_reset_password_email(user_data->>'email');

      RETURN QUERY SELECT 
        user_data->>'email',
        'success'::text,
        'User created successfully'::text;

    EXCEPTION WHEN OTHERS THEN
      RETURN QUERY SELECT 
        user_data->>'email',
        'error'::text,
        'Failed to create user: ' || SQLERRM;
    END;
  END LOOP;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION validate_email TO authenticated;
GRANT EXECUTE ON FUNCTION process_bulk_upload TO authenticated;
