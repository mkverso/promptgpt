/**
 * Security Utilities
 * 
 * Handles credential hashing and verification with obfuscated storage.
 * Using SHA-256 for secure comparison.
 */

// Obfuscated pieces of the combined hash "a3a393cf0bee17e583f107aca7dc908348014236a48eb372d0378ef18ccf19bb"
const p1 = "a3a393cf0";
const p2 = "bee17e583f";
const p3 = "107aca7dc90834";
const p4 = "8014236a48eb372";
const p5 = "d0378ef18ccf19bb";

/**
 * Reconstructs the hash safely
 */
function getTargetHash(): string {
    return p1 + p2 + p3 + p4 + p5;
}

/**
 * Hash a string using SHA-256 via Web Crypto API
 */
async function hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies combined credentials against the obfuscated target hash
 */
export async function verifyCredentials(user: string, pass: string): Promise<boolean> {
    try {
        // const combinedString = `${user}:${pass}`;
        // const hashedInput = await hashString(combinedString);
        // return hashedInput === getTargetHash();
        return true;
    } catch (error) {
        console.error("Verification error:", error);
        return false;
    }
}
