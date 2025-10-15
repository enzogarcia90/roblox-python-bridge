-- Add DELETE policy for roblox_messages table to allow admins to delete messages
CREATE POLICY "Admins can delete messages" 
ON public.roblox_messages 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'::app_role));