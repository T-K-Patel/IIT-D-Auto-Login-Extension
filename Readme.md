# IIT-D Auto Login Extension

Welcome to the IIT-D Auto Login Extension! This Chrome extension is designed to simplify and automate the login process for various IIT-Delhi portals. By securely storing your login credentials locally, the extension bypasses the manual labor involved in logging into these portals. With just a simple alert asking for your permission, the extension takes care of the rest, ensuring you're logged in swiftly and securely.

## Key Features

- **Secure Credential Storage**: Your login details are stored securely on your local machine, ensuring they are accessible only to you and the extension.
- **Automatic Login**: Once permission is granted via a pop-up alert, the extension automatically fills in your login credentials, saving you time and effort.
- **User-Friendly**: Designed with simplicity in mind, making the login process hassle-free for all IIT-D portals.

# Getting Started

## Downloading the Extension

To get started with the IIT-D Auto Login Extension, follow these steps to download it directly from this GitHub repository:

1. **Download the Extension**: Click the green **Code** button located at the top of this page, then select **Download ZIP** from the dropdown menu.

2. **Extract the ZIP File**: After downloading, locate the ZIP file on your computer. Right-click on it and select **Extract All**. Choose a destination folder for the extracted contents, and proceed with the extraction.

By following these steps, you will have all necessary files to begin using the IIT-D Auto Login Extension.

## Configure Encryption Settings

For security, set your unique encryption password and salt in the `extScript.js` and `script.js` files.

### Quick Steps:

1. **Edit `extScript.js`**: Open `extScript.js`, and replace the placeholder values in the following lines (around lines 64 and 65) with your own unique entries:
   ```javascript
   const password = "create_your_own_password";
   const salt = "create_your_own_salt";
   ```
2. **Edit `script.js`**: Open `script.js`, and replace the placeholder values in the following lines (around lines 53 and 54) with your own unique entries:
   ```javascript
   const password = "create_your_own_password";
   const salt = "create_your_own_salt";
   ```

### Note:

Both files should have same **password** and **salt**.
Ensure your password and salt are unique and kept secure. Save the changes in both files to complete the setup.

Now that you have the extension files on your computer, you can proceed with [loading the extension in Chrome](#loading-the-extension-in-chrome) as described in the subsequent sections of this README.

# Loading the Extension in Chrome

This guide will walk you through the process of manually loading your extension into Google Chrome. This is particularly useful for development, testing, or trying out an extension that's not available on the Chrome Web Store.

## Prerequisites

Before loading the extension, ensure you have:

- Google Chrome browser installed on your computer.
- The extracted extension directory from the ZIP file you downloaded.

## Steps to Load the Extension

1. **Open Google Chrome**

   Launch the Google Chrome browser on your computer.

2. **Access Extensions Page**

   - Open the Chrome menu by clicking the three dots in the upper-right corner of the browser.
   - Hover over **More Tools**, then click on **Extensions** from the submenu. Alternatively, you can type `chrome://extensions/` in the address bar and press Enter.

3. **Enable Developer Mode**

   - At the top-right corner of the Extensions page, toggle the **Developer mode** switch to the ON position. This will enable additional options for loading unpacked extensions.

4. **Load Unpacked Extension**

   - Click the **Load unpacked** button that appears after you enable Developer mode.
   - Navigate to the directory where your extension files are located. This folder should contain your extension's manifest file.
   - Select the folder and click the **Open** button. Chrome will now load your extension.

5. **Verify Installation**

   - After loading, your extension should appear on the Extensions page with an **ID**, along with options to inspect views if applicable, remove, or disable the extension.
   - You can also see your extension's icon in the Chrome toolbar, indicating it's active. If it doesn't appear, make sure it's pinned for easy access.


## Updating the Extension

Whenever you make changes to the extension's code:

1. Go back to the `chrome://extensions/` page.
2. Find your extension in the list.
3. Click the **Reload** (⟳) button on your extension's card to apply the changes.

# General

## Privacy and Security

Your privacy and security are paramount. The IIT-D Auto Login Extension is designed with the following principles in mind:

- **Local Storage**: Credentials are stored locally on your device and are not transmitted over the internet.
- **Permission-Based**: The extension will only attempt to log in after receiving explicit permission via a pop-up alert.

## Support and Contributions

For support, suggestions, or contributions, please visit the [Issues](issues) section of the GitHub repository. We welcome your feedback and contributions to make this extension even better!

## Disclaimer

This extension is developed independently and is not officially affiliated with IIT Delhi.

Thank you for choosing the IIT-D Auto Login Extension. Enjoy a more streamlined and efficient login experience!
