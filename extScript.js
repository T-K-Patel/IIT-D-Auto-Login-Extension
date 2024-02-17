// import { encryptMessage } from "./encrypt-decrypt";

// Utility functions for encoding and decoding
function bufferToBase64(buf) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
}

function base64ToBuffer(b64) {
    var binary_string = atob(b64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

// Derive a key from a password
async function deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}


function generateSalt(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function generatePassword(length) {
    // This is a simple example; consider including various character types for a stronger password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        const randomValue = window.crypto.getRandomValues(new Uint32Array(1))[0];
        password += characters.charAt(randomValue % charactersLength);
    }
    return password;
}

// Encrypt a message
async function encryptMessage(message) {

    const password = "create_your_own_password";
    const salt = "create_your_own_salt";
    const key = await deriveKey(password, salt);

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedMessage
    );
    return {
        iv: bufferToBase64(iv),
        ciphertext: bufferToBase64(ciphertext),
    };
}

const Form = document.getElementById("Form");
if (Form) {
    Form.addEventListener("submit", async (e) => {
        e.preventDefault()
        console.log(e)
        const inputs = Form.querySelectorAll("input");
        let formData = {}
        inputs.forEach(input => {
            if (input.type === 'text' || input.type === 'password' || input.type === 'tel') {
                if (input.value !== "") { formData[input.id] = input.value; }
            }
        });
        if (formData.spass) {
            const { iv, ciphertext } = await encryptMessage(formData.spass);
            formData.spass = ciphertext;
            formData.spass_iv = iv;
        }
        if (formData.kpass) {
            const { iv, ciphertext } = await encryptMessage(formData.kpass);
            formData.kpass = ciphertext;
            formData.kpass_iv = iv;
        }
        chrome.storage.local.set(formData)
        const popupDiv = document.getElementById("popup")
        const msg = document.getElementById("popupMsg")
        msg.innerText = "Data Saved"
        popupDiv.classList.remove("hidden");
        setTimeout(() => {
            popupDiv.classList.add("hidden");
            window.location.reload();
        }, 2000)
    })
}
const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", function () {
    const inputs = ["kuser", "kpass", "entry", "spass", "mobile", "kpass_iv", "spass_iv"]
    chrome.storage.local.remove(inputs)

    const popupDiv = document.getElementById("popup")
    const msg = document.getElementById("popupMsg")
    msg.innerText = "Data Deleted"
    popupDiv.classList.remove("hidden");
    setTimeout(() => {
        popupDiv.classList.add("hidden");
        window.location.reload();
    }, 2000)
})

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(
        ["kuser", "kpass", "entry", "spass", "mobile"],
        function (result) {
            const inputs = Form.querySelectorAll("input");
            let data = false;
            inputs.forEach(input => {
                if (input.type === 'text' || input.type === 'tel') {
                    input.value = result[input.id] || ""
                    if (input.value !== "") data = true
                } else if (input.type === 'password' && result[input.id] && result[input.id] !== "") {
                    input.placeholder = "(Saved)"
                    if (input.value !== "") data = true
                }
            });
            if (data) {
                submitForm.innerText = "Update"
            }
        }
    )
})