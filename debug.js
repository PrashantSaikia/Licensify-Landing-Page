// Debugging script for duplicate email issue
// Run this in your browser console on the landing page

console.log('=== LICENSIFY DEBUG MODE ===');

// Check if Supabase config is loaded
console.log('1. Supabase Config:', window.SUPABASE_CONFIG);

// Check if Supabase client is initialized
console.log('2. Supabase Client Available:', typeof window.supabase);

// Check if we can access the database
async function debugSupabase() {
    try {
        if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
            const supabase = window.supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anonKey
            );
            
            console.log('3. Supabase Client Created:', !!supabase);
            
            // Test a simple query
            const { data, error } = await supabase
                .from('early_access_emails')
                .select('email')
                .limit(1);
            
            if (error) {
                console.error('4. Database Query Error:', error);
                return false;
            } else {
                console.log('4. Database Query Success:', data);
                return true;
            }
        } else {
            console.error('3. Supabase Config Missing');
            return false;
        }
    } catch (error) {
        console.error('4. Supabase Error:', error);
        return false;
    }
}

// Test duplicate email checking
async function testDuplicateCheck(email) {
    console.log('\n=== TESTING DUPLICATE CHECK ===');
    console.log('Testing email:', email);
    
    try {
        if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
            const supabase = window.supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.anonKey
            );
            
            const { data, error } = await supabase
                .from('early_access_emails')
                .select('email')
                .eq('email', email.toLowerCase())
                .limit(1);
            
            if (error) {
                console.error('Duplicate Check Error:', error);
                return false;
            }
            
            console.log('Query Result:', data);
            console.log('Email exists:', data && data.length > 0);
            return data && data.length > 0;
        }
    } catch (error) {
        console.error('Duplicate Check Exception:', error);
        return false;
    }
}

// Run the debug
debugSupabase().then(success => {
    console.log('5. Overall Database Status:', success ? 'WORKING' : 'FAILED');
    
    if (success) {
        console.log('\n=== INSTRUCTIONS ===');
        console.log('1. To test duplicate checking, run:');
        console.log('   testDuplicateCheck("your-email@example.com")');
        console.log('2. Replace "your-email@example.com" with an actual email from your database');
        console.log('3. Check the result - it should return true if email exists');
        
        // Make function available globally
        window.testDuplicateCheck = testDuplicateCheck;
    }
});

console.log('=== END DEBUG MODE ===\n'); 