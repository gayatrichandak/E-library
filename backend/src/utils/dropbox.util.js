import fs from 'fs';
import { Dropbox } from 'dropbox';

/**
 * Uploads a file to Dropbox.
 * @param {string} accessToken - The Dropbox access token.
 * @param {string} localFilePath - The local file path to upload.
 * @param {string} dropboxPath - The destination path in Dropbox.
 * @returns {Promise<object>} - The response from the Dropbox API.
 */
export async function uploadFile(accessToken, localFilePath, dropboxPath) {
  const dbx = new Dropbox({ accessToken });

  try {
    const fileContents = fs.readFileSync(localFilePath);
    const response = await dbx.filesUpload({
      path: dropboxPath,
      contents: fileContents,
    });
    return response.result;
  } catch (error) {
    console.error('Error uploading file to Dropbox:', error);
    throw error;
  }
}

/**
 * Generates a shared URL for a file in Dropbox.
 * @param {string} accessToken - The Dropbox access token.
 * @param {string} dropboxPath - The file path in Dropbox.
 * @returns {Promise<string>} - The shared URL.
 */
export async function getSharedUrl(accessToken, dropboxPath) {
  const dbx = new Dropbox({ accessToken });

  try {
    const response = await dbx.sharingCreateSharedLinkWithSettings({
      path: dropboxPath,
    });
    return response.result.url;
  } catch (error) {
    console.error('Error creating shared link in Dropbox:', error);
    throw error;
  }
}
