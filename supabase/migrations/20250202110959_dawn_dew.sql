-- First, delete any existing superadmin
DO $$ 
BEGIN
  -- Delete from auth.users (this will cascade to profiles due to foreign key)
  DELETE FROM auth.users 
  WHERE email = 'superadmin@performancepro.com';
END $$;

-- Create new superadmin user with proper password hashing
DO $$ 
DECLARE 
    new_user_id uuid;
BEGIN
    -- Generate UUID for new user
    new_user_id := uuid_generate_v4();
    
    -- Create auth user with properly hashed password
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        role,
        aud,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change_token_current,
        confirmation_sent_at,
        recovery_sent_at,
        email_change_sent_at,
        last_sign_in_at,
        is_sso_user,
        deleted_at,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at,
        email_change_confirm_status,
        phone_confirmed_at
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        'superadmin@performancepro.com',
        crypt('superadmin123', gen_salt('bf', 10)), -- Use proper bcrypt hashing with cost factor 10
        now(),
        'authenticated',
        'authenticated',
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        '{"full_name": "System Superadmin"}'::jsonb,
        true,
        encode(gen_random_bytes(32), 'base64'),
        encode(gen_random_bytes(32), 'base64'),
        encode(gen_random_bytes(32), 'base64'),
        encode(gen_random_bytes(32), 'base64'),
        now(),
        now(),
        now(),
        now(),
        false,
        null,
        null,
        encode(gen_random_bytes(32), 'base64'),
        now(),
        0,
        null
    );

    -- Create profile for superadmin
    INSERT INTO public.profiles (
        id,
        full_name,
        role,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        'System Superadmin',
        'superadmin',
        now(),
        now()
    );

    -- Create a session for the user
    INSERT INTO auth.sessions (
        id,
        user_id,
        created_at,
        updated_at,
        factor_id,
        aal,
        not_after
    ) VALUES (
        uuid_generate_v4(),
        new_user_id,
        now(),
        now(),
        null,
        'aal1',
        now() + interval '1 week'
    );

    -- Create a refresh token
    INSERT INTO auth.refresh_tokens (
        instance_id,
        token,
        user_id,
        revoked,
        created_at,
        updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        encode(gen_random_bytes(32), 'base64'),
        new_user_id,
        false,
        now(),
        now()
    );
END $$;
