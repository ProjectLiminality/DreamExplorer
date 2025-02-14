# Semantic Search Application

This is an Electron-based desktop application with a React frontend that performs semantic search using TensorFlow.js and the Universal Sentence Encoder model.

## Features

- Semantic search functionality
- Cosine similarity calculation
- User-friendly graphical interface
- Directory selection for search targets
- Configurable number of search results

## Prerequisites

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install the required packages:

```
npm install
```

## Usage

To run the application in development mode:

```
npm start
```

To build the application for production:

```
npm run build
```

## Technologies Used

- Electron
- React
- TensorFlow.js
- Universal Sentence Encoder
- HTML/CSS
- JavaScript

## Project Structure

- `main.js`: Electron main process file
- `src/App.js`: Main React component
- `src/SearchComponent.js`: React component for search functionality
- `public/index.html`: HTML template

## Configuration

The application uses a `config.json` file for storing settings. You can modify this file to change default behaviors.

## License

This project is open source and available under the [MIT License](LICENSE).
