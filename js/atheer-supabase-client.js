const SUPABASE_URL = 'https://nqbalxaeetwhiujbbpya.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmFseGFlZXR3aGl1amJicHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTk5NjUsImV4cCI6MjA5ODQ3NTk2NX0.g1-S0AA-SqdZB2L3VsWFYfoWm00YzOwfHPqjI_3fKdo';

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchProfile(userId){
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if(error) throw error;
  return data;
}

async function registerClient(name, email, phone, pass, city){
  const { data, error } = await client.auth.signUp({ email, password: pass });
  if(error) throw error;
  const userId = data.user?.id;
  if(!userId) throw new Error('تعذر إنشاء الحساب، حاول مرة أخرى');
  const { error: profileErr } = await client.from('profiles').insert({
    id: userId, role: 'client', name, email, phone, city, status: 'active',
  });
  if(profileErr) throw profileErr;
  return { id: userId };
}

async function registerPhotographer(name, email, phone, pass, city){
  const { data, error } = await client.auth.signUp({ email, password: pass });
  if(error) throw error;
  const userId = data.user?.id;
  if(!userId) throw new Error('تعذر إنشاء الحساب، حاول مرة أخرى');
  const { error: profileErr } = await client.from('profiles').insert({
    id: userId, role: 'photographer', name, email, phone, city, status: 'pending',
  });
  if(profileErr) throw profileErr;
  return { id: userId };
}

async function login(email, password){
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if(error) throw error;
  const profile = await fetchProfile(data.user.id);
  return { profile };
}

async function logout(){
  await client.auth.signOut();
}

window.AtheerAPI = { registerClient, registerPhotographer, login, logout };
window.AtheerSupabase = client;
