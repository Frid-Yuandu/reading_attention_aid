
# Project Overview

This project is a browser extension designed to aid users with reading difficulties by allowing them to customize the appearance of text on web pages.

## Main Features

*   **Customizable Bolding:** Users can specify the percentage of each word to be bolded, allowing for a personalized reading experience.
*   **Preserves Page Structure:** The extension modifies only text content, leaving the original HTML structure of the page intact.

## Architecture

The extension is built using TypeScript and Vite. It follows the standard structure of a Chrome extension:

*   **`manifest.json`**: Defines the extension's properties, permissions, and entry points.
*   **`background.ts`**: A service worker that runs in the background, currently used for initialization tasks.
*   **`content_script.ts`**: Injected into web pages to modify their content. It listens for messages from the popup and applies custom styles.
*   **`popup.html` / `popup.ts`**: The UI for the extension's popup, allowing users to change settings.
*   **`options.html` / `options.ts`**: A dedicated options page for more persistent settings.
*   **`vite.config.ts`**: The build configuration for Vite, which bundles the TypeScript files into JavaScript.
*   **`tsconfig.json`**: TypeScript compiler options.

## Conventions

*   **Always follow a functional programming style.**
*   Use TypeScript for all new code.
*   Follow the existing linting rules defined in `tsconfig.json`.
*   Use `chrome.storage.local` to store user settings.
*   Communicate between the popup and content script using `chrome.runtime.sendMessage` and `chrome.runtime.onMessage`.
*   Use Vite for building the project.
