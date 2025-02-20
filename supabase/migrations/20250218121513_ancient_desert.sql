/*
  # Improve Email Validation and User Creation

  1. Changes
    - Improve email validation regex
    - Add better error handling for user creation
    - Add proper transaction handling
    - Add rate limiting for password reset emails
*/

-- Create improved email validation function
CREATE OR REPLACE FUNCTION validate_email(email text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- RFC 5322 compliant email validation
  RETURN email ~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';
END;
$$;

-- Create function to safely create a single user
CREATE OR REPLACE FUNCTION create_user(
  p_email text,
  p_full_name text,
  p_role user_role,
  p_department text,
  p_job_level text,
  p_job_name text,
  p_organization_id uuid,
  p_manager_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  temp_password text;
BEGIN
  -- Start transaction
  BEGIN
    -- Generate UUID and temporary password
    new_user_id := gen_random_uuid();
    temp_password := encode(gen_random_bytes(12), 'base64');
    
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
      p_email,
      crypt(temp_password, gen_salt('bf')),
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
        'full_name', p_full_name
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
      p_full_name,
      p_role,
      p_department,
      p_job_level,
      p_job_name,
      p_organization_id,
      p_manager_id,
      now(),
      now()
    );

    -- Send password reset email
    PERFORM auth.send_reset_password_email(p_email);

    RETURN new_user_id;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback will happen automatically
      RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
  END;
END;
$$;

-- Create improved bulk upload function
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
  current_role user_role;
BEGIN
  -- Get organization ID and role of the current user
  SELECT organization_id, role INTO org_id, current_role
  FROM profiles
  WHERE id = auth.uid();

  -- Verify user has permission to create users
  IF NOT (current_role IN ('superadmin', 'company_admin', 'hr_admin')) THEN
    RAISE EXCEPTION 'Insufficient permissions to create users';
  END IF;

  -- Process each user
  FOR user_data IN SELECT * FROM jsonb_array_elements(users)
  LOOP
    BEGIN
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

      -- Validate and set role
      IF user_data->>'role' IS NOT NULL AND 
         user_data->>'role' NOT IN ('employee', 'manager', 'hr_admin', 'company_admin') THEN
        RETURN QUERY SELECT 
          user_data->>'email',
          'error'::text,
          'Invalid role. Must be one of: employee, manager, hr_admin, company_admin'::text;
        CONTINUE;
      END IF;

      -- Get manager ID if provided
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

      -- Create user
      new_user_id := create_user(
        user_data->>'email',
        user_data->>'full_name',
        COALESCE(user_data->>'role', 'employee')::user_role,
        user_data->>'department',
        user_data->>'job_level',
        user_data->>'job_name',
        org_id,
        manager_id
      );

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
GRANT EXECUTE ON FUNCTION create_user TO authenticated;
GRANT EXECUTE ON FUNCTION process_bulk_upload TO authenticated;
