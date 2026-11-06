-- Phoenix Intellex Row Level Security (RLS) & Access Control
-- Enforcing strict least-privilege company internal access

-- 1. ENABLE RLS ON ALL APPLICATION TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;

-- 2. HELPER FUNCTION: Check if the user is an active approved company staff member
CREATE OR REPLACE FUNCTION public.is_approved_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND is_approved = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. HELPER FUNCTION: Check if the user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND is_approved = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. POLICIES FOR PROFILES
-- Any authenticated user can view approved colleague profiles
CREATE POLICY "Approved staff can view employee profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (public.is_approved_staff());

-- Users can read their own profile even before approval
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Only admins can approve accounts or update roles
CREATE POLICY "Admins can update employee profiles"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- 5. POLICIES FOR CLIENTS
CREATE POLICY "Approved staff can view clients"
    ON public.clients FOR SELECT
    TO authenticated
    USING (public.is_approved_staff());

CREATE POLICY "Approved staff can insert clients"
    ON public.clients FOR INSERT
    TO authenticated
    WITH CHECK (public.is_approved_staff());

CREATE POLICY "Approved staff can update clients"
    ON public.clients FOR UPDATE
    TO authenticated
    USING (public.is_approved_staff());

-- 6. POLICIES FOR PROJECTS
CREATE POLICY "Approved staff can view projects"
    ON public.projects FOR SELECT
    TO authenticated
    USING (public.is_approved_staff());

CREATE POLICY "Approved staff can insert projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (public.is_approved_staff());

CREATE POLICY "Approved staff can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (public.is_approved_staff());

-- 7. POLICIES FOR INVOICES & PAYMENTS
CREATE POLICY "Approved staff can view invoices"
    ON public.invoices FOR SELECT
    TO authenticated
    USING (public.is_approved_staff());

CREATE POLICY "Approved staff can insert invoices"
    ON public.invoices FOR INSERT
    TO authenticated
    WITH CHECK (public.is_approved_staff());

CREATE POLICY "Approved staff can update invoices"
    ON public.invoices FOR UPDATE
    TO authenticated
    USING (public.is_approved_staff());

CREATE POLICY "Approved staff can view payments"
    ON public.payments FOR SELECT
    TO authenticated
    USING (public.is_approved_staff());

CREATE POLICY "Approved staff can insert payments"
    ON public.payments FOR INSERT
    TO authenticated
    WITH CHECK (public.is_approved_staff());

-- 8. POLICIES FOR REVIEWS
CREATE POLICY "Approved staff can view reviews"
    ON public.reviews FOR SELECT
    TO authenticated
    USING (public.is_approved_staff());

CREATE POLICY "Approved staff can insert reviews"
    ON public.reviews FOR INSERT
    TO authenticated
    WITH CHECK (public.is_approved_staff());

-- 9. POLICIES FOR TASKS
CREATE POLICY "Approved staff can view tasks"
    ON public.tasks FOR SELECT
    TO authenticated
    USING (public.is_approved_staff());

CREATE POLICY "Approved staff can manage tasks"
    ON public.tasks FOR ALL
    TO authenticated
    USING (public.is_approved_staff());

-- 10. POLICIES FOR IMPORTS
CREATE POLICY "Approved staff can view import logs"
    ON public.imports FOR SELECT
    TO authenticated
    USING (public.is_approved_staff());

CREATE POLICY "Approved staff can create import logs"
    ON public.imports FOR INSERT
    TO authenticated
    WITH CHECK (public.is_approved_staff());
