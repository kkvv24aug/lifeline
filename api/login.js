export default function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // ==========================================
    // 🔒 YOUR HARDCODED SECRETS 
    // Change these to your actual answers!
    // ==========================================
    const SECRET_PASSWORD = "kkvlforever";
    
    // For the questions, write the answers in ALL LOWERCASE. 
    // The code will automatically lowercase her answers so it matches 
    // even if she uses capital letters.
    const Q1_ANSWER = "kuchhur puchhur"; 
    const Q2_ANSWER = "01/06/2025"; // Date format can be whatever you want, just make sure it matches what she types!
    const Q3_ANSWER = "😭🫂💋"; // Format must match exactly what she types
    // ==========================================

    const data = req.body;
    let isAuthenticated = false;

    // 2. Check which form was submitted and verify answers
    if (data.loginType === 'password') {
        if (data.password === SECRET_PASSWORD) {
            isAuthenticated = true;
        }
    } else if (data.loginType === 'questions') {
        // We use .toLowerCase() and .trim() so accidental spaces or capitals don't lock her out!
        const ans1 = (data.q1 || '').toLowerCase().trim();
        const ans2 = (data.q2 || '').toLowerCase().trim();
        const ans3 = (data.q3 || '').toLowerCase().trim();

        if (ans1 === Q1_ANSWER && ans2 === Q2_ANSWER && ans3 === Q3_ANSWER) {
            isAuthenticated = true;
        }
    }

    // 3. Handle the result
    if (isAuthenticated) {
        // Success! We create a secure cookie valid for 30 days (2592000 seconds)
        // HttpOnly means hackers/JavaScript cannot read it.
        // Secure means it only sends over HTTPS.
        const cookie = `vk_auth_token=true_love_unlocked; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax; Secure`;
        
        res.setHeader('Set-Cookie', cookie);
        return res.status(200).json({ success: true, message: 'Welcome in!' });
    } else {
        // Failed login
        return res.status(401).json({ success: false, message: 'Incorrect. Try again, love. ❤️' });
    }
}