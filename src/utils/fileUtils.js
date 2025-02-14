import DreamVaultStructure from '../DreamVaultStructure.json';

async function fetchFileContent(filePath) {
  console.log(`Fetching file content for: ${filePath}`);
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}${filePath}`);
    console.log(`Fetch response status: ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(`File content loaded for: ${filePath}`);
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching file content:', error);
    return null;
  }
}

function getMimeType(fileExtension) {
  const mimeTypes = {
    'gif': 'image/gif',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp'
  };
  return mimeTypes[fileExtension] || 'application/octet-stream';
}

async function fetchMediaFile(filePath) {
  const content = await fetchFileContent(filePath);
  const fileExtension = filePath.split('.').pop().toLowerCase();
  const mimeType = getMimeType(fileExtension);
  return content ? {
    type: mimeType,
    path: filePath,
    data: content,
    filename: filePath.split('/').pop()
  } : null;
}

export async function getRepoData(repoName) {
  console.log(`Getting repo data for: ${repoName}`);
  try {
    const repoData = DreamVaultStructure[repoName];
    if (!repoData) {
      throw new Error(`No data found for repo: ${repoName}`);
    }

    // Fetch metadata
    const metadataPath = `/DreamVault/${repoName}/.pl`;
    console.log(`Fetching metadata from: ${metadataPath}`);
    const metadataContent = await fetchFileContent(metadataPath);
    const metadata = metadataContent ? { content: metadataContent } : {};
    console.log(`Metadata fetched:`, metadata);

    // Fetch DreamTalk media
    console.log(`Fetching DreamTalk media from: ${repoData.DreamTalk}`);
    const dreamTalkMedia = await fetchMediaFile(repoData.DreamTalk);
    console.log(`DreamTalk media fetched:`, dreamTalkMedia ? 'Success' : 'Failed');

    // Fetch DreamSong canvas
    const dreamSongCanvasPath = repoData.DreamSong;
    const canvasContent = await fetchFileContent(dreamSongCanvasPath);
    let dreamSongCanvas = null;
    if (canvasContent) {
      try {
        const decodedContent = atob(canvasContent.split(',')[1]);
        console.log('Decoded DreamSong canvas content:', decodedContent.substring(0, 100) + '...');
        dreamSongCanvas = JSON.parse(decodedContent);
      } catch (error) {
        console.error('Error parsing DreamSong canvas:', error);
        console.log('Raw canvas content:', canvasContent);
      }
    }

    // Fetch DreamSong media
    const dreamSongMediaPromises = repoData.DreamSongMedia.map(fetchMediaFile);
    const dreamSongMedia = (await Promise.all(dreamSongMediaPromises)).filter(media => media !== null);

    return { 
      metadata, 
      dreamTalkMedia: dreamTalkMedia ? [dreamTalkMedia] : [], 
      dreamSongCanvas, 
      dreamSongMedia 
    };
  } catch (error) {
    console.error('Error getting repo data:', error);
    return { metadata: {}, dreamTalkMedia: [], dreamSongCanvas: null, dreamSongMedia: [] };
  }
}

export async function readDreamSongCanvas(repoName) {
  try {
    const repoData = DreamVaultStructure[repoName];
    if (!repoData) {
      throw new Error(`No data found for repo: ${repoName}`);
    }
    const canvasPath = repoData.DreamSong;
    const canvasContent = await fetchFileContent(canvasPath);
    if (canvasContent) {
      try {
        const decodedContent = atob(canvasContent.split(',')[1]);
        return JSON.parse(decodedContent);
      } catch (error) {
        console.error('Error parsing DreamSong canvas:', error);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading DreamSong canvas:', error);
    return null;
  }
}

export function getRepoNames() {
  return Object.keys(DreamVaultStructure);
}
